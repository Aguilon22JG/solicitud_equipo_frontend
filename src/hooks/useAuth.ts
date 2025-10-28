import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { LoginCredentials, User } from '../types';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    user,
    role,
    accessToken,
    refreshToken,
    isAuthenticated,
    setAuthData,
    clearAuth,
    setLoading: setStoreLoading,
  } = useAuthStore();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setStoreLoading(true);

      const response = await authService.login(credentials);
      
      // Set all auth data using the new structure
      setAuthData({
        user: response.user,
        role: response.rol, // Note: API uses 'rol' not 'role'
        catedratico: response.catedratico,
        recepcionista: response.recepcionista,
        token: response.token,
        refreshToken: response.refreshToken,
      });
      
      const userName = response.catedratico?.first_name || response.recepcionista?.first_name || response.user.username;
      toast.success(`¡Bienvenido, ${userName}!`);
      
      // Redirect based on role
      const redirectPath = getRedirectPath(response.rol.name);
      navigate(redirectPath, { replace: true });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.message || 'Error al iniciar sesión';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setStoreLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setStoreLoading(false);
      navigate('/login', { replace: true });
      toast.success('Sesión cerrada correctamente');
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    if (!accessToken || !refreshToken) {
      return false;
    }

    // For now, if we have tokens, consider authenticated
    // The API doesn't have a getCurrentUser endpoint
    return true;
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      // API doesn't have update profile endpoint yet
      toast.error('Actualización de perfil no disponible');
      return false;
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Error al actualizar perfil');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // API doesn't have change password endpoint yet
      toast.error('Cambio de contraseña no disponible');
      return false;
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error('Error al cambiar contraseña');
      return false;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !role) return false;
    
    // Admin has all permissions
    if (role.name === 'Administrador') return true;
    
    // Check specific permissions based on role
    const rolePermissions = getRolePermissions(role.name);
    return rolePermissions.includes(permission);
  };

  const hasRole = (roleName: string): boolean => {
    return role?.name === roleName;
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    return roleNames.some(roleName => hasRole(roleName));
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || useAuthStore.getState().isLoading,
    
    // Actions
    login,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    
    // Permissions
    hasPermission,
    hasRole,
    hasAnyRole,
  };
};

// Helper functions
const getRedirectPath = (roleName: string): string => {
  switch (roleName) {
    case 'Administrador':
      return '/dashboard';
    case 'Recepcionista':
      return '/dashboard';
    case 'Catedratico':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

const getRolePermissions = (roleName: string): string[] => {
  switch (roleName) {
    case 'Administrador':
      return ['read', 'create', 'update', 'delete', 'approve', 'manage_users', 'reports'];
    case 'Recepcionista':
      return ['read', 'update', 'deliver', 'return', 'print'];
    case 'Catedratico':
      return ['read', 'create', 'update_own'];
    default:
      return [];
  }
};