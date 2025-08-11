import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const ResultsCard = React.forwardRef(({ children, darkMode, title, icon }, ref) => {
  return (
    <Card 
      ref={ref}
      className="apple-card" 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(10, 132, 255, 0.05) 0%, rgba(94, 92, 230, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(88, 86, 214, 0.05) 100%)',
          zIndex: -1
        }
      }}
    >
      <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
        {title && (
          <Box className="section-header" sx={{ mb: 4 }}>
            <Box className="section-icon">
              {icon}
            </Box>
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 2, color: 'primary.main' }}>
              {title}
            </Typography>
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
});

ResultsCard.displayName = 'ResultsCard';

export default ResultsCard;
