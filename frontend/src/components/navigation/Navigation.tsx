import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Fish, 
  Microscope, 
  Package, 
  QrCode, 
  Settings, 
  Menu, 
  X, 
  Home,
  Users,
  BarChart3,
  FileText,
  Shield,
  Crown,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RoleGuard } from '../auth/RoleGuard';
import { AuthButton } from '../auth/AuthButton';
import { PERMISSIONS } from '../../constants/roles';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: string[];
  roles?: string[];
  badge?: string;
  children?: NavigationItem[];
}

const Navigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: Home,
    },
    {
      id: 'conservation',
      label: 'Conservation',
      path: '/conservation',
      icon: Microscope,
      permissions: [PERMISSIONS.CONSERVATION_READ],
      badge: 'Research'
    },
    {
      id: 'supply-chain',
      label: 'Supply Chain',
      path: '/supply-chain',
      icon: Package,
      permissions: [PERMISSIONS.SUPPLY_CHAIN_READ],
      children: [
        {
          id: 'my-products',
          label: 'My Products',
          path: '/supply-chain/my-products',
          icon: Package,
          permissions: [
            PERMISSIONS.SUPPLY_CHAIN_FARMED_WRITE,
            PERMISSIONS.SUPPLY_CHAIN_WILD_CAPTURE_WRITE,
            PERMISSIONS.SUPPLY_CHAIN_PROCESSING_WRITE,
            PERMISSIONS.SUPPLY_CHAIN_DISTRIBUTION_WRITE,
            PERMISSIONS.SUPPLY_CHAIN_RETAIL_WRITE
          ]
        },
        {
          id: 'trace-product',
          label: 'Trace Products',
          path: '/supply-chain/trace',
          icon: QrCode,
          permissions: [PERMISSIONS.SUPPLY_CHAIN_READ]
        }
      ]
    },
    {
      id: 'scanner',
      label: 'QR Scanner',
      path: '/scanner',
      icon: QrCode,
      permissions: [PERMISSIONS.QR_SCAN],
      badge: 'Scan'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      permissions: [PERMISSIONS.ANALYTICS_READ],
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: FileText,
      permissions: [PERMISSIONS.DATA_EXPORT],
    },
    {
      id: 'admin',
      label: 'Administration',
      path: '/admin',
      icon: Crown,
      roles: ['admin'],
      badge: 'Admin',
      children: [
        {
          id: 'user-management',
          label: 'User Management',
          path: '/admin/users',
          icon: Users,
          roles: ['admin']
        },
        {
          id: 'system-settings',
          label: 'System Settings',
          path: '/admin/settings',
          icon: Settings,
          roles: ['admin']
        },
        {
          id: 'security',
          label: 'Security',
          path: '/admin/security',
          icon: Shield,
          roles: ['admin']
        }
      ]
    }
  ];

  const hasAccess = (item: NavigationItem): boolean => {
    if (item.roles && item.roles.length > 0) {
      return item.roles.some(role => user?.role.id === role);
    }
    
    if (item.permissions && item.permissions.length > 0) {
      return item.permissions.some(permission => 
        user?.role.permissions.includes('*') || user?.role.permissions.includes(permission)
      );
    }
    
    return true; // No restrictions
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string): boolean => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getActiveBadgeColor = (item: NavigationItem): string => {
    if (item.roles?.includes('admin')) return 'bg-purple-500';
    if (item.permissions?.includes(PERMISSIONS.CONSERVATION_READ)) return 'bg-blue-500';
    if (item.permissions?.includes(PERMISSIONS.QR_SCAN)) return 'bg-cyan-500';
    return 'bg-green-500';
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    if (!hasAccess(item)) return null;

    const Icon = item.icon;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.path);

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              level > 0 ? 'ml-4' : ''
            } ${
              active || item.children?.some(child => isActive(child.path))
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getActiveBadgeColor(item)}`}>
                  {item.badge}
                </span>
              )}
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
            />
          </button>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive: linkActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                level > 0 ? 'ml-4' : ''
              } ${
                linkActive || active
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ml-auto ${getActiveBadgeColor(item)}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        )}

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-16">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Area */}
          <div className="flex items-center flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <Fish className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TracceAqua</span>
            </NavLink>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{user.role.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || `${user.walletAddress?.slice(0, 8)}...`}
                  </p>
                  <p className={`text-xs truncate ${user.role.color}`}>
                    {user.role.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map(item => renderNavigationItem(item))}
            </nav>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              TracceAqua v1.0.0
              <br />
              Blockchain Traceability
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <Fish className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">TracceAqua</span>
          </NavLink>
          
          <div className="flex items-center gap-3">
            <AuthButton />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
            
            <div className="relative flex flex-col w-full max-w-sm bg-white">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Fish className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-gray-900">TracceAqua</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="px-4 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{user.role.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {user.name || `${user.walletAddress?.slice(0, 8)}...`}
                      </p>
                      <p className={`text-sm truncate ${user.role.color}`}>
                        {user.role.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Items */}
              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {navigationItems.map(item => renderNavigationItem(item))}
              </nav>

              {/* Mobile Footer */}
              <div className="px-4 py-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  TracceAqua v1.0.0 - Blockchain Traceability
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Offset for Desktop */}
      <div className="hidden lg:block lg:pl-64">
        {/* This div provides the left padding to account for the fixed sidebar */}
      </div>
    </>
  );
};

export default Navigation;