# AxonFlow Project Initialization 🚀

This document outlines the steps taken to initialize the **AxonFlow** full-stack project.

## 1. Directory Structure
The project is organized as a monorepo:
- `/backend`: Node.js Express server.
- `/frontend`: React application (using Vite).
- `/ai-engine`: (To be added) Python FastAPI service.

## 2. Backend Setup (Node.js)
The backend was initialized with a professional structure:
1. Created the `backend` directory.
2. Ran `npm init -y` to generate `package.json`.
3. Created directory structure: `src/models`, `src/controllers`, `src/routes`, and `uploads/`.
4. Installed core dependencies: `npm install express mongoose cors dotenv`.

## 3. Frontend Setup (React + Vite)
The frontend was initialized using Vite for better performance:
1. Created the `frontend` directory.
2. Ran `npx create-vite . --template react`.
3. Updated page title in `index.html` to **AxonFlow**.
4. Installed base dependencies using `npm install`.

## 4. Version Control (Git)
- Initialized with a comprehensive `.gitignore` covering Node, React, and Python.
- Project name: **AxonFlow**.

---

### Commands used for initialization:
```bash
# Root
mkdir backend, frontend

# Backend
cd backend
npm init -y
mkdir src, src/models, src/controllers, src/routes, uploads
npm install express mongoose cors dotenv

# Frontend
cd frontend
npx create-vite . --template react
npm install
```
