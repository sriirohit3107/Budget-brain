// src/App.js
import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Chip,
  Fade,
  IconButton,
  Tooltip,
  ThemeProvider
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import axios from 'axios';

// Import components
import {
  Logo,
  Hero,
  Confetti,
  InputPanel,
  ResultsPanel,
  ErrorBoundary
} from './components';

// Import utilities
import { createAppleTheme } from './theme/theme';
import { useOptimization } from './hooks/useOptimization';
import { DEMO_COMPANIES } from './utils/constants';

// Import styles
import './App.css';

// ----- Axios base URL -----
axios.defaults.baseURL =
process.env.REACT_APP_API_BASE || 'https://budget-brain-production.up.railway.app';


function App() {
  const [companyData, setCompanyData] = useState({
    name: "",
    budget: 10000,
    goal: "leads",
    industry: "default"
  });

  const [assumptions, setAssumptions] = useState({
    minLinkedin: 10,
    maxGoogle: 60,
    preferSocial: false,
    uncertaintyFactor: 1.0
  });

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Use custom hook for optimization logic
  const {
    results,
    loading,
    error,
    enhancedExplanation,
    loadingExplanation,
    optimizationProgress,
    handleOptimize,
    getEnhancedExplanation,
    resetResults
  } = useOptimization();

  // Theme handling and first load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Set first load to false after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Confetti trigger
  const triggerConfetti = useCallback(() => setShowConfetti(true), []);

  // Fire confetti when new results look strong
  useEffect(() => {
    if (!results) return;
    const p50 = results.total_expected_leads?.p50 ?? 0;
    // Simple celebratory threshold — feel free to tune
    if (p50 > companyData.budget / 100) {
      triggerConfetti();
    }
  }, [results, companyData.budget, triggerConfetti]);

  const handleOptimizeEnhanced = useCallback(async () => {
    await handleOptimize(companyData, assumptions);
  }, [handleOptimize, companyData, assumptions]);

  const loadDemoCompany = useCallback((company) => {
    setSelectedCompany(company.name);
    setCompanyData(company);
    resetResults();

    // Auto-optimize for demo companies
    setTimeout(() => handleOptimizeEnhanced(), 500);
  }, [setSelectedCompany, setCompanyData, resetResults, handleOptimizeEnhanced]);

  const handleGetEnhancedExplanation = useCallback(async () => {
    await getEnhancedExplanation(companyData, results);
  }, [getEnhancedExplanation, companyData, results]);

  return (
    <ThemeProvider theme={createAppleTheme(darkMode)}>
      <div className="App">
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

        {/* Dark Mode Toggle */}
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`} arrow>
            <IconButton
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              sx={{
                background: darkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${darkMode 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(0, 0, 0, 0.1)'}`,
                color: darkMode ? '#F2F2F7' : '#1F2937',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(0, 0, 0, 0.08)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Header */}
          {!isFirstLoad ? (
            <Fade in={true} timeout={600} addEndListener={() => {}}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 6,
                  pb: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  opacity: 0.9,
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Logo size="small" darkMode={darkMode} />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                  </Typography>
                  <Chip 
                    label="AI-Powered" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderColor: 'primary.main',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 6,
                pb: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                opacity: 0.9,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Logo size="small" darkMode={darkMode} />
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                </Typography>
                <Chip 
                  label="AI-Powered" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ 
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderColor: 'primary.main',
                    display: { xs: 'none', sm: 'block' }
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Apple-style Hero Section */}
          {!isFirstLoad ? (
            <Fade in={true} timeout={800}>
              <div>
                <ErrorBoundary>
                  <Hero darkMode={darkMode} onOptimize={handleOptimizeEnhanced} loading={loading} companyData={companyData} />
                </ErrorBoundary>
              </div>
            </Fade>
          ) : (
            <ErrorBoundary>
              <Hero darkMode={darkMode} onOptimize={handleOptimizeEnhanced} loading={loading} companyData={companyData} />
            </ErrorBoundary>
          )}

          <Grid container spacing={6}>
            {/* Input Panel */}
            <Grid item xs={12} md={4}>
              {!isFirstLoad ? (
                <Fade in={true} timeout={1200}>
                  <div>
                    <InputPanel
                      companyData={companyData}
                      setCompanyData={setCompanyData}
                      assumptions={assumptions}
                      setAssumptions={setAssumptions}
                      showAdvanced={showAdvanced}
                      setShowAdvanced={setShowAdvanced}
                      loading={loading}
                      optimizationProgress={optimizationProgress}
                      error={error}
                      onOptimize={handleOptimizeEnhanced}
                      selectedCompany={selectedCompany}
                      setSelectedCompany={setSelectedCompany}
                      isFirstLoad={isFirstLoad}
                    />
                  </div>
                </Fade>
              ) : (
                <ErrorBoundary>
                  <InputPanel
                    companyData={companyData}
                    setCompanyData={setCompanyData}
                    assumptions={assumptions}
                    setAssumptions={setAssumptions}
                    showAdvanced={showAdvanced}
                    setShowAdvanced={setShowAdvanced}
                    loading={loading}
                    optimizationProgress={optimizationProgress}
                    error={error}
                    onOptimize={handleOptimizeEnhanced}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    isFirstLoad={isFirstLoad}
                  />
                </ErrorBoundary>
              )}
            </Grid>

            {/* Results Panel */}
            <Grid item xs={12} md={8} sx={{ mt: 2 }}>
              <ErrorBoundary>
                <ResultsPanel
                  results={results}
                  companyData={companyData}
                  darkMode={darkMode}
                  enhancedExplanation={enhancedExplanation}
                  loadingExplanation={loadingExplanation}
                  onGetEnhancedExplanation={handleGetEnhancedExplanation}
                />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </Container>
        
        {/* Footer */}
        <Box 
          sx={{ 
            mt: 8, 
            py: 4, 
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
            opacity: 0.7
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Built with ❤️
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              AI-Powered Budget Allocation • Monte Carlo Simulation • Gemini Intelligence
            </Typography>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
