import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bookmarks, setSearchQuery } = useLibrary()

  const navItems = [
    { key: 'home',    icon: '🏠', label: 'Home',    path: '/dashboard' },
    { key: 'authors', icon: '✍️', label: 'Authors',  path: '/authors'  },
    { key: 'bookmarks', icon: '🔖', label: 'Saved',  path: '/dashboard', badge: bookmarks.length },
    { key: 'profile', icon: '👤', label: 'Profile',  path: '/dashboard' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: '72px', zIndex: 150,
      background: 'rgba(10,10,20,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(99,102,241,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)'
    }} className="mobile-nav">
      {navItems.map(item => {
        const active = isActive(item.path) && (item.key !== 'bookmarks' && item.key !== 'profile')
          ? location.pathname === item.path
          : item.key === 'authors' && location.pathname === '/authors'

        return (
          <button
            key={item.key}
            onClick={() => {
              navigate(item.path)
              if (item.key === 'bookmarks') setSearchQuery('')
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '8px 12px', background: 'none', border: 'none',
              color: active ? 'var(--indigo-300)' : 'var(--text-muted)',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              position: 'relative',
              width: 40, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '12px',
              background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
              boxShadow: active ? '0 0 12px rgba(99,102,241,0.2)' : 'none',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.badge && item.badge > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '16px', height: '16px',
                  background: 'var(--indigo-500)', color: 'white',
                  borderRadius: '50%', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{item.badge}</span>
              )}
            </div>
            {/* Active underline dot */}
            <span style={{
              fontSize: '10px', fontWeight: active ? 700 : 400,
              color: active ? 'var(--indigo-300)' : 'var(--text-muted)',
            }}>
              {item.label}
            </span>
            {active && (
              <div style={{
                position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                width: 18, height: 3, borderRadius: 2,
                background: 'linear-gradient(90deg, var(--indigo-400), #7c3aed)',
                boxShadow: '0 0 6px rgba(99,102,241,0.6)',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
