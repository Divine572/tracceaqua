import type { ReactNode } from 'react'
import { Shield, UserCheck, Crown, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { AuthButton } from './AuthButton'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredRole?: string
  fallback?: ReactNode
  showConnectButton?: boolean
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  requiredRole, 
  fallback,
  showConnectButton = true
}: ProtectedRouteProps) {
  const { user, hasPermission, hasRole, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="text-center py-12">
        <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600 mb-6">Please connect your wallet to access this content</p>
        {showConnectButton && (
          <div className="flex justify-center">
            <AuthButton />
          </div>
        )}
      </div>
    )
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Access Denied</h3>
        <p className="text-gray-600 mb-2">You don't have permission to access this content</p>
        <p className="text-sm text-gray-500">Required permission: <code className="bg-gray-100 px-2 py-1 rounded">{requiredPermission}</code></p>
      </div>
    )
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="text-center py-12">
        <Crown className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-orange-600 mb-2">Role Required</h3>
        <p className="text-gray-600 mb-2">This content is restricted to {requiredRole}s only</p>
        <p className="text-sm text-gray-500">Your current role: <span className={user.role.color}>{user.role.name}</span></p>
      </div>
    )
  }

  return <>{children}</>
}
