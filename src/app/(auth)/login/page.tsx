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
  AuthDivider, AuthGoogleButton, AuthRememberMe, AC,
} from '@/components/auth/AuthFormFields'
import type { LoginFormData, FormErrors } from '@/types'

const ease = [0.25, 0.46, 0.45, 0.94] as const

function fade(delay: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, delay, ease },
  }
}

function validate(data: LoginFormData): FormErrors {
  const e: FormErrors = {}
  if (!data.email.trim()) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
  if (!data.password) e.password = 'Password is required'
  return e
}

function mapError(msg: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Incorrect email or password.',
    'Email not confirmed': 'Please verify your email first.',
    'Too many requests': 'Too many attempts. Try again later.',
  }
  return map[msg] ?? 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const router  = useRouter()
  const mounted = useMounted()

  const [form, setForm]             = useState<LoginFormData>({ email: '', password: '' })
  const [errors, setErrors]         = useState<FormErrors>({})
  const [generalError, setGeneral]  = useState<string | null>(null)
  const [loading, setLoading]       = useState(false)
  const [oauthLoading, setOauth]    = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const clearError = useCallback((field: keyof FormErrors) => {
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
    if (generalError)  setGeneral(null)
  }, [errors, generalError])

  const handle = (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }))
      clearError(field)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setGeneral(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(), password: form.password,
      })
      if (error) { setGeneral(mapError(error.message)); return }
      router.push('/dashboard')
      router.refresh()
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
      {/* Logo */}
      <motion.div {...fade(0.05)}>
        <AuthLogo />
      </motion.div>

      {/* Welcome back */}
      <motion.div {...fade(0.10)} style={{ marginTop: '20px' }}>
        <h1 style={{
          fontFamily: 'var(--font-sora, Sora, sans-serif)',
          fontSize: '28px', fontWeight: 700, color: AC.text,
          letterSpacing: '-0.04em', lineHeight: 1.1,
          margin: 0,
        }}>
          Welcome back
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div {...fade(0.15)} style={{ marginTop: '20px' }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '15px', color: AC.second, lineHeight: 1.5,
          margin: 0,
        }}>
          Sign in to continue to your dashboard.
        </p>
      </motion.div>

      {generalError && (
        <motion.div {...fade(0.18)} style={{ marginTop: '20px' }}>
          <AuthErrorBanner message={generalError} />
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <motion.div {...fade(0.22)} style={{ marginTop: '20px' }}>
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
        <motion.div {...fade(0.28)} style={{ marginTop: '20px' }}>
          <AuthLabel>Password</AuthLabel>
          <AuthPasswordInput
            value={form.password} onChange={handle('password')}
            disabled={busy} hasError={!!errors.password}
          />
          <AuthFieldError message={errors.password} />
        </motion.div>

        {/* Remember me + Forgot */}
        <motion.div
          {...fade(0.33)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}
        >
          <AuthRememberMe checked={rememberMe} onChange={setRememberMe} />
          <button
            type="button"
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '13px', color: AC.accent, transition: 'opacity 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Forgot password?
          </button>
        </motion.div>

        {/* Sign In */}
        <motion.div {...fade(0.38)} style={{ marginTop: '20px' }}>
          <AuthSubmitButton
            loading={loading} disabled={busy}
            label="Sign In" loadingLabel="Signing in…"
          />
        </motion.div>
      </form>

      {/* OR divider */}
      <motion.div {...fade(0.44)} style={{ marginTop: '20px' }}>
        <AuthDivider />
      </motion.div>

      {/* Google */}
      <motion.div {...fade(0.49)} style={{ marginTop: '20px' }}>
        <AuthGoogleButton onClick={handleGoogle} loading={oauthLoading} disabled={busy} />
      </motion.div>

      {/* Sign up link */}
      <motion.p
        {...fade(0.54)}
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '13px', color: AC.second,
          margin: 0, marginTop: '20px',
        }}
      >
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: AC.accent, fontWeight: 500, textDecoration: 'none' }}>
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  )
}
