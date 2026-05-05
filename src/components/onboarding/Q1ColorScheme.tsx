'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

// ── Local color constants ────────────────────────────────────────────────────

const C = {
  obsidian: {
    bg:     '#0d0d0f',
    panel:  '#111114',
    border: '#1e1e26',
    accent: '#3b82f6',
    accent2:'#06b6d4',
    text:   '#f0f4ff',
    second: '#8892a4',
    muted:  '#454d5e',
    track:  '#1e1e26',
  },
  arctic: {
    bg:     '#f8fafc',
    panel:  '#ffffff',
    border: '#e2e8f0',
    accent: '#0ea5e9',
    accent2:'#6366f1',
    text:   '#0f172a',
    second: '#475569',
    muted:  '#94a3b8',
    track:  '#e2e8f0',
  },
} as const

type Theme = 'obsidian' | 'arctic'

// ── Props ────────────────────────────────────────────────────────────────────

interface Q1ColorSchemeProps {
  userId: string
  onDone: (theme: Theme) => void
}

// ── DashPreview ───────────────────────────────────────────────────────────────

function DashPreview({ theme }: { theme: Theme }) {
  const d      = theme === 'obsidian'
  const bg     = d ? '#0d0d0f' : '#f8fafc'
  const wBg    = d ? '#111114' : '#ffffff'
  const border = d ? '#1e1e26' : 'rgba(15,23,42,0.08)'
  const text   = d ? '#f0f4ff' : '#0f172a'
  const second = d ? '#8892a4' : '#475569'
  const muted  = d ? '#454d5e' : '#94a3b8'
  const accent = d ? '#3b82f6' : '#0ea5e9'
  const cyan   = d ? '#06b6d4' : '#6366f1'
  const shdw   = d ? '0 2px 20px rgba(0,0,0,0.55)' : '0 2px 12px rgba(15,23,42,0.07)'

  const [revenue, setRevenue] = useState(0)
  const [profit,  setProfit]  = useState(0)

  useEffect(() => {
    let r = 0
    const rInc = 50350 / 42
    const rT = setInterval(() => {
      r += rInc
      if (r >= 50350) { setRevenue(50350); clearInterval(rT) }
      else setRevenue(Math.round(r))
    }, 25)
    let p = 0
    const pInc = 176 / 32
    const pT = setInterval(() => {
      p += pInc
      if (p >= 176) { setProfit(176); clearInterval(pT) }
      else setProfit(Math.round(p))
    }, 22)
    return () => { clearInterval(rT); clearInterval(pT) }
  }, [])

  const EB: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
  const ctr = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }
  const itm = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EB } } }

  const w = {
    background: wBg,
    borderRadius: 20,
    border: `1px solid ${border}`,
    boxShadow: shdw,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  }

  // Revenue chart — large, fills bottom of hero card
  const rCh = 76, rCw = 320
  const rVals = [14, 22, 17, 32, 26, 42, 35, 50, 44, 64]
  const rPts  = rVals.map((v, i) => `${(i / 9) * rCw},${rCh - (v / 64) * rCh * 0.9}`).join(' ')
  const rFill = `0,${rCh} ${rPts} ${rCw},${rCh}`
  const rGrad = `rg-${theme}`

  // Net Profit micro chart
  const mCh = 28, mCw = 80
  const mVals = [9, 13, 11, 17, 21, 28]
  const mPts  = mVals.map((v, i) => `${(i / 5) * mCw},${mCh - (v / 28) * mCh * 0.85}`).join(' ')
  const mFill = `0,${mCh} ${mPts} ${mCw},${mCh}`
  const mGrad = `mg-${theme}`

  const TASKS = [
    { label: 'Follow up with Mike R.',     time: '10:00 AM', dot: '#ef4444' },
    { label: 'Send proposal to Acme Co.',  time: '1:30 PM',  dot: accent   },
    { label: 'Review Q2 budget',           time: '3:00 PM',  dot: muted    },
  ]

  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      display: 'flex', flexDirection: 'column',
      padding: '58px 16px 16px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {d && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,transparent,${accent}80 40%,${cyan}60 60%,transparent)`,
        }} />
      )}

      <div style={{
        fontFamily: 'Geist Mono,monospace', fontSize: 9,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: muted, marginBottom: 10, flexShrink: 0,
      }}>
        {d ? 'Obsidian Premium' : 'Arctic Clean'} · Preview
      </div>

      <motion.div
        variants={ctr}
        initial="hidden"
        animate="show"
        style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: 8, minHeight: 0,
        }}
      >

        {/* Row 1: Revenue — full width */}
        <motion.div variants={itm} style={{
          ...w, gridColumn: '1 / -1',
          padding: '16px 18px 0',
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          {d && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg,transparent,${accent}80,${cyan}55,transparent)`,
            }} />
          )}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 3, flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'Geist Mono,monospace', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: muted,
            }}>Revenue MTD</div>
            <span style={{
              fontFamily: 'Geist Mono,monospace', fontSize: 10, fontWeight: 500,
              color: '#10b981',
              background: d ? 'rgba(16,185,129,0.14)' : '#d1fae5',
              padding: '2px 8px', borderRadius: 999,
            }}>+28%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <div style={{
              fontFamily: 'Sora,sans-serif', fontSize: 42, fontWeight: 700,
              letterSpacing: '-0.04em', color: accent, lineHeight: 1,
            }}>
              ${revenue.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: second }}>this month</div>
          </div>
          {/* Chart fills all remaining vertical space */}
          <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${rCw} ${rCh}`} preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id={rGrad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={d ? 0.32 : 0.15} />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.polygon
                points={rFill} fill={`url(#${rGrad})`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.polyline
                points={rPts} fill="none" stroke={accent} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.32, ease: 'easeOut' }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Row 2: Active Leads */}
        <motion.div variants={itm} style={{
          ...w, padding: 16,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{
            fontFamily: 'Geist Mono,monospace', fontSize: 9,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: muted, marginBottom: 3, flexShrink: 0,
          }}>Active Leads</div>
          <div style={{
            fontFamily: 'Sora,sans-serif', fontSize: 38, fontWeight: 700,
            letterSpacing: '-0.04em', color: text, lineHeight: 1, flexShrink: 0,
          }}>24</div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: second, marginBottom: 0, flexShrink: 0 }}>in pipeline</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
            {([[muted, '20%'], [accent, '35%'], [cyan, '25%'], ['#10b981', '20%']] as [string, string][]).map(([c, ww], i) => (
              <motion.div
                key={i}
                style={{ height: 6, borderRadius: 3, background: c, width: ww, transformOrigin: 'left' }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.42 + i * 0.06, ease: EB }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['New', 'Active', 'Prop', 'Won'] as const).map((l, i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: [muted, accent, cyan, '#10b981'][i] }} />
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: muted }}>{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Row 2: Projects */}
        <motion.div variants={itm} style={{
          ...w, padding: 16,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{
            fontFamily: 'Geist Mono,monospace', fontSize: 9,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: muted, marginBottom: 3, flexShrink: 0,
          }}>Projects</div>
          <div style={{
            fontFamily: 'Sora,sans-serif', fontSize: 38, fontWeight: 700,
            letterSpacing: '-0.04em', color: text, lineHeight: 1, flexShrink: 0,
          }}>8</div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: second, flexShrink: 0 }}>active</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {([['#10b981', '5 on track'], [accent, '2 review'], [muted, '1 hold']] as [string, string][]).map(([c, lbl]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: c, flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 9, color: second }}>{lbl}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 6, borderRadius: 3, background: border, marginBottom: 5 }}>
            <motion.div
              style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${accent},${cyan})` }}
              initial={{ width: '0%' }} animate={{ width: '65%' }}
              transition={{ duration: 0.85, delay: 0.48, ease: EB }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: second }}>5 of 8 on track</span>
            <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, color: accent }}>65%</span>
          </div>
        </motion.div>

        {/* Row 2: Net Profit */}
        <motion.div variants={itm} style={{
          ...w, padding: 16,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{
            fontFamily: 'Geist Mono,monospace', fontSize: 9,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: muted, marginBottom: 3, flexShrink: 0,
          }}>Net Profit</div>
          <div style={{
            fontFamily: 'Sora,sans-serif', fontSize: 32, fontWeight: 700,
            letterSpacing: '-0.03em', color: '#10b981', lineHeight: 1, flexShrink: 0,
          }}>
            ${(profit / 10).toFixed(1)}k
          </div>
          <span style={{
            fontFamily: 'Geist Mono,monospace', fontSize: 10,
            color: '#10b981',
            background: d ? 'rgba(16,185,129,0.12)' : '#d1fae5',
            padding: '1px 7px', borderRadius: 999,
            display: 'inline-block', alignSelf: 'flex-start',
            marginTop: 4, flexShrink: 0,
          }}>+12%</span>
          {/* Micro chart fills remaining */}
          <div style={{ flex: 1, minHeight: 0, marginTop: 10 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${mCw} ${mCh}`} preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id={mGrad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={d ? 0.25 : 0.12} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.polygon
                points={mFill} fill={`url(#${mGrad})`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.58 }}
              />
              <motion.polyline
                points={mPts} fill="none" stroke="#10b981" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.44, ease: 'easeOut' }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Row 3: Tasks Due Today */}
        <motion.div variants={itm} style={{
          ...w, gridColumn: 'span 2', padding: 16,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 10, flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 600,
              color: text, letterSpacing: '-0.01em',
            }}>Tasks Due Today</div>
            <span style={{
              fontFamily: 'Geist Mono,monospace', fontSize: 10, color: accent,
              background: d ? 'rgba(59,130,246,0.1)' : '#e0f2fe',
              padding: '2px 8px', borderRadius: 999,
            }}>3 left</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            {TASKS.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24, delay: 0.6 + i * 0.09, ease: EB }}
                style={{ display: 'flex', alignItems: 'center', gap: 11 }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `1.5px solid ${task.dot}`, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: text,
                    fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{task.label}</div>
                  <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, color: muted, marginTop: 2 }}>{task.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Row 3: Your Team */}
        <motion.div variants={itm} style={{
          ...w, padding: 16,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 10, flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 600,
              color: text, letterSpacing: '-0.01em',
            }}>Your Team</div>
            <span style={{
              fontFamily: 'Geist Mono,monospace', fontSize: 10, color: '#10b981',
              background: d ? 'rgba(16,185,129,0.12)' : '#d1fae5',
              padding: '2px 8px', borderRadius: 999,
            }}>4 active</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            {([
              { init: 'A', bg: accent,    name: 'Alex J.',   role: 'Account Manager' },
              { init: 'J', bg: cyan,      name: 'Jordan K.', role: 'Designer'        },
              { init: 'K', bg: '#10b981', name: 'Maya L.',   role: 'Developer'       },
              { init: 'M', bg: '#f59e0b', name: 'Sam R.',    role: 'Strategist'      },
            ]).map(({ init, bg: aBg, name: memberName, role }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: 0.62 + i * 0.07, ease: EB }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', background: aBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700,
                  color: '#fff', flexShrink: 0,
                }}>
                  {init}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 500, color: text, lineHeight: 1.2 }}>{memberName}</div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: muted, marginTop: 1 }}>{role}</div>
                </div>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}

