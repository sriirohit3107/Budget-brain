import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = React.forwardRef(({ size = 'large', className = '', darkMode }, ref) => {
  const isLarge = size === 'large';

  return (
    <Box 
      ref={ref}
      className={`logo-container ${className}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isLarge ? 2 : 1,
        justifyContent: 'flex-start',
        position: 'relative'
      }}
    >
      {/* Brain Icon */}
      <Box
        className="logo-brain"
        sx={{
          position: 'relative',
          width: isLarge ? 80 : 48,
          height: isLarge ? 80 : 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          animation: 'logoFloat 3s ease-in-out infinite',
          overflow: 'hidden'
        }}
      >
        <Typography
          variant={isLarge ? 'h3' : 'h5'}
          sx={{
            color: 'white',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-display)',
            position: 'relative',
            zIndex: 1
          }}
        >
          🧠
        </Typography>
      </Box>
      
      {/* Text */}
      <Box sx={{ textAlign: 'left' }}>
        <Typography
          variant={isLarge ? 'h2' : 'h4'}
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.1
          }}
        >
          Budget Brain
        </Typography>
        {isLarge && (
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              opacity: 0.8,
              fontFamily: 'var(--font-body)'
            }}
          >
            AI-Powered Ad Intelligence
          </Typography>
        )}
      </Box>
    </Box>
  );
});

Logo.displayName = 'Logo';

export default Logo;
