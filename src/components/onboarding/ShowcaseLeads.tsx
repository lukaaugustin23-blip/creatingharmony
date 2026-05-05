'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Local color tokens — not imported from constants ──────────────────────────
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

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  theme: 'obsidian' | 'arctic'
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface CardDef {
  id: string
  name: string
  value: string
  green?: boolean
}

// ── Easing ────────────────────────────────────────────────────────────────────
const E = [0.25, 0.46, 0.45, 0.94] as const

// ── Stagger helper ────────────────────────────────────────────────────────────
function stagger(i: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: i * 0.1, ease: E },
  }
}

// ── Confetti colors ───────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#a855f7',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
]

// ── Bullets ───────────────────────────────────────────────────────────────────
const BULLETS = [
  'Drag leads across stages as deals progress',
  'Auto-reminders when leads go cold',
  'One tap converts a lead to a paying client',
]

// ── Lead Card ─────────────────────────────────────────────────────────────────
interface LeadCardProps {
  card: CardDef
  highlighted: string | null
  accent: string
  panel: string
  border: string
  text: string
}

function LeadCard({ card, highlighted, accent, panel, border, text }: LeadCardProps) {
  const isHighlighted = highlighted === card.id
  const isGreen = card.green === true

  const bgColor = isGreen
    ? `${accent}26`
    : panel

  const borderColor = isHighlighted
    ? accent
    : isGreen
    ? `${accent}66`
    : border

  const borderWidth = isHighlighted ? 2 : 1

  const boxShadow = isHighlighted
    ? `0 8px 24px ${accent}40, 0 0 0 1px ${accent}40`
    : 'none'

  const translateY = isHighlighted ? -4 : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
      style={{
        backgroundColor: bgColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        transform: `translateY(${translateY}px)`,
        boxShadow,
        transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s, background-color 0.15s',
        cursor: 'default',
      }}
    >
      <div
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 600,
          fontSize: 13,
          color: text,
          lineHeight: 1.3,
        }}
      >
        {card.name}
      </div>
      <div
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 12,
          color: accent,
          marginTop: 4,
        }}
      >
        {card.value}
      </div>
    </motion.div>
  )
}

// ── Kanban Column ─────────────────────────────────────────────────────────────
interface ColumnProps {
  title: string
  count: number
  cards: CardDef[]
  highlighted: string | null
  accent: string
  panel: string
  border: string
  text: string
  muted: string
}

