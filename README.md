# HealUp Frontend (Next.js)

Next.js frontend for **HealUp** – medicine request platform. See the main [HealUp README](../README.md) for full setup.

## Quick start

```bash
npm install
# Add .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:3000

**Troubleshooting login:** Ensure `NEXT_PUBLIC_API_URL` in `.env.local` matches the API URL (e.g. `http://localhost:8000`). Use the same host style in the browser as in CORS (`localhost` vs `127.0.0.1`); the API allows both for ports 3000/3001.

## Features

- **Patient**: Register, login, dashboard, create request, request details, pharmacy offers, order tracking
- **Pharmacy**: Register, login, dashboard, incoming requests, respond, orders
- **Admin**: Admin login, dashboard, pharmacy approvals, users, orders

All UI labels and messages use **HealUp** branding.

## Services

- `apiService.ts` – Axios instance with JWT and base URL
- `authService.ts` – Register, login, session
- `requestService.ts` – Create/list requests, get offers
- `orderService.ts` – Create orders, list, update status
- `pharmacyAnalyticsService.ts` – Live pharmacy analytics (`GET /api/pharmacy/analytics`)
- `notificationService.ts` – Notification list / mark read

## Demo accounts (local development)

The .NET API can seed **5 patient accounts**, **5 pharmacy accounts** (all **approved**), and sample **orders** for analytics. This runs once on API startup when `DemoSeed:Enabled` is `true` in `backend-dotnet/HealUp.Api/appsettings.json` and the database does **not** already contain `patient1@demo.healup.local`.

**Shared password for all demo patients and pharmacies:** `Demo@2026`  
(Config key: `DemoSeed:Password` — must match `Password` in the same section.)

### Patients

| Email | Password |
|-------|----------|
| `patient1@demo.healup.local` | `Demo@2026` |
| `patient2@demo.healup.local` | `Demo@2026` |
| `patient3@demo.healup.local` | `Demo@2026` |
| `patient4@demo.healup.local` | `Demo@2026` |
| `patient5@demo.healup.local` | `Demo@2026` |

Log in with guard **`user`** (patient).

### Pharmacies

| Email | Password |
|-------|----------|
| `pharmacy1@demo.healup.local` | `Demo@2026` |
| `pharmacy2@demo.healup.local` | `Demo@2026` |
| `pharmacy3@demo.healup.local` | `Demo@2026` |
| `pharmacy4@demo.healup.local` | `Demo@2026` |
| `pharmacy5@demo.healup.local` | `Demo@2026` |

Log in with guard **`pharmacy`**.

### Admin (from API config, not demo seed)

Configured under `AdminSeed` in `appsettings.json` (example defaults):

| Email | Password |
|-------|----------|
| `admin@healup.test` | `admin123` |

Log in with guard **`admin`**.

**Note:** To re-run demo seed after it has already run, remove demo rows from the database or drop/recreate the database so `patient1@demo.healup.local` does not exist.
