# Budget Brain 🧠

AI-powered budget allocation system that decides how to split advertising budgets across Google, Meta, TikTok, and LinkedIn using structured reasoning, uncertainty modeling, and LLM intelligence .

## 🎯 **The Challenge**

Starting with a company and monthly ad budget, Budget Brain optimizes allocation across four platforms by combining:
- **Learned from Data**: Platform benchmarks (CPM, CTR, CVR) from real 2024 market data
- **World Knowledge**: LLM insights about industry behavior and audience patterns  
- **Structured Reasoning**: Mathematical optimization with business constraints

## 🏆 **Features Built (24Hours)**

### ✅ **Core Requirements Met**
- **Clear Inputs**: Company name, budget, goal, industry
- **Budget Breakdown**: Optimized allocation across Google/Meta/TikTok/LinkedIn
- **Uncertainty Modeling**: P10-P90 confidence intervals (not point estimates)
- **Human Control**: Adjustable assumptions and constraints
- **Source Citations**: Transparent data sources from Gemini research

### ✅ **Technical Architecture**
- **Backend**: FastAPI with Monte Carlo simulation engine
- **Frontend**: React with interactive visualizations
- **LLM Integration**: Gemini API for market intelligence gathering
- **Structured Logic**: Industry modifiers + goal optimization + constraint satisfaction

## 🎬 **Demo Scenarios & Expected Results**

### **Startup Scenarios ($2K-8K/month)**

#### **1. Early B2B SaaS - TechFlow SaaS**
```
Input: TechFlow SaaS, $8,000/month, demos, B2B SaaS
Expected Output: 
├── Google: ~40% ($3,200) - High-intent search
├── LinkedIn: ~25% ($2,000) - B2B decision makers  
├── Meta: ~25% ($2,000) - Targeted social
└── TikTok: ~10% ($800) - Brand awareness
Reasoning: B2B companies need search + professional networks
```

#### **2. Education App - EduLearn Online**
```
Input: EduLearn Online, $5,000/month, awareness, Education
Expected Output:
├── TikTok: ~30% ($1,500) - Young audience reach
├── Meta: ~30% ($1,500) - Parent targeting
├── Google: ~25% ($1,250) - Search discovery
└── LinkedIn: ~15% ($750) - Educator networks
Reasoning: Education needs broad reach across age groups
```

### **Growth Scenarios ($8K-25K/month)**

#### **3. E-commerce Fashion - StyleCo Fashion**
```
Input: StyleCo Fashion, $12,000/month, sales, E-commerce
Expected Output:
├── Meta: ~35% ($4,200) - Visual product showcase
├── TikTok: ~30% ($3,600) - Viral fashion content
├── Google: ~25% ($3,000) - Shopping search
└── LinkedIn: ~10% ($1,200) - Minimal B2B
Reasoning: Fashion thrives on visual social platforms
```

#### **4. HealthTech Platform - HealthTech Pro**
```
Input: HealthTech Pro, $15,000/month, leads, Healthcare
Expected Output:
├── Google: ~45% ($6,750) - Health search queries
├── LinkedIn: ~20% ($3,000) - Healthcare professionals
├── Meta: ~25% ($3,750) - Targeted patient reach
└── TikTok: ~10% ($1,500) - Health awareness
Reasoning: Healthcare requires trust + professional credibility
```

### **Enterprise Scenarios ($25K+/month)**

#### **5. FinTech Company - FinanceWise**
```
Input: FinanceWise, $25,000/month, demos, Finance
Expected Output:
├── Google: ~45% ($11,250) - Financial search intent
├── LinkedIn: ~30% ($7,500) - Professional investors
├── Meta: ~20% ($5,000) - Wealth-targeted ads
└── TikTok: ~5% ($1,250) - Minimal (finance + TikTok = risky)
Reasoning: Finance needs high-trust, professional channels
```

#### **6. Shopify ($25,000/month)**
```
Industry: B2B SaaS | Goal: Demos
Expected Platform Mix: Google-heavy with strong LinkedIn presence
Key Insight: E-commerce platform targets business owners
```

#### **7. Stripe ($30,000/month)**  
```
Industry: Finance | Goal: Leads
Expected Platform Mix: Search-dominant with professional targeting
Key Insight: Developer + business decision-maker audience
```

## 🧠 **The Intelligence Behind Budget Brain**

### **Layer 1: Platform Benchmarks**
Real 2024 market data:
- **Google**: $54 CPM, 1.4% CTR, 7.5% CVR (high-intent search)
- **Meta**: $10 CPM, 1.9% CTR, 6.7% CVR (social targeting)
- **TikTok**: $5 CPM, 3.1% CTR, 8.7% CVR (viral content)  
- **LinkedIn**: $69 CPM, 0.96% CTR, 5.1% CVR (B2B professionals)

### **Layer 2: Industry Intelligence**
```python
# B2B SaaS gets LinkedIn boost, TikTok penalty
b2b_modifiers = {"google": 1.2, "meta": 0.8, "tiktok": 0.6, "linkedin": 1.5}

# E-commerce gets social boost, LinkedIn penalty
ecom_modifiers = {"google": 1.1, "meta": 1.3, "tiktok": 1.4, "linkedin": 0.7}
```

### **Layer 3: Goal Optimization**
- **Awareness**: Boost TikTok (+50%), Meta (+30%) for reach
- **Demos/Leads**: Boost Google (+30%), LinkedIn (+20%) for intent
- **Sales**: Boost Google (+40%), Meta (+20%) for conversions

### **Layer 4: Uncertainty Modeling**
Monte Carlo simulation with 1,000 samples:
```python
# Real performance varies ±20-30% from benchmarks
actual_cpm = random.uniform(benchmark * 0.8, benchmark * 1.2)
actual_leads = calculate_funnel(cpm, ctr, cvr, budget)

# Report honest ranges: P10 (conservative) to P90 (optimistic)
confidence_interval = {
  "conservative": percentile(samples, 10),
  "expected": percentile(samples, 50), 
  "optimistic": percentile(samples, 90)
}
```

## 🚀 **Quick Start (Automatic)**

### **Option 1: One-Click Startup (Recommended)**
```bash
# Clone repository (if needed)
git clone <repository-url>
cd budget-brain-hackathon

# Start everything automatically
python startup.py
```

The startup script will:
- ✅ Check Python 3.7+ and Node.js requirements
- 🔧 Set up virtual environment and install dependencies  
- 🚀 Start both backend (port 8000) and frontend (port 3000)
- 🌐 Open browser automatically to http://localhost:3000
- 📚 Display demo instructions

### **Option 2: Manual Setup**

#### **Backend Setup**
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment (optional for Gemini AI)
cp ../env_template.txt .env
# Edit .env with your Gemini API key

# Start backend
python main.py
# API running on http://localhost:8000
```

#### **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
# App running on http://localhost:3000
```

### **Test Complete System**
```bash
# Run comprehensive test suite
python test_system.py

# Or test API directly
curl -X POST http://localhost:8000/optimize \
  -H "Content-Type: application/json" \
  -d '{"name":"TechFlow","budget":8000,"goal":"demos","industry":"b2b_saas"}'
```


## 🎯 **Data Sources**

All recommendations cite real market intelligence:
- **WordStream 2024 Google Ads Benchmarks**
- **Varos B2B SaaS Performance Data**
- **Meta Business Benchmark Reports**
- **TikTok Business Advertising Trends**
- **LinkedIn B2B Marketing Solutions**
- **Gemini AI Market Research** (real-time)

---

**Combining data science, AI reasoning, and practical business intelligence**
