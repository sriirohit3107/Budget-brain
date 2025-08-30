# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import random
import os
import json
import re
import copy
import google.generativeai as genai
from typing import Dict, Optional, List, Any
from dotenv import load_dotenv
import json, re, copy
import os
import uvicorn
# ML integration removed - using pure Monte Carlo + Gemini approach
# ----------------------------
# Env & Gemini configuration
# ----------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Budget Brain API", description="AI-powered ad budget allocation")

# CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    #   allow_origins=[
    #     "http://localhost:3000", 
    #     "http://127.0.0.1:3000", 
    #     "https://budget-brain-djxl.vercel.app",
    #     "https://budget-brain-production.up.railway.app",  # Correct URL
    #     "https://*.vercel.app",
    # ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight response for 1 hour
)

# Add logging middleware for debugging
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    print(f"Headers: {dict(request.headers)}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# ----------------------------
# Baseline point-estimate benchmarks (fallback)
# CPM in USD, CTR/CVR in %
# ----------------------------
PLATFORM_BENCHMARKS = {
    "google":   {"cpm": 54.4,  "ctr": 1.4,  "cvr": 7.52, "description": "High-intent search traffic"},
    "meta":     {"cpm": 10.3,  "ctr": 1.9,  "cvr": 6.66, "description": "Social targeting and visual content"},
    "tiktok":   {"cpm": 5.4,   "ctr": 3.1,  "cvr": 8.73, "description": "Viral content and young audience"},
    "linkedin": {"cpm": 69.49, "ctr": 0.96, "cvr": 5.09, "description": "B2B professionals and decision makers"},
}

# Industry modifiers (relative effects). We'll apply them primarily to CTR/CVR.
INDUSTRY_MODIFIERS = {
    "b2b_saas":  {"google": 1.2, "meta": 0.8, "tiktok": 0.6, "linkedin": 1.5},
    "ecommerce": {"google": 1.1, "meta": 1.3, "tiktok": 1.4, "linkedin": 0.7},
    "healthcare":{"google": 1.3, "meta": 0.9, "tiktok": 0.7, "linkedin": 1.1},
    "finance":   {"google": 1.4, "meta": 0.7, "tiktok": 0.4, "linkedin": 1.3},
    "education": {"google": 1.1, "meta": 1.0, "tiktok": 0.8, "linkedin": 1.2},
    "default":   {"google": 1.0, "meta": 1.0, "tiktok": 1.0, "linkedin": 1.0},
}

# ----------------------------
# Pydantic models
# ----------------------------
class AssumptionOverrides(BaseModel):
    min_linkedin: Optional[float] = 5.0
    max_google: Optional[float] = 70.0
    prefer_social: Optional[bool] = False
    uncertainty_factor: Optional[float] = 1.0  # kept for UI; range priors already encode uncertainty

class CompanyInput(BaseModel):
    name: str
    budget: float
    goal: str
    industry: Optional[str] = "default"
    assumptions: Optional[AssumptionOverrides] = None

class BudgetBreakdown(BaseModel):
    google: float
    meta: float
    tiktok: float
    linkedin: float

class ConfidenceRange(BaseModel):
    p10: float
    p50: float
    p90: float

class PlatformResult(BaseModel):
    budget: float
    percentage: float
    expected_leads: ConfidenceRange
    cost_per_lead: ConfidenceRange

class OptimizationResult(BaseModel):
    budget_breakdown: BudgetBreakdown
    platform_results: Dict[str, PlatformResult]
    total_expected_leads: ConfidenceRange
    reasoning: str
    sources: list  # can be list[str] or list[{"title","url"}]

# ----------------------------
# Gemini Research Service
# ----------------------------
class GeminiResearchService:
    """
    Pull CPM/CTR/CVR ranges + sources via Gemini.
    Returns:
      {
        "benchmarks": {
          "<platform>": {
             "cpm": {"low":..., "mid":..., "high":...},
             "ctr": {"low":..., "mid":..., "high":...},
             "cvr": {"low":..., "mid":..., "high":...},
             "desc": "..."
          }, ...
        },
        "sources": [{"title": "...", "url": "..."}, ...]
      }
    """
    def __init__(self):
        self.model = None
        if GEMINI_API_KEY:
            try:
                self.model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                print(f"Failed to initialize Gemini model: {e}")

    def _safe_json_loads(self, s: str) -> Optional[Dict[str, Any]]:
        s = s.strip().strip("```").strip()
        s = re.sub(r"^json\s*", "", s, flags=re.I)
        try:
            return json.loads(s)
        except Exception:
            return None

    def _wrap_as_ranges(self, flat: Dict[str, Dict[str, float]]) -> Dict[str, Dict[str, Any]]:
        # Turn single values into low/mid/high shells
        out: Dict[str, Dict[str, Any]] = {}
        for p, v in flat.items():
            out[p] = {
                "cpm": {"low": v["cpm"] * 0.8, "mid": v["cpm"], "high": v["cpm"] * 1.2},
                "ctr": {"low": v["ctr"] * 0.7, "mid": v["ctr"], "high": v["ctr"] * 1.3},
                "cvr": {"low": v["cvr"] * 0.6, "mid": v["cvr"], "high": v["cvr"] * 1.4},
                "desc": v.get("description", ""),
            }
        return out

    def _coerce_ranges(self, data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        # Ensure low/mid/high exist for each metric; wrap points if needed
        out: Dict[str, Dict[str, Any]] = {}
        for p in ["google", "meta", "tiktok", "linkedin"]:
            node = data.get(p, {}) if isinstance(data, dict) else {}
            def get_range(key: str, mult_low: float, mult_high: float):
                v = node.get(key, {})
                if isinstance(v, dict) and all(k in v for k in ("low", "mid", "high")):
                    return v
                if isinstance(v, (int, float)):
                    return {"low": v * mult_low, "mid": v, "high": v * mult_high}
                return {"low": 0.0, "mid": 0.0, "high": 0.0}
            out[p] = {
                "cpm": get_range("cpm", 0.8, 1.2),
                "ctr": get_range("ctr", 0.7, 1.3),
                "cvr": get_range("cvr", 0.6, 1.4),
                "desc": node.get("description") or node.get("desc", ""),
            }
        return out

    def _get_fallback_ranges(self) -> Dict[str, Dict[str, Any]]:
        return self._wrap_as_ranges(PLATFORM_BENCHMARKS)




    def _apply_industry_modifiers_to_ranges(
        self, ranges: Dict[str, Dict[str, Any]], industry: str
    ) -> Dict[str, Dict[str, Any]]:
        """Boost CTR/CVR by modifier; apply mild inverse effect to CPM."""
        mod = INDUSTRY_MODIFIERS.get(industry, INDUSTRY_MODIFIERS["default"])
        adj = copy.deepcopy(ranges)
        for p in ["google", "meta", "tiktok", "linkedin"]:
            m = mod[p]
            # CTR/CVR boosted by modifier
            for k in ["ctr", "cvr"]:
                for band in ["low", "mid", "high"]:
                    adj[p][k][band] = max(0.0, adj[p][k][band] * m)
            # CPM adjusted mildly (higher modifier => slightly cheaper or unchanged within cap)
            # We cap to avoid unrealistic CPM swings.
            mild = 1.0 / max(0.9, min(m, 1.1))  # between ~0.91 and 1.11
            for band in ["low", "mid", "high"]:
                adj[p]["cpm"][band] = max(0.01, adj[p]["cpm"][band] * mild)
        return adj

    def gather_platform_benchmarks(self, industry: str = "default", year: int = 2025) -> Dict[str, Any]:
        if not self.model:
            return {"benchmarks": self._get_fallback_ranges(), "sources": []}

        # Enhanced prompt for better research and citations
        industry_context = {
            "b2b_saas": "B2B SaaS companies selling software to businesses",
            "ecommerce": "E-commerce companies selling products online",
            "healthcare": "Healthcare companies and medical services",
            "finance": "Financial services and fintech companies",
            "education": "Educational technology and online learning",
            "default": "general business and technology companies"
        }
        
        industry_desc = industry_context.get(industry, industry_context["default"])
        
        prompt = f"""
You are a digital advertising expert researching {year} performance benchmarks for {industry_desc}.

Research and return STRICT JSON only. No prose. Provide comprehensive ad benchmark RANGES for Google Ads, Meta (Facebook/Instagram), TikTok Ads, and LinkedIn Ads.

IMPORTANT: Include 3-5 credible sources with titles and URLs. Focus on recent data from reputable marketing publications, industry reports, or platform documentation.

Schema (numbers only, CTR/CVR as percentages):
{{
  "google": {{
    "cpm": {{"low": x, "mid": y, "high": z}},
    "ctr": {{"low": x, "mid": y, "high": z}},
    "cvr": {{"low": x, "mid": y, "high": z}},
    "desc": "Brief description of platform strengths for {industry_desc}"
  }},
  "meta": {{
    "cpm": {{"low": x, "mid": y, "high": z}},
    "ctr": {{"low": x, "mid": y, "high": z}},
    "cvr": {{"low": x, "mid": y, "high": z}},
    "desc": "Brief description of platform strengths for {industry_desc}"
  }},
  "tiktok": {{
    "cpm": {{"low": x, "mid": y, "high": z}},
    "ctr": {{"low": x, "mid": y, "high": z}},
    "cvr": {{"low": x, "mid": y, "high": z}},
    "desc": "Brief description of platform strengths for {industry_desc}"
  }},
  "linkedin": {{
    "cpm": {{"low": x, "mid": y, "high": z}},
    "ctr": {{"low": x, "mid": y, "high": z}},
    "cvr": {{"low": x, "mid": y, "high": z}},
    "desc": "Brief description of platform strengths for {industry_desc}"
  }},
  "sources": [
    {{"title": "Source Title", "url": "https://source-url.com"}},
    {{"title": "Another Source", "url": "https://another-url.com"}}
  ]
}}

Research focus:
- CPM: Cost per 1000 impressions (USD)
- CTR: Click-through rate (percentage)
- CVR: Conversion rate (percentage)
- Provide realistic ranges based on {industry_desc} performance
- Include recent data from {year} or {year-1}
- Focus on credible marketing publications and industry reports
"""
        try:
            resp = self.model.generate_content(prompt)
            text = (resp.text or "").strip()
            data = self._safe_json_loads(text)
            if not data:
                return {"benchmarks": self._get_fallback_ranges(), "sources": []}

            ranges = self._coerce_ranges(data)
            sources = data.get("sources", [])
            if not isinstance(sources, list):
                sources = []
            # Apply industry modifiers
            ranges = self._apply_industry_modifiers_to_ranges(ranges, industry)
            return {"benchmarks": ranges, "sources": sources}
        except Exception as e:
            print("Gemini API error:", e)
            return {"benchmarks": self._get_fallback_ranges(), "sources": []}

# ----------------------------
# Core Optimizer
# ----------------------------
class BudgetOptimizer:
    def __init__(self):
        self.gemini_service = GeminiResearchService()
        print("✅ Budget Optimizer initialized (Pure Monte Carlo + Gemini Intelligence)")

    # ----- helpers -----
    @staticmethod
    def _tri(low: float, mid: float, high: float) -> float:
        # Triangular sampling favors the "mid" (mode)
        return random.triangular(low, high, mid)

    @staticmethod
    def _pct(arr: List[float], q: float) -> float:
        return float(np.percentile(arr, q))

    def _goal_multiplier(self, platform: str, goal: str) -> float:
        multipliers = {
            "awareness": {"tiktok": 1.5, "meta": 1.3, "google": 1.0, "linkedin": 0.8},
            "leads":     {"google": 1.4, "linkedin": 1.3, "meta": 1.1, "tiktok": 0.9},
            "demos":     {"google": 1.4, "linkedin": 1.3, "meta": 1.1, "tiktok": 0.8},
            "sales":     {"google": 1.5, "meta": 1.2, "linkedin": 1.1, "tiktok": 0.9},
            "revenue":   {"google": 1.5, "meta": 1.2, "linkedin": 1.1, "tiktok": 0.9},
        }
        return multipliers.get(goal, {}).get(platform, 1.0)

    # ----- main entrypoint -----
    def optimize_allocation(self, company: CompanyInput) -> OptimizationResult:
        # 1) Pull priors (+ sources)
        bench_payload = self.gemini_service.gather_platform_benchmarks(company.industry)
        ranges = bench_payload["benchmarks"]
        sources = bench_payload.get("sources", [])

        # 2) Grid search with constraints
        best_allocation = self.grid_search_optimization(company, ranges)

        if best_allocation is None:
            best_allocation = self.get_heuristic_allocation(company)

        # 3) Convert weights to $ and compute platform results (Monte Carlo with ranges)
        budget_breakdown = self.calculate_budget_breakdown(best_allocation, company.budget)
        platform_results = self.calculate_platform_results(
            budget_breakdown, company.industry, ranges, company.assumptions
        )

        # 4) Reasoning
        reasoning = self.generate_reasoning(company, best_allocation, platform_results)

        # 5) Total leads
        total_expected = self.calculate_total_leads(platform_results)

        return OptimizationResult(
            budget_breakdown=budget_breakdown,
            platform_results=platform_results,
            total_expected_leads=total_expected,
            reasoning=reasoning,
            sources=sources if sources else [
                # Fallback labels if no sources returned
                "LLM-elicited ranges via Gemini",
                "Industry modifiers applied (CTR/CVR ↑, CPM mild adjust)",
                "Monte Carlo + grid search optimization"
            ],
        )

    # ----- grid search -----
    def generate_allocation_grid(self) -> List[Dict[str, float]]:
        allocations: List[Dict[str, float]] = []
        # 10% steps; simple, visible structure
        for google in range(20, 71, 10):      # 20–70%
            for meta in range(10, 51, 10):    # 10–50%
                for linkedin in range(10, 41, 10):  # 10–40%
                    tiktok = 100 - google - meta - linkedin
                    if 5 <= tiktok <= 40:
                        allocations.append({
                            "google": google / 100,
                            "meta": meta / 100,
                            "linkedin": linkedin / 100,
                            "tiktok": tiktok / 100,
                        })
        return allocations

    def meets_constraints(self, allocation: Dict[str, float], company: CompanyInput) -> bool:
        assumptions = company.assumptions or AssumptionOverrides()
        min_linkedin = (assumptions.min_linkedin or 5.0) / 100
        max_google = (assumptions.max_google or 70.0) / 100

        if allocation["linkedin"] < min_linkedin:
            return False
        if allocation["google"] > max_google:
            return False
        if allocation["google"] < 0.15:
            return False

        if assumptions.prefer_social:
            if allocation["meta"] + allocation["tiktok"] < 0.40:
                return False

        if company.industry == "b2b_saas":
            if allocation["linkedin"] < 0.15:
                return False
        elif company.industry == "ecommerce":
            if allocation["meta"] + allocation["tiktok"] < 0.40:
                return False

        return True

    def score_allocation(self, allocation, company, ranges) -> float:
        """
        Pure Monte Carlo scoring with Gemini-researched benchmarks.
        Transparent, reliable, and fully explainable optimization.
        """
        return self.monte_carlo_score_allocation(allocation, company, ranges)

    def monte_carlo_score_allocation(self, allocation, company, ranges) -> float:
        draws = 200
        total = 0.0
        for _ in range(draws):
            score_draw = 0.0
            for platform, weight in allocation.items():
                spend = weight * company.budget
                r = ranges[platform]
                cpm = self._tri(r["cpm"]["low"], r["cpm"]["mid"], r["cpm"]["high"])
                ctr = self._tri(r["ctr"]["low"], r["ctr"]["mid"], r["ctr"]["high"])
                cvr = self._tri(r["cvr"]["low"], r["cvr"]["mid"], r["cvr"]["high"])

                impressions = (spend / max(cpm, 0.01)) * 1000.0
                clicks = impressions * (ctr / 100.0)
                leads = clicks * (cvr / 100.0)

                score_draw += leads * self._goal_multiplier(platform, company.goal)
            total += score_draw
        return total / draws

# ML methods removed - using pure Monte Carlo + Gemini for transparency and reliability

    def grid_search_optimization(self, company: CompanyInput, ranges: Dict[str, Dict[str, Any]]) -> Optional[Dict[str, float]]:
        best_score = -1.0
        best_alloc = None
        for alloc in self.generate_allocation_grid():
            if not self.meets_constraints(alloc, company):
                continue
            score = self.score_allocation(alloc, company, ranges)
            if score > best_score:
                best_score = score
                best_alloc = alloc
        return best_alloc

    # ----- heuristics & weights -----
    def get_base_weights(self) -> Dict[str, float]:
        return {"google": 0.4, "meta": 0.3, "linkedin": 0.2, "tiktok": 0.1}

    def apply_industry_modifiers(self, weights: Dict[str, float], industry: str) -> Dict[str, float]:
        m = INDUSTRY_MODIFIERS.get(industry, INDUSTRY_MODIFIERS["default"])
        return {p: weights[p] * m[p] for p in weights}

    def apply_goal_adjustments(self, weights: Dict[str, float], goal: str) -> Dict[str, float]:
        w = weights.copy()
        g = goal.lower()
        if g in ["awareness", "brand"]:
            w["tiktok"] *= 1.5
            w["meta"] *= 1.3
            w["google"] *= 0.8
        elif g in ["leads", "demos"]:
            w["google"] *= 1.3
            w["linkedin"] *= 1.2
        elif g in ["revenue", "sales"]:
            w["google"] *= 1.4
            w["meta"] *= 1.2
        return w

    def normalize_weights(self, weights: Dict[str, float]) -> Dict[str, float]:
        total = sum(weights.values())
        if total <= 0:
            return {"google": 0.4, "meta": 0.3, "linkedin": 0.2, "tiktok": 0.1}
        return {p: weights[p] / total for p in weights}

    def get_heuristic_allocation(self, company: CompanyInput) -> Dict[str, float]:
        base = self.get_base_weights()
        ind = self.apply_industry_modifiers(base, company.industry)
        goal = self.apply_goal_adjustments(ind, company.goal)
        return self.normalize_weights(goal)

    # ----- $ conversion & simulation -----
    def calculate_budget_breakdown(self, weights: Dict[str, float], total_budget: float) -> BudgetBreakdown:
        return BudgetBreakdown(
            google=weights["google"] * total_budget,
            meta=weights["meta"] * total_budget,
            tiktok=weights["tiktok"] * total_budget,
            linkedin=weights["linkedin"] * total_budget,
        )

    def calculate_platform_results(
        self,
        budget_breakdown: BudgetBreakdown,
        industry: str,
        ranges: Dict[str, Dict[str, Any]],
        assumptions: Optional[AssumptionOverrides] = None,
    ) -> Dict[str, PlatformResult]:
        results: Dict[str, PlatformResult] = {}
        total_budget = budget_breakdown.google + budget_breakdown.meta + budget_breakdown.tiktok + budget_breakdown.linkedin

        # draws for per-channel intervals
        draws = 1000
        for platform in ["google", "meta", "tiktok", "linkedin"]:
            p_budget = getattr(budget_breakdown, platform)
            pct = (p_budget / total_budget) * 100.0 if total_budget > 0 else 0.0
            r = ranges[platform]

            leads_samples: List[float] = []
            cpl_samples: List[float] = []

            for _ in range(draws):
                cpm = self._tri(r["cpm"]["low"], r["cpm"]["mid"], r["cpm"]["high"])
                ctr = self._tri(r["ctr"]["low"], r["ctr"]["mid"], r["ctr"]["high"])
                cvr = self._tri(r["cvr"]["low"], r["cvr"]["mid"], r["cvr"]["high"])

                impressions = (p_budget / max(cpm, 0.01)) * 1000.0
                clicks = impressions * (ctr / 100.0)
                leads = clicks * (cvr / 100.0)
                cpl = p_budget / max(leads, 1e-6)

                leads_samples.append(leads)
                cpl_samples.append(cpl)

            results[platform] = PlatformResult(
                budget=p_budget,
                percentage=pct,
                expected_leads=ConfidenceRange(
                    p10=self._pct(leads_samples, 10),
                    p50=self._pct(leads_samples, 50),
                    p90=self._pct(leads_samples, 90),
                ),
                cost_per_lead=ConfidenceRange(
                    p10=self._pct(cpl_samples, 10),
                    p50=self._pct(cpl_samples, 50),
                    p90=self._pct(cpl_samples, 90),
                ),
            )
        return results

    def calculate_total_leads(self, platform_results: Dict[str, PlatformResult]) -> ConfidenceRange:
        return ConfidenceRange(
            p10=sum(r.expected_leads.p10 for r in platform_results.values()),
            p50=sum(r.expected_leads.p50 for r in platform_results.values()),
            p90=sum(r.expected_leads.p90 for r in platform_results.values()),
        )

    def generate_reasoning(self, company: CompanyInput, weights: Dict[str, float], results: Dict[str, PlatformResult]) -> str:
        reasoning = f"Budget allocation for {company.name} (${company.budget:,.0f}/month, Goal: {company.goal}):\n\n"
        
        # Add industry-specific context
        industry_insights = {
            "b2b_saas": "B2B SaaS companies typically need high-intent search traffic and professional network targeting. Google dominates for search intent, while LinkedIn reaches decision-makers.",
            "ecommerce": "E-commerce thrives on visual content and social discovery. Meta and TikTok excel at product discovery, while Google captures purchase intent.",
            "healthcare": "Healthcare requires trust and professional credibility. LinkedIn reaches healthcare professionals, while Google captures patient search intent.",
            "finance": "Financial services need regulatory compliance and professional trust. LinkedIn dominates B2B finance, while Google captures consumer financial searches.",
            "education": "Education benefits from social proof and visual content. Meta and TikTok excel at awareness, while Google captures learning intent.",
            "default": "General businesses benefit from balanced approach across search, social, and professional networks."
        }
        
        industry_desc = industry_insights.get(company.industry, industry_insights["default"])
        reasoning += f"🏭 **Industry Context ({company.industry.replace('_', ' ').title()}):** {industry_desc}\n\n"
        
        for platform, weight in sorted(weights.items(), key=lambda x: x[1], reverse=True):
            amount = weight * company.budget
            pct = weight * 100.0
            platform_name = platform.replace("_", " ").title()
            if platform == "meta":
                platform_name = "Meta (FB/IG)"
            desc = PLATFORM_BENCHMARKS[platform]["description"]
            exp_leads = results[platform].expected_leads.p50
            reasoning += f"• {platform_name}: {pct:.1f}% (${amount:,.0f})\n  {desc}\n  Expected: {exp_leads:.0f} leads\n\n"

        reasoning += "This allocation uses two AI intelligence types: Gemini world knowledge (real-time market research) and structured reasoning (Monte Carlo simulation + constraint optimization). "
        reasoning += "Results combine current market intelligence with probabilistic modeling for transparent and reliable planning estimates."
        
        # Add uncertainty explanation
        reasoning += "\n\n📊 **Uncertainty & Confidence:**\n"
        reasoning += "• **P10 (Conservative)**: 10% chance of achieving this or better\n"
        reasoning += "• **P50 (Expected)**: 50% chance of achieving this or better\n"
        reasoning += "• **P90 (Optimistic)**: 90% chance of achieving this or better\n"
        reasoning += "• **Range**: Reflects real market variability in CPM, CTR, and CVR\n"
        
        return reasoning

# ----------------------------
# Demo client list - LeoAds.ai clients showcase
# ----------------------------
LEOADS_CLIENTS = [
    # B2B SaaS Examples (High-value, complex sales)
    {"name": "TechFlow SaaS", "budget": 8000, "goal": "demos", "industry": "b2b_saas", "description": "B2B workflow automation software"},
    {"name": "DataFlow Solutions", "budget": 15000, "goal": "leads", "industry": "b2b_saas", "description": "Enterprise data integration platform"},
    {"name": "CloudFlow Systems", "budget": 25000, "goal": "sales", "industry": "b2b_saas", "description": "Cloud security solutions for enterprises"},
    
    # E-commerce Examples (Visual, social-driven)
    {"name": "StyleCo Fashion", "budget": 5000, "goal": "revenue", "industry": "ecommerce", "description": "Trendy fashion subscription box"},
    {"name": "EcoHome Goods", "budget": 12000, "goal": "leads", "industry": "ecommerce", "description": "Sustainable home products"},
    {"name": "SmartTech Store", "budget": 8000, "goal": "awareness", "industry": "ecommerce", "description": "Consumer electronics retailer"},
    
    # Healthcare Examples (Trust, compliance)
    {"name": "HealthTech Pro", "budget": 10000, "goal": "leads", "industry": "healthcare", "description": "Medical device software"},
    {"name": "MedFlow Solutions", "budget": 6000, "goal": "awareness", "industry": "healthcare", "description": "Digital health coaching platform"},
    
    # Finance Examples (Professional, regulated)
    {"name": "FinanceWise", "budget": 20000, "goal": "leads", "industry": "finance", "description": "Financial advisory services"},
    {"name": "CryptoFlow", "budget": 15000, "goal": "sales", "industry": "finance", "description": "Cryptocurrency security platform"},
    
    # Education Examples (Social proof, visual)
    {"name": "EduLearn Online", "budget": 8000, "goal": "awareness", "industry": "education", "description": "Online learning platform"},
    {"name": "SkillFlow Pro", "budget": 12000, "goal": "leads", "industry": "education", "description": "Professional skill development"},
    
    # Startup Examples (Budget-conscious, growth-focused)
    {"name": "StartupFlow", "budget": 3000, "goal": "leads", "industry": "b2b_saas", "description": "Early-stage B2B startup"},
    {"name": "GrowthFlow", "budget": 5000, "goal": "awareness", "industry": "ecommerce", "description": "Growth marketing agency"},
    
    # Enterprise Examples (High-budget, complex)
    {"name": "EnterpriseFlow", "budget": 50000, "goal": "sales", "industry": "b2b_saas", "description": "Large enterprise software company"},
    {"name": "GlobalFlow Retail", "budget": 75000, "goal": "revenue", "industry": "ecommerce", "description": "International retail chain"}
]

# ----------------------------
# FastAPI routes
# ----------------------------
optimizer = BudgetOptimizer()

@app.get("/")
async def root():
    return {"message": "Budget Brain API is running! 🧠"}

@app.get("/test-cors")
async def test_cors():
    """Test endpoint to verify CORS is working"""
    return {"message": "CORS test successful!", "timestamp": "2025-01-27"}

@app.get("/debug-cors")
async def debug_cors(request):
    """Debug endpoint to check CORS headers"""
    return {
        "message": "CORS debug info",
        "headers": dict(request.headers),
        "method": request.method,
        "url": str(request.url)
    }

@app.post("/optimize", response_model=OptimizationResult)
async def optimize_budget(company: CompanyInput):
    try:
        # Add CORS headers explicitly for debugging
        print(f"Received optimization request for {company.name} with budget ${company.budget}")
        response = optimizer.optimize_allocation(company)
        print(f"Optimization completed successfully for {company.name}")
        return response
    except Exception as e:
        print(f"Error in optimization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/benchmarks")
async def get_benchmarks():
    """Return fallback point-estimate benchmarks (for debugging/UI)"""
    return PLATFORM_BENCHMARKS

@app.get("/client-examples")
async def get_client_examples():
    """Return demo client examples for UI"""
    # Group clients by industry for better organization
    grouped_clients = {}
    for client in LEOADS_CLIENTS:
        industry = client["industry"]
        if industry not in grouped_clients:
            grouped_clients[industry] = []
        grouped_clients[industry].append(client)
    
    return {
        "clients": LEOADS_CLIENTS,
        "grouped": grouped_clients,
        "industries": list(grouped_clients.keys()),
        "total_examples": len(LEOADS_CLIENTS)
    }

@app.post("/research/{industry}")
async def research_industry_benchmarks(industry: str):
    try:
        payload = optimizer.gemini_service.gather_platform_benchmarks(industry)
        return {
            "industry": industry,
            "benchmarks": payload["benchmarks"],
            "sources": payload.get("sources", []),
            "enhanced": True,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain-allocation")
async def explain_allocation(data: dict):
    try:
        svc = GeminiResearchService()
        if not svc.model:
            return {"explanation": "Gemini API not available for detailed explanations"}

        company = data.get("company", {})
        allocation = data.get("allocation", {})

        prompt = f"""
Provide a concise 2-3 sentence rationale for this media mix.

Company:
- Industry: {company.get('industry','general')}
- Budget: ${company.get('budget',0):,}/month
- Goal: {company.get('goal','leads')}

Allocation:
- Google: {allocation.get('google',0):.1%}
- Meta: {allocation.get('meta',0):.1%}
- TikTok: {allocation.get('tiktok',0):.1%}
- LinkedIn: {allocation.get('linkedin',0):.1%}

Explain using platform strengths and typical audience behavior. Avoid fluff. No bullet points.
"""
        resp = svc.model.generate_content(prompt)
        return {"explanation": resp.text if resp else "Unable to generate explanation"}
    except Exception as e:
        return {"explanation": f"Error generating explanation: {str(e)}"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