// ── S1Theme (theme picker cards) ─────────────────────────────────────────────

interface S1ThemeProps {
  value: Theme
  onChange: (theme: Theme) => void
  theme: Theme
}

function S1Theme({ value, onChange, theme }: S1ThemeProps) {
  const t   = C[theme]
  const sel = value

  const opts = [
    {
      key:   'obsidian' as const,
      name:  'Obsidian Premium',
      desc:  'Dark · Powerful · Focused',
      swBg:  '#0d0d0f',
      swAc:  '#3b82f6',
      swCy:  '#06b6d4',
    },
    {
      key:   'arctic' as const,
      name:  'Arctic Clean',
      desc:  'Light · Crisp · Precise',
      swBg:  '#f8fafc',
      swAc:  '#0ea5e9',
      swCy:  '#6366f1',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {opts.map(o => {
        const isSelected = sel === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '20px 24px', minHeight: 88,
              borderRadius: 14, boxSizing: 'border-box', width: '100%',
              cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${isSelected ? t.accent : t.border}`,
              background: isSelected ? `${t.accent}10` : t.panel,
              boxShadow: isSelected
                ? `0 0 0 3px ${t.accent}22, 0 4px 20px ${t.accent}14`
                : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Color swatch */}
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: o.swBg,
              border: `1px solid ${isSelected ? o.swAc : t.border}`,
              flexShrink: 0, position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              padding: 7, gap: 5,
              transition: 'border-color 0.2s',
            }}>
              {o.key === 'obsidian' && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg,transparent,${o.swAc}90,${o.swCy}70,transparent)`,
                }} />
              )}
              <div style={{ display: 'flex', gap: 3 }}>
                {[o.swAc, o.swCy, '#10b981'].map((c, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1,
                background: o.key === 'obsidian' ? '#111114' : '#ffffff',
                borderRadius: 4,
                border: `1px solid ${o.key === 'obsidian' ? '#1e1e26' : '#e2e8f0'}`,
                overflow: 'hidden',
              }}>
                <div style={{ height: '60%', background: `linear-gradient(90deg,${o.swAc},${o.swCy})` }} />
              </div>
            </div>

            {/* Label */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Sora,sans-serif', fontSize: 18, fontWeight: 600,
                letterSpacing: '-0.02em',
                color: isSelected ? t.accent : t.text,
                marginBottom: 5, transition: 'color 0.2s',
              }}>{o.name}</div>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: t.second }}>{o.desc}</div>
            </div>

            {/* Radio check */}
            <div style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${isSelected ? t.accent : t.muted}`,
              background: isSelected ? t.accent : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <polyline points="2.5 6 5 8.5 9.5 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── CreatingHarmony Logo ──────────────────────────────────────────────────────

function Logo({ theme }: { theme: Theme }) {
  const t = C[theme]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
        {[12, 18, 14, 10, 16].map((h, i) => (
          <div
            key={i}
            style={{ width: 3, height: h, borderRadius: 2, background: t.accent }}
          />
        ))}
      </div>
      <span style={{
        fontFamily: 'Sora,sans-serif', fontSize: 14, fontWeight: 600,
        color: t.text, letterSpacing: '-0.01em',
      }}>
        CreatingHarmony
      </span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Q1ColorScheme({ userId, onDone }: Q1ColorSchemeProps) {
  const [theme, setTheme]   = useState<Theme>('obsidian')
  const [saving, setSaving] = useState(false)

  const E: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

  const t = C[theme]

  const handleNext = async () => {
    if (saving) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id:         userId,
          theme:      theme,
          updated_at: new Date().toISOString(),
        })
      if (error) throw error
    } catch {
      // Non-blocking — proceed regardless so UX isn't blocked
    } finally {
      setSaving(false)
    }
    onDone(theme)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', overflow: 'hidden',
    }}>

      {/* ── Left panel (40%) ── */}
      <motion.div
        animate={{ backgroundColor: t.panel }}
        transition={{ duration: 0.35, ease: E }}
        style={{
          width: '40%', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          borderRight: `1px solid ${t.border}`,
        }}
      >
        {/* Top edge accent line for obsidian */}
        {theme === 'obsidian' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg,transparent,${t.accent}80 40%,${t.accent2}60 60%,transparent)`,
            zIndex: 10,
          }} />
        )}

        {/* Logo — top left */}
        <div style={{ padding: '28px 36px 0', flexShrink: 0 }}>
          <Logo theme={theme} />
        </div>

        {/* Question content — vertically centered */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '0 40px',
          boxSizing: 'border-box',
        }}>
          {/* Question counter */}
          <div style={{
            fontFamily: 'Geist Mono,monospace', fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: t.muted, marginBottom: 14,
          }}>
            Question 1 of 5
          </div>

          {/* Question heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Sora,sans-serif', fontSize: 30, fontWeight: 700,
              color: t.text, letterSpacing: '-0.035em',
              lineHeight: 1.2, margin: '0 0 10px',
            }}>
              Which color scheme do you prefer?
            </h2>
            <p style={{
              fontFamily: 'DM Sans,sans-serif', fontSize: 15,
              color: t.second, lineHeight: 1.6, margin: 0,
            }}>
              Click to preview. Change anytime in Settings.
            </p>
          </div>

          {/* Theme picker cards */}
          <S1Theme
            value={theme}
            onChange={setTheme}
            theme={theme}
          />
        </div>

        {/* Next button — bottom right of left panel */}
        <div style={{ padding: '0 36px 36px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg,${t.accent},${t.accent2})`,
              border: 'none', borderRadius: 12,
              padding: '14px 28px',
              cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 600,
              color: '#fff',
              boxShadow: `0 4px 20px ${t.accent}40`,
              opacity: saving ? 0.7 : 1,
              transition: 'transform 0.15s, opacity 0.15s',
            }}
            onMouseEnter={e => {
              if (!saving) e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {saving ? 'Saving…' : 'Next →'}
          </button>
        </div>
      </motion.div>

      {/* ── Right panel (60%) — animated DashPreview ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: E }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <DashPreview theme={theme} />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}
