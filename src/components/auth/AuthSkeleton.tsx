function SkeletonLine({
  width = 'w-full',
  height = 'h-4',
  className = '',
}: {
  width?: string
  height?: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm bg-arctic-bg-3 ${width} ${height} ${className}`}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
        }}
      />
    </div>
  )
}

export function AuthSkeleton() {
  return (
    <div className="w-full max-w-[400px]" aria-label="Loading form" aria-busy="true">
      {/* Heading */}
      <SkeletonLine width="w-44" height="h-8" className="mb-2" />
      <SkeletonLine width="w-56" height="h-4" className="mb-8" />

      {/* Google button */}
      <SkeletonLine height="h-11" className="mb-6 rounded-md shadow-arctic-sm" />

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-arctic-border" />
        <SkeletonLine width="w-32" height="h-3" />
        <div className="flex-1 h-px bg-arctic-border" />
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-5">
        <div>
          <SkeletonLine width="w-24" height="h-3" className="mb-[6px]" />
          <SkeletonLine height="h-11" className="rounded-md" />
        </div>
        <div>
          <SkeletonLine width="w-20" height="h-3" className="mb-[6px]" />
          <SkeletonLine height="h-11" className="rounded-md" />
        </div>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end mb-6">
        <SkeletonLine width="w-28" height="h-3" />
      </div>

      {/* Submit button */}
      <SkeletonLine height="h-11" className="rounded-md" />

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <SkeletonLine width="w-36" height="h-3" />
        <SkeletonLine width="w-14" height="h-3" />
      </div>
    </div>
  )
}
