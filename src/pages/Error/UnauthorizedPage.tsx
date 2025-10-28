import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const UnauthorizedPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <LockOutlined sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          No tienes permisos para acceder a esta página.
        </Typography>
        <Button
          variant="contained"
          href="/dashboard"
          size="large"
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;