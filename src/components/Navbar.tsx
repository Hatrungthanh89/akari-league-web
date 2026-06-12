import { useState } from 'react';
import { Trophy, Users, Calendar, DollarSign, BookOpen, Newspaper, Menu, X, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang?: string;
  setLang?: (lang: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'standings', label: 'Bảng Xếp Hạng', icon: Trophy },
    { id: 'players', label: 'Cầu Thủ', icon: Users },
    { id: 'results', label: 'Kết Quả', icon: Calendar },
    { id: 'finances', label: 'Tài Chính', icon: DollarSign },
    { id: 'rules', label: 'Luật Lệ', icon: BookOpen },
    { id: 'news', label: 'Bản Tin', icon: Newspaper },
  ];

  return (
    <>
      <nav className="glass-panel sticky top-4 z-40 mx-4 mt-4 px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('standings')}>
          <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">
            <Trophy className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-wider text-white">
            RANDOM<span className="text-indigo-500">LEAGUE</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`nav-link flex items-center gap-2 cursor-pointer ${
                  currentTab === item.id ? 'active' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-2xl text-indigo-400 hover:text-indigo-300 p-1.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-50 flex flex-col items-center justify-center gap-8 text-xl font-medium">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-indigo-400 hover:text-indigo-300 p-2 rounded-full bg-indigo-500/5 border border-indigo-500/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 py-2 px-4 rounded-xl transition-all ${
                    currentTab === item.id
                      ? 'text-indigo-400 bg-indigo-500/10 font-bold px-6 border border-indigo-500/20'
                      : 'text-slate-300 hover:text-indigo-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
