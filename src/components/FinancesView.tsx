import React, { useState } from 'react';
import { Finance } from '../types';
import { DollarSign, PlusCircle, Trash2, Calendar, PiggyBank, TrendingUp, TrendingDown, X, Layers } from 'lucide-react';

interface FinancesViewProps {
  finances: Finance[];
  onAddFinance: (finance: Omit<Finance, 'id'>) => void;
  onDeleteFinance: (id: string) => void;
}

export default function FinancesView({ finances, onAddFinance, onDeleteFinance }: FinancesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [fDate, setFDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [fContent, setFContent] = useState('');
  const [fRevenue, setFRevenue] = useState<number | ''>('');
  const [fExpense, setFExpense] = useState<number | ''>('');

  // Sắp xếp ngày mới nhất lên đầu
  const sortedFinances = [...finances].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Tính toán tổng số
  let totalRevenue = 0;
  let totalExpense = 0;
  finances.forEach((f) => {
    totalRevenue += f.revenue;
    totalExpense += f.expense;
  });
  const balance = totalRevenue - totalExpense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fContent.trim() || fDate === '') return;

    onAddFinance({
      date: fDate,
      content: fContent.trim(),
      revenue: fRevenue === '' ? 0 : Number(fRevenue),
      expense: fExpense === '' ? 0 : Number(fExpense),
    });

    // Reset values
    setFContent('');
    setFRevenue('');
    setFExpense('');
    setFDate(new Date().toISOString().split('T')[0]);
    setShowAddModal(false);
  };

  const handleDeleteClick = (id: string, content: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa giao dịch: "${content}"?`)) {
      onDeleteFinance(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Quản Lý Quỹ Đội</h2>
          <p className="text-slate-400 mt-1">Lập sổ cái theo dõi đóng tiền giải, chi phí sân bãi và mua sắm tiện ích chung</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 max-w-fit cursor-pointer animate-pulse"
        >
          <PlusCircle className="w-5 h-5 text-slate-900" />
          <span>Thêm Giao Dịch</span>
        </button>
      </div>

      {/* Balance Summary banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total balance banner */}
        <div className="glass-panel p-6 bg-gradient-to-br from-indigo-950/40 to-slate-950/40 border border-indigo-500/20 flex items-center gap-4 col-span-1 md:col-span-3">
          <div className="bg-indigo-400/20 p-4 rounded-2xl border border-indigo-500/25 text-indigo-400">
            <PiggyBank className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-semibold tracking-wide uppercase">Số Tồn Quỹ Hiện Tại</h3>
            <div id="total-balance" className="text-3xl md:text-4xl font-black text-indigo-400 mt-1">
              {balance.toLocaleString('vi-VN')} VND
            </div>
          </div>
        </div>

        {/* Total Revenues banner */}
        <div className="glass-panel p-5 bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/15 text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tổng Thu Vào</h4>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">
              +{totalRevenue.toLocaleString('vi-VN')} VND
            </div>
          </div>
        </div>

        {/* Total Expenses banner */}
        <div className="glass-panel p-5 bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/15 text-red-500">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tổng Đã Chi</h4>
            <div className="text-xl font-bold text-red-500 mt-0.5">
              -{totalExpense.toLocaleString('vi-VN')} VND
            </div>
          </div>
        </div>

        {/* Turnover banner */}
        <div className="glass-panel p-5 bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/15 text-blue-500">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tổng Lượng Giao Dịch</h4>
            <div className="text-xl font-bold text-blue-400 mt-0.5">
              {finances.length} phiếu
            </div>
          </div>
        </div>

      </div>

      {/* Detail Table List */}
      <div className="glass-panel overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="custom-table w-full">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="w-32">Ngày</th>
                <th>Nội Dung</th>
                <th className="text-right w-44">Khoản Thu (+)</th>
                <th className="text-right w-44">Khoản Chi (-)</th>
                <th className="text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedFinances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 italic">
                    Chưa đăng ký các giao dịch thu chi nào.
                  </td>
                </tr>
              ) : (
                sortedFinances.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-slate-900/20">
                    <td className="text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{f.date}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-white">
                      {f.content}
                    </td>
                    <td className="text-right text-indigo-400 font-extrabold text-base">
                      {f.revenue > 0 ? `+${f.revenue.toLocaleString('vi-VN')} đ` : '-'}
                    </td>
                    <td className="text-right text-red-400 font-extrabold text-base">
                      {f.expense > 0 ? `-${f.expense.toLocaleString('vi-VN')} đ` : '-'}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDeleteClick(f.id, f.content)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-950 transition cursor-pointer"
                        title="Xóa giao dịch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay z-50">
          <div className="modal-content glass-panel w-full max-w-md p-6 relative border border-slate-800 bg-slate-950/95 animate-fade-in-up">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">Thêm Giao Dịch Mới</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Ngày tháng</label>
                <input
                  type="date"
                  required
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Nội dung</label>
                <input
                  type="text"
                  required
                  value={fContent}
                  onChange={(e) => setFContent(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-medium"
                  placeholder="VD: Thu phí đóng quỹ..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5 text-indigo-400">Tiền Thu (VND)</label>
                  <input
                    type="number"
                    min={0}
                    value={fRevenue}
                    onChange={(e) => setFRevenue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-full py-2 px-3 text-indigo-400 font-bold"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5 text-red-400">Tiền Chi (VND)</label>
                  <input
                    type="number"
                    min={0}
                    value={fExpense}
                    onChange={(e) => setFExpense(e.target.value === '' ? '' : Number(e.target.value))}
                    className="input-glass w-full py-2 px-3 text-red-400 font-bold"
                    placeholder="0"
                  />
                </div>
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
                  className="btn-primary w-full cursor-pointer font-bold"
                >
                  Ghi Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
