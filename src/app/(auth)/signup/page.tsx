'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useMounted } from '@/lib/hooks/useMounted'
import {
  AuthLogo, AuthLabel, AuthInput, AuthPasswordInput,
  AuthFieldError, AuthErrorBanner, AuthSubmitButton,
  AuthDivider, AuthGoogleButton, AC,
} from '@/components/auth/AuthFormFields'
import type { FormErrors } from '@/types'

const ease = [0.25, 0.46, 0.45, 0.94] as const

function fade(delay: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, delay, ease },
  }
}

interface SignupForm { name: string; email: string; password: string }

function validate(data: SignupForm): FormErrors {
  const e: FormErrors = {}
  if (!data.name.trim()) e.name = 'Full name is required'
  if (!data.email.trim()) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
  if (!data.password) e.password = 'Password is required'
  else if (data.password.length < 8) e.password = 'At least 8 characters required'
  return e
}

function mapError(msg: string): string {
  const map: Record<string, string> = {
    'User already registered': 'An account with this email already exists.',
    'Too many requests': 'Too many attempts. Try again later.',
  }
  return map[msg] ?? 'Something went wrong. Please try again.'
}

export default function SignupPage() {
  const router  = useRouter()
  const mounted = useMounted()

  const [form, setForm]            = useState<SignupForm>({ name: '', email: '', password: '' })
  const [errors, setErrors]        = useState<FormErrors>({})
  const [generalError, setGeneral] = useState<string | null>(null)
  const [loading, setLoading]      = useState(false)
  const [oauthLoading, setOauth]   = useState(false)
  const [confirmed, setConfirmed]  = useState(false)

  const clearError = useCallback((field: keyof FormErrors) => {
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
    if (generalError)  setGeneral(null)
  }, [errors, generalError])

  const handle = (field: keyof SignupForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }))
      clearError(field as keyof FormErrors)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setGeneral(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { full_name: form.name.trim() } },
      })
      if (error) { setGeneral(mapError(error.message)); return }
      if (data.session) { router.push('/onboarding'); router.refresh() }
      else setConfirmed(true)
    } catch {
      setGeneral('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setOauth(true); setGeneral(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) { setGeneral(mapError(error.message)); setOauth(false) }
    } catch {
      setGeneral('Failed to connect with Google.')
      setOauth(false)
    }
  }

  if (!mounted) return null

  const busy = loading || oauthLoading

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease }}
        style={{ width: '100%', maxWidth: '100%', minWidth: 0, textAlign: 'center' }}
      >
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 20px',
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-sora, Sora, sans-serif)',
          fontSize: '24px', fontWeight: 700, color: AC.text,
          letterSpacing: '-0.03em', marginBottom: '10px',
        }}>
          Check your email
        </h2>
        <p style={{
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '14px', color: AC.second, lineHeight: 1.7, marginBottom: '28px',
        }}>
          Confirmation link sent to{' '}
          <span style={{ color: AC.text, fontWeight: 500 }}>{form.email}</span>.
        </p>
        <Link href="/login" style={{ color: AC.accent, fontWeight: 500, fontSize: '14px', fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', textDecoration: 'none' }}>
          Back to sign in
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
    >
      {/* Logo */}
      <motion.div {...fade(0.05)}>
        <AuthLogo />
      </motion.div>

      {/* Heading */}
      <motion.div {...fade(0.10)} style={{ marginTop: '20px' }}>
        <h1 style={{
          fontFamily: 'var(--font-sora, Sora, sans-serif)',
          fontSize: '28px', fontWeight: 700, color: AC.text,
          letterSpacing: '-0.04em', lineHeight: 1.1,
          margin: 0,
        }}>
          Create your account
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div {...fade(0.15)} style={{ marginTop: '20px' }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '15px', color: AC.second, lineHeight: 1.5,
          margin: 0,
        }}>
          Get your agency running in minutes.
        </p>
      </motion.div>

      {generalError && (
        <motion.div {...fade(0.18)} style={{ marginTop: '20px' }}>
          <AuthErrorBanner message={generalError} />
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Full name */}
        <motion.div {...fade(0.22)} style={{ marginTop: '20px' }}>
          <AuthLabel>Full name</AuthLabel>
          <AuthInput
            id="name" type="text" name="name" autoComplete="name"
            placeholder="Alex Johnson"
            value={form.name} onChange={handle('name')}
            disabled={busy} hasError={!!errors.name}
          />
          <AuthFieldError message={errors.name} />
        </motion.div>

        {/* Email */}
        <motion.div {...fade(0.28)} style={{ marginTop: '20px' }}>
          <AuthLabel>Email address</AuthLabel>
          <AuthInput
            id="email" type="email" name="email" autoComplete="email"
            placeholder="you@agency.com"
            value={form.email} onChange={handle('email')}
            disabled={busy} hasError={!!errors.email}
          />
          <AuthFieldError message={errors.email} />
        </motion.div>

        {/* Password */}
        <motion.div {...fade(0.34)} style={{ marginTop: '20px' }}>
          <AuthLabel>Password</AuthLabel>
          <AuthPasswordInput
            id="password" name="password" autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={form.password} onChange={handle('password')}
            disabled={busy} hasError={!!errors.password}
          />
          <AuthFieldError message={errors.password} />
        </motion.div>

        {/* Create Account */}
        <motion.div {...fade(0.40)} style={{ marginTop: '20px' }}>
          <AuthSubmitButton
            loading={loading} disabled={busy}
            label="Create Account" loadingLabel="Creating account…"
          />
        </motion.div>
      </form>

      {/* OR divider */}
      <motion.div {...fade(0.46)} style={{ marginTop: '20px' }}>
        <AuthDivider />
      </motion.div>

      {/* Google */}
      <motion.div {...fade(0.52)} style={{ marginTop: '20px' }}>
        <AuthGoogleButton onClick={handleGoogle} loading={oauthLoading} disabled={busy} />
      </motion.div>

      {/* Sign in link */}
      <motion.p
        {...fade(0.58)}
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '13px', color: AC.second,
          margin: 0, marginTop: '20px',
        }}
      >
        Already have an account?{' '}
        <Link href="/login" style={{ color: AC.accent, fontWeight: 500, textDecoration: 'none' }}>
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  )
}
