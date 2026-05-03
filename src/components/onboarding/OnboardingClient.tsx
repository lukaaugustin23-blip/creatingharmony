'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { OnboardingData, ManageItem } from '@/types'

type Tok = {
  bg: string; bg2: string; bg3: string; border: string
  text: string; second: string; muted: string
  accent: string; cyan: string; track: string; isLight: boolean
}

const THEMES: Record<'obsidian' | 'arctic', Tok> = {
  obsidian: {
    bg: '#0d0d0f', bg2: '#111114', bg3: '#16161a', border: '#1e1e26',
    text: '#f0f4ff', second: '#8892a4', muted: '#454d5e',
    accent: '#3b82f6', cyan: '#06b6d4', track: '#1e1e26', isLight: false,
  },
  arctic: {
    bg: '#ffffff', bg2: '#f8fafc', bg3: '#f1f5f9', border: '#e2e8f0',
    text: '#0f172a', second: '#475569', muted: '#94a3b8',
    accent: '#0ea5e9', cyan: '#6366f1', track: '#e2e8f0', isLight: true,
  },
}

const E = [0.25, 0.46, 0.45, 0.94] as const
const TOTAL = 5

const SV = {
  enter: (d: number) => ({ x: d * 56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d * -56, opacity: 0 }),
}

// ── Shared UI primitives ─────────────────────────────────────────────────────

function QNum({ n, t }: { n: number; t: Tok }) {
  return (
    <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted, marginBottom: 14 }}>
      Question {n} of {TOTAL}
    </div>
  )
}

function QHead({ title, sub, t }: { title: string; sub: string; t: Tok }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 30, fontWeight: 700, color: t.text, letterSpacing: '-0.035em', lineHeight: 1.2, margin: '0 0 10px' }}>{title}</h2>
      <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 15, color: t.second, lineHeight: 1.6, margin: 0 }}>{sub}</p>
    </div>
  )
}

function OptionCard({ label, sub, selected, onClick, t }: {
  label: string; sub?: string; selected: boolean; onClick: () => void; t: Tok
}) {
  return (
    <button type="button" onClick={onClick} style={{
      width: '100%', padding: '16px 20px', borderRadius: 12, boxSizing: 'border-box',
      border: `1.5px solid ${selected ? t.accent : t.border}`,
      background: selected ? `${t.accent}12` : t.bg2,
      cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: selected ? `0 0 0 3px ${t.accent}20` : 'none',
      transition: 'all 0.15s ease',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 600, color: selected ? t.accent : t.text, letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: t.second, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? t.accent : t.muted}`,
        background: selected ? t.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
      }}>
        {selected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="2 5.5 4.5 8 8.5 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </button>
  )
}

function CheckCard({ label, icon, checked, toggle, t }: {
  label: string; icon: string; checked: boolean; toggle: () => void; t: Tok
}) {
  return (
    <button type="button" onClick={toggle} style={{
      width: '100%', padding: '14px 18px', borderRadius: 12, boxSizing: 'border-box',
      border: `1.5px solid ${checked ? t.accent : t.border}`,
      background: checked ? `${t.accent}12` : t.bg2,
      cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: checked ? `0 0 0 3px ${t.accent}18` : 'none', transition: 'all 0.15s ease',
    }}>
      <span style={{ fontSize: 18, color: checked ? t.accent : t.muted, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 15, fontWeight: checked ? 500 : 400, color: checked ? t.text : t.second, flex: 1 }}>{label}</span>
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? t.accent : t.muted}`,
        background: checked ? t.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
      }}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="2 5.5 4.5 8 8.5 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </button>
  )
}

// ── Theme preview card (Q1 right panel) ──────────────────────────────────────

