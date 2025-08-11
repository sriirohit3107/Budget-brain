import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Chip,
  Alert,
  LinearProgress,
  Fade,
  Switch,
  FormControlLabel,
  Tooltip as MuiTooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoIcon from '@mui/icons-material/Info';

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

const InputPanel = ({
  companyData,
  setCompanyData,
  assumptions,
  setAssumptions,
  showAdvanced,
  setShowAdvanced,
  loading,
  optimizationProgress,
  error,
  onOptimize,
  selectedCompany,
  setSelectedCompany,
  isFirstLoad
}) => {
  const loadDemoCompany = (company) => {
    setSelectedCompany(company.name);
    setCompanyData(company);
  };

  return (
    <Paper className="apple-card" sx={{ height: 'fit-content' }}>
      <Box className="section-header">
        <Box className="section-icon">
          <AutoAwesomeIcon fontSize="small" />
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
      {showAdvanced && (
        <Fade in={showAdvanced} timeout={300}>
          <div>
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
           </div>
         </Fade>
       )}

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
          onClick={onOptimize}
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
              <AutoAwesomeIcon fontSize="small" />
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
  );
};

export default InputPanel;
