import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment,
  Devices,
  People,
  Warning,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { DashboardCard, DashboardStats } from '../../types';
import AdminDashboard from './components/AdminDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';
import { dashboardService } from '../../services/dashboardService';

const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  // Render specific dashboard based on user role
  if (hasRole('ADMINISTRADOR')) {
    return <AdminDashboard stats={stats} />;
  }

  if (hasRole('RECEPCIONISTA')) {
    return <ReceptionistDashboard stats={stats} />;
  }

  if (hasRole('CATEDRATICO')) {
    return <ProfessorDashboard stats={stats} />;
  }

  return (
    <Alert severity="warning">
      No se pudo determinar el tipo de dashboard para su rol.
    </Alert>
  );
};

export default DashboardPage;