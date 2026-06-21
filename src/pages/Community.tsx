import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Globe, Leaf, Zap, Trash2, Droplets, BookOpen, Warehouse, Heart, Wind, Star, ShieldCheck, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

import { TESTIMONIALS, UPCOMING_CHALLENGES } from '../data/community_content';
import { cn } from '../lib/utils';

const COMMUNITIES = [
  // ... existing communities (I will list them in sorted order)
  { 
    id: 1, 
    name: 'Urban Gardeners', 
    icon: Leaf, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50',
    xp: 500,
    members: '12.4k',
    description: 'Transform balconies and rooftops into lush green havens for pollinators.',
    tag: '#GreenerCities'
  },
  { 
    id: 8, 
    name: 'Water Saviors', 
    icon: Droplets, 
    color: 'text-blue-400', 
    bg: 'bg-blue-50',
    xp: 750,
    members: '11.5k',
    description: 'Innovative rainwater harvesting and laundry water recycling tips.',
    tag: '#EveryDropCounts'
  },
  { 
    id: 6, 
    name: 'Ethical Shoppers', 
    icon: Heart, 
    color: 'text-rose-600', 
    bg: 'bg-rose-50',
    xp: 1000,
    members: '14.2k',
    description: 'Promoting local farmers and slow-fashion ethical alternatives.',
    tag: '#ShopLocal'
  },
  { 
    id: 3, 
    name: 'Zero Waste Club', 
    icon: Trash2, 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-50',
    xp: 1500,
    members: '18.9k',
    description: 'Practical guides to plastic-free living and organic composting.',
    tag: '#CircularEconomy'
  },
  { 
    id: 2, 
    name: 'Solar Pioneers', 
    icon: Zap, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50',
    xp: 2000,
    members: '8.2k',
    description: 'Mastering the transition to renewable energy for every household.',
    tag: '#CleanEnergy'
  },
  { 
    id: 7, 
    name: 'EV Enthusiasts', 
    icon: Wind, 
    color: 'text-cyan-600', 
    bg: 'bg-cyan-50',
    xp: 3000,
    members: '5.8k',
    description: 'Connecting electric vehicle owners to discuss charging and benefits.',
    tag: '#FutureOfMobility'
  },
  { 
    id: 4, 
    name: 'Ocean Cleaners', 
    icon: Droplets, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    xp: 4000,
    members: '6.5k',
    description: 'Join local cleanup drives for beaches, rivers, and urban water bodies.',
    tag: '#SaveOurOceans'
  },
  { 
    id: 5, 
    name: 'Forest Protectors', 
    icon: Globe, 
    color: 'text-emerald-800', 
    bg: 'bg-emerald-100',
    xp: 5000,
    members: '9.1k',
    description: 'Dedicated to reforestation projects and protecting local biodiversity.',
    tag: '#WildIndia'
  },
  { 
    id: 9, 
    name: 'Climate Educators', 
    icon: BookOpen, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50',
    xp: 6000,
    members: '3.4k',
    description: 'Teaching children and communities about practical sustainability.',
    tag: '#GreenEducation'
  },
  { 
    id: 10, 
    name: 'Green Architects', 
    icon: Warehouse, 
    color: 'text-slate-600', 
    bg: 'bg-slate-100',
    xp: 8000,
    members: '2.1k',
    description: 'Focusing on energy-efficient home design and sustainable materials.',
    tag: '#EcoDesign'
  }
];


const ADVANTAGES = [
  { title: 'Expert Access', text: 'Weekly workshops with leading climate scientists and sustainable designers.', icon: Star },
  { title: 'Local Networking', text: 'Connect with change-makers in your specific region for ground actions.', icon: Users },
  { title: 'Exclusive Rewards', text: 'Earn "Nature Credits" redeemable for premium eco-products and discounts.', icon: ShieldCheck },
  { title: 'Verified Impact', text: 'Get official certifications for your contribution to collective goals.', icon: Leaf }
];

