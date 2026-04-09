import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { Hotbar } from '../components/Hotbar';
import { getAllReminders, getContact, updateReminder, Reminder, Contact } from '../lib/db';
import { format, isToday, isTomorrow, isPast, isFuture } from 'date-fns';

interface ReminderWithContact extends Reminder {
  contact?: Contact;
}

export default function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<ReminderWithContact[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'overdue' | 'completed'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReminders(); }, []);

  const loadReminders = async () => {
    try {
      const all = await getAllReminders();
      const withContacts = await Promise.all(
        all.map(async r => ({ ...r, contact: await getContact(r.contactId) }))
      );
      setReminders(withContacts.sort((a, b) => a.dueDate - b.dueDate));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleToggle = async (r: Reminder) => {
    await updateReminder({ ...r, completed: !r.completed });
    await loadReminders();
  };

  const getDueDateLabel = (d: number) => {
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return 'Overdue';
    return format(d, 'MMM d');
  };

  const filtered = reminders.filter(r => {
    if (activeTab === 'upcoming') return !r.completed && isFuture(r.dueDate);
    if (activeTab === 'overdue') return !r.completed && isPast(r.dueDate);
    return r.completed;
  });

  const tabs: { key: typeof activeTab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: reminders.filter(r => !r.completed && isFuture(r.dueDate)).length },
    { key: 'overdue', label: 'Overdue', count: reminders.filter(r => !r.completed && isPast(r.dueDate)).length },
    { key: 'completed', label: 'Done', count: reminders.filter(r => r.completed).length },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-32">
      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reminders</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Manage your follow-ups</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {tabs.map(t => (
            <motion.button
              key={t.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(t.key)}
              className={`p-3 rounded-2xl text-center transition-all ${
                activeTab === t.key
                  ? 'bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                  : 'bg-white/30 border border-white/40'
              }`}
            >
              <p className={`text-2xl font-semibold tracking-tight ${
                t.key === 'overdue' ? 'text-rose-500' : t.key === 'completed' ? 'text-emerald-500' : 'text-indigo-500'
              }`}>{t.count}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{t.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-5">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-[13px]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-slate-400 stroke-[1.5]" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-800 mb-1">No Reminders</h3>
            <p className="text-[13px] text-slate-500">{
              activeTab === 'upcoming' ? 'No upcoming reminders' :
              activeTab === 'overdue' ? 'Nothing overdue!' : 'No completed reminders'
            }</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => r.contact && navigate(`/contact/${r.contactId}`)}
                className="flex items-start gap-3 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer active:scale-[0.98] transition-transform"
              >
                <button onClick={(e) => { e.stopPropagation(); handleToggle(r); }} className="mt-0.5 shrink-0">
                  {r.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 hover:text-slate-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] font-medium ${r.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{r.title}</p>
                  {r.contact && (
                    <p className="text-[12px] text-slate-500 mt-0.5 truncate">{r.contact.name}{r.contact.company ? ` · ${r.contact.company}` : ''}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className={`flex items-center gap-1 ${
                      r.completed ? 'text-slate-400' : isPast(r.dueDate) ? 'text-rose-500' : isToday(r.dueDate) ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      <Calendar className="h-3 w-3" />
                      <span className="text-[11px] font-medium">{getDueDateLabel(r.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-[11px]">{format(r.dueDate, 'h:mm a')}</span>
                    </div>
                  </div>
                </div>
                {!r.completed && isPast(r.dueDate) && (
                  <span className="text-[10px] font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md uppercase shrink-0">Overdue</span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Hotbar />
    </div>
  );
}