function KanbanColumn({
  title,
  count,
  cards,
  highlighted,
  accent,
  panel,
  border,
  text,
  muted,
}: ColumnProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Column header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: 10,
            color: muted,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.12em',
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            borderRadius: 9999,
            backgroundColor: `${muted}33`,
            color: muted,
            fontSize: 10,
            fontFamily: 'Geist Mono, monospace',
            marginLeft: 6,
            flexShrink: 0,
          }}
        >
          {count}
        </span>
      </div>

      {/* Column body */}
      <div style={{ minHeight: 200 }}>
        <AnimatePresence mode="popLayout">
          {cards.map((card) => (
            <LeadCard
              key={card.id}
              card={card}
              highlighted={highlighted}
              accent={accent}
              panel={panel}
              border={border}
              text={text}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Confetti Particle ─────────────────────────────────────────────────────────
interface ConfettiParticleProps {
  index: number
  show: boolean
}

function ConfettiParticle({ index, show }: ConfettiParticleProps) {
  const angle = (index / 8) * Math.PI * 2
  const x = Math.cos(angle) * 50
  const y = Math.sin(angle) * 50
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`confetti-${index}`}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{ scale: 1, opacity: 0, x, y }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: 2,
            backgroundColor: color,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ShowcaseLeads({ theme }: Props) {
  const c = C[theme]

  const [reynoldsInContacted, setReynoldsInContacted] = useState(false)
  const [sparkInClosed, setSparkInClosed] = useState(false)
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timeoutsRef.current.push(id)
  }

  const runSequence = () => {
    // 1500ms: Reynolds card glows
    schedule(() => setHighlighted('reynolds'), 1500)
    // 2200ms: Reynolds moves to CONTACTED
    schedule(() => {
      setReynoldsInContacted(true)
      setHighlighted(null)
    }, 2200)
    // 2800ms: Spark card glows
    schedule(() => setHighlighted('spark'), 2800)
    // 3500ms: Spark moves to CLOSED WON, confetti
    schedule(() => {
      setSparkInClosed(true)
      setHighlighted(null)
      setShowConfetti(true)
    }, 3500)
    // 4000ms: Toast appears
    schedule(() => setShowToast(true), 4000)
    // 4300ms: Confetti off
    schedule(() => setShowConfetti(false), 4300)
    // 5500ms: Toast disappears
    schedule(() => setShowToast(false), 5500)
    // 7200ms: Reset all state
    schedule(() => {
      setReynoldsInContacted(false)
      setSparkInClosed(false)
      setHighlighted(null)
      setShowToast(false)
      setShowConfetti(false)
    }, 7200)
  }

  useEffect(() => {
    // Run immediately on mount
    runSequence()

    // Loop every 8000ms
    const interval = setInterval(() => {
      clearAllTimeouts()
      runSequence()
    }, 8000)

    return () => {
      clearInterval(interval)
      clearAllTimeouts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Column card data ────────────────────────────────────────────────────────
  const newCards: CardDef[] = [
    { id: 'blue-wave', name: 'Blue Wave', value: '$6,800' },
    { id: 'peak-marketing', name: 'Peak Marketing', value: '$2,200' },
    ...(!reynoldsInContacted
      ? [{ id: 'reynolds', name: 'Reynolds HVAC', value: '$4,500' }]
      : []),
  ]

  const contactedCards: CardDef[] = [
    { id: 'acme', name: 'Acme Co', value: '$12,000' },
    { id: 'nova', name: 'Nova Studio', value: '$3,500' },
    ...(reynoldsInContacted
      ? [{ id: 'reynolds', name: 'Reynolds HVAC', value: '$4,500' }]
      : []),
  ]

  const qualifiedCards: CardDef[] = [
    ...(!sparkInClosed
      ? [{ id: 'spark', name: 'Spark Creative', value: '$8,900' }]
      : []),
  ]

  const closedCards: CardDef[] = [
    { id: 'apex', name: 'Apex Media', value: '$15,000', green: true },
    ...(sparkInClosed
      ? [{ id: 'spark', name: 'Spark Creative', value: '$8,900', green: true }]
      : []),
  ]

  const newCount = !reynoldsInContacted ? 3 : 2
  const contactedCount = !reynoldsInContacted ? 2 : 3
  const qualifiedCount = !sparkInClosed ? 1 : 0
  const closedCount = !sparkInClosed ? 1 : 2

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.bg,
        overflow: 'hidden',
      }}
    >
      {/* ── Max-width container ─────────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* ── LEFT SIDE (38%) ─────────────────────────────────────────────────── */}
        <div
          style={{
            width: '38%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 40,
            boxSizing: 'border-box',
          }}
        >
          {/* Eyebrow */}
          <motion.div
            {...stagger(0)}
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11,
              color: c.accent,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              marginBottom: 18,
            }}
          >
            LEAD PIPELINE
          </motion.div>

          {/* Heading */}
          <motion.h2
            {...stagger(1)}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: c.text,
              margin: '0 0 16px',
            }}
          >
            Every lead.
            <br />
            Every opportunity.
            <br />
            Nothing slips.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            {...stagger(2)}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              color: c.muted,
              lineHeight: 1.6,
              margin: '0 0 28px',
            }}
          >
            Move leads through your pipeline, close deals, and turn clients
            into invoices automatically.
          </motion.p>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BULLETS.map((bullet, i) => (
              <motion.div
                key={bullet}
                {...stagger(3 + i)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 9999,
                    backgroundColor: c.accent,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13,
                    color: c.second,
                    lineHeight: 1.5,
                  }}
                >
                  {bullet}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE (62%) ────────────────────────────────────────────────── */}
        <div
          style={{
            width: '62%',
            position: 'relative',
            padding: '40px 24px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* ── Kanban grid ──────────────────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}
          >
            <KanbanColumn
              title="NEW"
              count={newCount}
              cards={newCards}
              highlighted={highlighted}
              accent={c.accent}
              panel={c.panel}
              border={c.border}
              text={c.text}
              muted={c.muted}
            />
            <KanbanColumn
              title="CONTACTED"
              count={contactedCount}
              cards={contactedCards}
              highlighted={highlighted}
              accent={c.accent}
              panel={c.panel}
              border={c.border}
              text={c.text}
              muted={c.muted}
            />
            <KanbanColumn
              title="QUALIFIED"
              count={qualifiedCount}
              cards={qualifiedCards}
              highlighted={highlighted}
              accent={c.accent}
              panel={c.panel}
              border={c.border}
              text={c.text}
              muted={c.muted}
            />
            <KanbanColumn
              title="CLOSED WON"
              count={closedCount}
              cards={closedCards}
              highlighted={highlighted}
              accent={c.accent}
              panel={c.panel}
              border={c.border}
              text={c.text}
              muted={c.muted}
            />
          </div>

          {/* ── Confetti ─────────────────────────────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              top: '40%',
              right: '20%',
              pointerEvents: 'none',
            }}
          >
            {CONFETTI_COLORS.map((_, i) => (
              <ConfettiParticle key={i} index={i} show={showConfetti} />
            ))}
          </div>

          {/* ── Toast ────────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: c.accent,
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                🎉 Deal closed · Invoice generated automatically
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
