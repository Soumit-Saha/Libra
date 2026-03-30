import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLibrary } from '../context/LibraryContext'

export default function PDFViewerModal() {
  const { openBook, setOpenBook, readingProgress, updateProgress } = useLibrary();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openBook) {
      setIsLoading(true);
      setIframeError(false);
      setProgress(readingProgress[openBook.id] || 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openBook]);

  // Simulate reading progress based on scroll / time
  useEffect(() => {
    if (!openBook) return;
    const savedProgress = readingProgress[openBook.id] || 0;
    setProgress(savedProgress);

    // Simulate incremental reading progress over time
    let currentProgress = savedProgress;
    const interval = setInterval(() => {
      if (currentProgress < 95) {
        currentProgress = Math.min(currentProgress + 0.3, 95);
        setProgress(currentProgress);
        updateProgress(openBook.id, currentProgress);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [openBook?.id]);

  const handleClose = useCallback(() => {
    setOpenBook(null);
  }, [setOpenBook]);

  // Handle escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleClose]);

  if (!openBook) return null;

  // Build the PDF viewer URL
  const getPDFUrl = () => {
    const url = openBook.pdf_filePath;
    // For PDFs, use Google Docs viewer or PDF.js approach
    if (url.endsWith('.pdf')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    // For HTML-based content (Gutenberg)
    return url;
  };

  const pdfViewerUrl = getPDFUrl();

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column'
      }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Top Bar */}
      <div style={{
        background: 'rgba(10,10,20,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        padding: '0 24px',
        height: '60px',
        display: 'flex', alignItems: 'center', gap: '16px',
        flexShrink: 0, position: 'relative', zIndex: 10
      }}>
        {/* Progress bar at very top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'rgba(99,102,241,0.15)'
        }}>
          <div className="progress-bar" style={{ width: `${progress}%`, height: '100%', transition: 'width 1s ease' }} />
        </div>

        {/* Book cover tiny */}
        <div style={{
          width: 36, height: 36, borderRadius: '8px', overflow: 'hidden',
          background: '#1a1a2e', flexShrink: 0,
          border: '1px solid rgba(99,102,241,0.2)'
        }}>
          <img src={openBook.coverImageURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {openBook.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {openBook.author} · {openBook.pages} pages
          </div>
        </div>

        {/* Progress display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '10px', padding: '6px 12px'
          }}>
            <div style={{
              width: '36px', height: '36px', position: 'relative', flexShrink: 0
            }}>
              <svg viewBox="0 0 36 36" style={{ width: '36px', height: '36px', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--indigo-400)" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 14 * progress / 100} ${2 * Math.PI * 14 * (1 - progress / 100)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700, color: 'var(--indigo-400)'
              }}>
                {Math.round(progress)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Progress</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--indigo-300)' }}>
                {progress === 0 ? 'Not started' : progress >= 100 ? 'Completed ✓' : 'Reading...'}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', borderRadius: '10px', padding: '8px 14px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Content area */}
      <div
        ref={containerRef}
        style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '20px',
            background: 'var(--bg-secondary)', zIndex: 5
          }}>
            <div style={{
              width: 80, height: 80,
              background: 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
              borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', animation: 'float 2s ease-in-out infinite',
              boxShadow: '0 16px 40px rgba(99,102,241,0.35)'
            }}>📖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', textAlign: 'center', marginBottom: '8px' }}>Opening {openBook.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>Preparing your reading experience...</div>
            </div>
            <div style={{
              width: 200, height: 4, background: 'rgba(99,102,241,0.15)', borderRadius: '2px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: 'linear-gradient(90deg, var(--indigo-500), var(--indigo-300))',
                animation: 'loadProgress 1.5s ease-in-out infinite'
              }} />
            </div>
          </div>
        )}

        {/* Sidebar book info */}
        <div style={{
          width: '280px', flexShrink: 0,
          background: 'rgba(10,10,20,0.8)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(99,102,241,0.1)',
          overflowY: 'auto', padding: '24px'
        }}>
          {/* Book cover */}
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            marginBottom: '24px', aspectRatio: '2/3',
            background: '#1a1a2e'
          }}>
            <img src={openBook.coverImageURL} alt={openBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                const t = e.target as HTMLImageElement;
                t.parentElement!.style.display = 'flex';
                t.parentElement!.style.alignItems = 'center';
                t.parentElement!.style.justifyContent = 'center';
                t.parentElement!.innerHTML = '<div style="font-size:64px;text-align:center">📖</div>';
              }} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', lineHeight: 1.3 }}>{openBook.title}</h2>
          <p style={{ color: 'var(--indigo-300)', fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>{openBook.author}</p>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px'
          }}>
            {[
              { label: 'Year', value: openBook.year },
              { label: 'Pages', value: openBook.pages },
              { label: 'Rating', value: `⭐ ${openBook.rating}` },
              { label: 'Genre', value: openBook.genre },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)',
                borderRadius: '10px', padding: '10px'
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', letterSpacing: '0.06em' }}>{stat.label.toUpperCase()}</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            {openBook.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {openBook.tags.map(tag => (
              <span key={tag} style={{
                padding: '4px 10px', borderRadius: '12px',
                background: 'rgba(99,102,241,0.1)', color: 'var(--indigo-300)',
                border: '1px solid rgba(99,102,241,0.15)', fontSize: '11px', fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>

          {/* Reading progress */}
          {progress > 0 && (
            <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reading Progress</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--indigo-300)' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(99,102,241,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
                <div className="progress-bar" style={{ width: `${progress}%`, height: '100%', borderRadius: '3px', transition: 'width 1s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Viewer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-secondary)' }}>
          {/* Viewer toolbar */}
          <div style={{
            padding: '10px 16px',
            background: 'rgba(10,10,20,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: '12px',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              📄 Reading: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{openBook.title}</span>
            </span>
            <div style={{ flex: 1 }} />
            <a
              href={openBook.pdf_filePath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '8px', color: 'var(--indigo-300)', fontSize: '12px', fontWeight: 500
              }}
            >
              ↗ Open Original
            </a>
          </div>

          {/* iframe */}
          <div style={{ flex: 1, position: 'relative' }}>
            {!iframeError ? (
              <iframe
                ref={iframeRef}
                src={pdfViewerUrl}
                style={{
                  width: '100%', height: '100%', border: 'none',
                  background: 'var(--bg-secondary)'
                }}
                title={openBook.title}
                onLoad={() => setIsLoading(false)}
                onError={() => { setIsLoading(false); setIframeError(true); }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100%', gap: '20px', padding: '40px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '64px' }}>📖</div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Unable to embed preview</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', lineHeight: 1.6 }}>
                    This document cannot be previewed inline due to content security policies.
                    Open it in a new tab for the best reading experience.
                  </p>
                </div>
                <a
                  href={openBook.pdf_filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
                    color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                    boxShadow: '0 8px 24px rgba(99,102,241,0.35)'
                  }}
                >
                  📚 Open Book in New Tab
                </a>
                <div style={{ marginTop: '8px', padding: '16px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Direct link:</p>
                  <a href={openBook.pdf_filePath} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--indigo-400)', fontSize: '12px', wordBreak: 'break-all' }}>
                    {openBook.pdf_filePath}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loadProgress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
