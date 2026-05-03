export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface FormErrors {
  name?: string
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export type ManageItem = 'projects' | 'leads' | 'invoices' | 'finances'

export interface OnboardingData {
  theme: 'obsidian' | 'arctic'
  agencyName: string
  teamSize: 'just-me' | '2-5' | '5-10' | '10+'
  manages: ManageItem[]
  stripeIntent: 'connect' | 'skip'
}

export interface Profile {
  id: string
  agency_name: string | null
  team_size: string | null
  manages: ManageItem[] | null
  stripe_intent: 'connect' | 'skip' | null
  theme: 'obsidian' | 'arctic' | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}
