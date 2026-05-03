'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { OnboardingData, ManageItem } from '@/types'

// ── Theme tokens ────────────────────────────────────────────────────────────

type Tok = {
  bg: string; bg2: string; border: string
  text: string; second: string; muted: string
  accent: string; cyan: string; track: string
}

const THEMES: Record<'obsidian' | 'arctic', Tok> = {
  obsidian: {
    bg: '#0d0d0f', bg2: '#111114', border: '#1e1e26',
    text: '#f0f4ff', second: '#8892a4', muted: '#454d5e',
    accent: '#3b82f6', cyan: '#06b6d4', track: '#1e1e26',
  },
  arctic: {
    bg: '#f8fafc', bg2: '#ffffff', border: '#e2e8f0',
    text: '#0f172a', second: '#475569', muted: '#94a3b8',
    accent: '#0ea5e9', cyan: '#6366f1', track: '#e2e8f0',
  },
}

const ease = [0.25, 0.46, 0.45, 0.94] as const

const slideVars = {
  enter: (d: number) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -48 }),
}

// ── Shared primitives ───────────────────────────────────────────────────────

function Pill({ label, selected, onClick, t }: { label: string; selected: boolean; onClick: () => void; t: Tok }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', padding: '13px 18px', borderRadius: 10, boxSizing: 'border-box',
        border: `1.5px solid ${selected ? t.accent : t.border}`,
        background: selected ? `${t.accent}1a` : t.bg2,
        color: selected ? t.accent : t.text,
        fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: 15,
        fontWeight: selected ? 500 : 400, cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'border-color 0.15s, background 0.15s, color 0.15s',
      }}
    >
      {label}
      {selected && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={t.accent} strokeWidth="1.5" />
          <polyline points="5 8 7 10.5 11 6" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function CheckOption({ label, checked, toggle, t }: { label: string; checked: boolean; toggle: () => void; t: Tok }) {
  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        width: '100%', padding: '13px 18px', borderRadius: 10, boxSizing: 'border-box',
        border: `1.5px solid ${checked ? t.accent : t.border}`,
        background: checked ? `${t.accent}1a` : t.bg2,
        color: checked ? t.accent : t.text,
        fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: 15,
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'border-color 0.15s, background 0.15s, color 0.15s',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? t.accent : t.muted}`,
        background: checked ? t.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <polyline points="2 5.5 4.5 8 8.5 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label}
    </button>
  )
}

function QHead({ title, sub, t }: { title: string; sub: string; t: Tok }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        fontFamily: 'var(--font-sora, Sora, sans-serif)', fontSize: 26,
        fontWeight: 700, color: t.text, letterSpacing: '-0.03em', margin: '0 0 8px',
      }}>{title}</h2>
      <p style={{
        fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
        fontSize: 14, color: t.second, lineHeight: 1.6, margin: 0,
      }}>{sub}</p>
    </div>
  )
}

// ── Theme preview card (renders in its own theme's colors) ──────────────────

function ThemeCard({ theme, selected, onClick, currentT }: {
  theme: 'obsidian' | 'arctic'; selected: boolean; onClick: () => void; currentT: Tok
}) {
  const isDark = theme === 'obsidian'
  const m = isDark
    ? { label: 'Obsidian', sub: 'Premium Dark', accent: '#3b82f6', cyan: '#06b6d4', bg: '#0d0d0f', card: '#111114', text: '#f0f4ff', muted: '#8892a4', border: '#1e1e26' }
    : { label: 'Arctic Clean', sub: 'Minimal Light', accent: '#0ea5e9', cyan: '#6366f1', bg: '#f8fafc', card: '#ffffff', text: '#0f172a', muted: '#475569', border: '#e2e8f0' }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `2px solid ${selected ? m.accent : currentT.border}`,
        borderRadius: 14, padding: 0, cursor: 'pointer', background: 'transparent',
        overflow: 'hidden', boxSizing: 'border-box',
        boxShadow: selected ? `0 0 0 3px ${m.accent}22` : 'none',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
      }}
    >
      {/* Mini preview in this card's own theme */}
      <div style={{ background: m.bg, padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {[m.accent, m.cyan, m.muted].map((c, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: i === 2 ? 0.45 : 1 }} />
          ))}
        </div>
        <div style={{ background: m.card, borderRadius: 6, padding: '8px 10px', border: `1px solid ${m.border}` }}>
          <div style={{ fontSize: 9, color: m.muted, fontFamily: 'var(--font-dm-sans)', marginBottom: 4 }}>Revenue MTD</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: m.text, fontFamily: 'var(--font-sora)', marginBottom: 6 }}>$12,400</div>
          <div style={{ height: 3, borderRadius: 2, background: m.border }}>
            <div style={{ width: '65%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${m.accent}, ${m.cyan})` }} />
          </div>
        </div>
      </div>
      {/* Label in this card's own theme */}
      <div style={{
        background: selected ? `${m.accent}18` : m.card,
        borderTop: `1px solid ${m.border}`,
        padding: '10px 14px', textAlign: 'left',
        transition: 'background 0.15s',
      }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 12, fontWeight: 600, color: selected ? m.accent : m.text }}>{m.label}</div>
        <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: m.muted }}>{m.sub}</div>
      </div>
    </button>
  )
}

