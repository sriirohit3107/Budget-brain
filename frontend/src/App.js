// src/App.js
import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Chip,
  Alert,
  LinearProgress,
  Fade,
  Grow,
  IconButton,
  Tooltip as MuiTooltip,
  Switch,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  Slide,
  Zoom,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SparkleIcon from '@mui/icons-material/AutoAwesome';
import CelebrationIcon from '@mui/icons-material/Celebration';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './App.css';

// ----- Axios base URL -----
axios.defaults.baseURL =
  process.env.REACT_APP_API_BASE || 'http://localhost:8000';

// ----- Logo Component -----
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

// 3D Interactive Card Component removed

// 3D Floating Icons Component removed

// ----- Hero Section -----
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

const DEMO_COMPANIES = [
  { name: "TechFlow SaaS", industry: "b2b_saas", goal: "demos", budget: 8000, description: "CRM for SMBs" },
  { name: "StyleCo Fashion", industry: "ecommerce", goal: "sales", budget: 12000, description: "Sustainable fashion" },
  { name: "EduLearn Online", industry: "education", goal: "awareness", budget: 5000, description: "K-12 platform" },
  { name: "HealthTech Pro", industry: "healthcare", goal: "leads", budget: 15000, description: "Telemedicine" },
  { name: "FinanceWise", industry: "finance", goal: "demos", budget: 20000, description: "Investment platform" },
  { name: "CloudFlow Systems", industry: "b2b_saas", goal: "revenue", budget: 25000, description: "DevOps automation" },
  { name: "SmartTech Store", industry: "ecommerce", goal: "revenue", budget: 18000, description: "Electronics retailer" },
  { name: "Shopify", industry: "b2b_saas", goal: "demos", budget: 25000, description: "E-commerce platform" }
];

const BUDGET_RANGES = [
  { label: "Startup ($2K-8K)", min: 2000, max: 8000 },
  { label: "Growth ($8K-25K)", min: 8000, max: 25000 },
  { label: "Enterprise ($25K-100K)", min: 25000, max: 100000 },
  { label: "Enterprise+ ($100K+)", min: 100000, max: 500000 }
];

const PLATFORM_COLORS = {
  google: "#4285F4",
  meta: "#1877F2",
  tiktok: "#FF0050",
  linkedin: "#0A66C2"
};

// Apple-inspired theme with enhanced dark mode
const createAppleTheme = (isDark) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: { 
      main: isDark ? '#0A84FF' : '#007AFF',
      light: isDark ? '#5AC8FA' : '#4DA3FF',
      dark: isDark ? '#0051D5' : '#0051D5'
    },
    secondary: { 
      main: isDark ? '#5E5CE6' : '#5856D6',
      light: isDark ? '#7B61FF' : '#7B61FF',
      dark: isDark ? '#3B39B3' : '#3B39B3'
    },
    background: {
      default: isDark ? '#1C1C1E' : '#F9FAFB',
      paper: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      secondary: isDark ? '#2C2C2E' : '#F3F4F6'
    },
    text: {
      primary: isDark ? '#F2F2F7' : '#1F2937',
      secondary: isDark ? '#AEAEB2' : '#6B7280',
      disabled: isDark ? '#636366' : '#9CA3AF'
    },
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    action: {
      hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
      active: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)'
    }
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h2: {
      fontWeight: 700,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h3: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h4: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h5: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h6: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    body1: {
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    body2: {
      color: isDark ? '#AEAEB2' : '#6B7280'
    }
  },
  shape: { 
    borderRadius: 16 
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
        }
      }
    }
  }
});

