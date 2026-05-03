'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/Spinner'

// ─── Tokens ───────────────────────────────────────────────────────────────────

export const AC = {
  bg2:    '#111114',
  border: '#1e1e26',
  text:   '#f0f4ff',
  second: '#8892a4',
  muted:  '#454d5e',
  accent: '#3b82f6',
  cyan:   '#06b6d4',
  danger: '#ef4444',
} as const

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  height: '56px',
  padding: '16px 20px',
  borderRadius: '14px',
  border: `1.5px solid ${AC.border}`,
  background: AC.bg2,
  color: AC.text,
  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
}

// ─── Label ────────────────────────────────────────────────────────────────────

export function AuthLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-geist-mono, monospace)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: AC.second,
      marginBottom: '8px',
    }}>
      {children}
    </div>
  )
}

// ─── Text input ───────────────────────────────────────────────────────────────

interface AuthInputProps {
  id: string
  type?: string
  name: string
  autoComplete: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  hasError: boolean
}

export function AuthInput({ id, type = 'text', name, autoComplete, placeholder, value, onChange, disabled, hasError }: AuthInputProps) {
  const errorBorder = 'rgba(239,68,68,0.65)'
  const errorRing   = 'rgba(239,68,68,0.15)'

  return (
    <input
      id={id} type={type} name={name} autoComplete={autoComplete}
      placeholder={placeholder} value={value} onChange={onChange}
      disabled={disabled} aria-invalid={hasError}
      className="auth-input"
      style={{
        ...INPUT_BASE,
        borderColor: hasError ? errorBorder : AC.border,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
      onFocus={e => {
        e.target.style.borderColor = hasError ? errorBorder : AC.accent
        e.target.style.boxShadow   = hasError
          ? `0 0 0 3px ${errorRing}`
          : '0 0 0 3px rgba(59,130,246,0.18)'
      }}
      onBlur={e => {
        e.target.style.borderColor = hasError ? errorBorder : AC.border
        e.target.style.boxShadow   = 'none'
      }}
    />
  )
}

// ─── Password input ───────────────────────────────────────────────────────────

interface AuthPasswordProps {
  id?: string
  name?: string
  autoComplete?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  hasError: boolean
}

export function AuthPasswordInput({
  id = 'password',
  name = 'password',
  autoComplete = 'current-password',
  placeholder = '••••••••',
  value, onChange, disabled, hasError,
}: AuthPasswordProps) {
  const [visible, setVisible] = useState(false)
  const errorBorder = 'rgba(239,68,68,0.65)'
  const errorRing   = 'rgba(239,68,68,0.15)'

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id} type={visible ? 'text' : 'password'} name={name}
        autoComplete={autoComplete} placeholder={placeholder}
        value={value} onChange={onChange} disabled={disabled} aria-invalid={hasError}
        className="auth-input"
        style={{
          ...INPUT_BASE,
          paddingRight: '52px',
          borderColor: hasError ? errorBorder : AC.border,
          opacity: disabled ? 0.55 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={e => {
          e.target.style.borderColor = hasError ? errorBorder : AC.accent
          e.target.style.boxShadow   = hasError
            ? `0 0 0 3px ${errorRing}`
            : '0 0 0 3px rgba(59,130,246,0.18)'
        }}
        onBlur={e => {
          e.target.style.borderColor = hasError ? errorBorder : AC.border
          e.target.style.boxShadow   = 'none'
        }}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', padding: '2px', lineHeight: 0,
          cursor: 'pointer', color: AC.muted, transition: 'color 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = AC.second)}
        onMouseLeave={e => (e.currentTarget.style.color = AC.muted)}
      >
        {visible
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  )
}

// ─── Error message ────────────────────────────────────────────────────────────

export function AuthFieldError({ message }: { message: string | undefined }) {
  if (!message) return null
  return (
    <p role="alert" style={{
      marginTop: '5px',
      fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
      fontSize: '12px', color: '#fca5a5',
    }}>
      {message}
    </p>
  )
}

// ─── General error banner ─────────────────────────────────────────────────────

export function AuthErrorBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div role="alert" style={{
      marginBottom: '20px', padding: '10px 14px', borderRadius: '12px',
      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)',
    }}>
      <p style={{ fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: '13px', color: '#fca5a5' }}>
        {message}
      </p>
    </div>
  )
}