export function Community() {
  const { profile } = useAuth();
  const userXp = profile?.xp || 0;
  const [testimonialIdx, setTestimonialIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <Link to="/" className="flex items-center gap-2 text-[#8E8E93] font-black text-[10px] mb-6 hover:text-[#E1FF01] transition-colors uppercase tracking-[0.2em] group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-4 h-1 bg-[#E1FF01] rounded-full" />
             <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">Eco Hubs Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Collective <span className="text-[#E1FF01]">Intelligence</span>
          </h1>
          <p className="text-[#8E8E93] text-sm font-bold uppercase tracking-widest mt-6 opacity-60">Join collective missions based on your expertise. Together, small daily actions create massive global results.</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 text-white px-10 py-6 rounded-[32px] shrink-0 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E1FF01]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.3em] mb-2">Sync Profile Strength</p>
          <p className="text-3xl font-black italic tracking-tighter uppercase">{userXp.toLocaleString()} <span className="text-[#E1FF01] text-xs not-italic tracking-[0.3em]">XP</span></p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-[#0A0A0A] p-10 rounded-[48px] border border-white/5 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#E1FF01]">
              <Globe size={180} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 bg-[#E1FF01]/10 px-3 py-1 rounded-full border border-[#E1FF01]/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#E1FF01] animate-pulse" />
                       <span className="text-[9px] font-black text-[#E1FF01] uppercase tracking-[0.2em]">Active Pulse</span>
                    </div>
                    <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} /> Started June 01, 2026
                    </span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">National Resilience Challenge</h2>
                </div>
                <div className="bg-[#E1FF01] rounded-2xl px-8 py-4 shadow-xl shadow-[#E1FF01]/10 text-center">
                   <p className="text-[9px] font-black text-black uppercase tracking-widest opacity-60">Cycle Protocol Ending In</p>
                   <p className="text-2xl font-black text-black italic tracking-tighter uppercase">09 Days</p>
                </div>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5, ease: 'circOut' }}
                  className="absolute top-0 left-0 h-full bg-[#E1FF01] shadow-[0_0_20px_rgba(225,255,1,0.3)]" 
                />
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[#8E8E93] font-black uppercase text-[10px] tracking-[0.3em] mb-2">Collective Contribution</span>
                  <span className="text-4xl font-black text-white italic tracking-tighter">864,200 <span className="text-sm opacity-40 uppercase not-italic tracking-widest">kg CO₂</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[#8E8E93] font-black uppercase text-[10px] tracking-[0.3em] mb-2">Target Payload</span>
                  <p className="text-2xl font-black text-white uppercase italic tracking-tighter">1.2 Million kg</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-white">
            <h2 className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.4em] mb-6">Upcoming Global Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {UPCOMING_CHALLENGES.map(challenge => (
                <div key={challenge.id} className="bg-[#0A0A0A] p-8 rounded-[32px] border border-white/5 transition-all hover:bg-white/5 group">
                  <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-all group-hover:bg-[#E1FF01] group-hover:text-black", challenge.color)}>
                    <challenge.icon size={22} strokeWidth={3} />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight">{challenge.name}</h4>
                  <p className="text-[9px] font-black text-[#8E8E93] uppercase mt-2 tracking-widest">Protocol Start: {challenge.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COMMUNITIES.map(comm => {
              const isLocked = userXp < comm.xp;
              return (
                <div 
                  key={comm.id} 
                  className={cn(
                    "p-10 rounded-[48px] border transition-all duration-500 flex flex-col justify-between group relative overflow-hidden",
                    isLocked 
                      ? "bg-black/40 border-white/5 grayscale opacity-50 cursor-not-allowed" 
                      : "bg-[#0A0A0A] border-white/5 hover:border-[#E1FF01]/30 hover:shadow-2xl cursor-pointer"
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center transition-all bg-white/5 group-hover:bg-[#E1FF01] group-hover:text-black shadow-xl", comm.color)}>
                        <comm.icon size={32} strokeWidth={3} />
                      </div>
                      <span className="text-[9px] font-black text-[#E1FF01] uppercase tracking-[0.3em]">{comm.tag}</span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-3">{comm.name}</h3>
                    <p className="text-[#8E8E93] font-bold leading-relaxed text-xs uppercase tracking-widest mb-10 opacity-60">{comm.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-2 relative z-10">
                    <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                      <Users size={18} className="text-[#E1FF01]" strokeWidth={3} />
                      {comm.members}
                    </div>
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-white/40 font-black text-[9px] uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <ShieldCheck size={12} /> Sync Link: {comm.xp.toLocaleString()} XP
                      </div>
                    ) : (
                      <button className="text-[#E1FF01] font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform flex items-center gap-2">
                        Initiate Mission <Globe size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-[#0A0A0A] border border-white/10 text-white p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1FF01]/5 rounded-full blur-[60px]" />
            <h2 className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.4em] mb-12">System Exclusive</h2>
            <div className="space-y-10 mb-16">
              {ADVANTAGES.map(adv => (
                <div key={adv.title} className="group cursor-default">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-[#E1FF01] group-hover:border-[#E1FF01] transition-all duration-500">
                      <adv.icon size={20} className="text-white group-hover:text-black transition-colors" strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tighter uppercase italic mb-2">{adv.title}</h4>
                      <p className="text-[#8E8E93] text-[11px] font-bold leading-relaxed uppercase tracking-widest opacity-60">{adv.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h2 className="text-[10px] font-black text-[#E1FF01] uppercase tracking-[0.4em] mb-10 px-2">Global Voices</h2>
            <div className="relative h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={testimonialIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 p-10 bg-white/1 border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden group hover:border-[#E1FF01]/20 transition-all"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MessageCircle size={80} className="text-[#E1FF01]" strokeWidth={3} />
                  </div>
                  <p className="text-white font-black italic tracking-tight leading-relaxed relative z-10 text-xl mb-12 uppercase">
                    "{TESTIMONIALS[testimonialIdx].text}"
                  </p>
                  <div className="flex flex-col gap-8 relative z-10 border-t border-white/5 pt-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[24px] bg-[#E1FF01]/10 flex items-center justify-center text-[#E1FF01] font-black text-2xl border border-[#E1FF01]/10">
                        {TESTIMONIALS[testimonialIdx].name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-[0.3em] italic">{TESTIMONIALS[testimonialIdx].name}</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">{TESTIMONIALS[testimonialIdx].city}</p>
                      </div>
                    </div>
                    <div className="self-start text-[10px] font-black text-black bg-[#E1FF01] uppercase tracking-[0.3em] px-6 py-2.5 rounded-full shadow-lg shadow-[#E1FF01]/10 italic">
                      {TESTIMONIALS[testimonialIdx].hub} Official Member
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === testimonialIdx ? "w-10 bg-[#E1FF01]" : "w-2 bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}