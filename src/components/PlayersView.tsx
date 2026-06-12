import React, { useState } from 'react';
import { Player } from '../types';
import { TEAMS } from '../data';
import { UserPlus, Shield, Zap, RefreshCw, Sparkles, SlidersHorizontal, Trash2, Edit2, User, Trophy, EyeOff } from 'lucide-react';

interface PlayersViewProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id' | 'goals' | 'yellowCards' | 'redCards'>) => void;
  onUpdatePlayer: (id: string, updates: Partial<Player>) => void;
  onDeletePlayer: (id: string) => void;
}

export default function PlayersView({ players, onAddPlayer, onUpdatePlayer, onDeletePlayer }: PlayersViewProps) {
  // Filter states
  const [teamFilter, setTeamFilter] = useState<'all' | string>('all');
  const [positionFilter, setPositionFilter] = useState<'all' | string>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states - Add
  const [addName, setAddName] = useState('');
  const [addNumber, setAddNumber] = useState<number | ''>('');
  const [addTeam, setAddTeam] = useState('Sodapop');
  const [addPosition, setAddPosition] = useState('Tiền vệ');
  const [addIsCaptain, setAddIsCaptain] = useState(false);
  const [addImageBase64, setAddImageBase64] = useState('');

  // Form states - Edit
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState<number | ''>('');
  const [editTeam, setEditTeam] = useState('Sodapop');
  const [editPosition, setEditPosition] = useState('Tiền vệ');
  const [editIsCaptain, setEditIsCaptain] = useState(false);
  const [editImageBase64, setEditImageBase64] = useState('');

  // Sắp xếp: theo đội, rồi theo số áo
  const sortedPlayers = [...players].sort((a, b) => {
    const teamOrder: { [key: string]: number } = { 'Sodapop': 0, 'Chiến Lang': 1, 'Youth Flowers': 2 };
    const aOrder = teamOrder[a.team] !== undefined ? teamOrder[a.team] : 99;
    const bOrder = teamOrder[b.team] !== undefined ? teamOrder[b.team] : 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return (a.number || 99) - (b.number || 99);
  });

  const filteredPlayers = sortedPlayers.filter((p) => {
    const matchesTeam = teamFilter === 'all' || p.team === teamFilter;
    const matchesPos = positionFilter === 'all' || p.position === positionFilter;
    return matchesTeam && matchesPos;
  });

  // Convert File to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (isEdit) {
          setEditImageBase64(reader.result);
        } else {
          setAddImageBase64(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    onAddPlayer({
      name: addName.trim(),
      number: addNumber === '' ? null : Number(addNumber),
      team: addTeam,
      position: addPosition,
      isCaptain: addIsCaptain,
      image: addImageBase64,
    });

    // Reset values
    setAddName('');
    setAddNumber('');
    setAddTeam('Sodapop');
    setAddPosition('Tiền vệ');
    setAddIsCaptain(false);
    setAddImageBase64('');
    setShowAddModal(false);
  };

  const handleEditClick = (p: Player) => {
    setEditId(p.id);
    setEditName(p.name);
    setEditNumber(p.number || '');
    setEditTeam(p.team);
    setEditPosition(p.position || 'Tiền vệ');
    setEditIsCaptain(!!p.isCaptain);
    setEditImageBase64(p.image || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    onUpdatePlayer(editId, {
      name: editName.trim(),
      number: editNumber === '' ? null : Number(editNumber),
      team: editTeam,
      position: editPosition,
      isCaptain: editIsCaptain,
      image: editImageBase64,
    });

    setShowEditModal(false);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa cầu thủ "${name}"?`)) {
      onDeletePlayer(id);
    }
  };

  // Border style helper depending on Team
  const getTeamBorderClass = (team: string) => {
    switch (team) {
      case 'Sodapop':
        return 'border-emerald-500';
      case 'Chiến Lang':
        return 'border-orange-500';
      case 'Youth Flowers':
        return 'border-blue-500';
      default:
        return 'border-slate-500';
    }
  };

  // Text color helper depending on Team
  const getTeamTextClass = (team: string) => {
    switch (team) {
      case 'Sodapop':
        return 'text-emerald-400';
      case 'Chiến Lang':
        return 'text-orange-400';
      case 'Youth Flowers':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  // Position icon helper
  const getPositionIcon = (pos: string) => {
    switch (pos) {
      case 'Thủ môn':
        return <Shield className="w-4 h-4 text-slate-400" />;
      case 'Hậu vệ':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Tiền vệ':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'Tiền đạo':
        return <Zap className="w-4 h-4 text-orange-400" />;
      default:
        return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight"> Danh Sách Cầu Thủ</h2>
          <p className="text-slate-400 mt-1">Quản lý hồ sơ, số áo, vị trí thi đấu và cập nhật bàn thắng, thẻ phạt</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 max-w-fit cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          <span>Thêm Cầu Thủ</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 flex flex-wrap gap-4 items-center justify-between border border-slate-800">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Bộ lọc:</span>
          </div>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="input-glass py-1.5 px-3 min-w-[150px] cursor-pointer"
          >
            <option value="all">Tất cả các đội</option>
            {TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="input-glass py-1.5 px-3 min-w-[150px] cursor-pointer"
          >
            <option value="all">Tất cả vị trí</option>
            <option value="Thủ môn">Thủ môn</option>
            <option value="Hậu vệ">Hậu vệ</option>
            <option value="Tiền vệ">Tiền vệ</option>
            <option value="Tiền đạo">Tiền đạo</option>
          </select>
        </div>

        <span className="text-slate-400 text-sm font-medium bg-slate-900/40 px-3.5 py-1.5 rounded-full border border-slate-800">
          Tổng cộng: <strong className="text-indigo-400 font-extrabold">{filteredPlayers.length}</strong> cầu thủ
        </span>
      </div>

      {/* Roster Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="glass-panel py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 text-slate-500">
          <EyeOff className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-base font-semibold">Không tìm thấy cầu thủ nào</p>
          <p className="text-sm text-slate-500 mt-1">Độ lọc đội bóng hoặc vị trí đang chọn không có thành viên tương ứng.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((p) => {
            const teamBorder = getTeamBorderClass(p.team);
            const teamText = getTeamTextClass(p.team);

            return (
              <div
                key={p.id}
                className="glass-panel p-5 flex flex-col items-center text-center relative group hover:scale-[1.02] transition-all duration-300 border border-slate-800 hover:border-slate-700"
              >
                {/* Actions (visible on hover) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="text-slate-400 hover:text-amber-400 p-1.5 rounded bg-slate-900/60 transition cursor-pointer"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p.id, p.name)}
                    className="text-slate-400 hover:text-red-400 p-1.5 rounded bg-slate-900/60 transition cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Jersey Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/80 text-slate-300 text-xs font-black w-8 h-8 rounded-full flex items-center justify-center border border-slate-800 shadow">
                  #{p.number !== null ? p.number : '-'}
                </div>

                {/* Photo Roster */}
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`w-24 h-24 rounded-full object-cover border-2 ${teamBorder} shadow-lg`}
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full bg-slate-900 border-2 ${teamBorder} flex items-center justify-center text-slate-500 shadow-inner`}>
                    <User className="w-12 h-12 text-slate-700" />
                  </div>
                )}

                {/* Roster detail mapping */}
                <h4 className="text-lg font-extrabold text-white mt-4 flex items-center justify-center gap-1.5">
                  <span>{p.name}</span>
                  {p.isCaptain && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm" title="Đội trưởng">C</span>
                  )}
                </h4>

                <p className={`text-sm font-semibold mt-1 ${teamText}`}>{p.team}</p>

                <div className="text-slate-400 mt-2 text-xs flex items-center gap-1.5 bg-slate-900/20 px-3 py-1 rounded-full border border-slate-900/80">
                  {getPositionIcon(p.position)}
                  <span>{p.position || 'Chưa định nghĩa'}</span>
                </div>

                {/* Player stats indicators */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/80 w-full justify-items-center text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm" title="Bàn thắng">⚽</span>
                    <span className="text-base font-bold text-white mt-1">{p.goals || 0}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm" title="Thẻ vàng">🟨</span>
                    <span className="text-base font-bold text-amber-400 mt-1">{p.yellowCards || 0}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm" title="Thẻ đỏ">🟥</span>
                    <span className="text-base font-bold text-red-500 mt-1">{p.redCards || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay z-50">
          <div className="modal-content glass-panel w-full max-w-md p-6 relative border border-slate-800 bg-slate-950/95">
            <h3 className="text-2xl font-bold text-white mb-6">Thêm Cầu Thủ Mới</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Tên cầu thủ</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="input-glass w-full py-2 px-3 font-medium"
                    placeholder="VD: Tuấn Anh"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Số áo</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={addNumber}
                    onChange={(e) => setAddNumber(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-full py-2 px-3 font-medium text-center"
                    placeholder="Số"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Đội bóng</label>
                <select
                  value={addTeam}
                  onChange={(e) => setAddTeam(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-medium cursor-pointer"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Vị trí thi đấu</label>
                <select
                  value={addPosition}
                  onChange={(e) => setAddPosition(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-medium cursor-pointer"
                >
                  <option value="Thủ môn">Thủ môn</option>
                  <option value="Hậu vệ">Hậu vệ</option>
                  <option value="Tiền vệ">Tiền vệ</option>
                  <option value="Tiền đạo">Tiền đạo</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                <input
                  type="checkbox"
                  id="p-captain"
                  checked={addIsCaptain}
                  onChange={(e) => setAddIsCaptain(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="p-captain" className="text-sm text-slate-300 font-medium cursor-pointer select-none">
                  Đặt làm đội trưởng (Captain)
                </label>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, false)}
                  className="text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/25 file:transition cursor-pointer"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary w-full cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Player Modal */}
      {showEditModal && (
        <div className="fixed inset-0 modal-overlay z-50">
          <div className="modal-content glass-panel w-full max-w-md p-6 relative border border-slate-800 bg-slate-950/95">
            <h3 className="text-2xl font-bold text-white mb-6">Sửa Cầu Thủ</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Tên cầu thủ</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input-glass w-full py-2 px-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Số áo</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-full py-2 px-3 font-medium text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Đội bóng (Chuyển nhượng)</label>
                <select
                  value={editTeam}
                  onChange={(e) => setEditTeam(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-medium cursor-pointer"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Vị trí thi đấu</label>
                <select
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-medium cursor-pointer"
                >
                  <option value="Thủ môn">Thủ môn</option>
                  <option value="Hậu vệ">Hậu vệ</option>
                  <option value="Tiền vệ">Tiền vệ</option>
                  <option value="Tiền đạo">Tiền đạo</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                <input
                  type="checkbox"
                  id="e-captain"
                  checked={editIsCaptain}
                  onChange={(e) => setEditIsCaptain(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="e-captain" className="text-sm text-slate-300 font-medium cursor-pointer select-none">
                  Đặt làm đội trưởng (Captain)
                </label>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Thay ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  className="text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/25 file:transition cursor-pointer"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary w-full cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full cursor-pointer !bg-amber-600 hover:!bg-amber-500 text-slate-950 font-bold"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
