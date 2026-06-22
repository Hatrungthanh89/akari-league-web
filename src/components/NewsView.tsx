import { News } from '../types';
import { Newspaper, Trash2, Mic, Clock, Quote, Sparkles, MessageSquareCode, Star, TrendingUp } from 'lucide-react';

interface NewsViewProps {
  news: News[];
  onDeleteNews: (id: string) => void;
}

export default function NewsView({ news, onDeleteNews }: NewsViewProps) {
  // Sắp xếp: theo vòng đấu giảm dần, round summary lên trước các trận cùng vòng, mới nhất lên trước
  const sortedNews = [...news].sort((a, b) => {
    const roundA = a.round || 0;
    const roundB = b.round || 0;
    if (roundA !== roundB) return roundB - roundA;
    
    // Nếu cùng vòng, ưu tiên hiển thị round_summary lên trước
    if (a.type === 'round_summary' && b.type !== 'round_summary') return -1;
    if (b.type === 'round_summary' && a.type !== 'round_summary') return 1;
    
    return b.id.localeCompare(a.id);
  });

  const getAvatarGradient = (color?: string) => {
    switch (color) {
      case '#ef4444':
        return 'linear-gradient(135deg, #ef4444, #b91c1c)';
      case '#3b82f6':
        return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
      case '#a855f7':
        return 'linear-gradient(135deg, #a855f7, #7c3aed)';
      default:
        return 'linear-gradient(135deg, #4f46e5, #6366f1)';
    }
  };

  const getTextColorClass = (color?: string) => {
    switch (color) {
      case '#ef4444':
        return 'text-red-400';
      case '#3b82f6':
        return 'text-blue-400';
      case '#a855f7':
        return 'text-purple-400';
      default:
        return 'text-indigo-400';
    }
  };

  const getBorderColorClass = (color?: string) => {
    switch (color) {
      case '#ef4444':
        return 'border-red-500/20';
      case '#3b82f6':
        return 'border-blue-500/20';
      case '#a855f7':
        return 'border-purple-500/20';
      default:
        return 'border-indigo-500/20';
    }
  };

  const getBgGradientClass = (color?: string) => {
    switch (color) {
      case '#ef4444':
        return 'from-red-500/[0.04] to-transparent';
      case '#3b82f6':
        return 'from-blue-500/[0.04] to-transparent';
      case '#a855f7':
        return 'from-purple-500/[0.04] to-transparent';
      default:
        return 'from-indigo-500/[0.04] to-transparent';
    }
  };

  const getStyleEmoji = (style?: string) => {
    switch (style) {
      case 'passionate':
        return '🔥';
      case 'analytical':
        return '📊';
      case 'poetic':
        return '✨';
      default:
        return '💬';
    }
  };

  const getStyleLabel = (style?: string) => {
    switch (style) {
      case 'passionate':
        return 'Sôi Động';
      case 'analytical':
        return 'Phân Tích';
      case 'poetic':
        return 'Bay Bổng';
      default:
        return 'Bình luận';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Bản Tin RandomLeague
        </h2>
        <p className="text-slate-400 mt-2">Đánh giá sắc sảo, chiến thuật đỉnh cao, tản mạn thơ ca từ các chuyên gia bình luận nổi tiếng</p>

        {/* Commentators Showcase Row */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
          <div className="glass-panel p-3 text-center border border-red-500/20 bg-red-500/[0.02]">
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-500/10 border border-red-400" style={{ background: getAvatarGradient('#ef4444') }}>
              H
            </div>
            <div className="text-xs md:text-sm font-bold text-red-400">BLV Quang Huy</div>
            <div className="text-[10px] text-slate-500 mt-0.5">🔥 Nhiệt Huyết</div>
          </div>

          <div className="glass-panel p-3 text-center border border-blue-500/20 bg-blue-500/[0.02]">
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/10 border border-blue-400" style={{ background: getAvatarGradient('#3b82f6') }}>
              T
            </div>
            <div className="text-xs md:text-sm font-bold text-blue-400">BLV Quang Tùng</div>
            <div className="text-[10px] text-slate-500 mt-0.5">📊 Chiến Thuật</div>
          </div>

          <div className="glass-panel p-3 text-center border border-purple-500/20 bg-purple-500/[0.02]">
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/10 border border-purple-400" style={{ background: getAvatarGradient('#a855f7') }}>
              N
            </div>
            <div className="text-xs md:text-sm font-bold text-purple-400">BLV Anh Ngọc</div>
            <div className="text-[10px] text-slate-500 mt-0.5">✨ Lãng Mạn</div>
          </div>
        </div>
      </div>

      {/* News Feed List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {sortedNews.length === 0 ? (
          <div className="glass-panel py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 text-slate-500">
            <Newspaper className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-base font-semibold">Bảng tin điện tử hiện đang trống</p>
            <p className="text-sm text-slate-500 mt-1">
              Hãy nhập kết quả thi đấu hoàn bị – hệ thống sẽ kích hoạt bình luận tự động tức thời.
            </p>
          </div>
        ) : (
          sortedNews.map((item) => {
            // Check if it is overall round summary
            if (item.type === 'round_summary') {
              return (
                <div
                  key={item.id}
                  className="glass-panel overflow-hidden border border-indigo-500/20 bg-slate-950/20 shadow-lg animate-fade-in-up"
                >
                  {/* Header summary component */}
                  <div className="bg-gradient-to-r from-indigo-600/25 via-indigo-500/5 to-transparent px-6 py-4.5 border-b border-indigo-500/10 flex justify-between items-center relative">
                    <div className="absolute right-6 top-1.5 text-indigo-500/[0.03] text-6xl pointer-events-none select-none">
                      <Mic className="w-16 h-16" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] tracking-wider font-extrabold uppercase bg-indigo-500/25 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/25">
                          📋 Tổng hợp vòng
                        </span>
                        <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.date}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-white">{item.title}</h3>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn xóa bản tin tổng hợp này?')) {
                          onDeleteNews(item.id);
                        }
                      }}
                      className="text-slate-500 hover:text-red-400 p-2 rounded hover:bg-slate-900/60 transition cursor-pointer z-10"
                      title="Xóa bản tin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Commentators panels mapping */}
                  <div className="p-4 md:p-6 space-y-5">
                    {item.comments?.map((c, cidx) => {
                      const textCol = getTextColorClass(c.color);
                      const bgGrad = getBgGradientClass(c.color);

                      return (
                        <div
                          key={cidx}
                          className="rounded-xl p-4.5 bg-gradient-to-r border-l-[3.5px]"
                          style={{
                            borderLeftColor: c.color,
                            backgroundImage: `linear-gradient(to right, ${c.color}05, transparent)`
                          }}
                        >
                          {/* Comm individual header */}
                          <div className="flex items-center gap-3.5 mb-3.5">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow border border-slate-800"
                              style={{ background: getAvatarGradient(c.color) }}
                            >
                              {c.avatar}
                            </div>
                            <div>
                              <div className="font-extrabold text-white text-sm flex items-center gap-2.5">
                                <span>{c.name}</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border bg-slate-950/60 ${textCol}`} style={{ borderColor: `${c.color}20` }}>
                                  {getStyleEmoji(c.style)} {getStyleLabel(c.style)}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium tracking-wide">{c.role}</div>
                            </div>
                          </div>

                          <p className="text-slate-300 text-sm md:text-base leading-relaxed pl-1 whitespace-pre-wrap">
                            "{c.comment}"
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Standout Player & Next Round Prediction */}
                  {(item.standoutPlayer || item.nextRoundPrediction) && (
                    <div className="px-4 md:px-6 pb-6 pt-0 space-y-4">
                      {item.standoutPlayer && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4.5 relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 text-amber-500/10 group-hover:text-amber-500/20 transition-colors duration-500">
                            <Star className="w-24 h-24" fill="currentColor" />
                          </div>
                          <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <h4 className="font-black text-amber-400 tracking-wide uppercase text-sm">Ngôi Sao Vòng Đấu</h4>
                          </div>
                          <div className="relative z-10">
                            <div className="font-extrabold text-white text-lg">{item.standoutPlayer.name} <span className="text-sm font-semibold text-amber-200/60 ml-1">({item.standoutPlayer.team})</span></div>
                            <p className="text-amber-100/80 text-sm mt-2 leading-relaxed italic border-l-2 border-amber-500/40 pl-3">
                              "{item.standoutPlayer.article}"
                            </p>
                          </div>
                        </div>
                      )}

                      {item.nextRoundPrediction && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4.5 relative overflow-hidden">
                          <div className="flex items-center gap-2 mb-2 relative z-10">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h4 className="font-black text-emerald-400 tracking-wide uppercase text-sm">Góc Dự Đoán Vòng Tới</h4>
                          </div>
                          <p className="text-emerald-50 text-sm leading-relaxed relative z-10">
                            {item.nextRoundPrediction}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            // Otherwise, it is simple match news card
            const comm = item.commentator || { name: 'Bình Luận Viên', color: '#10b981', avatar: '💬', style: 'passionate' };
            const isCColor = comm.color;
            const textCol = getTextColorClass(isCColor);
            const borderCol = getBorderColorClass(isCColor);
            const bgGrad = getBgGradientClass(isCColor);

            return (
              <div
                key={item.id}
                className={`glass-panel p-5 relative group border shadow-md animate-fade-in-up ${borderCol}`}
              >
                {/* Visual decoration soccer ball watermark */}
                <div className="absolute right-6 top-6 text-white/[0.015] text-7xl pointer-events-none select-none">
                  <Quote className="w-16 h-16" />
                </div>

                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.date}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      Highlight Trận đấu
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Xóa bản tin này?')) {
                        onDeleteNews(item.id);
                      }
                    }}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-900/60 transition cursor-pointer opacity-0 group-hover:opacity-100 duration-150"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-lg md:text-xl font-black text-white mb-4 pr-10">{item.title}</h3>

                {/* Commentary body */}
                <div className={`flex gap-4 items-start bg-gradient-to-r ${bgGrad} rounded-xl p-4 border border-slate-900/40`}>
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm border border-slate-800"
                      style={{ background: getAvatarGradient(isCColor) }}
                    >
                      {comm.avatar}
                    </div>
                    <span className={`text-[9px] font-black tracking-wide uppercase ${textCol}`}>{comm.name.split(' ').pop()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase mb-1.5 ${textCol}`}>
                      <span>{getStyleEmoji(comm.style)}</span>
                      <span>{getStyleLabel(comm.style)}</span>
                    </span>
                    
                    <p className="text-slate-300 text-sm leading-relaxed italic pl-0.5">
                      "{item.content}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
