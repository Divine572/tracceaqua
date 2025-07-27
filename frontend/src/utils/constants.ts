export const APP_CONSTANTS = {
  APP_NAME: 'TracceAqua',
  VERSION: '1.0.0',
  API_VERSION: 'v1',
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // QR Code settings
  QR_CODE_SIZE: 256,
  QR_CODE_ERROR_CORRECTION: 'M' as const,
  
  // Blockchain settings
  SEPOLIA_CHAIN_ID: 11155111,
  SEPOLIA_RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com',
  
  // Cache durations (in milliseconds)
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 30 * 60 * 1000,    // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Status options
  PRODUCT_STAGES: ['harvest', 'processing', 'distribution', 'retail', 'completed'] as const,
  STAGE_STATUSES: ['pending', 'in_progress', 'completed', 'verified'] as const,
  USER_STATUSES: ['active', 'inactive', 'suspended'] as const,
  
  // Nigerian states (for location selection)
  NIGERIAN_STATES: [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
    'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    'FCT' // Federal Capital Territory
  ],
  
  // Common seafood species
  SEAFOOD_SPECIES: [
    'Crassostrea gasar', // Mangrove Oyster
    'Penaeus notialis',  // Southern Pink Shrimp
    'Chrysichthys nigrodigitatus', // Bagrid Catfish
    'Sarotherodon melanotheron', // Blackchin Tilapia
    'Mugil cephalus',    // Flathead Grey Mullet
    'Pseudotolithus elongatus', // Bobo Croaker
    'Callinectes amnicola', // Blue Crab
    'Macrobrachium macrobrachion', // Giant River Prawn
  ],
  
  // Error messages
  ERRORS: {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION: 'Please check your input and try again.',
    SERVER: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found.',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  }
};
