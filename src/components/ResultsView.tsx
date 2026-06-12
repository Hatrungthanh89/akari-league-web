import React, { useState, useEffect } from 'react';
import { Match, Penalty, Player, MatchEvent, EventType } from '../types';
import { TEAMS } from '../data';
import { PlusCircle, Target, Trash2, Calendar, ShieldAlert, Award, X, AlertOctagon } from 'lucide-react';

interface ResultsViewProps {
  matches: Match[];
  penalties: Penalty[];
  players: Player[];
  onAddMatch: (match: Omit<Match, 'id'>) => void;
  onDeleteMatch: (id: string) => void;
  onAddPenalty: (penalty: Omit<Penalty, 'id'>) => void;
  onDeletePenalty: (id: string) => void;
}

export default function ResultsView({
  matches,
  penalties,
  players,
  onAddMatch,
  onDeleteMatch,
  onAddPenalty,
  onDeletePenalty,
}: ResultsViewProps) {
  // Modal states
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  // Form states - Matches
  const [mRound, setMRound] = useState<number | ''>('');
  const [mTeamA, setMTeamA] = useState('Sodapop');
  const [mTeamB, setMTeamB] = useState('Chiến Lang');
  const [mScoreA, setMScoreA] = useState<number | ''>('');
  const [mScoreB, setMScoreB] = useState<number | ''>('');
  const [mEvents, setMEvents] = useState<MatchEvent[]>([]);

  // Form states - Penalties
  const [pRound, setPRound] = useState<number | ''>('');
  const [pTeamA, setPTeamA] = useState('Sodapop');
  const [pTeamB, setPTeamB] = useState('Chiến Lang');
  const [pScoreA, setPScoreA] = useState<number | ''>('');
  const [pScoreB, setPScoreB] = useState<number | ''>('');

  // Handle Team A same as Team B checks
  useEffect(() => {
    if (mTeamA === mTeamB) {
      const remaining = TEAMS.find((t) => t !== mTeamA) || 'Chiến Lang';
      setMTeamB(remaining);
    }
  }, [mTeamA]);

  useEffect(() => {
    if (pTeamA === pTeamB) {
      const remaining = TEAMS.find((t) => t !== pTeamA) || 'Chiến Lang';
      setPTeamB(remaining);
    }
  }, [pTeamA]);

  // Aggregate results by Round descending
  const roundsData: { [round: number]: { matches: Match[]; penalties: Penalty[] } } = {};

  matches.forEach((m) => {
    if (!roundsData[m.round]) roundsData[m.round] = { matches: [], penalties: [] };
    roundsData[m.round].matches.push(m);
  });

  penalties.forEach((p) => {
    if (!roundsData[p.round]) roundsData[p.round] = { matches: [], penalties: [] };
    roundsData[p.round].penalties.push(p);
  });

  const sortedRoundKeys = Object.keys(roundsData)
    .map(Number)
    .sort((a, b) => b - a);

  // Event handlers
  const handleAddEventRow = () => {
    setMEvents((prev) => [...prev, { team: mTeamA, playerId: '', type: 'goal' }]);
  };

  const handleRemoveEventRow = (idx: number) => {
    setMEvents((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateEventRow = (idx: number, field: keyof MatchEvent, value: string) => {
    setMEvents((prev) =>
      prev.map((item, i) => {
        if (i === idx) {
          const updated = { ...item, [field]: value };
          // If team changed, reset selected player
          if (field === 'team') {
            updated.playerId = '';
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mRound === '' || mScoreA === '' || mScoreB === '') return;
    if (mTeamA === mTeamB) {
      alert('Đội nhà và Đội khách không được trùng nhau!');
      return;
    }

    // Ensure all players are selected for events
    const hasIncompleteEvents = mEvents.some((ev) => !ev.playerId);
    if (hasIncompleteEvents) {
      alert('Vui lòng chọn đầy đủ cầu thủ cho tất cả sự kiện diễn biến trận đấu!');
      return;
    }

    onAddMatch({
      round: Number(mRound),
      teamA: mTeamA,
      teamB: mTeamB,
      scoreA: Number(mScoreA),
      scoreB: Number(mScoreB),
      events: mEvents,
      date: new Date().toISOString().split('T')[0],
    });

    // Reset fields
    setMRound('');
    setMScoreA('');
    setMScoreB('');
    setMEvents([]);
    setShowMatchModal(false);
  };

  const handlePenaltySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pRound === '' || pScoreA === '' || pScoreB === '') return;
    if (pTeamA === pTeamB) {
      alert('Hai đội sút Penalty không được giống nhau!');
      return;
    }

    onAddPenalty({
      round: Number(pRound),
      teamA: pTeamA,
      teamB: pTeamB,
      scoreA: Number(pScoreA),
      scoreB: Number(pScoreB),
    });

    setPRound('');
    setPScoreA('');
    setPScoreB('');
    setShowPenaltyModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Kịch Bản Kết Quả</h2>
          <p className="text-slate-400 mt-1">Ghi nhận tỉ số trận đấu, diễn biến sự kiện trực tiếp và loạt đá tie-break</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowPenaltyModal(true)}
            className="btn-secondary flex items-center gap-2 cursor-pointer bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 border-amber-500/20"
          >
            <Target className="w-5 h-5" />
            <span>Penalty</span>
          </button>
          
          <button
            onClick={() => setShowMatchModal(true)}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-slate-900" />
            <span>Nhập Kết Quả</span>
          </button>
        </div>
      </div>

      {/* Main ledger list grouped by round */}
      <div className="space-y-8">
        {sortedRoundKeys.length === 0 ? (
          <div className="glass-panel py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 text-slate-500">
            <Calendar className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-base font-semibold">Hiện chưa có dữ liệu kết quả thi đấu</p>
            <p className="text-sm text-slate-500 mt-1">Bắt đầu bằng cách bấm nút "Nhập Kết Quả" để điền điểm số vòng đầu tiên.</p>
          </div>
        ) : (
          sortedRoundKeys.map((roundNum) => {
            const data = roundsData[roundNum];
            return (
              <div key={roundNum} className="space-y-4">
                <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                  <h3 className="text-xl font-black text-indigo-400">Vòng đấu {roundNum}</h3>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{data.matches.length} Trận đã đá</span>
                </div>

                {/* Match Cards */}
                <div className="grid gap-4">
                  {data.matches.map((m) => {
                    // Match events filtering to align nicely under scores
                    const goals = m.events
                      .filter((e) => e.type === 'goal')
                      .map((e) => players.find((p) => p.id === e.playerId)?.name)
                      .filter(Boolean);

                    const yellows = m.events
                      .filter((e) => e.type === 'yellow')
                      .map((e) => players.find((p) => p.id === e.playerId)?.name)
                      .filter(Boolean);

                    const reds = m.events
                      .filter((e) => e.type === 'red')
                      .map((e) => players.find((p) => p.id === e.playerId)?.name)
                      .filter(Boolean);

                    return (
                      <div
                        key={m.id}
                        className="glass-panel p-5 relative group flex flex-col border border-slate-900 hover:border-slate-800 transition"
                      >
                        <button
                          onClick={() => {
                            if (confirm('Xóa kết quả trận đấu này? Điểm số BXH và hiệu số các cầu thủ sẽ được tự động đảo lùi hoàn toàn.')) {
                              onDeleteMatch(m.id);
                            }
                          }}
                          className="absolute right-4 top-4 text-slate-500 hover:text-red-400 p-1.5 rounded bg-slate-900/40 transition cursor-pointer opacity-0 group-hover:opacity-100 duration-150"
                          title="Xóa kết quả"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex justify-between items-center w-full max-w-2xl mx-auto py-1">
                          {/* Team A */}
                          <div className="flex-1 text-right font-black text-base md:text-lg text-white pr-4">
                            {m.teamA}
                          </div>
                          
                          {/* Score Display */}
                          <div className="bg-slate-900 px-4 py-2 rounded-xl text-indigo-400 font-extrabold text-xl border border-slate-800 shadow-inner">
                            {m.scoreA} - {m.scoreB}
                          </div>

                          {/* Team B */}
                          <div className="flex-1 text-left font-black text-base md:text-lg text-white pl-4">
                            {m.teamB}
                          </div>
                        </div>

                        {/* Events summary wrapper */}
                        {m.events && m.events.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-slate-400">
                            {goals.length > 0 && (
                              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                                <span>⚽</span>
                                <span>{goals.join(', ')}</span>
                              </div>
                            )}
                            {yellows.length > 0 && (
                              <div className="flex items-center gap-1.5 text-amber-500">
                                <span>🟨</span>
                                <span className="font-semibold">{yellows.join(', ')}</span>
                              </div>
                            )}
                            {reds.length > 0 && (
                              <div className="flex items-center gap-1.5 text-red-500">
                                <span>🟥</span>
                                <span className="font-semibold">{reds.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Penalty shoot-outs ties (Tiebreaker section) */}
                  {data.penalties.map((p) => (
                    <div
                      key={p.id}
                      className="glass-panel p-5 relative group flex flex-col border border-amber-500/20 bg-amber-500/[0.02] hover:bg-amber-500/[0.04] transition"
                    >
                      <button
                        onClick={() => {
                          if (confirm('Xóa kết quả luân lưu Penalty này?')) {
                            onDeletePenalty(p.id);
                          }
                        }}
                        className="absolute right-4 top-4 text-slate-500 hover:text-red-400 p-1.5 rounded bg-slate-900/40 transition cursor-pointer opacity-0 group-hover:opacity-100 duration-150"
                        title="Xóa Penalty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-center text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
                        <Target className="w-3.5 h-3.5" />
                        <span>Loạt luân lưu penalty tie-break</span>
                      </div>

                      <div className="flex justify-between items-center w-full max-w-2xl mx-auto">
                        <div className="flex-1 text-right font-black text-sm md:text-base text-slate-300 pr-4">
                          {p.teamA}
                        </div>
                        
                        <div className="bg-slate-950 px-3.5 py-1.5 rounded-lg text-amber-400 font-extrabold text-base border border-amber-500/20 shadow-inner">
                          {p.scoreA} - {p.scoreB}
                        </div>

                        <div className="flex-1 text-left font-black text-sm md:text-base text-slate-300 pl-4">
                          {p.teamB}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 modal-overlay z-50">
          <div className="modal-content glass-panel w-full max-w-lg p-6 relative border border-slate-800 bg-slate-950/95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowMatchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">Nhập Kết Quả Trận Đấu</h3>

            <form onSubmit={handleMatchSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Vòng đấu</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={mRound}
                  onChange={(e) => setMRound(e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-glass w-full py-2 px-3 font-medium text-center"
                  placeholder="VD: 1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Đội Nhà</label>
                  <select
                    value={mTeamA}
                    onChange={(e) => setMTeamA(e.target.value)}
                    className="input-glass w-full py-2 px-3 cursor-pointer font-semibold"
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center items-center gap-2 sm:mt-5">
                  <input
                    type="number"
                    required
                    min={0}
                    value={mScoreA}
                    onChange={(e) => setMScoreA(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-16 text-center text-xl font-bold text-indigo-400 py-1.5"
                    placeholder="0"
                  />
                  <span className="text-slate-500 text-lg font-bold">-</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={mScoreB}
                    onChange={(e) => setMScoreB(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-16 text-center text-xl font-bold text-indigo-400 py-1.5"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Đội Khách</label>
                  <select
                    value={mTeamB}
                    onChange={(e) => setMTeamB(e.target.value)}
                    className="input-glass w-full py-2 px-3 cursor-pointer font-semibold"
                  >
                    {TEAMS.filter((t) => t !== mTeamA).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Match Events panel */}
              <div className="border-t border-slate-900 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-bold text-sm">Diễn Biến Sự Kiện Bàn Thắng / Thẻ Phạt</h4>
                  <button
                    type="button"
                    onClick={handleAddEventRow}
                    className="btn-primary py-1 px-3 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Thêm Sự Kiện</span>
                  </button>
                </div>

                {mEvents.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Không ghi nhận diễn biến trực tiếp (bổ sung cầu thủ ghi bàn, thẻ vàng, thẻ đỏ hỗ trợ tính Vua Phá Lưới).
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {mEvents.map((ev, idx) => {
                      const eventPlayers = players.filter((p) => p.team === ev.team);
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-900/30 p-2 rounded-lg border border-slate-900">
                          <select
                            value={ev.team}
                            onChange={(e) => handleUpdateEventRow(idx, 'team', e.target.value)}
                            className="input-glass w-full sm:w-28 text-xs py-1"
                          >
                            <option value={mTeamA}>{mTeamA}</option>
                            <option value={mTeamB}>{mTeamB}</option>
                          </select>

                          <select
                            value={ev.playerId}
                            required
                            onChange={(e) => handleUpdateEventRow(idx, 'playerId', e.target.value)}
                            className="input-glass w-full sm:flex-1 text-xs py-1"
                          >
                            <option value="">-- Chọn Cầu Thủ --</option>
                            {eventPlayers.map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.number !== null ? p.number : '-'} {p.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={ev.type}
                            onChange={(e) => handleUpdateEventRow(idx, 'type', e.target.value as EventType)}
                            className="input-glass w-full sm:w-32 text-xs py-1"
                          >
                            <option value="goal">⚽ Ghi bàn</option>
                            <option value="yellow">🟨 Thẻ vàng</option>
                            <option value="red">🟥 Thẻ đỏ</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleRemoveEventRow(idx)}
                            className="text-red-400 hover:text-red-300 text-xs py-1 px-2 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMatchModal(false)}
                  className="btn-secondary w-full cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full cursor-pointer font-bold"
                >
                  Xác Nhận & Sinh Bản Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Penalty Tie-breaker Modal */}
      {showPenaltyModal && (
        <div className="fixed inset-0 modal-overlay z-50">
          <div className="modal-content glass-panel w-full max-w-md p-6 relative border border-slate-800 bg-slate-950/95">
            <button
              onClick={() => setShowPenaltyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-amber-500 w-6 h-6" />
              <span>Nhập Loạt Sút Penalty</span>
            </h3>

            <p className="text-slate-400 text-xs mb-4 leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
              Chỉ bổ sung tỉ số Penalty đá luân lưu trong trường hợp các đội cùng bằng nhau về cả điểm trận lẫn hệ số ở cuối vòng để hoàn chỉnh tiêu chí tie-break xếp thứ hạng vòng.
            </p>

            <form onSubmit={handlePenaltySubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Vòng đấu đá Penalty</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pRound}
                  onChange={(e) => setPRound(e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-glass w-full py-2 px-3 text-center"
                  placeholder="VD: 1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Đội A</label>
                  <select
                    value={pTeamA}
                    onChange={(e) => setPTeamA(e.target.value)}
                    className="input-glass w-full py-2 px-2 text-xs font-semibold cursor-pointer"
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center items-center gap-2 sm:mt-5">
                  <input
                    type="number"
                    required
                    min={0}
                    value={pScoreA}
                    onChange={(e) => setPScoreA(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-14 text-center font-bold text-amber-400 py-1.5 text-base"
                    placeholder="0"
                  />
                  <span className="text-slate-600">-</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={pScoreB}
                    onChange={(e) => setPScoreB(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-14 text-center font-bold text-amber-400 py-1.5 text-base"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Đội B</label>
                  <select
                    value={pTeamB}
                    onChange={(e) => setPTeamB(e.target.value)}
                    className="input-glass w-full py-2 px-2 text-xs font-semibold cursor-pointer"
                  >
                    {TEAMS.filter((t) => t !== pTeamA).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPenaltyModal(false)}
                  className="btn-secondary w-full cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full cursor-pointer !bg-amber-600 hover:!bg-amber-500 font-bold text-slate-950"
                >
                  Lưu Penalty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
