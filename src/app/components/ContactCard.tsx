import { Contact } from '../lib/db';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  index?: number;
}

export function ContactCard({ contact, index = 0 }: ContactCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-emerald-500/80', 'bg-indigo-500/80', 'bg-rose-500/80',
      'bg-sky-500/80', 'bg-amber-500/80', 'bg-violet-500/80',
      'bg-teal-500/80', 'bg-pink-500/80',
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(`/contact/${contact.id}`)}
      className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Avatar */}
      {contact.profileImage ? (
        <img
          src={contact.profileImage}
          alt={contact.name}
          className="h-12 w-12 rounded-2xl object-cover shrink-0"
        />
      ) : (
        <div className={`h-12 w-12 rounded-2xl ${getAvatarColor(contact.name)} flex items-center justify-center shrink-0`}>
          <span className="text-[13px] font-semibold text-white">{getInitials(contact.name)}</span>
        </div>
      )}

      {/* Text stack */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-medium text-slate-800 truncate">{contact.name}</span>
          {contact.aiEnriched && (
            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          )}
        </div>
        {(contact.company || contact.title) && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="text-xs font-medium text-slate-500 truncate">
              {contact.title ? `${contact.title}${contact.company ? ` · ${contact.company}` : ''}` : contact.company}
            </span>
          </div>
        )}
      </div>

      {/* Source badge */}
      {contact.source && contact.source !== 'manual' && (
        <div className="text-[10px] font-medium text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded-md uppercase shrink-0">
          {contact.source}
        </div>
      )}
    </motion.div>
  );
}
