import React from 'react';

/**
 * ConfidenceMeter - SVG circular progress ring in Stitch style.
 * Large ring with green stroke and animated stroke-dashoffset.
 *
 * @param {Object} props
 * @param {number} props.score - Confidence score from 0 to 100
 * @returns {JSX.Element} SVG circular gauge with percentage and label
 */
export default function ConfidenceMeter({ score }) {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score ?? 0));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
        {/* Background circle */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="transparent"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="transparent"
          stroke="#00e479"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="code-lg font-bold leading-none" style={{ color: 'var(--on-surface)' }}>
          {clampedScore}%
        </span>
        <span className="uppercase font-bold opacity-60" style={{ fontSize: '8px' }}>
          Confid.
        </span>
      </div>
    </div>
  );
}

/**
 * Returns the color for a given confidence score.
 * Green (≥70), amber (40-69), red (<40).
 *
 * @param {number} score - 0 to 100
 * @returns {string} CSS color value
 */
export function getScoreColor(score) {
  if (score >= 70) return 'var(--surface-tint)';
  if (score >= 40) return 'var(--secondary)';
  return 'var(--error)';
}
