import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthLoading, selectAuthError, selectIsAuthenticated, clearError } from '../store/slices/authSlice';
import { useToast } from '../hooks/useToast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const isAuth = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuth, navigate, dispatch]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(err => ({ ...err, [field]: '' }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    dispatch(registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password }))
      .then(res => {
        if (!res.error) toast(`Welcome to Foodpedia, ${res.payload.user.name.split(' ')[0]}!`, 'success');
      });
  }

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-header">
          <div className="auth-logo">Food<span>pedia</span></div>
          <div className="auth-tagline">Join thousands of food lovers</div>
        </div>

        <div className="auth-card">
          <h2>Create an account</h2>
          <p className="auth-card-subtitle">It's free and takes less than a minute</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-input${errors.name ? ' error' : ''}`}
                placeholder="Your name"
                value={form.name}
                onChange={handleChange('name')}
                autoComplete="name"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input${errors.email ? ' error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input${errors.password ? ' error' : ''}`}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="new-password"
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-input${errors.confirm ? ' error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange('confirm')}
                autoComplete="new-password"
              />
              {errors.confirm && <div className="form-error">{errors.confirm}</div>}
            </div>

            {authError && <div className="error-box mb-3">⚠ {authError}</div>}

            <button type="submit" className="btn btn-amber w-full btn-lg" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account…</>
              ) : (
                'Create Account'
              )}
            </button>

            <p style={{ fontSize: '0.78rem', color: 'var(--stone)', textAlign: 'center', marginTop: 16 }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
