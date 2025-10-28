// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: '/usuarios',
  ROLES: '/roles',
  EQUIPMENT: '/equipos',
  ORDERS: '/ordenes',
  COURSES: '/cursos',
  CAREERS: '/carreras',
  CLASSROOMS: '/aulas',
  CATEGORIES: '/categorias',
  DASHBOARD: '/dashboard',
  REPORTS: '/reportes',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Order Status Configuration
export const ORDER_STATUS = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'warning' as const,
    bgcolor: '#fff3cd',
    textColor: '#856404',
  },
  APROBADA: {
    label: 'Aprobada',
    color: 'primary' as const,
    bgcolor: '#d1ecf1',
    textColor: '#0c5460',
  },
  EN_USO: {
    label: 'En Uso',
    color: 'success' as const,
    bgcolor: '#d4edda',
    textColor: '#155724',
  },
  COMPLETADA: {
    label: 'Completada',
    color: 'default' as const,
    bgcolor: '#f8f9fa',
    textColor: '#495057',
  },
  RECHAZADA: {
    label: 'Rechazada',
    color: 'error' as const,
    bgcolor: '#f8d7da',
    textColor: '#721c24',
  },
} as const;

// User Roles
export const USER_ROLES = {
  ADMINISTRADOR: {
    name: 'ADMINISTRADOR',
    label: 'Administrador',
    permissions: ['read', 'create', 'update', 'delete', 'approve', 'manage_users'],
  },
  RECEPCIONISTA: {
    name: 'RECEPCIONISTA',
    label: 'Recepcionista',
    permissions: ['read', 'update', 'deliver', 'return', 'print'],
  },
  CATEDRATICO: {
    name: 'CATEDRATICO',
    label: 'Catedrático',
    permissions: ['read', 'create', 'update_own'],
  },
} as const;

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  EMAIL: 'Ingrese un email válido',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  POSITIVE_NUMBER: 'Debe ser un número positivo',
  FUTURE_DATE: 'La fecha debe ser futura',
  VALID_TIME: 'Ingrese una hora válida',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  USERNAME_EXISTS: 'El nombre de usuario ya existe',
  EMAIL_EXISTS: 'El email ya está registrado',
};

// Date and Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
};

// Equipment Conditions
export const EQUIPMENT_CONDITIONS = {
  EXCELENTE: { label: 'Excelente', color: 'success' },
  BUENO: { label: 'Bueno', color: 'primary' },
  REGULAR: { label: 'Regular', color: 'warning' },
  MALO: { label: 'Malo', color: 'error' },
} as const;

// Return Conditions
export const RETURN_CONDITIONS = {
  COMPLETO: { label: 'Completo', color: 'success' },
  INCOMPLETO: { label: 'Incompleto', color: 'warning' },
  DAÑADO: { label: 'Dañado', color: 'error' },
} as const;

// Navigation Menu Items
export const NAVIGATION_ITEMS = {
  ADMINISTRADOR: [
    { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { path: '/ordenes', label: 'Órdenes', icon: 'Assignment' },
    { path: '/equipos', label: 'Equipos', icon: 'Devices' },
    { path: '/usuarios', label: 'Usuarios', icon: 'People' },
    { path: '/cursos', label: 'Cursos', icon: 'School' },
    { path: '/aulas', label: 'Aulas', icon: 'MeetingRoom' },
    { path: '/reportes', label: 'Reportes', icon: 'Assessment' },
  ],
  RECEPCIONISTA: [
    { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { path: '/ordenes', label: 'Órdenes', icon: 'Assignment' },
    { path: '/ordenes/hoy', label: 'Órdenes de Hoy', icon: 'Today' },
    { path: '/entregas', label: 'Entregas', icon: 'LocalShipping' },
    { path: '/devoluciones', label: 'Devoluciones', icon: 'Undo' },
    { path: '/equipos', label: 'Equipos', icon: 'Devices' },
  ],
  CATEDRATICO: [
    { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { path: '/ordenes', label: 'Mis Órdenes', icon: 'Assignment' },
    { path: '/ordenes/nueva', label: 'Nueva Orden', icon: 'Add' },
    { path: '/historial', label: 'Historial', icon: 'History' },
  ],
};

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLORS: {
    BLUE: '#1976d2',
    INDIGO: '#3f51b5',
    PURPLE: '#9c27b0',
    TEAL: '#009688',
    GREEN: '#4caf50',
  },
  BREAKPOINTS: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Print Configuration
export const PRINT_CONFIG = {
  FORMATS: {
    A4: { width: 210, height: 297 },
    LETTER: { width: 216, height: 279 },
  },
  MARGINS: {
    TOP: 20,
    RIGHT: 20,
    BOTTOM: 20,
    LEFT: 20,
  },
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 10,
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  DURATION: 5000, // 5 seconds
  POSITION: 'top-right',
  MAX_NOTIFICATIONS: 5,
};

// Equipment Categories
export const DEFAULT_EQUIPMENT_CATEGORIES = [
  'Proyectores',
  'Computadoras',
  'Audio y Video',
  'Laboratorio',
  'Herramientas',
  'Mobiliario',
  'Deportes',
  'Otros',
];

// Time Slots for Reservations
export const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
];

// Dashboard Refresh Intervals
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  ORDERS: 15000, // 15 seconds
  NOTIFICATIONS: 10000, // 10 seconds
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Intente nuevamente más tarde.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Error de validación. Verifique los datos ingresados.',
  TOKEN_EXPIRED: 'Su sesión ha expirado. Inicie sesión nuevamente.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
};