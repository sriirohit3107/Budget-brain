import { useState, useCallback } from 'react';
import axios from 'axios';

export const useOptimization = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enhancedExplanation, setEnhancedExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const handleOptimize = useCallback(async (companyData, assumptions) => {
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
  }, []);

  const getEnhancedExplanation = useCallback(async (companyData, results) => {
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
  }, []);

  const resetResults = useCallback(() => {
    setResults(null);
    setEnhancedExplanation(null);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    enhancedExplanation,
    loadingExplanation,
    optimizationProgress,
    handleOptimize,
    getEnhancedExplanation,
    resetResults
  };
};