function ThemeCard({ theme, selected, onClick, currentT }: {
  theme: 'obsidian' | 'arctic'; selected: boolean; onClick: () => void; currentT: Tok
}) {
  const d = theme === 'obsidian'
  const m = {
    label: d ? 'Obsidian Premium' : 'Arctic Clean',
    sub:   d ? 'Dark · Powerful' : 'Light · Crisp',
    accent: d ? '#3b82f6' : '#0ea5e9',
    cyan:   d ? '#06b6d4' : '#6366f1',
    bg: d ? '#0d0d0f' : '#f8fafc', card: d ? '#111114' : '#ffffff',
    text: d ? '#f0f4ff' : '#0f172a', muted: d ? '#454d5e' : '#94a3b8',
    border: d ? '#1e1e26' : '#e2e8f0',
  }
  return (
    <button type="button" onClick={onClick} style={{
      flex: 1, border: `2px solid ${selected ? m.accent : currentT.border}`,
      borderRadius: 14, cursor: 'pointer', background: 'transparent', overflow: 'hidden',
      boxShadow: selected ? `0 0 0 4px ${m.accent}25` : 'none',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ background: m.bg, padding: '14px 14px 12px', position: 'relative', overflow: 'hidden' }}>
        {d && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${m.accent}80 50%,${m.cyan}60 70%,transparent)` }} />}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ background: m.card, borderRadius: 6, padding: '8px 10px', border: `1px solid ${m.border}` }}>
          <div style={{ fontSize: 8, color: m.muted, fontFamily: 'Geist Mono,monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Revenue MTD</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: m.accent, fontFamily: 'Sora,sans-serif', marginBottom: 5 }}>$12,400</div>
          <div style={{ height: 2, borderRadius: 1, background: m.border }}>
            <div style={{ width: '65%', height: '100%', borderRadius: 1, background: `linear-gradient(90deg,${m.accent},${m.cyan})` }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 18, marginTop: 8 }}>
          {[30,50,40,65,55,75,95].map((h,i) => <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', background: i===6?m.accent:i%2===1?`${m.accent}50`:m.border, height: `${h}%` }} />)}
        </div>
      </div>
      <div style={{ background: selected ? `${m.accent}18` : m.card, borderTop: `1px solid ${m.border}`, padding: '10px 14px', transition: 'background 0.2s' }}>
        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 600, color: selected ? m.accent : m.text }}>{m.label}</div>
        <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: m.muted }}>{m.sub}</div>
      </div>
    </button>
  )
}

// ── Left panel visuals ───────────────────────────────────────────────────────

function DashPreview({ theme }: { theme: 'obsidian' | 'arctic' }) {
  const d      = theme === 'obsidian'
  const bg     = d ? '#0a0a0c' : '#eef2f7'
  const wBg    = d ? '#111114' : '#ffffff'
  const border = d ? '#1e1e26' : 'rgba(15,23,42,0.08)'
  const text   = d ? '#f0f4ff' : '#0f172a'
  const second = d ? '#8892a4' : '#475569'
  const muted  = d ? '#454d5e' : '#94a3b8'
  const accent = d ? '#3b82f6' : '#0ea5e9'
  const cyan   = d ? '#06b6d4' : '#6366f1'
  const shdw   = d ? '0 2px 16px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)' : '0 2px 12px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)'

  // Base widget style — spread into each widget's style prop
  const w = {
    background: wBg,
    borderRadius: 20,
    border: `1px solid ${border}`,
    boxShadow: shdw,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  }

  // SVG line chart for Revenue widget
  const cH = 48, cW = 180
  const vals = [10,17,13,25,19,33,27,39,34,50]
  const pts = vals.map((v,i) => `${(i/9)*cW},${cH-(v/50)*cH*0.88}`).join(' ')
  const fill = `0,${cH} ${pts} ${cW},${cH}`
  const gradId = `lc-${theme}`

  return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px 20px', position: 'relative', overflow: 'hidden' }}>
      {d && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent}80 40%,${cyan}60 60%,transparent)` }} />}

      {/* Preview label */}
      <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: 14, alignSelf: 'flex-start' }}>
        {d ? 'Obsidian Premium' : 'Arctic Clean'} · Preview
      </div>

      {/* iOS-style widget grid: 4 cols × 3 rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%' }}>

        {/* ── Revenue 2×2 ── */}
        <div style={{ ...w, gridColumn: '1 / 3', gridRow: '1 / 3', padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
          {d && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent}70,${cyan}50,transparent)` }} />}
          <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginBottom: 5 }}>Revenue MTD</div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 27, fontWeight: 700, letterSpacing: '-0.04em', color: accent, lineHeight: 1, marginBottom: 5 }}>$50,350</div>
          <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 9, color: '#10b981', background: d ? 'rgba(16,185,129,0.12)' : '#d1fae5', padding: '1px 6px', borderRadius: 999, display: 'inline-block', alignSelf: 'flex-start' }}>↑ 12.4%</span>
          <svg width="100%" height={cH} viewBox={`0 0 ${cW} ${cH}`} preserveAspectRatio="none" style={{ display: 'block', marginTop: 'auto', paddingTop: 10 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={d ? 0.35 : 0.18} />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={fill} fill={`url(#${gradId})`} />
            <polyline points={pts} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ── Tasks Due 1×1 ── */}
        <div style={{ ...w, gridColumn: '3', gridRow: '1', aspectRatio: '1', padding: 13, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>Tasks Due</div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', color: text, lineHeight: 1, marginTop: 'auto' }}>3</div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: second, marginTop: 2 }}>Today</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />)}
          </div>
        </div>

        {/* ── Net Profit 1×1 ── */}
        <div style={{ ...w, gridColumn: '4', gridRow: '1', aspectRatio: '1', padding: 13, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>Net Profit</div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: '#10b981', lineHeight: 1, marginTop: 'auto' }}>$17.6k</div>
          <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: border }}>
            <div style={{ width: '72%', height: '100%', borderRadius: 2, background: '#10b981' }} />
          </div>
        </div>

        {/* ── Team 1×1 ── */}
        <div style={{ ...w, gridColumn: '3', gridRow: '2', aspectRatio: '1', padding: 13, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 10 }}>Team</div>
          <div style={{ display: 'flex' }}>
            {[accent,cyan,'#10b981','#f59e0b'].map((c,i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: `2px solid ${wBg}`, marginLeft: i===0?0:-8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: 'Sora,sans-serif', position: 'relative', zIndex: 4-i }}>
                {['A','J','K','M'][i]}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: second, marginTop: 'auto' }}>4 members</div>
        </div>

        {/* ── Conversion Rate 1×1 ── */}
        <div style={{ ...w, gridColumn: '4', gridRow: '2', aspectRatio: '1', padding: 13, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>Conv.</div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 27, fontWeight: 700, letterSpacing: '-0.04em', color: cyan, lineHeight: 1, marginTop: 'auto' }}>68%</div>
          <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 8, color: '#10b981', background: d ? 'rgba(16,185,129,0.1)' : '#d1fae5', padding: '1px 5px', borderRadius: 999, marginTop: 6, display: 'inline-block', alignSelf: 'flex-start' }}>↑ 4%</span>
        </div>

        {/* ── Active Projects 2×1 ── */}
        <div style={{ ...w, gridColumn: '1 / 3', gridRow: '3', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 4 }}>Active Projects</div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.04em', color: text, lineHeight: 1 }}>8</div>
            </div>
            <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 9, color: accent, background: d ? 'rgba(59,130,246,0.1)' : '#e0f2fe', padding: '3px 8px', borderRadius: 999 }}>Active</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: border }}>
            <div style={{ width: '65%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${accent},${cyan})` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 9, color: second }}>5 of 8 on track</span>
            <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 9, color: accent }}>65%</span>
          </div>
        </div>

        {/* ── Leads Pipeline 2×1 ── */}
        <div style={{ ...w, gridColumn: '3 / 5', gridRow: '3', padding: '14px 16px' }}>
          <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: 4 }}>Leads</div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.04em', color: text, lineHeight: 1, marginBottom: 10 }}>24</div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
            {([[muted,'20%'],[accent,'35%'],[cyan,'25%'],['#10b981','20%']] as [string,string][]).map(([c,ww],i) => (
              <div key={i} style={{ height: 5, borderRadius: 3, background: c, width: ww }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['New','Active','Proposal','Won'] as const).map((l,i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: [muted,accent,cyan,'#10b981'][i] }} />
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 8, color: muted }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function LeftVisual1({ theme }: { theme: 'obsidian' | 'arctic' }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
  )
}

function LeftVisual2({ agencyName, t }: { agencyName: string; t: Tok }) {
  const name = agencyName.trim() || 'Your Agency'
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, background: t.isLight ? 'linear-gradient(135deg,#e0f2fe,#f0f9ff 50%,#ede9fe)' : 'linear-gradient(135deg,#0d0d0f,#0e1120 60%,#0d0d0f)' }}>
      <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted, marginBottom: 20 }}>Your agency</div>
      <motion.div
        key={name}
        initial={{ opacity: 0.5, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: E }}
        style={{ fontFamily: 'Sora,sans-serif', fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, textAlign: 'center', wordBreak: 'break-word', maxWidth: 260, background: `linear-gradient(135deg,${t.text} 40%,${t.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {name}
      </motion.div>
      <div style={{ marginTop: 18, fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: t.second, fontStyle: 'italic' }}>
        precision and harmony across your team.
      </div>
    </div>
  )
}

function LeftVisual3({ teamSize, t }: { teamSize: OnboardingData['teamSize']; t: Tok }) {
  const n = ({ 'just-me': 1, '2-5': 4, '5-10': 8, '10+': 12 } as const)[teamSize]
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: t.isLight ? 'linear-gradient(135deg,#f0fdf4,#e0f2fe)' : 'linear-gradient(135deg,#0d0d0f,#0b1410)' }}>
      <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted, marginBottom: 28 }}>Team size</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxWidth: 180, justifyContent: 'center', marginBottom: 28 }}>
        {Array.from({ length: n }).map((_, i) => (
          <motion.div key={`${teamSize}-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, duration: 0.25, ease: E }}
            style={{ width: 32, height: 32, borderRadius: '50%', background: i===0 ? t.accent : i%3===1 ? t.cyan : t.bg3 }}
          />
        ))}
      </div>
      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em', color: t.accent, lineHeight: 1 }}>
        {n === 12 ? '10+' : n}
      </div>
      <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: t.second, marginTop: 4 }}>{n === 1 ? 'person' : 'people'}</div>
    </div>
  )
}

