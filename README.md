<div align="center">

# ReimburseFlow

**Expense reimbursements, simplified.**

A modern expense management platform with dynamic approval workflows,
multi-currency support, and real-time analytics — built for teams that move fast.

[Get Started](#getting-started) · [Features](#features) · [Tech Stack](#tech-stack)

</div>

---

## The Landing Page

A neobrutalism-inspired landing page with bold typography, interactive FAQ sections with sound effects, and a clear call to action.

![Landing Page](Landing%20page.png)

---

## Dashboard

Everything at a glance — total expenses, approval rates, category breakdowns, and spending trends.
All amounts are converted to INR using live exchange rates.

![Dashboard](dashboard.jpeg)

---

## Approvals

Managers and admins see a clean queue of pending expenses waiting for their decision.
One click to approve, one click to reject — with optional comments at each step.

![Approvals](approvals.jpeg)

---

## Team Management

View your entire organization. Add members, assign roles, and set up reporting chains
that power the dynamic approval workflows.

![Team](team.jpeg)

---

## Approval Rules

Configure how expenses get resolved. Choose between percentage-based thresholds,
specific approver requirements, or a hybrid of both.

![Approval Rules](approval%20rules.jpeg)

---

## Features

🔄 **Dynamic Approval Chains**
Approval steps are built automatically by walking the manager hierarchy — no hardcoded chains, no manual routing.

💱 **Multi-Currency Support**
Submit expenses in any currency. Live exchange rates from [exchangerate-api.com](https://exchangerate-api.com) convert everything to your base currency for unified reporting.

🌍 **160+ Currencies**
Currency data pulled from the [REST Countries API](https://restcountries.com) with popular currencies (INR, USD, EUR, GBP) pinned to the top.

📊 **Real-Time Analytics**
Interactive charts powered by Recharts — spend by category, status distribution donuts, and monthly trend lines.

🏢 **Multi-Tenant**
Each signup creates an isolated company. Users, expenses, and rules are all company-scoped.

🔐 **Role-Based Access**
Three roles — Admin, Manager, Employee — each with distinct permissions and views.

🌙 **Dark & Light Mode**
Full theme support with smooth transitions, persisted to localStorage.

🔊 **Sound Design**
A custom "faaah" audio plays on your first interaction with the landing page.

---

## How It Works

```
Employee submits expense
        ↓
System walks the managerId chain → builds approval steps
        ↓
Step 1 approver reviews
        ↓
   ┌────┴────┐
   Approve    Reject → expense rejected immediately
   ↓
   Evaluate rules
   ↓
   ├── Rules pass → expense approved ✅
   └── Rules not met → next approver's turn
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, shadcn/ui |
| Charts | Recharts with shadcn ChartContainer |
| Animations | Framer Motion |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL + Prisma 6 ORM |
| Auth | JWT + bcrypt |
| APIs | REST Countries, ExchangeRate API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use [Neon](https://neon.tech) for serverless Postgres)

### Setup

```bash
# Clone the repo
git clone https://github.com/Proxy939/Reimbursement-management.git
cd Reimbursement-management

# Install server dependencies
cd server
npm install

# Set up your environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev

# Start the backend
npm run dev
```

```bash
# In a new terminal — start the frontend
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173` with the API on `http://localhost:5000`.

### Environment Variables

Create `server/.env`:

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

---

## Roles & Permissions

| | Employee | Manager | Admin |
|---|:---:|:---:|:---:|
| Submit expenses | ✓ | ✓ | ✓ |
| View own expenses | ✓ | ✓ | ✓ |
| Review & approve | — | ✓ | ✓ |
| Manage team | — | — | ✓ |
| Configure rules | — | — | ✓ |

---

## Project Structure

```
├── client/                → React frontend
│   ├── src/
│   │   ├── pages/         → Dashboard, Expenses, Approvals, Team, Rules
│   │   ├── components/    → Reusable UI (shadcn + custom)
│   │   ├── hooks/         → useCurrency, useExpenses, useAuth
│   │   ├── context/       → AuthContext, ThemeContext
│   │   └── services/      → API client (Axios)
│   └── public/            → Static assets
│
└── server/                → Express API
    ├── controllers/       → Route handlers
    ├── services/          → Business logic
    ├── middlewares/        → Auth + error handling
    ├── prisma/            → Schema + migrations
    └── routes/            → API route definitions
```

---

<div align="center">

Built with ☕ and late nights

</div>

## Contact 
- Email : punmesh56@gmail.com
- LinkedIn : https://linkedin.com/in/unmeshpatil2005
- Leetcode : https://leetcode.com/u/unmesh3010
