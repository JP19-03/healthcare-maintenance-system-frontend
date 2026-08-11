# BioMedCare Frontend - Healthcare Maintenance System 🏥✨

A modern, high-performance React 19 single-page application built with TypeScript, Tailwind CSS, TanStack Query, and standard mobile-first UI patterns for managing hospital machinery, maintenance work orders, and real-time operational analytics.

---

## 🎨 Design & Key Features

### 1. 📊 Operations Analytics Dashboard (`/dashboard`)
- **Hospital Readiness Score Card**: Real-time gauge displaying equipment operational rate (%).
- **Mean Time to Resolution (MTTR)**: Live calculation of average repair duration (in hours).
- **Equipment Distribution by Hospital Unit**: Progress bar breakdown per department (Radiology, ICU, Urgent Care).
- **Technician Repair Matrix**: Workload breakdown comparing assigned vs. resolved tickets per technician.
- **Active Breakdown Stream**: Real-time alert list for active breakdown tickets.

### 2. 🩺 Medical Equipment Inventory (`/equipment`)
- **Equipment Directory**: Grid & table view with KPI scorecards (`Total`, `Operational`, `Broken`, `In Maintenance`).
- **Equipment Registration & Editing**: Modal form for creating and updating machine specifications.
- **Direct Breakdown Reporting**: Click *"Report Breakdown"* on any operational machine to trigger pre-filled work order creation.
- **Machine Specs & Maintenance History**: Click any machine name to open a dedicated modal featuring full specs and historical repair logs (`GET /api/v1/tickets/equipment/{id}`).
- **Role Restrictions**: Technicians (`ROLE_TECH`) have read-only access to equipment data without register/edit buttons.

### 3. 🛠️ Work Orders & Maintenance Queue (`/tickets` & `/my-queue`)
- **Global Work Orders (`/tickets`)**: Complete directory of breakdown reports for managers and admins.
- **Technician Queue (`/my-queue`)**: Filtered work queue specifically for technicians (`GET /api/v1/tickets/tech/{id}`).
- **Technician Assignment Modal**: Assign specialized engineers to open tickets.
- **Resolution Modal**: Enter technical repair notes with real-time Zod schema validation feedback (`toast.error`).
- **Sleek Horizontal Popover Action Menus**: Inline horizontal action bars (`[ ✏️ Edit ] [ ⚠️ Report ] [ 🗑️ Delete ]`) that eliminate table clipping and vertical scrollbars.

### 4. 👥 User Management & Profiles (`/users` & `MyProfileModal`)
- **User Directory (`/users`)**: Restricted to `ROLE_ADMIN` for managing hospital staff credentials and roles (`ADMIN`, `MANAGER`, `TECH`).
- **My Profile Modal**: Clicking the user avatar in the sidebar drawer displays account credentials, department, and active JWT session details.

### 5. 📱 Mobile-First Responsiveness
- **Collapsible Sidebar Drawer**: Mobile header with hamburger menu toggle button (`Menu` / `X` icons) for viewports `< 768px`.
- **Responsive Table Containers**: Horizontal scroll wrappers (`overflow-x-auto min-w-[650px]`) that prevent column squishing on mobile devices.

---

## 🛠️ Tech Stack & Libraries

* **Framework**: React 19 (TypeScript)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4
* **State & Data Fetching**: TanStack Query v5 (React Query)
* **Form Handling & Validation**: React Hook Form + Zod (`@hookform/resolvers`)
* **UI Components**: Headless UI (`@headlessui/react`), Lucide React Icons
* **Notifications**: React Toastify

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/         # DataTable, Reusable UI Components
│   ├── iam/            # UserTable, MyProfileModal
│   ├── inventory/      # EquipmentTable, EquipmentFormModal, EquipmentDetailsModal
│   ├── maintenance/    # TicketTable, CreateTicketModal, AssignTechModal, ResolveTicketModal
│   ├── AppLayout.tsx   # Mobile Top Bar & Responsive Shell
│   ├── Sidebar.tsx     # Collapsible Sidebar Drawer
│   └── ProtectedRoute.tsx # Auth & Role Guard
├── context/
│   └── AuthContext.tsx # JWT Session & User State
├── services/
│   ├── api.ts          # Axios Interceptor with JWT Authorization Header
│   ├── authService.ts
│   ├── equipmentService.ts
│   ├── ticketService.ts
│   ├── userService.ts
│   └── analyticsService.ts
├── types/
│   └── index.ts        # Zod Schemas & TypeScript Type Definitions
├── views/
│   ├── auth/           # LoginView.tsx
│   ├── iam/            # UsersView.tsx
│   ├── inventory/      # EquipmentView.tsx
│   ├── maintenance/    # TicketsView.tsx, MyQueueView.tsx
│   └── DashboardView.tsx
├── router.tsx          # React Router DOM Configuration
└── main.tsx
```

---

## 🚀 Local Setup & Scripts

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (port 5173)
npm run dev

# Build for production
npm run build
```

---

## 🌐 API Proxy Configuration

The Vite dev server is configured to proxy API requests to the Spring Boot backend:
- `http://localhost:5173/api` ➔ `http://localhost:8080/api`
