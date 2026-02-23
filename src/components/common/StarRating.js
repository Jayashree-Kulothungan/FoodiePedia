import React from 'react';

// Display-only stars
export function StarDisplay({ rating, size = 'md' }) {
  const fontSize = size === 'sm' ? '0.8rem' : size === 'lg' ? '1.3rem' : '1rem';
  return (
    <span className="stars" style={{ fontSize }}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <span
            key={i}
            className={`star${filled ? ' filled' : half ? ' half' : ''}`}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

// Interactive star picker
export function StarPicker({ value, onChange, label = 'Your rating' }) {
  const [hover, setHover] = React.useState(0);

  return (
    <div>
      {label && <div className="form-label">{label}</div>}
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            className={`star-picker-btn${i <= (hover || value) ? ' active' : ''}`}
            style={{
              color: i <= (hover || value) ? 'var(--amber)' : 'var(--stone-light)',
              fontSize: '2rem',
            }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(i)}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
        {value > 0 && (
          <span style={{ marginLeft: 8, fontSize: '0.85rem', color: 'var(--stone)', alignSelf: 'center' }}>
            {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][value]}
          </span>
        )}
      </div>
    </div>
  );
}
