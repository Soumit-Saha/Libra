import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import { useAuth } from '../context/AuthContext'

export default function MobileBottomNav() {
  const [active, setActive] = useState('home');
  const { setSelectedGenre, bookmarks } = useLibrary();
  const { logout } = useAuth();

  const navItems = [
    { key: 'home', icon: '🏠', label: 'Home' },
    { key: 'search', icon: '🔍', label: 'Search' },
    { key: 'bookmarks', icon: '🔖', label: 'Saved', badge: bookmarks.length },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ];

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
      {navItems.map(item => (
        <button
          key={item.key}
          onClick={() => {
            setActive(item.key);
            if (item.key === 'bookmarks') setSelectedGenre('All');
          }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            padding: '8px 16px', background: 'none', border: 'none',
            color: active === item.key ? 'var(--indigo-300)' : 'var(--text-muted)',
            cursor: 'pointer', position: 'relative',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            position: 'relative',
            width: 40, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '12px',
            background: active === item.key ? 'rgba(99,102,241,0.15)' : 'transparent',
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
          <span style={{ fontSize: '10px', fontWeight: active === item.key ? 600 : 400 }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
