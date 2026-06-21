import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  trend?: 'down' | 'up' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'amber' | 'violet';
}

export function MetricCard({ label, value, unit, trend, trendValue, icon, color }: MetricCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-[#0A0A0A] p-6 rounded-[32px] border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/10"
      role="region"
      aria-label={`Metric: ${label} is ${value} ${unit}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn('p-3 rounded-2xl bg-white/5 text-white')}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest',
            trend === 'down' ? 'bg-[#E1FF01]/10 text-[#E1FF01]' : 
            trend === 'up' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-[#8E8E93]'
          )}>
            {trend === 'down' ? <TrendingDown size={12} strokeWidth={3} /> : 
             trend === 'up' ? <TrendingUp size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}
            {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tighter text-white italic uppercase">{value}</span>
          <span className="text-[#8E8E93] font-black text-[10px] uppercase tracking-widest">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}
