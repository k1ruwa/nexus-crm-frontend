import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, ChevronDown, ChevronRight, Palette, Layers, Type, Square, Sparkles, CircleDot, Move, Bell, Layout, Eye } from 'lucide-react';

// ─── Copy-to-clipboard helper ───
function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/5 overflow-hidden">
      {label && <div className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>}
      <pre className="p-4 pt-2 text-[13px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">{code}</pre>
      <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// ─── Collapsible Section ───
function Section({ icon, title, children, defaultOpen = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/30 transition-colors">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600">{icon}</div>
        <span className="flex-1 text-[15px] font-semibold text-slate-800">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-6 flex flex-col gap-5">{children}</div>}
    </div>
  );
}

function Swatch({ color, name, value }: { color: string; name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl shadow-inner border border-black/5 shrink-0" style={{ background: color }} />
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold text-slate-800">{name}</span>
        <span className="text-[11px] font-mono text-slate-400">{value}</span>
      </div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2">{children}</h3>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-slate-600 leading-relaxed">{children}</p>;
}

// ─── MAIN COMPONENT ───
export function DesignLanguageOverview() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center antialiased font-sans">
      <div className="relative w-full max-w-2xl min-h-screen bg-slate-50">
        {/* Background orbs */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-300/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-300/15 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        </div>

        <div className="relative z-10 px-5 pt-14 pb-20 flex flex-col gap-4">
          {/* Hero */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Design System</span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">Liquid Glass</h1>
            <p className="text-[15px] text-slate-500 mt-2 leading-relaxed max-w-md">
              A translucent, depth-driven design language inspired by Apple's Liquid Glass aesthetic. Built for mobile-first, voice-first experiences with zero visual clutter.
            </p>
          </div>

          {/* ═══════════ 1. PHILOSOPHY ═══════════ */}
          <Section icon={<Eye className="h-4 w-4" />} title="Philosophy & Principles" defaultOpen>
            <Prose>
              This design language is governed by five principles that inform every decision from color to motion:
            </Prose>
            <div className="grid gap-3">
              {[
                { n: '01', t: 'Translucency over opacity', d: 'Every surface hints at what\'s behind it. Use backdrop-blur + low-alpha backgrounds to create depth without weight.' },
                { n: '02', t: 'Reduction over addition', d: 'If an element doesn\'t serve the current task, remove it. The interface should feel like it breathes.' },
                { n: '03', t: 'Motion as meaning', d: 'Animations communicate state changes, not decoration. Spring physics feel natural; linear motion feels robotic.' },
                { n: '04', t: 'Voice-first hierarchy', d: 'The primary action is always audio input. Visual inputs (camera, text) are secondary and contextual.' },
                { n: '05', t: 'Progressive disclosure', d: 'Show only what\'s needed. Complex panels slide in contextually (Dynamic Island pattern) rather than existing statically.' },
              ].map(p => (
                <div key={p.n} className="flex gap-3 p-3 rounded-2xl bg-white/30 border border-white/40">
                  <span className="text-[11px] font-bold text-emerald-500 mt-0.5 shrink-0">{p.n}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">{p.t}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══════════ 2. COLOR SYSTEM ═══════════ */}
          <Section icon={<Palette className="h-4 w-4" />} title="Color System">
            <SubHeading>Surface Palette</SubHeading>
            <Prose>Surfaces use extremely low-alpha whites layered over a soft mesh gradient background. Never use solid backgrounds on cards.</Prose>
            <div className="grid grid-cols-2 gap-3">
              <Swatch color="rgba(255,255,255,0.6)" name="Card Surface" value="bg-white/60" />
              <Swatch color="rgba(255,255,255,0.5)" name="List Item" value="bg-white/50" />
              <Swatch color="rgba(255,255,255,0.7)" name="Hotbar" value="bg-white/70" />
              <Swatch color="rgba(255,255,255,0.8)" name="Modal / Island" value="bg-white/80" />
              <Swatch color="rgba(248,250,252,0.5)" name="Inner Surface" value="bg-slate-50/50" />
              <Swatch color="rgba(226,232,240,0.5)" name="Chip / Badge" value="bg-slate-200/50" />
            </div>

            <SubHeading>Semantic Colors</SubHeading>
            <div className="grid grid-cols-2 gap-3">
              <Swatch color="#10b981" name="Primary / Success" value="emerald-500" />
              <Swatch color="#6366f1" name="Info / Meals" value="indigo-500" />
              <Swatch color="#f43f5e" name="Destructive / Snacks" value="rose-500" />
              <Swatch color="#0ea5e9" name="Drinks / Accent" value="sky-500" />
              <Swatch color="#fbbf24" name="Warning / Caution" value="amber-400" />
              <Swatch color="#0f172a" name="Dark Action" value="slate-900" />
            </div>

            <SubHeading>Quality Indicator Dots</SubHeading>
            <Prose>A 3-tier color-coded system for at-a-glance nutritional quality scoring:</Prose>
            <div className="flex gap-6 items-center mt-1">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" /><span className="text-[12px] text-slate-600">Healthy</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-amber-400 shadow-sm" /><span className="text-[12px] text-slate-600">Moderate</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-rose-500 shadow-sm" /><span className="text-[12px] text-slate-600">Indulgent</span></div>
            </div>

            <SubHeading>Tinted Backgrounds (Icon Containers)</SubHeading>
            <Prose>Icon backgrounds use their semantic color at 10% opacity for a soft, diffused tint:</Prose>
            <CodeBlock code={`// Pattern: bg-{color}-500/10 paired with text-{color}-500
<div className="bg-indigo-500/10"> <Utensils className="text-indigo-500" /> </div>
<div className="bg-rose-500/10">   <Apple className="text-rose-500" />    </div>
<div className="bg-sky-500/10">    <Coffee className="text-sky-500" />   </div>`} label="Icon tint pattern" />

            <SubHeading>Mesh Gradient Background</SubHeading>
            <Prose>The app background uses 3 animated, heavily blurred gradient orbs to create a living, breathing canvas:</Prose>
            <CodeBlock code={`// Three orbs with different colors, sizes, and pulse speeds
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%]
  rounded-full bg-blue-400/30 blur-[100px] animate-pulse"
  style={{ animationDuration: '8s' }} />

<div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%]
  rounded-full bg-rose-300/30 blur-[100px] animate-pulse"
  style={{ animationDuration: '10s' }} />

<div className="absolute bottom-[-10%] left-[20%] w-[70%] h-[70%]
  rounded-full bg-emerald-300/20 blur-[100px] animate-pulse"
  style={{ animationDuration: '12s' }} />`} label="Mesh background orbs" />
          </Section>

          {/* ═══════════ 3. SURFACES & DEPTH ═══════════ */}
          <Section icon={<Layers className="h-4 w-4" />} title="Surfaces, Depth & Borders">
            <SubHeading>Glassmorphism Recipe</SubHeading>
            <Prose>Every surface follows the same formula: translucent background + backdrop blur + soft border + subtle shadow. Adjust intensity per elevation level.</Prose>
            <CodeBlock code={`// Level 1: Cards & Panels (mid elevation)
className="bg-white/60 backdrop-blur-2xl
  border border-white/50
  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
  rounded-3xl"

// Level 2: List items (low elevation)
className="bg-white/50 backdrop-blur-xl
  border border-white/60
  shadow-[0_4px_16px_rgba(0,0,0,0.02)]
  rounded-3xl"

// Level 3: Hotbar / Persistent UI (high elevation)
className="bg-white/70 backdrop-blur-3xl
  border border-white/60
  shadow-[0_16px_40px_rgba(0,0,0,0.1)]
  rounded-full"

// Level 4: Floating Island / Modal (highest elevation)
className="bg-white/80 backdrop-blur-3xl
  border border-white/80
  shadow-[0_24px_48px_rgba(0,0,0,0.12)]
  rounded-[24px]"`} label="Surface elevation levels" />

            <SubHeading>Border Strategy</SubHeading>
            <Prose>Borders are always white at low opacity (white/40 to white/80) to create a frosted edge effect. Never use gray or colored borders on glass surfaces.</Prose>

            <SubHeading>Shadow Scale</SubHeading>
            <div className="grid gap-2 mt-1">
              {[
                { name: 'Whisper', val: '0_4px_16px_rgba(0,0,0,0.02)', use: 'List items' },
                { name: 'Soft', val: '0_8px_30px_rgb(0,0,0,0.04)', use: 'Cards' },
                { name: 'Medium', val: '0_16px_40px_rgba(0,0,0,0.1)', use: 'Hotbar, FABs' },
                { name: 'Strong', val: '0_24px_48px_rgba(0,0,0,0.12)', use: 'Modals, Islands' },
                { name: 'CTA', val: '0_8px_32px_rgba(0,0,0,0.25)', use: 'Primary action button' },
                { name: 'Glow', val: '0_0_40px_rgba(16,185,129,0.4)', use: 'Active state emphasis' },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 border border-white/40">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-800">{s.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100/60 px-1.5 py-0.5 rounded">{s.use}</span>
                  </div>
                </div>
              ))}
            </div>

            <SubHeading>Border Radius Scale</SubHeading>
            <CodeBlock code={`rounded-md      // 6px  - Chips, badges, micro elements
rounded-xl      // 12px - Icon containers, inner surfaces
rounded-2xl     // 16px - Buttons, sub-panels
rounded-3xl     // 24px - Cards, list items, main surfaces
rounded-full    // 9999px - Hotbar, avatars, pills
rounded-[24px]  // Custom - Dynamic Island panels`} label="Radius tokens" />
          </Section>

          {/* ═══════════ 4. TYPOGRAPHY ═══════════ */}
          <Section icon={<Type className="h-4 w-4" />} title="Typography">
            <SubHeading>Font Stack</SubHeading>
            <Prose>System font stack via Tailwind's <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">font-sans</code>. No custom fonts needed - the system's SF Pro / Inter / Segoe UI naturally align with the Liquid Glass aesthetic.</Prose>

            <SubHeading>Scale & Weight Map</SubHeading>
            <div className="flex flex-col gap-3 mt-1">
              {[
                { el: 'Page Title', ex: 'Summary', cls: 'text-3xl font-bold tracking-tight text-slate-900' },
                { el: 'Date Subtitle', ex: 'FRIDAY, JAN 10TH', cls: 'text-sm font-semibold tracking-wider text-slate-500 uppercase' },
                { el: 'Section Header', ex: 'Today\'s Logs', cls: 'text-sm font-semibold text-slate-800 tracking-tight' },
                { el: 'Item Name', ex: 'Grilled Chicken Salad', cls: 'text-[15px] font-medium text-slate-800' },
                { el: 'Numeric Value', ex: '420', cls: 'text-base font-semibold text-slate-800' },
                { el: 'Large Numeric', ex: '1,845', cls: 'text-3xl font-semibold tracking-tight text-slate-800' },
                { el: 'Unit Label', ex: 'Kcal', cls: 'text-xs font-medium uppercase tracking-wider text-slate-500' },
                { el: 'Tiny Unit', ex: 'KCAL', cls: 'text-[10px] font-semibold uppercase text-slate-400' },
                { el: 'Macro Chip', ex: 'P:45g C:12g F:18g', cls: 'text-[10px] font-medium text-slate-500' },
                { el: 'Badge / Label', ex: 'Voice Active', cls: 'text-[11px] font-bold uppercase tracking-wider text-slate-400' },
                { el: 'Action Link', ex: 'See all', cls: 'text-xs font-medium text-blue-500' },
                { el: 'Camera Label', ex: 'SNAP', cls: 'text-[9px] font-bold tracking-widest text-white/90' },
              ].map(t => (
                <div key={t.el} className="flex items-center justify-between p-3 rounded-2xl bg-white/30 border border-white/40">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400">{t.el}</span>
                    <span className={t.cls}>{t.ex}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 max-w-[10rem] text-right leading-tight">{t.cls}</span>
                </div>
              ))}
            </div>

            <SubHeading>Text Color Hierarchy</SubHeading>
            <CodeBlock code={`text-slate-900   // Primary headings
text-slate-800   // Body text, item names, values
text-slate-600   // Secondary labels (macro names)
text-slate-500   // Tertiary text (time, units, dates)
text-slate-400   // Quaternary (tiny labels, inactive icons)
text-white       // On dark surfaces (CTA button, camera)
text-white/90    // Slightly muted white (camera label)`} label="Text color scale" />
          </Section>

          {/* ═══════════ 5. COMPONENTS ═══════════ */}
          <Section icon={<Square className="h-4 w-4" />} title="Component Patterns">
            <SubHeading>Glass Card</SubHeading>
            <Prose>The foundational container. Used for dashboards, summaries, and grouped content.</Prose>
            <CodeBlock code={`<div className="rounded-3xl bg-white/60 p-6
  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
  backdrop-blur-2xl border border-white/50">
  {children}
</div>`} label="Glass card" />

            <SubHeading>List Item</SubHeading>
            <Prose>Used for food logs, history items, and any repeated row. Includes icon container, text stack, quality dot, and trailing value.</Prose>
            <CodeBlock code={`<div className="flex items-center justify-between p-4
  rounded-3xl bg-white/50 backdrop-blur-xl
  border border-white/60
  shadow-[0_4px_16px_rgba(0,0,0,0.02)]">

  {/* Leading: Tinted icon */}
  <div className="flex h-12 w-12 items-center justify-center
    rounded-2xl bg-indigo-500/10">
    <Utensils className="h-5 w-5 text-indigo-500" />
  </div>

  {/* Center: Text stack */}
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <span className="text-[15px] font-medium text-slate-800">
        {name}
      </span>
      <div className="h-2 w-2 rounded-full bg-emerald-500" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-500">{time}</span>
      <div className="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded-md">
        P:45g C:12g F:18g
      </div>
    </div>
  </div>

  {/* Trailing: Value */}
  <div className="flex items-baseline gap-1">
    <span className="text-base font-semibold text-slate-800">420</span>
    <span className="text-[10px] font-semibold uppercase text-slate-400">
      Kcal
    </span>
  </div>
</div>`} label="List item anatomy" />

            <SubHeading>Floating Hotbar</SubHeading>
            <Prose>A pill-shaped persistent navigation bar pinned to the bottom of the viewport. The primary action (voice) protrudes above as an elevated FAB.</Prose>
            <CodeBlock code={`<div className="fixed bottom-0 left-0 right-0 z-40
  px-6 pb-8 pt-4 pointer-events-none">
  <div className="mx-auto flex w-full max-w-sm items-center
    justify-between rounded-full bg-white/70 px-8 py-4
    shadow-[0_16px_40px_rgba(0,0,0,0.1)]
    backdrop-blur-3xl border border-white/60
    pointer-events-auto relative">

    {/* Nav icons: stroke-[1.5] for consistent weight */}
    <button className="text-slate-400
      hover:text-slate-800 transition-colors">
      <Home className="h-6 w-6 stroke-[1.5]" />
    </button>

    {/* Protruding FAB */}
    <div className="absolute left-1/2 -top-6 -translate-x-1/2">
      <button className="flex h-[4.5rem] w-[4.5rem]
        items-center justify-center rounded-full
        bg-slate-900 text-white
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        <Mic className="h-7 w-7 stroke-[1.5]" />
      </button>
    </div>
  </div>
</div>`} label="Floating hotbar" />

            <SubHeading>Dynamic Island Panel</SubHeading>
            <Prose>A contextual panel that slides up from the hotbar using spring animation. Houses multi-modal input (voice + camera). Appears only when active.</Prose>
            <CodeBlock code={`<AnimatePresence>
  {isActive && (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className="absolute -top-[8rem] left-0 right-0
        mx-auto w-[calc(100%-2rem)]
        bg-white/80 backdrop-blur-3xl rounded-[24px]
        p-3 shadow-[0_24px_48px_rgba(0,0,0,0.12)]
        border border-white/80
        flex items-stretch gap-3">
      {/* Content sections */}
    </motion.div>
  )}
</AnimatePresence>`} label="Dynamic Island" />

            <SubHeading>Circular Progress Ring</SubHeading>
            <Prose>SVG-based calorie ring with animated stroke-dashoffset. Uses Motion for smooth transitions.</Prose>
            <CodeBlock code={`const circumference = 2 * Math.PI * 45; // r=45
const offset = circumference - (circumference * percent) / 100;

<svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
  {/* Track */}
  <circle className="text-slate-200/50 stroke-current"
    strokeWidth="8" cx="50" cy="50" r="45" fill="transparent" />

  {/* Progress */}
  <motion.circle className="text-emerald-500 stroke-current"
    strokeWidth="8" strokeLinecap="round"
    cx="50" cy="50" r="45" fill="transparent"
    initial={{ strokeDashoffset: circumference }}
    animate={{ strokeDashoffset: offset }}
    transition={{ duration: 1, ease: 'easeOut' }}
    style={{ strokeDasharray: circumference }} />
</svg>`} label="Progress ring" />

            <SubHeading>Macro Progress Bar</SubHeading>
            <CodeBlock code={`<div className="h-1.5 w-full rounded-full overflow-hidden
  bg-emerald-500/10">
  <motion.div
    className="h-full rounded-full bg-emerald-500"
    initial={{ width: 0 }}
    animate={{ width: \`\${percent}%\` }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  />
</div>`} label="Macro bar" />
          </Section>

          {/* ═══════════ 6. MOTION ═══════════ */}
          <Section icon={<Move className="h-4 w-4" />} title="Motion & Animation">
            <SubHeading>Spring Defaults</SubHeading>
            <Prose>All interactive animations use spring physics for a natural, responsive feel. Avoid ease-in-out for UI transitions.</Prose>
            <CodeBlock code={`// Primary spring (panels, islands, modals)
transition={{ type: "spring", stiffness: 300, damping: 25 }}

// Gentle spring (subtle shifts)
transition={{ type: "spring", stiffness: 200, damping: 20 }}

// Snappy spring (button feedback)
whileTap={{ scale: 0.95 }}`} label="Spring presets" />

            <SubHeading>Entry Animations</SubHeading>
            <CodeBlock code={`// List items: staggered fade-up
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1, duration: 0.4 }}

// Progress bars: width from zero
initial={{ width: 0 }}
animate={{ width: \`\${percent}%\` }}
transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}

// Dynamic Island: scale + slide up
initial={{ opacity: 0, y: 30, scale: 0.9 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 20, scale: 0.95 }}`} label="Entry patterns" />

            <SubHeading>Ambient / Looping Animations</SubHeading>
            <CodeBlock code={`// Voice wave bars
animate={{ height: ['20%', '100%', '20%'] }}
transition={{ repeat: Infinity, duration: 0.6,
  delay: i * 0.1, ease: "easeInOut" }}

// Breathing pulse (mic indicator)
animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
transition={{ duration: 1.5, repeat: Infinity }}

// Scanner line
animate={{ y: ['-100%', '300%'] }}
transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}

// Background orbs
className="animate-pulse"
style={{ animationDuration: '8s' }} // Slow, organic`} label="Looping animations" />

            <SubHeading>Hover & Tap Feedback</SubHeading>
            <CodeBlock code={`// Icon buttons: color transition
className="text-slate-400 hover:text-slate-800 transition-colors"

// Avatar / clickable: scale pop
className="hover:scale-105 transition-transform"

// Physical press: active shrink
className="active:scale-95"

// Motion tap (for prominent buttons)
<motion.button whileTap={{ scale: 0.95 }}>`} label="Interaction feedback" />
          </Section>

          {/* ═══════════ 7. ICONOGRAPHY ═══════════ */}
          <Section icon={<CircleDot className="h-4 w-4" />} title="Iconography">
            <SubHeading>Library & Style</SubHeading>
            <Prose>All icons from <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">lucide-react</code>. Consistent stroke weight and sizing across all contexts.</Prose>
            <CodeBlock code={`// Standard nav/action icons
<Icon className="h-6 w-6 stroke-[1.5]" />

// Category icons (inside tinted containers)
<Icon className="h-5 w-5 text-{color}-500" />

// Small indicator icons
<Icon className="h-4 w-4 text-{color}-500" />

// Icon stroke weight: always stroke-[1.5]
// This creates a refined, thin line that matches
// the lightweight glass aesthetic.`} label="Icon sizing" />

            <SubHeading>Icon Color Rules</SubHeading>
            <Prose>Nav icons use <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">text-slate-400</code> (inactive) and <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">text-slate-800</code> (hover/active). Category icons use their semantic color.</Prose>
          </Section>

          {/* ═══════════ 8. LAYOUT ═══════════ */}
          <Section icon={<Layout className="h-4 w-4" />} title="Layout & Spacing">
            <SubHeading>App Shell</SubHeading>
            <Prose>The app is constrained to <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">max-w-md</code> (448px) centered on screen with a shadow to lift it from the page background. This creates a device-frame feel.</Prose>
            <CodeBlock code={`<div className="min-h-screen bg-slate-100 flex justify-center">
  <div className="relative w-full max-w-md min-h-screen
    bg-slate-50 overflow-x-hidden shadow-2xl">
    <MeshBackground />
    <div className="relative z-10">
      {/* Content */}
    </div>
    <Hotbar />
  </div>
</div>`} label="App shell" />

            <SubHeading>Spacing System</SubHeading>
            <CodeBlock code={`// Horizontal page padding
px-5 (20px) or px-6 (24px)

// Header top padding (safe area)
pt-12

// Section vertical spacing
mt-8 between major sections

// Card internal padding
p-6 for dashboard cards
p-4 for list items
p-3 for island panels
p-5 for collapsible sections

// List item gaps
gap-3 between list items
gap-4 between macro rows
gap-6 between nav icons

// Bottom scroll padding (for hotbar clearance)
pb-32`} label="Spacing tokens" />
          </Section>

          {/* ═══════════ 9. FEEDBACK ═══════════ */}
          <Section icon={<Bell className="h-4 w-4" />} title="Feedback & Notifications">
            <SubHeading>Toast Notifications</SubHeading>
            <Prose>Using <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">sonner</code> for minimal, non-intrusive success feedback. Always positioned at top-center for thumb-zone clearance.</Prose>
            <CodeBlock code={`import { Toaster, toast } from 'sonner';

// Setup
<Toaster position="top-center" theme="light" />

// Usage
toast.success('Added Protein Shake');
toast.success('Label scanned & logged');`} label="Toast pattern" />

            <SubHeading>Active State Glow</SubHeading>
            <Prose>When the primary CTA is active (recording), it transitions from dark to emerald with a colored box-shadow glow:</Prose>
            <CodeBlock code={`// Inactive: dark, authoritative
className="bg-slate-900 bg-gradient-to-tr
  from-slate-800 to-slate-950
  border-slate-700/50
  shadow-[0_8px_32px_rgba(0,0,0,0.25)]"

// Active: emerald glow
className="bg-emerald-500 bg-gradient-to-tr
  from-emerald-600 to-emerald-400
  border-emerald-400
  shadow-[0_0_40px_rgba(16,185,129,0.4)]"`} label="CTA state transitions" />

            <SubHeading>Voice-Active Stop Icon</SubHeading>
            <Prose>When recording, the mic icon morphs into a stop square: <code className="text-[12px] bg-slate-100 px-1 rounded font-mono">w-4 h-4 rounded-sm bg-white</code>. This provides an instant visual cue that the system is listening.</Prose>
          </Section>

          {/* ═══════════ 10. QUICK REFERENCE ═══════════ */}
          <Section icon={<Sparkles className="h-4 w-4" />} title="Quick Reference Cheatsheet">
            <CodeBlock code={`/* ═══════════════════════════════════════════
   LIQUID GLASS DESIGN LANGUAGE — CHEATSHEET
   ═══════════════════════════════════════════ */

/* 1. GLASS SURFACE */
.glass-card {
  @apply bg-white/60 backdrop-blur-2xl
    border border-white/50 rounded-3xl
    shadow-[0_8px_30px_rgb(0,0,0,0.04)];
}

.glass-item {
  @apply bg-white/50 backdrop-blur-xl
    border border-white/60 rounded-3xl
    shadow-[0_4px_16px_rgba(0,0,0,0.02)];
}

.glass-bar {
  @apply bg-white/70 backdrop-blur-3xl
    border border-white/60 rounded-full
    shadow-[0_16px_40px_rgba(0,0,0,0.1)];
}

.glass-island {
  @apply bg-white/80 backdrop-blur-3xl
    border border-white/80 rounded-[24px]
    shadow-[0_24px_48px_rgba(0,0,0,0.12)];
}

/* 2. MESH BACKGROUND (3 orbs) */
.orb { @apply absolute rounded-full blur-[100px] animate-pulse; }
.orb-blue    { @apply bg-blue-400/30;    animation-duration: 8s; }
.orb-rose    { @apply bg-rose-300/30;    animation-duration: 10s; }
.orb-emerald { @apply bg-emerald-300/20; animation-duration: 12s; }

/* 3. ICON PATTERN */
.icon-container {
  @apply flex h-12 w-12 items-center justify-center rounded-2xl;
  /* Add bg-{color}-500/10 + text-{color}-500 */
}

/* 4. TEXT HIERARCHY */
.text-hero     { @apply text-3xl font-bold tracking-tight text-slate-900; }
.text-subtitle { @apply text-sm font-semibold tracking-wider text-slate-500 uppercase; }
.text-section  { @apply text-sm font-semibold text-slate-800 tracking-tight; }
.text-item     { @apply text-[15px] font-medium text-slate-800; }
.text-value    { @apply text-base font-semibold text-slate-800; }
.text-unit     { @apply text-[10px] font-semibold uppercase text-slate-400; }
.text-chip     { @apply text-[10px] font-medium text-slate-500; }

/* 5. NAV ICONS */
.nav-icon {
  @apply text-slate-400 hover:text-slate-800
    transition-colors h-6 w-6 stroke-[1.5];
}

/* 6. QUALITY DOTS */
.dot-green  { @apply h-2 w-2 rounded-full bg-emerald-500 shadow-sm; }
.dot-yellow { @apply h-2 w-2 rounded-full bg-amber-400 shadow-sm; }
.dot-red    { @apply h-2 w-2 rounded-full bg-rose-500 shadow-sm; }

/* 7. SPRING ANIMATION (Motion) */
/* Panel:  type:"spring", stiffness:300, damping:25 */
/* List:   delay: i*0.1, duration: 0.4              */
/* Button: whileTap={{ scale: 0.95 }}               */`} label="Complete cheatsheet" />
          </Section>

          {/* Footer */}
          <div className="text-center mt-6 text-[11px] text-slate-400">
            Liquid Glass Design Language v1.0 &mdash; Built for mobile-first, voice-first applications
          </div>
        </div>
      </div>
    </div>
  );
}
