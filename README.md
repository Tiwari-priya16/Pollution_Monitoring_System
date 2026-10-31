# Pollution Monitoring System (PMS)

A centralized, responsive, role-based web application designed to digitize environmental pollution reporting, verification, and resolution management.

---

## 🌿 Project Overview

The **Pollution Monitoring System (PMS)** bridges citizens, authorized pollution officers, and environmental administrators into a structured, transparent grievance redressal workflow. Citizens report incidents with photographic evidence and location details, pollution officers inspect and resolve complaints, and administrators maintain comprehensive oversight.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Architecture**: Modular Monolithic REST API

---

## 📁 Repository Structure

```
c:/SE_Project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and service configurations
│   │   ├── controllers/     # Route logic controllers
│   │   ├── middleware/      # Error handling, Auth (Stage 2)
│   │   ├── models/          # Mongoose database models
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Helper utilities
│   │   └── server.js        # Backend entry point
│   ├── .env.example         # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static assets & brand media
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers (Stage 2)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Layout wrappers (Main, Dashboard)
│   │   ├── pages/           # Application views
│   │   ├── routes/          # Router configurations
│   │   ├── services/        # Centralized Axios API services
│   │   ├── App.jsx          # Root component
│   │   ├── index.css        # Tailwind directives
│   │   └── main.jsx         # React mounting entry point
│   ├── .env.example         # Frontend environment template
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on v23.11.0)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string

---

### 1. Backend Setup

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Configure your `PORT` (default: 5000) and `MONGODB_URI` if connecting to a specific MongoDB instance.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```
5. Test API health status:
   Visit [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### 2. Frontend Setup

1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `VITE_API_BASE_URL=http://localhost:5000/api`)*
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 🚦 System Health Endpoint

`GET /api/health`

**Sample Response:**
```json
{
  "success": true,
  "status": "operational",
  "service": "Pollution Monitoring System Backend API",
  "timestamp": "2026-10-31T18:45:00.000Z",
  "database": {
    "status": "connected",
    "host": "127.0.0.1"
  }
}
```

---

## 📅 Roadmap & Current Status

- [x] **Stage 0**: Requirements Analysis & Architectural Blueprint
- [x] **Stage 1**: Foundation Setup, Backend Express Server, MongoDB Config, React+Vite+Tailwind UI, and Health Check
- [ ] **Stage 2**: User Authentication, Models & Role-Based Access Control
- [ ] **Stage 3**: Complaint Submission Engine & Evidence Uploads
- [ ] **Stage 4**: Citizen Dashboard & Interactive Tracking Timeline
- [ ] **Stage 5**: Pollution Officer Workflow & Status Transition Engine
- [ ] **Stage 6**: Admin Oversight, Analytics & User Management
- [ ] **Stage 7**: UI Polish, Seed Script & Live Demonstration Readiness

