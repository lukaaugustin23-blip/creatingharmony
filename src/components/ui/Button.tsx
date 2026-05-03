import { Spinner } from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variants = {
  primary:
    'bg-obsidian-accent text-white shadow-btn-primary hover:bg-[#2563eb] active:bg-[#1d4ed8]',
  secondary:
    'bg-obsidian-bg-3 text-obsidian-text border border-obsidian-border hover:bg-obsidian-bg hover:border-obsidian-text-second',
  ghost:
    'bg-transparent text-obsidian-accent border border-obsidian-accent/30 hover:border-obsidian-accent hover:bg-obsidian-accent-soft',
  danger:
    'bg-obsidian-danger-soft text-obsidian-danger border border-obsidian-danger/20 hover:bg-obsidian-danger/20',
}

const sizes = {
  sm: 'text-sm px-4 py-[7px] rounded-sm gap-1.5',
  md: 'text-base px-5 py-[11px] rounded-md gap-2',
  lg: 'text-md px-6 py-[13px] rounded-md gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em]',
        'transition-all duration-fast cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian-accent focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-bg-2',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
