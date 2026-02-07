

# 💰 Budget App — MVP Implementation Plan

## Overview
A Revolut-inspired budget management web app with an emerald dark-theme design system, featuring dashboard analytics, budget tracking, transaction management, category organization, and **AI-powered receipt scanning** — all powered by mock data for the MVP, with Lovable Cloud for the OCR feature.

---

## 🎨 Phase 1: Design System & Layout Shell

### Emerald Dark Theme
- Custom CSS variables: emerald primary palette (#10b981, #059669, #047857), dark slate backgrounds (#0f172a, #1e293b)
- Glassmorphism card styles with semi-transparent backgrounds and subtle emerald glow/border effects
- Focus rings and interactive elements all in emerald tones
- Clean typography with Inter font

### App Layout
- **Sidebar navigation** (left) with links to all 6 pages (including new Scan page), collapsible to icon-only mini mode
- **Top header** with app logo, search shortcut hint (Cmd+K), and user avatar/menu
- Smooth page transitions between routes
- Fully responsive — sidebar collapses to bottom nav on mobile

---

## 📊 Phase 2: Dashboard (/)

- **Total Budget Hero Card** — large centered card showing total available funds, with a plan vs actual comparison bar and monthly/yearly toggle
- **Three Budget Type Cards** — Personal (User icon), Couple (Users icon), Family (Home icon) — each showing allocated amount and a mini progress indicator
- **Quick Stats Row** — this month's spending, top spending category, and a budget health indicator (green/yellow/red dot)
- **Recent Transactions** — last 5 transactions in a compact list with amount, category badge, and date

---

## 📁 Phase 3: Budgets Page (/budgets)

- **Obsidian-style Folder Tree Sidebar** — nested tree navigation for budget types and individual budgets, with expand/collapse toggles
- **Budget Detail View** — plan vs actual table broken down by category, with animated progress bars showing spend percentage
- **Create/Edit Budget Modal** — form with budget name, type selector (personal/couple/family), period (monthly/yearly), and a dynamic list of categories with planned amounts
- Edit and delete actions on existing budgets

---

## 💳 Phase 4: Transactions Page (/transactions)

- **Filterable Transaction List** — date range picker, category dropdown, and budget type selector at the top
- **Transaction Cards** — each showing amount (large, bold), category badge with color, date, and optional notes
- **Floating Action Button** (emerald) to add new transactions
- **Add/Edit Transaction Modal** — amount input, category select, date picker, budget assignment dropdown, notes field, and receipt upload placeholder
- Empty state with helpful CTA when no transactions match filters

---

## 🏷️ Phase 5: Categories Page (/categories)

- **Category Grid/List** — all categories displayed as cards with icon, color swatch, name, and default budgeted amount
- **Predefined Categories** seeded in mock data: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Other
- **Create/Edit Category Modal** — name, icon picker (from Lucide icons), color picker, default budget amount, and budget type assignment
- Delete category with confirmation dialog

---

## 📈 Phase 6: Analytics Page (/analytics)

- **Spending Over Time** — line chart showing daily/weekly/monthly spending trends (Recharts)
- **Category Breakdown** — pie/donut chart showing percentage by category
- **Plan vs Actual** — grouped bar chart comparing budgeted vs actual amounts per category
- **Monthly Trends** — bar chart showing month-over-month spending
- Period selector (last 30 days, 3 months, 6 months, year)
- Export button placeholder (CSV/PDF)

---

## 📸 Phase 7: Receipt Scanner Page (/scan) — NEW

### Camera & Upload Interface
- **Full-width scan area** with two options: take a photo (mobile camera) or upload an image from device
- Camera viewfinder with emerald-framed overlay and capture button
- Drag-and-drop zone for desktop users to upload receipt images
- Image preview with crop/rotate controls before processing

### AI-Powered OCR Processing
- Uses **Lovable Cloud** with an edge function calling **Lovable AI** (Gemini vision model) to analyze receipt photos
- Extracts structured data from the receipt: store name, date, individual line items (product name, quantity, price), total amount, and tax
- Shows a loading state with animated emerald scanner line while processing

### Review & Confirm Screen
- Parsed items displayed in an editable table: product name, category (auto-suggested), amount
- User can edit any field, remove items, or change the auto-assigned category
- Auto-matches items to existing categories (e.g., "milk" → Food & Dining)
- Budget assignment dropdown to link all items to a specific budget
- Date pre-filled from receipt (editable)
- **"Add All to Transactions"** button — adds all confirmed items as individual transactions in one batch
- Success toast with count of added transactions and link to Transactions page

### Smart Features
- Remembers past category assignments for similar product names
- Shows receipt thumbnail attached to each created transaction
- Running total display matching receipt total for verification

---

## 🔧 Phase 8: Mock Data & State Management

- **Zustand store** for global state: budgets, transactions, categories, and user preferences
- Realistic mock data generator with ~20 transactions, 3 budgets, and 7 categories pre-loaded
- All CRUD operations work against local state (create, read, update, delete)
- Toast notifications for all user actions (success/error feedback)
- Loading skeleton states for async-feeling interactions

---

## ☁️ Phase 9: Backend Setup (Lovable Cloud)

- Enable **Lovable Cloud** for the project
- Create **edge function** (`scan-receipt`) that:
  - Receives a base64 receipt image from the client
  - Sends it to Lovable AI Gateway with a structured prompt to extract line items
  - Uses tool calling to return structured JSON (store name, date, items array with name/price/category)
  - Returns parsed data to the frontend
- Handles rate limiting (429) and payment errors (402) with user-friendly toasts

---

## ✨ Polish & UX Details

- Smooth fade/scale animations on page transitions and modal open/close
- Animated progress bars that fill on mount
- Hover effects on all interactive cards
- Keyboard shortcut: Cmd+K opens a search/command palette
- Mobile-responsive: sidebar becomes bottom tab bar, cards stack vertically
- ARIA labels and keyboard navigation on all interactive elements
- Emerald focus ring indicators for accessibility
- Scanner page optimized for mobile use (camera-first experience)

