import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/useToast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuth = useSelector(selectIsAuthenticated);
  const toast = useToast();

  function handleLogout() {
    dispatch(logout());
    toast('Signed out successfully.', 'info');
    navigate('/');
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Food<span>pedia</span>
        </Link>

        <div className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/restaurants" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Restaurants
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Insights
          </NavLink>
        </div>

        <div className="navbar-actions">
          {isAuth ? (
            <div className="navbar-user">
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="user-avatar">{initials}</div>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