const MANAGE_OPTS = [
  { v: 'projects' as ManageItem, l: 'Projects & Tasks', icon: '◈' },
  { v: 'leads'    as ManageItem, l: 'Leads & CRM',      icon: '◎' },
  { v: 'invoices' as ManageItem, l: 'Invoices & Billing', icon: '▣' },
  { v: 'finances' as ManageItem, l: 'Finance Tracking', icon: '◆' },
]

function LeftVisual4({ manages, t }: { manages: ManageItem[]; t: Tok }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: t.isLight ? 'linear-gradient(135deg,#faf5ff,#f0f9ff)' : 'linear-gradient(135deg,#0d0d0f,#10091a)' }}>
      <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted, marginBottom: 28 }}>Your workspace</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {MANAGE_OPTS.map(m => {
          const on = manages.includes(m.v)
          return (
            <motion.div key={m.v}
              animate={{ borderColor: on ? t.accent : t.border, background: on ? `${t.accent}15` : t.bg2 }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: 12, border: `1.5px solid ${on ? t.accent : t.border}`, padding: '18px 14px', textAlign: 'center', background: on ? `${t.accent}15` : t.bg2 }}
            >
              <div style={{ fontSize: 24, color: on ? t.accent : t.muted, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: on ? t.text : t.muted, fontWeight: on ? 500 : 400 }}>{m.l.split(' ')[0]}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function LeftVisual5({ t }: { t: Tok }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, background: t.isLight ? 'linear-gradient(135deg,#f0fdf4,#ecfdf5)' : 'linear-gradient(135deg,#0d0d0f,#091410)' }}>
      <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted, marginBottom: 28 }}>Payments</div>
      <div style={{ width: 220, height: 138, borderRadius: 16, background: `linear-gradient(135deg,${t.accent},${t.cyan})`, padding: 20, position: 'relative', overflow: 'hidden', boxShadow: `0 20px 56px ${t.accent}40` }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>Agency OS</div>
        <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 14, color: '#fff', letterSpacing: '0.2em' }}>•••• •••• •••• 4200</div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 8, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expires</div>
            <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 11, color: '#fff' }}>12/27</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginLeft: -10 }} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 22, fontFamily: 'Sora,sans-serif', fontSize: 13, color: t.second }}>
        Powered by <span style={{ color: t.accent, fontWeight: 600 }}>Stripe</span>
      </div>
      <div style={{ marginTop: 6, fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: t.muted, textAlign: 'center', maxWidth: 190 }}>
        Automated invoicing and instant payouts
      </div>
    </div>
  )
}

