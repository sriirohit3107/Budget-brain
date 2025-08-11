#!/usr/bin/env python3
"""
Integration Example: Adding Deep Learning to Budget Brain
Shows how to enhance your existing system with ML capabilities
"""

from ml_enhancements import NeuralBudgetOptimizer, EnsembleOptimizer
import numpy as np

class EnhancedBudgetOptimizer:
    """Enhanced version of your Budget Optimizer with ML capabilities"""
    
    def __init__(self):
        # Keep your existing components
        self.gemini_service = None  # Your existing Gemini service
        
        # Add ML components
        self.neural_optimizer = NeuralBudgetOptimizer()
        self.ensemble_optimizer = EnsembleOptimizer()
        self.ml_trained = False
        
        # Hybrid approach weights
        self.approach_weights = {
            'rule_based': 0.4,      # Your existing grid search
            'neural_net': 0.3,      # Deep learning
            'ensemble': 0.3         # Ensemble method
        }
    
    def initialize_ml_models(self):
        """Initialize and train ML models (run once on startup)"""
        if not self.ml_trained:
            print("🧠 Initializing deep learning models...")
            
            # Train neural network (fast with synthetic data)
            self.neural_optimizer.train()
            
            # Train ensemble
            self.ensemble_optimizer.train()
            
            self.ml_trained = True
            print("✅ ML models ready!")
    
    def optimize_allocation_hybrid(self, company_data):
        """Hybrid optimization combining your existing logic + ML"""
        
        # Method 1: Your existing rule-based + Monte Carlo (keep this!)
        rule_based_result = self.your_existing_optimization(company_data)
        
        # Method 2: Neural network prediction
        if self.ml_trained:
            nn_result = self.neural_optimizer.predict_allocation(company_data)
        else:
            nn_result = rule_based_result  # Fallback
        
        # Method 3: Ensemble prediction
        if self.ml_trained:
            ensemble_result = self.ensemble_optimizer.predict(company_data)
        else:
            ensemble_result = rule_based_result  # Fallback
        
        # Combine predictions with weighted average
        final_allocation = self._combine_predictions(
            rule_based_result, nn_result, ensemble_result
        )
        
        # Still use your Monte Carlo for uncertainty
        uncertainty_ranges = self.calculate_uncertainty_with_ml(
            final_allocation, company_data
        )
        
        return {
            'allocation': final_allocation,
            'uncertainty': uncertainty_ranges,
            'ml_confidence': ensemble_result.get('confidence', 0.8),
            'reasoning': self.generate_ml_enhanced_reasoning(
                rule_based_result, nn_result, ensemble_result
            )
        }
    
    def _combine_predictions(self, rule_based, neural_net, ensemble):
        """Intelligently combine multiple prediction methods"""
        platforms = ['google', 'meta', 'tiktok', 'linkedin']
        
        combined = {}
        for platform in platforms:
            # Weighted combination
            combined[platform] = (
                self.approach_weights['rule_based'] * rule_based.get(platform, 0.25) +
                self.approach_weights['neural_net'] * neural_net.get(platform, 0.25) +
                self.approach_weights['ensemble'] * ensemble.get(platform, 0.25)
            )
        
        # Normalize to sum to 100%
        total = sum(combined.values())
        return {k: v/total for k, v in combined.items()}
    
    def calculate_uncertainty_with_ml(self, allocation, company_data):
        """Enhanced uncertainty calculation using ML variance"""
        
        # Your existing Monte Carlo (keep this!)
        base_uncertainty = self.your_existing_monte_carlo(allocation, company_data)
        
        # Add ML-based uncertainty
        ml_variance = self._calculate_ml_variance(allocation, company_data)
        
        # Combine uncertainties
        enhanced_uncertainty = {}
        for platform in allocation.keys():
            base_range = base_uncertainty.get(platform, {})
            ml_adjustment = ml_variance.get(platform, 1.0)
            
            enhanced_uncertainty[platform] = {
                'p10': base_range.get('p10', 0) * (1 - ml_adjustment * 0.1),
                'p50': base_range.get('p50', 0),
                'p90': base_range.get('p90', 0) * (1 + ml_adjustment * 0.1)
            }
        
        return enhanced_uncertainty
    
    def _calculate_ml_variance(self, allocation, company_data):
        """Calculate ML-based prediction variance"""
        # Run multiple predictions with noise to estimate uncertainty
        variances = {}
        
        for platform in allocation.keys():
            predictions = []
            
            # Add noise to input features and re-predict
            for _ in range(100):
                noisy_data = company_data.copy()
                noisy_data['budget'] *= np.random.normal(1.0, 0.05)  # 5% budget noise
                
                if self.ml_trained:
                    pred = self.neural_optimizer.predict_allocation(noisy_data)
                    predictions.append(pred.get(platform, 0.25))
            
            # Calculate variance
            if predictions:
                variances[platform] = np.var(predictions)
            else:
                variances[platform] = 0.1  # Default uncertainty
        
        return variances
    
    def generate_ml_enhanced_reasoning(self, rule_based, neural_net, ensemble):
        """Generate reasoning that explains ML + rule-based decision"""
        
        reasoning = "🧠 **AI-Enhanced Allocation Analysis**\n\n"
        
        # Compare methods
        reasoning += "**Method Comparison:**\n"
        reasoning += f"• Rule-based system: {self._format_allocation(rule_based)}\n"
        reasoning += f"• Neural network: {self._format_allocation(neural_net)}\n"
        reasoning += f"• Ensemble model: {self._format_allocation(ensemble)}\n\n"
        
        # Confidence assessment
        confidence = ensemble.get('confidence', 0.8)
        reasoning += f"**ML Confidence**: {confidence:.1%}\n"
        
        if confidence > 0.9:
            reasoning += "High confidence - all models agree on allocation strategy.\n"
        elif confidence > 0.7:
            reasoning += "Moderate confidence - some variation between models.\n"
        else:
            reasoning += "Lower confidence - significant model disagreement suggests market uncertainty.\n"
        
        return reasoning
    
    def _format_allocation(self, allocation):
        """Format allocation for display"""
        if not allocation:
            return "N/A"
        
        return ", ".join([
            f"{platform.capitalize()}: {allocation.get(platform, 0):.1%}"
            for platform in ['google', 'meta', 'tiktok', 'linkedin']
        ])
    
    # Placeholder methods for your existing logic
    def your_existing_optimization(self, company_data):
        """Your existing grid search + Monte Carlo optimization"""
        # This would be your current optimize_allocation method
        return {
            'google': 0.4, 'meta': 0.25, 'tiktok': 0.15, 'linkedin': 0.2
        }
    
    def your_existing_monte_carlo(self, allocation, company_data):
        """Your existing Monte Carlo uncertainty calculation"""
        # This would be your current uncertainty calculation
        return {
            platform: {'p10': alloc * 0.8, 'p50': alloc, 'p90': alloc * 1.2}
            for platform, alloc in allocation.items()
        }


