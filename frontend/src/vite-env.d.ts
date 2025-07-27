/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_SEPOLIA_RPC_URL: string
  readonly VITE_PINATA_JWT: string
  readonly VITE_PINATA_GATEWAY_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}