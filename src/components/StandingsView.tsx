import { useState } from 'react';
import { Player, Match, Penalty, TeamStanding, RoundTeamStanding } from '../types';
import { calculateLeagueRankings } from '../data';
import { Trophy, ChevronLeft, ChevronRight, BarChart3, Goal, ShieldAlert, Award } from 'lucide-react';

interface StandingsViewProps {
  players: Player[];
  matches: Match[];
  penalties: Penalty[];
}

export default function StandingsView({ players, matches, penalties }: StandingsViewProps) {
  // Compute rankings
  const { overall, rounds } = calculateLeagueRankings(matches, penalties);
  
  // Available rounds
  const roundKeys = Object.keys(rounds).map(Number).sort((a, b) => b - a); // descending order
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  // Stats calculation
  const totalMatches = matches.length;
  let totalGoals = 0;
  let totalYellows = 0;
  let totalReds = 0;

  matches.forEach(m => {
    totalGoals += m.scoreA + m.scoreB;
    m.events.forEach(ev => {
      if (ev.type === 'yellow') totalYellows++;
      if (ev.type === 'red') totalReds++;
    });
  });

  // Get All Scorers
  const allScorers = [...players]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));

  // Pagination for Scorers
  const SCORERS_PER_PAGE = 5;
  const [scorerPage, setScorerPage] = useState(0);
  const totalScorerPages = Math.ceil(allScorers.length / SCORERS_PER_PAGE);
  const currentScorers = allScorers.slice(scorerPage * SCORERS_PER_PAGE, (scorerPage + 1) * SCORERS_PER_PAGE);

  const activeRound = roundKeys[currentRoundIndex] || null;
  const activeRoundStandings = activeRound ? rounds[activeRound] : [];

  const handlePrevRound = () => {
    if (roundKeys.length <= 1) return;
    setCurrentRoundIndex((prev) => (prev + 1) % roundKeys.length);
  };

  const handleNextRound = () => {
    if (roundKeys.length <= 1) return;
    setCurrentRoundIndex((prev) => (prev - 1 + roundKeys.length) % roundKeys.length);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Bảng Xếp Hạng Tổng
        </h2>
      </div>

      {/* Grid: Main Standings */}
      <div className="glass-panel overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="custom-table w-full text-center">
            <thead>
              <tr className="bg-slate-900/60">
                <th className="w-16 text-center">Hạng</th>
                <th className="text-left">Đội Bóng</th>
                <th className="text-center">Số Vòng Đã Đá</th>
                <th className="text-center">Tổng Hiệu Số (HS)</th>
                <th className="text-center text-indigo-400 font-bold">Điểm Số (Tổng)</th>
              </tr>
            </thead>
            <tbody>
              {overall.map((team, idx) => {
                const isFirst = idx === 0;
                const scoreDiffSign = team.diff > 0 ? `+${team.diff}` : team.diff;

                return (
                  <tr key={team.team} className="transition-colors hover:bg-slate-900/30">
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center">
                        {isFirst ? (
                          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-sm font-bold border border-amber-500/20">
                            <Trophy className="w-4 h-4" />
                            <span>1</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-semibold">{idx + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-left font-bold text-white text-base md:text-lg">
                      {team.team}
                    </td>
                    <td className="py-4 text-slate-300 font-medium">
                      {team.roundsPlayed}
                    </td>
                    <td className={`py-4 font-semibold ${team.diff > 0 ? 'text-indigo-400' : team.diff < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {scoreDiffSign}
                    </td>
                    <td className="py-4 text-indigo-400 text-xl font-black">
                      {team.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Top Scorers & Round results side-by-side */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Top Scorers Card */}
        <div className="glass-panel p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Vua Phá Lưới (Top Ghi Bàn)</span>
            </h3>

            {allScorers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Chưa ghi nhận bàn thắng nào trong giải đấu.
              </div>
            ) : (
              <div className="space-y-4">
                {currentScorers.map((player, idx) => (
                  <div key={player.id} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-slate-500 text-sm w-4">{scorerPage * SCORERS_PER_PAGE + idx + 1}.</div>
                      
                      {player.image ? (
                        <img 
                          src={player.image} 
                          alt={player.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-700" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
                          {player.name.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="text-white font-semibold text-sm md:text-base flex items-center gap-1.5">
                          {player.name}
                          {player.isCaptain && (
                            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1 rounded">C</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{player.team}</div>
                      </div>
                    </div>

                    <div className="text-indigo-400 font-bold flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      <span>{player.goals}</span>
                      <Goal className="w-4 h-4" />
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalScorerPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                    <button
                      onClick={() => setScorerPage(p => Math.max(0, p - 1))}
                      disabled={scorerPage === 0}
                      className="text-slate-400 hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Trang {scorerPage + 1} / {totalScorerPages}
                    </span>
                    <button
                      onClick={() => setScorerPage(p => Math.min(totalScorerPages - 1, p + 1))}
                      disabled={scorerPage === totalScorerPages - 1}
                      className="text-slate-400 hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Round Mini Standings Component */}
        <div className="glass-panel overflow-hidden border border-slate-800 flex flex-col">
          <div className="bg-slate-900/40 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <button 
              onClick={handlePrevRound}
              disabled={roundKeys.length <= 1}
              className="text-slate-400 hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none p-2 rounded-xl bg-slate-800/50 border border-slate-700 transition"
            >
              <ChevronLeft className="w-5 h-5 pointer-events-none" />
            </button>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">
                {activeRound ? `Bảng Kết Quả Vòng ${activeRound}` : 'Bảng Kết Quả Vòng'}
              </h3>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full mt-1.5 inline-block border border-indigo-500/20 font-medium">
                Vòng đấu quyết định (+2, +1, 0đ BXH Tổng)
              </span>
            </div>
            <button 
              onClick={handleNextRound}
              disabled={roundKeys.length <= 1}
              className="text-slate-400 hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none p-2 rounded-xl bg-slate-800/50 border border-slate-700 transition"
            >
              <ChevronRight className="w-5 h-5 pointer-events-none" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="custom-table w-full text-center text-sm">
              <thead>
                <tr className="bg-slate-900/30">
                  <th className="text-left">Đội Bóng</th>
                  <th className="text-center">Trận</th>
                  <th className="text-center">Ghi (GF)</th>
                  <th className="text-center">Thua (GA)</th>
                  <th className="text-center">Hiệu Số</th>
                  <th className="text-center text-indigo-400 font-bold">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {activeRoundStandings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-slate-500 italic">
                      Chưa có kết quả thi đấu cho vòng này. Hãy ghi nhận kết quả tại mục "Kết Quả".
                    </td>
                  </tr>
                ) : (
                  activeRoundStandings.map((t, idx) => {
                    const isRoundFirst = idx === 0;
                    return (
                      <tr key={t.team} className="transition-colors hover:bg-slate-900/20">
                        <td className={`py-3.5 text-left font-bold ${isRoundFirst ? 'text-indigo-400' : 'text-white'}`}>
                          {t.team}
                        </td>
                        <td className="py-3.5 text-slate-300">{t.played}</td>
                        <td className="py-3.5 text-indigo-400">{t.gf}</td>
                        <td className="py-3.5 text-red-400">{t.ga}</td>
                        <td className="py-3.5 text-slate-300">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                        <td className="py-3.5 text-indigo-400 font-bold text-base">{t.matchPts}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Telemetry Stats Panel */}
      <div className="glass-panel p-6 border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>Thống Kê Toàn Giải Đấu</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-xs md:text-sm font-medium">Tổng Số Trận</div>
            <div className="text-2xl md:text-3xl font-black text-white mt-1.5">{totalMatches}</div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-xs md:text-sm font-medium">Tổng Bàn Thắng</div>
            <div className="text-2xl md:text-3xl font-black text-indigo-400 mt-1.5">{totalGoals}</div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-xs md:text-sm font-medium">Tổng Thẻ Vàng</div>
            <div className="text-2xl md:text-3xl font-black text-amber-500 mt-1.5">{totalYellows}</div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-xs md:text-sm font-medium">Tổng Thẻ Đỏ</div>
            <div className="text-2xl md:text-3xl font-black text-red-500 mt-1.5">{totalReds}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
