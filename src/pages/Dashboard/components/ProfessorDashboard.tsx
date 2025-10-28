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
  Paper,
  Fab,
} from '@mui/material';
import {
  Assignment,
  Add,
  History,
  CheckCircle,
  Schedule,
  HourglassEmpty,
} from '@mui/icons-material';
import DashboardCard from './DashboardCard';
import { DashboardStats, DashboardCard as DashboardCardType, Order } from '../../../types';
import { ORDER_STATUS } from '../../../constants';
import { dashboardService } from '../../../services/dashboardService';

interface ProfessorDashboardProps {
  stats: DashboardStats | null;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ stats }) => {
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myActiveOrders, setMyActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [orders, activeOrders] = await Promise.all([
        dashboardService.getMyOrders(10),
        dashboardService.getMyActiveOrders(),
      ]);
      
      setMyOrders(orders);
      setMyActiveOrders(activeOrders);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCardType[] = [
    {
      title: 'Mis Órdenes Totales',
      value: myOrders.length,
      icon: <Assignment />,
      trend: 'up',
      percentage: 20,
      color: 'primary',
    },
    {
      title: 'Órdenes Activas',
      value: myActiveOrders.length,
      icon: <HourglassEmpty />,
      trend: 'neutral',
      percentage: 0,
      color: 'warning',
    },
    {
      title: 'Órdenes Completadas',
      value: myOrders.filter((order: any) => order.status === 'COMPLETADA').length,
      icon: <CheckCircle />,
      trend: 'up',
      percentage: 15,
      color: 'success',
    },
    {
      title: 'Órdenes Pendientes',
      value: myOrders.filter((order: any) => order.status === 'PENDIENTE').length,
      icon: <Schedule />,
      trend: 'down',
      percentage: -5,
      color: 'warning',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Panel de Catedrático
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Gestión de solicitudes de equipos para clases
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
        {/* Active Orders */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Órdenes Activas"
              action={
                <Chip 
                  label={myActiveOrders.length} 
                  color="warning"
                  size="small"
                />
              }
            />
            <CardContent>
              {myActiveOrders.length === 0 ? (
                <Alert severity="info">No tienes órdenes activas en este momento</Alert>
              ) : (
                <List>
                  {myActiveOrders.slice(0, 5).map((order: any) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.course.name} - ${order.classroom.name} - ${new Date(order.scheduledDate).toLocaleDateString()}`}
                        />
                        <Chip
                          label={ORDER_STATUS[order.status as keyof typeof ORDER_STATUS].label}
                          color={ORDER_STATUS[order.status as keyof typeof ORDER_STATUS].color}
                          size="small"
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
              <Box textAlign="center" mt={2}>
                <Button size="small" color="primary" href="/ordenes">
                  Ver Todas Mis Órdenes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  href="/ordenes/nueva"
                  size="large"
                  sx={{ mb: 2 }}
                >
                  Nueva Solicitud de Equipo
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assignment />}
                  href="/ordenes"
                  size="large"
                >
                  Mis Órdenes
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<History />}
                  href="/historial"
                  size="large"
                >
                  Historial
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Mis Órdenes Recientes" />
            <CardContent>
              {myOrders.length === 0 ? (
                <Alert severity="info" action={
                  <Button color="inherit" size="small" href="/ordenes/nueva">
                    Crear Primera Orden
                  </Button>
                }>
                  No tienes órdenes registradas aún
                </Alert>
              ) : (
                <List>
                  {myOrders.slice(0, 8).map((order: any) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.course.name} - ${order.classroom.name} - ${new Date(order.scheduledDate).toLocaleDateString()} ${order.startTime}-${order.endTime}`}
                        />
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={ORDER_STATUS[order.status as keyof typeof ORDER_STATUS].label}
                            color={ORDER_STATUS[order.status as keyof typeof ORDER_STATUS].color}
                            size="small"
                          />
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
              {myOrders.length > 8 && (
                <Box textAlign="center" mt={2}>
                  <Button size="small" color="primary" href="/ordenes">
                    Ver Todas ({myOrders.length})
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        href="/ordenes/nueva"
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ProfessorDashboard;