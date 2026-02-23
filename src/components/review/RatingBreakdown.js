import React from 'react';
import { StarDisplay } from '../common/StarRating';

export default function RatingBreakdown({ avg = 0, count = 0, breakdown = {} }) {
  const maxCount = Math.max(...Object.values(breakdown), 1);

  return (
    <div className="rating-breakdown">
      <div className="rating-breakdown-header">
        <div>
          <div className="rating-big-score">{avg > 0 ? avg.toFixed(1) : '—'}</div>
          <StarDisplay rating={avg} size="md" />
          <div style={{ fontSize: '0.8rem', color: 'var(--stone)', marginTop: 4 }}>
            {count} review{count !== 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map(star => {
            const c = breakdown[star] || 0;
            const pct = count > 0 ? (c / count) * 100 : 0;
            return (
              <div key={star} className="rating-bar-row">
                <span className="rating-bar-label">{star}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--amber)' }}>★</span>
                <div className="rating-bar-track">
                  <div
                    className="rating-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="rating-bar-count">{c}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
