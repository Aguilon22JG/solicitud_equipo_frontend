import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  School,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types';
import { VALIDATION_MESSAGES } from '../../constants';

const schema = yup.object().shape({
  username: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3)),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.MIN_LENGTH(6)),
});

const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    try {
      const success = await login(data);
      if (!success) {
        setError('Credenciales inválidas. Verifique su usuario y contraseña.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If already authenticated, redirect will be handled by useAuth hook
  if (isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box textAlign="center" mb={4}>
            <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Gestión de Equipos
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sistema Universitario
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Usuario"
              variant="outlined"
              margin="normal"
              autoComplete="username"
              autoFocus
              disabled={isLoading || isSubmitting}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              {...register('username')}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              autoComplete="current-password"
              disabled={isLoading || isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isLoading || isSubmitting}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading || isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="caption" color="textSecondary">
              © 2024 Universidad - Sistema de Gestión de Equipos
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;