// ── Step components ─────────────────────────────────────────────────────────

function S1Theme({ v, set, t }: { v: OnboardingData['theme']; set: (x: OnboardingData['theme']) => void; t: Tok }) {
  return (
    <div>
      <QHead title="Which color scheme do you prefer?" sub="You can change this anytime in Settings." t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <ThemeCard theme="obsidian" selected={v === 'obsidian'} onClick={() => set('obsidian')} currentT={t} />
        <ThemeCard theme="arctic" selected={v === 'arctic'} onClick={() => set('arctic')} currentT={t} />
      </div>
    </div>
  )
}

function S2Name({ v, set, t }: { v: string; set: (x: string) => void; t: Tok }) {
  return (
    <div>
      <QHead title="What's your agency name?" sub="Used on invoices and reports." t={t} />
      <input
        type="text"
        placeholder="e.g. Creative Co."
        value={v}
        onChange={e => set(e.target.value)}
        autoFocus
        className="auth-input"
        style={{
          width: '100%', height: 56, padding: '16px 20px', borderRadius: 14, boxSizing: 'border-box',
          border: `1.5px solid ${t.border}`, background: t.bg2, color: t.text,
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: 16, outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = t.accent)}
        onBlur={e => (e.currentTarget.style.borderColor = t.border)}
      />
    </div>
  )
}

const SIZES = [
  { v: 'just-me', l: 'Just me' },
  { v: '2-5',     l: '2–5 people' },
  { v: '5-10',    l: '5–10 people' },
  { v: '10+',     l: '10+ people' },
] as const

function S3Team({ v, set, t }: { v: OnboardingData['teamSize']; set: (x: OnboardingData['teamSize']) => void; t: Tok }) {
  return (
    <div>
      <QHead title="How many people on your team?" sub="Helps us set up the right features for you." t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SIZES.map(s => (
          <Pill key={s.v} label={s.l} selected={v === s.v} onClick={() => set(s.v)} t={t} />
        ))}
      </div>
    </div>
  )
}

const ALL_MANAGES: ManageItem[] = ['projects', 'leads', 'invoices', 'finances']
const MANAGE_OPTS: { v: ManageItem; l: string }[] = [
  { v: 'projects', l: 'Projects' },
  { v: 'leads',    l: 'Leads' },
  { v: 'invoices', l: 'Invoices' },
  { v: 'finances', l: 'Finances' },
]

function S4Manages({ v, set, t }: { v: ManageItem[]; set: (x: ManageItem[]) => void; t: Tok }) {
  const allChecked = ALL_MANAGES.every(m => v.includes(m))
  const toggle = (item: ManageItem) =>
    set(v.includes(item) ? v.filter(m => m !== item) : [...v, item])
  const toggleAll = () => set(allChecked ? [] : [...ALL_MANAGES])

  return (
    <div>
      <QHead title="What do you manage?" sub="Select all that apply." t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MANAGE_OPTS.map(m => (
          <CheckOption key={m.v} label={m.l} checked={v.includes(m.v)} toggle={() => toggle(m.v)} t={t} />
        ))}
        <CheckOption label="All of the above" checked={allChecked} toggle={toggleAll} t={t} />
      </div>
    </div>
  )
}

function S5Stripe({ v, set, t }: { v: OnboardingData['stripeIntent']; set: (x: OnboardingData['stripeIntent']) => void; t: Tok }) {
  return (
    <div>
      <QHead
        title="Connect Stripe?"
        sub="Optional. Enables automated invoicing and payments. You can connect anytime in Settings."
        t={t}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Pill label="Yes, connect Stripe" selected={v === 'connect'} onClick={() => set('connect')} t={t} />
        <Pill label="Skip for now" selected={v === 'skip'} onClick={() => set('skip')} t={t} />
      </div>
      {v === 'connect' && (
        <p style={{
          marginTop: 16, fontFamily: 'var(--font-dm-sans)', fontSize: 13,
          color: t.second, lineHeight: 1.6,
        }}>
          You&apos;ll be prompted to connect Stripe from the Settings page after setup.
        </p>
      )}
    </div>
  )
}

