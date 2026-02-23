import React from 'react';
import { Link } from 'react-router-dom';
import { StarDisplay } from '../common/StarRating';

function PriceRange({ price }) {
  return (
    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--stone)' }}>
      {price}
    </span>
  );
}

export default function RestaurantCard({ restaurant }) {
  const {
    id,
    name,
    cuisine,
    priceRange,
    avg = 0,
    count = 0,
    emoji,
    tags = [],
    neighborhood,
    openNow,
    featured,
  } = restaurant;

  return (
    <Link to={`/restaurants/${id}`} className="restaurant-card fade-in">
      <div className="restaurant-card-image-placeholder" style={{ position: 'relative' }}>
        <span style={{ fontSize: '4rem', userSelect: 'none' }}>{emoji}</span>
        {featured && (
          <span className="badge badge-amber restaurant-card-badge">
            ✦ Featured
          </span>
        )}
        <span
          className="restaurant-card-fav"
          title={openNow ? 'Open now' : 'Closed'}
          style={{ color: openNow ? 'var(--sage)' : 'var(--stone)', cursor: 'default' }}
        >
          {openNow ? '🟢' : '🔴'}
        </span>
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-card-header">
          <h3 className="restaurant-card-name">{name}</h3>
          <PriceRange price={priceRange} />
        </div>

        <div className="restaurant-card-meta">
          <span className="badge badge-stone">{cuisine}</span>
          {avg > 0 && (
            <div className="restaurant-card-rating">
              <StarDisplay rating={avg} size="sm" />
              <strong>{avg.toFixed(1)}</strong>
              <span className="restaurant-card-count">({count})</span>
            </div>
          )}
          {count === 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>No reviews yet</span>
          )}
        </div>

        <div className="restaurant-card-footer">
          <span className="restaurant-card-location">
            <span>📍</span>
            <span>{neighborhood}</span>
          </span>
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="badge badge-stone" style={{ fontSize: '0.72rem' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
