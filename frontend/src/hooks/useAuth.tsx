import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import type { User } from '../types/auth'
import type { AuthContextType } from '../types/auth'
import { USER_ROLES } from '../constants/roles'
import { apiClient } from '../services/api'
import { showToast } from '../utils/toast'


const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { open } = useAppKit()

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true)
      await open()
    } catch (error) {
      console.error('Wallet connection failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [open])

  // Sign in with wallet signature
  const signIn = useCallback(async () => {
  if (!address) {
    throw new Error('No wallet address found')
  }

  setIsLoading(true)
  const loadingToast = showToast.loading('Signing message...')
  
  try {
    const message = `Welcome to TracceAqua!\n\nPlease sign this message to authenticate your account.\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nChain: Sepolia`
    
    const signature = await signMessageAsync({ message })
    
    showToast.dismiss(loadingToast)
    const verifyingToast = showToast.loading('Verifying signature...')
    
    const response = await apiClient.post('/auth/verify', {
      address: address.toLowerCase(),
      message,
      signature,
    })

    showToast.dismiss(verifyingToast)

    if (response.data.success) {
      setUser(response.data.data.user)
      
      if (response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token)
      }
      
      showToast.success(`Welcome back, ${response.data.data.user.role.name}!`)
    } else {
      throw new Error(response.data.error || 'Authentication failed')
    }
  } catch (error) {
    showToast.dismiss(loadingToast)
    console.error('Sign in failed:', error)
    showToast.error(
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message || 'Authentication failed'
        : 'Authentication failed'
    )
    throw error
  } finally {
    setIsLoading(false)
  }
}, [address, signMessageAsync])



// Update the signOut function:
const signOut = useCallback(async () => {
  try {
    setIsLoading(true)
    
    localStorage.removeItem('auth_token')
    
    await apiClient.post('/auth/logout').catch(() => {})
    
    await disconnect()
    
    setUser(null)
    showToast.success('Signed out successfully')
  } catch (error) {
    console.error('Sign out failed:', error)
    showToast.error('Sign out failed')
  } finally {
    setIsLoading(false)
  }
}, [disconnect])

  // Permission checking
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false
    const userPermissions = user.role.permissions
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }, [user])

  const hasRole = useCallback((roleId: string): boolean => {
    return user?.role.id === roleId
  }, [user])

  // Update user role (admin only)
  const updateUserRole = useCallback(async (userId: string, roleId: string): Promise<boolean> => {
    if (!hasPermission('admin.users.write')) {
      throw new Error('Insufficient permissions')
    }

    try {
      setIsLoading(true)
      const response = await apiClient.put(`/users/${userId}/role`, { roleId })
      
      if (response.data.success) {
        // Update local user state if it's the current user
        if (user && user.id === userId) {
          setUser(prev => prev ? { ...prev, role: USER_ROLES[roleId] } : null)
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Role update failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [hasPermission, user])

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (isConnected && address && !user && !isLoading) {
      signIn().catch(console.error)
    }
  }, [isConnected, address, user, isLoading, signIn])

  // Check for existing auth token on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token && !user) {
        try {
          setIsLoading(true)
          const response = await apiClient.get('/auth/me')
          if (response.data.success) {
            setUser(response.data.data)
          }
        } catch (error) {
          // Clear invalid token
          localStorage.removeItem('auth_token')
        } finally {
          setIsLoading(false)
        }
      }
    }

    checkExistingAuth()
  }, [user])

  const value: AuthContextType = {
    user,
    isLoading: isLoading || isConnecting,
    isConnected,
    connectWallet,
    signIn,
    signOut,
    hasPermission,
    hasRole,
    updateUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
