import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, MapPin, Search, ChevronRight, User, TrendingUp, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const INDIAN_REGIONS = [
  "National", "Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const JOIN_DATES = [
  "Joined Aug 2023", "Joined Jan 2024", "Joined Mar 2024", "Joined June 2024", 
  "Joined Sep 2024", "Joined Dec 2024", "Joined Feb 2025"
];

const INDIAN_NAMES = [
  "Aarav Sharma", "Ishita Patel", "Arjun Nair", "Ananya Gupta", "Vivaan Reddy",
  "Saanvi Iyer", "Reyansh Choudhury", "Aditi Rao", "Kian Deshmukh", "Zara Khan",
  "Rohan Malhotra", "Diya Varma", "Shaurya Singh", "Myra Joshi", "Kabir Bhat",
  "Anvi Kulkarni", "Advait Menon", "Navya Saxena", "Aaryan Dubey", "Kiara Kapur",
  "Ishan Mishra", "Riya Sen", "Zayan Siddiqui", "Inaya Shah", "Dhruv Agarwal",
  "Shanaya Bajaj", "Ayaan Bose", "Sia Thakur", "Vihaan Chandra", "Kyra Pillai"
];

// Generate 1000 mock entries to ensure good regional distribution
const MOCK_STANDINGS = Array.from({ length: 1000 }, (_, i) => ({
  rank: i + 1,
  name: INDIAN_NAMES[i % INDIAN_NAMES.length],
  xp: Math.floor(25000 - i * (15 + Math.random() * 10)),
  region: INDIAN_REGIONS[Math.floor(Math.random() * (INDIAN_REGIONS.length - 1)) + 1],
  joined: JOIN_DATES[Math.floor(Math.random() * JOIN_DATES.length)],
  isUser: false
}));

