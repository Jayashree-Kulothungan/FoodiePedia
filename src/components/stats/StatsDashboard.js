import React from 'react';
import { StarDisplay } from '../common/StarRating';

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="stat-card fade-in">
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function BarChart({ data, color = 'var(--amber)' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((item, i) => (
        <div key={i} className="bar-chart-col">
          <div
            className="bar-chart-bar"
            style={{
              height: `${Math.max((item.value / max) * 100, 4)}%`,
              background: color,
              opacity: 0.7 + (item.value / max) * 0.3,
            }}
          />
          <span className="bar-chart-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsDashboard({ stats }) {
  if (!stats) return null;

  const { totalReviews, totalRestaurants, avgRating, cuisineCount, ratingDist, topRestaurants, reviewsByCuisine } = stats;

  // Rating distribution chart data
  const ratingChartData = [1, 2, 3, 4, 5].map(star => ({
    label: `${star}★`,
    value: ratingDist[star] || 0,
  }));

  // Cuisine by reviews
  const cuisineRankData = Object.entries(reviewsByCuisine)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCuisine = Math.max(...cuisineRankData.map(c => c[1]), 1);

  return (
    <div className="stats-page">
      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard icon="🏪" label="Total Restaurants" value={totalRestaurants} sub="Listed on Foodpedia" />
        <StatCard icon="✍️" label="Total Reviews" value={totalReviews} sub="User-submitted reviews" />
        <StatCard
          icon="⭐"
          label="Platform Avg Rating"
          value={avgRating > 0 ? avgRating.toFixed(2) : '—'}
          sub="Across all restaurants"
        />
        <StatCard
          icon="🍽️"
          label="Cuisine Types"
          value={Object.keys(cuisineCount).length}
          sub="Different cuisines listed"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="chart-card fade-in fade-in-delay-1">
          <h3>Rating Distribution</h3>
          <BarChart data={ratingChartData} color="var(--amber)" />
        </div>

        <div className="chart-card fade-in fade-in-delay-2">
          <h3>Reviews by Cuisine</h3>
          <div className="cuisine-rank-list">
            {cuisineRankData.map(([cuisine, count], i) => (
              <div key={cuisine} className="cuisine-rank-item">
                <span className="cuisine-rank-num">#{i + 1}</span>
                <span className="cuisine-rank-name">{cuisine}</span>
                <div className="cuisine-rank-bar">
                  <div
                    className="cuisine-rank-fill"
                    style={{ width: `${(count / maxCuisine) * 100}%` }}
                  />
                </div>
                <span className="cuisine-rank-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="chart-card fade-in fade-in-delay-3">
        <h3>Top Rated Restaurants</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {topRestaurants.map((r, i) => (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 0',
                borderBottom: i < topRestaurants.length - 1 ? '1px solid var(--stone-pale)' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: i === 0 ? 'var(--amber)' : 'var(--stone-light)',
                  width: 28,
                }}
              >
                #{i + 1}
              </span>
              <span style={{ fontSize: '2rem' }}>{r.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>{r.cuisine} · {r.neighborhood}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StarDisplay rating={r.avg} size="sm" />
                  <strong>{r.avg.toFixed(1)}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>{r.count} reviews</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
