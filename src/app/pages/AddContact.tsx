import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mic, Camera, X, Loader2, Sparkles, Building2, Briefcase, Phone, Mail, Globe, AlignLeft, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CameraCapture } from '../components/CameraCapture';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { addContact, Contact } from '../lib/db';
import { enrichFromBusinessCard, enrichFromVoiceTranscript, transcribeAudio, enrichProfile } from '../lib/ai-enrichment';
import { toast } from 'sonner';

export default function AddContact() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const initialMode = (searchParams.get('mode') as 'manual' | 'camera' | 'voice') || 'manual';
  const [showCamera, setShowCamera] = useState(initialMode === 'camera');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(initialMode === 'voice');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', title: '',
    notes: '', linkedIn: '', twitter: '', website: '', tags: '',
  });
  const [capturedImage, setCapturedImage] = useState('');
  const [mode, setMode] = useState<'manual' | 'camera' | 'voice'>(initialMode);

  const handleCameraCapture = async (imageData: string) => {
    setShowCamera(false);
    setCapturedImage(imageData);
    setMode('camera');
    setIsProcessing(true);
    try {
      toast.info('Analyzing image...', { duration: 2000 });
      const enrichedData = await enrichFromBusinessCard(imageData);
      setFormData(prev => ({
        ...prev,
        name: enrichedData.name || prev.name,
        email: enrichedData.email || prev.email,
        phone: enrichedData.phone || prev.phone,
        company: enrichedData.company || prev.company,
        title: enrichedData.title || prev.title,
        website: enrichedData.website || prev.website,
      }));
      toast.success('Image analyzed successfully!');
    } catch {
      toast.error('Failed to analyze image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob, duration: number) => {
    setShowVoiceRecorder(false);
    setMode('voice');
    setIsProcessing(true);
    try {
      toast.info('Transcribing...', { duration: 2000 });
      const transcript = await transcribeAudio(audioBlob);
      toast.info('Extracting contact info...', { duration: 2000 });
      const enrichedData = await enrichFromVoiceTranscript(transcript);
      setFormData(prev => ({
        ...prev,
        name: enrichedData.name || prev.name,
        email: enrichedData.email || prev.email,
        phone: enrichedData.phone || prev.phone,
        notes: enrichedData.notes || prev.notes,
      }));
      toast.success('Voice note processed!');
    } catch {
      toast.error('Failed to process voice note');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnrichProfile = async () => {
    if (!formData.email && !formData.name) {
      toast.error('Add an email or name to enrich');
      return;
    }
    setIsProcessing(true);
    try {
      toast.info('Enriching profile...', { duration: 2000 });
      const enrichedData = await enrichProfile(formData.email, formData.name);
      setFormData(prev => ({
        ...prev,
        linkedIn: enrichedData.linkedIn || prev.linkedIn,
        twitter: enrichedData.twitter || prev.twitter,
        company: enrichedData.company || prev.company,
        title: enrichedData.title || prev.title,
      }));
      toast.success('Profile enriched with AI!');
    } catch {
      toast.error('Failed to enrich profile');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    const contact: Contact = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      company: formData.company.trim() || undefined,
      title: formData.title.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      linkedIn: formData.linkedIn.trim() || undefined,
      twitter: formData.twitter.trim() || undefined,
      website: formData.website.trim() || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      profileImage: capturedImage || undefined,
      source: mode,
      aiEnriched: mode !== 'manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      await addContact(contact);
      toast.success('Connection added!');
      navigate('/');
    } catch {
      toast.error('Failed to add contact');
    }
  };

  if (showCamera) {
    return <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />;
  }

  const InputRow = ({ icon: Icon, value, onChange, placeholder, type = 'text' }: {
    icon: any; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/30 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100/60">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="flex-1 bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
        </button>
        <h1 className="text-[15px] font-semibold text-slate-800">New Connection</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={isProcessing}
          className="text-emerald-500 text-[15px] font-semibold disabled:opacity-50"
        >
          Save
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* Action Buttons - Dynamic Island style */}
        <div className="flex gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCamera(true)}
            className="flex-1 flex flex-col items-center gap-2.5 p-5 rounded-[24px] bg-white/80 backdrop-blur-3xl border border-white/80 shadow-[0_24px_48px_rgba(0,0,0,0.06)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10">
              <Camera className="h-6 w-6 text-sky-500 stroke-[1.5]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-800">Photo / Card</span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Snap</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVoiceRecorder(true)}
            className="flex-1 flex flex-col items-center gap-2.5 p-5 rounded-[24px] bg-white/80 backdrop-blur-3xl border border-white/80 shadow-[0_24px_48px_rgba(0,0,0,0.06)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Mic className="h-6 w-6 text-indigo-500 stroke-[1.5]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-800">Dictate Info</span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Voice</span>
          </motion.button>
        </div>

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="mb-6 relative rounded-3xl overflow-hidden border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <img src={capturedImage} alt="Captured" className="w-full h-40 object-cover" />
            <button
              onClick={() => setCapturedImage('')}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Processing indicator */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              <span className="text-[13px] font-medium text-emerald-600">Processing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form - Glass cards */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-4 py-3">
              <input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="First & Last Name"
                className="w-full bg-transparent text-[17px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Work */}
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <InputRow icon={Building2} value={formData.company} onChange={(v) => setFormData(p => ({ ...p, company: v }))} placeholder="Company" />
            <InputRow icon={Briefcase} value={formData.title} onChange={(v) => setFormData(p => ({ ...p, title: v }))} placeholder="Title" />
          </div>

          {/* Contact Info */}
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <InputRow icon={Phone} value={formData.phone} onChange={(v) => setFormData(p => ({ ...p, phone: v }))} placeholder="Phone" type="tel" />
            <InputRow icon={Mail} value={formData.email} onChange={(v) => setFormData(p => ({ ...p, email: v }))} placeholder="Email" type="email" />
            <InputRow icon={Globe} value={formData.website} onChange={(v) => setFormData(p => ({ ...p, website: v }))} placeholder="Website" type="url" />
          </div>

          {/* Notes */}
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="flex gap-3 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100/60 mt-0.5">
                <AlignLeft className="h-4 w-4 text-slate-400" />
              </div>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                placeholder="Notes..."
                rows={4}
                className="flex-1 bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* AI Enrich Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleEnrichProfile}
            disabled={isProcessing || (!formData.email && !formData.name)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 bg-gradient-to-tr from-slate-800 to-slate-950 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-slate-700/50 disabled:opacity-40 transition-opacity"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin stroke-[1.5]" />
            ) : (
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            )}
            <span className="text-[15px] font-semibold">AI Enrich Contact</span>
          </motion.button>
        </div>
      </div>

      {/* Voice Recorder Modal */}
      <AnimatePresence>
        {showVoiceRecorder && (
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
              className="w-full max-w-sm bg-white/80 backdrop-blur-3xl rounded-[24px] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/80"
            >
              <VoiceRecorder onRecordingComplete={handleVoiceRecording} title="Dictate Info" />
              <button
                onClick={() => setShowVoiceRecorder(false)}
                className="w-full mt-4 py-2.5 rounded-2xl text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}