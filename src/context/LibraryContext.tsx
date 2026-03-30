import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Book } from '../data/books'

interface LibraryContextType {
  openBook: Book | null;
  setOpenBook: (book: Book | null) => void;
  readingProgress: Record<string, number>;
  updateProgress: (bookId: string, progress: number) => void;
  bookmarks: string[];
  toggleBookmark: (bookId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGenre: string;
  setSelectedGenre: (g: string) => void;
  recentlyViewed: string[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [openBook, setOpenBook] = useState<Book | null>(null);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('libra_progress');
    if (saved) try { setReadingProgress(JSON.parse(saved)); } catch {}
    const bm = localStorage.getItem('libra_bookmarks');
    if (bm) try { setBookmarks(JSON.parse(bm)); } catch {}
    const rv = localStorage.getItem('libra_recent');
    if (rv) try { setRecentlyViewed(JSON.parse(rv)); } catch {}
  }, []);

  const updateProgress = (bookId: string, progress: number) => {
    const updated = { ...readingProgress, [bookId]: progress };
    setReadingProgress(updated);
    localStorage.setItem('libra_progress', JSON.stringify(updated));
  };

  const toggleBookmark = (bookId: string) => {
    const updated = bookmarks.includes(bookId)
      ? bookmarks.filter(id => id !== bookId)
      : [...bookmarks, bookId];
    setBookmarks(updated);
    localStorage.setItem('libra_bookmarks', JSON.stringify(updated));
  };

  const handleSetOpenBook = (book: Book | null) => {
    setOpenBook(book);
    if (book) {
      const updated = [book.id, ...recentlyViewed.filter(id => id !== book.id)].slice(0, 5);
      setRecentlyViewed(updated);
      localStorage.setItem('libra_recent', JSON.stringify(updated));
    }
  };

  return (
    <LibraryContext.Provider value={{
      openBook, setOpenBook: handleSetOpenBook,
      readingProgress, updateProgress,
      bookmarks, toggleBookmark,
      searchQuery, setSearchQuery,
      selectedGenre, setSelectedGenre,
      recentlyViewed
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be inside LibraryProvider');
  return ctx;
};
