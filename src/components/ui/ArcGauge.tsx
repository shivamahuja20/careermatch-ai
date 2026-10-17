import React, { useId } from 'react';

interface ArcGaugeProps {
  value: number;
  label: string;
  /** Width in pixels. Height follows the 140 x 84 shape. */
  size?: number;
}

/** Semicircle gauge with a violet-to-cyan gradient stroke and a knob at the value (TalentPulse style). */
export const ArcGauge: React.FC<ArcGaugeProps> = ({ value, label, size = 150 }) => {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const r = 58;
  const c = Math.PI * r;
  const off = c * (1 - v / 100);
  const a = Math.PI * (1 - v / 100);
  const kx = 70 + r * Math.cos(a);
  const ky = 74 - r * Math.sin(a);
  const gid = `gg-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const numSize = size >= 160 ? '2.3rem' : size >= 130 ? '2rem' : '1.6rem';
  return (
    <div className="tp-gauge" style={{ width: size, maxWidth: '100%' }} role="img" aria-label={`${label}: ${v} out of 100`}>
      <svg viewBox="0 0 140 84" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--tp-g1)" />
            <stop offset="1" stopColor="var(--tp-g2)" />
          </linearGradient>
        </defs>
        <path d="M12 74A58 58 0 0 1 128 74" fill="none" stroke="var(--tp-track)" strokeWidth="11" strokeLinecap="round" />
        <path
          className="prog"
          d="M12 74A58 58 0 0 1 128 74"
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={c.toFixed(1)}
          strokeDashoffset={off.toFixed(1)}
          style={{ ['--c' as any]: c.toFixed(1) }}
        />
        <circle className="knob" cx={kx.toFixed(1)} cy={ky.toFixed(1)} r="5" />
      </svg>
      <div className="val">
        <b style={{ fontSize: numSize }}>{v}</b>
        <span>/ 100</span>
      </div>
    </div>
  );
};

/** Plain-language band for a 0-100 score. */
export function scoreBand(v: number): { label: string; tone: 'ok' | 'mid' | 'low' } {
  if (v >= 75) return { label: 'Strong alignment', tone: 'ok' };
  if (v >= 60) return { label: 'Good alignment', tone: 'ok' };
  if (v >= 45) return { label: 'Moderate alignment', tone: 'mid' };
  return { label: 'Limited alignment', tone: 'low' };
}
