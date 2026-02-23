import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthLoading, selectAuthError, selectIsAuthenticated, clearError } from '../store/slices/authSlice';
import { useToast } from '../hooks/useToast';

const DEMO_ACCOUNTS = [
  { email: 'alex@demo.com', password: 'demo123', name: 'Alex Rivera' },
  { email: 'jordan@demo.com', password: 'demo123', name: 'Jordan Kim' },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const isAuth = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuth, navigate, dispatch]);

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(form)).then(res => {
      if (!res.error) toast(`Welcome back, ${res.payload.user.name.split(' ')[0]}!`, 'success');
    });
  }

  function fillDemo(account) {
    setForm({ email: account.email, password: account.password });
    setErrors({});
  }

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-header">
          <div className="auth-logo">Food<span>pedia</span></div>
          <div className="auth-tagline">Sign in to review and discover</div>
        </div>

        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-card-subtitle">Sign in to your account to continue</p>

          {/* Demo accounts */}
          <div style={{ background: 'var(--amber-pale)', border: '1px solid rgba(212,130,10,0.2)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber)', marginBottom: 8 }}>
              🎭 Demo Accounts
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DEMO_ACCOUNTS.map(a => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => fillDemo(a)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  {a.name.split(' ')[0]}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--stone)', marginTop: 6 }}>
              Click a name to fill credentials, then sign in.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input${errors.email ? ' error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e2 => ({ ...e2, email: '' })); }}
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input${errors.password ? ' error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(e2 => ({ ...e2, password: '' })); }}
                autoComplete="current-password"
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            {authError && <div className="error-box mb-3">⚠ {authError}</div>}

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in…</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