export function Standings() {
  const { profile } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState("National");
  const [searchQuery, setSearchQuery] = useState("");

  const isGuest = !profile || profile.displayName === "Guest" || profile.displayName === "Guest Explorer";

  const userStanding = {
    rank: 0, // Placeholder, calculated later
    name: profile?.displayName || "Guest Explorer",
    xp: profile?.xp || 0,
    region: profile?.region || "Delhi",
    joined: "Joined June 2026",
    isUser: true
  };

  const filteredStandings = useMemo(() => {
    let list = [...MOCK_STANDINGS];
    
    // Filter by region first to simulate "Top 100 of that State"
    if (selectedRegion !== "National") {
      list = list.filter(u => u.region === selectedRegion);
    }
    
    // Sort
    list.sort((a, b) => b.xp - a.xp);
    
    // Inject user into the list if they fall within the range or just for demo
    if (!list.find(u => u.isUser)) {
      list.push(userStanding);
      list.sort((a, b) => b.xp - a.xp);
    }
    
    // Re-rank
    const rankedList = list.map((u, i) => ({ ...u, rank: i + 1 }));
    
    // Slice to top 100
    const top100 = rankedList.slice(0, 100);
    
    // Ensure user is always visible in the list for demo purposes if they aren't in top 100
    const userInRanked = rankedList.find(u => u.isUser);
    if (!top100.find(u => u.isUser) && userInRanked) {
      top100.push(userInRanked);
    }

    if (searchQuery) {
      return top100.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return top100;
  }, [selectedRegion, searchQuery, profile, userStanding.xp]);

  return (
    <div className="space-y-10 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-[#8E8E93] font-black text-[10px] mb-6 hover:text-[#E1FF01] transition-colors uppercase tracking-[0.2em] group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-4 h-1 bg-[#E1FF01] rounded-full" />
             <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">Community Registry</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Climate <span className="text-[#E1FF01]">Standings</span>
          </h1>
          <p className="text-[#8E8E93] text-sm font-bold uppercase tracking-widest mt-6 opacity-60">Top eco-warriors leading India's green movement.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8E8E93] group-focus-within:text-[#E1FF01] transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-8 py-4 bg-[#0A0A0A] border border-white/10 rounded-[20px] text-xs font-black uppercase tracking-widest text-white focus:border-[#E1FF01] outline-none w-full sm:w-72 transition-all shadow-2xl"
            />
          </div>
          
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-8 py-4 bg-[#0A0A0A] border border-white/10 rounded-[20px] text-xs font-black text-white uppercase tracking-widest outline-none cursor-pointer focus:border-[#E1FF01] transition-all appearance-none shadow-2xl min-w-[200px]"
          >
            {INDIAN_REGIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="bg-[#0A0A0A] rounded-[48px] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E1FF01]/20 to-transparent" />
        
        <div className="p-10 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#E1FF01] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-[#E1FF01]/10">
              <Trophy size={28} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Community Core</h3>
              <p className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.3em] mt-1">{selectedRegion} Rankings</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
             <div className="text-right">
               <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.3em] mb-1">Total Active Nodes</p>
               <p className="text-xl font-black text-white italic tracking-tighter">52,430</p>
             </div>
             <div className="text-right text-[#E1FF01]">
               <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-1">Impact Velocity</p>
               <p className="text-xl font-black flex items-center justify-end gap-2 italic tracking-tighter"><TrendingUp size={18} strokeWidth={3} /> +12%</p>
             </div>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredStandings.map((user) => (
            <motion.div 
              key={user.isUser ? 'current-user' : user.name + user.rank}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "p-8 flex items-center gap-8 transition-all hover:bg-white/5 group",
                user.isUser ? "bg-[#E1FF01]/5 border-y border-[#E1FF01]/10" : ""
              )}
            >
              <div className={cn(
                "w-14 text-center font-black text-3xl italic tracking-tighter leading-none transition-colors",
                user.rank === 1 ? "text-[#E1FF01]" : 
                user.rank === 2 ? "text-white/60" :
                user.rank === 3 ? "text-white/40" : "text-white/20"
              )}>
                {user.isUser && isGuest ? "G" : user.rank.toString().padStart(2, '0')}
              </div>
              
              <div className="relative">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center text-black font-black text-xl transition-all duration-500",
                  user.rank === 1 ? "bg-[#E1FF01] shadow-lg shadow-[#E1FF01]/20 scale-110" : 
                  user.rank === 2 ? "bg-white/80 grayscale opacity-80" : 
                  user.rank === 3 ? "bg-white/60 grayscale opacity-60" : "bg-white/10 text-[#8E8E93]"
                )}>
                  {user.isUser ? <User size={32} className={user.rank <=3 ? "text-black" : "text-[#E1FF01]"} strokeWidth={3} /> : user.name[0]}
                </div>
                {user.rank <= 3 && (
                  <div className="absolute -top-3 -right-3 bg-black rounded-full p-2 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                    <Trophy size={14} className={cn(
                      user.rank === 1 ? "text-[#E1FF01]" : "text-white"
                    )} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h4 className={cn(
                    "text-xl font-black tracking-tighter truncate uppercase italic leading-none",
                    user.isUser ? "text-[#E1FF01]" : "text-white"
                  )}>
                    {user.name}
                  </h4>
                  {user.isUser && (
                    <div className="flex items-center gap-1 bg-[#E1FF01]/20 px-3 py-1 rounded-full border border-[#E1FF01]/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#E1FF01] animate-pulse" />
                       <span className="text-[9px] font-black text-[#E1FF01] uppercase tracking-[0.2em]">Live Node</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mt-3 opacity-60">
                  <span className="flex items-center gap-1.5"><MapPin size={12} strokeWidth={3} /> {user.region}</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  <span>{user.joined}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl font-black text-white tracking-tighter italic">{user.xp.toLocaleString()} <span className="text-[10px] opacity-20 uppercase not-italic tracking-widest ml-1">XP</span></div>
                <div className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.3em] mt-1 group-hover:translate-x-1 transition-transform">Status Alpha Node</div>
              </div>

              <div className="hidden sm:flex items-center justify-center w-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <ChevronRight size={24} className="text-[#E1FF01]" strokeWidth={3} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
