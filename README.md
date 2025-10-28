# Solicitud de Equipos - Frontend

## Descripción
Sistema de gestión de préstamos de equipos universitarios desarrollado en React con TypeScript.

## Características Principales

### Sistema de Autenticación
- Login con JWT tokens (access + refresh)
- Rutas protegidas por rol
- Auto-refresh de tokens
- Persistencia de sesión

### Administrador
- Dashboard con estadísticas completas
- Gestión de usuarios (CRUD)
- Gestión de equipos y categorías
- Aprobación/rechazo de órdenes
- Reportes y análisis
- Gestión de cursos y aulas

### Recepcionista  
- Dashboard operativo
- Órdenes del día
- Proceso de entrega de equipos
- Proceso de devolución
- Impresión de órdenes con QR
- Verificación de estado de equipos

### Catedrático
- Dashboard personal
- Crear nuevas solicitudes
- Seleccionar equipos disponibles
- Historial de órdenes
- Estado de solicitudes

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI v5
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Yup
- **Date Handling**: Day.js
- **QR Codes**: qrcode library
- **Notifications**: React Hot Toast

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   └── layout/           # Layout, Navbar, Sidebar
├── pages/                # Páginas principales
│   ├── Dashboard/        # Dashboards por rol
│   ├── Login/            # Autenticación
│   ├── Orders/           # Gestión de órdenes
│   ├── Equipment/        # Gestión de equipos
│   ├── Users/            # Gestión de usuarios
│   └── Error/            # Páginas de error
├── hooks/                # Custom hooks
├── services/             # Servicios de API
├── store/                # Estado global (Zustand)
├── types/                # Tipos TypeScript
├── constants/            # Constantes
└── utils/                # Utilidades
```

## Configuración del Entorno

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

### Para Producción (`.env.production`):

```env
REACT_APP_API_BASE_URL=https://api.universidad.edu/api
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## Instalación y Uso

### Prerequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Analizar bundle
npm run analyze
```

## Funcionalidades por Rol

### Dashboard Administrador
- **Estadísticas generales**: Total órdenes, equipos, usuarios
- **Órdenes pendientes**: Lista de solicitudes por aprobar
- **Stock bajo**: Equipos que necesitan reposición
- **Gráficos**: Tendencias de uso y estadísticas
- **Acciones rápidas**: Navegación a secciones principales

### Dashboard Recepcionista  
- **Entregas del día**: Órdenes programadas para entrega
- **Devoluciones del día**: Equipos a recibir
- **Proceso de entrega**:
  - Verificar equipos
  - Marcar como entregado
  - Generar comprobante
  - Obtener firma digital
- **Proceso de devolución**:
  - Escanear QR o buscar orden
  - Verificar estado
  - Marcar daños si existen
  - Completar devolución

### Dashboard Catedrático
- **Mis órdenes activas**: Solicitudes en proceso
- **Crear nueva orden**:
  - Seleccionar curso y aula
  - Elegir fecha y horario
  - Seleccionar equipos disponibles
  - Agregar observaciones
- **Historial**: Órdenes anteriores con detalles

## Flujo de Estados de Orden

1. **PENDIENTE** (Amarillo) - Solicitud creada, esperando aprobación
2. **APROBADA** (Azul) - Aprobada por administrador, lista para entrega
3. **EN_USO** (Verde) - Equipos entregados al catedrático
4. **COMPLETADA** (Gris) - Equipos devueltos, orden finalizada
5. **RECHAZADA** (Rojo) - Solicitud rechazada por administrador

## Sistema de Impresión

### Órdenes con QR
- **Código QR único** por orden
- **Información completa**: Catedrático, equipos, horarios
- **Espacios para firmas**: Entrega y recepción
- **Formato optimizado** para papel A4

### Comprobantes
- **Comprobante de entrega**: Detalle de equipos entregados
- **Comprobante de devolución**: Estado de equipos devueltos
- **Formato profesional** con logo institucional

## Características Técnicas

### Responsividad
- **Desktop**: Sidebar navigation completo
- **Tablet**: Sidebar colapsable
- **Mobile**: Bottom navigation + hamburger menu

### Seguridad
- **JWT Authentication**: Tokens de acceso y refresh
- **Rutas protegidas**: Verificación de roles
- **Interceptores HTTP**: Auto-renovación de tokens
- **Validación de permisos**: Control granular de acceso

### Performance
- **Code splitting**: Carga lazy de componentes
- **Optimización de bundle**: Análisis de tamaño
- **Caching**: Estrategias de caché para API calls
- **Loading states**: Feedback visual para operaciones

### Accesibilidad
- **ARIA labels**: Etiquetas para lectores de pantalla
- **Navegación por teclado**: Soporte completo
- **Contraste**: Cumple estándares WCAG
- **Temas**: Modo claro/oscuro (preparado)

## API Integration

### Endpoints Principales
```typescript
// Autenticación
POST /api/auth/login
POST /api/auth/refresh  
POST /api/auth/logout

// Órdenes
GET /api/ordenes
POST /api/ordenes
PUT /api/ordenes/:id
PATCH /api/ordenes/:id/approve
PATCH /api/ordenes/:id/delivered

// Equipos
GET /api/equipos
GET /api/equipos/available
POST /api/equipos

// Usuarios
GET /api/usuarios
POST /api/usuarios
PUT /api/usuarios/:id
```

### Interceptores
- **Request**: Inyección automática de JWT
- **Response**: Manejo de errores y refresh tokens
- **Error handling**: Mensajes user-friendly

## Testing

### Estrategia de Testing
- **Unit tests**: Componentes y funciones
- **Integration tests**: Flujos completos
- **E2E tests**: Cypress para casos críticos

### Ejecutar Tests
```bash
# Tests unitarios
npm test

# Coverage
npm run test:coverage

# E2E (Cypress)
npm run cypress:open
```

## Deployment

### Build de Producción
```bash
# Crear build optimizado
npm run build

# Servir build localmente
npm run serve

# Analizar bundle size
npm run analyze
```

### Variables de Build
- **Optimización**: Minificación y compresión
- **Source maps**: Para debugging en producción
- **Environment**: Configuración por entorno
- **Assets**: Optimización de imágenes

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contribución

### Desarrollo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **TypeScript**: Tipado estricto
- **Convenciones**: Nomenclatura consistente

## Soporte y Documentación

### Links Útiles
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Solución de Problemas

**Error de CORS**: Configurar proxy en package.json
**Tokens expirados**: Verificar configuración de interceptores  
**Build failures**: Limpiar cache con `npm run clean`

## Licencia

MIT License - Ver archivo `LICENSE` para detalles.

## Contacto

**Desarrollador**: Javier García  
**Email**: alejandroaguilon12@gmail.com  
**Versión**: 1.0.0  
**Última actualización**: Octubre 2025