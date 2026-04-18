import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { X, BookOpen, ArrowLeft, ExternalLink, Star, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { authors, Author } from '../data/authors'
import { books, getBooksByAuthorId } from '../data/books'
import { Book } from '../data/books'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/MobileBottomNav'
import BookCard from '../components/BookCard'
import PDFViewerModal from '../components/PDFViewerModal'
import { Shield } from 'lucide-react'

// ─── Author card in the bento grid ────────────────────────────────────────────
function AuthorCard({
  author,
  index,
  onSelect,
}: {
  author: Author
  index: number
  onSelect: (a: Author) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const libraryBooks = getBooksByAuthorId(author.id)
  const delay = Math.min(index * 0.06, 0.55)

  // Bento sizing: every 5th card is "wide"
  const isWide = index % 7 === 0 || index % 7 === 4

  return (
    <div
      className="animate-fade-in-up"
      onClick={() => onSelect(author)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${delay}s`,
        opacity: 0,
        gridColumn: isWide ? 'span 2' : 'span 1',
        background: hovered
          ? 'linear-gradient(145deg, rgba(99,102,241,0.13), rgba(124,58,237,0.09))'
          : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 20,
        padding: '24px 22px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? '0 20px 60px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.15)'
          : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Subtle glow orb behind portrait */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s',
      }} />

      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        {/* Portrait */}
        <div style={{
          width: 64, height: 64, borderRadius: 16, flexShrink: 0, overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: `2px solid ${hovered ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.15)'}`,
          transition: 'border-color 0.3s',
          boxShadow: hovered ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
        }}>
          {!imgErr ? (
            <img
              src={author.photoURL}
              alt={author.name}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: 'rgba(99,102,241,0.7)',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)'
            }}>
              {author.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: 16, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.3px',
            color: hovered ? 'var(--indigo-200)' : 'var(--text-primary)',
            transition: 'color 0.2s',
          }}>
            {author.name}
          </h3>
          <p style={{
            fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: isWide ? 3 : 2,
            WebkitBoxOrient: 'vertical' as const,
            marginBottom: 12,
          }}>
            {author.oneLiner}
          </p>

          {/* Genre chips */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {author.genres.slice(0, isWide ? 3 : 2).map(g => (
              <span key={g} style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                background: 'rgba(99,102,241,0.1)', color: 'var(--indigo-300)',
                border: '1px solid rgba(99,102,241,0.15)',
              }}>{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: nationality + books in library */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 18, paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          🌍 {author.nationality} · {author.born.split(',').pop()?.trim() ?? ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {libraryBooks.length > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10,
              background: 'rgba(16,185,129,0.1)', color: '#34d399',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              📚 {libraryBooks.length} in library
            </span>
          )}
          <ChevronRight size={14} color="var(--text-muted)"
            style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Author Detail slide-over panel ──────────────────────────────────────────
function AuthorDetailPanel({
  author,
  onClose,
}: {
  author: Author
  onClose: () => void
}) {
  const { setOpenBook } = useLibrary()
  const libraryBooks = getBooksByAuthorId(author.id)
  const [imgErr, setImgErr] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    // Escape key
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.32s ease',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 401,
          width: 'min(540px, 100vw)',
          background: 'rgba(10,10,22,0.97)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(99,102,241,0.2)',
          overflowY: 'auto',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(10,10,22,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={handleClose} style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}>
            <X size={16} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Author Profile
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['', '', ''].map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#10b981',
                opacity: 0.6
              }} />
            ))}
          </div>
        </div>

        {/* Hero */}
        <div style={{
          padding: '32px 28px 24px',
          background: 'linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
            {/* Portrait */}
            <div style={{
              width: 88, height: 88, borderRadius: 22, flexShrink: 0, overflow: 'hidden',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              border: '2px solid rgba(99,102,241,0.35)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
            }}>
              {!imgErr ? (
                <img
                  src={author.photoURL}
                  alt={author.name}
                  onError={() => setImgErr(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, fontWeight: 800, color: 'rgba(99,102,241,0.8)',
                }}>
                  {author.name.charAt(0)}
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 6, lineHeight: 1.1 }}>
                {author.name}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--indigo-300)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 }}>
                "{author.oneLiner}"
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {author.genres.slice(0, 3).map(g => (
                  <span key={g} style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 10, fontWeight: 600,
                    background: 'rgba(99,102,241,0.1)', color: 'var(--indigo-300)',
                    border: '1px solid rgba(99,102,241,0.18)',
                  }}>{g}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick facts row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 10, marginTop: 22,
          }}>
            {[
              { label: 'Nationality', value: author.nationality, emoji: '🌍' },
              { label: 'Born', value: author.born.split(',')[0], emoji: '📅' },
              ...(author.died ? [{ label: 'Died', value: author.died, emoji: '🕯️' }] : []),
              { label: 'In Library', value: `${libraryBooks.length} book${libraryBooks.length !== 1 ? 's' : ''}`, emoji: '📚' },
            ].map(fact => (
              <div key={fact.label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '10px 14px',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>
                  {fact.emoji} {fact.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{fact.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Bio */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 14 }}>
            BIOGRAPHY
          </h3>
          <p style={{
            fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
          }}>
            {author.bio}
          </p>
        </div>

        {/* Awards */}
        {author.awards && author.awards.length > 0 && (
          <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 12 }}>
              AWARDS & RECOGNITION
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {author.awards.map((award, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Star size={13} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{award}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable works (all, including those not in library) */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 12 }}>
            NOTABLE WORKS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {author.notableWorks.map(work => {
              const inLib = libraryBooks.find(b => b.title === work)
              return (
                <div key={work} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 10,
                  background: inLib ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${inLib ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  cursor: inLib ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
                  onClick={() => inLib && setOpenBook(inLib)}
                >
                  <BookOpen size={13} color={inLib ? '#34d399' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: inLib ? 600 : 400, color: inLib ? 'var(--text-primary)' : 'var(--text-muted)', flex: 1 }}>
                    {work}
                  </span>
                  {inLib && (
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 8, fontWeight: 700,
                      background: 'rgba(16,185,129,0.15)', color: '#34d399',
                      border: '1px solid rgba(16,185,129,0.2)',
                    }}>IN LIBRARY</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Their works in our library */}
        {libraryBooks.length > 0 && (
          <div style={{ padding: '20px 28px 36px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
              AVAILABLE IN LIBRA
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
              {libraryBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main Authors Page ─────────────────────────────────────────────────────────
export default function AuthorsPage() {
  const { user, isAdmin } = useAuth()
  const { uploadedBooks } = useLibrary()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)

  // If URL has ?id=xxx, open that author on mount
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const found = authors.find(a => a.id === id)
      if (found) setSelectedAuthor(found)
    }
  }, [])

  const handleSelect = useCallback((author: Author) => {
    setSelectedAuthor(author)
    setSearchParams({ id: author.id }, { replace: true })
  }, [setSearchParams])

  const handleClose = useCallback(() => {
    setSelectedAuthor(null)
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const filtered = authors.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.oneLiner.toLowerCase().includes(search.toLowerCase()) ||
    a.genres.some(g => g.toLowerCase().includes(search.toLowerCase())) ||
    a.nationality.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 550, height: 550, background: 'rgba(124,58,237,0.05)', top: '-80px', right: '-120px' }} />
      <div className="orb" style={{ width: 380, height: 380, background: 'rgba(99,102,241,0.04)', bottom: '100px', left: '150px' }} />

      {/* Sidebar — desktop */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Sidebar onMobileClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ marginLeft: 'clamp(0px, 260px, 260px)', minHeight: '100vh', position: 'relative', zIndex: 1 }}
        className="main-content">

        {/* Mobile header */}
        <div className="mobile-nav" style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(10,10,20,0.9)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          padding: '12px 16px', alignItems: 'center', gap: '12px'
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '8px', padding: '8px', fontSize: '16px', cursor: 'pointer'
          }}>☰</button>
          <span style={{ fontWeight: 800, fontSize: '16px', flex: 1 }}>Authors</span>
          {isAdmin && (
            <Link to="/admin" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 8, color: 'var(--indigo-300)', fontSize: 12, fontWeight: 600
            }}>
              <Shield size={13} /> Admin
            </Link>
          )}
        </div>

        <div style={{ padding: 'clamp(16px, 3vw, 40px)', paddingBottom: 'clamp(88px, 10vw, 40px)' }}>

          {/* Page header */}
          <div className="animate-fade-in-up" style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, boxShadow: '0 8px 28px rgba(99,102,241,0.35)',
              }}>✍️</div>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                  Meet the <span className="gradient-text">Authors</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                  {authors.length} literary masters · Click any card to explore their full profile
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{
              display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 20,
              padding: '14px 20px',
              background: 'rgba(99,102,241,0.04)',
              border: '1px solid rgba(99,102,241,0.1)',
              borderRadius: 14,
            }}>
              {[
                { emoji: '✍️', label: 'Authors', value: authors.length },
                { emoji: '🌍', label: 'Nationalities', value: new Set(authors.map(a => a.nationality)).size },
                { emoji: '📚', label: 'Books in Library', value: books.length + uploadedBooks.length },
                { emoji: '🏆', label: 'Nobel Laureates', value: 1 },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{s.emoji}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--indigo-400)' }}>{s.value}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 32 }}>
            <div style={{ position: 'relative', maxWidth: 480 }}>
              <span style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, opacity: 0.4
              }}>🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, genre, or nationality…"
                style={{
                  width: '100%', padding: '13px 16px 13px 46px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 13, color: 'var(--text-primary)', fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                  e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.08)', border: 'none',
                  borderRadius: 6, padding: '3px 8px', fontSize: 11,
                  cursor: 'pointer', color: 'var(--text-muted)'
                }}>Clear ✕</button>
              )}
            </div>
          </div>

          {/* Bento grid */}
          {filtered.length > 0 ? (
            <div
              className="animate-fade-in-up stagger-2"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {filtered.map((author, i) => (
                <AuthorCard key={author.id} author={author} index={i} onSelect={handleSelect} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              background: 'rgba(99,102,241,0.03)', borderRadius: 20,
              border: '1px dashed rgba(99,102,241,0.15)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No authors found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try a different name or genre</p>
              <button onClick={() => setSearch('')} style={{
                marginTop: 16, padding: '10px 20px',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 10, color: 'var(--indigo-300)', fontSize: 14, cursor: 'pointer'
              }}>Clear search</button>
            </div>
          )}
        </div>
      </main>

      {/* Author detail slide-over */}
      {selectedAuthor && (
        <AuthorDetailPanel author={selectedAuthor} onClose={handleClose} />
      )}

      {/* PDF Viewer Modal (opens from book cards inside panel) */}
      <PDFViewerModal />

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        <MobileBottomNav />
      </div>

      <style>{`
        @media (min-width: 769px) { .main-content { margin-left: 260px !important; } }
        @media (max-width: 768px) { .main-content { margin-left: 0 !important; } }
        @media (max-width: 520px) {
          div[style*="gridColumn: span 2"] { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  )
}
