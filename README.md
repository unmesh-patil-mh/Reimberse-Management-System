# 💸 Reimbursement Management System

A full-stack expense reimbursement platform with multi-step sequential approval workflows, role-based access control, and company-scoped multi-tenancy.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Approval Workflow](#approval-workflow)
- [Role-Based Access Control](#role-based-access-control)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

This system allows employees to submit expense reimbursement requests which then flow through a configurable multi-step approval chain. Admins can define custom approval rules per company, and the system dynamically builds the approver chain based on the organizational hierarchy stored in the database.

### Key Features

- **Multi-tenant**: Each signup creates an isolated company; users, expenses, and rules are all company-scoped.
- **Dynamic approval chains**: Approval steps are built at expense creation time by walking the `managerId` hierarchy — no hardcoded chains.
- **Configurable approval rules**: Companies can define `PERCENTAGE`, `SPECIFIC`, or `HYBRID` rules that determine when an expense is considered fully approved.
- **Sequential step processing**: Only the current step's approver can act; approvers cannot skip the queue.
- **JWT Authentication**: All protected routes require a valid Bearer token.
- **Role-Based Authorization**: Three roles — `ADMIN`, `MANAGER`, `EMPLOYEE` — with distinct permissions.

---

## Tech Stack

### Backend (`/server`)

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **Prisma ORM** | Type-safe database client & migrations |
| **PostgreSQL** | Relational database |
| **JWT (`jsonwebtoken`)** | Stateless authentication tokens |
| **bcryptjs** | Password hashing (salt rounds: 12) |
| **dotenv** | Environment variable management |
| **nodemon** | Development hot-reload |

### Frontend (`/client`)

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router DOM 7** | Client-side routing |
| **Axios** | HTTP client |
| **Tailwind CSS 4** | Utility-first styling |

> **Note:** The frontend is currently scaffolded (default Vite + React template). Business UI is yet to be built.

---

## Project Structure

```
reimbursement-management/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx                 # Root component (scaffold)
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                         # Node.js / Express backend
    ├── server.js                   # Entry point — mounts all routes
    ├── config/
    │   └── db.js                   # Prisma client singleton
    ├── prisma/
    │   ├── schema.prisma           # Database models & enums
    │   └── migrations/             # Prisma migration history
    ├── middlewares/
    │   ├── auth.middleware.js      # JWT authentication + role authorization
    │   └── error.middleware.js     # Global error handler
    ├── routes/
    │   ├── auth.routes.js          # POST /api/auth/signup, /login
    │   ├── user.routes.js          # CRUD for users (admin-only)
    │   ├── expense.routes.js       # Expense submission & retrieval
    │   ├── approval.routes.js      # Approve / reject expense steps
    │   ├── rule.routes.js          # Approval rule management
    │   ├── company.routes.js       # Company info
    │   └── health.routes.js        # GET /api/health
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── expense.controller.js
    │   ├── approval.controller.js
    │   ├── rule.controller.js
    │   ├── company.controller.js
    │   └── health.controller.js
    ├── services/
    │   ├── auth.service.js         # signup, login logic
    │   ├── user.service.js         # createUser, getAllUsers, updateUser
    │   ├── expense.service.js      # createExpense, getMyExpenses, getExpenseById
    │   ├── approval.service.js     # getPendingApprovals, approveExpense, rejectExpense
    │   ├── rule.service.js         # createRule, getRules
    │   └── company.service.js      # getCompany
    └── utils/
        └── AppError.js             # Custom operational error class
```

---

## Architecture

```
                    ┌────────────────────────────────┐
                    │          React Client           │
                    │  (Vite + React Router + Axios)  │
                    └──────────────┬─────────────────┘
                                   │ HTTP (REST)
                                   ▼
                    ┌────────────────────────────────┐
                    │        Express Server           │
                    │                                │
                    │  ┌──────────────────────────┐  │
                    │  │     Auth Middleware       │  │
                    │  │  (JWT verify + DB lookup) │  │
                    │  └────────────┬─────────────┘  │
                    │               │                │
                    │  ┌────────────▼─────────────┐  │
                    │  │     Role Middleware       │  │
                    │  │ (ADMIN / MANAGER guard)   │  │
                    │  └────────────┬─────────────┘  │
                    │               │                │
                    │  ┌────────────▼─────────────┐  │
                    │  │       Controllers         │  │
                    │  └────────────┬─────────────┘  │
                    │               │                │
                    │  ┌────────────▼─────────────┐  │
                    │  │        Services           │  │
                    │  │  (All business logic)     │  │
                    │  └────────────┬─────────────┘  │
                    │               │                │
                    │  ┌────────────▼─────────────┐  │
                    │  │       Prisma ORM          │  │
                    │  └────────────┬─────────────┘  │
                    └───────────────┼────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │          PostgreSQL             │
                    └────────────────────────────────┘
```

---

## Database Schema

### Enums

| Enum | Values |
|---|---|
| `Role` | `ADMIN`, `MANAGER`, `EMPLOYEE` |
| `ExpenseStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `StepStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `RuleType` | `PERCENTAGE`, `SPECIFIC`, `HYBRID` |

### Models

#### `Company`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | Company name |
| `baseCurrency` | String | Default: `INR` |
| `users` | User[] | All users in company |
| `approvalRules` | ApprovalRule[] | Company approval config |

#### `User`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | |
| `email` | String | Unique |
| `password` | String | bcrypt hash |
| `role` | Role | Default: `EMPLOYEE` |
| `companyId` | String | FK → Company |
| `managerId` | String? | FK → User (self-referential hierarchy) |

#### `Expense`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `amount` | Float | |
| `currency` | String | Default: `INR` |
| `category` | String | |
| `description` | String? | |
| `date` | DateTime | |
| `status` | ExpenseStatus | Default: `PENDING` |
| `currentStepOrder` | Int | Tracks active step (starts at 1) |
| `createdById` | String | FK → User |

#### `ApprovalStep`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `expenseId` | String | FK → Expense |
| `approverId` | String | FK → User |
| `status` | StepStatus | Default: `PENDING` |
| `sequenceOrder` | Int | Order in the chain |
| `comments` | String? | Optional remarks |
| Unique constraint | `(expenseId, sequenceOrder)` | |

#### `ApprovalRule`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `companyId` | String | FK → Company |
| `type` | RuleType | `PERCENTAGE`, `SPECIFIC`, `HYBRID` |
| `percentageValue` | Float? | Required for `PERCENTAGE` / `HYBRID` |
| `specificApproverId` | String? | Required for `SPECIFIC` / `HYBRID` |

---

## API Reference

All protected routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register + auto-create company; first user is `ADMIN` |
| `POST` | `/api/auth/login` | Public | Login; returns JWT + user profile |

**Signup body:**
```json
{
  "name": "Alice",
  "email": "alice@acme.com",
  "password": "secret123",
  "companyName": "Acme Corp",
  "baseCurrency": "INR"
}
```

---

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users` | ADMIN | Create a new employee/manager within company |
| `GET` | `/api/users` | ADMIN, MANAGER | List all users in the company |
| `PATCH` | `/api/users/:id` | ADMIN | Update name, role, or managerId |

**Create user body:**
```json
{
  "name": "Bob",
  "email": "bob@acme.com",
  "password": "pass123",
  "role": "EMPLOYEE",
  "managerId": "<manager-user-id>"
}
```

---

### Expenses

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/expenses` | Authenticated | Submit a new expense |
| `GET` | `/api/expenses/my` | Authenticated | List own submitted expenses |
| `GET` | `/api/expenses/:id` | Authenticated | Get single expense (company-scoped) |

**Create expense body:**
```json
{
  "amount": 2500.00,
  "currency": "INR",
  "category": "Travel",
  "description": "Flight to Delhi",
  "date": "2026-03-28"
}
```

> On creation, the system dynamically builds an approval chain by walking up the `managerId` hierarchy. Steps are created in sequence order.

---

### Approvals

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/approvals/pending` | ADMIN, MANAGER | List expenses pending this user's action |
| `POST` | `/api/approvals/:expenseId/approve` | ADMIN, MANAGER | Approve current step |
| `POST` | `/api/approvals/:expenseId/reject` | ADMIN, MANAGER | Reject expense immediately |

**Approve/Reject body (optional):**
```json
{
  "comments": "Approved for business trip."
}
```

---

### Approval Rules

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/rules` | ADMIN | Create a new rule for the company |
| `GET` | `/api/rules` | ADMIN | List all rules for the company |

**Create rule body:**
```json
{
  "type": "PERCENTAGE",
  "percentageValue": 50
}
```

| Rule Type | Behavior |
|---|---|
| `PERCENTAGE` | Expense approved when `approvedSteps / totalSteps >= threshold` |
| `SPECIFIC` | Expense approved when a designated approver has approved |
| `HYBRID` | Either `PERCENTAGE` or `SPECIFIC` condition passes |

---

### Other

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server health check |
| `GET` | `/api/companies/:id` | Authenticated | Get company details |

---

## Approval Workflow

```
Employee submits expense
         │
         ▼
System walks managerId chain → builds ordered ApprovalStep list
         │
         ▼
  currentStepOrder = 1  (expense created as PENDING)
         │
         ▼
  Manager at step 1 sees it in /approvals/pending
         │
    ┌────┴──────────────┐
    │ Approve           │ Reject
    ▼                   ▼
evaluateRules()      Expense = REJECTED (stops immediately)
    │
    ├── rules pass? → Expense = APPROVED ✅
    │
    └── rules not met? → currentStepOrder++ → next approver's turn
```

**Circular reference protection**: The manager chain traversal tracks visited IDs to prevent infinite loops.

**Company isolation**: Users can only view expenses from their own company.

---

## Role-Based Access Control

| Action | EMPLOYEE | MANAGER | ADMIN |
|---|:---:|:---:|:---:|
| Submit expense | ✅ | ✅ | ✅ |
| View own expenses | ✅ | ✅ | ✅ |
| View pending approvals | ❌ | ✅ | ✅ |
| Approve / Reject expense | ❌ | ✅ | ✅ |
| Create users | ❌ | ❌ | ✅ |
| List all users | ❌ | ✅ | ✅ |
| Update user (role/manager) | ❌ | ❌ | ✅ |
| Create approval rules | ❌ | ❌ | ✅ |
| View approval rules | ❌ | ❌ | ✅ |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm

### 1. Clone and install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Set up environment variables

Create `server/.env` (see [Environment Variables](#environment-variables) below).

### 3. Run database migrations

```bash
cd server
npx prisma migrate dev
```

### 4. Start the servers

```bash
# Terminal 1 — Backend (runs on port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (runs on port 5173)
cd client
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `/server` directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/reimbursement_db"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
```

---

## Current Implementation Status

| Layer | Status |
|---|---|
| Database schema (Prisma) | ✅ Complete |
| Auth (signup/login + JWT) | ✅ Complete |
| User management (CRUD) | ✅ Complete |
| Expense submission | ✅ Complete |
| Dynamic approval chain building | ✅ Complete |
| Approve / Reject workflow | ✅ Complete |
| Configurable approval rules (3 types) | ✅ Complete |
| Company scoping / multi-tenancy | ✅ Complete |
| Global error handling middleware | ✅ Complete |
| React frontend UI | 🚧 Scaffolded (not yet built) |
