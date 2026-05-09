# DSA Sheet — Progress Tracker

A full-stack MERN application to track your Data Structures & Algorithms learning journey. Built with a dark terminal aesthetic, persistent progress, and 50+ curated problems across 10 topics.

---

## 🗂️ Project Structure

```txt
dsa-tracker/
├── backend/          # Node.js + Express + MongoDB API
│   ├── config/       # Database connection
│   ├── data/         # Seed script with DSA problems
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose schemas (User, Topic, Progress)
│   ├── routes/       # API routes (auth, topics, progress)
│   ├── server.js     # Express app entry point
│   └── .env.example  # Environment variables template
│
└── frontend/         # React + Vite SPA
    └── src/
        ├── api/      # Axios instance with JWT interceptor
        ├── components/  # Navbar, TopicCard, ProblemRow, StatsBar
        ├── context/  # Auth context (global user state)
        └── pages/    # Login, Register, Dashboard
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

---

### 1. Clone and navigate

```bash
git clone <your-repo-url>
cd dsa-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):

```conf
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dsa_tracker
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Seed the database with DSA problems:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: **<http://localhost:5000>**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: **<http://localhost:5173>**

---

## 🚀 Features

| Feature | Details |
|---------|---------|
| 🔐 Auth | JWT-based login/register, persistent sessions |
| 📚 Topics | 10 DSA topics with 50+ problems |
| ✅ Progress | Checkbox toggle, saved per user, persists on login |
| 📊 Stats | Overall %, by difficulty (Easy/Medium/Hard) |
| 🔗 Resources | YouTube, LeetCode, Article links per problem |
| 🏷️ Levels | Easy / Medium / Hard badge per problem |
| 🔍 Search | Filter by topic or problem name |
| 🌐 Filters | All / Pending / In Progress / Completed |

---

## 📡 API Endpoints

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Topics

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/topics` | Get all topics + problems (protected) |
| GET | `/api/topics/:id` | Get single topic (protected) |

### Progress

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/progress` | Get all user progress (protected) |
| GET | `/api/progress/stats` | Get stats summary (protected) |
| POST | `/api/progress/toggle` | Toggle problem completion (protected) |

---

## 🧱 Data Models

### User

```js
{ name, email, password (bcrypt hashed), timestamps }
```

### Topic

```js
{ name, description, icon, order, problems: [{ title, level, youtubeLink, leetcodeLink, articleLink }] }
```

### Progress

```js
{ user (ref), topic (ref), problemId, completed, completedAt }
// Compound index: { user, topic, problemId } for fast lookups
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Vite |
| Styling | CSS Modules (no frameworks) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Fonts | Syne (display), Space Mono (code) |

---
