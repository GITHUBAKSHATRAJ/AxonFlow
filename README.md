# AxonFlow 🧠🚀

**AxonFlow** is a next-generation, AI-powered autonomous mind-mapping engine. It is designed to help users visualize complex ideas, plan projects, and explore logical flows with the help of intelligent agents.

## 🏗️ Project Structure
This repository uses a monorepo structure to manage all services:
- **`/frontend`**: React application built with Vite and React Flow.
- **`/backend`**: Node.js Express server handling data persistence and user management.
- **`/ai-engine`**: Python FastAPI service for intelligent node generation and map restructuring.

## 🛠️ Core Technologies
### Backend (Node.js)
The backend is built using a professional modular architecture.
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Clerk (Auth-as-a-Service)
- **Core Dependencies:**
  - `express`: Web framework
  - `mongoose`: MongoDB object modeling
  - `cors`: Cross-Origin Resource Sharing
  - `dotenv`: Environment variable management

### Frontend (React)
- **Build Tool:** Vite
- **State Management:** React Hooks
- **UI:** Tailwind CSS (Optional) & Lucide Icons
- **Canvas:** React Flow

## 🚦 Getting Started
Detailed initialization and setup steps can be found in [startup.md](./startup.md).

### Installation
1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## 📜 License
This project is licensed under the [MIT License](./LICENSE).
