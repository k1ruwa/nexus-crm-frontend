import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, X, Mic, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactCard } from '../components/ContactCard';
import { InstallPrompt } from '../components/InstallPrompt';
import { OnboardingDialog } from '../components/OnboardingDialog';
import { Hotbar } from '../components/Hotbar';
import { getAllContacts, Contact, initDB } from '../lib/db';
import { format } from 'date-fns';

type FilterTab = 'all' | 'recents' | 'favorites';

export default function Dashboard() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterTag, setFilterTag] = useState('');

  const today = new Date();
  const dayName = format(today, 'EEEE');
  const dateStr = format(today, 'MMMM d, yyyy');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await initDB();
      const allContacts = await getAllContacts();
      allContacts.sort((a, b) => a.name.localeCompare(b.name));
      setContacts(allContacts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach(c => c.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Tab filter
    if (activeTab === 'recents') {
      filtered = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20);
    } else if (activeTab === 'favorites') {
      filtered = filtered.filter(c => c.favorite);
    }

    // Custom filters
    if (filterSource) {
      filtered = filtered.filter(c => c.source === filterSource);
    }
    if (filterTag) {
      filtered = filtered.filter(c => c.tags?.includes(filterTag));
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [contacts, activeTab, searchQuery, filterSource, filterTag]);

  // Group by first letter (skip for recents)
  const grouped = activeTab === 'recents'
    ? null
    : filteredContacts.reduce<Record<string, Contact[]>>((acc, c) => {
        const letter = c.name[0]?.toUpperCase() || '#';
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(c);
        return acc;
      }, {});
  const sortedLetters = grouped ? Object.keys(grouped).sort() : [];

  const hasActiveCustomFilter = !!filterSource || !!filterTag;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'recents', label: 'Recents' },
    { key: 'favorites', label: 'Favorites' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-32">
      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-semibold text-slate-900">{dayName}</h1>
            <p className="text-[13px] text-slate-500">
              {dateStr}
            </p>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <User className="h-4 w-4 text-slate-600 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mt-4 flex items-center gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                : 'bg-white/50 backdrop-blur-xl border border-white/60 text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustomFilter(!showCustomFilter)}
          className={`ml-auto flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            hasActiveCustomFilter
              ? 'bg-emerald-500 text-white'
              : 'bg-white/50 backdrop-blur-xl border border-white/60 text-slate-500 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[1.5]" />
        </button>
      </div>

      {/* Custom Filter Panel */}
      <AnimatePresence>
        {showCustomFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-5"
          >
            <div className="mt-3 p-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-slate-700">Filters</span>
                {hasActiveCustomFilter && (
                  <button
                    onClick={() => { setFilterSource(''); setFilterTag(''); }}
                    className="text-[11px] text-emerald-600 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-3">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5 block">Source</span>
                <div className="flex gap-2">
                  {['', 'manual', 'camera', 'voice'].map(src => (
                    <button
                      key={src}
                      onClick={() => setFilterSource(src)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        filterSource === src
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100/80 text-slate-500'
                      }`}
                    >
                      {src === '' ? 'Any' : src.charAt(0).toUpperCase() + src.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5 block">Tag</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterTag('')}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        filterTag === '' ? 'bg-slate-900 text-white' : 'bg-slate-100/80 text-slate-500'
                      }`}
                    >
                      Any
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                          filterTag === tag ? 'bg-slate-900 text-white' : 'bg-slate-100/80 text-slate-500'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="px-5 mt-4 mb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 px-5 mt-4">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-[13px]">Loading...</div>
        ) : filteredContacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 flex items-center justify-center mb-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Mic className="w-8 h-8 text-slate-400 stroke-[1.5]" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-800 mb-1">
              {activeTab === 'favorites' ? 'No Favorites Yet' : 'No Connections Yet'}
            </h3>
            <p className="text-[13px] text-slate-500 max-w-[240px] mb-5">
              {activeTab === 'favorites'
                ? 'Mark contacts as favorites to see them here'
                : 'Tap the + button to add your first connection'}
            </p>
            {activeTab === 'all' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/add')}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-[13px] font-medium shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
              >
                Add Connection
              </motion.button>
            )}
          </motion.div>
        ) : activeTab === 'recents' ? (
          <div className="flex flex-col gap-2.5">
            {filteredContacts.map((contact, i) => (
              <ContactCard key={contact.id} contact={contact} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {sortedLetters.map(letter => (
              <div key={letter}>
                <h2 className="text-sm font-semibold text-slate-800 tracking-tight mb-2 ml-1">{letter}</h2>
                <div className="flex flex-col gap-2.5">
                  {grouped![letter].map((contact, i) => (
                    <ContactCard key={contact.id} contact={contact} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Hotbar />
      <InstallPrompt />
      <OnboardingDialog />
    </div>
  );
}