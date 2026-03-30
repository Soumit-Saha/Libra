import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const validateIdentifier = (val: string): string | null => {
  if (!val) return 'Email or phone is required';
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val);
  if (!isEmail && !isPhone) return 'Enter a valid email address or phone number';
  return null;
};

const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  const levels = [
    { score: 0, label: '', color: 'transparent' },
    { score: 1, label: 'Weak', color: '#ef4444' },
    { score: 2, label: 'Fair', color: '#f59e0b' },
    { score: 3, label: 'Good', color: '#10b981' },
    { score: 4, label: 'Strong', color: '#6366f1' },
  ];
  return levels[Math.min(score, 4)];
};

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const strength = getPasswordStrength(password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Full name must be at least 2 characters';
    const idErr = validateIdentifier(identifier);
    if (idErr) e.identifier = idErr;
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) e.terms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    const result = await signup({ name: name.trim(), identifier, password });
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error || 'Signup failed');
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%', padding: '14px 14px 14px 42px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${errors[field] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '12px', color: 'var(--text-primary)' as any, fontSize: '15px',
    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(99,102,241,0.07)', top: '-150px', right: '-100px' }} />
      <div className="orb" style={{ width: 350, height: 350, background: 'rgba(167,139,250,0.05)', bottom: '-100px', left: '-100px' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, var(--indigo-500), var(--indigo-300))',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(99,102,241,0.3)'
          }}>📚</div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Join <span className="gradient-text">Libra</span> today
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Thousands of books, one elegant experience
          </p>
        </div>

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
            {/* Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>👤</span>
                <input type="text" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})); }}
                  placeholder="John Doe" style={inputStyle('name')}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
              </div>
              {errors.name && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px' }}>{errors.name}</p>}
            </div>

            {/* Identifier */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>EMAIL OR PHONE</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>
                  {identifier && /^[\+]?[(]?[0-9]/.test(identifier) ? '📱' : '✉️'}
                </span>
                <input type="text" value={identifier} onChange={e => { setIdentifier(e.target.value); setErrors(p => ({...p, identifier: ''})); setApiError(''); }}
                  placeholder="email@domain.com or +1234567890" style={inputStyle('identifier')}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.identifier ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
              </div>
              {errors.identifier && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px' }}>{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>🔒</span>
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                  placeholder="Min. 6 characters" style={{ ...inputStyle('password'), paddingRight: '44px' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', fontSize: '14px', opacity: 0.5, padding: '4px'
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                        transition: 'all 0.3s'
                      }} />
                    ))}
                  </div>
                  {strength.label && <p style={{ fontSize: '11px', color: strength.color }}>{strength.label} password</p>}
                </div>
              )}
              {errors.password && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>
                  {confirmPassword && password === confirmPassword ? '✅' : '🔒'}
                </span>
                <input type="password" value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: ''})); }}
                  placeholder="Repeat your password" style={inputStyle('confirmPassword')}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.confirmPassword ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
              </div>
              {errors.confirmPassword && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input type="checkbox" className="custom-checkbox" checked={agreedToTerms}
                onChange={e => { setAgreedToTerms(e.target.checked); setErrors(p => ({...p, terms: ''})); }}
                style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <span style={{ color: 'var(--indigo-400)', cursor: 'pointer' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color: 'var(--indigo-400)', cursor: 'pointer' }}>Privacy Policy</span>
                </p>
                {errors.terms && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>{errors.terms}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, var(--indigo-500), #7c3aed)',
              color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
              boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Creating account...
                </>
              ) : 'Create Free Account →'}
            </button>
          </form>
        </div>

        <p className="animate-fade-in-up stagger-4" style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--indigo-400)', fontWeight: 600 }}>Sign in →</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
