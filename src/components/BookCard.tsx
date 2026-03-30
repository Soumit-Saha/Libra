import React, { useState } from 'react'
import { Book } from '../data/books'
import { useLibrary } from '../context/LibraryContext'

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { setOpenBook, bookmarks, toggleBookmark, readingProgress } = useLibrary();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isBookmarked = bookmarks.includes(book.id);
  const progress = readingProgress[book.id] || 0;

  const delay = Math.min(index * 0.05, 0.5);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '');
  };

  return (
    <div
      className="book-card animate-fade-in-up"
      style={{
        animationDelay: `${delay}s`,
        opacity: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: 'var(--bg-card)',
        border: `1px solid ${isHovered ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)'}`,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setOpenBook(book)}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden', background: '#1a1a2e' }}>
        {!imgError ? (
          <img
            src={book.coverImageURL}
            alt={book.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)'
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px'
          }}>
            <div style={{ fontSize: '48px' }}>📖</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.3, color: 'white' }}>{book.title}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{book.author}</div>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 60%)',
          transition: 'opacity 0.3s',
          opacity: isHovered ? 1 : 0.7
        }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {book.featured && (
            <span className="badge" style={{ background: 'rgba(99,102,241,0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>
              ✨ Featured
            </span>
          )}
          {book.new && (
            <span className="badge" style={{ background: 'rgba(16,185,129,0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>
              New
            </span>
          )}
        </div>

        {/* Bookmark button */}
        <button
          onClick={e => { e.stopPropagation(); toggleBookmark(book.id); }}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            background: isBookmarked ? 'rgba(99,102,241,0.9)' : 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isBookmarked ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '8px', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', cursor: 'pointer',
            transform: isBookmarked ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          {isBookmarked ? '🔖' : '🏷️'}
        </button>

        {/* Read button on hover */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px', right: '12px',
          opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
            color: 'white', borderRadius: '10px', padding: '8px 12px',
            fontSize: '13px', fontWeight: 600, textAlign: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)'
          }}>
            {progress > 0 ? `Continue Reading (${Math.round(progress)}%)` : 'Read Now →'}
          </div>
        </div>

        {/* Reading progress bar */}
        {progress > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(0,0,0,0.3)' }}>
            <div className="progress-bar" style={{ width: `${progress}%`, height: '100%' }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px' }}>
        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
            {book.title}
          </h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{book.author}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#f59e0b' }}>{renderStars(book.rating)} <span style={{ color: 'var(--text-muted)' }}>{book.rating}</span></span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{book.pages}p</span>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {book.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '12px',
              background: 'rgba(99,102,241,0.1)', color: 'var(--indigo-300)',
              border: '1px solid rgba(99,102,241,0.15)', fontWeight: 500
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
