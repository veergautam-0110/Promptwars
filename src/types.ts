export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  points?: number;
  level?: number;
  streak?: number;
  xp: number;
  region: string;
  totalSavedCO2: number;
}

export type FootprintCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'waste' | 'water';

export interface Metric {
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'amber' | 'violet' | 'rose';
}

export interface Recommendation {
  id: number;
  title: string;
  text: string;
  impact: string;
  color: string;
  icon: React.ReactNode;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
}
