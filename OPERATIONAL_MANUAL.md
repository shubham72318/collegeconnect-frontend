# CollegeConnect — Project Operational Manual (Developer Side)

A complete guide for developers to set up, understand, operate, and extend the **CollegeConnect (CC)** platform — a three-way placement management system connecting **Students**, **Colleges**, and **Companies**.

---

## 1. Project Overview

**CollegeConnect** is a role-based placement management web application where:

- **Companies** post placement drives (job openings).
- **Colleges** review and approve drives before they reach their students.
- **Students** browse approved drives and apply; companies then shortlist/select candidates.

**Live URLs**
- Preview: `https://id-preview--01ad7b18-dfb5-4e9a-9856-340c2daa098a.lovable.app`
- Published: `https://collegeconnect-frontend.lovable.app`

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| State / Data | TanStack Query, React Context |
| Backend | Lovable Cloud (Supabase under the hood) |
| Auth | Supabase Auth (email + password) |
| Database | Postgres with Row Level Security (RLS) |
| Notifications | Sonner + shadcn Toaster |

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18+ and npm (install via [nvm](https://github.com/nvm-sh/nvm))
- Git

### Steps
```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start the dev server (hot-reload)
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment Variables
The `.env` file is **auto-managed by Lovable Cloud** — do **NOT** edit it manually:
```
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
```

---

## 4. Project Structure

```
src/
├── components/              # Shared UI + role sidebars + DashboardLayout
│   ├── ui/                  # shadcn/ui primitives (DO NOT modify directly)
│   ├── CollegeSidebar.tsx
│   ├── CompanySidebar.tsx
│   ├── StudentSidebar.tsx
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx   # Route guard (auth + role check)
├── contexts/
│   └── AuthContext.tsx      # Auth state + profile fetching
├── integrations/supabase/
│   ├── client.ts            # AUTO-GENERATED — do not edit
│   └── types.ts             # AUTO-GENERATED from DB schema
├── pages/
│   ├── Landing.tsx          # Public landing page
│   ├── Login.tsx / Signup.tsx
│   ├── college/             # College-only pages
│   ├── company/             # Company-only pages
│   └── student/             # Student-only pages
├── hooks/                   # use-toast, use-mobile
├── lib/utils.ts             # cn() helper
├── index.css                # Design tokens (HSL semantic colors)
└── App.tsx                  # Routes + providers

supabase/
├── config.toml              # Project ID only — do not edit
└── migrations/              # SQL migration history (READ-ONLY)
```

---

## 5. Database Schema

All tables live in the `public` schema. RLS is enabled on every table.

### `profiles`
Stores extended user info. Created automatically via the `handle_new_user` trigger when a user signs up.
| Column | Notes |
|---|---|
| `user_id` | FK to `auth.users` |
| `role` | enum: `student` \| `college` \| `company` |
| `full_name`, `email`, `avatar_url` | Personal info |
| `college_name`, `company_name` | Role-specific fields |

### `user_roles`
Separate roles table (security best practice — prevents privilege escalation).
| Column | Notes |
|---|---|
| `user_id` | User reference |
| `role` | `app_role` enum |

### `drives`
Job/placement drives posted by companies.
| Column | Notes |
|---|---|
| `company_user_id`, `company_name` | Owner |
| `package`, `vacancies`, `visit_date` | Drive details |

### `drive_college_approvals`
Per-college approval status for each drive.
| Column | Notes |
|---|---|
| `drive_id` | FK to `drives` |
| `college_user_id`, `college_name` | College reviewing |
| `status` | `pending` \| `approved` \| `rejected` |

### `applications`
Student applications to drives.
| Column | Notes |
|---|---|
| `drive_id` | FK to `drives` |
| `student_user_id`, `student_name`, `student_college_name` | Applicant snapshot |
| `status` | `applied` \| `selected` \| `rejected` |

### Helper function
```sql
public.has_role(_user_id uuid, _role app_role) → boolean
```
Used in RLS policies to check a user's role without recursion (SECURITY DEFINER).

---

## 6. Authentication Flow

1. User signs up via `/signup` → choose role (student/college/company).
2. Supabase creates an `auth.users` record.
3. The `handle_new_user` trigger automatically inserts rows into `profiles` and `user_roles`.
4. `AuthContext.tsx` listens to `onAuthStateChange` and fetches the profile.
5. `ProtectedRoute` guards each dashboard route by checking `profile.role === allowedRole`.

> **Important:** Never use anonymous sign-ins. Email confirmation is currently **disabled** for faster testing — re-enable in production via Cloud → Auth settings.

---

## 7. Three-Way Placement Workflow

```
┌─────────┐  posts    ┌────────┐  approves   ┌─────────┐  applies  ┌────────┐
│ COMPANY │ ────────▶ │ DRIVE  │ ──────────▶ │ COLLEGE │ ────────▶ │STUDENT │
└─────────┘           └────────┘             └─────────┘           └────────┘
                                                                        │
                                                                        ▼
                                                              ┌──────────────────┐
                                                              │ COMPANY shortlists│
                                                              │ / selects candidate│
                                                              └──────────────────┘
```

1. **Company** → `/company/post-job` creates a `drives` row + one `drive_college_approvals` row per college (status `pending`).
2. **College** → `/college/approvals` sets status to `approved` or `rejected`.
3. **Student** → `/student/companies` sees only drives approved by their college and applies.
4. **Company** → `/company/applications` reviews applicants and updates status to `selected` / `rejected`.
5. Selected students appear under `/company/shortlisted` and the student sees the status on `/student/applications`.

---

## 8. Routing & Role Access

All protected routes are wrapped in `<ProtectedRoute allowedRole="...">`.

| Role | Routes |
|---|---|
| Public | `/`, `/login`, `/signup` |
| Student | `/student/dashboard`, `/student/companies`, `/student/applications`, `/student/profile` |
| College | `/college/dashboard`, `/college/companies`, `/college/approvals`, `/college/students`, `/college/reports`, `/college/profile` |
| Company | `/company/dashboard`, `/company/post-job`, `/company/applications`, `/company/shortlisted`, `/company/profile` |

---

## 9. Design System

All colors are defined as **HSL semantic tokens** in `src/index.css` and `tailwind.config.ts`. **Never** use raw colors like `bg-blue-500` in components — always use tokens (`bg-primary`, `text-foreground`, etc.).

**Role color identity:**
- 🔵 **Blue** — Colleges
- 🟢 **Green / Emerald** — Companies
- 🟣 **Purple / Violet** — Students

UI vibe: light, professional, LinkedIn-like.

---

## 10. Common Developer Tasks

### Add a new page
1. Create the file under `src/pages/<role>/NewPage.tsx`.
2. Wrap content in `<DashboardLayout title="..." theme="..." sidebar={<RoleSidebar />}>`.
3. Add a `<Route>` in `src/App.tsx` wrapped in `<ProtectedRoute allowedRole="...">`.
4. Add a nav link in the corresponding sidebar.

### Add a new database table
1. Use the Lovable Cloud migration tool (do **not** hand-edit `supabase/migrations/`).
2. Always enable RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
3. Add appropriate `SELECT / INSERT / UPDATE / DELETE` policies per role.
4. `src/integrations/supabase/types.ts` regenerates automatically.

### Query the database
```ts
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase
  .from("drives")
  .select("*")
  .order("created_at", { ascending: false });
```

### Add an RLS policy (template)
```sql
CREATE POLICY "Companies update their own drives' applications"
ON public.applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.drives d
    WHERE d.id = applications.drive_id
      AND d.company_user_id = auth.uid()
  )
);
```

---

## 11. Files You Must NEVER Edit

- `src/integrations/supabase/client.ts` — auto-generated
- `src/integrations/supabase/types.ts` — auto-generated from DB schema
- `.env` — auto-managed by Lovable Cloud
- `supabase/config.toml` (project_id line) — system-managed
- `supabase/migrations/*.sql` — historical record

---

## 12. Deployment

### Via Lovable
1. Open the project in Lovable.
2. Click **Share → Publish**.
3. The published URL updates instantly.

### Custom Domain
**Project → Settings → Domains → Connect Domain.**

### Self-hosting
After connecting GitHub, the codebase is standard Vite + React — deploy to Vercel, Netlify, Cloudflare Pages, etc. You'll need to provide the same `VITE_SUPABASE_*` env variables.

---

## 13. Debugging Checklist

| Symptom | Likely Cause | Fix |
|---|---|---|
| "Could not find table public.X" | Schema/column mismatch with frontend | Check `types.ts` matches code; run a migration |
| Insert/Update silently fails | Missing RLS policy | Add the right policy for the role |
| Student doesn't see approved drive | College approval row missing or status ≠ `approved` | Check `drive_college_approvals` |
| Logged in but redirected to `/login` | Session not loaded yet | Verify `AuthContext` `loading` state |
| Wrong dashboard shown | Role mismatch | Confirm `profiles.role` value |

Use the browser console + the Network tab (Supabase requests are visible) for live debugging.

---

## 14. Security Notes

- Roles are stored in `user_roles`, **never** trusted from client storage.
- All sensitive checks use `public.has_role()` inside RLS — not in JS.
- Never expose the `service_role` key. The `anon` (publishable) key is safe in the frontend.
- Always wrap company/college/student-only mutations with RLS policies — UI checks alone are not security.

---

## 15. Useful Links

- [Lovable Docs](https://docs.lovable.dev/)
- [Lovable Cloud](https://docs.lovable.dev/features/cloud)
- [Supabase JS Reference](https://supabase.com/docs/reference/javascript)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Maintainer note:** Keep this manual updated whenever you add a new role, table, or major workflow. Future developers (and your future self) will thank you.
