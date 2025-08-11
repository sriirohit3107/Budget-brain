import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Hero = React.forwardRef(({ darkMode, onOptimize, loading, companyData }, ref) => {
  return (
    <Box ref={ref} className="hero-section" sx={{ mb: 8, position: 'relative', overflow: 'hidden' }}>
      {/* Hero Content */}
      <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            fontFamily: 'var(--font-display)'
          }}
        >
          AI-Powered Budget Intelligence
        </Typography>
        
        <Typography
          variant="h6"
          sx={{ 
            color: 'text.secondary',
            mb: 4,
            maxWidth: 800,
            mx: 'auto',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6
          }}
        >
          Transform your ad spend with intelligent budget allocation across Google, Meta, TikTok & LinkedIn
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onOptimize}
            disabled={loading || !companyData.name || companyData.budget <= 0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.2rem',
              fontWeight: 600,
              padding: '16px 32px',
              borderRadius: '50px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
            startIcon={loading ? <div className="loading-pulse">🧠</div> : <RocketLaunchIcon />}
          >
            {loading ? 'Optimizing your ad magic...' : 'Start Optimizing'}
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: '1.1rem',
              padding: '16px 32px',
              borderRadius: '50px',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(102, 126, 234, 0.05)'
              }
            }}
          >
            View Demo
          </Button>
        </Box>
      </Box>
    </Box>
  );
});

Hero.displayName = 'Hero';

export default Hero;
