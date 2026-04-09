import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Mail, Phone, Building2, Globe, Trash2, Plus, Mic, ExternalLink, Bell, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceRecorder } from '../components/VoiceRecorder';
import {
  getContact, updateContact, deleteContact, Contact,
  VoiceNote, addVoiceNote, getVoiceNotesByContact,
  addReminder, getRemindersByContact, Reminder, updateReminder,
} from '../lib/db';
import { toast } from 'sonner';
import { transcribeAudio } from '../lib/ai-enrichment';
import { format, isPast, isToday } from 'date-fns';

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    if (id) { loadContact(id); loadVoiceNotes(id); loadReminders(id); }
  }, [id]);

  const loadContact = async (cid: string) => {
    const data = await getContact(cid);
    if (data) setContact(data); else { toast.error('Contact not found'); navigate('/'); }
  };
  const loadVoiceNotes = async (cid: string) => {
    const notes = await getVoiceNotesByContact(cid);
    setVoiceNotes(notes.sort((a, b) => b.createdAt - a.createdAt));
  };
  const loadReminders = async (cid: string) => {
    const list = await getRemindersByContact(cid);
    setReminders(list.sort((a, b) => a.dueDate - b.dueDate));
  };

  const handleVoiceNote = async (audioBlob: Blob, duration: number, transcript?: string) => {
    if (!contact) return;
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      // Use transcript from Web Speech API if available, otherwise fall back to API
      const text = transcript?.trim() || await transcribeAudio(audioBlob);
      const voiceNote: VoiceNote = {
        id: crypto.randomUUID(), contactId: contact.id,
        audioBlob: reader.result as string, transcript: text, duration, createdAt: Date.now(),
      };
      await addVoiceNote(voiceNote);
      await loadVoiceNotes(contact.id);
      setShowVoiceRecorder(false);
      toast.success('Voice note saved!');
    };
  };

  const handleAddReminder = async () => {
    if (!contact || !newReminder.title || !newReminder.dueDate) { toast.error('Title and date required'); return; }
    const reminder: Reminder = {
      id: crypto.randomUUID(), contactId: contact.id,
      title: newReminder.title, description: newReminder.description || undefined,
      dueDate: new Date(newReminder.dueDate).getTime(), completed: false, createdAt: Date.now(),
    };
    await addReminder(reminder);
    await loadReminders(contact.id);
    setShowReminderForm(false);
    setNewReminder({ title: '', description: '', dueDate: '' });
    toast.success('Reminder added!');
  };

  const handleToggleReminder = async (r: Reminder) => {
    const updated = { ...r, completed: !r.completed };
    await updateReminder(updated);
    await loadReminders(contact!.id);
  };

  const handleDelete = async () => {
    if (!contact) return;
    await deleteContact(contact.id);
    toast.success('Contact deleted');
    navigate('/');
  };

  const handleMarkContacted = async () => {
    if (!contact) return;
    const updated = { ...contact, lastContactedAt: Date.now(), updatedAt: Date.now() };
    await updateContact(updated);
    setContact(updated);
    toast.success('Marked as contacted!');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getAvatarColor = (name: string) => {
    const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-sky-500', 'bg-amber-500', 'bg-violet-500'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (!contact) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-[13px]">Loading...</div>;
  }

  const InfoRow = ({ icon: Icon, label, value, href, color = 'indigo' }: { icon: any; label: string; value: string; href?: string; color?: string }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/30 last:border-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
        color === 'indigo' ? 'bg-indigo-500/10' : color === 'sky' ? 'bg-sky-500/10' : color === 'emerald' ? 'bg-emerald-500/10' : 'bg-slate-100/60'
      }`}>
        <Icon className={`h-4 w-4 ${
          color === 'indigo' ? 'text-indigo-500' : color === 'sky' ? 'text-sky-500' : color === 'emerald' ? 'text-emerald-500' : 'text-slate-400'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="block text-[15px] font-medium text-sky-500 truncate">{value}</a>
        ) : (
          <p className="text-[15px] font-medium text-slate-800 truncate">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="text-rose-500 hover:text-rose-600 transition-colors">
          <Trash2 className="h-5 w-5 stroke-[1.5]" />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col items-center text-center"
        >
          {contact.profileImage ? (
            <img src={contact.profileImage} alt={contact.name} className="h-24 w-24 rounded-3xl object-cover mb-4" />
          ) : (
            <div className={`h-24 w-24 rounded-3xl ${getAvatarColor(contact.name)} flex items-center justify-center mb-4`}>
              <span className="text-2xl font-semibold text-white">{getInitials(contact.name)}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{contact.name}</h1>
          {contact.title && <p className="text-[13px] text-slate-500 mt-1">{contact.title}</p>}
          {contact.company && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[13px] font-medium text-slate-500">{contact.company}</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {contact.source && contact.source !== 'manual' && (
              <span className="text-[10px] font-medium text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md uppercase">{contact.source}</span>
            )}
            {contact.aiEnriched && (
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">AI Enriched</span>
            )}
            {contact.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-medium text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-md">{tag}</span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-5">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleMarkContacted}
              className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 text-[13px] font-medium">
              Mark Contacted
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowVoiceRecorder(true)}
              className="px-4 py-2 rounded-2xl bg-indigo-500/10 text-indigo-600 text-[13px] font-medium flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5" /> Voice Note
            </motion.button>
          </div>

          {contact.lastContactedAt && (
            <p className="text-[11px] text-slate-400 mt-3">
              Last contacted {format(contact.lastContactedAt, 'MMM d, yyyy')}
            </p>
          )}
        </motion.div>

        {/* Contact Info */}
        {(contact.email || contact.phone || contact.website || contact.linkedIn || contact.twitter) && (
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {contact.phone && <InfoRow icon={Phone} label="Phone" value={contact.phone} href={`tel:${contact.phone}`} color="emerald" />}
            {contact.email && <InfoRow icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} color="indigo" />}
            {contact.website && <InfoRow icon={Globe} label="Website" value={contact.website} href={contact.website} color="sky" />}
            {contact.linkedIn && <InfoRow icon={ExternalLink} label="LinkedIn" value="View Profile" href={contact.linkedIn} color="sky" />}
            {contact.twitter && <InfoRow icon={ExternalLink} label="Twitter" value="View Profile" href={contact.twitter} color="sky" />}
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight mb-2">Notes</h2>
            <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}

        {/* Reminders */}
        <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Reminders</h2>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowReminderForm(!showReminderForm)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/80 text-slate-500">
              <Plus className="h-4 w-4 stroke-[1.5]" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showReminderForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden">
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/30 border border-white/40">
                  <input value={newReminder.title} onChange={e => setNewReminder(p => ({ ...p, title: e.target.value }))}
                    placeholder="Reminder title" className="bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none px-1 py-1" />
                  <input value={newReminder.description} onChange={e => setNewReminder(p => ({ ...p, description: e.target.value }))}
                    placeholder="Description (optional)" className="bg-transparent text-[12px] text-slate-600 placeholder:text-slate-400 focus:outline-none px-1 py-1" />
                  <input type="datetime-local" value={newReminder.dueDate} onChange={e => setNewReminder(p => ({ ...p, dueDate: e.target.value }))}
                    className="bg-transparent text-[12px] text-slate-600 focus:outline-none px-1 py-1" />
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddReminder}
                    className="py-2 rounded-xl bg-emerald-500 text-white text-[13px] font-medium mt-1">
                    Add Reminder
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {reminders.length === 0 ? (
            <p className="text-[12px] text-slate-400 text-center py-3">No reminders yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {reminders.map(r => (
                <div key={r.id} className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/30 border border-white/40">
                  <button onClick={() => handleToggleReminder(r)} className="mt-0.5 shrink-0">
                    {r.completed ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium ${r.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{r.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className={`text-[11px] ${!r.completed && isPast(r.dueDate) ? 'text-rose-500' : isToday(r.dueDate) ? 'text-amber-500' : 'text-slate-400'}`}>
                        {format(r.dueDate, 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Notes */}
        <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Voice Notes</h2>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowVoiceRecorder(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/80 text-slate-500">
              <Mic className="h-4 w-4 stroke-[1.5]" />
            </motion.button>
          </div>
          {voiceNotes.length === 0 ? (
            <p className="text-[12px] text-slate-400 text-center py-3">No voice notes yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {voiceNotes.map(note => (
                <div key={note.id} className="p-3 rounded-2xl bg-white/30 border border-white/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400">{format(note.createdAt, 'MMM d, h:mm a')}</span>
                    <span className="text-[11px] text-slate-400">{Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <audio src={note.audioBlob} controls className="w-full mb-2" />
                  {note.transcript && (
                    <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50/50 rounded-xl p-2.5">{note.transcript}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voice Recorder Modal */}
      <AnimatePresence>
        {showVoiceRecorder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm bg-white/80 backdrop-blur-3xl rounded-[24px] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/80"
            >
              <VoiceRecorder onRecordingComplete={handleVoiceNote} title="Record Voice Note" />
              <button onClick={() => setShowVoiceRecorder(false)}
                className="w-full mt-4 py-2.5 rounded-2xl text-[13px] font-medium text-slate-500">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm bg-white/80 backdrop-blur-3xl rounded-[24px] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/80"
            >
              <h3 className="text-[17px] font-semibold text-slate-900 mb-2">Delete Contact</h3>
              <p className="text-[13px] text-slate-500 mb-5">
                Are you sure you want to delete {contact.name}? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/60 border border-white/50 text-[13px] font-medium text-slate-600">
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleDelete}
                  className="flex-1 py-3 rounded-2xl bg-rose-500 text-white text-[13px] font-medium shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
