import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Devices,
  People,
  Warning,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
} from '@mui/icons-material';
import DashboardCard from './DashboardCard';
import { DashboardStats, DashboardCard as DashboardCardType, Order, Equipment } from '../../../types';
import { ORDER_STATUS } from '../../../constants';
import { dashboardService } from '../../../services/dashboardService';

interface AdminDashboardProps {
  stats: DashboardStats | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockEquipment, setLowStockEquipment] = useState<Equipment[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [orders, equipment, approvals] = await Promise.all([
        dashboardService.getRecentOrders(5),
        dashboardService.getLowStockEquipment(),
        dashboardService.getPendingApprovals(),
      ]);
      
      setRecentOrders(orders);
      setLowStockEquipment(equipment);
      setPendingApprovals(approvals);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCardType[] = [
    {
      title: 'Total de Órdenes',
      value: stats?.totalOrders || 0,
      icon: <Assignment />,
      trend: 'up',
      percentage: 12,
      color: 'primary',
    },
    {
      title: 'Órdenes Pendientes',
      value: stats?.pendingOrders || 0,
      icon: <Schedule />,
      trend: 'neutral',
      percentage: 0,
      color: 'warning',
    },
    {
      title: 'Órdenes Activas',
      value: stats?.activeOrders || 0,
      icon: <CheckCircle />,
      trend: 'up',
      percentage: 8,
      color: 'success',
    },
    {
      title: 'Total de Usuarios',
      value: stats?.totalUsers || 0,
      icon: <People />,
      trend: 'up',
      percentage: 5,
      color: 'primary',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Panel de Administración
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Vista general del sistema de gestión de equipos
      </Typography>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard card={card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Approvals */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Órdenes Pendientes de Aprobación"
              action={
                <Chip 
                  label={pendingApprovals.length} 
                  color="warning"
                  size="small"
                />
              }
            />
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <Alert severity="info">No hay órdenes pendientes de aprobación</Alert>
              ) : (
                <List>
                  {pendingApprovals.slice(0, 5).map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.professor.username} - ${order.course.name}`}
                        />
                        <Chip
                          label={ORDER_STATUS[order.status].label}
                          color={ORDER_STATUS[order.status].color}
                          size="small"
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
              {pendingApprovals.length > 5 && (
                <Box textAlign="center" mt={2}>
                  <Button size="small" color="primary">
                    Ver todas ({pendingApprovals.length})
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Equipment */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Equipos con Stock Bajo"
              action={
                <Chip 
                  label={lowStockEquipment.length} 
                  color="error"
                  size="small"
                />
              }
            />
            <CardContent>
              {lowStockEquipment.length === 0 ? (
                <Alert severity="success">Todos los equipos tienen stock suficiente</Alert>
              ) : (
                <List>
                  {lowStockEquipment.slice(0, 5).map((equipment) => (
                    <React.Fragment key={equipment.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Warning color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={equipment.name}
                          secondary={`Stock disponible: ${equipment.availableStock}/${equipment.totalStock}`}
                        />
                        <Chip
                          label={`${Math.round((equipment.availableStock / equipment.totalStock) * 100)}%`}
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
              {lowStockEquipment.length > 5 && (
                <Box textAlign="center" mt={2}>
                  <Button size="small" color="primary">
                    Ver todos ({lowStockEquipment.length})
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Órdenes Recientes" />
            <CardContent>
              {recentOrders.length === 0 ? (
                <Alert severity="info">No hay órdenes recientes</Alert>
              ) : (
                <List>
                  {recentOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.professor.username} - ${order.course.name} - ${order.classroom.name}`}
                        />
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.scheduledDate).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={ORDER_STATUS[order.status].label}
                            color={ORDER_STATUS[order.status].color}
                            size="small"
                          />
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;