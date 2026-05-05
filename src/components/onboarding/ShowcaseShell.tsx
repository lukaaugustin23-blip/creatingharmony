'use client'

import { motion } from 'framer-motion'
import type React from 'react'

// ── Local color tokens — not imported from constants ─────────────────────────
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

// ── Step metadata ─────────────────────────────────────────────────────────────
const STEP_LABELS: Record<0 | 1 | 2, string> = {
  0: 'PROJECT TRACKER',
  1: 'LEAD PIPELINE',
  2: 'CALENDAR',
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  theme: 'obsidian' | 'arctic'
  showcaseStep: 0 | 1 | 2
  onBack: () => void
  onNext: () => void
  onSkip: () => void
  children: React.ReactNode
}

// ── Dot indicator ─────────────────────────────────────────────────────────────
function StepDot({ active, accent, muted }: { active: boolean; accent: string; muted: string }) {
  return (
    <motion.div
      layout
      animate={{
        width: active ? 24 : 8,
        backgroundColor: active ? accent : muted,
      }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        height: 8,
        borderRadius: 4,
        flexShrink: 0,
      }}
    />
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────
export default function ShowcaseShell({
  theme,
  showcaseStep,
  onBack,
  onNext,
  onSkip,
  children,
}: Props) {
  const c = C[theme]
  const isLast = showcaseStep === 2

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: c.bg,
        overflow: 'hidden',
      }}
    >
      {/* ── Children — full-screen content ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        {children}
      </div>

      {/* ── TOP RIGHT: step dots ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {([0, 1, 2] as const).map((step) => (
          <StepDot
            key={step}
            active={showcaseStep === step}
            accent={c.accent}
            muted={c.muted}
          />
        ))}
      </div>

      {/* ── CENTER: skip link ───────────────────────────────────────────────── */}
      <SkipButton muted={c.muted} text={c.text} onSkip={onSkip} />

      {/* ── BOTTOM: navigation bar ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          borderTop: `1px solid ${c.border}`,
          backgroundColor: c.panel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          zIndex: 10,
        }}
      >
        {/* Back */}
        <BackButton onBack={onBack} muted={c.muted} />

        {/* Center label */}
        <span
          style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: c.muted,
            userSelect: 'none',
          }}
        >
          {STEP_LABELS[showcaseStep]}
        </span>

        {/* Next / Go to dashboard */}
        <NextButton
          isLast={isLast}
          accent={c.accent}
          onNext={onNext}
        />
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SkipButton({
  muted,
  text,
  onSkip,
}: {
  muted: string
  text: string
  onSkip: () => void
}) {
  return (
    <motion.button
      onClick={onSkip}
      initial={false}
      whileHover={{ color: text }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'absolute',
        bottom: 84,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'none',
        border: 'none',
        padding: '4px 8px',
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 12,
        color: muted,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.textDecoration = 'underline'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.textDecoration = 'none'
      }}
    >
      Skip tour →
    </motion.button>
  )
}

function BackButton({ onBack, muted }: { onBack: () => void; muted: string }) {
  return (
    <motion.button
      onClick={onBack}
      whileHover={{ opacity: 1 }}
      initial={false}
      style={{
        background: 'none',
        border: 'none',
        padding: '4px 0',
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        color: muted,
        opacity: 0.8,
        minWidth: 64,
        textAlign: 'left' as const,
      }}
    >
      ← Back
    </motion.button>
  )
}

function NextButton({
  isLast,
  accent,
  onNext,
}: {
  isLast: boolean
  accent: string
  onNext: () => void
}) {
  return (
    <motion.button
      onClick={onNext}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        background: 'none',
        border: 'none',
        padding: '4px 0',
        cursor: 'pointer',
        fontFamily: 'Sora, sans-serif',
        fontWeight: 600,
        fontSize: 14,
        color: accent,
        minWidth: 64,
        textAlign: 'right' as const,
        whiteSpace: 'nowrap',
      }}
    >
      {isLast ? 'Go to dashboard →' : 'Next →'}
    </motion.button>
  )
}