// ── Main export ─────────────────────────────────────────────────────────────

const TOTAL = 5

export default function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    theme: 'obsidian', agencyName: '', teamSize: 'just-me', manages: [], stripeIntent: 'skip',
  })

  useEffect(() => {
    window.history.replaceState({}, '', '/onboarding')
  }, [])

  const t = THEMES[data.theme]
  const progress = ((step + 1) / TOTAL) * 100

  const next = () => { setDir(1); setStep(s => s + 1) }
  const back = () => { setDir(-1); setStep(s => s - 1) }

  const finish = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        agency_name: data.agencyName.trim() || null,
        team_size: data.teamSize,
        manages: data.manages,
        stripe_intent: data.stripeIntent,
        theme: data.theme,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch {
      setSaving(false)
    }
  }

  const steps = [
    <S1Theme key="theme"   v={data.theme}        set={v => setData(p => ({ ...p, theme: v }))}        t={t} />,
    <S2Name  key="name"    v={data.agencyName}   set={v => setData(p => ({ ...p, agencyName: v }))}   t={t} />,
    <S3Team  key="team"    v={data.teamSize}     set={v => setData(p => ({ ...p, teamSize: v }))}     t={t} />,
    <S4Manages key="mgmt" v={data.manages}      set={v => setData(p => ({ ...p, manages: v }))}      t={t} />,
    <S5Stripe  key="stripe" v={data.stripeIntent} set={v => setData(p => ({ ...p, stripeIntent: v }))} t={t} />,
  ]

  return (
    <motion.div
      animate={{ backgroundColor: t.bg }}
      transition={{ duration: 0.3, ease }}
      style={{
        minHeight: '100vh', width: '100%', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '72px 24px 40px',
        boxSizing: 'border-box', backgroundColor: t.bg,
      }}
    >
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: t.track, zIndex: 100 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease }}
          style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${t.accent}, ${t.cyan})` }}
        />
      </div>

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '14px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', zIndex: 99,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {[12, 18, 14, 10, 16].map((h, i) => (
              <motion.div
                key={i}
                animate={{ background: t.accent }}
                transition={{ duration: 0.3, ease }}
                style={{ width: 3, height: h, borderRadius: 2, background: t.accent }}
              />
            ))}
          </div>
          <motion.span
            animate={{ color: t.text }}
            transition={{ duration: 0.3, ease }}
            style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontSize: 13, fontWeight: 600, color: t.text }}
          >
            CreatingHarmony
          </motion.span>
        </div>
        <motion.span
          animate={{ color: t.muted }}
          transition={{ duration: 0.3, ease }}
          style={{ fontFamily: 'var(--font-mono, Geist Mono, monospace)', fontSize: 11, letterSpacing: '0.08em', color: t.muted }}
        >
          {step + 1} / {TOTAL}
        </motion.span>
      </div>

      {/* Card */}
      <motion.div
        animate={{ backgroundColor: t.bg2, borderColor: t.border }}
        transition={{ duration: 0.3, ease }}
        style={{
          width: '100%', maxWidth: 500, borderRadius: 20,
          border: `1.5px solid ${t.border}`, backgroundColor: t.bg2,
          padding: '36px 36px 28px', boxSizing: 'border-box',
          boxShadow: data.theme === 'obsidian'
            ? '0 12px 40px rgba(0,0,0,0.6)'
            : '0 4px 24px rgba(15,23,42,0.10)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top accent gradient (Obsidian only) */}
        {data.theme === 'obsidian' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${t.accent}80 40%, ${t.cyan}60 60%, transparent 100%)`,
            pointerEvents: 'none',
          }} />
        )}

        {/* Animated question content */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVars}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.26, ease }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 28, paddingTop: 22, borderTop: `1px solid ${t.border}`,
        }}>
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: t.second,
                padding: '8px 0', transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = t.text)}
              onMouseLeave={e => (e.currentTarget.style.color = t.second)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M9.5 11.5L5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={step === TOTAL - 1 ? finish : next}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: `linear-gradient(135deg, ${t.accent}, ${t.cyan})`,
              border: 'none', borderRadius: 10, padding: '11px 22px',
              cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: '#fff',
              opacity: saving ? 0.7 : 1, transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.opacity = '1' }}
          >
            {saving ? 'Setting up…' : step === TOTAL - 1 ? 'Get Started' : 'Next'}
            {!saving && step < TOTAL - 1 && (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M5.5 11.5l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
