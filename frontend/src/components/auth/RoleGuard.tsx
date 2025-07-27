import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: string[]
  allowedPermissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function RoleGuard({ 
  children, 
  allowedRoles = [], 
  allowedPermissions = [],
  requireAll = false,
  fallback = null
}: RoleGuardProps) {
  const { user, hasPermission, hasRole } = useAuth()

  if (!user) return fallback

  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role))
  
  const hasRequiredPermissions = allowedPermissions.length === 0 || 
    (requireAll 
      ? allowedPermissions.every(permission => hasPermission(permission))
      : allowedPermissions.some(permission => hasPermission(permission))
    )

  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>
  }

  return fallback
}