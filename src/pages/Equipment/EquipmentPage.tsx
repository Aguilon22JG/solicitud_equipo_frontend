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
  Grid,
  Card,
  CardContent,
  Badge,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { Equipment, EquipmentFilters } from '@/types';
import { PAGINATION } from '@/constants';
import { equipmentService } from '@/services/equipmentService';

const EquipmentPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<EquipmentFilters>({});

  useEffect(() => {
    loadEquipment();
  }, [page, rowsPerPage, filters]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getEquipment(filters, page + 1, rowsPerPage);
      setEquipment(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Error loading equipment:', error);
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

  const getStockStatus = (equipment: Equipment) => {
    const percentage = (equipment.availableStock / equipment.totalStock) * 100;
    
    if (percentage === 0) {
      return { color: 'error', label: 'Sin Stock', icon: <Warning /> };
    } else if (percentage < 25) {
      return { color: 'error', label: 'Stock Crítico', icon: <Warning /> };
    } else if (percentage < 50) {
      return { color: 'warning', label: 'Stock Bajo', icon: <Warning /> };
    } else {
      return { color: 'success', label: 'Stock Normal', icon: <CheckCircle /> };
    }
  };

  const getAvailabilityBar = (equipment: Equipment) => {
    const percentage = (equipment.availableStock / equipment.totalStock) * 100;
    let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'success';
    
    if (percentage < 25) color = 'error';
    else if (percentage < 50) color = 'warning';
    
    return (
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={percentage} color={color} />
        <Typography variant="caption" color="text.secondary">
          {equipment.availableStock}/{equipment.totalStock}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Equipos
        </Typography>
        {hasPermission('create') && (
          <Button
            variant="contained"
            startIcon={<Add />}
          >
            Nuevo Equipo
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Buscar equipos..."
                placeholder="Nombre, marca, modelo..."
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({ ...filters, lowStock: true })}
              >
                Stock Bajo
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({})}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Marca/Modelo</TableCell>
                <TableCell>Stock Disponible</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((item: any) => {
                const stockStatus = getStockStatus(item);
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category?.name || 'Sin categoría'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {item.brand}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.model}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getAvailabilityBar(item)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={stockStatus.icon}
                        label={stockStatus.label}
                        color={stockStatus.color as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1}>
                        <Tooltip title="Gestionar inventario">
                          <IconButton size="small">
                            <Inventory />
                          </IconButton>
                        </Tooltip>
                        
                        {hasPermission('update') && (
                          <Tooltip title="Editar">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {hasPermission('delete') && (
                          <Tooltip title="Eliminar">
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          labelDisplayedRows={({ from, to, count }: any) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default EquipmentPage;