import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Calculator, Trophy, BookOpen, Leaf, LogOut, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Trophy, label: 'Leaderboard', path: '/standings' },
  { icon: Calculator, label: 'Calculator', path: '/calculator' },
  { icon: BookOpen, label: 'Academy', path: '/academy' },
  { icon: BarChart3, label: 'Community', path: '/community' },
  { icon: MessageSquare, label: 'Eco Coach', path: '/coach' },
];

export function Navbar() {
  const { user } = useAuth();
  const isGuest = localStorage.getItem('eco_guest_mode') === 'true';

  const handleLogout = async () => {
    try {
      localStorage.removeItem('eco_guest_mode');
      await signOut(auth);
      if (!auth.currentUser) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 md:sticky md:top-0 h-auto md:h-screen w-full md:w-64 bg-black border-t md:border-t-0 md:border-r border-white/5 flex flex-col p-4 md:p-6 transition-all duration-300 md:overflow-y-auto overflow-x-hidden scrollbar-hide">
      <div className="hidden md:flex items-center gap-3 mb-10 pl-2">
        <div className="w-9 h-9 bg-[#E1FF01] rounded-xl flex items-center justify-center shadow-lg shadow-[#E1FF01]/20">
          <Leaf size={20} className="text-black" />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-[#E1FF01] uppercase italic">
          Climora
        </h1>
      </div>
      
      <nav className="flex md:flex-col items-center md:items-stretch justify-around md:justify-start gap-1 md:gap-4 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-[#E1FF01] text-black shadow-lg shadow-[#E1FF01]/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110")} />
            <span className="hidden md:block text-[11px] font-black uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:block mt-8">
        {isGuest ? (
          <div className="bg-[#1C1C1E] p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[8px] text-[#E1FF01] uppercase tracking-[0.2em] font-black mb-3">
                <span className="w-1 h-1 rounded-full bg-[#E1FF01] animate-pulse"></span>
                Guest Protocol
              </div>
              <p className="font-black text-xl tracking-tighter mb-1 font-display uppercase italic">Guest Mode</p>
              <p className="text-[10px] text-[#8E8E93] leading-relaxed mb-5 font-bold uppercase tracking-wider">
                Sync your identity to persist progress.
              </p>
              <button 
                onClick={handleLogout}
                className="w-full bg-[#E1FF01] text-black py-3.5 rounded-2xl text-[10px] font-black shadow-lg shadow-[#E1FF01]/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider"
              >
                Link Identity
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#E1FF01] p-5 rounded-[24px] text-black shadow-lg shadow-[#E1FF01]/10">
            <p className="text-[10px] text-black/50 uppercase tracking-widest font-black mb-1">Climora Core</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                <Leaf size={16} />
              </div>
              <p className="font-black text-lg tracking-tighter uppercase italic line-clamp-1">{user?.displayName?.split(' ')[0]}</p>
            </div>
            <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mb-1">
              <div className="bg-black h-full w-[85%] rounded-full"></div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-black/40">Tier 04 Explorer</p>
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-start px-2 border-t border-white/5 pt-6">
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 text-[#8E8E93] hover:text-red-500 transition-all duration-200"
              title="Sign Out"
              aria-label="Sign out of Climora"
            >
              <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-wider">Sign Out</span>
            </button>
        </div>
      </div>
    </aside>
  );
}
