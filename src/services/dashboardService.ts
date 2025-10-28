import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { DashboardStats, Order, Equipment } from '../types';

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return apiService.get<DashboardStats>(`${API_ENDPOINTS.DASHBOARD}/stats`);
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.DASHBOARD}/recent-orders?limit=${limit}`);
  }

  async getLowStockEquipment(): Promise<Equipment[]> {
    return apiService.get<Equipment[]>(`${API_ENDPOINTS.DASHBOARD}/low-stock-equipment`);
  }

  async getPendingApprovals(): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.DASHBOARD}/pending-approvals`);
  }

  async getTodayDeliveries(): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.DASHBOARD}/today-deliveries`);
  }

  async getTodayReturns(): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.DASHBOARD}/today-returns`);
  }

  async getMyOrders(limit: number = 10): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.DASHBOARD}/my-orders?limit=${limit}`);
  }

  async getMyActiveOrders(): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.DASHBOARD}/my-active-orders`);
  }
}

export const dashboardService = new DashboardService();