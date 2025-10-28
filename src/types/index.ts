import { ReactNode, ComponentType } from 'react';

// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  rol_id: number;
  catedratico_id: number | null;
  recepcionista_id: number | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Catedratico {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  status: number;
  createdAt: string;
}

export interface Recepcionista {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  shift: string;
  status: number;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  rol: Role;
  catedratico: Catedratico | null;
  recepcionista: Recepcionista | null;
  token: string;
  refreshToken: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  category: EquipmentCategory;
  totalStock: number;
  availableStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
}

export interface EquipmentRequest {
  equipmentId: string;
  equipment: Equipment;
  requestedQuantity: number;
  deliveredQuantity?: number;
  returnedQuantity?: number;
  observations?: string;
}

// Order Types
export type OrderStatus = 'PENDIENTE' | 'APROBADA' | 'EN_USO' | 'COMPLETADA' | 'RECHAZADA';

export interface Order {
  id: string;
  orderNumber: string;
  professorId: string;
  professor: User;
  courseId: string;
  course: Course;
  classroomId: string;
  classroom: Classroom;
  requestDate: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: OrderStatus;
  equipmentRequests: EquipmentRequest[];
  observations?: string;
  deliveryDate?: string;
  returnDate?: string;
  deliveredBy?: User;
  receivedBy?: User;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  courseId: string;
  classroomId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  equipmentRequests: {
    equipmentId: string;
    requestedQuantity: number;
  }[];
  observations?: string;
}

export interface UpdateOrderRequest {
  courseId?: string;
  classroomId?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  equipmentRequests?: {
    equipmentId: string;
    requestedQuantity: number;
  }[];
  observations?: string;
  status?: OrderStatus;
}

// Academic Types
export interface Course {
  id: string;
  name: string;
  code: string;
  careerName: string;
  semester: number;
  professorId: string;
  professor: User;
  isActive: boolean;
}

export interface Career {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  capacity: number;
  building: string;
  floor: number;
  hasProjector: boolean;
  hasComputers: boolean;
  isActive: boolean;
}

// Dashboard Types
export interface DashboardCard {
  title: string;
  value: number;
  icon: ReactNode;
  trend: 'up' | 'down' | 'neutral';
  percentage: number;
  color: 'primary' | 'success' | 'warning' | 'error';
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalEquipment: number;
  availableEquipment: number;
  lowStockEquipment: number;
  totalUsers: number;
}

// Form Types
export interface OrderFormData {
  courseId: string;
  classroomId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  equipmentRequests: EquipmentRequest[];
  observations: string;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  password?: string;
  isActive: boolean;
}

export interface EquipmentFormData {
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  categoryId: string;
  totalStock: number;
  isActive: boolean;
}

// API Response Types (updated to match real API)

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: number;
  details?: any;
}

// Filter and Search Types
export interface OrderFilters {
  status?: OrderStatus;
  professorId?: string;
  classroomId?: string;
  startDate?: string;
  endDate?: string;
  equipmentId?: string;
}

export interface EquipmentFilters {
  categoryId?: string;
  brand?: string;
  isActive?: boolean;
  lowStock?: boolean;
}

export interface UserFilters {
  roleId?: string;
  isActive?: boolean;
  search?: string;
}

// Print Types
export interface PrintableOrder {
  orderData: Order;
  qrCode: string;
  institutionLogo: string;
  printDate: Date;
  format: 'A4' | 'Letter';
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Theme Types
export interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
}

// Route Types
export interface RouteConfig {
  path: string;
  component: ComponentType;
  isProtected: boolean;
  allowedRoles?: string[];
  exact?: boolean;
}

// Table Types
export interface TableColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
  sortable?: boolean;
}

export interface TableAction<T> {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: (row: T) => boolean;
}

// Delivery and Return Types
export interface DeliveryProcess {
  orderId: string;
  equipmentChecks: {
    equipmentId: string;
    deliveredQuantity: number;
    condition: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'MALO';
    observations?: string;
    photo?: File;
  }[];
  professorSignature?: string;
  deliveryNotes?: string;
}

export interface ReturnProcess {
  orderId: string;
  equipmentReturns: {
    equipmentId: string;
    returnedQuantity: number;
    condition: 'COMPLETO' | 'INCOMPLETO' | 'DAÑADO';
    observations?: string;
    damages?: string[];
  }[];
  janitorReview: 'COMPLETO' | 'INCOMPLETO';
  returnNotes?: string;
}