# Example API endpoint enhancement
def enhanced_optimize_endpoint(company_data):
    """Enhanced version of your /optimize endpoint"""
    
    optimizer = EnhancedBudgetOptimizer()
    
    # Initialize ML models if needed (cache this in production)
    optimizer.initialize_ml_models()
    
    # Get hybrid prediction
    result = optimizer.optimize_allocation_hybrid(company_data)
    
    return {
        'budget_breakdown': result['allocation'],
        'uncertainty_ranges': result['uncertainty'],
        'ml_confidence': result['ml_confidence'],
        'reasoning': result['reasoning'],
        'enhanced_with_ml': True,
        'model_versions': {
            'neural_network': 'v1.0',
            'ensemble': 'v1.0',
            'rule_based': 'v1.0'
        }
    }


if __name__ == "__main__":
    # Demo the enhanced system
    test_company = {
        'name': 'TechFlow SaaS',
        'budget': 8000,
        'industry': 'b2b_saas', 
        'goal': 'leads'
    }
    
    print("🚀 Enhanced Budget Brain with Deep Learning")
    result = enhanced_optimize_endpoint(test_company)
    
    print(f"\n📊 Results for {test_company['name']}:")
    print(f"ML Confidence: {result['ml_confidence']:.1%}")
    print(f"Allocation: {result['budget_breakdown']}")
    print(f"Enhanced with ML: {result['enhanced_with_ml']}")
