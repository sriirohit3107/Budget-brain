#!/usr/bin/env python3
"""
Budget Brain Startup Script
LeoAds.ai Hackathon - Complete System Launch

This script starts both backend and frontend for the Budget Brain application.
Run this for a complete demo-ready system.
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_python():
    """Check if Python 3.7+ is available"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7+ required. Current version:", sys.version)
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_node():
    """Check if Node.js is available"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()} detected")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Node.js not found. Please install Node.js from https://nodejs.org/")
    return False

def setup_backend():
    """Install backend dependencies and start server"""
    print("\n🔧 Setting up Backend...")
    
    # Check if virtual environment exists
    if not os.path.exists("backend/venv"):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "backend/venv"])
    
    # Activate venv and install dependencies
    if sys.platform.startswith('win'):
        pip_cmd = "backend/venv/Scripts/pip"
        python_cmd = "backend/venv/Scripts/python"
    else:
        pip_cmd = "backend/venv/bin/pip"
        python_cmd = "backend/venv/bin/python"
    
    print("Installing backend dependencies...")
    subprocess.run([pip_cmd, "install", "-r", "backend/requirements.txt"])
    
    return python_cmd

def setup_frontend():
    """Install frontend dependencies"""
    print("\n🔧 Setting up Frontend...")
    
    # Change to frontend directory and install
    os.chdir("frontend")
    
    if not os.path.exists("node_modules"):
        print("Installing frontend dependencies...")
        subprocess.run(["npm", "install"])
    else:
        print("Frontend dependencies already installed")
    
    os.chdir("..")  # Back to root

def start_servers(python_cmd):
    """Start both backend and frontend servers"""
    print("\n🚀 Starting Budget Brain Application...")
    
    # Start backend server
    print("Starting backend server...")
    backend_process = subprocess.Popen([
        python_cmd, "backend/main.py"
    ], cwd=".")
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend server
    print("Starting frontend server...")
    frontend_process = subprocess.Popen([
        "npm", "start"
    ], cwd="frontend")
    
    # Wait for frontend to be ready
    time.sleep(5)
    
    return backend_process, frontend_process

def main():
    """Main startup orchestrator"""
    print("🧠 Budget Brain - LeoAds.ai Hackathon Startup")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python():
        return 1
    
    if not check_node():
        return 1
    
    # Setup environment file if it doesn't exist
    if not os.path.exists(".env"):
        print("\n📝 Creating .env file from template...")
        import shutil
        shutil.copy("env_template.txt", ".env")
        print("⚠️  Please edit .env with your Gemini API key for full functionality")
    
    try:
        # Setup components
        python_cmd = setup_backend()
        setup_frontend()
        
        # Start servers
        backend_proc, frontend_proc = start_servers(python_cmd)
        
        print("\n" + "=" * 50)
        print("🎉 Budget Brain is now running!")
        print("📱 Frontend: http://localhost:3000")
        print("🔧 Backend API: http://localhost:8000")
        print("📖 API Docs: http://localhost:8000/docs")
        print("=" * 50)
        print("\n🎯 Demo Instructions:")
        print("1. Try the demo companies (TechFlow SaaS, StyleCo Fashion, etc.)")
        print("2. Adjust assumptions to see how allocations change")
        print("3. Click 'Get Enhanced AI Explanation' for detailed reasoning")
        print("4. Note the uncertainty ranges (P10-P90 confidence intervals)")
        print("\n⏹️  Press Ctrl+C to stop all servers")
        
        # Open browser
        time.sleep(2)
        webbrowser.open("http://localhost:3000")
        
        # Keep running until interrupted
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n🛑 Shutting down Budget Brain...")
            backend_proc.terminate()
            frontend_proc.terminate()
            
            # Wait for graceful shutdown
            backend_proc.wait(timeout=5)
            frontend_proc.wait(timeout=5)
            
            print("✅ All servers stopped. Thanks for using Budget Brain!")
            
    except Exception as e:
        print(f"\n❌ Error starting Budget Brain: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
