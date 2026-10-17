import React from 'react';

/** Rounded progress bar: cyan-to-green when strong, amber when middling, red when low. Grows in on view. */
export const GradientBar: React.FC<{ value: number; label?: string; className?: string; height?: number }> = ({
  value,
  label,
  className = '',
  height = 8,
}) => {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const tone = v >= 70 ? 'ok' : v >= 45 ? 'mid' : 'low';
  return (
    <div
      className={`tp-bar ${tone} ${className}`}
      style={{ height }}
      role="img"
      aria-label={`${label || 'Score'}: ${v} out of 100`}
    >
      <i style={{ width: `${v}%` }} />
    </div>
  );
};
