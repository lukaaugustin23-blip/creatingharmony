'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const C = {
  obsidian: { bg: '#0d0d0f', panel: '#111114', border: '#1e1e26', accent: '#3b82f6', accent2: '#06b6d4', text: '#f0f4ff', second: '#8892a4', muted: '#454d5e' },
  arctic:   { bg: '#f8fafc', panel: '#ffffff',  border: '#e2e8f0', accent: '#0ea5e9', accent2: '#6366f1', text: '#0f172a', second: '#475569', muted: '#94a3b8' },
} as const

type Colors = typeof C[keyof typeof C]

interface Props { userId: string; theme: 'obsidian' | 'arctic'; onComplete: () => void }

interface Answers {
  agencyName: string; agencyType: string; teamSize: string
  revenueModel: string; challenges: string[]; features: string[]
}

const AGENCY_TYPES = ['SMMA', 'Web Design', 'Creative', 'Development', 'Consulting', 'Other']
const TEAM_SIZES = [
  { value: 'solo', emoji: '🧑',  label: 'Just me',     sub: 'Solo operator, full control' },
  { value: '2-5',  emoji: '👥',  label: '2–5 people',  sub: 'Small tight-knit team' },
  { value: '6-15', emoji: '🏢',  label: '6–15 people', sub: 'Growing agency' },
  { value: '15+',  emoji: '🏙️', label: '15+ people',  sub: 'Established operation' },
]
const REVENUE_MODELS = [
  { value: 'retainers', emoji: '🔄', label: 'Retainers', sub: 'Monthly recurring revenue' },
  { value: 'projects',  emoji: '📦', label: 'Projects',  sub: 'One-time project fees' },
  { value: 'both',      emoji: '⚡', label: 'Both',      sub: 'Mix of retainers and projects' },
]
const CHALLENGES = [
  { value: 'payments', emoji: '💳', label: 'Getting paid',      sub: 'Chasing invoices and late payments' },
  { value: 'projects', emoji: '📋', label: 'Project chaos',     sub: 'Deadlines slipping and scope creep' },
  { value: 'clients',  emoji: '🤝', label: 'Client management', sub: 'Losing track of leads and follow-ups' },
  { value: 'team',     emoji: '👥', label: 'Team coordination', sub: 'Unclear ownership and blockers' },
  { value: 'money',    emoji: '📊', label: 'Financial clarity', sub: 'No clear view of profit and cash' },
]
const FEATURES = [
  { id: 'invoicing', label: 'Invoicing', sub: 'Automated billing and payments' },
  { id: 'projects',  label: 'Projects',  sub: 'Track work and deadlines' },
  { id: 'leads',     label: 'Leads',     sub: 'Pipeline and CRM' },
  { id: 'finance',   label: 'Finance',   sub: 'Revenue, expenses, profit' },
  { id: 'scripts',   label: 'Scripts',   sub: 'Sales scripts and templates' },
  { id: 'team',      label: 'Team',      sub: 'Workload and permissions' },
]
const CH_TO_FEAT: Record<string, string> = { payments: 'invoicing', projects: 'projects', clients: 'leads', team: 'team', money: 'finance' }

const grad = (c: Colors) => `linear-gradient(135deg, ${c.accent}, ${c.accent2})`

// ── Shared primitives ─────────────────────────────────────────────────────────
function QHead({ title, sub, c }: { title: string; sub?: string; c: Colors }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 700, color: c.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: c.second, margin: 0 }}>{sub}</p>}
    </div>
  )
}

function OptionCard({ emoji, label, sub, selected, onClick, c }: { emoji: string; label: string; sub: string; selected: boolean; onClick: () => void; c: Colors }) {
  return (
    <button onClick={onClick} style={{
      height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
      borderRadius: 12, cursor: 'pointer', background: c.panel, textAlign: 'left', width: '100%',
      border: selected ? `2px solid ${c.accent}` : `1px solid ${c.border}`, transition: 'border 0.15s',
    }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <div>
        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14, color: c.text }}>{label}</div>
        <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: c.muted }}>{sub}</div>
      </div>
    </button>
  )
}

