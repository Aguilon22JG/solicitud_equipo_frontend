import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Pages
import LoginPage from '@/pages/Login/LoginPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import OrdersPage from '@/pages/Orders/OrdersPage';
import CreateOrderPage from '@/pages/Orders/CreateOrderPage';
import OrderDetailsPage from '@/pages/Orders/OrderDetailsPage';
import TodayOrdersPage from '@/pages/Orders/TodayOrdersPage';
import EquipmentPage from '@/pages/Equipment/EquipmentPage';
import UsersPage from '@/pages/Users/UsersPage';
import CoursesPage from '@/pages/Courses/CoursesPage';
import ClassroomsPage from '@/pages/Classrooms/ClassroomsPage';
import ReportsPage from '@/pages/Reports/ReportsPage';
import DeliveryPage from '@/pages/Delivery/DeliveryPage';
import ReturnPage from '@/pages/Return/ReturnPage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import NotFoundPage from '@/pages/Error/NotFoundPage';
import UnauthorizedPage from '@/pages/Error/UnauthorizedPage';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Orders */}
                    <Route path="/ordenes" element={<OrdersPage />} />
                    <Route
                      path="/ordenes/nueva"
                      element={
                        <ProtectedRoute allowedRoles={['CATEDRATICO']}>
                          <CreateOrderPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/ordenes/:id" element={<OrderDetailsPage />} />
                    <Route
                      path="/ordenes/hoy"
                      element={
                        <ProtectedRoute allowedRoles={['RECEPCIONISTA']}>
                          <TodayOrdersPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Equipment */}
                    <Route path="/equipos" element={<EquipmentPage />} />

                    {/* Admin Only Routes */}
                    <Route
                      path="/usuarios"
                      element={
                        <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                          <UsersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cursos"
                      element={
                        <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                          <CoursesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/aulas"
                      element={
                        <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                          <ClassroomsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Receptionist Routes */}
                    <Route
                      path="/entregas"
                      element={
                        <ProtectedRoute allowedRoles={['RECEPCIONISTA', 'ADMINISTRADOR']}>
                          <DeliveryPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/devoluciones"
                      element={
                        <ProtectedRoute allowedRoles={['RECEPCIONISTA', 'ADMINISTRADOR']}>
                          <ReturnPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Reports */}
                    <Route
                      path="/reportes"
                      element={
                        <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
                          <ReportsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Professor Routes */}
                    <Route
                      path="/historial"
                      element={
                        <ProtectedRoute allowedRoles={['CATEDRATICO']}>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Profile */}
                    <Route path="/perfil" element={<ProfilePage />} />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      {/* Global Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4caf50',
            },
          },
          error: {
            duration: 6000,
            style: {
              background: '#f44336',
            },
          },
        }}
      />
    </ThemeProvider>
  );
};

export default App;