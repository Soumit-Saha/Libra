import React from 'react'

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px',
      zIndex: 9999
    }}>
      {/* Animated logo */}
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px solid rgba(99,102,241,0.15)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px solid transparent',
          borderTopColor: 'var(--indigo-500)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: '12px',
          background: 'linear-gradient(135deg, var(--indigo-500), var(--indigo-300))',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>
          📖
        </div>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.1em' }}>
        LOADING LIBRA
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
