import { apiService } from './apiService';
import { API_ENDPOINTS } from '@/constants';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderFilters, PaginatedResponse } from '@/types';

class OrderService {
  async getOrders(filters?: OrderFilters, page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.ORDERS}?${params}`);
  }

  async getOrderById(id: string): Promise<Order> {
    return apiService.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`);
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiService.post<Order>(API_ENDPOINTS.ORDERS, data);
  }

  async updateOrder(id: string, data: UpdateOrderRequest): Promise<Order> {
    return apiService.put<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, data);
  }

  async deleteOrder(id: string): Promise<void> {
    return apiService.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
  }

  async approveOrder(id: string): Promise<Order> {
    return apiService.patch<Order>(`${API_ENDPOINTS.ORDERS}/${id}/approve`);
  }

  async rejectOrder(id: string, reason?: string): Promise<Order> {
    return apiService.patch<Order>(`${API_ENDPOINTS.ORDERS}/${id}/reject`, { reason });
  }

  async markAsDelivered(id: string, deliveryData: any): Promise<Order> {
    return apiService.patch<Order>(`${API_ENDPOINTS.ORDERS}/${id}/delivered`, deliveryData);
  }

  async markAsReturned(id: string, returnData: any): Promise<Order> {
    return apiService.patch<Order>(`${API_ENDPOINTS.ORDERS}/${id}/returned`, returnData);
  }

  async getMyOrders(): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.ORDERS}/my-orders`);
  }

  async getTodayOrders(): Promise<Order[]> {
    return apiService.get<Order[]>(`${API_ENDPOINTS.ORDERS}/today`);
  }

  async getPrintableOrder(id: string): Promise<any> {
    return apiService.get(`${API_ENDPOINTS.ORDERS}/${id}/print`);
  }

  async downloadOrderPDF(id: string): Promise<void> {
    return apiService.download(`${API_ENDPOINTS.ORDERS}/${id}/pdf`, `orden-${id}.pdf`);
  }
}

export const orderService = new OrderService();