import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Car, Utensils, Zap, ShoppingBag, Trash2, Droplets, 
  ArrowRight, ArrowLeft, Sparkles, Trophy, Plus,
  MapPin, Clock, Info, Users
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { FootprintCategory } from '../types';
import { EMISSION_FACTORS, cn } from '../lib/utils';
import { COMMUNITY_ACHIEVEMENTS } from '../data/community';
import ReactMarkdown from 'react-markdown';

interface DiscoveryStep {
  id: string;
  question: string;
  subtext: string;
  type: 'choice' | 'number';
  choices?: { label: string; icon: any; factor: string }[];
  unit?: string;
}

const MISSIONS: Record<FootprintCategory, DiscoveryStep[]> = {
  transport: [
    {
      id: 'mode',
      question: "How did you travel today?",
      subtext: "Choose your primary mode of transit.",
      type: 'choice',
      choices: [
        { label: 'Private Car', icon: Car, factor: 'car_km' },
        { label: 'Public Transit', icon: Clock, factor: 'electricity_kwh' },
        { label: 'Green (Bike/Walk)', icon: Sparkles, factor: 'none' }
      ]
    },
    {
      id: 'value',
      question: "How far was the adventure?",
      subtext: "Approximate distance in kilometers.",
      type: 'number',
      unit: 'km'
    }
  ],
  food: [
    {
      id: 'type',
      question: "What's on the menu?",
      subtext: "Dietary choices have the biggest impact.",
      type: 'choice',
      choices: [
        { label: 'Meat-heavy', icon: Utensils, factor: 'meat_meal' },
        { label: 'Plant-based', icon: Sparkles, factor: 'veg_meal' }
      ]
    },
    {
      id: 'value',
      question: "How many servings?",
      subtext: "Include snacks if they were substantial.",
      type: 'number',
      unit: 'meals'
    }
  ],
  energy: [
    {
      id: 'source',
      question: "What's your power source?",
      subtext: "Green sources significantly lower your footprint.",
      type: 'choice',
      choices: [
        { label: 'Standard Grid', icon: Zap, factor: 'electricity_kwh' },
        { label: 'Solar Mix', icon: Sparkles, factor: 'solar_mix' },
        { label: 'Green Energy', icon: Droplets, factor: 'green' }
      ]
    },
    {
      id: 'value',
      question: "Energy usage today?",
      subtext: "Check your smart meter or average daily usage.",
      type: 'number',
      unit: 'kWh'
    }
  ],
  shopping: [
    {
      id: 'category',
      question: "What did you buy?",
      subtext: "Electronics have the highest production impact.",
      type: 'choice',
      choices: [
        { label: 'Electronics', icon: Zap, factor: 'electronics_item' },
        { label: 'Fashion', icon: ShoppingBag, factor: 'fashion_item' },
        { label: 'Household', icon: Plus, factor: 'household_item' }
      ]
    },
    {
      id: 'value',
      question: "How many items?",
      subtext: "Total count of new items purchased.",
      type: 'number',
      unit: 'items'
    }
  ],
  waste: [
    {
      id: 'type',
      question: "Disposal method?",
      subtext: "Composting and recycling reduce landfill load.",
      type: 'choice',
      choices: [
        { label: 'Mixed Waste', icon: Trash2, factor: 'landfill_kg' },
        { label: 'Recycled', icon: Sparkles, factor: 'recyclable_kg' }
      ]
    },
    {
      id: 'value',
      question: "Waste weight?",
      subtext: "Estimated weight of trash generated.",
      type: 'number',
      unit: 'kg'
    }
  ],
  water: [
    {
      id: 'activity',
      question: "Primary water use?",
      subtext: "Understand where your water goes.",
      type: 'choice',
      choices: [
        { label: 'Personal Care', icon: Droplets, factor: 'water_liter' },
        { label: 'Chores', icon: Clock, factor: 'water_liter' },
        { label: 'Gardening', icon: Sparkles, factor: 'water_liter' }
      ]
    },
    {
      id: 'value',
      question: "Volume used?",
      subtext: "Daily usage including drinking and chores.",
      type: 'number',
      unit: 'liters'
    }
  ]
};

