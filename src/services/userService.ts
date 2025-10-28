import { apiService } from './apiService';
import { API_ENDPOINTS } from '@/constants';
import { User, UserFormData, UserFilters, PaginatedResponse, Role } from '@/types';

class UserService {
  async getUsers(filters?: UserFilters, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.roleId) params.append('roleId', filters.roleId);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.search) params.append('search', filters.search);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<PaginatedResponse<User>>(`${API_ENDPOINTS.USERS}?${params}`);
  }

  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  }

  async createUser(data: UserFormData): Promise<User> {
    return apiService.post<User>(API_ENDPOINTS.USERS, data);
  }

  async updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
    return apiService.put<User>(`${API_ENDPOINTS.USERS}/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return apiService.delete(`${API_ENDPOINTS.USERS}/${id}`);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    return apiService.patch(`${API_ENDPOINTS.USERS}/${id}/reset-password`, {
      newPassword,
    });
  }

  async changeUserStatus(id: string, isActive: boolean): Promise<User> {
    return apiService.patch<User>(`${API_ENDPOINTS.USERS}/${id}/status`, {
      isActive,
    });
  }

  async getRoles(): Promise<Role[]> {
    return apiService.get<Role[]>(API_ENDPOINTS.ROLES);
  }

  async getProfessors(): Promise<User[]> {
    return apiService.get<User[]>(`${API_ENDPOINTS.USERS}/professors`);
  }

  async getReceptionists(): Promise<User[]> {
    return apiService.get<User[]>(`${API_ENDPOINTS.USERS}/receptionists`);
  }
}

export const userService = new UserService();