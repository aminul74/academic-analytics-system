# Academic Analytics System

A web-based academic management dashboard for tracking students, courses, faculty, and grades. Built with Next.js and backed by a local JSON Server for data persistence.

---

## Tech Stack

| Layer              | Technology                   |
| ------------------ | ---------------------------- |
| Framework          | Next.js 16 (App Router)      |
| Language           | TypeScript                   |
| Styling            | Tailwind CSS 4               |
| Forms & Validation | Formik, Yup                  |
| HTTP Client        | Axios                        |
| Charts             | ApexCharts, react-apexcharts |
| Mock Backend       | JSON Server                  |

---

## Key Features

- **Dashboard** — Summary statistics (total students, courses, faculty), enrollment bar chart, top students table, and one-click CSV export for each entity.
- **Student Management** — List, search, create, view, and edit student records including year of study, enrolled courses, and CGPA.
- **Course Management** — List, search, create, view, and edit courses with enrollment counts and assigned faculty.
- **Faculty Management** — List, search, create, view, and edit faculty profiles. A dedicated manage page supports bulk operations: assigning students to courses, updating grades, and removing students from courses.
- **Grade Tracking** — Grades stored per student per course and surfaced in the top students table and faculty management workflow.
- **Search & Filter** — Debounced search with optional dropdown filters across all listing pages.
- **Toast Notifications** — Global toast context for success and error feedback.
- **CSV Export** — Export students, courses, or faculty data as a dated CSV file directly from the dashboard.
- **Simulated Authentication** — Login and register forms with localStorage-based session. No backend authentication is implemented; any valid-looking credentials are accepted for demonstration purposes.

---

## Project Structure

```
academic-analytics-system/
 app/                        # Next.js App Router pages
    page.tsx                # Login / Register page
    layout.tsx              # Root layout with sidebar navigation
    dashboard/              # Dashboard overview
    students/               # Student list, detail, create, edit
    courses/                # Course list, detail, create, edit
    faculty/                # Faculty list, detail, create, edit, manage
 components/
    charts/                 # EnrollmentBarChart (ApexCharts)
    faculty/                # BulkOperations panel
    filters/                # SearchFilter with debounce
    forms/                  # AuthForm, StudentForm, CourseForm, FacultyForm
    tables/                 # DataTable, TopStudentsTable
    ui/                     # Button, Toast, ConfirmDialog, LoadingSpinner, ErrorMessage
 lib/
    api.ts                  # Axios wrapper targeting JSON Server
    exportUtils.ts          # CSV export helper
    toastContext.tsx         # Global toast state
    utils.ts                # Shared utilities (debounce, etc.)
 types/
    index.d.ts              # Shared TypeScript interfaces
 public/
     db.json                 # JSON Server database file
```

---

## Installation & Setup

### Prerequisites

- Node.js 18 or later
- npm

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd academic-analytics-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start both servers in separate terminals:

   ```bash
   # Terminal 1 — Mock API server (port 3002)
   npm run server

   # Terminal 2 — Next.js development server (port 3001)
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

> The login page displays example credentials for the demo. Any email/password combination will be accepted.

---

## Environment Variables

Only one optional environment variable is used:

| Variable          | Default                 | Description                           |
| ----------------- | ----------------------- | ------------------------------------- |
| `MOCK_SERVER_URL` | `http://localhost:3002` | Base URL for the JSON Server mock API |

Create a `.env.local` file in the project root to override the default:

```env
MOCK_SERVER_URL=http://localhost:3002
```

---

## Database Setup

The application uses [JSON Server](https://github.com/typicode/json-server) as a mock REST API. The database file is located at `public/db.json` and contains four collections:

- `students` — Student records with name, email, year, enrolled courses, and CGPA.
- `courses` — Course records with name, enrollment count, and assigned faculty.
- `faculty` — Faculty records with name, email, and assigned courses.
- `grades` — Grade entries linking a student and course to a numeric grade.

No database installation or migration is required. The `public/db.json` file is the single source of truth and is read/written directly by JSON Server at runtime.

---

## Available Scripts

| Command          | Description                                       |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Start the Next.js development server on port 3001 |
| `npm run build`  | Build the application for production              |
| `npm run start`  | Start the production server                       |
| `npm run lint`   | Run ESLint across the project                     |
| `npm run server` | Start the JSON Server mock API on port 3002       |

> Both `npm run server` and `npm run dev` must be running concurrently for the application to function.

---

## Deployment

This project is designed for local development and demonstration use. For a production deployment:

1. Run `npm run build` to produce an optimized build.
2. Replace JSON Server with a real database and API layer, as JSON Server is not suitable for production use.
3. Implement proper authentication in place of the current localStorage-based simulation.
4. Deploy the Next.js application to a platform such as [Vercel](https://vercel.com) or a self-hosted Node.js environment.
5. Set the `MOCK_SERVER_URL` environment variable on the deployment platform to point to the real API base URL.
