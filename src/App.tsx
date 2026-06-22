import { useState, useEffect } from 'react';
import { Player, Match, Penalty, Finance, Rule, News } from './types';
import {
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_PENALTIES,
  INITIAL_FINANCES,
  INITIAL_RULES,
  INITIAL_NEWS,
  generateLocalMatchReport,
  generateLocalRoundSummary,
  isRoundComplete,
} from './data';
import Navbar from './components/Navbar';
import StandingsView from './components/StandingsView';
import PlayersView from './components/PlayersView';
import ResultsView from './components/ResultsView';
import FinancesView from './components/FinancesView';
import RulesView from './components/RulesView';
import NewsView from './components/NewsView';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch, getDocs } from 'firebase/firestore';

export default function App() {
  const [currentTab, setCurrentTab] = useState('standings');

  // States
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Firestore Listeners
  useEffect(() => {
    try {
      const unsubPlayers = onSnapshot(collection(db, 'players'), (snap) => setPlayers(snap.docs.map(d => d.data() as Player)));
      const unsubMatches = onSnapshot(collection(db, 'matches'), (snap) => setMatches(snap.docs.map(d => d.data() as Match)));
      const unsubPenalties = onSnapshot(collection(db, 'penalties'), (snap) => setPenalties(snap.docs.map(d => d.data() as Penalty)));
      const unsubFinances = onSnapshot(collection(db, 'finances'), (snap) => setFinances(snap.docs.map(d => d.data() as Finance)));
      const unsubRules = onSnapshot(collection(db, 'rules'), (snap) => setRules(snap.docs.map(d => d.data() as Rule)));
      const unsubNews = onSnapshot(collection(db, 'news'), (snap) => {
        const newsData = snap.docs.map(d => d.data() as News);
        setNews(newsData.reverse()); 
      });

      return () => {
        unsubPlayers();
        unsubMatches();
        unsubPenalties();
        unsubFinances();
        unsubRules();
        unsubNews();
      };
    } catch (error) {
      console.error("Firebase Initialization Error:", error);
    }
  }, []);

  // One-time Migration from LocalStorage to Firebase
  const handleMigrateData = async () => {
    if (players.length > 0) {
      alert("Dữ liệu trên Cloud đã có, không thể ghi đè!");
      return;
    }
    
    try {
      const savedPlayers = JSON.parse(localStorage.getItem('rl_players') || JSON.stringify(INITIAL_PLAYERS));
      const savedMatches = JSON.parse(localStorage.getItem('rl_matches') || JSON.stringify(INITIAL_MATCHES));
      const savedPenalties = JSON.parse(localStorage.getItem('rl_penalties') || JSON.stringify(INITIAL_PENALTIES));
      const savedFinances = JSON.parse(localStorage.getItem('rl_finances') || JSON.stringify(INITIAL_FINANCES));
      const savedRules = JSON.parse(localStorage.getItem('rl_rules') || JSON.stringify(INITIAL_RULES));
      const savedNews = JSON.parse(localStorage.getItem('rl_news') || JSON.stringify(INITIAL_NEWS));

      const batch = writeBatch(db);
      
      savedPlayers.forEach((p: Player) => batch.set(doc(db, 'players', p.id), p));
      savedMatches.forEach((m: Match) => batch.set(doc(db, 'matches', m.id), m));
      savedPenalties.forEach((p: Penalty) => batch.set(doc(db, 'penalties', p.id), p));
      savedFinances.forEach((f: Finance) => batch.set(doc(db, 'finances', f.id), f));
      savedRules.forEach((r: Rule) => batch.set(doc(db, 'rules', r.id), r));
      savedNews.forEach((n: News) => batch.set(doc(db, 'news', n.id), n));

      await batch.commit();
      alert("Đồng bộ dữ liệu cục bộ lên Cloud thành công!");
    } catch (e) {
      console.error(e);
      alert("Có lỗi khi đồng bộ dữ liệu!");
    }
  };

  // Players
  const handleAddPlayer = async (newP: Omit<Player, 'id' | 'goals' | 'yellowCards' | 'redCards'>) => {
    const id = `p_${Date.now()}`;
    const freshPlayer: Player = { ...newP, id, goals: 0, yellowCards: 0, redCards: 0 };
    await setDoc(doc(db, 'players', id), freshPlayer);
  };

  const handleUpdatePlayer = async (id: string, updates: Partial<Player>) => {
    await setDoc(doc(db, 'players', id), updates, { merge: true });
  };

  const handleDeletePlayer = async (id: string) => {
    await deleteDoc(doc(db, 'players', id));
  };

  // Matches
  const handleAddMatch = async (matchData: Omit<Match, 'id'>) => {
    const newId = `m_${Date.now()}`;
    const newMatch: Match = { ...matchData, id: newId };

    const batch = writeBatch(db);
    batch.set(doc(db, 'matches', newId), newMatch);

    const updatedPlayers = players.map((p) => {
      const matchEvents = matchData.events.filter((e) => e.playerId === p.id);
      if (matchEvents.length === 0) return p;
      let extraGoals = 0, extraYellows = 0, extraReds = 0;
      matchEvents.forEach((ev) => {
        if (ev.type === 'goal') extraGoals++;
        if (ev.type === 'yellow') extraYellows++;
        if (ev.type === 'red') extraReds++;
      });
      return {
        ...p,
        goals: (p.goals || 0) + extraGoals,
        yellowCards: (p.yellowCards || 0) + extraYellows,
        redCards: (p.redCards || 0) + extraReds,
      };
    });

    updatedPlayers.forEach(p => {
      batch.set(doc(db, 'players', p.id), p);
    });

    const matchReport = generateLocalMatchReport(newMatch, updatedPlayers);
    const deterministicReportId = `news_m_${newId}`;
    matchReport.id = deterministicReportId;
    batch.set(doc(db, 'news', deterministicReportId), matchReport);

    await batch.commit();

    // Call Gemini API in background
    fetch("/api/gemini/generate-match-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match: newMatch, players: updatedPlayers })
    }).then(res => res.json()).then(async (aiReport) => {
      if(aiReport.title) {
        await setDoc(doc(db, 'news', deterministicReportId), {
          title: aiReport.title,
          content: aiReport.content,
          commentator: aiReport.commentator
        }, { merge: true });
      }
    }).catch(console.error);

  };

  const handleDeleteMatch = async (id: string) => {
    const targetMatch = matches.find((m) => m.id === id);
    if (!targetMatch) return;

    const batch = writeBatch(db);
    batch.delete(doc(db, 'matches', id));

    players.forEach((p) => {
      const matchEvents = targetMatch.events.filter((e) => e.playerId === p.id);
      if (matchEvents.length > 0) {
        let minusGoals = 0, minusYellows = 0, minusReds = 0;
        matchEvents.forEach((ev) => {
          if (ev.type === 'goal') minusGoals++;
          if (ev.type === 'yellow') minusYellows++;
          if (ev.type === 'red') minusReds++;
        });
        batch.set(doc(db, 'players', p.id), {
          ...p,
          goals: Math.max(0, (p.goals || 0) - minusGoals),
          yellowCards: Math.max(0, (p.yellowCards || 0) - minusYellows),
          redCards: Math.max(0, (p.redCards || 0) - minusReds),
        });
      }
    });

    const newsToDelete = news.filter((n) => n.id.includes(id));
    newsToDelete.forEach(n => batch.delete(doc(db, 'news', n.id)));

    const updatedMatches = matches.filter((m) => m.id !== id);

    await batch.commit();
  };

  const handleGenerateRoundSummary = async (round: number) => {
    const roundMatches = matches.filter(m => m.round === round);
    if (roundMatches.length === 0) {
      alert("Vòng đấu này chưa có trận nào!");
      return;
    }

    const deterministicSummaryId = `news_r_${round}`;
    
    // First, save the local (non-AI) summary to ensure it exists
    const localSummary = generateLocalRoundSummary(round, matches, players);
    localSummary.id = deterministicSummaryId;
    await setDoc(doc(db, 'news', deterministicSummaryId), localSummary);

    alert("Đang yêu cầu AI phân tích dữ liệu và nhận định Vòng " + round + ". Vui lòng chờ vài giây...");

    // Then call Gemini API to enhance the summary
    fetch("/api/gemini/generate-round-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        round,
        roundMatches,
        players
      })
    }).then(res => res.json()).then(async (aiSummary) => {
      if(aiSummary.title) {
        await setDoc(doc(db, 'news', deterministicSummaryId), {
          title: aiSummary.title,
          comments: aiSummary.comments
        }, { merge: true });
        alert("Thành công! Bản tin AI phân tích Vòng " + round + " đã được xuất bản.");
      }
    }).catch(e => {
      console.error(e);
      alert("Có lỗi khi gọi AI. Bản tin mặc định đã được tạo.");
    });
  };

  // Penalties
  const handleAddPenalty = async (pData: Omit<Penalty, 'id'>) => {
    const id = `pen_${Date.now()}`;
    await setDoc(doc(db, 'penalties', id), { ...pData, id });
  };
  const handleDeletePenalty = async (id: string) => await deleteDoc(doc(db, 'penalties', id));

  // Finances
  const handleAddFinance = async (fData: Omit<Finance, 'id'>) => {
    const id = `f_${Date.now()}`;
    await setDoc(doc(db, 'finances', id), { ...fData, id });
  };
  const handleDeleteFinance = async (id: string) => await deleteDoc(doc(db, 'finances', id));

  // Rules
  const handleAddRule = async (rData: Omit<Rule, 'id'>) => {
    const id = `r_${Date.now()}`;
    await setDoc(doc(db, 'rules', id), { ...rData, id });
  };
  const handleUpdateRule = async (id: string, updates: Partial<Rule>) => {
    await setDoc(doc(db, 'rules', id), updates, { merge: true });
  };
  const handleDeleteRule = async (id: string) => await deleteDoc(doc(db, 'rules', id));

  // News
  const handleDeleteNews = async (id: string) => await deleteDoc(doc(db, 'news', id));

  const renderTabContent = () => {

    switch (currentTab) {
      case 'standings':
        return (
          <>
            {players.length === 0 && (
              <div className="mb-6 bg-blue-900/40 border border-blue-500/50 p-4 rounded-xl text-center">
                <p className="text-blue-200 mb-2">Chưa có dữ liệu trên Cloud (hoặc đang tải).</p>
                <button onClick={handleMigrateData} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow">
                  Bấm vào đây để đồng bộ dữ liệu cũ (từ máy tính) lên Cloud
                </button>
              </div>
            )}
            <StandingsView players={players} matches={matches} penalties={penalties} />
          </>
        );
      case 'players': return <PlayersView players={players} onAddPlayer={handleAddPlayer} onUpdatePlayer={handleUpdatePlayer} onDeletePlayer={handleDeletePlayer} />;
      case 'results': return <ResultsView isAdmin={isAdmin} matches={matches} penalties={penalties} players={players} onAddMatch={handleAddMatch} onDeleteMatch={handleDeleteMatch} onAddPenalty={handleAddPenalty} onDeletePenalty={handleDeletePenalty} onGenerateRoundSummary={handleGenerateRoundSummary} />;
      case 'finances': return <FinancesView isAdmin={isAdmin} finances={finances} onAddFinance={handleAddFinance} onDeleteFinance={handleDeleteFinance} />;
      case 'rules': return <RulesView rules={rules} onAddRule={handleAddRule} onUpdateRule={handleUpdateRule} onDeleteRule={handleDeleteRule} />;
      case 'news': return <NewsView news={news} onDeleteNews={handleDeleteNews} />;
      default: return <StandingsView players={players} matches={matches} penalties={penalties} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 antialiased pb-16">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {renderTabContent()}
      </main>
      <footer className="mt-16 text-center text-slate-400 text-xs border-t border-slate-900 pt-8 max-w-2xl mx-auto px-4">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span>RANDOMLEAGUE © 2026. Giải đấu phong trào thể thao 4.0</span>
        </p>
        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
          Đã tích hợp Cloud Database (Firebase). Dữ liệu đồng bộ Realtime mọi thiết bị.
        </p>
      </footer>
    </div>
  );
}
