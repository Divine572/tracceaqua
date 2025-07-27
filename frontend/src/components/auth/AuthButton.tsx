import { Wallet, LogOut, User, Crown, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'

export function AuthButton() {
  const { user, isLoading, isConnected, connectWallet, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return (
      <button 
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </button>
    )
  }

  if (!isConnected || !user) {
    return (
      <button
        onClick={connectWallet}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <span className="text-lg">{user.role.icon}</span>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900">
              {user.name || `${user.walletAddress?.slice(0, 6)}...${user.walletAddress?.slice(-4)}`}
            </span>
            {user.role.id === 'admin' && <Crown className="w-3 h-3 text-purple-500" />}
          </div>
          <span className={`text-xs ${user.role.color}`}>
            {user.role.name}
          </span>
        </div>
      </div>
      
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSigningOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        Sign Out
      </button>
    </div>
  )
}
