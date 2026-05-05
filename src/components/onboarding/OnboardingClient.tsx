'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Q1ColorScheme from './Q1ColorScheme'
import ShowcaseShell from './ShowcaseShell'
import ShowcaseProjects from './ShowcaseProjects'
import ShowcaseLeads from './ShowcaseLeads'
import ShowcaseCalendar from './ShowcaseCalendar'

type Theme = 'obsidian' | 'arctic'

const E = [0.25, 0.46, 0.45, 0.94] as const

const SV = {
  enter: (d: number) => ({ x: d * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d * -60, opacity: 0 }),
}

export default function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [theme, setTheme] = useState<Theme>('obsidian')
  const [finishing, setFinishing] = useState(false)

  const next = useCallback(() => { setDir(1);  setStep(s => s + 1) }, [])
  const back = useCallback(() => { setDir(-1); setStep(s => s - 1) }, [])

  const handleThemeDone = (t: Theme) => {
    setTheme(t)
    next()
  }

  const handleDashboard = async () => {
    if (finishing) return
    setFinishing(true)
    try {
      const supabase = createClient()
      await supabase.from('profiles').upsert({
        id: userId,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
    } catch { /* silent */ }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <AnimatePresence mode="wait" custom={dir}>
        {step === 0 && (
          <motion.div
            key="q1"
            custom={dir}
            variants={SV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: E }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Q1ColorScheme userId={userId} onDone={handleThemeDone} />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="s1"
            custom={dir}
            variants={SV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: E }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ShowcaseShell
              theme={theme}
              showcaseStep={0}
              onBack={() => { setDir(-1); setStep(0) }}
              onNext={next}
              onSkip={handleDashboard}
            >
              <ShowcaseProjects theme={theme} />
            </ShowcaseShell>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            custom={dir}
            variants={SV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: E }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ShowcaseShell
              theme={theme}
              showcaseStep={1}
              onBack={back}
              onNext={next}
              onSkip={handleDashboard}
            >
              <ShowcaseLeads theme={theme} />
            </ShowcaseShell>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            custom={dir}
            variants={SV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: E }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ShowcaseShell
              theme={theme}
              showcaseStep={2}
              onBack={back}
              onNext={handleDashboard}
              onSkip={handleDashboard}
            >
              <ShowcaseCalendar theme={theme} />
            </ShowcaseShell>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
