export interface UserRole {
  id: string
  name: string
  level: number
  permissions: string[]
  icon: string
  color: string
  description: string
}

export interface User {
  id: string
  walletAddress?: string
  email?: string
  name?: string
  avatar?: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isConnected: boolean
  connectWallet: () => Promise<void>
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (roleId: string) => boolean
  updateUserRole: (userId: string, roleId: string) => Promise<boolean>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}