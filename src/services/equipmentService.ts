import { apiService } from './apiService';
import { API_ENDPOINTS } from '@/constants';
import { Equipment, EquipmentFormData, EquipmentFilters, PaginatedResponse } from '@/types';

class EquipmentService {
  async getEquipment(filters?: EquipmentFilters, page = 1, limit = 10): Promise<PaginatedResponse<Equipment>> {
    const params = new URLSearchParams();
    if (filters) {
      // Iterate through filter properties
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.lowStock !== undefined) params.append('lowStock', filters.lowStock.toString());
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<PaginatedResponse<Equipment>>(`${API_ENDPOINTS.EQUIPMENT}?${params}`);
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    return apiService.get<Equipment>(`${API_ENDPOINTS.EQUIPMENT}/${id}`);
  }

  async createEquipment(data: EquipmentFormData): Promise<Equipment> {
    return apiService.post<Equipment>(API_ENDPOINTS.EQUIPMENT, data);
  }

  async updateEquipment(id: string, data: Partial<EquipmentFormData>): Promise<Equipment> {
    return apiService.put<Equipment>(`${API_ENDPOINTS.EQUIPMENT}/${id}`, data);
  }

  async deleteEquipment(id: string): Promise<void> {
    return apiService.delete(`${API_ENDPOINTS.EQUIPMENT}/${id}`);
  }

  async getAvailableEquipment(date: string, startTime: string, endTime: string): Promise<Equipment[]> {
    const params = new URLSearchParams();
    params.append('date', date);
    params.append('startTime', startTime);
    params.append('endTime', endTime);

    return apiService.get<Equipment[]>(`${API_ENDPOINTS.EQUIPMENT}/available?${params}`);
  }

  async getEquipmentCategories(): Promise<any[]> {
    return apiService.get<any[]>(`${API_ENDPOINTS.CATEGORIES}`);
  }

  async updateStock(id: string, newStock: number): Promise<Equipment> {
    return apiService.patch<Equipment>(`${API_ENDPOINTS.EQUIPMENT}/${id}/stock`, {
      totalStock: newStock,
    });
  }
}

export const equipmentService = new EquipmentService();