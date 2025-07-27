import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MapPin, 
  Calendar, 
  Thermometer, 
  Droplets,
  Microscope,
  Camera,
  FileText,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { RoleGuard } from '../auth/RoleGuard';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../constants/roles';
import { showToast } from '../../utils/toast';

interface SamplingRecord {
  id: string;
  siteId: string;
  siteName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  samplingDate: string;
  waterParams: {
    temperature: number;
    pH: number;
    salinity: number;
    dissolvedOxygen: number;
  };
  speciesData: {
    primarySpecies: string;
    count: number;
    averageSize: number;
  };
  images: string[];
  notes: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'published';
  createdBy: string;
  createdAt: string;
}

interface LabResult {
  id: string;
  sampleId: string;
  testType: 'physicochemical' | 'heavy_metal' | 'microplastic' | 'proximate' | 'morphometric';
  results: Record<string, number | string>;
  status: 'pending' | 'completed' | 'verified';
  performedBy: string;
  completedAt?: string;
}

const ConservationModule: React.FC = () => {
  useAuth();
  const [activeTab, setActiveTab] = useState<'sampling' | 'lab-results' | 'analytics'>('sampling');
  const [samplingRecords, setSamplingRecords] = useState<SamplingRecord[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setSamplingRecords([
      {
        id: '1',
        siteId: 'SITE-001',
        siteName: 'Lagos Lagoon - Apapa',
        coordinates: { lat: 6.4391, lng: 3.3720 },
        samplingDate: '2025-01-20',
        waterParams: {
          temperature: 28.5,
          pH: 7.2,
          salinity: 15.8,
          dissolvedOxygen: 6.4
        },
        speciesData: {
          primarySpecies: 'Crassostrea gasar',
          count: 45,
          averageSize: 8.2
        },
        images: ['/api/images/sample-1-1.jpg', '/api/images/sample-1-2.jpg'],
        notes: 'Good water quality, healthy oyster population observed',
        status: 'submitted',
        createdBy: 'Dr. Adebayo Olumide',
        createdAt: '2025-01-20T10:30:00Z'
      },
      {
        id: '2',
        siteId: 'SITE-002',
        siteName: 'Epe Lagoon - Fish Farm',
        coordinates: { lat: 6.5833, lng: 3.9833 },
        samplingDate: '2025-01-18',
        waterParams: {
          temperature: 29.1,
          pH: 6.8,
          salinity: 12.3,
          dissolvedOxygen: 5.9
        },
        speciesData: {
          primarySpecies: 'Penaeus notialis',
          count: 78,
          averageSize: 12.5
        },
        images: ['/api/images/sample-2-1.jpg'],
        notes: 'Slightly acidic conditions, monitoring required',
        status: 'reviewed',
        createdBy: 'Prof. Fatima Ibrahim',
        createdAt: '2025-01-18T14:15:00Z'
      }
    ]);

    setLabResults([
      {
        id: '1',
        sampleId: '1',
        testType: 'heavy_metal',
        results: {
          mercury: 0.08,
          lead: 0.15,
          cadmium: 0.02,
          arsenic: 0.05
        },
        status: 'completed',
        performedBy: 'Lab Tech - Kemi Adeyemi',
        completedAt: '2025-01-21T16:45:00Z'
      },
      {
        id: '2',
        sampleId: '2',
        testType: 'microplastic',
        results: {
          particlesPerGram: 12,
          averageSize: 0.85,
          dominantType: 'Polyethylene'
        },
        status: 'pending',
        performedBy: 'Lab Tech - Samuel Okon',
      }
    ]);
  }, []);

  const handleCreateRecord = () => {
    setShowNewRecordModal(true);
  };

  const handleExportData = () => {
    showToast.success('Data export initiated. Download will start shortly.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'verified': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredRecords = samplingRecords.filter(record => {
    const matchesSearch = record.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.speciesData.primarySpecies.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.CONSERVATION_READ}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Microscope className="w-8 h-8 text-blue-600" />
                    Conservation Module
                  </h1>
                  <p className="text-gray-600 mt-2">Wild-capture monitoring and environmental research</p>
                </div>
                <div className="flex items-center gap-3">
                  <RoleGuard allowedPermissions={[PERMISSIONS.DATA_EXPORT]}>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                  </RoleGuard>
                  
                  <RoleGuard allowedRoles={['researcher', 'admin']}>
                    <button
                      onClick={handleCreateRecord}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Research Data
                    </button>
                  </RoleGuard>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'sampling', label: 'Sampling Records', icon: MapPin },
                    { id: 'lab-results', label: 'Lab Results', icon: FileText },
                    { id: 'analytics', label: 'Analytics', icon: Eye }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'sampling' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by site name or species..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sampling Records Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecords.map(record => (
                  <div key={record.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{record.siteName}</h3>
                          <p className="text-sm text-gray-500">{record.siteId}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>

                      {/* Coordinates */}
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {record.coordinates.lat.toFixed(4)}, {record.coordinates.lng.toFixed(4)}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(record.samplingDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Water Parameters */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-400" />
                          <span className="text-sm">{record.waterParams.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">pH {record.waterParams.pH}</span>
                        </div>
                      </div>

                      {/* Species Data */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Primary Species</h4>
                        <p className="text-sm text-gray-600 italic mb-1">{record.speciesData.primarySpecies}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Count: {record.speciesData.count}</span>
                          <span>Avg Size: {record.speciesData.averageSize}cm</span>
                        </div>
                      </div>

                      {/* Images */}
                      {record.images.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <Camera className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{record.images.length} images</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">By {record.createdBy}</span>
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <RoleGuard allowedPermissions={[PERMISSIONS.CONSERVATION_WRITE]}>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </RoleGuard>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <Microscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sampling records found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Start by creating your first sampling record.'}
                  </p>
                  <RoleGuard allowedRoles={['researcher', 'admin']}>
                    <button
                      onClick={handleCreateRecord}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Record
                    </button>
                  </RoleGuard>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lab-results' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Laboratory Test Results</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sample ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performed By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {labResults.map(result => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.sampleId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {result.testType.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {result.performedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800">View</button>
                              <RoleGuard allowedPermissions={[PERMISSIONS.CONSERVATION_WRITE]}>
                                <button className="text-green-600 hover:text-green-800">Edit</button>
                              </RoleGuard>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <RoleGuard allowedPermissions={[PERMISSIONS.ANALYTICS_READ]}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Analytics Cards */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">42</h3>
                        <p className="text-sm text-gray-600">Active Sites</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">156</h3>
                        <p className="text-sm text-gray-600">Completed Tests</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">8</h3>
                        <p className="text-sm text-gray-600">Quality Alerts</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Microscope className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">23</h3>
                        <p className="text-sm text-gray-600">Species Monitored</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder for charts */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Quality Trends</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Analytics charts will be implemented here</p>
                  </div>
                </div>
              </div>
            </RoleGuard>
          )}
        </div>

        {/* New Record Modal */}
        {showNewRecordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Sampling Record</h2>
                <RoleGuard allowedPermissions={[PERMISSIONS.CONSERVATION_WRITE]}>
                  <div className="space-y-4">
                    {/* Form fields would go here */}
                    <div className="text-center py-8">
                      <Microscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">New sampling record form will be implemented here</p>
                    </div>
                  </div>
                </RoleGuard>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowNewRecordModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Record
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

export default ConservationModule;