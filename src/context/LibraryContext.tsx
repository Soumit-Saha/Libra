import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Book } from '../data/books'
import { fetchBooksFromDB, BookRow } from '../lib/supabase'

// ─── Convert Supabase BookRow → app Book shape ─────────────────────────────
export const rowToBook = (row: BookRow): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
  coverImageURL: row.cover_url,
  pdf_filePath: row.pdf_url,
  genre: row.genre,
  year: row.year,
  pages: row.pages,
  rating: row.rating,
  description: row.description,
  tags: row.tags ?? [],
  featured: row.featured,
  new: row.is_new,
  // Store storage paths for admin delete
  _pdfPath: row.pdf_path,
  _coverPath: row.cover_path,
  _dbId: row.id,
})

interface LibraryContextType {
  openBook: Book | null
  setOpenBook: (book: Book | null) => void
  readingProgress: Record<string, number>
  updateProgress: (bookId: string, progress: number) => void
  bookmarks: string[]
  toggleBookmark: (bookId: string) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedGenre: string
  setSelectedGenre: (g: string) => void
  recentlyViewed: string[]
  uploadedBooks: Book[]
  uploadedBooksLoading: boolean
  reloadUploadedBooks: () => Promise<void>
  addUploadedBook: (book: Book) => void
  removeUploadedBook: (id: string) => void
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [openBook, setOpenBook] = useState<Book | null>(null)
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({})
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [uploadedBooks, setUploadedBooks] = useState<Book[]>([])
  const [uploadedBooksLoading, setUploadedBooksLoading] = useState(true)

  // ── Load persisted UI state ────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('libra_progress')
    if (saved) try { setReadingProgress(JSON.parse(saved)) } catch {}
    const bm = localStorage.getItem('libra_bookmarks')
    if (bm) try { setBookmarks(JSON.parse(bm)) } catch {}
    const rv = localStorage.getItem('libra_recent')
    if (rv) try { setRecentlyViewed(JSON.parse(rv)) } catch {}
  }, [])

  // ── Load uploaded books from Supabase on mount ─────────────────────────────
  const reloadUploadedBooks = async () => {
    setUploadedBooksLoading(true)
    try {
      const rows = await fetchBooksFromDB()
      setUploadedBooks(rows.map(rowToBook))
    } catch (err) {
      console.warn('Could not load books from Supabase:', err)
      setUploadedBooks([])
    } finally {
      setUploadedBooksLoading(false)
    }
  }

  useEffect(() => { reloadUploadedBooks() }, [])

  const updateProgress = (bookId: string, progress: number) => {
    const updated = { ...readingProgress, [bookId]: progress }
    setReadingProgress(updated)
    localStorage.setItem('libra_progress', JSON.stringify(updated))
  }

  const toggleBookmark = (bookId: string) => {
    const updated = bookmarks.includes(bookId)
      ? bookmarks.filter(id => id !== bookId)
      : [...bookmarks, bookId]
    setBookmarks(updated)
    localStorage.setItem('libra_bookmarks', JSON.stringify(updated))
  }

  const handleSetOpenBook = (book: Book | null) => {
    setOpenBook(book)
    if (book) {
      const updated = [book.id, ...recentlyViewed.filter(id => id !== book.id)].slice(0, 5)
      setRecentlyViewed(updated)
      localStorage.setItem('libra_recent', JSON.stringify(updated))
    }
  }

  // ── Optimistic add: called right after Supabase insert succeeds ────────────
  const addUploadedBook = (book: Book) => {
    setUploadedBooks(prev => [book, ...prev])
  }

  // ── Optimistic remove: called right after Supabase delete succeeds ─────────
  const removeUploadedBook = (id: string) => {
    setUploadedBooks(prev => prev.filter(b => b.id !== id))
  }

  return (
    <LibraryContext.Provider value={{
      openBook, setOpenBook: handleSetOpenBook,
      readingProgress, updateProgress,
      bookmarks, toggleBookmark,
      searchQuery, setSearchQuery,
      selectedGenre, setSelectedGenre,
      recentlyViewed,
      uploadedBooks, uploadedBooksLoading,
      reloadUploadedBooks,
      addUploadedBook, removeUploadedBook,
    }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be inside LibraryProvider')
  return ctx
}
