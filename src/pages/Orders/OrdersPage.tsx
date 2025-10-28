import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Print,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { Order, OrderFilters } from '@/types';
import { ORDER_STATUS, PAGINATION } from '@/constants';
import { orderService } from '@/services/orderService';

const OrdersPage: React.FC = () => {
  const { hasRole, hasPermission } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [page, rowsPerPage, filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders(filters, page + 1, rowsPerPage);
      setOrders(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApproveOrder = async (id: string) => {
    try {
      await orderService.approveOrder(id);
      loadOrders();
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleRejectOrder = async (id: string) => {
    try {
      await orderService.rejectOrder(id);
      loadOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    return (
      <Chip
        label={statusConfig?.label || status}
        color={statusConfig?.color as any}
        size="small"
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {hasRole('CATEDRATICO') ? 'Mis Órdenes' : 'Gestión de Órdenes'}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            variant="outlined"
          >
            Filtros
          </Button>
          {hasRole('CATEDRATICO') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              href="/ordenes/nueva"
            >
              Nueva Orden
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Inicio"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Fin"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={loadOrders}
                  >
                    Aplicar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters({})}
                  >
                    Limpiar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Orden</TableCell>
                <TableCell>Catedrático</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Aula</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    {order.professor.firstName} {order.professor.lastName}
                  </TableCell>
                  <TableCell>{order.course.name}</TableCell>
                  <TableCell>{order.classroom.name}</TableCell>
                  <TableCell>
                    {new Date(order.scheduledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.startTime} - {order.endTime}
                  </TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" href={`/ordenes/${order.id}`}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      
                      {hasPermission('print') && (
                        <Tooltip title="Imprimir">
                          <IconButton size="small">
                            <Print />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {hasPermission('approve') && order.status === 'PENDIENTE' && (
                        <>
                          <Tooltip title="Aprobar">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApproveOrder(order.id)}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rechazar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRejectOrder(order.id)}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      
                      {hasPermission('update') && 
                       (hasRole('ADMINISTRADOR') || 
                        (hasRole('CATEDRATICO') && order.status === 'PENDIENTE')) && (
                        <Tooltip title="Editar">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={PAGINATION.PAGE_SIZE_OPTIONS}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      {/* Floating Action Button for Professor */}
      {hasRole('CATEDRATICO') && (
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
      )}
    </Box>
  );
};

export default OrdersPage;