// ─── Submit button ────────────────────────────────────────────────────────────

interface AuthSubmitProps {
  loading: boolean
  disabled: boolean
  label: string
  loadingLabel: string
}

export function AuthSubmitButton({ loading, disabled, label, loadingLabel }: AuthSubmitProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: '100%',
        height: '56px',
        padding: '0 20px',
        borderRadius: '14px',
        border: 'none',
        background: `linear-gradient(135deg, ${AC.accent} 0%, ${AC.cyan} 100%)`,
        color: '#fff',
        fontFamily: 'var(--font-sora, Sora, sans-serif)',
        fontSize: '16px', fontWeight: 600,
        boxSizing: 'border-box' as const,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        boxShadow: '0 4px 16px rgba(59,130,246,0.32), 0 1px 3px rgba(59,130,246,0.18)',
        transition: 'opacity 0.15s, transform 0.1s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.40), 0 2px 6px rgba(59,130,246,0.22)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.32), 0 1px 3px rgba(59,130,246,0.18)'
      }}
    >
      {loading && <Spinner size="sm" />}
      {loading ? loadingLabel : label}
    </button>
  )
}

// ─── OR divider ───────────────────────────────────────────────────────────────

export function AuthDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0' }}>
      <div style={{ flex: 1, height: '1px', background: AC.border }} />
      <span style={{
        fontFamily: 'var(--font-geist-mono, monospace)',
        fontSize: '10px', letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: AC.muted,
      }}>
        or
      </span>
      <div style={{ flex: 1, height: '1px', background: AC.border }} />
    </div>
  )
}

// ─── Google button ────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

interface AuthGoogleButtonProps {
  onClick: () => void
  loading: boolean
  disabled: boolean
}

export function AuthGoogleButton({ onClick, loading, disabled }: AuthGoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: '56px',
        padding: '0 20px',
        borderRadius: '14px',
        border: '1.5px solid rgba(255,255,255,0.10)',
        background: '#1a1a1e',
        color: AC.text,
        fontFamily: 'var(--font-sora, Sora, sans-serif)',
        fontSize: '17px', fontWeight: 700,
        letterSpacing: '-0.01em',
        boxSizing: 'border-box' as const,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
          e.currentTarget.style.background   = '#222228'
          e.currentTarget.style.transform    = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
        e.currentTarget.style.background   = '#1a1a1e'
        e.currentTarget.style.transform    = 'translateY(0)'
      }}
    >
      {loading ? <Spinner size="sm" /> : <GoogleIcon />}
      {loading ? 'Connecting…' : 'Continue with Google'}
    </button>
  )
}

// ─── Logo wordmark ────────────────────────────────────────────────────────────

export function AuthLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: `linear-gradient(135deg, ${AC.accent}, ${AC.cyan})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(59,130,246,0.40)',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2"  y="10" width="4" height="12" rx="1.5" fill="white" opacity="0.90"/>
          <rect x="8"  y="5"  width="4" height="17" rx="1.5" fill="white" opacity="1.00"/>
          <rect x="14" y="8"  width="4" height="14" rx="1.5" fill="white" opacity="0.95"/>
          <rect x="20" y="13" width="4" height="9"  rx="1.5" fill="white" opacity="0.80"/>
        </svg>
      </div>
      <span style={{
        fontFamily: 'var(--font-sora, Sora, sans-serif)',
        fontSize: '16px', fontWeight: 600, color: AC.text, letterSpacing: '-0.02em',
      }}>
        CreatingHarmony
      </span>
    </div>
  )
}

// ─── Remember me checkbox ─────────────────────────────────────────────────────

interface AuthRememberProps {
  checked: boolean
  onChange: (v: boolean) => void
}

export function AuthRememberMe({ checked, onChange }: AuthRememberProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '16px', height: '16px', borderRadius: '4px', border: 'none', flexShrink: 0,
          background: checked ? AC.accent : '#16161a',
          outline: `1.5px solid ${checked ? AC.accent : AC.border}`,
          outlineOffset: '0px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <span style={{
        fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
        fontSize: '13px', color: AC.second, userSelect: 'none',
      }}>
        Remember me
      </span>
    </label>
  )
}
