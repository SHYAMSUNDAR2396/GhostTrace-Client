import React from 'react';

/**
 * VerdictBadge - Displays a color-coded verdict pill badge in Stitch label-caps style.
 *
 * @param {Object} props
 * @param {string} props.verdict - One of: SUSTAINED, NEEDS_MORE_EVIDENCE, OVERRULED, ALTERNATIVE_EXPLANATION
 * @returns {JSX.Element} Inline pill element with color-coded background
 */
export default function VerdictBadge({ verdict }) {
  const config = getVerdictConfig(verdict);

  return (
    <span
      className="label-caps inline-flex items-center px-2 py-0.5"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        fontSize: '9px',
      }}
      title={verdict}
    >
      {config.label}
    </span>
  );
}

/**
 * Returns display configuration for a given verdict string.
 * @param {string} verdict
 * @returns {{ bg: string, text: string, border: string, label: string }}
 */
function getVerdictConfig(verdict) {
  switch (verdict) {
    case 'SUSTAINED':
      return {
        bg: 'rgba(0, 228, 121, 0.1)',
        text: 'var(--surface-tint)',
        border: 'rgba(0, 228, 121, 0.3)',
        label: 'SUSTAINED',
      };
    case 'NEEDS_MORE_EVIDENCE':
      return {
        bg: 'var(--error-container)',
        text: 'var(--on-error-container)',
        border: 'rgba(255, 180, 171, 0.3)',
        label: 'NEEDS_MORE_EVIDENCE',
      };
    case 'OVERRULED':
      return {
        bg: 'rgba(255, 180, 171, 0.2)',
        text: 'var(--error)',
        border: 'rgba(255, 180, 171, 0.5)',
        label: 'OVERRULED',
      };
    case 'ALTERNATIVE_EXPLANATION':
      return {
        bg: 'rgba(235, 215, 255, 0.2)',
        text: 'var(--on-tertiary-container)',
        border: 'rgba(128, 57, 211, 0.3)',
        label: 'ALTERNATIVE_EXPLANATION',
      };
    default:
      return {
        bg: 'rgba(132, 149, 133, 0.15)',
        text: 'var(--outline)',
        border: 'var(--outline-variant)',
        label: verdict || 'UNKNOWN',
      };
  }
}
