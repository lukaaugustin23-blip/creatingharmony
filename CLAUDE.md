# CLAUDE.md — Agency OS App

## Who You Are Building For
A solo 14-year-old founder building a production SaaS for agency owners.
Be precise. No fluff. Write real, production-grade code every time.

---

## Tech Stack
- **Framework:** React Native + Expo (managed workflow)
- **Navigation:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind for React Native)
- **Backend:** Supabase (auth, database, real-time, storage)
- **Payments:** Stripe Connect (users connect their own Stripe)
- **Email:** Resend (automated invoices + notifications)
- **Hosting:** Vercel (web), Apple Developer (iOS)
- **Language:** TypeScript — always, no exceptions

---

## Design System — Non-Negotiable

### Two Themes
- **Light → Arctic Clean** — white (#ffffff), sky blue accent (#0ea5e9), slate text (#0f172a)
- **Dark → Obsidian Premium** — near-black (#0d0d0f), electric blue (#3b82f6), cyan accent (#06b6d4)
- These are NOT a simple color invert — they are two distinct design systems
- Theme toggle stored in Supabase user preferences, synced across all devices

### Fonts
- **Display/Headings:** Sora (700, 600, 500)
- **Body:** DM Sans (400, 500)
- **Numbers/Mono:** Geist Mono (400, 500)

### Spacing Tokens
- space-1: 4px | space-2: 8px | space-3: 12px | space-4: 16px
- space-5: 20px | space-6: 24px | space-8: 32px | space-10: 40px

### Border Radius Tokens
- sm: 6px | md: 10px | lg: 14px | xl: 20px | full: 9999px

### Motion
- instant: 100ms ease-out
- fast: 150ms ease-out
- base: 200ms ease-in-out
- slow: 300ms ease-in-out
- spring: 400ms spring(1, 80, 10)
- page load: 500ms staggered 50ms per element

### Chart Types Available
- Bar chart (mini inline + full)
- Line chart
- Donut / ring chart
- Pie chart
- Progress bar
- Radial/gauge

---

## Architecture Rules

### Data & Sync
- **Single source of truth:** Supabase only. Never store state locally that belongs in the DB.
- **Real-time:** Use Supabase real-time subscriptions on every list/collection.
- A project added on any screen, device, or platform must instantly appear everywhere.
- Never duplicate data across tables. Use foreign keys and joins.

### File Structure
```
app/
  (auth)/
    login.tsx
    signup.tsx
  (app)/
    _layout.tsx
    dashboard/
    finance/
    leads/
    projects/
    sales/
    settings/
components/
  ui/           # buttons, inputs, badges, cards
  widgets/      # modular dashboard widgets
  charts/       # all chart components
  layout/       # sidebar, header, nav
lib/
  supabase.ts   # supabase client
  stripe.ts     # stripe connect helpers
  resend.ts     # email triggers
  hooks/        # useRevenue, useLeads, useProjects etc
  utils/        # formatCurrency, formatDate etc
types/
  index.ts      # all shared TypeScript types
constants/
  theme.ts      # all design tokens
  colors.ts     # arctic + obsidian color maps
```

### Supabase Tables (core)
- `users` — auth + preferences (theme, widget layout)
- `clients` — agency's clients
- `leads` — lead pipeline
- `projects` — projects + status
- `tasks` — tasks linked to projects or standalone
- `invoices` — invoice records, linked to Stripe
- `transactions` — revenue + expenses
- `widgets` — user's dashboard widget config (order, size, type)
- `widget_gallery` — community-shared widgets
- `sales_scripts` — openers + objection responses

---

## Dashboard — Modular Widget System
- Inspired by Google Project Ara — every widget is a swappable module
- Users can add, remove, resize, reorder widgets
- Widget types: stat card, bar chart, line chart, donut chart, pie chart, list, calendar, table, kanban, tracker, card
- Widget config saved to Supabase per user — persists across devices
- Gallery of pre-built widgets + user-created widgets
- Widget builder: no-code, pick layout type → name fields → save
- Onboarding auto-builds first dashboard from 5 questions

---

## Pricing Tiers
- **Basic** — 4 widgets max, limited features
- **Team** — 10 widgets, team members, widget builder
- **Enterprise** — unlimited widgets, white-label, custom widgets

---

## Automated Invoicing Flow
1. Invoice created in app
2. Stripe Connect charges client
3. Transaction auto-added to revenue in Supabase
4. Resend fires email/receipt to client automatically
5. Recurring invoices triggered by Supabase cron job monthly

---

## Code Rules
- TypeScript everywhere — no `any` types
- Every component gets proper props interface
- All Supabase calls wrapped in try/catch with proper error states
- Loading states on every async operation
- Never hardcode colors — always use theme tokens from `constants/colors.ts`
- Never hardcode spacing — always use token scale
- Real-time subscriptions cleaned up on unmount
- All currency formatted with `formatCurrency()` util (never raw numbers)
- All dates formatted with `formatDate()` util

## What NOT To Do
- No lazy color inversions for dark mode
- No hardcoded mock data in production components
- No `console.log` left in commits
- No skipping TypeScript types
- No building entire features in one file — always split components
- No storing sensitive keys in code — always `.env`

---

## Build Order (do not skip steps)
1. Auth (login, signup, session)
2. Supabase schema + types
3. Design tokens + theme system
4. Core UI components (buttons, inputs, cards, badges)
5. Navigation shell
6. Dashboard + widget system
7. Finance module
8. Leads module
9. Projects + tasks module
10. Sales scripts module
11. Invoicing + Stripe Connect
12. Automated emails (Resend)
13. Widget builder + gallery
14. Onboarding flow
15. iOS build + Apple submission