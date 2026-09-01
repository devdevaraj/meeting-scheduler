# Difinity Digital - Smart Meeting Room Auto-Assignment System

### Tech Stack

* **Frontend**: React 18, TypeScript, Vite, Vanilla CSS System (Glassmorphism & Neon theme), Lucide Icons.
* **Backend**: Express.js, TypeScript, Zod (validation), Jest & ts-jest (automated unit testing).
* **DevOps**: Docker, Nginx (for production frontend static serving), Docker Compose.

---

## Prerequisites & Requirements

Before running the application, ensure you have the following installed on your environment:

* **Node.js**: `v18.0.0` or higher (`v24.x` recommended)
* **npm**: `v9.0.0` or higher
* **MongoDB**: MongoDB `v6.0` or `v7.0` running locally on port `27017` (or a valid MongoDB Atlas connection URI)
* **Docker & Docker Compose** *(Optional, required only if running containerized deployment)*

---

## Instructions to run the application locally

### 1. Backend Setup

1. Rename or copy `.env.example` to `.env` in the `backend` directory and modify values if needed:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Install dependencies and start the development server:

   ```bash
   npm install
   npm run dev
   ```

The backend server will start on `http://localhost:5000`.

### 2. Frontend Setup

In a new terminal window:

1. Rename or copy `.env.example` to `.env` in the `frontend` directory and modify values if needed:

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Install dependencies and start the Vite development server:

   ```bash
   npm install
   npm run dev
   ```

The Vite development server will start on `http://localhost:3000`.

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/rooms` | List all 5 meeting rooms and their capacities |
| `GET` | `/api/meetings` | List all scheduled meetings sorted by start time |
| `POST` | `/api/meetings` | Schedule a meeting `{ title, startTime, endTime }` |
| `DELETE` | `/api/meetings/:id` | Cancel a meeting by ID |
