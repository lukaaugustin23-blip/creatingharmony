# Product Requirements Document
## Agency OS — CreatingHarmony
### Version 1.1 | April 2026

---

## 1. Overview

**Product:** A modular, all-in-one agency management platform for small to mid-size digital agencies.

**Vision:** The way a piano requires every key working in perfect harmony to create music, this app requires every part of an agency — finances, leads, projects, sales — working in sync. One system. Zero chaos.

**Slogan:** *Precision and harmony across your team.*

**Platforms:** iOS (Expo) + Web (Vercel)

**Stack:** React Native + Expo · Supabase · Stripe Connect (optional) · Resend · TypeScript · NativeWind

---

## 2. The Problem

Agency owners use 4-6 different tools:
- Spreadsheets for finances
- Notion or Trello for projects
- A separate CRM for leads
- Manual emails for invoices
- Notes app for sales scripts

Nothing talks to each other. Data goes out of sync. Time is wasted. Money is missed. Team members add things in different places and nothing stays consistent.

---

## 3. The Solution

One app that does everything — and every part is aware of every other part.

- Add a project anywhere → appears everywhere instantly
- Close a deal → lead moves to client, invoice auto-generates
- Invoice paid → revenue updates across every screen in real-time
- New month → recurring invoices send themselves
- One universal quick-add so nothing gets added in the wrong place

---

## 4. Target User

- Solo agency owners or small teams (1–10 people)
- Running a digital marketing, web design, SMMA, or creative agency
- Age 16–35, tech comfortable, tired of juggling tools
- Wants to look and feel professional to clients

---

## 5. Universal Add System

### 5.1 Quick-Add Button (Global)
**The fix for adding things from multiple places.**

- Floating action button (FAB) present on every single screen
- Tapping it opens a bottom sheet with options:
  - + New Lead
  - + New Client
  - + New Project
  - + New Task
  - + New Invoice
  - + Log Transaction
  - + New Script
- Each option opens the correct form — pre-filled with context where possible (e.g. tapping + New Task inside a project pre-fills the project field)
- After saving, data appears instantly on all relevant screens via real-time sync
- No matter where something is created it goes to the same Supabase table — one source of truth

### 5.2 Command Center (Admin Only — Hidden Page)
- A separate, hidden page accessible only to owner/admin roles
- Not visible in navigation for standard team members
- Accessed via: Settings → Admin → Command Center
- Gives admins a single place to:
  - Create anything (leads, projects, invoices, clients, tasks, scripts)
  - View all pending items across every module
  - Assign tasks to team members
  - Review and approve team actions
  - Manage team permissions
  - See a full activity log of everything created/edited/deleted by anyone
- Styled identically to rest of app — same design system, not a separate look

### 5.3 Checklist System (Global)
- Any item in the app (task, project, lead, invoice) can have a checklist attached
- Tap any item → "Add Checklist" option
- Checklist items checked off individually
- Progress shown as mini progress bar on parent item card
- Checked items show strikethrough, muted color
- Unchecking allowed
- Checklists sync in real-time across all team members
- Used for: task subtasks, project milestones, invoice confirmation, lead qualification steps

### 5.4 Mark as Done (Global)
- Every item across every module has a mark complete action
- Accessible via:
  - Swipe left on list item → green checkmark
  - Tap item → action button top right
  - Long press → context menu
- Completed items:
  - Visual completion state (strikethrough, muted, check icon)
  - Toggle "Show Completed" to hide/show
  - Never deleted — always in history
  - Logged with timestamp + who completed it
- Completing a task auto-updates project progress %
- Completing all tasks prompts "Mark project complete?"

---

## 6. Core Modules

### 6.1 Dashboard (Modular Widget System)
**Concept:** Google Project Ara for dashboards. Every widget is a removable, resizable module.

**Behavior:**
- User can add, remove, reorder, resize any widget
- Layout saved to Supabase — syncs across all devices
- Onboarding quiz auto-builds first dashboard
- Widget picker opens as a panel (not a separate page)
- Edit mode: tap "Customize" → widgets enter edit mode → drag, remove, add

**Widget Types:**
- Stat card (single number + trend)
- Bar chart (mini + full)
- Line chart
- Donut / ring chart
- Pie chart
- Progress bar / gauge / radial
- List (leads, tasks, etc.)
- Calendar
- Table (rows + columns)
- Kanban
- Tracker (increments/decrements)
- Info card (text + label)

**Pre-built Widgets:**
- Revenue MTD, Net Profit, Expenses, Conversion Rate
- Active Projects, Leads Pipeline, Tasks Due Today
- Outstanding Invoices, MRR, Top Client by Revenue
- Team Workload, Cash Flow Chart
- Upcoming Deadlines, Recent Activity Feed
- Quick Add (opens universal add sheet from dashboard)

**Widget Gallery:**
- Lives inside widget picker — not a separate page
- No-code builder: pick layout → define fields → name → preview → publish or keep private
- Gallery searchable, sortable by popularity / newest / category
- Community widgets show creator + install count

