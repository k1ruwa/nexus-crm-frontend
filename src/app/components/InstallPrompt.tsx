import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt || localStorage.getItem('installPromptDismissed')) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-28 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="rounded-3xl bg-white/80 backdrop-blur-3xl border border-white/80 shadow-[0_24px_48px_rgba(0,0,0,0.12)] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <Download className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-slate-800">Install Neco</h3>
              <p className="text-[12px] text-slate-500 mt-0.5 mb-3">
                Add to home screen for offline access
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-[13px] font-medium active:scale-95 transition-transform"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 rounded-xl bg-white/50 text-slate-400 hover:text-slate-600 active:scale-95 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
