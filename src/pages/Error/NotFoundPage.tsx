import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
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
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          La página que buscas no existe o ha sido movida.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          href="/dashboard"
          size="large"
        >
          Ir al Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;