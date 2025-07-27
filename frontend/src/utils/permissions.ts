import { USER_ROLES } from '../constants/roles';

export interface Permission {
  resource: string;
  action: string;
  condition?: (context: any) => boolean;
}

export class PermissionManager {
  static hasPermission(
    userPermissions: string[], 
    requiredPermission: string,
    context?: any
  ): boolean {
    // Admin has all permissions
    if (userPermissions.includes('*')) {
      return true;
    }

    // Check exact permission match
    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Check wildcard patterns
    const permissionParts = requiredPermission.split('.');
    for (let i = permissionParts.length - 1; i >= 0; i--) {
      const wildcardPermission = permissionParts.slice(0, i).join('.') + '.*';
      if (userPermissions.includes(wildcardPermission)) {
        return true;
      }
    }

    return false;
  }

  static hasRole(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
  }

  static hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => 
      this.hasPermission(userPermissions, permission)
    );
  }

  static canAccessResource(
    userRole: string, 
    userPermissions: string[], 
    resource: string, 
    action: string = 'read'
  ): boolean {
    const permission = `${resource}.${action}`;
    return this.hasPermission(userPermissions, permission);
  }

  static getRolePermissions(roleId: string): string[] {
    const role = USER_ROLES[roleId];
    return role ? role.permissions : [];
  }

  static getRoleLevel(roleId: string): number {
    const role = USER_ROLES[roleId];
    return role ? role.level : 0;
  }

  static canManageUser(managerRole: string, targetRole: string): boolean {
    const managerLevel = this.getRoleLevel(managerRole);
    const targetLevel = this.getRoleLevel(targetRole);
    
    // Admins can manage anyone
    if (managerRole === 'admin') return true;
    
    // Can only manage users with lower level
    return managerLevel > targetLevel;
  }
}