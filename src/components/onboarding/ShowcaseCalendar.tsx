'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Local color tokens ────────────────────────────────────────────────────────
const C = {
  obsidian: { bg: '#0d0d0f', panel: '#111114', border: '#1e1e26', accent: '#3b82f6', accent2: '#06b6d4', text: '#f0f4ff', second: '#8892a4', muted: '#454d5e' },
  arctic:   { bg: '#f8fafc', panel: '#ffffff',  border: '#e2e8f0', accent: '#0ea5e9', accent2: '#6366f1', text: '#0f172a', second: '#475569', muted: '#94a3b8' },
} as const

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  theme: 'obsidian' | 'arctic'
}

interface CalEvent {
  color: string
  label: string
}

// ── Static data ───────────────────────────────────────────────────────────────
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const BULLETS = [
  'Deadlines from all projects in one view',
  'Color coded by client or project',
  'Overdue tasks surface automatically',
]

// 35 cells: Mar 1–31 + Apr 1–4
const CELLS: Array<{ day: number; month: 'Mar' | 'Apr' }> = [
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, month: 'Mar' as const })),
  ...Array.from({ length: 4 },  (_, i) => ({ day: i + 1, month: 'Apr' as const })),
]

// Events keyed by Mar day number
const EVENTS: Record<number, CalEvent[]> = {
  3:  [{ color: '#ef4444', label: 'Invoice #041' }],
  7:  [{ color: '__accent__', label: 'Acme Co' }],
  10: [{ color: '#a855f7', label: 'Client review' }],
  12: [{ color: '#10b981', label: 'Invoice sent' }],
  15: [{ color: '__accent__', label: 'Website delivery' }],
  18: [{ color: '#f59e0b', label: 'Team standup' }],
  20: [{ color: '#a855f7', label: 'Brand campaign' }],
  25: [{ color: '#10b981', label: 'Invoice #042' }],
  28: [{ color: '__accent__', label: 'Nova Studio' }],
}

const TODAY = 4 // Mar 4

