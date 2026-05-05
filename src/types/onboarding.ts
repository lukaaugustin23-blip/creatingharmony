export type Module =
  | 'invoicing'
  | 'finance'
  | 'leads'
  | 'projects'
  | 'tasks'
  | 'team'
  | 'scripts'
  | 'command_center'

export type Widget =
  | 'revenue_mtd'
  | 'net_profit'
  | 'expenses'
  | 'outstanding_invoices'
  | 'mrr'
  | 'active_projects'
  | 'tasks_due_today'
  | 'leads_pipeline'
  | 'team_workload'
  | 'conversion_rate'
  | 'cash_flow'
  | 'recent_activity'
  | 'upcoming_deadlines'
  | 'quick_add'

export interface InvoiceDefaults {
  type: 'recurring' | 'one-time' | 'both'
  frequency?: 'monthly'
  milestones?: boolean
}

export interface OnboardingAnswers {
  agencyName: string
  agencyType: string
  missionStatement?: string
  teamSize: 'solo' | '2-5' | '6-15' | '15+'
  revenueModel: 'retainers' | 'projects' | 'both'
  biggestChallenges: string[]
}

export interface UserConfig {
  enabledModules: Module[]
  dashboardWidgets: Widget[]
  invoiceDefaults: InvoiceDefaults
  teamFeaturesEnabled: boolean
  commandCenterEnabled: boolean
  priorityModule: string
}
