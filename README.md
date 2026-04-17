# 📚 Libra — Premium Online Library

## Project Overview
- **Name**: Libra
- **Goal**: A premium, dark-mode online library with an admin-controlled Supabase backend
- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Hono + Cloudflare Pages
- **Storage**: Supabase Storage (PDFs + covers) + Supabase PostgreSQL (book metadata)

---

## 🔗 URLs
- **Live App**: https://3000-iici5nygjwrcxgio57aab-b32ec7bb.sandbox.novita.ai
- **GitHub**: https://github.com/Soumit-Saha/Libra

---

## ✨ Features

### Visual Design
- Dark obsidian background (`#0a0a0f`) with indigo accents (`#6366f1`)
- Glassmorphism sidebar / navbar (backdrop-blur 20px)
- Bento-box responsive grid layout
- 3D lift & scale hover animations, soft indigo glow
- Inter font, animated background orbs, noise texture

### Authentication
- `/login` — email or phone input, password show/hide, demo credentials auto-fill
- `/signup` — full name, email/phone, live password strength meter, confirm password, terms checkbox
- Auth persisted via `localStorage`; protected routes redirect to `/login` for guests
- **Demo credentials**: `demo@libra.app` / `demo123`

### Public Library Dashboard (`/dashboard`)
- Stats row with animated counters
- Sections: Continue Reading, Featured, New Arrivals, Bookmarks, All Books
- Real-time search (title, author, genre, tags)
- Genre sidebar filter with count badges
- Responsive mobile layout with bottom iOS-style navigation

### Book Cards
- Cover image with 3D hover scale, indigo glow shadow
- Bookmark toggle, reading progress bar, star rating, page count, tag chips
- **Read Now** button opens full-screen PDF viewer
- **Download** button (Lucide icon) — direct Supabase URL download for uploaded books

### PDF Viewer Modal
- Full-screen glassmorphism overlay
- Top linear progress bar + circular SVG ring
- Left panel: cover, stats, description, tags
- iframe viewer via Google Docs Viewer
- Escape key closes modal

### Admin Panel (`/admin`) — admin@libra.app only
- **Upload tab**: drag-and-drop PDF (≤50 MB) + cover image (≤5 MB), metadata fields, live preview card
- **Manage tab**: list of Supabase-uploaded books with download + delete
- **DB Setup SQL tab**: copyable SQL to bootstrap Supabase table + RLS policies
- Three-layer admin guard: `AdminRoute`, `useEffect` redirect, `isAdmin` flag

---

## 🏗️ Data Architecture

### Book Interface (`src/data/books.ts`)
```typescript
interface Book {
  id: string
  title: string
  author: string
  coverImageURL: string      // Supabase public URL or Open Library URL
  pdf_filePath: string       // Supabase public URL or external PDF URL
  genre: string
  year: number
  pages: number
  rating: number
  description: string
  tags: string[]
  featured?: boolean
  new?: boolean
  // Supabase-specific (admin-uploaded only)
  _pdfPath?: string          // Storage object path for deletion
  _coverPath?: string
  _dbId?: string             // Row id in `books` table
}
```

### Storage Services
| Service | Purpose |
|---|---|
| **Supabase Storage** (`books` bucket) | PDF files → `pdfs/` folder; Cover images → `covers/` folder |
| **Supabase PostgreSQL** (`books` table) | Book metadata: title, author, URLs, genre, year, pages, tags, etc. |
| **localStorage** | User auth session, reading progress, bookmarks, recently viewed |

### RLS Policies
- `anon` role: **SELECT** only (view + download)
- `authenticated` role: **INSERT + DELETE** (admin upload/remove)
- Storage policies mirror the same access pattern

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (URL + anon key already configured in `src/lib/supabase.ts`)

### Install & Run
```bash
npm install
npm run dev         # Vite dev server at http://localhost:3000
npm run build       # Production build → dist/
```

### Supabase Setup (run once)
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Copy the SQL from **Admin Panel → DB Setup SQL** tab
3. Paste and run — this creates the `books` table, enables RLS, and sets storage policies

---

## 🔐 Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@libra.app` | `admin2024!` |
| Demo User | `demo@libra.app` | `demo123` |

---

## 📦 Deployment
- **Platform**: Cloudflare Pages
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Status**: ✅ Active
- **Last Updated**: 2026-04-17