const UPCOMING = [
  { bar: '#ef4444',    title: 'Invoice #041 Overdue',      sub: 'Reynolds HVAC · 3 days ago' },
  { bar: '__accent__', title: 'Website Delivery',           sub: 'Acme Co · in 11 days' },
  { bar: '#a855f7',    title: 'Brand Campaign',             sub: 'Nova Studio · in 16 days' },
  { bar: '#10b981',    title: 'Invoice #042 Auto-sends',    sub: 'in 21 days' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function ShowcaseCalendar({ theme }: Props) {
  const c = C[theme]

  const [pillsVisible, setPillsVisible]   = useState(false)
  const [listVisible, setListVisible]     = useState(false)
  const [overdueFlash, setOverdueFlash]   = useState(false)
  const [showAutoSend, setShowAutoSend]   = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPillsVisible(true),  800)
    const t2 = setTimeout(() => setListVisible(true),   2000)
    const t3 = setTimeout(() => setOverdueFlash(true),  3000)
    const t4 = setTimeout(() => setShowAutoSend(true),  4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // Resolve __accent__ placeholder to real color
  const resolveColor = (color: string) => color === '__accent__' ? c.accent : color

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.bg,
        padding: '0 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 920,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {/* ── LEFT SIDE ───────────────────────────────────────────────────────── */}
        <div
          style={{
            width: '38%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0, ease: 'easeOut' }}
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11,
              color: c.accent,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}
          >
            CALENDAR &amp; DEADLINES
          </motion.p>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: c.text,
              margin: '0 0 16px 0',
            }}
          >
            Every deadline.<br />Every meeting.<br />One place.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              color: c.muted,
              lineHeight: 1.6,
              margin: '0 0 28px 0',
            }}
          >
            See everything due across all your projects and clients without switching between tools.
          </motion.p>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {BULLETS.map((bullet, i) => (
              <motion.div
                key={bullet}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: i < BULLETS.length - 1 ? 10 : 0,
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: c.accent, flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: c.second }}>
                  {bullet}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE ──────────────────────────────────────────────────────── */}
        <div style={{ width: '62%', padding: '40px 24px' }}>
          {/* ── CALENDAR CARD ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            style={{
              backgroundColor: c.panel,
              border: `1px solid ${c.border}`,
              borderRadius: 20,
              padding: '20px 24px',
            }}
          >
            {/* Month header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 18, color: c.text }}>
                March 2026
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['←', '→'] as const).map((arrow) => (
                  <div
                    key={arrow}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'default',
                      color: c.muted,
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14,
                      userSelect: 'none',
                    }}
                  >
                    {arrow}
                  </div>
                ))}
              </div>
            </div>

            {/* Week labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {WEEK_LABELS.map((label) => (
                <div
                  key={label}
                  style={{
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 10,
                    color: c.muted,
                    letterSpacing: '0.08em',
                    textAlign: 'center',
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {CELLS.map(({ day, month }, idx) => {
                const events = month === 'Mar' ? (EVENTS[day] ?? []) : []
                const isToday = month === 'Mar' && day === TODAY
                const displayedPills = events.slice(0, 2)
                const extra = events.length - 2

                return (
                  <motion.div
                    key={`${month}-${day}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.02, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      height: 48,
                      borderRadius: 6,
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: month === 'Apr' ? 'transparent' : undefined,
                    }}
                  >
                    {/* Today circle */}
                    {isToday && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: 4,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: c.accent,
                        }}
                      />
                    )}

                    {/* Day number */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 6,
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: 11,
                        color: isToday ? '#ffffff' : month === 'Apr' ? c.muted : c.second,
                        zIndex: 1,
                        lineHeight: 1,
                      }}
                    >
                      {day}
                    </span>

                    {/* Event pills */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      {pillsVisible && displayedPills.map((ev, pi) => (
                        <motion.div
                          key={ev.label}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.2, delay: pi * 0.05, ease: 'easeOut' }}
                          style={{
                            height: 14,
                            borderRadius: 4,
                            backgroundColor: resolveColor(ev.color),
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            margin: '0 4px',
                            transformOrigin: 'left',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              fontSize: 9,
                              color: '#ffffff',
                              padding: '0 4px',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: '14px',
                            }}
                          >
                            {ev.label}
                          </span>
                        </motion.div>
                      ))}
                      {pillsVisible && extra > 0 && (
                        <span
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 9,
                            color: c.muted,
                            padding: '0 4px',
                          }}
                        >
                          +{extra} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* ── UPCOMING LIST ──────────────────────────────────────────────── */}
            <div style={{ borderTop: `1px solid ${c.border}`, marginTop: 16 }}>
              <p
                style={{
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: 10,
                  color: c.muted,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '12px 0 8px 0',
                }}
              >
                UPCOMING
              </p>

              {UPCOMING.map((item, i) => {
                const isOverdue  = i === 0
                const isAutoSend = i === 3
                const barColor   = resolveColor(item.bar)

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={listVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                    transition={{ duration: 0.35, delay: i * 0.1, ease: 'easeOut' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      height: 40,
                      borderBottom: i < UPCOMING.length - 1 ? `1px solid ${c.border}` : 'none',
                      borderLeft: isOverdue && overdueFlash ? `2px solid #ef4444` : '2px solid transparent',
                      transition: isOverdue ? 'border-color 0.3s ease' : undefined,
                      paddingLeft: 2,
                    }}
                  >
                    {/* Left bar */}
                    <div
                      style={{
                        width: 4,
                        height: 28,
                        borderRadius: 2,
                        backgroundColor: barColor,
                        flexShrink: 0,
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: c.muted }}>
                        {item.sub}
                      </div>
                    </div>

                    {/* Auto-send animation */}
                    {isAutoSend && (
                      <AnimatePresence>
                        {showAutoSend && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                          >
                            <motion.span
                              initial={{ y: 0, opacity: 1 }}
                              animate={{ y: -12, opacity: 0 }}
                              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                              style={{ fontSize: 14 }}
                            >
                              ✉️
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.5 }}
                              style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: 11,
                                color: '#10b981',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              ✓ Will send automatically
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Overdue flash pulse */}
                    {isOverdue && overdueFlash && (
                      <motion.div
                        animate={{ opacity: [1, 0, 1, 0, 1] }}
                        transition={{ duration: 1.2, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
