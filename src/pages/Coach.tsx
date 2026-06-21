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
      content: "Hello! I'm your Climora AI Coach. I've analyzed your recent activity. Would you like a personalized plan to reduce your footprint by 15% this month?",
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
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-24 md:pb-0">
      <header className="flex flex-col gap-6 mb-10">
        <Link to="/" className="flex items-center gap-1.5 text-[#8E8E93] font-bold text-xs uppercase tracking-[0.15em] hover:text-[#1D1D1F] transition-colors px-1">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#007AFF] rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-blue-100">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">AI Climate Coach</h1>
              <p className="text-[#8E8E93] text-sm font-medium">Active • Personalized Guidance</p>
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
              m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-[#E5E5E1] shadow-sm",
              m.role === 'user' ? "bg-[#1D1D1F]" : "bg-white"
            )}>
              {m.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-[#007AFF]" />}
            </div>
            <div className="flex flex-col gap-4">
              <div className={cn(
                "p-5 rounded-[24px] text-[15px] leading-relaxed",
                m.role === 'user' 
                  ? "bg-[#1D1D1F] text-white rounded-tr-none shadow-lg shadow-slate-200" 
                  : "bg-white border border-[#E5E5E1] text-[#1D1D1F] shadow-sm rounded-tl-none font-medium"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
              
              {m.role === 'assistant' && m.options && m.options.length > 0 && i === messages.length - 1 && (
                <div className="relative mt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOptions(!showOptions)}
                    className="flex items-center gap-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>🎯 Options</span>
                    <motion.div animate={{ rotate: showOptions ? 180 : 0 }}>
                      <Bot size={12} />
                    </motion.div>
                  </motion.button>

                  {showOptions && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute left-0 mt-3 w-[300px] bg-white border border-[#E5E5E1] rounded-[24px] shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-2 flex flex-col">
                        {m.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(undefined, opt)}
                            className="w-full text-left p-4 hover:bg-[#F2F2F7] rounded-[18px] transition-colors flex items-center gap-4 active:scale-[0.98]"
                          >
                            <span className="text-2xl shrink-0 leading-none">{opt.split(' ')[0]}</span>
                            <span className="text-base font-bold text-[#1D1D1F] leading-tight">
                              {opt.split(' ').slice(1).join(' ')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-[85%] animate-pulse">
            <div className="w-9 h-9 rounded-full bg-[#F2F2F7] flex items-center justify-center border border-[#E5E5E1]">
              <Bot size={18} className="text-[#8E8E93]" />
            </div>
            <div className="p-5 rounded-[24px] bg-white border border-[#E5E5E1] w-32 h-16"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach anything..."
          className="w-full bg-white border border-[#E5E5E1] pr-20 pl-7 py-6 rounded-[28px] shadow-2xl shadow-slate-200 outline-none focus:border-[#007AFF] transition-all text-lg font-medium placeholder:text-[#8E8E93]"
        />
        <button
          disabled={loading || !input.trim()}
          className="absolute right-4 top-4 bottom-4 px-6 bg-[#007AFF] rounded-[20px] flex items-center justify-center text-white hover:bg-blue-600 disabled:bg-[#F2F2F7] disabled:text-[#8E8E93] disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
