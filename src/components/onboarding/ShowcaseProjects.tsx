'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ── Local color tokens ────────────────────────────────────────────────────────
const C = {
  obsidian: {
    bg: '#0d0d0f',
    panel: '#111114',
    border: '#1e1e26',
    accent: '#3b82f6',
    accent2: '#06b6d4',
    text: '#f0f4ff',
    second: '#8892a4',
    muted: '#454d5e',
  },
  arctic: {
    bg: '#f8fafc',
    panel: '#ffffff',
    border: '#e2e8f0',
    accent: '#0ea5e9',
    accent2: '#6366f1',
    text: '#0f172a',
    second: '#475569',
    muted: '#94a3b8',
  },
} as const

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  theme: 'obsidian' | 'arctic'
}

interface Task {
  done: boolean
  name: string
  assignee: string
  date: string
}

// ── Task data ─────────────────────────────────────────────────────────────────
const TASKS: Task[] = [
  { done: true,  name: 'Design mockups',  assignee: 'AJ',  date: 'Feb 20' },
  { done: true,  name: 'Frontend build',  assignee: 'JK',  date: 'Mar 1'  },
  { done: false, name: 'Client review',   assignee: 'ML',  date: 'Mar 10' },
  { done: false, name: 'Final delivery',  assignee: 'You', date: 'Mar 15' },
]

// ── Checkmark SVG ─────────────────────────────────────────────────────────────
function Checkmark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline
        points="2.5,6 5,8.5 9.5,3"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Avatar color map ──────────────────────────────────────────────────────────
const AVATAR_HUE: Record<string, string> = {
  AJ:  '#3b82f6',
  JK:  '#06b6d4',
  ML:  '#8b5cf6',
  You: '#f59e0b',
}

function getAvatarBg(initials: string, accent: string): string {
  return AVATAR_HUE[initials] ?? accent
}

// ── Feature bullets ───────────────────────────────────────────────────────────
const BULLETS = [
  'Tasks assigned to the right person instantly',
  'Progress updates automatically as work gets done',
  'Deadlines visible across your whole team',
]

// ── Main component ────────────────────────────────────────────────────────────
export default function ShowcaseProjects({ theme }: Props) {
  const c = C[theme]
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

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
          maxWidth: 900,
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
              marginBottom: 14,
              margin: '0 0 14px 0',
            }}
          >
            PROJECT TRACKER
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
              marginBottom: 16,
              margin: '0 0 16px 0',
            }}
          >
            Every project.<br />Every deadline.<br />Always on track.
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
              marginBottom: 28,
              margin: '0 0 28px 0',
            }}
          >
            Assign tasks, track progress, and hit deadlines without the chaos.
          </motion.p>

          {/* Feature bullets */}
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
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: c.accent,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13,
                    color: c.second,
                  }}
                >
                  {bullet}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE ──────────────────────────────────────────────────────── */}
        <div
          style={{
            width: '62%',
            position: 'relative',
            padding: '40px 24px',
          }}
        >
          {/* ── FLOATING NOTIFICATION ─────────────────────────────────────────── */}
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={
                showNotification
                  ? { opacity: 1, y: [0, -4, 0] }
                  : { opacity: 0, y: -8 }
              }
              transition={
                showNotification
                  ? {
                      opacity: { duration: 0.4, type: 'spring', stiffness: 300, damping: 24 },
                      y: {
                        times: [0, 0.5, 1],
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.4,
                      },
                    }
                  : {}
              }
              style={{
                position: 'absolute',
                top: 32,
                right: 0,
                zIndex: 10,
                backgroundColor: c.accent,
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                maxWidth: 260,
                boxShadow: `0 8px 24px ${c.accent}40`,
              }}
            >
              <span style={{ fontSize: 12 }}>✓</span>
              <span
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Jordan completed &apos;Frontend build&apos;
              </span>
            </motion.div>
          )}

          {/* ── MAIN CARD ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            style={{
              borderRadius: 20,
              backgroundColor: c.panel,
              border: `1px solid ${c.border}`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.08)`,
              padding: 24,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  color: c.text,
                }}
              >
                Website Redesign
              </span>
              <span
                style={{
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: 10,
                  color: c.accent,
                  backgroundColor: `${c.accent}26`,
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                Active
              </span>
            </div>

            {/* Client row */}
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12,
                color: c.muted,
                marginBottom: 16,
                margin: '0 0 16px 0',
              }}
            >
              Acme Co · Due Mar 15
            </p>

            {/* Progress section */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 11,
                    color: c.muted,
                  }}
                >
                  Progress
                </span>
                <span
                  style={{
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 11,
                    color: c.accent,
                  }}
                >
                  68%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: c.border,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${c.accent}, ${c.accent2})`,
                  }}
                />
              </div>
            </div>

            {/* Tasks list */}
            <div>
              {TASKS.map((task, i) => (
                <motion.div
                  key={task.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    height: 48,
                    borderBottom: i < TASKS.length - 1 ? `1px solid ${c.border}` : 'none',
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: task.done ? c.accent : 'transparent',
                      border: task.done ? `2px solid ${c.accent}` : `2px solid ${c.muted}`,
                    }}
                  >
                    {task.done && <Checkmark />}
                  </div>

                  {/* Center: name + avatar */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 13,
                        color: task.done ? c.muted : c.text,
                        textDecoration: task.done ? 'line-through' : 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.name}
                    </span>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: getAvatarBg(task.assignee, c.accent),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Geist Mono, monospace',
                          fontSize: 7,
                          fontWeight: 600,
                          color: '#ffffff',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {task.assignee === 'You' ? 'YO' : task.assignee}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <span
                    style={{
                      fontFamily: 'Geist Mono, monospace',
                      fontSize: 10,
                      color: c.muted,
                      flexShrink: 0,
                    }}
                  >
                    {task.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── SECOND CARD ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            style={{
              marginTop: 16,
              marginRight: -24,
              borderRadius: 16,
              backgroundColor: c.panel,
              border: `1px solid ${c.border}`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.06)`,
              padding: '16px 20px',
            }}
          >
            {/* Title row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    color: c.text,
                  }}
                >
                  Brand Campaign
                </span>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 11,
                    color: c.muted,
                    marginLeft: 8,
                  }}
                >
                  Nova Studio
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: 10,
                  color: '#f59e0b',
                  backgroundColor: '#f59e0b26',
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                In Progress
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                backgroundColor: c.border,
                overflow: 'hidden',
                marginTop: 12,
                marginBottom: 8,
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '34%' }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${c.accent}, ${c.accent2})`,
                }}
              />
            </div>

            {/* Tasks complete */}
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11,
                color: c.muted,
                margin: 0,
              }}
            >
              3 of 8 tasks complete
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
