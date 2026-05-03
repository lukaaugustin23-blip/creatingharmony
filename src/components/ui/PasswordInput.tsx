'use client'

import { useState } from 'react'

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function PasswordInput({ hasError, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        className={[
          'w-full font-body text-base px-4 py-[10px] pr-11 rounded-md outline-none',
          'transition-all duration-base bg-obsidian-bg-3 text-obsidian-text',
          'placeholder:text-obsidian-muted disabled:opacity-60 disabled:cursor-not-allowed border',
          hasError
            ? 'border-obsidian-danger focus:border-obsidian-danger focus:ring-2 focus:ring-obsidian-danger/20'
            : 'border-obsidian-border focus:border-obsidian-accent focus:ring-2 focus:ring-obsidian-accent/20',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-muted hover:text-obsidian-text-second transition-colors duration-fast cursor-pointer"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  )
}
