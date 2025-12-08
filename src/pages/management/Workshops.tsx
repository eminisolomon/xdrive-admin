import { Box, Typography, Container } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Workshops = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#fff',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <StorefrontIcon sx={{ fontSize: '2rem', color: '#3b82f6' }} />
          Workshops Management
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Manage workshops and their operations.
        </Typography>
      </Box>

      {/* Coming Soon */}
      <Box
        sx={{
          p: 4,
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px dashed rgba(59, 130, 246, 0.3)',
          borderRadius: '0.75rem',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#9ca3af', mb: 1 }}>
          Coming Soon
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Workshops management interface is under development.
        </Typography>
      </Box>
    </Container>
  );
};

export default Workshops;
