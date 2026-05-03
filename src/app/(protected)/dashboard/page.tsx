import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-obsidian-bg flex items-center justify-center">
      <div className="text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-success/10 border border-obsidian-success/20 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-obsidian-success" />
          <span className="font-mono text-2xs tracking-[0.1em] uppercase text-obsidian-success">
            Authenticated
          </span>
        </div>
        <h1 className="font-display font-bold text-4xl tracking-[-0.04em] text-obsidian-text mb-3">
          Dashboard
        </h1>
        <p className="font-body text-obsidian-text-second text-base max-w-sm mx-auto leading-[1.7]">
          Signed in as{' '}
          <span className="font-mono text-sm text-obsidian-accent">
            {user.email}
          </span>
        </p>
      </div>
    </div>
  )
}
