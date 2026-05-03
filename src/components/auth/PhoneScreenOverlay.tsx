'use client'

import { motion } from 'framer-motion'

const E = [0.25, 0.46, 0.45, 0.94] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: E },
  }
}

const OB = {
  bg:      '#0d0d0f',
  bg2:     '#111114',
  bg3:     '#16161a',
  border:  '#1e1e26',
  text:    '#f0f4ff',
  second:  '#8892a4',
  muted:   '#454d5e',
  accent:  '#3b82f6',
  accent2: '#06b6d4',
  success: '#10b981',
  danger:  '#ef4444',
  warning: '#f59e0b',
} as const

// ─── Chart ───────────────────────────────────────────────────────────────────

function LineChart({ color, up }: { color: string; up: boolean }) {
  const upPts   = '0,36 25,28 50,32 75,18 100,22 125,10 150,14 175,4 200,8'
  const downPts = '0,8  25,14 50,10 75,20 100,16 125,28 150,22 175,32 200,36'
  const upFill  = 'M0,36 25,28 50,32 75,18 100,22 125,10 150,14 175,4 200,8 L200,42 L0,42Z'
  const dnFill  = 'M0,8 25,14 50,10 75,20 100,16 125,28 150,22 175,32 200,36 L200,42 L0,42Z'
  const gid     = `cg-${color.replace('#', '')}-${up ? 'u' : 'd'}`

  return (
    <svg width="100%" height="34" viewBox="0 0 200 42" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={up ? upFill : dnFill} fill={`url(#${gid})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: E }} />
      <motion.polyline points={up ? upPts : downPts}
        fill="none" stroke={color} strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="600"
        initial={{ strokeDashoffset: 600 }} animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.1, ease: E }} />
    </svg>
  )
}

// ─── Screen sections ──────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 14px 2px', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '9px', fontWeight: 600, color: OB.text, letterSpacing: '0.02em' }}>
        9:41
      </span>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <rect x="0" y="4" width="2" height="4" rx="0.5" fill={OB.muted} />
          <rect x="3" y="2.5" width="2" height="5.5" rx="0.5" fill={OB.muted} />
          <rect x="6" y="1" width="2" height="7" rx="0.5" fill={OB.second} />
          <rect x="9" y="0" width="2" height="8" rx="0.5" fill={OB.accent} />
        </svg>
        <svg width="17" height="8" viewBox="0 0 17 8" fill="none">
          <rect x="0.5" y="0.5" width="13" height="7" rx="1.5" stroke={OB.muted} strokeWidth="1" />
          <rect x="13.5" y="2.5" width="2.5" height="3" rx="0.5" fill={OB.muted} />
          <rect x="2" y="2" width="8" height="4" rx="0.5" fill={OB.success} />
        </svg>
      </div>
    </div>
  )
}

function AppHeader() {
  return (
    <motion.div {...fadeUp(0.3)} style={{
      padding: '2px 12px 8px', borderBottom: `1px solid ${OB.border}`, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: '14px', fontWeight: 700, color: OB.text, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            Dashboard
          </div>
          <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '7.5px', color: OB.muted, letterSpacing: '0.05em', marginTop: '1px' }}>
            Apr 1 – Apr 30, 2026
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={OB.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '5px', height: '5px', borderRadius: '50%', background: OB.danger, border: `1px solid ${OB.bg}` }} />
          </div>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg,${OB.accent},${OB.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>A</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function RevenueCard() {
  return (
    <motion.div {...fadeUp(0.5)} style={{
      background: OB.bg2, borderRadius: '10px', padding: '8px 9px 6px',
      border: `1px solid ${OB.border}`, marginBottom: '5px',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(59,130,246,.5) 40%,rgba(6,182,212,.4) 60%,transparent)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '7px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: OB.muted, marginBottom: '2px' }}>Revenue</div>
          <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: '19px', fontWeight: 700, color: OB.text, letterSpacing: '-0.04em', lineHeight: 1 }}>$50,350</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'rgba(16,185,129,.10)', border: '1px solid rgba(16,185,129,.20)', borderRadius: '9999px', padding: '2px 6px' }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={OB.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
          <span style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '7.5px', color: OB.success, fontWeight: 700 }}>28%</span>
        </div>
      </div>
      <LineChart color={OB.accent} up={true} />
    </motion.div>
  )
}

function SmallCards() {
  const cards = [
    { label: 'Net Profit', val: '$17,600', color: OB.success, up: true,  pct: '12%', delay: 0.65 },
    { label: 'Expenses',   val: '$32,750', color: OB.danger,  up: false, pct: '5%',  delay: 0.72 },
  ] as const
  return (
    <div style={{ display: 'flex', gap: '5px', marginBottom: '5px', flexShrink: 0 }}>
      {cards.map((s) => (
        <motion.div key={s.label} {...fadeUp(s.delay)} style={{
          flex: 1, background: OB.bg2, borderRadius: '8px', padding: '6px 7px',
          border: `1px solid ${OB.border}`, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)' }} />
          <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6.5px', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: OB.muted, marginBottom: '2px' }}>{s.label}</div>
          <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: '12px', fontWeight: 700, color: OB.text, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '2px' }}>{s.val}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: s.up ? 'rgba(16,185,129,.10)' : 'rgba(239,68,68,.10)', borderRadius: '9999px', padding: '1px 4px', marginBottom: '3px' }}>
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {s.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
            </svg>
            <span style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6.5px', color: s.color, fontWeight: 700 }}>{s.pct}</span>
          </div>
          <LineChart color={s.color} up={s.up} />
        </motion.div>
      ))}
    </div>
  )
}

function ProjectsCard() {
  return (
    <motion.div {...fadeUp(0.8)} style={{
      background: OB.bg2, borderRadius: '8px', padding: '6px 9px',
      border: `1px solid ${OB.border}`, marginBottom: '5px', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6.5px', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: OB.muted }}>Active Projects</div>
          <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: '16px', fontWeight: 700, color: OB.text, letterSpacing: '-0.03em', lineHeight: 1.1 }}>8</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[OB.accent, OB.success, OB.accent2, OB.warning].map((c, i) => (
            <div key={i} style={{ width: '15px', height: '15px', borderRadius: '50%', background: c, border: `1.5px solid ${OB.bg2}`, marginLeft: i > 0 ? '-4px' : '0' }} />
          ))}
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: OB.bg3, border: `1.5px solid ${OB.bg2}`, marginLeft: '-4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '5px', fontFamily: 'var(--font-geist-mono,monospace)', color: OB.muted }}>+3</span>
          </div>
        </div>
      </div>
      <div style={{ height: '3.5px', background: OB.bg3, borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: `linear-gradient(90deg,${OB.accent},${OB.accent2})`, borderRadius: '2px' }}
          initial={{ width: '0%' }} animate={{ width: '72%' }}
          transition={{ duration: 1.0, delay: 0.9, ease: E }}
        />
      </div>
      <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6px', color: OB.muted, marginTop: '2px' }}>72% on track</div>
    </motion.div>
  )
}

function LeadsCard() {
  const segs = [
    { color: OB.accent,  width: '40%', label: 'New',   delay: 0.95 },
    { color: OB.success, width: '25%', label: 'Qual',  delay: 1.01 },
    { color: OB.warning, width: '20%', label: 'Prop',  delay: 1.07 },
    { color: '#6366f1',  width: '15%', label: 'Close', delay: 1.13 },
  ] as const
  return (
    <motion.div {...fadeUp(0.9)} style={{
      background: OB.bg2, borderRadius: '8px', padding: '6px 9px',
      border: `1px solid ${OB.border}`, marginBottom: '5px', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6.5px', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: OB.muted }}>Leads Pipeline</div>
        <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: '10px', fontWeight: 700, color: OB.text }}>24 leads</div>
      </div>
      <div style={{ display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', gap: '2px' }}>
        {segs.map((s) => (
          <motion.div key={s.label} style={{ height: '100%', background: s.color, borderRadius: '1px' }}
            initial={{ width: '0%' }} animate={{ width: s.width }}
            transition={{ duration: 0.8, delay: s.delay, ease: E }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
        {segs.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: s.color }} />
            <span style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6px', color: OB.muted }}>{s.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function TasksCard() {
  const tasks = [
    { task: 'Follow up with Mike R.',    time: '10:00 AM' },
    { task: 'Send proposal to Acme Co.', time: '1:30 PM'  },
  ] as const
  return (
    <motion.div {...fadeUp(1.0)} style={{
      background: OB.bg2, borderRadius: '8px', padding: '6px 9px',
      border: `1px solid ${OB.border}`, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6.5px', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: OB.muted }}>Tasks Due Today</div>
        <span style={{ fontFamily: 'var(--font-dm-sans,DM Sans,sans-serif)', fontSize: '6.5px', color: OB.accent }}>View all</span>
      </div>
      {tasks.map((t, i) => (
        <motion.div key={i} {...fadeUp(1.0 + i * 0.07)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: i === 0 ? '5px' : '0' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', border: `1.5px solid ${OB.border}`, flexShrink: 0 }} />
          <div style={{ flex: 1, fontFamily: 'var(--font-dm-sans,DM Sans,sans-serif)', fontSize: '8px', fontWeight: 500, color: OB.text, lineHeight: 1.2 }}>{t.task}</div>
          <div style={{ fontFamily: 'var(--font-geist-mono,monospace)', fontSize: '6px', color: OB.muted, flexShrink: 0 }}>{t.time}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function BottomNav() {
  const items = [
    { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', active: true  },
    { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8', active: false },
    { fab: true },
    { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z', active: false },
    { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', active: false },
  ] as const
  return (
    <motion.div {...fadeUp(1.2)} style={{
      background: OB.bg, borderTop: `1px solid ${OB.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '5px 6px 8px', flexShrink: 0,
    }}>
      {items.map((item, i) =>
        'fab' in item
          ? <div key={i} style={{ width: '26px', height: '26px', borderRadius: '50%', background: OB.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,.45)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          : <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.active ? OB.accent : OB.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.d} />
              </svg>
              {item.active && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: OB.accent }} />}
            </div>
      )}
    </motion.div>
  )
}

