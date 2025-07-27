import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'

// Get environment variables with proper typing
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
// const rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set')
}


// 2. Set up metadata
const metadata = {
  name: 'TracceAqua',
  description: 'Blockchain Seafood Traceability & Transparency System',
  url: 'https://tracceaqua.vercel.app',
  icons: ['https://tracceaqua.vercel.app/icon.svg']
}

// 3. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia],
  projectId,
  ssr: true
})

// 4. Create AppKit with social login
createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google']
  }
})

export const config = wagmiAdapter.wagmiConfig

// Query client for React Query
export const queryClient = new QueryClient()