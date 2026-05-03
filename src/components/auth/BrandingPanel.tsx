'use client'

import { motion } from 'framer-motion'

const E = [0.25, 0.46, 0.45, 0.94] as const

function fadeIn(delay: number) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay, ease: E },
  }
}

function RevenueChart({ color, up }: { color: string; up: boolean }) {
  const upPts   = '0,36 25,28 50,32 75,18 100,22 125,10 150,14 175,4 200,8'
  const downPts = '0,8  25,14 50,10 75,20 100,16 125,28 150,22 175,32 200,36'
  const points  = up ? upPts : downPts
  const upFill  = 'M0,36 25,28 50,32 75,18 100,22 125,10 150,14 175,4 200,8 L200,42 L0,42Z'
  const downFill= 'M0,8 25,14 50,10 75,20 100,16 125,28 150,22 175,32 200,36 L200,42 L0,42Z'
  const fillPath = up ? upFill : downFill
  const gradId   = `g-${color.replace('#', '')}-${up ? 'u' : 'd'}`

  return (
    <svg width="100%" height="42" viewBox="0 0 200 42" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <motion.path
        d={fillPath} fill={`url(#${gradId})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: E }}
      />
      <motion.polyline
        points={points} fill="none" stroke={color} strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="600"
        initial={{ strokeDashoffset: 600 }} animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1, ease: E }}
      />
    </svg>
  )
}

function PhoneScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>

      {/* Status bar */}
      <div style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', fontWeight: 600, color: '#334155' }}>9:41</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <rect x="0" y="4" width="2" height="4" rx="0.5" fill="#94a3b8"/>
            <rect x="3" y="2.5" width="2" height="5.5" rx="0.5" fill="#94a3b8"/>
            <rect x="6" y="1" width="2" height="7" rx="0.5" fill="#94a3b8"/>
            <rect x="9" y="0" width="2" height="8" rx="0.5" fill="#0ea5e9"/>
          </svg>
          <svg width="17" height="8" viewBox="0 0 17 8" fill="none">
            <rect x="0.5" y="0.5" width="13" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1"/>
            <rect x="13.5" y="2.5" width="2.5" height="3" rx="0.5" fill="#94a3b8"/>
            <rect x="2" y="2" width="8" height="4" rx="0.5" fill="#10b981"/>
          </svg>
        </div>
      </div>

      {/* App header */}
      <motion.div {...fadeIn(0.4)} style={{ background: '#fff', padding: '2px 14px 10px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.2 }}>Dashboard</div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '8px', color: '#94a3b8', letterSpacing: '0.05em', marginTop: '2px' }}>Apr 1 – Apr 30, 2026</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444', border: '1px solid #fff' }}/>
            </div>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>A</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'hidden', padding: '9px 9px 0' }}>

        {/* Revenue */}
        <motion.div {...fadeIn(0.7)} style={{ background: '#fff', borderRadius: '12px', padding: '10px', border: '1px solid #e2e8f0', marginBottom: '7px', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '8px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '3px' }}>Revenue</div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '22px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1 }}>$50,350</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: '#d1fae5', borderRadius: '20px', padding: '2px 7px' }}>
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '8px', color: '#10b981', fontWeight: 700 }}>28%</span>
            </div>
          </div>
          <RevenueChart color="#0ea5e9" up={true} />
        </motion.div>

        {/* Net Profit + Expenses */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '7px' }}>
          {[
            { label: 'Net Profit', val: '$17,600', color: '#10b981', bg: '#d1fae5', up: true,  delay: 0.9  },
            { label: 'Expenses',   val: '$32,750', color: '#ef4444', bg: '#fee2e2', up: false, delay: 0.95 },
          ].map((s) => (
            <motion.div key={s.label} {...fadeIn(s.delay)} style={{ flex: 1, background: '#fff', borderRadius: '10px', padding: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7px', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '3px' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '14px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '4px' }}>{s.val}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: s.bg, borderRadius: '20px', padding: '1px 5px', marginBottom: '3px' }}>
                <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {s.up ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                </svg>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7px', color: s.color, fontWeight: 700 }}>{s.up ? '12%' : '5%'}</span>
              </div>
              <RevenueChart color={s.color} up={s.up} />
            </motion.div>
          ))}
        </div>

        {/* Active Projects */}
        <motion.div {...fadeIn(1.1)} style={{ background: '#fff', borderRadius: '10px', padding: '8px 10px', border: '1px solid #e2e8f0', marginBottom: '7px', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7.5px', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8' }}>Active Projects</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>8</div>
            </div>
            <div style={{ display: 'flex' }}>
              {['#0ea5e9','#10b981','#6366f1','#f59e0b'].map((c, i) => (
                <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i > 0 ? '-5px' : '0' }}/>
              ))}
            </div>
          </div>
          <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', borderRadius: '3px' }}
              initial={{ width: '0%' }} animate={{ width: '72%' }}
              transition={{ duration: 1.0, delay: 1.2, ease: E }}
            />
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7px', color: '#94a3b8', marginTop: '3px' }}>72% on track</div>
        </motion.div>

        {/* Leads Pipeline */}
        <motion.div {...fadeIn(1.2)} style={{ background: '#fff', borderRadius: '10px', padding: '8px 10px', border: '1px solid #e2e8f0', marginBottom: '7px', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7.5px', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8' }}>Leads Pipeline</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>24 leads</div>
          </div>
          <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '2px' }}>
            {(['#0ea5e9','#10b981','#f59e0b','#6366f1'] as const).map((c, i) => {
              const widths = ['40%','25%','20%','15%'] as const
              return (
                <motion.div key={i}
                  style={{ height: '100%', background: c, borderRadius: '2px' }}
                  initial={{ width: '0%' }} animate={{ width: widths[i] }}
                  transition={{ duration: 0.8, delay: 1.25 + i * 0.05, ease: E }}
                />
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            {(['New','Qual','Prop','Close'] as const).map((l, i) => {
              const colors = ['#0ea5e9','#10b981','#f59e0b','#6366f1'] as const
              return (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: colors[i] }}/>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7px', color: '#94a3b8' }}>{l}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Tasks */}
        <motion.div {...fadeIn(1.3)} style={{ background: '#fff', borderRadius: '10px', padding: '8px 10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7.5px', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '7px' }}>Tasks Due Today</div>
          {[
            { task: 'Send invoice to NovaTech', time: '10:00 AM', done: true  },
            { task: 'Review Apex proposal',     time: '2:00 PM',  done: false },
          ].map((t, i) => (
            <motion.div key={i} {...fadeIn(1.3 + i * 0.07)} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: i === 0 ? '6px' : '0' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `1.5px solid ${t.done ? '#10b981' : '#cbd5e1'}`, background: t.done ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.done && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', fontWeight: 500, color: t.done ? '#94a3b8' : '#0f172a', textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '7px', color: '#94a3b8', flexShrink: 0 }}>{t.time}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Bottom nav */}
      <motion.div {...fadeIn(1.5)} style={{ background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 8px 10px' }}>
        {[
          { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', active: true  },
          { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8', active: false },
          { fab: true },
          { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z', active: false },
          { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', active: false },
        ].map((item, i) =>
          'fab' in item
            ? <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.45)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
            : <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.active ? '#0ea5e9' : '#cbd5e1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.d}/>
                </svg>
                {item.active && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#0ea5e9' }}/>}
              </div>
        )}
      </motion.div>
    </div>
  )
}

export function BrandingPanel() {
  return (
    <motion.div
      style={{ perspective: '1200px' }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: E }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transform: 'rotateY(-8deg) rotateX(4deg)', transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {/* Glow */}
        <div style={{ position: 'absolute', bottom: '-28px', left: '8%', right: '8%', height: '52px', background: 'radial-gradient(ellipse,rgba(14,165,233,0.35) 0%,transparent 70%)', filter: 'blur(16px)', pointerEvents: 'none' }}/>

        {/* Frame */}
        <div style={{
          width: '215px', height: '455px', borderRadius: '44px',
          background: 'linear-gradient(160deg,#1e1e32 0%,#0e0e1c 55%,#060610 100%)',
          boxShadow: '0 60px 100px rgba(0,0,0,0.35), 0 28px 56px rgba(14,165,233,0.14), 0 8px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.6)',
          position: 'relative',
        }}>
          {/* Physical buttons */}
          <div style={{ position: 'absolute', right: '-3px', top: '94px',  width: '3px', height: '40px', background: '#1e1e30', borderRadius: '0 2px 2px 0' }}/>
          <div style={{ position: 'absolute', left:  '-3px', top: '56px',  width: '3px', height: '18px', background: '#1e1e30', borderRadius: '2px 0 0 2px' }}/>
          <div style={{ position: 'absolute', left:  '-3px', top: '80px',  width: '3px', height: '26px', background: '#1e1e30', borderRadius: '2px 0 0 2px' }}/>
          <div style={{ position: 'absolute', left:  '-3px', top: '112px', width: '3px', height: '44px', background: '#1e1e30', borderRadius: '2px 0 0 2px' }}/>

          {/* Screen */}
          <div style={{ position: 'absolute', inset: '6px', borderRadius: '38px', overflow: 'hidden', background: '#fff' }}>
            {/* Dynamic Island */}
            <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '78px', height: '22px', borderRadius: '14px', background: '#060610', zIndex: 20 }}/>
            {/* Glass reflection */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(128deg,rgba(255,255,255,0.17) 0%,rgba(255,255,255,0.05) 38%,transparent 58%)', zIndex: 15, pointerEvents: 'none', borderRadius: '38px' }}/>
            {/* Content */}
            <div style={{ position: 'absolute', inset: 0, top: '30px', borderRadius: '0 0 38px 38px', overflow: 'hidden' }}>
              <PhoneScreen />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
