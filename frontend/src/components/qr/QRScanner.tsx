import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  Search, 
  History, 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Share2,
  X
} from 'lucide-react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../constants/roles';
import { showToast } from '../../utils/toast';

interface TraceResult {
  productId: string;
  batchNumber: string;
  productName: string;
  productType: 'farmed' | 'wild_capture';
  currentStage: string;
  journey: JourneyStage[];
  qrCode: string;
  totalStages: number;
  completedStages: number;
  lastUpdated: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

interface JourneyStage {
  id: string;
  stage: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: string;
  completedBy?: string;
  location?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  data: Record<string, any>;
  documents: string[];
  verified: boolean;
}

const QRScanner: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock scan history
  useEffect(() => {
    setScanHistory([
      'QR-PRD-001-2025',
      'QR-PRD-002-2025',
      'QR-PRD-003-2025'
    ]);
  }, []);

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      showToast.success('Camera started. Point at QR code to scan.');
    } catch (error) {
      console.error('Error starting camera:', error);
      showToast.error('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSearch = async () => {
    if (!manualCode.trim()) {
      showToast.error('Please enter a product ID or QR code');
      return;
    }

    await performTrace(manualCode.trim());
  };

  const performTrace = async (code: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock trace result based on code
      if (code.includes('PRD-001') || code === 'QR-PRD-001-2025') {
        setTraceResult({
          productId: 'PRD-001',
          batchNumber: 'BATCH-2025-001',
          productName: 'Atlantic Salmon',
          productType: 'farmed',
          currentStage: 'processing',
          qrCode: 'QR-PRD-001-2025',
          totalStages: 4,
          completedStages: 2,
          lastUpdated: '2025-01-21T14:15:00Z',
          verificationStatus: 'verified',
          journey: [
            {
              id: '1',
              stage: 'harvest',
              title: 'Aquaculture Harvest',
              status: 'completed',
              completedAt: '2025-01-20T10:30:00Z',
              completedBy: 'John Adebayo',
              location: {
                address: 'Lagos State Aquaculture Farm, Badore',
                coordinates: { lat: 6.4391, lng: 3.3720 }
              },
              data: {
                farmName: 'Coastal Aquaculture Farm',
                harvestDate: '2025-01-20',
                quantity: '150 kg',
                averageWeight: '2.5 kg',
                waterTemperature: '18.5°C',
                feedType: 'Organic Marine Feed'
              },
              documents: ['harvest-cert-001.pdf', 'quality-report-001.pdf'],
              verified: true
            },
            {
              id: '2',
              stage: 'processing',
              title: 'Processing & Packaging',
              status: 'in_progress',
              location: {
                address: 'Ikeja Industrial Estate, Lagos',
                coordinates: { lat: 6.5244, lng: 3.3792 }
              },
              data: {
                facilityName: 'Premium Seafood Processing Ltd',
                startDate: '2025-01-21',
                processingType: 'Filleting & Packaging',
                storageTemperature: '-18°C',
                expectedCompletion: '2025-01-22'
              },
              documents: ['processing-log-001.pdf'],
              verified: false
            },
            {
              id: '3',
              stage: 'distribution',
              title: 'Cold Chain Distribution',
              status: 'pending',
              data: {},
              documents: [],
              verified: false
            },
            {
              id: '4',
              stage: 'retail',
              title: 'Retail Display',
              status: 'pending',
              data: {},
              documents: [],
              verified: false
            }
          ]
        });
        
        // Add to scan history
        setScanHistory(prev => [code, ...prev.filter(item => item !== code)].slice(0, 10));
        setShowResult(true);
        showToast.success('Product traced successfully!');
      } else {
        showToast.error('Product not found. Please check the QR code or product ID.');
      }
    } catch (error) {
      console.error('Trace error:', error);
      showToast.error('Failed to trace product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'harvest': return '🐟';
      case 'processing': return '🏭';
      case 'distribution': return '🚚';
      case 'retail': return '🏪';
      default: return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleShare = () => {
    if (traceResult) {
      const shareData = {
        title: `${traceResult.productName} - TracceAqua`,
        text: `View the complete traceability information for ${traceResult.productName} (${traceResult.batchNumber})`,
        url: `${window.location.origin}/trace/${traceResult.qrCode}`
      };

      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url || '');
        showToast.success('Link copied to clipboard!');
      }
    }
  };

  const handleDownloadReport = () => {
    showToast.success('Traceability report download started');
  };

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.QR_SCAN}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-cyan-600" />
                    QR Scanner & Tracer
                  </h1>
                  <p className="text-gray-600 mt-2">Scan products for complete traceability information</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showResult ? (
            <div className="space-y-8">
              {/* Scanning Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scan QR Code</h2>
                  <p className="text-gray-600 mb-8">Point your camera at the QR code on the product package</p>

                  {/* Camera View */}
                  <div className="max-w-md mx-auto mb-6">
                    {isScanning ? (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 bg-black rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 border-4 border-cyan-500 rounded-lg pointer-events-none">
                          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-cyan-500"></div>
                          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-cyan-500"></div>
                          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-cyan-500"></div>
                          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-cyan-500"></div>
                        </div>
                        <div className="absolute inset-x-0 top-1/2 h-px bg-red-500 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Camera not active</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  <div className="flex justify-center gap-4 mb-8">
                    {!isScanning ? (
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        Start Camera
                      </button>
                    ) : (
                      <button
                        onClick={stopCamera}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        Stop Camera
                      </button>
                    )}
                  </div>

                  <div className="text-gray-500 text-sm">
                    Make sure the QR code is clearly visible within the scanning area
                  </div>
                </div>
              </div>

              {/* Manual Input Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Manual Product Lookup
                </h3>
                <p className="text-gray-600 mb-4">Enter product ID or QR code manually if scanning is not available</p>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Product ID or QR Code (e.g., QR-PRD-001-2025)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleManualSearch}
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Tracing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Trace Product
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scan History */}
              {scanHistory.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Scans
                  </h3>
                  <div className="space-y-2">
                    {scanHistory.slice(0, 5).map((code, index) => (
                      <button
                        key={index}
                        onClick={() => performTrace(code)}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-gray-700">{code}</span>
                        <Search className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Trace Results */
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{traceResult?.productName}</h2>
                      {traceResult?.verificationStatus === 'verified' && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">Batch: {traceResult?.batchNumber}</p>
                    <p className="text-sm text-gray-500 mb-4">QR Code: {traceResult?.qrCode}</p>
                    
                    {/* Product Type Badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      traceResult?.productType === 'farmed' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {traceResult?.productType === 'farmed' ? '🐟 Farmed' : '⚓ Wild Capture'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownloadReport}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowResult(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="New Search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Journey Progress</span>
                    <span>{traceResult?.completedStages} of {traceResult?.totalStages} stages completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${((traceResult?.completedStages || 0) / (traceResult?.totalStages || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Journey</h3>
                
                <div className="space-y-6">
                  {traceResult?.journey.map((stage, index) => (
                    <div key={stage.id} className="relative">
                      {/* Timeline Line */}
                      {index < (traceResult?.journey.length || 0) - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        {/* Stage Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          stage.status === 'completed' 
                            ? 'bg-green-100' 
                            : stage.status === 'in_progress'
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}>
                          {getStageIcon(stage.stage)}
                        </div>

                        {/* Stage Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{stage.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(stage.status)}`}>
                              {stage.status.replace('_', ' ')}
                            </span>
                            {stage.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>

                          {/* Stage Details */}
                          {Object.keys(stage.data).length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(stage.data).map(([key, value]) => (
                                  <div key={key} className="text-sm">
                                    <span className="font-medium text-gray-600 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                    </span>
                                    <span className="ml-2 text-gray-900">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Location */}
                          {stage.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{stage.location.address}</span>
                            </div>
                          )}

                          {/* Completion Info */}
                          {stage.completedAt && (
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(stage.completedAt).toLocaleString()}</span>
                              </div>
                              {stage.completedBy && (
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{stage.completedBy}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Documents */}
                          {stage.documents.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="w-4 h-4" />
                              <span>{stage.documents.length} document(s) attached</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Traceability</h3>
                <p className="text-gray-600 mb-4">
                  This product has been verified through our blockchain-based traceability system
                </p>
                <button
                  onClick={() => setShowResult(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Scan Another Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default QRScanner;