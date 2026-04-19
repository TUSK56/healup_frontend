# HealUp Frontend (Next.js)

Next.js frontend for **HealUp** – medicine request platform. See the main [HealUp README](../README.md) for full setup.

## Quick start

```bash
npm install
# Add .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:3000

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
