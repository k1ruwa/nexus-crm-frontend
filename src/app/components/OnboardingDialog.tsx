import { useState, useEffect } from 'react';
import { Mail, Linkedin, ArrowRight, User, Building2, Briefcase, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfile {
  name: string;
  company: string;
  role: string;
  email: string;
  provider?: string;
}

// Simulated auto-fill data from OAuth providers
const providerProfiles: Record<string, Partial<UserProfile>> = {
  outlook: { name: 'Alex Morgan', company: 'Contoso Ltd', role: 'Product Manager' },
  gmail: { name: 'Alex Morgan', company: '', role: '' },
  linkedin: { name: 'Alex Morgan', company: 'Nexus Corp', role: 'Senior Product Manager' },
};

export function OnboardingDialog() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<'login' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    company: '',
    role: '',
    email: '',
  });

  useEffect(() => {
    if (!localStorage.getItem('nexus_user_profile')) {
      setShow(true);
    }
  }, []);

  const handleOAuthLogin = async (provider: string) => {
    setSelectedProvider(provider);
    setIsLoggingIn(true);

    // Simulate OAuth delay
    await new Promise(r => setTimeout(r, 1200));

    const mockEmail =
      provider === 'outlook' ? 'alex@contoso.com' :
      provider === 'gmail' ? 'alex.morgan@gmail.com' :
      'alex.morgan@linkedin.com';

    const autoFill = providerProfiles[provider] || {};
    setProfile({
      name: autoFill.name || '',
      company: autoFill.company || '',
      role: autoFill.role || '',
      email: mockEmail,
    });

    setIsLoggingIn(false);
    setStep('profile');
  };

  const handleEmailLogin = async () => {
    if (!email.trim()) return;
    setIsLoggingIn(true);
    await new Promise(r => setTimeout(r, 800));
    setProfile(prev => ({ ...prev, email: email.trim() }));
    setIsLoggingIn(false);
    setStep('profile');
  };

  const handleComplete = () => {
    if (!profile.name.trim()) return;
    localStorage.setItem('nexus_user_profile', JSON.stringify(profile));
    setShow(false);
  };

  const oauthButtons = [
    {
      key: 'outlook',
      label: 'Continue with Outlook',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M2 6.5L10 2v20L2 17.5V6.5z" fill="#0078D4"/>
          <path d="M10 2l12 4.5V17.5L10 22V2z" fill="#0078D4" opacity="0.7"/>
          <ellipse cx="6" cy="12" rx="2.5" ry="3.5" fill="white"/>
        </svg>
      ),
      bg: 'bg-[#0078D4]/10 hover:bg-[#0078D4]/15',
      text: 'text-[#0078D4]',
    },
    {
      key: 'gmail',
      label: 'Continue with Gmail',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M22 6l-10 7L2 6V4l10 7L22 4v2z" fill="#EA4335"/>
          <path d="M2 6v12h4V10l6 4 6-4v8h4V6L12 13 2 6z" fill="#4285F4"/>
          <path d="M2 6l10 7V18L2 18V6z" fill="#34A853" opacity="0.8"/>
          <path d="M22 6l-10 7V18l10 0V6z" fill="#FBBC05" opacity="0.8"/>
        </svg>
      ),
      bg: 'bg-red-500/10 hover:bg-red-500/15',
      text: 'text-red-600',
    },
    {
      key: 'linkedin',
      label: 'Continue with LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      bg: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/15',
      text: 'text-[#0A66C2]',
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm bg-white/80 backdrop-blur-3xl rounded-[24px] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/80 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {step === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Welcome to</span>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">Nexus</h2>
                    <p className="text-[13px] text-slate-500 mt-2">Sign in to get started</p>
                  </div>

                  {/* OAuth buttons */}
                  <div className="flex flex-col gap-2.5 mb-5">
                    {oauthButtons.map((btn, i) => (
                      <motion.button
                        key={btn.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOAuthLogin(btn.key)}
                        disabled={isLoggingIn}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl ${btn.bg} border border-white/40 transition-all disabled:opacity-50`}
                      >
                        <div className="shrink-0">{btn.icon}</div>
                        <span className={`text-[14px] font-medium ${btn.text}`}>{btn.label}</span>
                        {isLoggingIn && selectedProvider === btn.key && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="ml-auto h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-slate-200/60" />
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-slate-200/60" />
                  </div>

                  {/* Email input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleEmailLogin}
                      disabled={!email.trim() || isLoggingIn}
                      className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white disabled:opacity-30 transition-opacity"
                    >
                      {isLoggingIn && !selectedProvider ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <ArrowRight className="h-5 w-5 stroke-[1.5]" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                      <User className="h-7 w-7 text-emerald-600 stroke-[1.5]" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Set up your profile</h2>
                    <p className="text-[13px] text-slate-500 mt-1">
                      {selectedProvider ? 'We filled in what we could — verify and complete' : 'Tell us a bit about yourself'}
                    </p>
                  </div>

                  {/* Signed in as */}
                  <div className="mb-5 px-4 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <span className="text-[12px] text-emerald-700">
                      Signed in as <span className="font-medium">{profile.email}</span>
                    </span>
                  </div>

                  {/* Form */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Full name *"
                        value={profile.name}
                        onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      {profile.name && selectedProvider && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Company"
                        value={profile.company}
                        onChange={(e) => setProfile(p => ({ ...p, company: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      {profile.company && selectedProvider && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Your role"
                        value={profile.role}
                        onChange={(e) => setProfile(p => ({ ...p, role: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      {profile.role && selectedProvider && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        setStep('login');
                        setSelectedProvider(null);
                        setProfile({ name: '', company: '', role: '', email: '' });
                      }}
                      className="flex-1 py-3.5 rounded-2xl bg-slate-100/80 text-slate-600 text-[14px] font-medium"
                    >
                      Back
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComplete}
                      disabled={!profile.name.trim()}
                      className="flex-[2] py-3.5 rounded-2xl bg-slate-900 text-white text-[14px] font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.25)] disabled:opacity-30 transition-opacity"
                    >
                      Get Started
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