function Toggle({ on, onToggle, accent }: { on: boolean; onToggle: () => void; accent: string }) {
  return (
    <div onClick={onToggle} style={{ width: 36, height: 20, borderRadius: 10, cursor: 'pointer', background: on ? accent : '#454d5e', position: 'relative', transition: 'background 0.15s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
    </div>
  )
}

// ── Question screens ──────────────────────────────────────────────────────────
function Q0({ a, set, c }: { a: Answers; set: React.Dispatch<React.SetStateAction<Answers>>; c: Colors }) {
  return (
    <div>
      <QHead title="What's your agency called?" sub="We'll use this across your workspace" c={c} />
      <input autoFocus value={a.agencyName} onChange={e => set(x => ({ ...x, agencyName: e.target.value }))} placeholder="Agency name"
        style={{ width: '100%', height: 52, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '0 16px', fontFamily: 'Sora,sans-serif', fontWeight: 500, fontSize: 16, color: c.text, outline: 'none', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {AGENCY_TYPES.map(t => (
          <button key={t} onClick={() => set(x => ({ ...x, agencyType: t }))}
            style={{ height: 32, padding: '0 14px', borderRadius: 999, fontFamily: 'DM Sans,sans-serif', fontSize: 13, cursor: 'pointer', background: a.agencyType === t ? c.accent : c.panel, color: a.agencyType === t ? '#fff' : c.second, border: `1px solid ${a.agencyType === t ? c.accent : c.border}`, transition: 'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

function Q1({ a, set, c }: { a: Answers; set: React.Dispatch<React.SetStateAction<Answers>>; c: Colors }) {
  return (
    <div>
      <QHead title="How big is your team?" c={c} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TEAM_SIZES.map(o => <OptionCard key={o.value} {...o} selected={a.teamSize === o.value} onClick={() => set(x => ({ ...x, teamSize: o.value }))} c={c} />)}
      </div>
    </div>
  )
}

function Q2({ a, set, c }: { a: Answers; set: React.Dispatch<React.SetStateAction<Answers>>; c: Colors }) {
  return (
    <div>
      <QHead title="How do you make your money?" c={c} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {REVENUE_MODELS.map(o => <OptionCard key={o.value} {...o} selected={a.revenueModel === o.value} onClick={() => set(x => ({ ...x, revenueModel: o.value }))} c={c} />)}
      </div>
    </div>
  )
}

function Q3({ a, set, c }: { a: Answers; set: React.Dispatch<React.SetStateAction<Answers>>; c: Colors }) {
  const toggle = (val: string) => set(x => ({ ...x, challenges: x.challenges.includes(val) ? x.challenges.filter(v => v !== val) : [...x.challenges, val] }))
  return (
    <div>
      <QHead title="What's eating most of your time?" sub="Select all that apply" c={c} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CHALLENGES.map(o => {
          const on = a.challenges.includes(o.value)
          return (
            <button key={o.value} onClick={() => toggle(o.value)} style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderRadius: 12, cursor: 'pointer', background: c.panel, textAlign: 'left', width: '100%', border: on ? `2px solid ${c.accent}` : `1px solid ${c.border}`, transition: 'border 0.15s' }}>
              <span style={{ fontSize: 22 }}>{o.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14, color: c.text }}>{o.label}</div>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: c.muted }}>{o.sub}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: on ? grad(c) : 'transparent', border: on ? 'none' : `1.5px solid ${c.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Q4({ a, set, c }: { a: Answers; set: React.Dispatch<React.SetStateAction<Answers>>; c: Colors }) {
  const toggle = (id: string) => set(x => ({ ...x, features: x.features.includes(id) ? x.features.filter(f => f !== id) : [...x.features, id] }))
  return (
    <div>
      <QHead title="What do you need most?" sub="Pre-selected based on your challenges" c={c} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FEATURES.map(f => (
          <div key={f.id} onClick={() => toggle(f.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48, cursor: 'pointer', borderBottom: `1px solid ${c.border}` }}>
            <div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14, color: c.text }}>{f.label}</div>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: c.muted }}>{f.sub}</div>
            </div>
            <Toggle on={a.features.includes(f.id)} onToggle={() => toggle(f.id)} accent={c.accent} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessStep({ c }: { c: Colors }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: '#fff' }}>✓</div>
      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 24, color: c.text, marginBottom: 8 }}>Your dashboard is ready ✓</div>
      <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: c.muted }}>Rearranging your workspace...</div>
    </motion.div>
  )
}

const SLIDE = { enter: { x: 40, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } }

// ── Main export ───────────────────────────────────────────────────────────────
export default function SetupQuizCard({ userId, theme, onComplete }: Props) {
  const c = C[theme]
  const [visible, setVisible] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [answers, setAnswers] = useState<Answers>({ agencyName: '', agencyType: '', teamSize: '', revenueModel: '', challenges: [], features: [] })

  useEffect(() => {
    const v = localStorage.getItem('setup-quiz-dismissed')
    if (v && Date.now() - parseInt(v) < 3 * 24 * 60 * 60 * 1000) setVisible(false)
  }, [])

  // Pre-populate features on entering Q4
  useEffect(() => {
    if (step === 4) {
      const auto = answers.challenges.map(ch => CH_TO_FEAT[ch]).filter(Boolean)
      setAnswers(a => ({ ...a, features: Array.from(new Set(['projects', ...auto])) }))
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() { localStorage.setItem('setup-quiz-dismissed', String(Date.now())); setVisible(false) }

  async function handleComplete() {
    setCompleting(true)
    try {
      await createClient().from('profiles').upsert({
        id: userId, agency_name: answers.agencyName, agency_type: answers.agencyType,
        team_size: answers.teamSize, biggest_challenges: answers.challenges,
        enabled_modules: answers.features, setup_quiz_complete: true,
        updated_at: new Date().toISOString(),
      })
    } catch (_) { /* non-blocking */ }
    setTimeout(() => { setModalOpen(false); setDone(true); setVisible(false); onComplete() }, 1500)
  }

  function canAdvance() {
    if (step === 0) return answers.agencyName.trim().length > 0 && answers.agencyType !== ''
    if (step === 1) return answers.teamSize !== ''
    if (step === 2) return answers.revenueModel !== ''
    if (step === 3) return answers.challenges.length > 0
    return true
  }

  function advance() { step < 4 ? setStep(s => s + 1) : handleComplete() }

  const shadow = theme === 'obsidian' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)'
  const btnStyle = (enabled: boolean): React.CSSProperties => ({
    background: enabled ? grad(c) : c.muted + '55', border: 'none', borderRadius: 10,
    padding: '12px 24px', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14,
    color: enabled ? '#fff' : c.muted, cursor: enabled ? 'pointer' : 'not-allowed', transition: 'background 0.2s',
  })

  return (
    <>
      {/* ── Floating card ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && !done && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', delay: 1, stiffness: 260, damping: 22 }}
            style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 50, width: 320, background: c.panel, border: `1px solid ${c.border}`, borderRadius: 16, padding: 20, boxShadow: shadow }}>

            <button onClick={dismiss} style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: '50%', background: c.muted + '33', color: c.muted, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>×</button>

            <div style={{ height: 3, borderRadius: 2, background: c.border, marginBottom: 16 }}>
              <div style={{ width: 0, height: '100%', borderRadius: 2, background: grad(c) }} />
            </div>

            <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.accent, marginBottom: 6 }}>QUICK SETUP</div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 16, color: c.text, marginBottom: 6 }}>Personalize your workspace</div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: c.muted, marginBottom: 16 }}>2 minutes · Makes everything work better for you</div>

            <motion.button whileHover={{ scale: 1.02 }} onClick={() => setModalOpen(true)}
              style={{ width: '100%', height: 44, background: grad(c), border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14, color: '#fff' }}>
              Let&apos;s do it →
            </motion.button>

            <div onClick={dismiss} style={{ textAlign: 'center', marginTop: 10, fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: c.muted, cursor: 'pointer' }}>Maybe later</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setModalOpen(false)}>

            <motion.div key="modal" initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 560, maxWidth: 'calc(100vw - 32px)', background: c.panel, border: `1px solid ${c.border}`, borderRadius: 20, padding: '36px 40px' }}>

              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%', background: c.muted + '33', color: c.muted, border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>

              {/* Progress */}
              <div style={{ height: 4, background: c.border, borderRadius: 2, marginBottom: 28 }}>
                <motion.div animate={{ width: `${(step / 5) * 100}%` }} transition={{ duration: 0.3 }}
                  style={{ height: '100%', borderRadius: 2, background: grad(c) }} />
              </div>

              {/* Questions */}
              <AnimatePresence mode="wait">
                {completing ? (
                  <SuccessStep key="success" c={c} />
                ) : (
                  <motion.div key={step} variants={SLIDE} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}>
                    {step === 0 && <Q0 a={answers} set={setAnswers} c={c} />}
                    {step === 1 && <Q1 a={answers} set={setAnswers} c={c} />}
                    {step === 2 && <Q2 a={answers} set={setAnswers} c={c} />}
                    {step === 3 && <Q3 a={answers} set={setAnswers} c={c} />}
                    {step === 4 && <Q4 a={answers} set={setAnswers} c={c} />}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nav */}
              {!completing && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
                  {step > 0
                    ? <button onClick={() => setStep(s => s - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: c.muted }}>← Back</button>
                    : <div />}
                  <motion.button whileHover={canAdvance() ? { scale: 1.02 } : {}} onClick={canAdvance() ? advance : undefined} style={btnStyle(canAdvance())}>
                    {step < 4 ? 'Next →' : 'Complete setup →'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
