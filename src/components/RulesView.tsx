import React, { useState } from 'react';
import { Rule } from '../types';
import { BookOpen, PlusCircle, Trash2, Edit2, Paperclip, FileText, Image, X } from 'lucide-react';

interface RulesViewProps {
  rules: Rule[];
  onAddRule: (rule: Omit<Rule, 'id'>) => void;
  onUpdateRule: (id: string, updates: Partial<Rule>) => void;
  onDeleteRule: (id: string) => void;
}

export default function RulesView({ rules, onAddRule, onUpdateRule, onDeleteRule }: RulesViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [rTitle, setRTitle] = useState('');
  const [rDetail, setRDetail] = useState('');
  const [rFileData, setRFileData] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setRFileData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setRTitle('');
    setRDetail('');
    setRFileData('');
    setShowModal(true);
  };

  const handleOpenEdit = (rule: Rule) => {
    setEditId(rule.id);
    setRTitle(rule.title);
    setRDetail(rule.detail);
    setRFileData(rule.fileData || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rTitle.trim() || !rDetail.trim()) return;

    if (editId) {
      onUpdateRule(editId, {
        title: rTitle.trim(),
        detail: rDetail.trim(),
        fileData: rFileData,
      });
    } else {
      onAddRule({
        title: rTitle.trim(),
        detail: rDetail.trim(),
        fileData: rFileData,
      });
    }

    setShowModal(false);
  };

  const handleDeleteClick = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa điều luật: "${title}"?`)) {
      onDeleteRule(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Luật Lệ Giải Đấu</h2>
          <p className="text-slate-400 mt-1">Cơ sở luật lệ chính thức, thể phạm thi đấu và nội quy phân nhóm</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 max-w-fit cursor-pointer animate-fade-in-up"
        >
          <PlusCircle className="w-5 h-5 text-slate-900" />
          <span>Thêm Điều Luật</span>
        </button>
      </div>

      {/* Rules ledger list */}
      <div className="space-y-6">
        {rules.length === 0 ? (
          <div className="glass-panel py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-base font-semibold">Chưa thiết lập điều quy luật nào</p>
            <p className="text-sm text-slate-500 mt-1">Khởi tạo quy tắc cho các đội bóng bằng cách nhấn nút "Thêm Điều Luật".</p>
          </div>
        ) : (
          rules.map((rule) => {
            const isImage = rule.fileData && rule.fileData.startsWith('data:image');
            const isPdf = rule.fileData && rule.fileData.startsWith('data:application/pdf');

            return (
              <div
                key={rule.id}
                className="glass-panel p-6 relative group border border-slate-900 hover:border-slate-800 transition shadow-md"
              >
                {/* Actions group */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(rule)}
                    className="text-slate-400 hover:text-amber-400 p-1.5 rounded bg-slate-900/60 transition cursor-pointer"
                    title="Sửa luật"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(rule.id, rule.title)}
                    className="text-slate-400 hover:text-red-400 p-1.5 rounded bg-slate-900/60 transition cursor-pointer"
                    title="Xóa luật"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-indigo-400 mb-3 pr-16">
                  {rule.title}
                </h4>
                
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {rule.detail}
                </p>

                {/* File Attachment visualization */}
                {rule.fileData && (
                  <div className="mt-4 pt-4 border-t border-slate-900/50">
                    {isImage ? (
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Image className="w-3.5 h-3.5" /> Hình ảnh biểu đính kèm:
                        </span>
                        <img
                          src={rule.fileData}
                          alt="Đính kèm luật lệ"
                          className="max-h-64 rounded-xl object-contain border border-slate-800 bg-slate-950/20"
                        />
                      </div>
                    ) : isPdf ? (
                      <div className="flex items-center">
                        <a
                          href={rule.fileData}
                          download={`Luat_Quy_Chet_${rule.title.replace(/\s+/g, '_')}.pdf`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-amber-400 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Tải file PDF đính kèm</span>
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <a
                          href={rule.fileData}
                          download={`Dinh_kem_${rule.title.slice(0, 10).replace(/\s+/g, '_')}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-indigo-400 text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span>Tải tài liệu đính kèm</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Write/Edit Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay z-50">
          <div className="modal-content glass-panel w-full max-w-lg p-6 relative border border-slate-800 bg-slate-950/95 animate-fade-in-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              {editId ? 'Sửa Điều Luật' : 'Thêm Điều Luật Mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Tiêu đề điều luật</label>
                <input
                  type="text"
                  required
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-semibold"
                  placeholder="VD: 4. Điều kiện tính bàn thắng kỹ thuật"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Nội dung chi tiết</label>
                <textarea
                  required
                  rows={5}
                  value={rDetail}
                  onChange={(e) => setRDetail(e.target.value)}
                  className="input-glass w-full py-2 px-3 font-medium"
                  placeholder="Ghi rõ các điều mục quy chuẩn chính thức ở đây..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Tài liệu đính kèm (Hình ảnh / PDF)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/25 file:transition cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Chỉ đính kèm tệp cấu trúc dung lượng vừa và nhỏ (&lt; 2MB) để tối ưu lưu trữ.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary w-full cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full cursor-pointer font-bold"
                >
                  {editId ? 'Lưu Thay Đổi' : 'Xác Nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