const INDIAN_REGIONS = [
  "Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function Calculator() {
  const { user } = useAuth();
  const [selectedCategory, setCategory] = useState<FootprintCategory | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ co2: number; factor: number } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [city, setCity] = useState("Delhi");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [communityIdx, setCommunityIdx] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCommunityIdx((prev) => (prev + 1) % COMMUNITY_ACHIEVEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'transport', name: 'Transport', icon: Car, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'energy', name: 'Energy', icon: Zap, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-violet-50 text-violet-600 border-violet-100' },
    { id: 'waste', name: 'Waste', icon: Trash2, color: 'bg-slate-50 text-slate-600 border-slate-100' },
    { id: 'water', name: 'Water', icon: Droplets, color: 'bg-sky-50 text-sky-600 border-sky-100' },
  ];

  const currentMission = selectedCategory ? MISSIONS[selectedCategory] : null;
  const step = currentMission ? currentMission[currentStep] : null;

  const handleChoice = (choice: any) => {
    setAnswers(prev => ({ ...prev, [step!.id]: choice }));
    if (currentStep < currentMission!.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finalizeMission({ ...answers, [step!.id]: choice });
    }
  };

  const handleNext = () => {
    if (currentStep < currentMission!.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finalizeMission(answers);
    }
  };

  const finalizeMission = async (finalAnswers: any) => {
    if (!user || !selectedCategory) return;
    setLoading(true);

    const val = parseFloat(finalAnswers.value) || 0;
    let factor = 0.1;
    
    if (selectedCategory === 'transport') {
      if (finalAnswers.mode?.factor === 'none') {
        factor = 0;
      } else {
        factor = finalAnswers.mode?.factor === 'car_km' ? EMISSION_FACTORS.car_km : 0.05;
      }
    } else if (selectedCategory === 'food') {
      factor = finalAnswers.type?.factor === 'meat_meal' ? EMISSION_FACTORS.meat_meal : EMISSION_FACTORS.veg_meal;
    } else if (selectedCategory === 'energy') {
      const sourceFactor = finalAnswers.source?.factor;
      if (sourceFactor === 'green') factor = 0.05;
      else if (sourceFactor === 'solar_mix') factor = 0.2;
      else factor = EMISSION_FACTORS.electricity_kwh;
    } else if (selectedCategory === 'shopping') {
      factor = EMISSION_FACTORS[finalAnswers.category?.factor as string] || 5;
    } else if (selectedCategory === 'waste') {
      factor = EMISSION_FACTORS[finalAnswers.type?.factor as string] || 1;
    } else if (selectedCategory === 'water') {
      factor = EMISSION_FACTORS.water_liter;
    }

    const co2 = val * factor;
    setResultData({ co2, factor });

    try {
      if (localStorage.getItem('eco_guest_mode') !== 'true') {
        await addDoc(collection(db, 'footprints'), {
          userId: user.uid,
          category: selectedCategory,
          value: val,
          unit: currentMission?.find(s => s.unit)?.unit || 'units',
          co2,
          city,
          date: serverTimestamp(),
          source: 'wizard',
          label: `Logged from ${city}`
        });
      }
      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCategory(null);
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
    setResultData(null);
    setShowInfo(false);
  };

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 text-center border border-[#E5E5E1] shadow-2xl relative overflow-hidden"
        >
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="absolute top-0 right-0 p-8 hover:opacity-100 opacity-30 transition-opacity z-20"
          >
            <Info className="text-[#1D1D1F] w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="text-amber-600 w-10 h-10" />
          </div>
          
          <h2 className="text-4xl font-extrabold text-[#1D1D1F] mb-4 tracking-tight">Impact Awareness</h2>
          <p className="text-[#8E8E93] text-lg font-medium mb-12 max-w-lg mx-auto leading-relaxed">
            Every choice in <span className="text-[#1D1D1F] font-bold">{city}</span> counts. You've successfully mapped this activity to your environmental journey.
          </p>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-slate-50 rounded-[32px] text-left border border-slate-100 overflow-hidden"
              >
                <h4 className="text-sm font-black text-[#1D1D1F] uppercase mb-2 tracking-widest">How is this calculated?</h4>
                <p className="text-[#8E8E93] text-sm leading-relaxed">
                  We use standard emission factors for {selectedCategory} in India. 
                  {selectedCategory === 'transport' && answers.mode?.factor === 'none' ? (
                    " Since you biked or walked, your carbon footprint for this trip is zero. Great job!"
                  ) : (
                    " Calculations are based on average carbon intensity per unit, adjusted for local infrastructure."
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#F2F2F7] p-8 rounded-[32px] text-left">
              <span className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Climate Toll</span>
              <div className="text-5xl font-black text-[#1D1D1F] tracking-tighter">
                {resultData?.co2.toFixed(1)} <span className="text-xl">kg CO₂</span>
              </div>
            </div>
            <div className="bg-[#FF3B30]/5 p-8 rounded-[32px] text-left border border-[#FF3B30]/10">
              <span className="text-[#FF3B30] text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Carbon Debt</span>
              <div className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
                ≈ {(resultData ? resultData.co2 * 0.05 : 0).toFixed(1)} <span className="text-lg opacity-60">Trees to Balance</span>
              </div>
            </div>
          </div>

          <button 
            onClick={reset}
            className="bg-[#1D1D1F] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Continue Journey
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div 
            key="category-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <header className="max-w-2xl">
                <Link to="/" className="flex items-center gap-2 text-[#8E8E93] font-black text-[10px] mb-6 hover:text-[#E1FF01] transition-colors uppercase tracking-[0.2em] group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-4 h-1 bg-[#E1FF01] rounded-full" />
                   <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">Environmental Impact Protocol</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                  Green India <span className="text-[#E1FF01]">Tracker</span>
                </h1>
                <p className="text-[#8E8E93] text-sm font-bold uppercase tracking-widest mt-6 opacity-60">Measure your carbon footprint to help India achieve Net Zero by 2070.</p>
              </header>

              <div className="relative">
                <button 
                  onClick={() => setShowCityPicker(!showCityPicker)}
                  className="flex items-center gap-3 bg-white border border-[#E5E5E1] pl-4 pr-6 py-3 rounded-full shadow-sm hover:border-[#34C759] transition-all group"
                >
                  <div className="w-8 h-8 bg-[#34C759]/10 rounded-full flex items-center justify-center text-[#34C759] group-hover:bg-[#34C759] group-hover:text-white transition-colors">
                    <MapPin size={16} />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-black text-[#8E8E93] uppercase block">Location</span>
                    <span className="text-sm font-bold text-[#1D1D1F]">{city}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {showCityPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-white border border-[#E5E5E1] rounded-[32px] shadow-2xl z-50 p-4 border-t-4 border-t-[#34C759]"
                    >
                      <p className="text-[10px] font-black text-[#8E8E93] uppercase mb-4 px-2">Select State / UT</p>
                      <div className="grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {INDIAN_REGIONS.map(c => (
                          <button
                            key={c}
                            onClick={() => { setCity(c); setShowCityPicker(false); }}
                            className={cn(
                              "text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                              city === c ? "bg-[#34C759] text-white" : "bg-transparent text-[#1D1D1F] hover:bg-[#F2F2F7]"
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory(cat.id as FootprintCategory)}
                  className={cn(
                    "relative group h-[240px] p-8 rounded-[40px] border text-left flex flex-col justify-between transition-all shadow-sm overflow-hidden",
                    cat.color
                  )}
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
                      <cat.icon size={28} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">{cat.name}</h3>
                    <p className="text-sm opacity-70 font-bold mt-1">Start Analysis</p>
                  </div>
                  <div className="relative z-10 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    Start Entry <ArrowRight size={12} />
                  </div>
                  
                  <div className="absolute -right-4 -bottom-4 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity">
                    <cat.icon size={180} />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#1D1D1F] p-10 rounded-[40px] flex items-center gap-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users size={80} />
                </div>
                
                <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center shrink-0 border border-white/10">
                  <Sparkles size={32} className="text-[#34C759]" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-sm font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-4">Community Impact</h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={communityIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-1"
                    >
                      <p className="text-2xl font-black tracking-tight leading-tight">
                        <span className="text-[#34C759]">{COMMUNITY_ACHIEVEMENTS[communityIdx].name}</span> from {city} area
                      </p>
                      <p className="text-[#8E8E93] text-lg font-medium leading-relaxed">
                        {COMMUNITY_ACHIEVEMENTS[communityIdx].action}, <span className="text-white">{COMMUNITY_ACHIEVEMENTS[communityIdx].impact}</span>.
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="bg-[#F2F2F7] p-10 rounded-[40px] flex flex-col justify-between border border-[#E5E5E1]">
                <h4 className="text-sm font-black text-[#8E8E93] uppercase tracking-widest">Climate Goal</h4>
                <div>
                  <div className="text-5xl font-black text-[#1D1D1F] tracking-tighter">15%</div>
                  <p className="text-xs font-bold text-[#8E8E93] mt-2 italic">Monthly Target Progress</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="wizard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto pt-10"
          >
            <button 
              onClick={reset}
              className="group flex items-center gap-2 text-[#8E8E93] font-bold text-sm mb-12 hover:text-[#1D1D1F] transition-colors"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Cancel Tracking
            </button>

            <div className="mb-12">
              <div className="flex gap-2 mb-6">
                {currentMission!.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-500",
                      i <= currentStep ? "bg-[#34C759]" : "bg-[#F2F2F7]"
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#8E8E93]">
                 {city} Region • {selectedCategory} • Step {currentStep + 1} of {currentMission!.length}
              </span>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-5xl font-black text-[#1D1D1F] tracking-tighter mb-4 leading-tight">
                  {step!.question}
                </h2>
                <p className="text-[#8E8E93] text-xl font-medium">{step!.subtext}</p>
              </div>

              {step!.type === 'choice' ? (
                <div className="grid grid-cols-1 gap-4">
                  {step!.choices!.map((choice, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleChoice(choice)}
                      className={cn(
                        "flex items-center justify-between p-6 rounded-[28px] border-2 text-left transition-all",
                        answers[step!.id]?.label === choice.label 
                          ? "bg-[#34C759]/5 border-[#34C759] shadow-lg shadow-green-50" 
                          : "bg-white border-[#F2F2F7] hover:border-[#E5E5E1]"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#F2F2F7] rounded-xl flex items-center justify-center">
                          <choice.icon size={22} className="text-[#1D1D1F]" />
                        </div>
                        <span className="text-xl font-bold text-[#1D1D1F]">{choice.label}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#F2F2F7] flex items-center justify-center group-hover:bg-[#34C759] group-hover:border-[#34C759] transition-all">
                        <ArrowRight size={14} className="text-[#D1D1D6] group-hover:text-white" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="relative group">
                    <input
                      type="number"
                      autoFocus
                      min="0"
                      value={answers[step!.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || parseFloat(val) >= 0) {
                          setAnswers(prev => ({ ...prev, [step!.id]: val }));
                        }
                      }}
                      placeholder="0.0"
                      className="w-full bg-transparent border-b-4 border-[#F2F2F7] focus:border-[#34C759] transition-colors py-8 text-7xl font-black text-[#1D1D1F] outline-none placeholder:text-[#F2F2F7] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {step!.unit && (
                      <span className="absolute right-0 bottom-10 text-2xl font-black text-[#8E8E93] uppercase tracking-widest">
                        {step!.unit}
                      </span>
                    )}
                  </div>
                  
                  <button
                    disabled={!answers[step!.id]}
                    onClick={handleNext}
                    className="w-full bg-[#1D1D1F] text-white p-6 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 hover:bg-black disabled:bg-[#F2F2F7] disabled:text-[#D1D1D6] transition-all shadow-xl active:scale-[0.98]"
                  >
                    {loading ? "Processing..." : (
                      <>
                        {currentStep === currentMission!.length - 1 ? "Complete Insight" : "Next Milestone"}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

