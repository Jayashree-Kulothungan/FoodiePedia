import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, selectStats, selectStatsLoading, selectStatsError } from '../store/slices/statsSlice';
import StatsDashboard from '../components/stats/StatsDashboard';

export default function StatsPage() {
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const loading = useSelector(selectStatsLoading);
  const error = useSelector(selectStatsError);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div className="page-container">
      <div style={{ paddingTop: 48, marginBottom: 12 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900 }}>
          Platform Insights
        </h1>
        <p style={{ color: 'var(--stone)', marginTop: 8, fontSize: '0.95rem' }}>
          Real-time analytics and trends across all restaurants and reviews.
        </p>
      </div>

      {loading && (
        <div className="loading-spinner" style={{ paddingTop: 80 }}>
          <div className="spinner" />
          <span>Crunching the numbers…</span>
        </div>
      )}

      {error && !loading && (
        <div className="error-box">⚠ {error}</div>
      )}

      {!loading && stats && (
        <StatsDashboard stats={stats} />
      )}
    </div>
  );
}
