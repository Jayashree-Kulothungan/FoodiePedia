import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchRestaurants,
  selectAllRestaurants,
  selectRestaurantsLoading,
  selectRestaurantsError,
  selectFilters,
  selectCuisines,
  setFilters,
  resetFilters,
} from '../store/slices/restaurantsSlice';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const SORT_OPTIONS = [
  { value: 'rating', label: '⭐ Top Rated' },
  { value: 'reviews', label: '💬 Most Reviewed' },
  { value: 'name', label: '🔤 A–Z' },
];

export default function RestaurantsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const restaurants = useSelector(selectAllRestaurants);
  const loading = useSelector(selectRestaurantsLoading);
  const error = useSelector(selectRestaurantsError);
  const filters = useSelector(selectFilters);
  const cuisines = useSelector(selectCuisines);

  // Sync URL params → filters on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || 'All';
    dispatch(setFilters({ search, cuisine }));
    dispatch(fetchRestaurants({ search, cuisine, sort: filters.sort }));
    // eslint-disable-next-line
  }, []);

  function applyFilters(newFilters) {
    const merged = { ...filters, ...newFilters };
    dispatch(setFilters(merged));
    dispatch(fetchRestaurants(merged));
    // Reflect in URL
    const params = {};
    if (merged.search) params.search = merged.search;
    if (merged.cuisine && merged.cuisine !== 'All') params.cuisine = merged.cuisine;
    setSearchParams(params);
  }

  function handleSearchKey(e) {
    if (e.key === 'Enter') applyFilters({ search: e.target.value });
  }

  const resultCount = restaurants.length;

  return (
    <div>
      {/* ——— FILTER BAR ——— */}
      <div className="filter-bar">
        <div className="page-container">
          <div className="filter-bar-inner">
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--stone-pale)', borderRadius: 20, padding: '6px 14px', flex: '0 0 260px' }}>
              <span style={{ fontSize: '0.9rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Search…"
                defaultValue={filters.search}
                onBlur={e => applyFilters({ search: e.target.value })}
                onKeyDown={handleSearchKey}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div style={{ width: 1, height: 24, background: 'var(--stone-pale)', flexShrink: 0 }} />

            {/* Cuisine chips */}
            {cuisines.map(c => (
              <button
                key={c}
                className={`filter-chip${filters.cuisine === c ? ' active' : ''}`}
                onClick={() => applyFilters({ cuisine: c })}
              >
                {c}
              </button>
            ))}

            <div style={{ width: 1, height: 24, background: 'var(--stone-pale)', flexShrink: 0 }} />

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={e => applyFilters({ sort: e.target.value })}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--stone)',
                cursor: 'pointer',
                outline: 'none',
                padding: '6px 10px',
                whiteSpace: 'nowrap',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {(filters.search || filters.cuisine !== 'All') && (
              <button
                className="filter-chip"
                onClick={() => {
                  dispatch(resetFilters());
                  dispatch(fetchRestaurants({}));
                  setSearchParams({});
                }}
                style={{ color: 'var(--rust)', borderColor: 'var(--rust)' }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ——— RESULTS ——— */}
      <div className="page-container section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {filters.cuisine !== 'All' ? `${filters.cuisine} Restaurants` : 'All Restaurants'}
            </h2>
            {!loading && (
              <p className="section-subtitle">
                {resultCount} result{resultCount !== 1 ? 's' : ''}
                {filters.search ? ` for "${filters.search}"` : ''}
              </p>
            )}
          </div>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Loading…</span>
          </div>
        )}

        {error && !loading && (
          <div className="error-box">⚠ {error}</div>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍽️</div>
            <h3>No restaurants found</h3>
            <p>Try different search terms or clear filters.</p>
          </div>
        )}

        {!loading && restaurants.length > 0 && (
          <div className="restaurant-grid">
            {restaurants.map((r, i) => (
              <div key={r.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <RestaurantCard restaurant={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