**Widget Builder Steps:**
1. Pick layout type (list, tracker, calendar, table, chart, card)
2. Define fields (text, number, date, checkbox, dropdown)
3. Name + icon + accent color
4. Live preview
5. Save to dashboard or publish to gallery

**Tier Limits:** Basic: 4 widgets · Team: 10 · Enterprise: unlimited

---

### 6.2 Finance Module

**Metrics:** Revenue (MTD/YTD), Expenses, Gross Profit, Net Profit, Margin %, MRR, Cash Flow

**Transaction Entry — Two Ways:**
1. **Manual:** + Log Transaction → amount, type, category, date, client, notes
2. **Automatic:** Stripe webhook → payment → auto-creates transaction in Supabase instantly

**Stripe Connect is optional:**
- Without Stripe: full manual tracking, mark invoices paid manually
- With Stripe: automated charging + auto-logging

**Chart Types in Finance:**
- Revenue vs Expenses (bar, side by side)
- Net Profit over time (line)
- Expense breakdown (pie / donut)
- Cash flow (bar, positive/negative)
- Profit margin trend (line)

**Features:**
- Category tagging (ads, tools, payroll, software, revenue, other)
- Date filtering (week / month / quarter / year / custom)
- Search transactions
- Edit or delete any transaction
- Export to CSV (Team + Enterprise)

---

### 6.3 Invoicing

**Features:**
- Create: client, line items, tax, due date, notes
- One-time or recurring (weekly / monthly / quarterly / custom)
- Stripe Connect optional — without it, user marks paid manually
- Statuses: Draft → Sent → Viewed → Paid → Overdue → Cancelled
- PDF generated and attached to email
- Overdue auto-reminders at 1 / 3 / 7 days via Resend
- Payment confirmation email to client on payment

**Recurring flow (50 clients example):**
- Setup once → Supabase cron fires every month → Resend sends all 50 → Stripe charges all 50 → all log to finance automatically → zero manual work

**Invoice email:**
- Professional branded template
- Agency name, logo, invoice number, line items, total, due date, pay link
- Customizable message

---

### 6.4 Lead Organizer

**Fields:** Name, company, industry, contact, status, value, notes, follow-up date, source, assignee, checklist

**Status pipeline:** New → Contacted → Qualified → Proposal Sent → Negotiating → Closed Won → Closed Lost

**Features:**
- Kanban view (drag between stages)
- List view
- Filter: status, value, date, source, assignee
- Search
- Convert to client (one tap, data carries over)
- Follow-up reminders (push + email)
- Conversion rate auto-calculated → shown on dashboard
- Activity log: every change timestamped + who made it
- Mark won/lost with one tap

---

### 6.5 Project & Task Manager

**Projects:** Name, client, status, start/end date, budget, progress %, team members, notes, checklist

**Status:** Planning → Active → Review → Complete → On Hold

**Tasks:** Assignee, due date, priority (Low/Medium/High/Urgent), status, subtasks, checklist, comments, mark done

**Views:** List · Kanban · Calendar

**Sync rule:** Created anywhere → appears everywhere instantly. No exceptions.

---

### 6.6 Sales Scripts Module

**Features:**
- Multiple opener scripts — add, edit, delete, reorder, favorite
- Instant toggle between openers
- Objections library: objection + crafted response
- Categories: cold call / follow-up / referral / re-engagement / closing
- Searchable
- Notes per script
- "Used today" tracker per script

---

## 7. Client Management

- Profile: name, company, logo, contact, industry
- Linked to: projects, invoices, transactions, leads
- Overview: all projects, all invoices, total paid, outstanding, notes
- Add manually or convert from lead
- Archive (never delete — keeps financial history)

---

## 8. Team & Permissions

**Roles:**
- **Owner** — everything including billing, team, Command Center
- **Admin** — everything except billing
- **Member** — assigned projects, tasks, leads only. No finance, no Command Center
- **View Only** — read access to assigned areas

**Enforced at Supabase RLS level — not just UI.**

**Invite flow:** Owner enters email → invite sent via Resend → member signs up → auto-joined → owner assigns role

---

## 9. Design System

### Two Themes — Fully Distinct, Not An Invert

**Light: Arctic Clean**
- bg: #ffffff / #f8fafc
- accent: #0ea5e9 · accent-2: #6366f1
- text: #0f172a · muted: #94a3b8 · border: #e2e8f0
- success: #10b981 · warning: #f59e0b · danger: #ef4444

**Dark: Obsidian Premium**
- bg: #0d0d0f / #111114
- accent: #3b82f6 · accent-2: #06b6d4
- text: #f0f4ff · muted: #454d5e · border: #1e1e26
- Top edge: 1px gradient blue→cyan on every panel
- success: #10b981 · warning: #f59e0b · danger: #ef4444

