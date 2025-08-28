from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import your existing app
from main import app

# Configure for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel handler
handler = app
