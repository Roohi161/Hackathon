# Hackathon Central — Enterprise Hackathon Management Platform

A production-ready, full-stack SaaS platform for hosting, discovering, managing, and judging hackathons. Built with **React 19 + Vite** on the frontend and **NestJS + Prisma + PostgreSQL** on the backend.

## Architecture

```
Hackathon/
├── src/                          # React 19 + Vite Frontend
│   ├── app/                      # Router, Providers, Route Guards
│   ├── components/               # UI Components & Dashboards
│   │   ├── admin/                # Admin Dashboard
│   │   ├── judge/                # Judge Evaluation Portal
│   │   ├── mentor/               # Mentor Dashboard
│   │   ├── organizer/            # Organizer Workspace
│   │   ├── participant/          # Participant Views
│   │   ├── reviewer/             # Reviewer Dashboard
│   │   ├── sponsor/              # Sponsor Dashboard
│   │   ├── volunteer/            # Volunteer Dashboard
│   │   ├── layout/               # AppLayout, Sidebar, PublicLayout
│   │   ├── ui/                   # Reusable UI Components
│   │   └── *.tsx                 # Shared Components
│   ├── services/                 # API Client & Service Layer
│   ├── stores/                   # Zustand State Management
│   └── types/                    # TypeScript Types & Interfaces
├── backend/                      # NestJS Backend
│   ├── src/
│   │   ├── modules/              # Feature Modules
│   │   │   ├── auth/             # Authentication (JWT, Refresh, OAuth)
│   │   │   ├── users/            # User Management
│   │   │   ├── hackathons/       # Hackathon CRUD & Lifecycle
│   │   │   ├── teams/            # Team Management & Invites
│   │   │   ├── submissions/      # Submission Management
│   │   │   ├── judging/          # Judging, Scoring, Leaderboard
│   │   │   ├── announcements/    # Announcements
│   │   │   └── notifications/    # User Notifications
│   │   ├── common/               # Guards, Decorators, Filters, Interceptors
│   │   ├── config/               # Environment Validation & Configuration
│   │   ├── gateways/             # WebSocket Gateway
│   │   └── prisma/               # Prisma Service & Module
│   └── prisma/
│       ├── schema.prisma         # 25+ Models, Full Enterprise Schema
│       └── seed.ts               # Database Seeding
├── docker-compose.yml            # Docker: PostgreSQL + Backend + Frontend
├── Dockerfile.web                # Frontend Production Build
└── nginx.conf                    # Nginx Reverse Proxy Config
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, TypeScript 5.8 |
| Styling | Tailwind CSS v4, Framer Motion |
| State | Zustand |
| Routing | React Router v7 |
| Icons | Lucide React |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (access + refresh), bcrypt, Passport |
| API Docs | Swagger / OpenAPI |
| Deployment | Docker, Nginx |

## Roles & Permissions

The platform supports **9 distinct user roles**, each with a dedicated dashboard:

| Role | Dashboard Route | Description |
|------|----------------|-------------|
| `SUPER_ADMIN` | `/admin` | Full platform control |
| `ADMIN` | `/admin` | Platform administration |
| `ORGANIZER` | `/organizer` | Hackathon creation & management |
| `JUDGE` | `/judge` | Submission evaluation & scoring |
| `MENTOR` | `/mentor` | Team mentoring & session management |
| `PARTICIPANT` | `/dashboard` | Hackathon participation & teams |
| `VOLUNTEER` | `/volunteer` | Event support & task management |
| `SPONSOR` | `/sponsor` | Sponsorship analytics & branding |
| `REVIEWER` | `/reviewer` | Submission review & scoring |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or pnpm

### Frontend Setup
```bash
npm install
npm run dev          # http://localhost:5173
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Configure DATABASE_URL, JWT_SECRET, etc.
npx prisma generate
npx prisma migrate dev
npm run start:dev    # http://localhost:3001
```

### Docker Setup
```bash
docker-compose up -d
```

## Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3001/api/v1
```

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/hackathon_db
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRATION=15m
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | User registration | Public |
| POST | `/api/v1/auth/login` | User login | Public |
| POST | `/api/v1/auth/refresh-token` | Refresh JWT | Public |
| POST | `/api/v1/auth/forgot-password` | Request password reset | Public |
| POST | `/api/v1/auth/reset-password` | Reset password | Public |
| GET | `/api/v1/users/me` | Get current user profile | JWT |
| PATCH | `/api/v1/users/me` | Update profile | JWT |
| GET | `/api/v1/hackathons` | List hackathons (paginated) | JWT |
| POST | `/api/v1/hackathons` | Create hackathon | JWT + Organizer |
| GET | `/api/v1/hackathons/:id` | Get hackathon detail | JWT |
| PATCH | `/api/v1/hackathons/:id` | Update hackathon | JWT + Owner |
| POST | `/api/v1/teams` | Create team | JWT |
| POST | `/api/v1/teams/:id/join` | Join team by invite code | JWT |
| POST | `/api/v1/submissions` | Create submission | JWT |
| POST | `/api/v1/judging/scores` | Submit score | JWT + Judge |
| GET | `/api/v1/judging/leaderboard/:hackathonId` | Get leaderboard | JWT |
| GET | `/api/v1/notifications` | Get user notifications | JWT |

## Build

```bash
# Frontend production build
npm run build

# Backend production build
cd backend && npm run build
```

## License

MIT
