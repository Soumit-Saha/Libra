import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const validateIdentifier = (val: string): string | null => {
  if (!val) return 'Email or phone is required';
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val);
  if (!isEmail && !isPhone) return 'Enter a valid email or phone number';
  return null;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    const idErr = validateIdentifier(identifier);
    if (idErr) e.identifier = idErr;
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    const result = await login(identifier, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background orbs */}
      <div className="orb" style={{
        width: 600, height: 600, background: 'rgba(99,102,241,0.07)',
        top: '-200px', left: '-200px'
      }} />
      <div className="orb" style={{
        width: 400, height: 400, background: 'rgba(167,139,250,0.05)',
        bottom: '-100px', right: '-100px'
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, var(--indigo-500), var(--indigo-300))',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(99,102,241,0.3)'
          }}>📚</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Welcome back to <span className="gradient-text">Libra</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Sign in to continue your reading journey
          </p>
        </div>

        {/* Card */}
        <div className="glass animate-fade-in-up stagger-2" style={{
          padding: '36px', borderRadius: '24px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.1)'
        }}>
          {apiError && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center'
            }}>
              <span>⚠️</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Identifier */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
                EMAIL OR PHONE
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '16px', opacity: 0.5
                }}>
                  {identifier && /^[\+]?[(]?[0-9]/.test(identifier) ? '📱' : '✉️'}
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => { setIdentifier(e.target.value); setErrors(p => ({...p, identifier: ''})); setApiError(''); }}
                  placeholder="email@domain.com or +1234567890"
                  style={{
                    width: '100%', padding: '14px 14px 14px 42px',
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${errors.identifier ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', color: 'var(--text-primary)', fontSize: '15px',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.identifier ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
                />
              </div>
              {errors.identifier && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px' }}>{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 44px 14px 42px',
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', color: 'var(--text-primary)', fontSize: '15px',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', fontSize: '14px', opacity: 0.5, padding: '4px'
                }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px' }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
              color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
              letterSpacing: '0.02em',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              transform: loading ? 'none' : undefined,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>OR TRY A DEMO</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          <button onClick={() => { setIdentifier('demo@libra.app'); setPassword('demo123'); }} style={{
            width: '100%', padding: '12px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: 'var(--indigo-400)', borderRadius: '12px', fontSize: '14px', fontWeight: 500
          }}>
            ✨ Fill Demo Credentials
          </button>
        </div>

        {/* Sign up link */}
        <p className="animate-fade-in-up stagger-4" style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--indigo-400)', fontWeight: 600 }}>
            Create one free →
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