function PhoneContent() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: OB.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Dynamic Island — black pill at top of screen */}
      <div style={{
        position: 'absolute', top: '5px', left: '50%',
        transform: 'translateX(-50%)',
        width: '36%', height: '22px',
        borderRadius: '9999px', background: '#000',
        zIndex: 20, pointerEvents: 'none',
      }} />

      {/* Status bar (ears either side of DI) */}
      <StatusBar />

      {/* Spacer below DI (DI overlaps status bar area) */}
      <div style={{ height: '10px', flexShrink: 0 }} />

      <AppHeader />

      {/* Scrollable content area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '7px 7px 0',
        /* hide scrollbar */
        scrollbarWidth: 'none',
      }}>
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        <RevenueCard />
        <SmallCards />
        <ProjectsCard />
        <LeadsCard />
        <TasksCard />
        <div style={{ height: '6px' }} />
      </div>

      <BottomNav />
    </div>
  )
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
//
//  Image: HARMONYBACKGROUND.jpg  1816 × 1206  AR = 1.5058
//  background-size: contain; background-position: center on 100vw × 100vh.
//
//  Phone screen glass measured from image:
//    TL ≈ (430, 130)  →  (23.7%, 10.8%)
//    TR ≈ (850, 155)  →  (46.8%, 12.9%)
//    BR ≈ (860, 1055) →  (47.4%, 87.5%)
//    BL ≈ (445, 1035) →  (24.5%, 85.9%)
//
//  Bounding rect of screen glass:
//    left = 23.7%,  top = 10.8%,  width = 23.7%,  height = 76.7%
//
//  clipPathUnits="objectBoundingBox" coords (0-1) within that bounding rect:
//    TL ≈ (0.00, 0.00)
//    TR ≈ (0.97, 0.027)
//    BR ≈ (1.00, 1.000)
//    BL ≈ (0.03, 0.976)
//  Quadratic-bezier rounded corners match iPhone 14 Pro corner radius.
//
export function PhoneScreenOverlay() {
  return (
    /* imgBox — sized/positioned to exactly match the background-size:contain rendering */
    <div
      style={{
        position: 'absolute',
        width:    'min(100vw, 150.58vh)',
        height:   'min(100vh, 66.41vw)',
        left:     'max(0px, calc(50vw - 75.29vh))',
        top:      'max(0px, calc(50vh - 33.21vw))',
        pointerEvents: 'none',
      }}
    >
      {/* SVG clip-path definition — traces the phone screen glass parallelogram */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <clipPath id="phoneScreenClip" clipPathUnits="objectBoundingBox">
            {/*
              Rounded parallelogram in objectBoundingBox (0-1) coords.
              Screen corners: TL(0,0), TR(0.97,0.027), BR(1,1), BL(0.03,0.976)
              Q = quadratic bezier for rounded corners (radius ≈ 0.05)
            */}
            <path d="
              M 0.00,0.040
              Q 0.00,0.000 0.050,0.000
              L 0.920,0.027
              Q 0.970,0.030 0.975,0.070
              L 1.000,0.960
              Q 1.000,1.000 0.950,1.000
              L 0.080,0.976
              Q 0.030,0.973 0.025,0.933
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Screen overlay — bounding rect of the phone glass, clipped to screen shape */}
      <div
        style={{
          position:  'absolute',
          left:      '23.7%',
          top:       '10.8%',
          width:     '23.7%',
          height:    '76.7%',
          clipPath:  'url(#phoneScreenClip)',
          overflow:  'hidden',
          pointerEvents: 'all',
        }}
      >
        <PhoneContent />
      </div>
    </div>
  )
}
