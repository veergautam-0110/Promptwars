import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Footprints, Leaf, Zap, Car, Flame, TrendingUp, Trophy, Map as MapIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const MOCK_DATA_BY_RANGE: Record<string, { name: string; value: number }[]> = {
  'Last 7 Days': [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 61 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 42 },
    { name: 'Sun', value: 38 },
  ],
  'Last 30 Days': [
    { name: 'Week 1', value: 320 },
    { name: 'Week 2', value: 280 },
    { name: 'Week 3', value: 350 },
    { name: 'Week 4', value: 310 },
  ],
  'Last 3 Months': [
    { name: 'Month 1', value: 1200 },
    { name: 'Month 2', value: 1100 },
    { name: 'Month 3', value: 1350 },
  ],
  'Last 6 Months': [
    { name: 'Month 1', value: 1400 },
    { name: 'Month 2', value: 1200 },
    { name: 'Month 3', value: 1100 },
    { name: 'Month 4', value: 1500 },
    { name: 'Month 5', value: 1300 },
    { name: 'Month 6', value: 1450 },
  ],
  'Last 12 Months': [
    { name: 'Q1', value: 4500 },
    { name: 'Q2', value: 4200 },
    { name: 'Q3', value: 4800 },
    { name: 'Q4', value: 4100 },
  ],
};

const RECOMMENDATIONS = [
  {
    id: 1,
    title: "Switch to LED",
    text: "Replace 3 incandescent bulbs with LEDs to save 45kg CO2e per year.",
    impact: "45kg CO2e",
    color: "bg-blue-600",
    icon: <Zap size={20} />
  },
  {
    id: 2,
    title: "Eco-Commute",
    text: "Cycle to work twice a week to offset 120kg CO2e this month.",
    impact: "120kg CO2e",
    color: "bg-emerald-600",
    icon: <Car size={20} />
  },
  {
    id: 3,
    title: "Diet Shift",
    text: "Go meatless for 3 days a week and reduce footprint by 82kg CO2e.",
    impact: "82kg CO2e",
    color: "bg-amber-600",
    icon: <Flame size={20} />
  }
];

