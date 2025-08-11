#!/usr/bin/env python3
"""
Budget Brain Demo Test Script
Tests all demo scenarios for hackathon presentation
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api_health():
    """Test if the API is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ API Health: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ API Health Failed: {e}")
        return False

def test_optimization(company_data, expected_platforms=None):
    """Test optimization endpoint with company data"""
    try:
        print(f"\n🧠 Testing: {company_data['name']} - ${company_data['budget']:,}/month")
        print(f"   Goal: {company_data['goal']}, Industry: {company_data['industry']}")
        
        response = requests.post(f"{BASE_URL}/optimize", json=company_data)
        result = response.json()
        
        print(f"   📊 Budget Breakdown:")
        for platform, amount in result['budget_breakdown'].items():
            percentage = (amount / company_data['budget']) * 100
            print(f"      {platform.title()}: ${amount:,.0f} ({percentage:.0f}%)")
        
        print(f"   🎯 Total Expected Leads: {result['total_expected_leads']['p50']:.0f}")
        print(f"   📈 Confidence Range: {result['total_expected_leads']['p10']:.0f} - {result['total_expected_leads']['p90']:.0f}")
        
        if expected_platforms:
            print(f"   ✅ Expected platforms: {', '.join(expected_platforms)}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Optimization Failed: {e}")
        return False

def test_client_examples():
    """Test client examples endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/client-examples")
        data = response.json()
        
        print(f"\n📋 Client Examples Available:")
        print(f"   Total Companies: {data['total_examples']}")
        print(f"   Industries: {', '.join(data['industries'])}")
        
        # Show a few examples
        for i, client in enumerate(data['clients'][:3]):
            print(f"   {i+1}. {client['name']}: ${client['budget']:,} - {client['goal']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Client Examples Failed: {e}")
        return False

def main():
    """Run all demo tests"""
    print("🧠 Budget Brain Demo Test Suite")
    print("=" * 50)
    
    # Test 1: API Health
    if not test_api_health():
        print("❌ Cannot proceed - API not running")
        return
    
    # Test 2: Client Examples
    test_client_examples()
    
    # Test 3: Demo Scenarios
    demo_scenarios = [
        {
            "name": "TechFlow SaaS",
            "budget": 8000,
            "goal": "demos",
            "industry": "b2b_saas"
        },
        {
            "name": "StyleCo Fashion", 
            "budget": 5000,
            "goal": "revenue",
            "industry": "ecommerce"
        },
        {
            "name": "HealthTech Pro",
            "budget": 10000,
            "goal": "leads", 
            "industry": "healthcare"
        },
        {
            "name": "StartupFlow",
            "budget": 3000,
            "goal": "leads",
            "industry": "b2b_saas"
        },
        {
            "name": "EnterpriseFlow",
            "budget": 50000,
            "goal": "sales",
            "industry": "b2b_saas"
        }
    ]
    
    print(f"\n🚀 Testing {len(demo_scenarios)} Demo Scenarios:")
    print("-" * 50)
    
    success_count = 0
    for scenario in demo_scenarios:
        if test_optimization(scenario):
            success_count += 1
        time.sleep(0.5)  # Small delay between requests
    
    print(f"\n📊 Test Results:")
    print(f"   ✅ Successful: {success_count}/{len(demo_scenarios)}")
    print(f"   ❌ Failed: {len(demo_scenarios) - success_count}/{len(demo_scenarios)}")
    
    if success_count == len(demo_scenarios):
        print("\n🎉 All tests passed! Ready for hackathon demo!")
    else:
        print(f"\n⚠️  {len(demo_scenarios) - success_count} tests failed. Check logs above.")

if __name__ == "__main__":
    main()
