#!/usr/bin/env python3
"""
Budget Brain System Test Suite
LeoAds.ai Hackathon - Validation Tests

Tests all core functionality to ensure demo readiness.
"""

import requests
import json
import time
import sys
from typing import Dict, Any

# Test configuration
API_BASE = "http://localhost:8000"
TEST_COMPANIES = [
    {
        "name": "TechFlow SaaS",
        "budget": 8000,
        "goal": "demos",
        "industry": "b2b_saas",
        "assumptions": {
            "min_linkedin": 15.0,
            "max_google": 60.0,
            "prefer_social": False,
            "uncertainty_factor": 1.0
        }
    },
    {
        "name": "StyleCo Fashion",
        "budget": 12000,
        "goal": "sales",
        "industry": "ecommerce",
        "assumptions": {
            "min_linkedin": 5.0,
            "max_google": 50.0,
            "prefer_social": True,
            "uncertainty_factor": 1.2
        }
    }
]

class BudgetBrainTester:
    
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []
    
    def test_api_health(self) -> bool:
        """Test if API is running and healthy"""
        print("🔍 Testing API Health...")
        try:
            response = requests.get(f"{API_BASE}/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if "Budget Brain API" in data.get("message", ""):
                    print("✅ API is healthy and running")
                    return True
            print(f"❌ API health check failed: {response.status_code}")
            return False
        except Exception as e:
            print(f"❌ API not accessible: {e}")
            return False
    
    def test_optimization_engine(self, company_data: Dict[str, Any]) -> bool:
        """Test the core optimization functionality"""
        print(f"🧠 Testing optimization for {company_data['name']}...")
        try:
            response = requests.post(
                f"{API_BASE}/optimize",
                json=company_data,
                timeout=30
            )
            
            if response.status_code != 200:
                print(f"❌ Optimization failed: {response.status_code}")
                return False
            
            result = response.json()
            
            # Validate response structure
            required_fields = [
                'budget_breakdown', 'platform_results', 
                'total_expected_leads', 'reasoning', 'sources'
            ]
            
            for field in required_fields:
                if field not in result:
                    print(f"❌ Missing field in response: {field}")
                    return False
            
            # Validate budget allocation sums to 100%
            breakdown = result['budget_breakdown']
            total_budget = sum([
                breakdown['google'], breakdown['meta'],
                breakdown['tiktok'], breakdown['linkedin']
            ])
            
            expected_budget = company_data['budget']
            if abs(total_budget - expected_budget) > 1:  # Allow $1 rounding error
                print(f"❌ Budget doesn't sum correctly: {total_budget} vs {expected_budget}")
                return False
            
            # Validate uncertainty ranges are sensible
            for platform, data in result['platform_results'].items():
                leads = data['expected_leads']
                if not (leads['p10'] <= leads['p50'] <= leads['p90']):
                    print(f"❌ Invalid confidence range for {platform}")
                    return False
            
            print(f"✅ Optimization successful for {company_data['name']}")
            print(f"   📊 Total expected leads: {result['total_expected_leads']['p50']:.0f}")
            print(f"   📈 Top platform: {max(breakdown.items(), key=lambda x: x[1])[0]}")
            
            return True
            
        except Exception as e:
            print(f"❌ Optimization test failed: {e}")
            return False
    
    def test_assumption_integration(self) -> bool:
        """Test that user assumptions actually affect results"""
        print("⚙️  Testing assumption integration...")
        
        base_company = TEST_COMPANIES[0].copy()
        
        # Test with default assumptions
        base_company['assumptions'] = {
            "min_linkedin": 10.0,
            "max_google": 60.0,
            "prefer_social": False,
            "uncertainty_factor": 1.0
        }
        
        try:
            response1 = requests.post(f"{API_BASE}/optimize", json=base_company, timeout=30)
            result1 = response1.json()
            
            # Test with modified assumptions
            modified_company = base_company.copy()
            modified_company['assumptions'] = {
                "min_linkedin": 25.0,  # Higher LinkedIn minimum
                "max_google": 40.0,   # Lower Google maximum
                "prefer_social": True,
                "uncertainty_factor": 1.5
            }
            
            response2 = requests.post(f"{API_BASE}/optimize", json=modified_company, timeout=30)
            result2 = response2.json()
            
            # Check that assumptions had an effect
            linkedin1 = result1['budget_breakdown']['linkedin']
            linkedin2 = result2['budget_breakdown']['linkedin']
            
            if linkedin2 <= linkedin1:
                print("❌ Assumption changes didn't affect LinkedIn allocation")
                return False
            
            google1 = result1['budget_breakdown']['google']
            google2 = result2['budget_breakdown']['google']
            
            if google2 >= google1:
                print("❌ Assumption changes didn't reduce Google allocation")
                return False
            
            print("✅ Assumptions successfully integrated")
            print(f"   📈 LinkedIn increased: ${linkedin1:.0f} → ${linkedin2:.0f}")
            print(f"   📉 Google decreased: ${google1:.0f} → ${google2:.0f}")
            
            return True
            
        except Exception as e:
            print(f"❌ Assumption integration test failed: {e}")
            return False
    
    def test_industry_variations(self) -> bool:
        """Test that different industries produce different allocations"""
        print("🏭 Testing industry-specific optimizations...")
        
        base_company = {
            "name": "Test Company",
            "budget": 10000,
            "goal": "leads"
        }
        
        industries = ["b2b_saas", "ecommerce", "healthcare", "finance"]
        results = {}
        
        try:
            for industry in industries:
                test_company = base_company.copy()
                test_company["industry"] = industry
                
                response = requests.post(f"{API_BASE}/optimize", json=test_company, timeout=30)
                result = response.json()
                results[industry] = result['budget_breakdown']
            
            # Check that results vary by industry
            all_same = True
            first_result = list(results.values())[0]
            
            for industry_result in list(results.values())[1:]:
                for platform in ['google', 'meta', 'tiktok', 'linkedin']:
                    if abs(first_result[platform] - industry_result[platform]) > 100:  # $100 difference
                        all_same = False
                        break
            
            if all_same:
                print("❌ Industry variations didn't produce different allocations")
                return False
            
            print("✅ Industry-specific optimization working")
            for industry, breakdown in results.items():
                top_platform = max(breakdown.items(), key=lambda x: x[1])
                print(f"   🏢 {industry}: Top platform is {top_platform[0]} ({top_platform[1]/10000*100:.1f}%)")
            
            return True
            
        except Exception as e:
            print(f"❌ Industry variation test failed: {e}")
            return False
    
    def test_enhanced_explanation(self) -> bool:
        """Test the Gemini-powered enhanced explanations"""
        print("🤖 Testing enhanced AI explanations...")
        
        try:
            company_data = TEST_COMPANIES[0]
            
            # First get an optimization
            response = requests.post(f"{API_BASE}/optimize", json=company_data, timeout=30)
            result = response.json()
            
            # Then test enhanced explanation
            explanation_data = {
                "company": company_data,
                "allocation": {
                    "google": result['budget_breakdown']['google'] / company_data['budget'],
                    "meta": result['budget_breakdown']['meta'] / company_data['budget'],
                    "tiktok": result['budget_breakdown']['tiktok'] / company_data['budget'],
                    "linkedin": result['budget_breakdown']['linkedin'] / company_data['budget']
                }
            }
            
            exp_response = requests.post(
                f"{API_BASE}/explain-allocation",
                json=explanation_data,
                timeout=30
            )
            
            if exp_response.status_code != 200:
                print(f"❌ Enhanced explanation failed: {exp_response.status_code}")
                return False
            
            explanation = exp_response.json()
            
            if not explanation.get('explanation'):
                print("❌ No explanation returned")
                return False
            
            print("✅ Enhanced explanation working")
            print(f"   💬 Sample: {explanation['explanation'][:100]}...")
            
            return True
            
        except Exception as e:
            print(f"❌ Enhanced explanation test failed: {e}")
            return False
    
    def test_benchmark_research(self) -> bool:
        """Test industry benchmark research endpoint"""
        print("📊 Testing benchmark research...")
        
        try:
            response = requests.post(f"{API_BASE}/research/b2b_saas", timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Benchmark research failed: {response.status_code}")
                return False
            
            data = response.json()
            
            required_fields = ['industry', 'benchmarks', 'enhanced', 'timestamp']
            for field in required_fields:
                if field not in data:
                    print(f"❌ Missing field in research response: {field}")
                    return False
            
            print("✅ Benchmark research working")
            print(f"   🔬 Industry: {data['industry']}")
            print(f"   📈 Enhanced: {data['enhanced']}")
            
            return True
            
        except Exception as e:
            print(f"❌ Benchmark research test failed: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run complete test suite"""
        print("🧪 Budget Brain - System Test Suite")
        print("=" * 50)
        
        tests = [
            ("API Health", self.test_api_health),
            ("Core Optimization", lambda: all(self.test_optimization_engine(company) for company in TEST_COMPANIES)),
            ("Assumption Integration", self.test_assumption_integration),
            ("Industry Variations", self.test_industry_variations),
            ("Enhanced Explanations", self.test_enhanced_explanation),
            ("Benchmark Research", self.test_benchmark_research)
        ]
        
        for test_name, test_func in tests:
            print(f"\n📋 Running: {test_name}")
            try:
                if test_func():
                    self.passed += 1
                    print(f"✅ {test_name} PASSED")
                else:
                    self.failed += 1
                    print(f"❌ {test_name} FAILED")
            except Exception as e:
                self.failed += 1
                print(f"❌ {test_name} FAILED with exception: {e}")
        
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.passed} passed, {self.failed} failed")
        
        if self.failed == 0:
            print("🎉 ALL TESTS PASSED - Budget Brain is demo ready!")
            return True
        else:
            print("⚠️  Some tests failed - check above for details")
            return False

def main():
    """Main test runner"""
    tester = BudgetBrainTester()
    
    print("🔍 Waiting for services to be ready...")
    time.sleep(2)
    
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
