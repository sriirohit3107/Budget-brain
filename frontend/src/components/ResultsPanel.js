import React, { useMemo } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Fade,
  Slide,
  Zoom,
  Grow
} from '@mui/material';
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReactMarkdown from 'react-markdown';
import ResultsCard from './ResultsCard';

const PLATFORM_COLORS = {
  google: "#4285F4",
  meta: "#1877F2",
  tiktok: "#FF0050",
  linkedin: "#0A66C2"
};

const ResultsPanel = ({
  results,
  companyData,
  darkMode,
  enhancedExplanation,
  loadingExplanation,
  onGetEnhancedExplanation
}) => {
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

  if (!results) {
    return (
      <Fade in={!results} timeout={600}>
        <div>
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
            <Zoom in={!results} timeout={800}>
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
                icon={<AutoAwesomeIcon />}
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
         </div>
       </Fade>
    );
  }

  return (
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
                  onClick={onGetEnhancedExplanation}
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
  );
};

export default ResultsPanel;