**Theme toggle:** Stored in Supabase. Syncs across all devices instantly.

### Fonts
- Sora — display, headings (700/600/500)
- DM Sans — body (400/500)
- Geist Mono — numbers, data, labels (400/500)

### Spacing: 4/8/12/16/20/24/32/40px
### Radius: sm 6 · md 10 · lg 14 · xl 20 · full 9999

### Motion
- instant 100ms · fast 150ms · base 200ms · slow 300ms · spring 400ms · page stagger 500ms/50ms

### UX Principles
- Data breathes — whitespace is intentional
- Every number readable at a glance
- Nothing cramped, nothing wasted
- Arctic = fast, clinical, precise
- Obsidian = powerful, focused, premium
- Haptics: complete task, mark paid, drag widget, theme toggle

---

## 10. Real-Time Sync

- All screens subscribe to Supabase real-time on mount
- Cleaned up on unmount
- Any write propagates to all devices in under 200ms
- No pull-to-refresh needed
- Offline: queue locally → sync on reconnect
- Conflict resolution: last-write-wins with timestamp

---

## 11. Notifications

**Push + In-app:**
- Invoice paid, overdue, task due/overdue, follow-up due, team activity

**Email (Resend):**
- Invoice to client (PDF), payment confirmation, overdue reminders, team invite, weekly owner summary

---

## 12. Onboarding Flow

1. Sign up (email or Google)
2. Agency name + logo (optional)
3. Connect Stripe (optional, skippable)
4. 5-question quiz → auto-builds dashboard
5. Animated guided tour (skippable)
6. First action prompt
7. Subtle celebration on first action

---

## 13. Settings

- Profile, agency info (used on invoices), theme toggle
- Notification preferences
- Stripe Connect status
- Team management (invite, remove, roles)
- Billing + subscription
- Data export (CSV)
- Admin → Command Center (owner/admin only)
- Delete account

---

## 14. Pricing Tiers

| Feature | Basic | Team | Enterprise |
|---|---|---|---|
| Widgets | 4 | 10 | Unlimited |
| Team members | 1 | Up to 5 | Unlimited |
| Widget builder | ✗ | ✓ | ✓ |
| Widget gallery | ✓ | ✓ | ✓ |
| Recurring invoices | ✓ | ✓ | ✓ |
| Stripe Connect | ✓ | ✓ | ✓ |
| Manual transactions | ✓ | ✓ | ✓ |
| CSV export | ✗ | ✓ | ✓ |
| Command Center | ✗ | ✓ | ✓ |
| Weekly summary email | ✗ | ✓ | ✓ |
| White-label | ✗ | ✗ | ✓ |
| Priority support | ✗ | ✗ | ✓ |

---

## 15. Build Order

**Complete each step fully before moving to next.**

1. Auth — signup, login, session, Google OAuth
2. Supabase schema — all tables, RLS, foreign keys, TypeScript types
3. Design tokens — both themes, toggle, NativeWind config
4. Core UI library — buttons, inputs, cards, badges, all chart types, modals, FAB
5. Navigation shell — tabs, sidebar (web), transitions
6. Universal Quick-Add FAB — all screens
7. Dashboard + widget system — render, add, remove, reorder
8. Finance module — manual + Stripe webhook
9. Invoicing — one-time + recurring, Stripe optional, Resend
10. Leads module — kanban + list, convert to client
11. Projects + tasks — all views, checklist, real-time
12. Sales scripts module
13. Client management
14. Team + permissions + RLS enforcement
15. Command Center
16. Checklist system (global)
17. Mark as done (global)
18. Widget builder + gallery
19. Notifications (push + email)
20. Onboarding flow
21. Settings
22. Polish — animations, empty states, error states, loading skeletons, haptics
23. iOS build + Apple submission

---

## 16. Edge Cases & UX Details

- **Empty states:** Every module has a designed empty state with CTA — never blank
- **Error states:** Every async op has graceful error + retry
- **Loading:** Skeleton loaders matching real content shape — no spinners
- **Offline:** Banner shown, actions queued, auto-sync on reconnect
- **Deleted data:** Nothing hard-deleted V1 — all archived with timestamp
- **Currency:** Always `formatCurrency()` — never raw numbers
- **Dates:** Always `formatDate()` — locale-aware
- **Long text:** Truncates with ellipsis, full on tap
- **Keyboard:** Forms push up, dismiss on outside tap
- **Haptics:** Complete, paid, drag, toggle

---

## 17. Success Metrics

- First client added within 10 min of signup
- Dashboard load under 1.5s
- Invoice sent within 3 taps
- Zero manual work for recurring billing after setup
- Real-time sync under 200ms
- Zero screens missing loading or error states at launch

---

## 18. Out of Scope — V1

- Lead finder / prospecting
- AI features (V2)
- White-label (V2)
- Desktop native app
- Team chat
- Client portal
- Multi-currency (V2)
- Zapier / integrations (V2)