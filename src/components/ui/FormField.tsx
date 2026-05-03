interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}

export function FormField({
  label,
  error,
  required,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-2xs tracking-[0.1em] uppercase text-obsidian-muted mb-[6px]"
      >
        {label}
        {required && (
          <span className="text-obsidian-danger ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className="mt-[6px] font-body text-xs text-obsidian-danger animate-fade-in"
        >
          {error}
        </p>
      )}
    </div>
  )
}
