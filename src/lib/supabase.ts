import { createClient } from '@supabase/supabase-js'

// ─── Supabase project credentials ────────────────────────────────────────────
const SUPABASE_URL = 'https://dfxxxrrfmsnygldfbhcn.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeHh4cnJmbXNueWdsZGZiaGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjE5MzYsImV4cCI6MjA5MDQzNzkzNn0.XcdeVvrw6vuXKg2EuR64lv8V5yw7RsGsddwHesrS470'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Storage bucket name ──────────────────────────────────────────────────────
export const BOOKS_BUCKET = 'books'

// ─── Helper: upload a File to Supabase Storage, return its public URL ─────────
export async function uploadToStorage(
  file: File,
  folder: 'pdfs' | 'covers'
): Promise<{ url: string; path: string }> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from(BOOKS_BUCKET)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from(BOOKS_BUCKET)
    .getPublicUrl(data.path)

  return { url: urlData.publicUrl, path: data.path }
}

// ─── Helper: delete a file from storage by path ───────────────────────────────
export async function deleteFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BOOKS_BUCKET).remove([path])
  if (error) console.warn('Storage delete warning:', error.message)
}

// ─── Database row type for the `books` table ──────────────────────────────────
export interface BookRow {
  id: string
  title: string
  author: string
  cover_url: string
  pdf_url: string
  pdf_path: string
  cover_path: string
  genre: string
  year: number
  pages: number
  rating: number
  description: string
  tags: string[]
  featured: boolean
  is_new: boolean
  created_at: string
}

// ─── Fetch all books from the `books` table ───────────────────────────────────
export async function fetchBooksFromDB(): Promise<BookRow[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`DB fetch failed: ${error.message}`)
  return data ?? []
}

// ─── Insert a new book row ─────────────────────────────────────────────────────
export async function insertBook(book: Omit<BookRow, 'created_at'>): Promise<BookRow> {
  const { data, error } = await supabase
    .from('books')
    .insert([book])
    .select()
    .single()

  if (error) throw new Error(`DB insert failed: ${error.message}`)
  return data
}

// ─── Delete a book row by id ──────────────────────────────────────────────────
export async function deleteBookFromDB(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw new Error(`DB delete failed: ${error.message}`)
}

// ─── SQL to run once in Supabase SQL Editor to create table + RLS ─────────────
export const SETUP_SQL = `
-- 1. Create the books table
CREATE TABLE IF NOT EXISTS public.books (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  cover_url   TEXT DEFAULT '',
  pdf_url     TEXT NOT NULL,
  pdf_path    TEXT NOT NULL,
  cover_path  TEXT DEFAULT '',
  genre       TEXT DEFAULT 'Other',
  year        INTEGER DEFAULT 2024,
  pages       INTEGER DEFAULT 0,
  rating      NUMERIC(3,1) DEFAULT 4.0,
  description TEXT DEFAULT '',
  tags        TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured    BOOLEAN DEFAULT FALSE,
  is_new      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 3. ANON users can SELECT (view / download)
CREATE POLICY "Public read access"
  ON public.books
  FOR SELECT
  TO anon
  USING (true);

-- 4. AUTHENTICATED users can INSERT (admin upload)
CREATE POLICY "Authenticated insert"
  ON public.books
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. AUTHENTICATED users can DELETE (admin manage)
CREATE POLICY "Authenticated delete"
  ON public.books
  FOR DELETE
  TO authenticated
  USING (true);

-- 6. Storage bucket: allow anon to read (SELECT), authenticated to upload (INSERT/DELETE)
-- Run these in the Supabase Storage policies UI or SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('books', 'books', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read storage"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'books');

CREATE POLICY "Auth upload storage"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'books');

CREATE POLICY "Auth delete storage"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'books');
`
