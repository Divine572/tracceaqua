import React, { useState, useEffect } from 'react';
import { 
  Fish, 
  Factory, 
  Truck, 
  Store, 
  QrCode, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 

  Package, 
  ClipboardList, 
 
  Anchor,
  Waves
} from 'lucide-react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { RoleGuard } from '../auth/RoleGuard';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../constants/roles';

interface ProductJourney {
  id: string;
  productId: string;
  batchNumber: string;
  productName: string;
  productType: 'farmed' | 'wild_capture';
  currentStage: 'harvest' | 'processing' | 'distribution' | 'retail' | 'completed';
  stages: {
    harvest: StageData;
    processing?: StageData;
    distribution?: StageData;
    retail?: StageData;
  };
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

interface StageData {
  id: string;
  stage: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  data: Record<string, any>;
  completedBy?: string;
  completedAt?: string;
  documents: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

const SupplyChainModule: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'my-products' | 'trace-product'>('overview');
  const [products, setProducts] = useState<ProductJourney[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setProducts([
      {
        id: '1',
        productId: 'PRD-001',
        batchNumber: 'BATCH-2025-001',
        productName: 'Atlantic Salmon',
        productType: 'farmed',
        currentStage: 'processing',
        stages: {
          harvest: {
            id: 'h1',
            stage: 'harvest',
            status: 'completed',
            data: {
              farmName: 'Coastal Aquaculture Farm',
              harvestDate: '2025-01-20',
              quantity: 150,
              averageWeight: 2.5,
              feedType: 'Organic Marine Feed',
              waterTemperature: 18.5,
              oxygenLevels: 8.2
            },
            completedBy: 'John Adebayo',
            completedAt: '2025-01-20T10:30:00Z',
            documents: ['harvest-cert-001.pdf', 'quality-report-001.pdf'],
            location: {
              lat: 6.4391,
              lng: 3.3720,
              address: 'Lagos State Aquaculture Farm, Badore'
            }
          },
          processing: {
            id: 'p1',
            stage: 'processing',
            status: 'in_progress',
            data: {
              facilityName: 'Premium Seafood Processing Ltd',
              startDate: '2025-01-21',
              processingType: 'Filleting & Packaging',
              additives: 'None',
              storageTemperature: -18,
              expectedCompletion: '2025-01-22'
            },
            completedBy: 'Sarah Okoye',
            documents: ['processing-log-001.pdf'],
            location: {
              lat: 6.5244,
              lng: 3.3792,
              address: 'Ikeja Industrial Estate, Lagos'
            }
          }
        },
        qrCode: 'QR-PRD-001-2025',
        createdAt: '2025-01-20T10:30:00Z',
        updatedAt: '2025-01-21T14:15:00Z'
      },
      {
        id: '2',
        productId: 'PRD-002',
        batchNumber: 'BATCH-2025-002',
        productName: 'Wild Shrimp',
        productType: 'wild_capture',
        currentStage: 'retail',
        stages: {
          harvest: {
            id: 'h2',
            stage: 'harvest',
            status: 'completed',
            data: {
              vesselName: 'Ocean Hunter III',
              captureDate: '2025-01-18',
              captureLocation: 'Gulf of Guinea - Zone A',
              fishingMethod: 'Trawling',
              quantity: 200,
              species: 'Penaeus notialis',
              bycatch: 'Minimal (<5%)'
            },
            completedBy: 'Captain Musa Ibrahim',
            completedAt: '2025-01-18T06:45:00Z',
            documents: ['fishing-log-002.pdf', 'catch-certificate-002.pdf'],
            location: {
              lat: 5.1037,
              lng: 3.4083,
              address: 'Gulf of Guinea, 45km offshore'
            }
          },
          processing: {
            id: 'p2',
            stage: 'processing',
            status: 'completed',
            data: {
              facilityName: 'Fresh Catch Processing',
              processingDate: '2025-01-19',
              processingType: 'Cleaning & Freezing',
              storageTemperature: -20
            },
            completedBy: 'Ahmed Bello',
            completedAt: '2025-01-19T16:30:00Z',
            documents: ['processing-cert-002.pdf'],
            location: {
              lat: 6.4281,
              lng: 3.4219,
              address: 'Victoria Island Processing Center'
            }
          },
          distribution: {
            id: 'd2',
            stage: 'distribution',
            status: 'completed',
            data: {
              distributorName: 'Cold Chain Logistics',
              departureDate: '2025-01-20',
              arrivalDate: '2025-01-21',
              transportMethod: 'Refrigerated Truck',
              temperature: -18,
              route: 'Lagos → Abuja'
            },
            completedBy: 'Ibrahim Yakubu',
            completedAt: '2025-01-21T09:15:00Z',
            documents: ['transport-log-002.pdf'],
            location: {
              lat: 9.0579,
              lng: 7.4951,
              address: 'Abuja Distribution Center'
            }
          },
          retail: {
            id: 'r2',
            stage: 'retail',
            status: 'in_progress',
            data: {
              storeName: 'Fresh Market Superstore',
              receivedDate: '2025-01-21',
              storageCondition: 'Frozen Display (-15°C)',
              expiryDate: '2025-03-21',
              price: '₦2,500/kg'
            },
            completedBy: 'Grace Emenike',
            documents: ['receipt-002.pdf'],
            location: {
              lat: 9.0765,
              lng: 7.3986,
              address: 'Wuse 2, Abuja'
            }
          }
        },
        qrCode: 'QR-PRD-002-2025',
        createdAt: '2025-01-18T06:45:00Z',
        updatedAt: '2025-01-21T11:30:00Z'
      }
    ]);
  }, []);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'harvest': return user?.role.id === 'farmer' ? Fish : Anchor;
      case 'processing': return Factory;
      case 'distribution': return Truck;
      case 'retail': return Store;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-500 bg-gray-100';
      case 'in_progress': return 'text-blue-500 bg-blue-100';
      case 'completed': return 'text-green-500 bg-green-100';
      case 'verified': return 'text-purple-500 bg-purple-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getUserRoleSection = () => {
    const roleId = user?.role.id;
    switch (roleId) {
      case 'farmer': return 'farmer-section';
      case 'fisherman': return 'fisherman-section';
      case 'processor': return 'processor-section';
      case 'trader': return 'trader-section';
      case 'retailer': return 'retailer-section';
      default: return 'consumer-section';
    }
  };

  const canAccessStage = (stage: string) => {
    const permissions = {
      harvest: [PERMISSIONS.SUPPLY_CHAIN_FARMED_WRITE, PERMISSIONS.SUPPLY_CHAIN_WILD_CAPTURE_WRITE],
      processing: [PERMISSIONS.SUPPLY_CHAIN_PROCESSING_WRITE],
      distribution: [PERMISSIONS.SUPPLY_CHAIN_DISTRIBUTION_WRITE],
      retail: [PERMISSIONS.SUPPLY_CHAIN_RETAIL_WRITE]
    };
    
    return permissions[stage as keyof typeof permissions]?.some(permission => hasPermission(permission)) || false;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStage === 'all' || product.currentStage === filterStage;
    return matchesSearch && matchesFilter;
  });

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.SUPPLY_CHAIN_READ}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Package className="w-8 h-8 text-green-600" />
                    Supply Chain Traceability
                  </h1>
                  <p className="text-gray-600 mt-2">Track products from source to consumer</p>
                </div>
                <div className="flex items-center gap-3">
                  <RoleGuard allowedPermissions={[
                    PERMISSIONS.SUPPLY_CHAIN_FARMED_WRITE,
                    PERMISSIONS.SUPPLY_CHAIN_WILD_CAPTURE_WRITE,
                    PERMISSIONS.SUPPLY_CHAIN_PROCESSING_WRITE,
                    PERMISSIONS.SUPPLY_CHAIN_DISTRIBUTION_WRITE,
                    PERMISSIONS.SUPPLY_CHAIN_RETAIL_WRITE
                  ]}>
                    <button
                      onClick={() => setShowNewProductModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Start New Journey
                    </button>
                  </RoleGuard>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: ClipboardList },
                    { id: 'my-products', label: 'My Products', icon: Package },
                    { id: 'trace-product', label: 'Trace Product', icon: QrCode }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Role-specific sections */}
              
              {/* Farmer Section */}
              {hasPermission(PERMISSIONS.SUPPLY_CHAIN_FARMED_WRITE) && (
                <div className="farmer-section">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Fish className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Aquaculture Operations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Active Batches</h4>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-sm text-blue-700">Ready for harvest: 3</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Monthly Harvest</h4>
                        <p className="text-2xl font-bold text-green-600">2.4T</p>
                        <p className="text-sm text-green-700">+15% from last month</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-2">Quality Score</h4>
                        <p className="text-2xl font-bold text-purple-600">94%</p>
                        <p className="text-sm text-purple-700">Above industry average</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Record New Harvest
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fisherman Section */}
              {hasPermission(PERMISSIONS.SUPPLY_CHAIN_WILD_CAPTURE_WRITE) && (
                <div className="fisherman-section">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Anchor className="w-6 h-6 text-cyan-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Wild Capture Operations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-cyan-50 rounded-lg p-4">
                        <h4 className="font-medium text-cyan-900 mb-2">Recent Trips</h4>
                        <p className="text-2xl font-bold text-cyan-600">8</p>
                        <p className="text-sm text-cyan-700">This month</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Total Catch</h4>
                        <p className="text-2xl font-bold text-blue-600">1.8T</p>
                        <p className="text-sm text-blue-700">High-quality seafood</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Bycatch Rate</h4>
                        <p className="text-2xl font-bold text-green-600">3.2%</p>
                        <p className="text-sm text-green-700">Sustainable practices</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                        <Waves className="w-4 h-4" />
                        Log New Catch
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processor Section */}
              {hasPermission(PERMISSIONS.SUPPLY_CHAIN_PROCESSING_WRITE) && (
                <div className="processor-section">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Factory className="w-6 h-6 text-orange-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Processing Operations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-medium text-orange-900 mb-2">In Processing</h4>
                        <p className="text-2xl font-bold text-orange-600">5</p>
                        <p className="text-sm text-orange-700">Batches currently processing</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Completed</h4>
                        <p className="text-2xl font-bold text-green-600">23</p>
                        <p className="text-sm text-green-700">This week</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Quality Rate</h4>
                        <p className="text-2xl font-bold text-blue-600">98.5%</p>
                        <p className="text-sm text-blue-700">Grade A products</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        <Factory className="w-4 h-4" />
                        Start Processing
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Trader/Distributor Section */}
              {hasPermission(PERMISSIONS.SUPPLY_CHAIN_DISTRIBUTION_WRITE) && (
                <div className="trader-section">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="w-6 h-6 text-yellow-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Distribution & Logistics</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Active Routes</h4>
                        <p className="text-2xl font-bold text-yellow-600">7</p>
                        <p className="text-sm text-yellow-700">In transit</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">On-time Delivery</h4>
                        <p className="text-2xl font-bold text-green-600">96%</p>
                        <p className="text-sm text-green-700">Performance this month</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Cold Chain</h4>
                        <p className="text-2xl font-bold text-blue-600">100%</p>
                        <p className="text-sm text-blue-700">Temperature compliance</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        <Truck className="w-4 h-4" />
                        Schedule Shipment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Retailer Section */}
              {hasPermission(PERMISSIONS.SUPPLY_CHAIN_RETAIL_WRITE) && (
                <div className="retailer-section">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Store className="w-6 h-6 text-pink-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Retail Operations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-pink-50 rounded-lg p-4">
                        <h4 className="font-medium text-pink-900 mb-2">Inventory</h4>
                        <p className="text-2xl font-bold text-pink-600">45</p>
                        <p className="text-sm text-pink-700">Product lines in stock</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Daily Sales</h4>
                        <p className="text-2xl font-bold text-green-600">₦120K</p>
                        <p className="text-sm text-green-700">+8% from yesterday</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Customer Rating</h4>
                        <p className="text-2xl font-bold text-blue-600">4.8/5</p>
                        <p className="text-sm text-blue-700">Product freshness</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        <Store className="w-4 h-4" />
                        Update Inventory
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-products' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by product name or batch number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterStage}
                      onChange={(e) => setFilterStage(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Stages</option>
                      <option value="harvest">Harvest</option>
                      <option value="processing">Processing</option>
                      <option value="distribution">Distribution</option>
                      <option value="retail">Retail</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.productName}</h3>
                          <p className="text-sm text-gray-500">{product.batchNumber}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.productType === 'farmed' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-cyan-100 text-cyan-700'
                        }`}>
                          {product.productType === 'farmed' ? 'Farmed' : 'Wild Capture'}
                        </span>
                      </div>

                      {/* Current Stage */}
                      <div className="flex items-center gap-2 mb-4">
                        {React.createElement(getStageIcon(product.currentStage), { 
                          className: "w-5 h-5 text-gray-600" 
                        })}
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {product.currentStage.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Progress</span>
                          <span>
                            {Object.values(product.stages).filter(stage => stage.status === 'completed').length} / 
                            {Object.keys(product.stages).length} stages
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(Object.values(product.stages).filter(stage => stage.status === 'completed').length / Object.keys(product.stages).length) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="flex items-center gap-2 mb-4">
                        <QrCode className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{product.qrCode}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Updated {new Date(product.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {canAccessStage(product.currentStage) && (
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Start by creating your first product journey.'}
                  </p>
                  <RoleGuard allowedPermissions={[
                    PERMISSIONS.SUPPLY_CHAIN_FARMED_WRITE,
                    PERMISSIONS.SUPPLY_CHAIN_WILD_CAPTURE_WRITE
                  ]}>
                    <button
                      onClick={() => setShowNewProductModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Start First Journey
                    </button>
                  </RoleGuard>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trace-product' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Trace Product Journey</h3>
                <p className="text-gray-600 mb-6">Scan QR code or enter product ID to view complete traceability information</p>
                
                <div className="max-w-md mx-auto space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Product ID or Batch Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="flex gap-3">
                    <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Trace Product
                    </button>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Scan QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Product Modal */}
        {showNewProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Start New Product Journey</h2>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">New product journey form will be implemented here</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowNewProductModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Create Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default SupplyChainModule;