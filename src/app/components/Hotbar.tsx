import { useNavigate, useLocation } from 'react-router';
import { Users, CalendarDays, Plus, Camera, Mic, PenLine, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Hotbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showIsland, setShowIsland] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleAction = (mode: 'camera' | 'voice' | 'manual') => {
    setShowIsland(false);
    navigate(`/add?mode=${mode}`);
  };

  return (
    <>
      {/* Dynamic Island overlay */}
      <AnimatePresence>
        {showIsland && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowIsland(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-28 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="pointer-events-auto flex items-center gap-3 rounded-full bg-slate-900/90 backdrop-blur-2xl px-5 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.3)] border border-white/10"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction('camera')}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Camera className="h-5 w-5 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] font-medium text-white/70">Image</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction('voice')}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Mic className="h-5 w-5 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] font-medium text-white/70">Voice</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction('manual')}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <PenLine className="h-5 w-5 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] font-medium text-white/70">Manual</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowIsland(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ml-1"
                >
                  <X className="h-4 w-4 text-white/60 stroke-[1.5]" />
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-8 pt-4 pointer-events-none">
        <div className="mx-auto flex w-full max-w-sm items-center justify-between rounded-full bg-white/70 px-8 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.1)] backdrop-blur-3xl border border-white/60 pointer-events-auto relative">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <Users className="h-5 w-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">Contacts</span>
          </button>

          {/* Spacer for center FAB */}
          <div className="w-14" />

          <button
            onClick={() => navigate('/reminders')}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive('/reminders') ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <CalendarDays className="h-5 w-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">Events</span>
          </button>

          {/* Center Plus FAB */}
          <div className="absolute left-1/2 -top-5 -translate-x-1/2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowIsland(prev => !prev)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_8px_32px_rgba(16,185,129,0.35)] border border-emerald-400/50"
            >
              <motion.div
                animate={{ rotate: showIsland ? 45 : 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <Plus className="h-6 w-6 stroke-[2]" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
