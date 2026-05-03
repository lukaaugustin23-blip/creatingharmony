import { AuthSkeleton } from '@/components/auth/AuthSkeleton'

export default function AuthLoading() {
  return (
    <div className="w-full flex items-center justify-center px-6 py-10 sm:px-8">
      <AuthSkeleton />
    </div>
  )
}
