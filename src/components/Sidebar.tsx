import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { genres, books } from '../data/books'

interface SidebarProps {
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', key: 'dashboard' },
  { icon: '🔖', label: 'Bookmarks', key: 'bookmarks' },
  { icon: '📖', label: 'Reading', key: 'reading' },
  { icon: '🔍', label: 'Explore', key: 'explore' },
];

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth();
  const { selectedGenre, setSelectedGenre, bookmarks, readingProgress } = useLibrary();
  const [activeNav, setActiveNav] = useState('dashboard');

  const inProgressCount = Object.keys(readingProgress).filter(id => readingProgress[id] > 0 && readingProgress[id] < 100).length;

  return (
    <aside style={{
      width: '260px', height: '100vh', position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column',
      background: 'rgba(10,10,20,0.7)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(99,102,241,0.1)',
      zIndex: 100, padding: '24px 0', overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', flexShrink: 0
          }}>📚</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.3px' }}>Libra</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>PREMIUM LIBRARY</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '0 12px', marginBottom: '8px' }}>NAVIGATION</p>
        {NAV_ITEMS.map(item => (
          <button key={item.key} onClick={() => { setActiveNav(item.key); onMobileClose?.(); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
            background: activeNav === item.key ? 'rgba(99,102,241,0.15)' : 'transparent',
            border: activeNav === item.key ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
            color: activeNav === item.key ? 'var(--indigo-300)' : 'var(--text-secondary)',
            fontSize: '14px', fontWeight: activeNav === item.key ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
          }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.key === 'bookmarks' && bookmarks.length > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'rgba(99,102,241,0.3)',
                color: 'var(--indigo-300)', fontSize: '11px', fontWeight: 600,
                padding: '2px 7px', borderRadius: '10px'
              }}>{bookmarks.length}</span>
            )}
            {item.key === 'reading' && inProgressCount > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'rgba(16,185,129,0.2)',
                color: '#34d399', fontSize: '11px', fontWeight: 600,
                padding: '2px 7px', borderRadius: '10px'
              }}>{inProgressCount}</span>
            )}
          </button>
        ))}

        {/* Genre Filter */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '0 12px', marginBottom: '8px' }}>GENRES</p>
          {['All', ...genres].map(genre => (
            <button key={genre} onClick={() => { setSelectedGenre(genre); onMobileClose?.(); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', marginBottom: '2px',
              background: selectedGenre === genre ? 'rgba(99,102,241,0.12)' : 'transparent',
              border: '1px solid transparent',
              color: selectedGenre === genre ? 'var(--indigo-300)' : 'var(--text-muted)',
              fontSize: '13px', fontWeight: selectedGenre === genre ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
            }}>
              <span>{genre}</span>
              <span style={{ fontSize: '11px', opacity: 0.5 }}>
                {genre === 'All' ? books.length : books.filter(b => b.genre === genre).length}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Admin Panel link — only visible to admin */}
      {isAdmin && (
        <div style={{ padding: '12px 12px 0' }}>
          <Link
            to="/admin"
            onClick={() => onMobileClose?.()}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 12, textDecoration: 'none',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(124,58,237,0.12))',
              border: '1px solid rgba(99,102,241,0.3)',
              color: 'var(--indigo-300)', fontSize: 14, fontWeight: 600
            }}
          >
            <Shield size={15} />
            <span>Admin Panel</span>
            <span style={{
              marginLeft: 'auto', fontSize: 10, padding: '2px 7px',
              background: 'rgba(99,102,241,0.25)', borderRadius: 8,
              color: 'var(--indigo-300)', fontWeight: 700
            }}>ADMIN</span>
          </Link>
        </div>
      )}

      {/* User profile at bottom */}
      <div style={{
        padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 700, color: 'white', flexShrink: 0
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || user?.phone}
          </div>
        </div>
        <button onClick={logout} title="Sign out" style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)',
          color: '#fca5a5', borderRadius: '8px', padding: '6px', fontSize: '14px',
          cursor: 'pointer', flexShrink: 0
        }}>🚪</button>
      </div>
    </aside>
  );
}
