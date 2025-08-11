# ml/train_synth.py
import os, json, random, pathlib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from joblib import dump

# ---- settings ----
N = int(os.getenv("SYNTH_N", "20000"))
RANDOM_SEED = 42
random.seed(RANDOM_SEED); np.random.seed(RANDOM_SEED)

industries = ["default", "b2b_saas", "ecommerce", "healthcare", "finance", "education"]
goals = ["awareness", "leads", "demos", "sales", "revenue"]

def sample_alloc():
    # coarse but valid allocation that sums to 1 with soft constraints
    g = np.random.uniform(0.15, 0.70)
    m = np.random.uniform(0.10, 0.50)
    l = np.random.uniform(0.05, 0.40)
    t = max(0.0, 1.0 - (g + m + l))
    # if t too big/small, rescale to sum=1
    v = np.array([g, m, l, t])
    v = np.maximum(v, 0.0)
    v = v / v.sum()
    return v  # [google, meta, linkedin, tiktok]

def sample_ranges(industry):
    # mid values roughly inspired by your backend fallbacks
    base = {
        "google":   {"cpm": 54.4, "ctr": 1.4,  "cvr": 7.5},
        "meta":     {"cpm": 10.3, "ctr": 1.9,  "cvr": 6.7},
        "tiktok":   {"cpm": 5.4,  "ctr": 3.1,  "cvr": 8.7},
        "linkedin": {"cpm": 69.5, "ctr": 1.0,  "cvr": 5.1},
    }
    # simple industry modifiers similar to backend (boost ctr/cvr, mild cpm adj)
    mod = {
        "b2b_saas":  {"google":1.2,"meta":0.8,"tiktok":0.6,"linkedin":1.5},
        "ecommerce": {"google":1.1,"meta":1.3,"tiktok":1.4,"linkedin":0.7},
        "healthcare":{"google":1.3,"meta":0.9,"tiktok":0.7,"linkedin":1.1},
        "finance":   {"google":1.4,"meta":0.7,"tiktok":0.4,"linkedin":1.3},
        "education": {"google":1.1,"meta":1.0,"tiktok":0.8,"linkedin":1.2},
        "default":   {"google":1.0,"meta":1.0,"tiktok":1.0,"linkedin":1.0},
    }[industry]
    out = {}
    for p, mid in base.items():
        m = mod[p]
        ctr_mid = mid["ctr"] * m
        cvr_mid = mid["cvr"] * m
        # mild CPM tweak
        cpm_mid = mid["cpm"] * (1.0 / max(0.9, min(m, 1.1)))
        out[p] = {"cpm_mid": cpm_mid, "ctr_mid": ctr_mid, "cvr_mid": cvr_mid}
    return out

def simulate(total_budget, allocs, mids):
    # deterministic single-pass funnel using "mid" values (fast label gen)
    # allocs: [g,m,l,t]; mids: dict per platform with *_mid
    chans = ["google","meta","linkedin","tiktok"]
    total_leads = 0.0
    for p, w in zip(chans, allocs):
        spend = total_budget * w
        cpm = mids[p]["cpm_mid"]
        ctr = mids[p]["ctr_mid"]
        cvr = mids[p]["cvr_mid"]
        imps = (spend / max(cpm, 0.01)) * 1000.0
        clicks = imps * (ctr / 100.0)
        leads = clicks * (cvr / 100.0)
        total_leads += leads
    return total_leads

rows = []
for _ in range(N):
    industry = random.choice(industries)
    goal = random.choice(goals)
    total_budget = random.choice([5000, 10000, 20000, 40000])

    g, m, l, t = sample_alloc()
    mids = sample_ranges(industry)

    # jitter mid metrics to produce diversity
    jitter = lambda x, lo, hi: x * np.random.uniform(lo, hi)
    feats = {
        "industry": industry, "goal": goal, "total_budget": total_budget,
        "alloc_google": g, "alloc_meta": m, "alloc_linkedin": l, "alloc_tiktok": t,
        "google_cpm_mid": jitter(mids["google"]["cpm_mid"], 0.85, 1.15),
        "meta_cpm_mid": jitter(mids["meta"]["cpm_mid"], 0.85, 1.15),
        "tiktok_cpm_mid": jitter(mids["tiktok"]["cpm_mid"], 0.85, 1.15),
        "linkedin_cpm_mid": jitter(mids["linkedin"]["cpm_mid"], 0.85, 1.15),
        "google_ctr_mid": jitter(mids["google"]["ctr_mid"], 0.85, 1.15),
        "meta_ctr_mid": jitter(mids["meta"]["ctr_mid"], 0.85, 1.15),
        "tiktok_ctr_mid": jitter(mids["tiktok"]["ctr_mid"], 0.85, 1.15),
        "linkedin_ctr_mid": jitter(mids["linkedin"]["ctr_mid"], 0.85, 1.15),
        "google_cvr_mid": jitter(mids["google"]["cvr_mid"], 0.85, 1.15),
        "meta_cvr_mid": jitter(mids["meta"]["cvr_mid"], 0.85, 1.15),
        "tiktok_cvr_mid": jitter(mids["tiktok"]["cvr_mid"], 0.85, 1.15),
        "linkedin_cvr_mid": jitter(mids["linkedin"]["cvr_mid"], 0.85, 1.15),
    }
    y = simulate(total_budget, [g, m, l, t], {
        "google":   {"cpm_mid": feats["google_cpm_mid"],   "ctr_mid": feats["google_ctr_mid"],   "cvr_mid": feats["google_cvr_mid"]},
        "meta":     {"cpm_mid": feats["meta_cpm_mid"],     "ctr_mid": feats["meta_ctr_mid"],     "cvr_mid": feats["meta_cvr_mid"]},
        "linkedin": {"cpm_mid": feats["linkedin_cpm_mid"], "ctr_mid": feats["linkedin_ctr_mid"], "cvr_mid": feats["linkedin_cvr_mid"]},
        "tiktok":   {"cpm_mid": feats["tiktok_cpm_mid"],   "ctr_mid": feats["tiktok_ctr_mid"],   "cvr_mid": feats["tiktok_cvr_mid"]},
    })
    feats["total_leads"] = y
    rows.append(feats)

df = pd.DataFrame(rows)

# ----- train simple model -----
y = df["total_leads"].values
X = df.drop(columns=["total_leads"])

cat_cols = ["industry", "goal"]
num_cols = [c for c in X.columns if c not in cat_cols]

pre = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
    ("num", "passthrough", num_cols)
])

model = Pipeline([
    ("prep", pre),
    ("rf", RandomForestRegressor(
        n_estimators=300, random_state=RANDOM_SEED, n_jobs=-1, max_depth=None
    ))
])

model.fit(X, y)

# save model + feature columns (for inference)
pathlib.Path("models").mkdir(parents=True, exist_ok=True)
dump(model, "models/budget_predictor.pkl")
with open("models/feature_columns.json", "w") as f:
    json.dump({"cat_cols": cat_cols, "num_cols": num_cols}, f, indent=2)

print("Saved models/budget_predictor.pkl and models/feature_columns.json")