// Confetti component
const Confetti = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => onComplete(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="confetti">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

// 3D Chart Component removed - replaced with 2D charts

// ----- Results Card Component -----
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

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enhancedExplanation, setEnhancedExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setOptimizationProgress(0);
    setResults(null);
    setEnhancedExplanation(null);

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const requestData = {
        ...companyData,
        assumptions: {
          min_linkedin: assumptions.minLinkedin,
          max_google: assumptions.maxGoogle,
          prefer_social: assumptions.preferSocial,
          uncertainty_factor: assumptions.uncertaintyFactor
        }
      };

      const response = await axios.post('/optimize', requestData);

      clearInterval(progressInterval);
      setOptimizationProgress(100);

      setTimeout(() => {
        setResults(response.data);
        setOptimizationProgress(0);
      }, 300);

    } catch (err) {
      setError(err.response?.data?.detail || 'Error optimizing budget');
      setOptimizationProgress(0);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleOptimizeEnhanced = async () => {
    // Now just delegates to handleOptimize; confetti is handled in useEffect on results
    await handleOptimize();
  };

  const loadDemoCompany = (company) => {
    setSelectedCompany(company.name);
    setCompanyData(company);
    setResults(null);
    setEnhancedExplanation(null);

    // Auto-optimize for demo companies
    setTimeout(() => handleOptimize(), 500);
  };

  const getEnhancedExplanation = async () => {
    if (!results) return;

    setLoadingExplanation(true);
    try {
      const response = await axios.post('/explain-allocation', {
        company: companyData,
        allocation: {
          google: results.budget_breakdown.google / companyData.budget,
          meta: results.budget_breakdown.meta / companyData.budget,
          tiktok: results.budget_breakdown.tiktok / companyData.budget,
          linkedin: results.budget_breakdown.linkedin / companyData.budget
        }
      });
      setEnhancedExplanation(response.data.explanation);
    } catch (err) {
      console.error('Error getting enhanced explanation:', err);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  // Memoized pie data to avoid recompute inside render
  const pieData = useMemo(() => {
    if (!results) return [];
    
    const totalBudget = Object.values(results.budget_breakdown).reduce((sum, value) => sum + value, 0);
    
    return [
      { 
        name: 'Google', 
        value: results.budget_breakdown.google, 
        color: PLATFORM_COLORS.google,
        percentage: ((results.budget_breakdown.google / totalBudget) * 100).toFixed(1)
      },
      { 
        name: 'Meta', 
        value: results.budget_breakdown.meta, 
        color: PLATFORM_COLORS.meta,
        percentage: ((results.budget_breakdown.meta / totalBudget) * 100).toFixed(1)
      },
      { 
        name: 'TikTok', 
        value: results.budget_breakdown.tiktok, 
        color: PLATFORM_COLORS.tiktok,
        percentage: ((results.budget_breakdown.tiktok / totalBudget) * 100).toFixed(1)
      },
      { 
        name: 'LinkedIn', 
        value: results.budget_breakdown.linkedin, 
        color: PLATFORM_COLORS.linkedin,
        percentage: ((results.budget_breakdown.linkedin / totalBudget) * 100).toFixed(1)
      }
    ];
  }, [results]);

  const barData = useMemo(() => {
    if (!results) return [];
    return Object.entries(results.platform_results).map(([platform, data]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      budget: data.budget,
      expectedLeads: data.expected_leads.p50,
      minLeads: data.expected_leads.p10,
      maxLeads: data.expected_leads.p90,
      percentage: data.percentage
    }));
  }, [results]);

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
                    LeoAds.ai Hackathon
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
                  LeoAds.ai Hackathon
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
            <Fade in={true} timeout={800} addEndListener={() => {}}>
              <Hero darkMode={darkMode} onOptimize={handleOptimizeEnhanced} loading={loading} companyData={companyData} />
            </Fade>
          ) : (
            <Hero darkMode={darkMode} onOptimize={handleOptimizeEnhanced} loading={loading} companyData={companyData} />
          )}

          <Grid container spacing={6}>
            {/* Input Panel */}
            <Grid item xs={12} md={4}>
              {!isFirstLoad ? (
                <Fade in={true} timeout={1200} addEndListener={() => {}}>
                  <Paper className="apple-card" sx={{ height: 'fit-content' }}>
                  <Box className="section-header">
                    <Box className="section-icon">
                      <SparkleIcon fontSize="small" />
                    </Box>
                  </Box>

                  {/* Demo Companies */}
                  <Box mb={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                      Quick Start Examples:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1.5} mb={2}>
                      {DEMO_COMPANIES.slice(0, 6).map((company) => (
                        <Chip
                          key={company.name}
                          label={`${company.name} ($${company.budget/1000}K)`}
                          onClick={() => loadDemoCompany(company)}
                          variant={selectedCompany === company.name ? "filled" : "outlined"}
                          size="small"
                          className="interactive-element"
                          sx={{
                            background: selectedCompany === company.name ?
                              'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : undefined,
                            color: selectedCompany === company.name ? 'white' : undefined,
                            '&:hover': {
                              background: selectedCompany === company.name ?
                                'linear-gradient(135deg, #5b21b6 0%, #4338ca 100%)' : undefined
                            }
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      💡 Click any example to auto-fill and optimize
                    </Typography>
                  </Box>

                  {/* Budget Range Helper */}
                  <Box mb={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                      Budget Range Guide:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                      {BUDGET_RANGES.map((range) => (
                        <Chip
                          key={range.label}
                          label={range.label}
                          onClick={() => setCompanyData({ ...companyData, budget: range.min })}
                          variant="outlined"
                          size="small"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Monthly Budget ($)"
                        type="number"
                        value={companyData.budget}
                        onChange={(e) => {
                          const v = e.target.value;
                          const num = Number(v);
                          setCompanyData({ ...companyData, budget: Number.isFinite(num) ? Math.max(0, num) : 0 });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Primary Goal</InputLabel>
                        <Select
                          value={companyData.goal}
                          label="Primary Goal"
                          onChange={(e) => setCompanyData({ ...companyData, goal: e.target.value })}
                        >
                          <MenuItem value="awareness">Brand Awareness</MenuItem>
                          <MenuItem value="leads">Lead Generation</MenuItem>
                          <MenuItem value="demos">Demo Requests</MenuItem>
                          <MenuItem value="sales">Direct Sales</MenuItem>
                          <MenuItem value="revenue">Revenue Growth</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Industry</InputLabel>
                        <Select
                          value={companyData.industry}
                          label="Industry"
                          onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                        >
                          <MenuItem value="default">General</MenuItem>
                          <MenuItem value="b2b_saas">B2B SaaS</MenuItem>
                          <MenuItem value="ecommerce">E-commerce</MenuItem>
                          <MenuItem value="healthcare">Healthcare</MenuItem>
                          <MenuItem value="finance">Finance</MenuItem>
                          <MenuItem value="education">Education</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Advanced Mode Toggle */}
                  <Box sx={{ mt: 4, mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showAdvanced}
                          onChange={(e) => setShowAdvanced(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <TuneIcon fontSize="small" />
                          <Typography variant="body2">Advanced Controls</Typography>
                        </Box>
                      }
                    />
                  </Box>

                  {/* Assumptions Panel */}
                  <Fade in={showAdvanced} addEndListener={() => {}}>
                    <Accordion expanded={showAdvanced} sx={{ mt: 2 }} className="assumptions-panel">
                      <AccordionSummary>
                        <Typography variant="subtitle2">Fine-tune Optimization Parameters</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  Minimum LinkedIn Allocation: {assumptions.minLinkedin}%
                                </Typography>
                                <MuiTooltip title="Set minimum percentage for LinkedIn to ensure B2B presence">
                                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                                </MuiTooltip>
                              </Box>
                              <Slider
                                value={assumptions.minLinkedin}
                                onChange={(e, value) => setAssumptions({ ...assumptions, minLinkedin: value })}
                                min={0}
                                max={50}
                                step={5}
                                marks={[
                                  { value: 0, label: '0%' },
                                  { value: 25, label: '25%' },
                                  { value: 50, label: '50%' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  Maximum Google Allocation: {assumptions.maxGoogle}%
                                </Typography>
                                <MuiTooltip title="Cap Google spend to ensure channel diversification">
                                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                                </MuiTooltip>
                              </Box>
                              <Slider
                                value={assumptions.maxGoogle}
                                onChange={(e, value) => setAssumptions({ ...assumptions, maxGoogle: value })}
                                min={20}
                                max={80}
                                step={5}
                                marks={[
                                  { value: 20, label: '20%' },
                                  { value: 50, label: '50%' },
                                  { value: 80, label: '80%' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  Uncertainty Factor: {assumptions.uncertaintyFactor}x
                                </Typography>
                                <MuiTooltip title="Adjust confidence interval width - higher values show more uncertainty">
                                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                                </MuiTooltip>
                              </Box>
                              <Slider
                                value={assumptions.uncertaintyFactor}
                                onChange={(e, value) => setAssumptions({ ...assumptions, uncertaintyFactor: value })}
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                marks={[
                                  { value: 0.5, label: 'Confident' },
                                  { value: 1.0, label: 'Balanced' },
                                  { value: 2.0, label: 'Conservative' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 2 }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={assumptions.preferSocial}
                                    onChange={(e) => setAssumptions({ ...assumptions, preferSocial: e.target.checked })}
                                    color="primary"
                                    sx={{ mr: 2 }}
                                  />
                                }
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                                      Prefer Social Platforms
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Ensures Meta + TikTok get at least 40% combined allocation
                                    </Typography>
                                  </Box>
                                }
                                sx={{ 
                                  alignItems: 'flex-start',
                                  margin: 0,
                                  width: '100%'
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Fade>

                  <Box sx={{ mt: 3 }}>
                    {loading && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={optimizationProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                              borderRadius: 4
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {optimizationProgress < 30 ? 'Analyzing company profile...' :
                            optimizationProgress < 60 ? 'Running Monte Carlo simulation...' :
                              optimizationProgress < 90 ? 'Applying constraints & goals...' :
                                'Finalizing allocation...'}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleOptimizeEnhanced}
                      disabled={loading || !companyData.name || companyData.budget <= 0}
                      startIcon={loading ? null : <RocketLaunchIcon />}
                      sx={{ fontSize: '1.1rem', fontWeight: 600, padding: '16px 32px' }}
                      className="interactive-element"
                    >
                      {loading ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <div className="loading-pulse">🧠</div>
                          <span>Optimizing your ad magic...</span>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                          <SparkleIcon fontSize="small" />
                        </Box>
                      )}
                    </Button>
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Paper>
                </Fade>
              ) : (
                <Paper className="apple-card" sx={{ height: 'fit-content' }}>
                  <Box className="section-header">
                    <Box className="section-icon">
                      <SparkleIcon fontSize="small" />
                    </Box>
                  </Box>

                  {/* Demo Companies */}
                  <Box mb={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                      Quick Start Examples:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1.5} mb={2}>
                      {DEMO_COMPANIES.slice(0, 6).map((company) => (
                        <Chip
                          key={company.name}
                          label={`${company.name} ($${company.budget/1000}K)`}
                          onClick={() => loadDemoCompany(company)}
                          variant={selectedCompany === company.name ? "filled" : "outlined"}
                          size="small"
                          className="interactive-element"
                          sx={{
                            background: selectedCompany === company.name ?
                              'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : undefined,
                            color: selectedCompany === company.name ? 'white' : undefined,
                            '&:hover': {
                              background: selectedCompany === company.name ?
                                'linear-gradient(135deg, #5b21b6 0%, #4338ca 100%)' : undefined
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Company Input Form */}
                  <Box mb={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                      Company Details:
                    </Typography>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      sx={{ mb: 2 }}
                      className="interactive-element"
                    />
                    <TextField
                      fullWidth
                      label="Monthly Budget ($)"
                      type="number"
                      value={companyData.budget}
                      onChange={(e) => setCompanyData({ ...companyData, budget: Number(e.target.value) })}
                      sx={{ mb: 2 }}
                      className="interactive-element"
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Primary Goal</InputLabel>
                      <Select
                        value={companyData.goal}
                        onChange={(e) => setCompanyData({ ...companyData, goal: e.target.value })}
                        label="Primary Goal"
                        className="interactive-element"
                      >
                        <MenuItem value="leads">Generate Leads</MenuItem>
                        <MenuItem value="brand">Brand Awareness</MenuItem>
                        <MenuItem value="sales">Direct Sales</MenuItem>
                        <MenuItem value="engagement">Social Engagement</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={companyData.industry}
                        onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                        label="Industry"
                        className="interactive-element"
                      >
                        <MenuItem value="default">General</MenuItem>
                        <MenuItem value="saas">SaaS/Tech</MenuItem>
                        <MenuItem value="ecommerce">E-commerce</MenuItem>
                        <MenuItem value="b2b">B2B Services</MenuItem>
                        <MenuItem value="healthcare">Healthcare</MenuItem>
                        <MenuItem value="finance">Finance</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Advanced Controls Toggle */}
                  <Box mb={4}>
                    <Accordion 
                      expanded={showAdvanced} 
                      onChange={() => setShowAdvanced(!showAdvanced)}
                      sx={{ 
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.05)'
                          }
                        }}
                      >
                        <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TuneIcon fontSize="small" />
                          <Typography variant="body2">Advanced Controls</Typography>
                        </Box>
                      </AccordionSummary>
                    </Accordion>
                  </Box>

                  {/* Assumptions Panel */}
                  <Fade in={showAdvanced} addEndListener={() => {}}>
                    <Accordion expanded={showAdvanced} sx={{ mt: 2 }} className="assumptions-panel">
                      <AccordionSummary>
                        <Typography variant="subtitle2">Fine-tune Optimization Parameters</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  Minimum LinkedIn Allocation: {assumptions.minLinkedin}%
                                </Typography>
                                <MuiTooltip title="Set minimum percentage for LinkedIn to ensure B2B presence">
                                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                                </MuiTooltip>
                              </Box>
                              <Slider
                                value={assumptions.minLinkedin}
                                onChange={(e, value) => setAssumptions({ ...assumptions, minLinkedin: value })}
                                min={0}
                                max={50}
                                step={5}
                                marks={[
                                  { value: 0, label: '0%' },
                                  { value: 25, label: '25%' },
                                  { value: 50, label: '50%' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  Maximum Google Allocation: {assumptions.maxGoogle}%
                                </Typography>
                                <MuiTooltip title="Cap Google spend to ensure channel diversification">
                                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                                </MuiTooltip>
                              </Box>
                              <Slider
                                value={assumptions.maxGoogle}
                                onChange={(e, value) => setAssumptions({ ...assumptions, maxGoogle: value })}
                                min={20}
                                max={80}
                                step={5}
                                marks={[
                                  { value: 20, label: '20%' },
                                  { value: 50, label: '50%' },
                                  { value: 80, label: '80%' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  Uncertainty Factor: {assumptions.uncertaintyFactor}x
                                </Typography>
                                <MuiTooltip title="Adjust confidence interval width - higher values show more uncertainty">
                                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                                </MuiTooltip>
                              </Box>
                              <Slider
                                value={assumptions.uncertaintyFactor}
                                onChange={(e, value) => setAssumptions({ ...assumptions, uncertaintyFactor: value })}
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                marks={[
                                  { value: 0.5, label: 'Confident' },
                                  { value: 1.0, label: 'Balanced' },
                                  { value: 2.0, label: 'Conservative' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12} className="assumption-control">
                            <Box sx={{ mb: 2 }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={assumptions.preferSocial}
                                    onChange={(e) => setAssumptions({ ...assumptions, preferSocial: e.target.checked })}
                                    color="primary"
                                    sx={{ mr: 2 }}
                                  />
                                }
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                                      Prefer Social Platforms
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Ensures Meta + TikTok get at least 40% combined allocation
                                    </Typography>
                                  </Box>
                                }
                                sx={{ 
                                  alignItems: 'flex-start',
                                  margin: 0,
                                  width: '100%'
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Fade>

                  <Box sx={{ mt: 3 }}>
                    {loading && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={optimizationProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                              borderRadius: 4
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {optimizationProgress < 30 ? 'Analyzing company profile...' :
                            optimizationProgress < 60 ? 'Running Monte Carlo simulation...' :
                              optimizationProgress < 90 ? 'Applying constraints & goals...' :
                                'Finalizing allocation...'}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleOptimizeEnhanced}
                      disabled={loading || !companyData.name || companyData.budget <= 0}
                      startIcon={loading ? null : <RocketLaunchIcon />}
                      sx={{ fontSize: '1.1rem', fontWeight: 600, padding: '16px 32px' }}
                      className="interactive-element"
                    >
                      {loading ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <div className="loading-pulse">🧠</div>
                          <span>Optimizing your ad magic...</span>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                          <SparkleIcon fontSize="small" />
                        </Box>
                      )}
                    </Button>
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Paper>
              )}
            </Grid>

            {/* Results Panel */}
            <Grid item xs={12} md={8} sx={{ mt: 2 }}>
              {results ? (
                <Slide direction="left" in={!!results} timeout={800}>
                  <Grid container spacing={6}>
                    {/* Budget Breakdown with 3D Chart */}
                    <Grid item xs={12} md={12}>
                      <Zoom in={!!results} timeout={1000}>
                        <ResultsCard darkMode={darkMode} title="Smart Budget Allocation" icon={<TrendingUpIcon fontSize="small" />}>
                          <Typography variant="body2" sx={{ 
                            color: 'text.secondary', 
                            mt: 1,
                            fontFamily: 'var(--font-body)',
                            mb: 3
                          }}>
                            Total Budget: {formatCurrency(companyData.budget)}/month
                          </Typography>
                          
                          {/* 3D Chart removed - using 2D chart below */}
                          
                          {/* Traditional 2D Chart as fallback */}
                          <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  innerRadius={30}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, value, percentage }) => 
                                    `${name}\n${formatCurrency(value)}\n(${percentage}%)`
                                  }
                                  labelLine={{ stroke: '#666', strokeWidth: 2 }}
                                  paddingAngle={2}
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={entry.color}
                                      stroke={darkMode ? 'rgba(255, 255, 255, 0.8)' : '#fff'}
                                      strokeWidth={2}
                                    />
                                  ))}
                                </Pie>
                                <RechartsTooltip 
                                  formatter={(value, name) => [formatCurrency(value), name]}
                                  labelStyle={{ fontWeight: 'bold' }}
                                  contentStyle={{
                                    backgroundColor: darkMode ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : '#ccc'}`,
                                    borderRadius: '8px',
                                    boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                                    color: darkMode ? 'white' : 'black'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        </ResultsCard>
                      </Zoom>
                    </Grid>

                    {/* Expected Leads with Uncertainty */}
                    <Grid item xs={12} md={12}>
                      <Zoom in={!!results} timeout={1200}>
                        <Card className="apple-card">
                          <CardContent sx={{ p: 4 }}>
                                                          <Box className="section-header" sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 2, color: 'primary.main' }}>
                                  Performance Forecast
                                </Typography>
                                <Typography variant="body2" sx={{
                                  color: 'text.secondary', 
                                  mt: 1,
                                  fontFamily: 'var(--font-body)'
                                }}>
                                  Expected leads with confidence ranges (P10, P50, P90)
                                </Typography>
                              </Box>
                            <Box sx={{ mt: 3, mb: 3 }}>
                              <ResponsiveContainer width="100%" height={400}>
                                <BarChart 
                                  data={barData}
                                  margin={{ top: 30, right: 40, left: 30, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0'} />
                                  <XAxis 
                                    dataKey="platform" 
                                    tick={{ fontSize: 12, fontWeight: 600 }}
                                    axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.6)' : '#666', strokeWidth: 2 }}
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.6)' : '#666', strokeWidth: 2 }}
                                    label={{ 
                                      value: 'Expected Leads', 
                                      angle: -90, 
                                      position: 'insideLeft',
                                      style: { textAnchor: 'middle', fontSize: 14, fontWeight: 600 }
                                    }}
                                  />
                                  <RechartsTooltip
                                    formatter={(value, name) => {
                                      if (name === 'expectedLeads') return [`${Math.round(value)} leads`, 'Expected (P50)'];
                                      if (name === 'minLeads') return [`${Math.round(value)} leads`, 'Conservative (P10)'];
                                      if (name === 'maxLeads') return [`${Math.round(value)} leads`, 'Optimistic (P90)'];
                                      return [value, name];
                                    }}
                                    contentStyle={{
                                      backgroundColor: darkMode ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                      border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : '#ccc'}`,
                                      borderRadius: '8px',
                                      boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                                      color: darkMode ? 'white' : 'black'
                                    }}
                                  />
                                  <Legend 
                                    verticalAlign="top" 
                                    height={36}
                                    wrapperStyle={{ paddingBottom: 10 }}
                                  />
                                                       <Bar
                       dataKey="minLeads"
                       fill="url(#minGradient)"
                       name="Min (P10)"
                       radius={[6, 6, 0, 0]}
                       stroke={darkMode ? '#ff6b6b' : '#d32f2f'}
                       strokeWidth={1.5}
                     />
                     <Bar
                       dataKey="expectedLeads"
                       fill="url(#expectedGradient)"
                       name="Expected (P50)"
                       radius={[6, 6, 0, 0]}
                       stroke={darkMode ? '#4caf50' : '#2e7d32'}
                       strokeWidth={1.5}
                     />
                     <Bar
                       dataKey="maxLeads"
                       fill="url(#maxGradient)"
                       name="Max (P90)"
                       radius={[6, 6, 0, 0]}
                       stroke={darkMode ? '#66bb6a' : '#388e3c'}
                       strokeWidth={1.5}
                     />
                                  
                                  {/* Define gradients for 3D-like effect */}
                                  <defs>
                                    <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#ffcdd2" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#ef9a9a" stopOpacity={1} />
                                    </linearGradient>
                                    <linearGradient id="expectedGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#4caf50" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#388e3c" stopOpacity={1} />
                                    </linearGradient>
                                    <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#c8e6c9" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#81c784" stopOpacity={1} />
                                    </linearGradient>

                                  </defs>
                                </BarChart>
                              </ResponsiveContainer>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>

                    {/* Detailed Breakdown */}
                    <Grid item xs={12}>
                      <Card className="interactive-element">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Platform Breakdown & Confidence Ranges
                          </Typography>
                          <Grid container spacing={2}>
                            {Object.entries(results.platform_results).map(([platform, data], index) => (
                              <Grid item xs={12} sm={6} md={3} key={platform}>
                                <Grow in={true} timeout={600 + index * 200}>
                                  <Paper
                                    sx={{
                                      p: 2,
                                      bgcolor: `${PLATFORM_COLORS[platform]}08`,
                                      border: `2px solid ${PLATFORM_COLORS[platform]}20`,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 8px 25px ${PLATFORM_COLORS[platform]}30`,
                                        border: `2px solid ${PLATFORM_COLORS[platform]}40`
                                      }
                                    }}
                                    className="interactive-element"
                                  >
                                    <Typography variant="h6" sx={{ color: PLATFORM_COLORS[platform], fontWeight: 'bold' }}>
                                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                                      Budget: {formatCurrency(data.budget)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {data.percentage.toFixed(1)}% of total budget
                                    </Typography>

                                    {/* Performance metrics */}
                                    <Box sx={{ mt: 2 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        Expected Leads: {Math.round(data.expected_leads.p50)}
                                      </Typography>

                                      {/* Confidence range visualization */}
                                      <Box sx={{ mt: 1, mb: 1 }}>
                                        <Box sx={{
                                          height: 6,
                                          backgroundColor: '#e5e7eb',
                                          borderRadius: 3,
                                          position: 'relative',
                                          overflow: 'hidden'
                                        }}>
                                          <Box sx={{
                                            position: 'absolute',
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: `linear-gradient(90deg, ${PLATFORM_COLORS[platform]}40 0%, ${PLATFORM_COLORS[platform]} 50%, ${PLATFORM_COLORS[platform]}40 100%)`,
                                            borderRadius: 3
                                          }} />
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            {data.expected_leads.p10 < 1 ? data.expected_leads.p10.toFixed(1) : Math.round(data.expected_leads.p10)}
                                          </Typography>
                                          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                                            {data.expected_leads.p50 < 1 ? data.expected_leads.p50.toFixed(1) : Math.round(data.expected_leads.p50)}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {data.expected_leads.p90 < 1 ? data.expected_leads.p90.toFixed(1) : Math.round(data.expected_leads.p90)}
                                          </Typography>
                                        </Box>
                                      </Box>

                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Cost/Lead: ${Math.round(data.cost_per_lead.p50)}
                                      </Typography>
                                    </Box>
                                  </Paper>
                                </Grow>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Total Summary with Confidence Visualization */}
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Total Expected Results
                          </Typography>
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={6}>
                              <Typography variant="h4" color="primary">
                                {Math.round(results.total_expected_leads.p50)} leads/month
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Confidence Range: {Math.round(results.total_expected_leads.p10)} - {Math.round(results.total_expected_leads.p90)} leads
                              </Typography>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption">Uncertainty Visualization:</Typography>
                                <Box sx={{
                                  background: 'linear-gradient(90deg, #ffcdd2 0%, #4caf50 50%, #c8e6c9 100%)',
                                  height: 20,
                                  borderRadius: 1,
                                  position: 'relative',
                                  mt: 1
                                }}>
                                  <Box sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '-5px',
                                    transform: 'translateX(-50%)',
                                    width: 2,
                                    height: 30,
                                    background: '#2196f3'
                                  }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                  <Typography variant="caption">Conservative</Typography>
                                  <Typography variant="caption">Expected</Typography>
                                  <Typography variant="caption">Optimistic</Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" gutterBottom>
                                <strong>Key Insights:</strong>
                              </Typography>
                              <Typography variant="body2">
                                • {((results.total_expected_leads.p90 - results.total_expected_leads.p10) / results.total_expected_leads.p50 * 100).toFixed(0)}% uncertainty range
                              </Typography>
                              <Typography variant="body2">
                                • Average cost per lead: ${Math.round(companyData.budget / results.total_expected_leads.p50)}
                              </Typography>
                              <Typography variant="body2">
                                • Top platform: {
                                  Object.entries(results.platform_results)
                                    .reduce((a, b) => a[1].budget > b[1].budget ? a : b)[0]
                                    .replace(/^\w/, c => c.toUpperCase())
                                } ({
                                  Math.round(
                                    Object.entries(results.platform_results)
                                      .reduce((a, b) => a[1].budget > b[1].budget ? a : b)[1].percentage
                                  )
                                }%)
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Reasoning */}
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box className="section-icon" sx={{ fontSize: '1.2rem' }}>
                              🧠
                            </Box>
                            AI Reasoning & Sources
                          </Typography>
                          
                          {/* Main Reasoning Display */}
                          <Box sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(99, 102, 241, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            mb: 3
                          }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ 
                              color: 'primary.main', 
                              fontWeight: 600,
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              📊 Core Allocation Logic
                            </Typography>
                            
                            {/* Parse and display reasoning in structured format */}
                            {(() => {
                              const reasoningText = results.reasoning || '';
                              const lines = reasoningText.split('\n').filter(line => line.trim());
                              
                              return (
                                <Box>
                                  {lines.map((line, index) => {
                                    if (line.includes(':')) {
                                      const [platform, details] = line.split(':');
                                      const isPlatform = ['Google', 'Meta', 'TikTok', 'LinkedIn'].some(p => 
                                        platform.trim().includes(p)
                                      );
                                      
                                      if (isPlatform) {
                                        return (
                                          <Box key={index} sx={{ 
                                            mb: 2, 
                                            p: 2, 
                                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white', 
                                            borderRadius: 1.5,
                                            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)'}`,
                                            boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)'
                                          }}>
                                            <Typography variant="subtitle2" sx={{ 
                                              fontWeight: 600, 
                                              color: 'primary.main',
                                              mb: 1,
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 1
                                            }}>
                                              {platform.trim()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                              {details.trim()}
                                            </Typography>
                                          </Box>
                                        );
                                      }
                                    }
                                    
                                    // Regular text lines - use markdown parser for bold text
                                    return (
                                      <Box key={index} sx={{ mb: 1 }}>
                                        <ReactMarkdown
                                          components={{
                                            p: ({children}) => (
                                              <Typography variant="body2" sx={{ 
                                                color: 'text.primary',
                                                lineHeight: 1.6
                                              }}>
                                                {children}
                                              </Typography>
                                            ),
                                            strong: ({children}) => (
                                              <Typography component="span" sx={{ 
                                                fontWeight: 700,
                                                color: 'text.primary'
                                              }}>
                                                {children}
                                              </Typography>
                                            )
                                          }}
                                        >
                                          {line}
                                        </ReactMarkdown>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              );
                            })()}
                          </Box>

                          {/* Enhanced AI Explanation */}
                          {enhancedExplanation && (
                            <Box sx={{ 
                              mt: 3, 
                              p: 3, 
                              bgcolor: 'rgba(34, 197, 94, 0.05)', 
                              borderRadius: 2,
                              border: '1px solid rgba(34, 197, 94, 0.1)'
                            }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ 
                                color: 'success.main', 
                                fontWeight: 600,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                🤖 Enhanced AI Analysis
                              </Typography>
                              
                              {/* Parse enhanced explanation for better formatting */}
                              {(() => {
                                const enhancedText = enhancedExplanation;
                                const sentences = enhancedText.split('. ').filter(s => s.trim());
                                
                                return (
                                  <Box>
                                    {sentences.map((sentence, index) => (
                                      <Box key={index} sx={{ 
                                        mb: 2, 
                                        p: 2, 
                                        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white', 
                                        borderRadius: 1,
                                        border: '1px solid rgba(34, 197, 94, 0.1)'
                                      }}>
                                        <Box sx={{ 
                                          color: 'text.primary',
                                          lineHeight: 1.6,
                                          display: 'flex',
                                          alignItems: 'flex-start',
                                          gap: 1
                                        }}>
                                          <Box sx={{ 
                                            color: 'success.main', 
                                            fontSize: '0.8rem',
                                            mt: 0.2
                                          }}>
                                            •
                                          </Box>
                                          <ReactMarkdown
                                            components={{
                                              p: ({children}) => (
                                                <Typography variant="body2" sx={{ 
                                                  color: 'text.primary',
                                                  lineHeight: 1.6
                                                }}>
                                                  {children}
                                                </Typography>
                                              ),
                                              strong: ({children}) => (
                                                <Typography component="span" sx={{ 
                                                  fontWeight: 700,
                                                  color: 'text.primary'
                                                }}>
                                                  {children}
                                                </Typography>
                                              )
                                            }}
                                          >
                                            {sentence.trim()}
                                          </ReactMarkdown>
                                        </Box>
                                      </Box>
                                    ))}
                                  </Box>
                                );
                              })()}
                            </Box>
                          )}

                          {/* Get Enhanced Explanation Button */}
                          <Box sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              onClick={getEnhancedExplanation}
                              disabled={loadingExplanation}
                              size="medium"
                              sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                  borderColor: 'primary.dark',
                                  bgcolor: 'rgba(99, 102, 241, 0.05)'
                                }
                              }}
                            >
                              {loadingExplanation ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <div className="loading-pulse">🔄</div>
                                  Getting AI Explanation...
                                </Box>
                              ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                  🚀 Get Enhanced AI Explanation
                                </Box>
                              )}
                            </Button>
                          </Box>

                          {/* Data Sources */}
                          <Box sx={{ 
                            mt: 3, 
                            p: 3, 
                            bgcolor: 'rgba(168, 85, 247, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(168, 85, 247, 0.1)'
                          }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ 
                              color: 'secondary.main', 
                              fontWeight: 600,
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              📚 Research Sources & Citations
                            </Typography>
                            
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {(results.sources || []).map((s, i) => {
                                if (typeof s === 'string') {
                                  return (
                                    <Chip 
                                      key={i} 
                                      label={s} 
                                      variant="outlined" 
                                      size="small" 
                                      sx={{ 
                                        mr: 1, 
                                        mb: 1,
                                        borderColor: 'secondary.main',
                                        color: 'secondary.main',
                                        '&:hover': {
                                          bgcolor: 'rgba(168, 85, 247, 0.1)'
                                        }
                                      }} 
                                    />
                                  );
                                }
                                // Expect { title, url }
                                return (
                                  <Chip
                                    key={i}
                                    component="a"
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    label={s.title || s.url}
                                    clickable
                                    variant="outlined"
                                    size="small"
                                    sx={{ 
                                      mr: 1, 
                                      mb: 1,
                                      borderColor: 'secondary.main',
                                      color: 'secondary.main',
                                      '&:hover': {
                                        bgcolor: 'rgba(168, 85, 247, 0.1)'
                                      }
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Slide>
              ) : (
                <Fade in={!results && !loading} timeout={600} addEndListener={() => {}}>
                  <Paper className="apple-card" sx={{
                    p: 6,
                    textAlign: 'center',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed var(--glass-border)'
                  }}>
                    <Box>
                      <Zoom in={!results && !loading} timeout={800}>
                        <Box sx={{ mb: 3, fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                          🎯
                        </Box>
                      </Zoom>
                      <Typography variant="h4" sx={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-purple) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 2
                      }}>
                        Ready to optimize?
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
                        Enter your company details and experience the magic of AI-powered budget allocation
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Chip
                          icon={<SparkleIcon />}
                          label="Try demo companies"
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<CelebrationIcon />}
                          label="Get instant results"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              )}
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
              Built with ❤️ for LeoAds.ai Hackathon
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
