// ===== src/App.tsx =====
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';
import { PERMISSIONS } from './constants/roles';

// Import components
import Navigation from './components/navigation/Navigation';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import ConservationModule from './components/conservation/ConservationModule';
import SupplyChainModule from './components/supply-chain/SupplyChainModule';
import QRScanner from './components/qr/QRScanner';
import AdminDashboard from './components/admin/AdminDashboard';

// Dashboard Component
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mb-4">
              You're logged in as a <span className={`font-semibold ${user?.role.color}`}>
                {user?.role.name}
              </span>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                Your role gives you access to: {user?.role.permissions.includes('*') ? 'All system features' : user?.role.permissions.join(', ')}
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            {/* Conservation Module */}
            <RoleGuard allowedPermissions={[PERMISSIONS.CONSERVATION_READ]}>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔬</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Conservation</h3>
                    <p className="text-sm text-gray-600">Research & monitoring</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Manage sampling records, lab results, and environmental data for wild-capture monitoring.
                </p>
                <a
                  href="/conservation"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Access Conservation Module →
                </a>
              </div>
            </RoleGuard>

            {/* Supply Chain Module */}
            <RoleGuard allowedPermissions={[PERMISSIONS.SUPPLY_CHAIN_READ]}>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Supply Chain</h3>
                    <p className="text-sm text-gray-600">Product traceability</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Track products from source to consumer with blockchain-verified traceability.
                </p>
                <a
                  href="/supply-chain"
                  className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Manage Supply Chain →
                </a>
              </div>
            </RoleGuard>

            {/* QR Scanner */}
            <RoleGuard allowedPermissions={[PERMISSIONS.QR_SCAN]}>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">QR Scanner</h3>
                    <p className="text-sm text-gray-600">Product verification</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Scan QR codes to view complete product journey and traceability information.
                </p>
                <a
                  href="/scanner"
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                >
                  Open Scanner →
                </a>
              </div>
            </RoleGuard>

            {/* Analytics */}
            <RoleGuard allowedPermissions={[PERMISSIONS.ANALYTICS_READ]}>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600">Data insights</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  View system analytics, reports, and data visualization dashboards.
                </p>
                <a
                  href="/analytics"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  View Analytics →
                </a>
              </div>
            </RoleGuard>

            {/* Admin Panel */}
            <RoleGuard allowedRoles={['admin']}>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👑</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
                    <p className="text-sm text-gray-600">System management</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Manage users, assign roles, view system logs, and configure settings.
                </p>
                <a
                  href="/admin"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Access Admin Panel →
                </a>
              </div>
            </RoleGuard>

            {/* Help & Support */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">❓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
                  <p className="text-sm text-gray-600">Documentation & guides</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Access user guides, tutorials, and get support for using TracceAqua.
              </p>
              <a
                href="/help"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Get Help →
              </a>
            </div>
          </div>

          {/* Role-specific Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Activity</h2>

            {/* Stats based on user role */}
            {user?.role.id === 'farmer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Active Batches</h3>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900">This Month's Harvest</h3>
                  <p className="text-2xl font-bold text-green-600">2.4T</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900">Quality Score</h3>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                </div>
              </div>
            )}

            {user?.role.id === 'researcher' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Sampling Sites</h3>
                  <p className="text-2xl font-bold text-blue-600">15</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900">Completed Tests</h3>
                  <p className="text-2xl font-bold text-green-600">47</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900">Published Reports</h3>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
              </div>
            )}

            {user?.role.id === 'consumer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cyan-50 rounded-lg p-4">
                  <h3 className="font-medium text-cyan-900">Products Scanned</h3>
                  <p className="text-2xl font-bold text-cyan-600">23</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900">Verified Products</h3>
                  <p className="text-2xl font-bold text-green-600">21</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Trace Requests</h3>
                  <p className="text-2xl font-bold text-blue-600">18</p>
                </div>
              </div>
            )}

            {user?.role.id === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900">Total Users</h3>
                  <p className="text-2xl font-bold text-purple-600">156</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Active Products</h3>
                  <p className="text-2xl font-bold text-blue-600">324</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900">System Uptime</h3>
                  <p className="text-2xl font-bold text-green-600">99.8%</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-medium text-orange-900">QR Scans Today</h3>
                  <p className="text-2xl font-bold text-orange-600">47</p>
                </div>
              </div>
            )}

            {/* Default stats for other roles */}
            {!['farmer', 'researcher', 'consumer', 'admin'].includes(user?.role.id || '') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">Recent Activity</h3>
                  <p className="text-2xl font-bold text-gray-600">5</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Products Handled</h3>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900">Completed Tasks</h3>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Analytics Page Component
const AnalyticsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.ANALYTICS_READ}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <span className="text-6xl mb-4 block">📊</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Comprehensive analytics and reporting dashboard will be implemented here
            </p>
            <div className="text-sm text-gray-500">
              Features: System metrics, user activity, product analytics, compliance reports
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Reports Page Component  
const ReportsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.DATA_EXPORT}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <span className="text-6xl mb-4 block">📄</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Export</h2>
            <p className="text-gray-600 mb-4">
              Generate and export various reports from the TracceAqua system
            </p>
            <div className="text-sm text-gray-500">
              Features: Custom reports, data export, scheduled reports, compliance documents
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Help Page Component
const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <span className="text-6xl mb-4 block">❓</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h2>
          <p className="text-gray-600 mb-4">
            User documentation, tutorials, and support resources
          </p>
          <div className="text-sm text-gray-500">
            Features: User guides, video tutorials, FAQ, contact support
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation - only show if user is authenticated */}
        {user && <Navigation />}

        {/* Main Content */}
        <main className={user ? 'lg:ml-64' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conservation" element={<ConservationModule />} />
            <Route path="/supply-chain/*" element={<SupplyChainModule />} />
            <Route path="/scanner" element={<QRScanner />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Redirect Logic */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Page not found</p>
                    <a
                      href="/"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;