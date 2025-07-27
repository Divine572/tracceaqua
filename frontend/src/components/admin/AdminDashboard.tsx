// ===== src/components/admin/AdminDashboard.tsx =====
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Crown, 
  Activity, 
  Shield, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Ban, 
  UserCheck, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Lock
} from 'lucide-react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/roles';
import { apiClient } from '../../services/api';
import { showToast } from '../../utils/toast';

interface AdminUser {
  id: string;
  walletAddress?: string;
  email?: string;
  name?: string;
  roleId: string;
  role: {
    id: string;
    name: string;
    level: number;
    permissions: string[];
  };
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata: Record<string, any>;
  createdAt: string;
  user?: {
    name?: string;
    walletAddress?: string;
    roleId: string;
  };
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalScans: number;
  systemUptime: string;
  storageUsed: string;
}

const AdminDashboard: React.FC = () => {
  const { updateUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity' | 'settings'>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch data
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'activity') {
      fetchActivityLogs();
    } else if (activeTab === 'overview') {
      fetchSystemStats();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast.error('Failed to fetch users');
      
      // Mock data for demo
      setUsers([
        {
          id: '1',
          walletAddress: '0x742d35Cc6634C0532925a3b8D2C9F5A2c9234567',
          name: 'John Adebayo',
          email: 'john@example.com',
          roleId: 'farmer',
          role: USER_ROLES.farmer,
          isVerified: true,
          isActive: true,
          lastLoginAt: '2025-01-21T10:30:00Z',
          createdAt: '2025-01-15T08:20:00Z'
        },
        {
          id: '2',
          walletAddress: '0x8e5C8B2F9F7d3A4b1c6D8E9F0A1B2C3D4E5F6789',
          name: 'Sarah Okoye',
          email: 'sarah@processing.com',
          roleId: 'processor',
          role: USER_ROLES.processor,
          isVerified: true,
          isActive: true,
          lastLoginAt: '2025-01-21T14:15:00Z',
          createdAt: '2025-01-18T12:45:00Z'
        },
        {
          id: '3',
          walletAddress: '0x1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12',
          roleId: 'consumer',
          role: USER_ROLES.consumer,
          isVerified: false,
          isActive: true,
          lastLoginAt: '2025-01-20T16:22:00Z',
          createdAt: '2025-01-20T16:20:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/activity');
      if (response.data.success) {
        setActivityLogs(response.data.data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      
      // Mock data for demo
      setActivityLogs([
        {
          id: '1',
          userId: '1',
          action: 'login',
          resource: 'auth',
          metadata: { method: 'wallet' },
          createdAt: '2025-01-21T10:30:00Z',
          user: {
            name: 'John Adebayo',
            walletAddress: '0x742d35Cc6634C0532925a3b8D2C9F5A2c9234567',
            roleId: 'farmer'
          }
        },
        {
          id: '2',
          userId: '2',
          action: 'product_create',
          resource: 'supply_chain',
          resourceId: 'PRD-001',
          metadata: { productType: 'farmed', quantity: 150 },
          createdAt: '2025-01-21T09:15:00Z',
          user: {
            name: 'Sarah Okoye',
            walletAddress: '0x8e5C8B2F9F7d3A4b1c6D8E9F0A1B2C3D4E5F6789',
            roleId: 'processor'
          }
        },
        {
          id: '3',
          userId: '3',
          action: 'qr_scan',
          resource: 'traceability',
          resourceId: 'QR-PRD-001-2025',
          metadata: { success: true },
          createdAt: '2025-01-21T08:45:00Z',
          user: {
            walletAddress: '0x1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12',
            roleId: 'consumer'
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    setIsLoading(true);
    try {
      // Mock system stats
      setSystemStats({
        totalUsers: 156,
        activeUsers: 89,
        totalProducts: 324,
        totalScans: 1247,
        systemUptime: '99.8%',
        storageUsed: '2.4 GB'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRoleId: string) => {
    try {
      const success = await updateUserRole(userId, newRoleId);
      if (success) {
        fetchUsers(); // Refresh users list
        showToast.success('User role updated successfully');
      }
    } catch (error) {
      console.error('Role update failed:', error);
      showToast.error('Failed to update user role');
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await apiClient.put(`/users/${userId}/status`, {
        isActive: !currentStatus
      });
      
      if (response.data.success) {
        fetchUsers(); // Refresh users list
        showToast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Status update failed:', error);
      showToast.error('Failed to update user status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'verified': return 'text-blue-600 bg-blue-100';
      case 'unverified': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'logout': return <Shield className="w-4 h-4 text-gray-500" />;
      case 'product_create': return <Database className="w-4 h-4 text-blue-500" />;
      case 'qr_scan': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'role_update': return <Crown className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.roleId === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Crown className="w-8 h-8 text-purple-600" />
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">System management and user administration</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'users', label: 'User Management', icon: Users },
                    { id: 'activity', label: 'Activity Logs', icon: Activity },
                    { id: 'settings', label: 'System Settings', icon: Settings }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-purple-500 text-purple-600'
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
            <div className="space-y-6">
              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-900">{systemStats?.totalUsers}</h3>
                      <p className="text-sm text-gray-600">Total Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Activity className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-900">{systemStats?.activeUsers}</h3>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-900">{systemStats?.totalProducts}</h3>
                      <p className="text-sm text-gray-600">Total Products</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-900">{systemStats?.totalScans}</h3>
                      <p className="text-sm text-gray-600">QR Scans</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Uptime</span>
                      <span className="text-green-600 font-medium">{systemStats?.systemUptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="text-blue-600 font-medium">{systemStats?.storageUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">API Status</span>
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Operational
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-center gap-3 text-sm">
                        {getActionIcon(log.action)}
                        <span className="text-gray-600">
                          {log.user?.name || log.user?.walletAddress?.slice(0, 8) || 'Unknown'} 
                          performed {log.action.replace('_', ' ')}
                        </span>
                        <span className="text-gray-400 ml-auto">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or wallet address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      {Object.values(USER_ROLES).map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-lg">{user.role.id === 'admin' ? '👑' : USER_ROLES[user.roleId as keyof typeof USER_ROLES]?.icon || '👤'}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || `${user.walletAddress?.slice(0, 8)}...${user.walletAddress?.slice(-4)}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email || user.walletAddress}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.roleId}
                              onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              {Object.values(USER_ROLES).map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isVerified ? 'verified' : 'unverified')}`}>
                                {user.isVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLoginAt 
                              ? new Date(user.lastLoginAt).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                                className={`${user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                              >
                                {user.isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Try adjusting your search criteria.' : 'No users in the system yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {activityLogs.map(log => (
                    <div key={log.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {log.user?.name || log.user?.walletAddress?.slice(0, 12) || 'System'}
                            </span>
                            <span className="text-sm text-gray-500">
                              performed {log.action.replace('_', ' ')}
                            </span>
                            {log.resourceId && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {log.resourceId}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                          {Object.keys(log.metadata).length > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              {JSON.stringify(log.metadata)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">System settings interface will be implemented here</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Edit Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit User</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedUser.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter user name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={selectedUser.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={selectedUser.roleId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {Object.values(USER_ROLES).map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Save Changes
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

export default AdminDashboard;