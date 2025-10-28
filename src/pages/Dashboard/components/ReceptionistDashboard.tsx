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
} from '@mui/material';
import {
  Assignment,
  LocalShipping,
  Undo,
  Schedule,
  CheckCircle,
  Today,
} from '@mui/icons-material';
import DashboardCard from './DashboardCard';
import { DashboardStats, DashboardCard as DashboardCardType, Order } from '../../../types';
import { ORDER_STATUS } from '../../../constants';
import { dashboardService } from '../../../services/dashboardService';

interface ReceptionistDashboardProps {
  stats: DashboardStats | null;
}

const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({ stats }) => {
  const [todayDeliveries, setTodayDeliveries] = useState<Order[]>([]);
  const [todayReturns, setTodayReturns] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [deliveries, returns, orders] = await Promise.all([
        dashboardService.getTodayDeliveries(),
        dashboardService.getTodayReturns(),
        dashboardService.getRecentOrders(5),
      ]);
      
      setTodayDeliveries(deliveries);
      setTodayReturns(returns);
      setRecentOrders(orders);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCardType[] = [
    {
      title: 'Entregas de Hoy',
      value: todayDeliveries.length,
      icon: <LocalShipping />,
      trend: 'up',
      percentage: 15,
      color: 'primary',
    },
    {
      title: 'Devoluciones de Hoy',
      value: todayReturns.length,
      icon: <Undo />,
      trend: 'neutral',
      percentage: 0,
      color: 'success',
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
      title: 'Órdenes Completadas',
      value: stats?.completedOrders || 0,
      icon: <CheckCircle />,
      trend: 'up',
      percentage: 10,
      color: 'success',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Panel de Recepción
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Gestión de entregas y devoluciones de equipos
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
        {/* Today's Deliveries */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Entregas de Hoy"
              action={
                <Chip 
                  label={todayDeliveries.length} 
                  color="primary"
                  size="small"
                />
              }
            />
            <CardContent>
              {todayDeliveries.length === 0 ? (
                <Alert severity="info">No hay entregas programadas para hoy</Alert>
              ) : (
                <List>
                  {todayDeliveries.slice(0, 5).map((order: any) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <LocalShipping color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.professor.firstName} ${order.professor.lastName} - ${order.startTime}`}
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
                <Button size="small" color="primary" href="/entregas">
                  Ver Entregas
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Returns */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Devoluciones de Hoy"
              action={
                <Chip 
                  label={todayReturns.length} 
                  color="success"
                  size="small"
                />
              }
            />
            <CardContent>
              {todayReturns.length === 0 ? (
                <Alert severity="info">No hay devoluciones programadas para hoy</Alert>
              ) : (
                <List>
                  {todayReturns.slice(0, 5).map((order: any) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Undo color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.professor.firstName} ${order.professor.lastName} - ${order.endTime}`}
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
                <Button size="small" color="success" href="/devoluciones">
                  Ver Devoluciones
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
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Today />}
                  href="/ordenes/hoy"
                  size="large"
                >
                  Órdenes de Hoy
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
                  Todas las Órdenes
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader title="Órdenes Recientes" />
            <CardContent>
              {recentOrders.length === 0 ? (
                <Alert severity="info">No hay órdenes recientes</Alert>
              ) : (
                <List>
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Orden #${order.orderNumber}`}
                          secondary={`${order.professor.firstName} ${order.professor.lastName}`}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceptionistDashboard;