export function Dashboard() {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [activeRecIdx, setActiveRecIdx] = useState(0);
  const [acceptedRecs, setAcceptedRecs] = useState<number[]>([]);

  const handleAcceptChallenge = (id: number) => {
    if (!acceptedRecs.includes(id)) {
      setAcceptedRecs([...acceptedRecs, id]);
    }
  };

  const nextRecommendation = () => {
    setActiveRecIdx((prev) => (prev + 1) % RECOMMENDATIONS.length);
  };

  const isGuest = !profile || profile.displayName === "Guest" || profile.displayName === "Guest Explorer";

  return (
    <main className="space-y-10 pb-24 md:pb-8" aria-label="Climora Dashboard">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-4 h-1 bg-[#E1FF01] rounded-full" />
             <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">Green India Tracker</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
            Greeting, <span className="text-[#E1FF01]">{profile?.displayName?.split(' ')[0] || "Guest"}</span>
          </h2>
          <p className="text-[#8E8E93] mt-4 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">
             Ecosphere Neural Link: Optimal Status
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-4 bg-[#0A0A0A] border border-white/10 px-6 py-4 rounded-[32px] shadow-2xl hover:border-[#E1FF01]/30 transition-all group" aria-label="Carbon saved status">
             <div className="w-12 h-12 rounded-full bg-[#E1FF01] flex items-center justify-center text-black shadow-lg shadow-[#E1FF01]/20 group-hover:scale-110 transition-transform">
               <Leaf size={24} strokeWidth={3} />
             </div>
             <div className="flex flex-col">
               <span className="text-2xl font-black text-white italic leading-tight tracking-tighter">85.4 KG <span className="text-[#E1FF01]">SAVED</span></span>
               <span className="text-[8px] font-black text-[#8E8E93] uppercase tracking-widest mt-1">Total Savings by community near you</span>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label={isGuest ? "Monthly Benchmark" : "Total Footprint"} 
          value={isGuest ? "480" : "420"} 
          unit="kg CO₂e" 
          trend="down" 
          icon={<Footprints size={22} />} 
          color="blue"
        />
        <MetricCard 
          label={isGuest ? "Potential Savings" : "Carbon Saved"} 
          value={isGuest ? "120" : "85.4"} 
          unit="kg CO₂e" 
          trend="up" 
          icon={<Leaf size={22} />} 
          color="emerald"
        />
        <MetricCard 
          label={isGuest ? "Regional Rank" : "Energy Efficiency"} 
          value={isGuest ? "N/A" : "A+"} 
          unit={isGuest ? "Join to Rank" : "Rating"} 
          trend="stable" 
          icon={<Zap size={22} />} 
          color="amber"
        />
        <MetricCard 
          label={isGuest ? "Eco Potential" : "Sustainable Miles"} 
          value={isGuest ? "2.4k" : "124"} 
          unit={isGuest ? "km / yr" : "km"} 
          trend="up" 
          icon={<Car size={22} />} 
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-8 bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-2xl flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.3em] mb-2">Net Footprint Trends</p>
              <h3 className="text-4xl font-black tracking-tighter text-white uppercase italic">Impact Over Time</h3>
            </div>
            <div className="relative">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-black border-2 border-[#E1FF01]/20 text-[11px] font-black uppercase tracking-widest rounded-full pl-6 pr-10 py-3 text-[#E1FF01] outline-none cursor-pointer hover:border-[#E1FF01] transition-all appearance-none shadow-[0_0_20px_rgba(225,255,1,0.05)]"
              >
                <option value="Last 7 Days" className="bg-black text-white">Last 7 Days</option>
                <option value="Last 30 Days" className="bg-black text-white">Last 30 Days</option>
                <option value="Last 3 Months" className="bg-black text-white">Last 3 Months</option>
                <option value="Last 6 Months" className="bg-black text-white">Last 6 Months</option>
                <option value="Last 12 Months" className="bg-black text-white">Last 12 Months</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#E1FF01]">
                <TrendingUp size={12} />
              </div>
            </div>
          </div>
          
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA_BY_RANGE[timeRange]}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1FF01" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E1FF01" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C1C1E" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8E8E93', fontSize: 10, fontWeight: 900 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8E8E93', fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                    padding: '16px',
                    backgroundColor: '#000',
                    color: '#FFF'
                  }}
                  itemStyle={{ color: '#E1FF01', fontWeight: 900 }}
                  labelStyle={{ color: '#8E8E93', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#E1FF01" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 border-t border-white/5 pt-8">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest mb-2">Transportation</p>
              <p className="text-3xl font-black text-white italic">4.8 <span className="text-[12px] opacity-40">KG</span></p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest mb-2">Food & Diet</p>
              <p className="text-3xl font-black text-white italic">6.2 <span className="text-[12px] opacity-40">KG</span></p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest mb-2">Home Energy</p>
              <p className="text-3xl font-black text-white italic">3.2 <span className="text-[12px] opacity-40">KG</span></p>
            </div>
          </div>
        </div>

        {/* Challenge/Rec Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`bg-[#E1FF01] text-black p-8 rounded-[40px] shadow-2xl relative overflow-hidden group transition-all duration-500`}>
            <div className="relative z-10 min-h-[220px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center">
                    {RECOMMENDATIONS[activeRecIdx].icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Protocol Entry</span>
                </div>
                <button 
                  onClick={nextRecommendation}
                  className="text-[10px] font-black uppercase tracking-[0.2em] bg-black/10 px-3 py-1 rounded-full hover:bg-black/20 transition-all"
                >
                  Next
                </button>
              </div>
              <div className="flex-1">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">{RECOMMENDATIONS[activeRecIdx].title}</h4>
                <p className="text-2xl font-black leading-[1.1] mb-8 uppercase tracking-tighter italic">
                  "{RECOMMENDATIONS[activeRecIdx].text}"
                </p>
              </div>
              <button 
                onClick={() => handleAcceptChallenge(RECOMMENDATIONS[activeRecIdx].id)}
                disabled={acceptedRecs.includes(RECOMMENDATIONS[activeRecIdx].id)}
                className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  acceptedRecs.includes(RECOMMENDATIONS[activeRecIdx].id)
                    ? 'bg-black/10 text-black border border-black/10'
                    : 'bg-black text-[#E1FF01] shadow-2xl shadow-black/20'
                }`}
              >
                {acceptedRecs.includes(RECOMMENDATIONS[activeRecIdx].id) ? (
                  <>
                    <TrendingUp size={16} strokeWidth={3} />
                    Active Protocol
                  </>
                ) : (
                  'Initiate Challenge'
                )}
              </button>
              <div className="flex justify-center gap-1.5 mt-6">
                {RECOMMENDATIONS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === activeRecIdx ? 'w-6 bg-black' : 'w-1.5 bg-black/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-xl">
             <h4 className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.4em] mb-8">System Milestones</h4>
             {isGuest ? (
               <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#8E8E93] mb-6">
                   <Trophy size={32} />
                 </div>
                 <p className="text-sm font-black text-white uppercase tracking-widest opacity-60">Locked Protocol</p>
                 <p className="text-[10px] text-[#8E8E93] mt-4 leading-relaxed font-bold uppercase">Authenticate to unlock regional leaderboards.</p>
               </div>
             ) : (
               <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Efficiency Wave</p>
                      <span className="text-[11px] font-bold text-[#E1FF01]">57%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#E1FF01] h-full w-[57%] rounded-full shadow-lg shadow-[#E1FF01]/20"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Public Transit</p>
                      <span className="text-[11px] font-bold text-[#E1FF01]">80%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#E1FF01] h-full w-[80%] rounded-full shadow-lg shadow-[#E1FF01]/20"></div>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>


      </div>
    </main>
  );
}
