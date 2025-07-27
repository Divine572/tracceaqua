import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from 'wagmi'

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || 'YOUR_PROJECT_ID'

if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  networks: [sepolia],
  projectId
})

export const config = wagmiAdapter.wagmiConfig

// Set up metadata
const metadata = {
  name: 'TracceAqua',
  description: 'Blockchain Seafood Traceability System',
  url: 'https://tracceaqua.vercel.app',
  icons: ['https://tracceaqua.vercel.app/logo.png']
}

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia],
  defaultNetwork: sepolia,
  metadata: metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'apple', 'discord', 'farcaster'],
    emailShowWallets: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#00BB7F',
    '--w3m-color-mix-strength': 40,
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-border-radius-master': '8px'
  }
})