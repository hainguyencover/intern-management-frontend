# 🎓 Intern Management System — Frontend

> **A modern React frontend for managing interns, tasks, evaluations, and reports.**

---

## 🏗️ Architecture Overview

```
src/
│
├── api/              # Axios client configuration & API base setup
├── auth/             # Authentication guards and context
├── assets/           # Static assets (images, icons)
├── components/       # Reusable shared UI components
│   └── ui/           # Primitive UI components (shadcn-style)
├── context/          # React context providers
├── layouts/          # Page layout wrappers (Admin, Auth, etc.)
├── locales/          # i18n translation files (vi, en)
├── pages/            # Feature pages organized by role/domain
│   ├── admin/        # Admin pages: user management, roles, backup
│   ├── auth/         # Login, register pages
│   ├── hr/           # HR pages: applications, analytics
│   ├── intern/       # Intern pages: profile, tasks, reports
│   └── mentor/       # Mentor pages: tasks, evaluations
├── services/         # Feature-specific API call functions
├── store/            # Redux Toolkit state management
│   └── slices/       # Feature slices
└── utils/            # Utility helpers
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite (rolldown-vite) |
| Styling | TailwindCSS 3 |
| UI Components | Radix UI + shadcn-style components |
| UI Library | Ant Design + Material UI |
| State Management | Redux Toolkit + Zustand |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| i18n | i18next (vi/en) |
| Charts | Recharts |
| Editor | CKEditor 5 |
| Testing | Playwright (E2E) |
| Containerization | Docker + Nginx |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- Backend server running at `http://localhost:8080`

### 1. Clone & Configure
```bash
git clone <repository-url>
cd intern-management-frontend
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The app starts at `http://localhost:5173`.

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## 🌍 Environment Variables

See [.env.example](.env.example) for the complete list:

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_APP_NAME` | Application name | `Intern Management System` |
| `VITE_DEBUG` | Enable debug mode | `false` |

> ⚠️ **Never commit `.env` to version control.** Only `.env.example` should be committed.

---

## 🔐 Authentication

JWT-based authentication with role-based access control:

| Role | Access |
|---|---|
| `ADMIN` | Full system access |
| `HR` | Applications, analytics, exports |
| `MENTOR` | Task management, evaluations |
| `INTERN` | Profile, assigned tasks, reports |

Tokens are stored in HTTP-only cookies / localStorage and included in every API request via Axios interceptors.

---

## 📁 Feature Pages Overview

| Route prefix | Domain |
|---|---|
| `/login`, `/register` | Authentication |
| `/admin/*` | Admin dashboard, users, roles, permissions |
| `/hr/*` | HR: applications, analytics,  exports |
| `/mentor/*` | Mentor: tasks, evaluations, dashboard |
| `/intern/*` | Intern: profile, tasks, weekly reports |
| `/programs/*` | Internship programs & groups |

---

## 🐳 Docker

### Build
```bash
docker build -t intern-management-frontend:1.0.0 .
```

### Run
```bash
docker run -p 3000:80 intern-management-frontend:1.0.0
```

The app is served by Nginx on port 80 inside the container.

---

## 🧪 E2E Testing (Playwright)

```bash
# Run all e2e tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui
```

Test files are located in `tests-e2e/`.

---

## 🌐 i18n (Internationalization)

The app supports English and Vietnamese:

| Language | File |
|---|---|
| English | `src/locales/en/` |
| Vietnamese | `src/locales/vi/` |

---

## 🌿 Git Workflow

```
main        → production
develop     → staging
feature/*   → new features
hotfix/*    → production hotfixes
```

### Commit Convention
```
feat: add intern task page
fix: fix axios interceptor token refresh
refactor: rename API service files
chore: update dependencies
docs: update README
test: add playwright login test
```

---

## 👥 Default Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | admin123 |
| HR | hr@company.com | hr123 |
| Mentor | mentor1@company.com | mentor123 |
| Intern | intern@student.com | intern123 |

> ⚠️ Change all credentials before deploying to production.
