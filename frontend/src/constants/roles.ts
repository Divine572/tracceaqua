import type { UserRole } from '../types/auth'


export const USER_ROLES: Record<string, UserRole> = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    level: 3,
    permissions: ['*'],
    icon: '👑',
    color: 'text-purple-600',
    description: 'Full system access and user management'
  },
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    level: 2,
    permissions: ['conservation.read', 'conservation.write', 'analytics.read', 'data.export'],
    icon: '🔬',
    color: 'text-blue-600',
    description: 'Conservation data collection and analysis'
  },
  farmer: {
    id: 'farmer',
    name: 'Farmer',
    level: 2,
    permissions: ['supply_chain.farmed.write', 'supply_chain.read', 'products.create'],
    icon: '🐟',
    color: 'text-green-600',
    description: 'Aquaculture operations and farming data'
  },
  fisherman: {
    id: 'fisherman',
    name: 'Fisherman',
    level: 2,
    permissions: ['supply_chain.wild_capture.write', 'supply_chain.read', 'products.create'],
    icon: '🎣',
    color: 'text-cyan-600',
    description: 'Wild capture operations and fishing data'
  },
  processor: {
    id: 'processor',
    name: 'Processor',
    level: 2,
    permissions: ['supply_chain.processing.write', 'supply_chain.read', 'quality.manage'],
    icon: '🏭',
    color: 'text-orange-600',
    description: 'Processing operations and quality control'
  },
  trader: {
    id: 'trader',
    name: 'Trader/Distributor',
    level: 2,
    permissions: ['supply_chain.distribution.write', 'supply_chain.read', 'logistics.manage'],
    icon: '🚚',
    color: 'text-yellow-600',
    description: 'Distribution and logistics management'
  },
  retailer: {
    id: 'retailer',
    name: 'Retailer',
    level: 2,
    permissions: ['supply_chain.retail.write', 'supply_chain.read', 'sales.manage'],
    icon: '🏪',
    color: 'text-pink-600',
    description: 'Retail operations and sales management'
  },
  consumer: {
    id: 'consumer',
    name: 'Consumer',
    level: 1,
    permissions: ['traceability.read', 'qr.scan'],
    icon: '👥',
    color: 'text-gray-600',
    description: 'Product traceability and transparency access'
  }
}

export const PERMISSIONS = {
  // Admin permissions
  ADMIN_ALL: '*',
  ADMIN_USERS: 'admin.users.write',
  ADMIN_SYSTEM: 'admin.system.write',
  
  // Conservation permissions
  CONSERVATION_READ: 'conservation.read',
  CONSERVATION_WRITE: 'conservation.write',
  
  // Supply chain permissions
  SUPPLY_CHAIN_READ: 'supply_chain.read',
  SUPPLY_CHAIN_FARMED_WRITE: 'supply_chain.farmed.write',
  SUPPLY_CHAIN_WILD_CAPTURE_WRITE: 'supply_chain.wild_capture.write',
  SUPPLY_CHAIN_PROCESSING_WRITE: 'supply_chain.processing.write',
  SUPPLY_CHAIN_DISTRIBUTION_WRITE: 'supply_chain.distribution.write',
  SUPPLY_CHAIN_RETAIL_WRITE: 'supply_chain.retail.write',
  
  // Other permissions
  ANALYTICS_READ: 'analytics.read',
  TRACEABILITY_READ: 'traceability.read',
  QR_SCAN: 'qr.scan',
  PRODUCTS_CREATE: 'products.create',
  QUALITY_MANAGE: 'quality.manage',
  LOGISTICS_MANAGE: 'logistics.manage',
  SALES_MANAGE: 'sales.manage',
  DATA_EXPORT: 'data.export'
} as const