// ── Right panel step content ─────────────────────────────────────────────────

function S1Theme({ v, set, t }: { v: OnboardingData['theme']; set: (x: OnboardingData['theme']) => void; t: Tok }) {
  const opts = [
    { key: 'obsidian' as const, name: 'Obsidian Premium', desc: 'Dark · Powerful · Focused', swBg: '#0d0d0f', swAc: '#3b82f6', swCy: '#06b6d4' },
    { key: 'arctic'   as const, name: 'Arctic Clean',     desc: 'Light · Crisp · Precise',   swBg: '#f8fafc', swAc: '#0ea5e9', swCy: '#6366f1' },
  ]
  return (
    <>
      <QNum n={1} t={t} />
      <QHead title="Which color scheme do you prefer?" sub="Click to preview. Change anytime in Settings." t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opts.map(o => {
          const sel = v === o.key
          return (
            <button key={o.key} type="button" onClick={() => set(o.key)} style={{
              display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', borderRadius: 14,
              boxSizing: 'border-box', width: '100%', cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${sel ? t.accent : t.border}`,
              background: sel ? `${t.accent}10` : t.bg2,
              boxShadow: sel ? `0 0 0 3px ${t.accent}22, 0 4px 20px ${t.accent}14` : 'none',
              transition: 'all 0.2s ease',
            }}>
              {/* Color swatch */}
              <div style={{ width: 52, height: 52, borderRadius: 10, background: o.swBg, border: `1px solid ${sel ? o.swAc : t.border}`, flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 6, gap: 4, transition: 'border-color 0.2s' }}>
                {o.key === 'obsidian' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${o.swAc}90,${o.swCy}70,transparent)` }} />}
                <div style={{ display: 'flex', gap: 2 }}>
                  {[o.swAc, o.swCy, '#10b981'].map((c,i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />)}
                </div>
                <div style={{ flex: 1, background: o.key === 'obsidian' ? '#111114' : '#ffffff', borderRadius: 3, border: `1px solid ${o.key === 'obsidian' ? '#1e1e26' : '#e2e8f0'}`, overflow: 'hidden' }}>
                  <div style={{ height: '60%', background: `linear-gradient(90deg,${o.swAc},${o.swCy})` }} />
                </div>
              </div>
              {/* Label */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: sel ? t.accent : t.text, marginBottom: 4, transition: 'color 0.2s' }}>{o.name}</div>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: t.second }}>{o.desc}</div>
              </div>
              {/* Check */}
              <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, border: `2px solid ${sel ? t.accent : t.muted}`, background: sel ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {sel && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><polyline points="2.5 5.5 5 8 9 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function S2Name({ v, set, t }: { v: string; set: (x: string) => void; t: Tok }) {
  return (
    <>
      <QNum n={2} t={t} />
      <QHead title="What's your agency called?" sub="Appears on your invoices, reports, and client communications." t={t} />
      <input
        type="text" placeholder="e.g. Creative Co." value={v}
        onChange={e => set(e.target.value)} autoFocus
        style={{
          width: '100%', height: 64, padding: '0 22px', borderRadius: 14, boxSizing: 'border-box',
          border: `2px solid ${t.border}`, background: t.bg2, color: t.text,
          fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${t.accent}18` }}
        onBlur={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = 'none' }}
      />
    </>
  )
}

const SIZES = [
  { v: 'just-me' as const, l: 'Just me',       sub: 'Solo operator' },
  { v: '2-5'     as const, l: '2–5 people',    sub: 'Small crew' },
  { v: '5-10'    as const, l: '5–10 people',   sub: 'Growing agency' },
  { v: '10+'     as const, l: '10+ people',    sub: 'Full team' },
]

function S3Team({ v, set, t }: { v: OnboardingData['teamSize']; set: (x: OnboardingData['teamSize']) => void; t: Tok }) {
  return (
    <>
      <QNum n={3} t={t} />
      <QHead title="How big is your team?" sub="Helps us configure the right features and limits for you." t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SIZES.map(s => <OptionCard key={s.v} label={s.l} sub={s.sub} selected={v === s.v} onClick={() => set(s.v)} t={t} />)}
      </div>
    </>
  )
}

function S4Manages({ v, set, t }: { v: ManageItem[]; set: (x: ManageItem[]) => void; t: Tok }) {
  const allOn = MANAGE_OPTS.every(m => v.includes(m.v))
  const toggle = (item: ManageItem) => set(v.includes(item) ? v.filter(m => m !== item) : [...v, item])
  return (
    <>
      <QNum n={4} t={t} />
      <QHead title="What do you manage?" sub="Select all that apply — we'll build your dashboard around this." t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MANAGE_OPTS.map(m => <CheckCard key={m.v} label={m.l} icon={m.icon} checked={v.includes(m.v)} toggle={() => toggle(m.v)} t={t} />)}
        <CheckCard label="All of the above" icon="✦" checked={allOn} toggle={() => set(allOn ? [] : MANAGE_OPTS.map(m => m.v))} t={t} />
      </div>
    </>
  )
}

function S5Stripe({ v, set, t }: { v: OnboardingData['stripeIntent']; set: (x: OnboardingData['stripeIntent']) => void; t: Tok }) {
  return (
    <>
      <QNum n={5} t={t} />
      <QHead title="Connect Stripe?" sub="Optional. Enables automated invoicing and instant client payments. Connect anytime in Settings." t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <OptionCard label="Yes, connect Stripe" sub="Automated invoicing + instant payouts" selected={v === 'connect'} onClick={() => set('connect')} t={t} />
        <OptionCard label="Skip for now"         sub="Connect Stripe anytime from Settings" selected={v === 'skip'}    onClick={() => set('skip')}    t={t} />
      </div>
      {v === 'connect' && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 18, fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: t.second, lineHeight: 1.6, padding: '12px 16px', background: `${t.accent}12`, borderRadius: 10, border: `1px solid ${t.accent}30`, margin: '18px 0 0' }}>
          You&apos;ll connect Stripe from Settings → Integrations after setup completes.
        </motion.p>
      )}
    </>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    theme: 'obsidian', agencyName: '', teamSize: 'just-me', manages: [], stripeIntent: 'skip',
  })

  const t = THEMES[data.theme]
  const progress = ((step + 1) / TOTAL) * 100

  const next = useCallback(() => { setDir(1); setStep(s => Math.min(s + 1, TOTAL - 1)) }, [])
  const back = useCallback(() => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }, [])

  useEffect(() => { window.history.replaceState({}, '', '/onboarding') }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && step < TOTAL - 1) next()
      if (e.key === 'Escape' && step > 0) back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, next, back])

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

  const leftPanels = [
    <LeftVisual1 key="l1" theme={data.theme} />,
    <LeftVisual2 key="l2" agencyName={data.agencyName} t={t} />,
    <LeftVisual3 key="l3" teamSize={data.teamSize} t={t} />,
    <LeftVisual4 key="l4" manages={data.manages} t={t} />,
    <LeftVisual5 key="l5" t={t} />,
  ]

  const rightPanels = [
    <S1Theme   key="s1" v={data.theme}        set={v => setData(p => ({ ...p, theme: v }))}        t={t} />,
    <S2Name    key="s2" v={data.agencyName}   set={v => setData(p => ({ ...p, agencyName: v }))}   t={t} />,
    <S3Team    key="s3" v={data.teamSize}     set={v => setData(p => ({ ...p, teamSize: v }))}     t={t} />,
    <S4Manages key="s4" v={data.manages}      set={v => setData(p => ({ ...p, manages: v }))}      t={t} />,
    <S5Stripe  key="s5" v={data.stripeIntent} set={v => setData(p => ({ ...p, stripeIntent: v }))} t={t} />,
  ]

  return (
    <motion.div
      animate={{ backgroundColor: t.bg }}
      transition={{ duration: 0.35, ease: E }}
      style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: t.bg }}
    >
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.track, zIndex: 200 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: E }}
          style={{ height: '100%', background: `linear-gradient(90deg,${t.accent},${t.cyan})` }}
        />
      </div>

      {/* Split layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginTop: 3 }}>

        {/* Left — visual */}
        <motion.div
          animate={{ borderRightColor: t.border }}
          style={{ width: '45%', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRight: `1px solid ${t.border}` }}
        >
          {/* Logo */}
          <div style={{ position: 'absolute', top: 24, left: 28, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {[12,18,14,10,16].map((h,i) => (
                <motion.div key={i} animate={{ background: t.accent }} style={{ width: 3, height: h, borderRadius: 2, background: t.accent }} />
              ))}
            </div>
            <motion.span animate={{ color: t.text }} style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 600, color: t.text }}>
              CreatingHarmony
            </motion.span>
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={`left-${step}`} custom={dir} variants={SV} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease: E }}
              style={{ width: '100%', height: '100%' }}
            >
              {leftPanels[step]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right — question */}
        <motion.div
          animate={{ backgroundColor: t.bg2 }}
          transition={{ duration: 0.35, ease: E }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: t.bg2 }}
        >
          {/* Step counter */}
          <div style={{ padding: '24px 48px 0', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.span animate={{ color: t.muted }} style={{ fontFamily: 'Geist Mono,monospace', fontSize: 11, letterSpacing: '0.08em', color: t.muted }}>
              {step + 1} / {TOTAL}
            </motion.span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 48px' }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={`right-${step}`} custom={dir} variants={SV} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: E }}
              >
                {rightPanels[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div style={{ padding: '20px 48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.border}` }}>
            {step > 0 ? (
              <button type="button" onClick={back} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 15, color: t.second, padding: '10px 0',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = t.text)}
                onMouseLeave={e => (e.currentTarget.style.color = t.second)}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11.5 13.5L7 9l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            ) : <div />}

            <button type="button" onClick={step === TOTAL - 1 ? finish : next} disabled={saving} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg,${t.accent},${t.cyan})`,
              border: 'none', borderRadius: 12, padding: '14px 28px',
              cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 600, color: '#fff',
              opacity: saving ? 0.7 : 1,
              boxShadow: `0 4px 20px ${t.accent}40`,
              transition: 'opacity 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {saving ? 'Setting up…' : step === TOTAL - 1 ? 'Get Started →' : 'Next →'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
