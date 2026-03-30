import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { books as staticBooks, getFeaturedBooks, getNewBooks } from '../data/books'
import Sidebar from '../components/Sidebar'
import BookCard from '../components/BookCard'
import PDFViewerModal from '../components/PDFViewerModal'
import MobileBottomNav from '../components/MobileBottomNav'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { searchQuery, setSearchQuery, selectedGenre, bookmarks, readingProgress, uploadedBooks } = useLibrary();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Merge static books + admin-uploaded books (uploaded books appear first under "New")
  const allBooks = useMemo(() => [...staticBooks, ...uploadedBooks], [uploadedBooks]);

  const filteredBooks = useMemo(() => {
    let result = [...allBooks];
    if (selectedGenre !== 'All') {
      result = result.filter(b => b.genre === selectedGenre);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [searchQuery, selectedGenre, allBooks]);

  const featuredBooks = getFeaturedBooks();
  const newBooks = [...uploadedBooks, ...getNewBooks()]; // uploaded books = new
  const inProgressBooks = allBooks.filter(b => readingProgress[b.id] > 0 && readingProgress[b.id] < 100);
  const bookmarkedBooks = allBooks.filter(b => bookmarks.includes(b.id));
  const isFiltering = searchQuery || selectedGenre !== 'All';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: 'rgba(99,102,241,0.04)', top: '-100px', right: '-200px' }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'rgba(167,139,250,0.03)', bottom: '100px', left: '200px' }} />

      {/* Sidebar - Desktop */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'
        }} onClick={() => setSidebarOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Sidebar onMobileClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ marginLeft: 'clamp(0px, 260px, 260px)', minHeight: '100vh', position: 'relative', zIndex: 1 }}
        className="main-content">

        {/* Mobile Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div style={{ fontSize: '20px' }}>📚</div>
            <span style={{ fontWeight: 800, fontSize: '16px' }}>Libra</span>
          </div>
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

          {/* Admin banner (desktop) */}
          {isAdmin && (
            <div className="animate-fade-in-up" style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
              padding: '14px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(124,58,237,0.08))',
              border: '1px solid rgba(99,102,241,0.2)'
            }}>
              <Shield size={18} color="var(--indigo-400)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--indigo-300)' }}>Admin Mode Active</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 10 }}>
                  You've uploaded {uploadedBooks.length} book{uploadedBooks.length !== 1 ? 's' : ''} to the library.
                </span>
              </div>
              <Link to="/admin" style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 10, color: 'var(--indigo-300)', fontSize: 13, fontWeight: 600
              }}>
                <Shield size={14} /> Go to Admin Panel →
              </Link>
            </div>
          )}

          {/* Top bar with search */}
          <div className="animate-fade-in-up" style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            marginBottom: '32px', flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '16px', opacity: 0.4
                }}>🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or genre..."
                  style={{
                    width: '100%', padding: '14px 16px 14px 46px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px', color: 'var(--text-primary)',
                    fontSize: '15px', transition: 'all 0.2s'
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                    e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.08)', border: 'none',
                    borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}>Clear ✕</button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Good {getTimeOfDay()},</div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{user?.name?.split(' ')[0]} 👋</div>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: isAdmin
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 700, color: 'white',
                border: `2px solid ${isAdmin ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.4)'}`,
                boxShadow: `0 4px 16px ${isAdmin ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up stagger-1" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px', marginBottom: '36px'
          }}>
            {[
              { icon: '📚', label: 'Total Books', value: allBooks.length, color: 'var(--indigo-400)' },
              { icon: '🔖', label: 'Bookmarked', value: bookmarks.length, color: '#f59e0b' },
              { icon: '📖', label: 'In Progress', value: inProgressBooks.length, color: '#10b981' },
              { icon: '✅', label: 'Completed', value: Object.keys(readingProgress).filter(id => readingProgress[id] >= 100).length, color: '#a78bfa' },
            ].map((stat, i) => (
              <div key={stat.label} className={`animate-fade-in-up stagger-${i + 1}`} style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px', padding: '18px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '12px',
                  background: `${stat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* In Progress section */}
          {!isFiltering && inProgressBooks.length > 0 && (
            <Section title="Continue Reading" emoji="📖" count={inProgressBooks.length}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                {inProgressBooks.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
              </div>
            </Section>
          )}

          {/* New / Uploaded section */}
          {!isFiltering && newBooks.length > 0 && (
            <Section title="New Arrivals" emoji="🆕" count={newBooks.length}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                {newBooks.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
              </div>
            </Section>
          )}

          {/* Featured */}
          {!isFiltering && (
            <Section title="Featured Books" emoji="✨" count={featuredBooks.length}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                {featuredBooks.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
              </div>
            </Section>
          )}

          {/* Bookmarks section */}
          {!isFiltering && bookmarkedBooks.length > 0 && (
            <Section title="Your Bookmarks" emoji="🔖" count={bookmarkedBooks.length}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                {bookmarkedBooks.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
              </div>
            </Section>
          )}

          {/* All / Filtered books */}
          <Section
            title={isFiltering ? 'Search Results' : 'All Books'}
            emoji={isFiltering ? '🔍' : '📚'}
            count={filteredBooks.length}
            subtitle={isFiltering ? `for "${searchQuery || selectedGenre}"` : undefined}
          >
            {filteredBooks.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                {filteredBooks.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
              </div>
            ) : (
              <div style={{
                padding: '60px 20px', textAlign: 'center',
                background: 'rgba(99,102,241,0.03)', borderRadius: '20px',
                border: '1px dashed rgba(99,102,241,0.15)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No books found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Try adjusting your search query or genre filter</p>
                <button onClick={() => setSearchQuery('')} style={{
                  marginTop: '16px', padding: '10px 20px',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '10px', color: 'var(--indigo-300)', fontSize: '14px', cursor: 'pointer'
                }}>Clear search</button>
              </div>
            )}
          </Section>
        </div>
      </main>

      {/* PDF Modal */}
      <PDFViewerModal />

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        <MobileBottomNav />
      </div>

      <style>{`
        @media (min-width: 769px) { .main-content { margin-left: 260px !important; } }
        @media (max-width: 768px) { .main-content { margin-left: 0 !important; } }
      `}</style>
    </div>
  );
}

function Section({ title, emoji, count, subtitle, children }: {
  title: string; emoji: string; count: number; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in-up" style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '20px' }}>{emoji}</span>
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.3px' }}>{title}</h2>
        {subtitle && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{subtitle}</span>}
        <span style={{
          fontSize: '12px', fontWeight: 600, padding: '2px 9px',
          background: 'rgba(99,102,241,0.12)', color: 'var(--indigo-300)',
          borderRadius: '10px', border: '1px solid rgba(99,102,241,0.15)'
        }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
