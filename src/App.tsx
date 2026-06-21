import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { AuthFlow } from './components/auth/AuthFlow';
import { Dashboard } from './pages/Dashboard';
import { Calculator } from './pages/Calculator';
import { Coach } from './pages/Coach';
import { Community } from './pages/Community';
import { Academy } from './pages/Academy';
import { Standings } from './pages/Standings';
import { motion, AnimatePresence } from 'motion/react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/auth" element={!user ? <AuthFlow /> : <Navigate to="/" />} />
            
            <Route path="/*" element={
              <PrivateRoute>
                <div className="flex flex-col md:flex-row min-h-screen bg-black">
                  <Navbar />
                  <main className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full text-white">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/calculator" element={<Calculator />} />
                      <Route path="/coach" element={<Coach />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/standings" element={<Standings />} />
                      <Route path="/academy" element={<Academy />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}
