import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import { DashboardCard as DashboardCardType } from '@/types';

interface DashboardCardProps {
  card: DashboardCardType;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ card }) => {
  const getTrendIcon = () => {
    switch (card.trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="action" />;
    }
  };

  const getTrendColor = () => {
    switch (card.trend) {
      case 'up':
        return 'success.main';
      case 'down':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar
            sx={{
              bgcolor: `${card.color}.main`,
              width: 56,
              height: 56,
            }}
          >
            {card.icon}
          </Avatar>
          <Box textAlign="right">
            <Typography variant="h4" fontWeight="bold" color={`${card.color}.main`}>
              {card.value.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" color="text.primary" gutterBottom>
          {card.title}
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {getTrendIcon()}
            <Typography
              variant="body2"
              sx={{ color: getTrendColor(), fontWeight: 'medium' }}
            >
              {card.percentage > 0 ? '+' : ''}{card.percentage}%
            </Typography>
          </Box>
          <Chip
            label={card.trend === 'up' ? 'Aumento' : card.trend === 'down' ? 'Disminución' : 'Estable'}
            size="small"
            color={card.trend === 'up' ? 'success' : card.trend === 'down' ? 'error' : 'default'}
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;