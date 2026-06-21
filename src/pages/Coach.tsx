import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Send, User, Bot, Sparkles, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
}

export function Coach() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Protocol Established. I'm your Climora Eco Coach. I've analyzed your recent activity. Would you like a personalized plan to reduce your footprint by 15% this month?",
      options: ["🚲 Commute", "🥗 Diet", "💡 Energy", "♻️ Waste", "📱 Digital"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    
    const messageText = directMessage || input;
    if (!messageText.trim() || loading) return;

    setInput('');
    setShowOptions(false);
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          userData: profile,
          history: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API Error');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.text,
        options: data.options 
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: err.message || "I'm having a brief connection issue. Let's try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-24 md:pb-0 font-sans">
      <header className="flex flex-col gap-6 mb-10">
        <Link to="/" className="flex items-center gap-2 text-[#8E8E93] font-black text-[10px] mb-2 hover:text-[#E1FF01] transition-colors uppercase tracking-[0.2em] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#E1FF01] rounded-[24px] flex items-center justify-center text-black shadow-xl shadow-[#E1FF01]/10">
              <Sparkles size={28} strokeWidth={3} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-4 h-1 bg-[#E1FF01] rounded-full" />
                 <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">Neural Link: Active</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Eco <span className="text-[#E1FF01]">Coach</span></h1>
            </div>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 pr-4 mb-8 custom-scrollbar scroll-smooth"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse text-right" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all",
              m.role === 'user' 
                ? "bg-[#E1FF01] border-[#E1FF01] text-black shadow-lg shadow-[#E1FF01]/10" 
                : "bg-white/5 border-white/10 text-white"
            )}>
              {m.role === 'user' ? <User size={20} strokeWidth={3} /> : <Bot size={20} strokeWidth={3} />}
            </div>
            <div className="flex flex-col gap-4">
              <div className={cn(
                "p-7 rounded-[32px] text-[15px] leading-relaxed",
                m.role === 'user' 
                  ? "bg-[#E1FF01] text-black rounded-tr-none font-black uppercase tracking-tight italic" 
                  : "bg-[#0A0A0A] border border-white/10 text-white shadow-2xl rounded-tl-none font-bold italic"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
              
              {m.role === 'assistant' && m.options && m.options.length > 0 && i === messages.length - 1 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {m.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(undefined, opt)}
                      className="bg-white/5 border border-white/10 text-white hover:bg-[#E1FF01] hover:text-black hover:border-[#E1FF01] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-[85%] animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Bot size={20} className="text-[#8E8E93]" />
            </div>
            <div className="p-7 rounded-[32px] bg-[#0A0A0A] border border-white/10 w-48 h-20"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative group mt-auto">
        <div className="absolute inset-0 bg-[#E1FF01]/10 rounded-[32px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER COMMAND: Ask your coach anything..."
          className="w-full bg-[#0A0A0A] border border-white/10 pr-24 pl-8 py-7 rounded-[32px] shadow-2xl outline-none focus:border-[#E1FF01] transition-all text-sm font-black uppercase tracking-widest text-white placeholder:text-[#8E8E93] placeholder:opacity-50 relative z-10 italic"
        />
        <button
          disabled={loading || !input.trim()}
          className="absolute right-4 top-4 bottom-4 px-8 bg-[#E1FF01] rounded-[24px] flex items-center justify-center text-black hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all active:scale-95 shadow-xl shadow-[#E1FF01]/10 z-20 group"
        >
          <Send size={24} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
