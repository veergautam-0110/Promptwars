import { useState, useMemo } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Leaf, Chrome } from 'lucide-react';
import { motion } from 'motion/react';

export function AuthFlow() {
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState<string | null>(null);

  const quotes = [
    "The greatest threat to our planet is the belief that someone else will save it.",
    "The earth is what we all have in common.",
    "The environment is everything that isn't me.",
    "He that plants trees loves others besides himself.",
    "One of the first conditions of happiness is that the link between nature and man shall not be broken.",
    "Nature provides a free lunch, but only if we control our appetites.",
    "There is no such thing as 'away'. When we throw anything away, it must go somewhere.",
    "We do not inherit the earth from our ancestors, we borrow it from our children.",
    "Earth provides enough to satisfy every man's needs, but not every man's greed.",
    "An investment in nature is an investment in our collective future.",
    "The climate is changing, why aren't we?"
  ];

  const randomQuote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn('google');
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked by your browser. Please allow popups and try again.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Just ignore
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setSigningIn(null);
    }
  };

  const handleAnonymousSignIn = async () => {
    setSigningIn('guest');
    setError(null);
    try {
      // Direct guest access without Firebase storage
      localStorage.setItem('eco_guest_mode', 'true');
      window.location.reload();
    } catch (err: any) {
      console.error("Guest access Error:", err);
      setError("Failed to start guest session. Please try again.");
    } finally {
      setSigningIn(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden font-sans">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      {/* Yellow Accents */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#E1FF01] rounded-full blur-[150px] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-24 items-center">
        {/* Left Side: Editorial Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col gap-14"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-4 border-2 border-[#E1FF01] rounded-full relative overflow-hidden">
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-[#E1FF01] rounded-full" />
            </div>
            <span className="text-xs font-black tracking-[0.4em] text-white/40 uppercase">Ecosphere Protocol</span>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
              <span className="block italic">CARBON</span>
              <span className="block text-[#E1FF01] -mt-2">INTELLIGENCE</span>
            </h1>
            <p className="text-xl text-[#8E8E93] leading-relaxed max-w-lg font-black uppercase tracking-widest opacity-80">
              Measure, track, and offset your environmental footprint with Climora's next-gen neural orchestration.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="h-[2px] w-48 bg-[#E1FF01]/30" />
            
            <div className="grid grid-cols-2 gap-x-16 gap-y-8">
              <div>
                <div className="text-3xl font-black text-white tracking-widest">99.9%</div>
                <div className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.3em] mt-2">Data Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-widest">124K+</div>
                <div className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.3em] mt-2">Tons Saved</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: High-End Auth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[48px] p-12 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E1FF01]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col items-center text-center gap-12">
              <div className="lg:hidden flex flex-col items-center gap-6">
                <div className="w-10 h-4 border-2 border-[#E1FF01] rounded-full relative">
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-[#E1FF01] rounded-full" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Climora</h1>
              </div>

              <div className="hidden lg:block space-y-3">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Identity Link</h2>
                <p className="text-[#8E8E93] font-bold text-xs uppercase tracking-widest px-4 opacity-60">Synchronize your footprint with the global ecosphere.</p>
              </div>

              <div className="w-full space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  disabled={!!signingIn}
                  className="w-full flex items-center justify-center gap-4 bg-[#E1FF01] text-black p-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:shadow-[0_20px_40px_-12px_rgba(225,255,1,0.3)] transition-all disabled:opacity-50"
                >
                  {signingIn === 'google' ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Chrome size={20} strokeWidth={3} />
                  )}
                  {signingIn === 'google' ? 'Linking...' : 'Secure Google Link'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnonymousSignIn}
                  disabled={!!signingIn}
                  className="w-full bg-white/5 text-white p-6 rounded-3xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {signingIn === 'guest' ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Guest Protocol'
                  )}
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#E1FF01] animate-ping" />
                  <span className="text-[9px] font-black text-[#E1FF01] uppercase tracking-[0.4em]">Core Status: Optimal</span>
                </div>
                <p className="text-[#8E8E93] text-[10px] font-bold leading-relaxed px-6 italic uppercase tracking-widest opacity-40">
                  "{randomQuote}"
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#FF3B30] text-white px-8 py-4 rounded-full text-sm font-bold shadow-2xl flex items-center gap-3 z-[100]"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}
