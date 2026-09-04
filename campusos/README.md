# CampusOS — AI-Powered Campus Dashboard

An intelligent university platform powered by an AI agent that understands and acts on real-time campus data. Built with **Next.js 16**, **Prisma (SQLite)**, and **Google Gemini AI**.

---

## Features

- **5 Data Sections**: Schedules, Rooms, Events, Announcements, Assignments — all visible in a unified dashboard
- **Full CRUD**: Add, edit, and delete for every section. Changes persist in a real database (SQLite via Prisma)
- **AI Chat Agent**: An integrated Gemini-powered assistant that queries live campus data
- **Modern UI**: Glassmorphism, smooth animations (Framer Motion), dark mode, responsive layout

---

## Local Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm**
- A **Google Gemini API key** ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the repo

```bash
git clone https://github.com/shuvratobh/cse-carnival-8-aibuild-hackathon.git
cd cse-carnival-8-aibuild-hackathon/campusos
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp ../.env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

To seed the database with the initial campus data:

```bash
npx tsx prisma/seed.ts
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer        | Technology           |
|-------------|---------------------|
| Framework   | Next.js 16 (App Router, Turbopack) |
| Language    | TypeScript           |
| Database    | SQLite via Prisma ORM |
| AI          | Google Gemini 3.6 Flash (via AI SDK) |
| Styling     | Tailwind CSS 4       |
| Animations  | Framer Motion        |
| Icons       | Lucide React         |

---

## Project Structure

```
campusos/
├── app/
│   ├── page.tsx           ← Main dashboard page (Server Component)
│   ├── layout.tsx         ← Root layout
│   ├── globals.css        ← Global styles & design tokens
│   └── api/chat/route.ts  ← AI chat API endpoint
├── components/
│   ├── DashboardClient.tsx ← Dashboard tabs + metrics (Client Component)
│   ├── ChatAgent.tsx       ← AI chat interface
│   ├── DataTable.tsx       ← Reusable data table with search
│   ├── Modal.tsx           ← Reusable modal dialog
│   └── tabs/               ← Tab components (Schedules, Rooms, Events, etc.)
├── actions/
│   └── index.ts           ← Server Actions for all CRUD operations
├── prisma/
│   ├── schema.prisma      ← Database schema
│   └── seed.ts            ← Seed script to load initial data
└── .env.local             ← API keys (not committed)
```

---

## Submission Checklist

- [x] Repo is public
- [x] All five data sections are visible in the dashboard
- [x] Add, edit, and delete work for all five systems and changes persist after reload
- [x] README has working local setup steps
- [x] No API keys committed to the repo (uses `.env.example`)
