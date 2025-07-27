export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrls: [
    'https://rpc.sepolia.org',
    'https://ethereum-sepolia-rpc.publicnode.com', 
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://rpc-sepolia.rockx.com'
  ]
}

// Contract addresses (will be populated after deployment)
export const CONTRACTS = {
  TRACCE_AQUA_MAIN: '', // Main traceability contract
  CONSERVATION_DATA: '', // Conservation module contract
  SUPPLY_CHAIN: '', // Supply chain contract
}

// Common ABIs (will be added after contract development)
export const CONTRACT_ABIS = {
  // Contract ABIs will be imported here
}