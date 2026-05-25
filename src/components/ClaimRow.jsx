import React from 'react';
import VerdictBadge from './VerdictBadge';
import MitreBadge from './MitreBadge';

/**
 * ClaimRow - Kill chain card in Stitch style.
 * bg-surface-container with border-l-4 (color varies by verdict).
 *
 * @param {Object} props
 * @param {string} props.stage - Kill chain stage name (e.g. "Initial Access")
 * @param {string} props.claim - The claim text
 * @param {string} props.evidence_snippet - Evidence supporting the claim
 * @param {string} props.mitre_technique - MITRE technique ID (e.g. "T1059.001")
 * @param {string} props.mitre_name - MITRE technique name
 * @param {number} props.confidence - Confidence score 0-100
 * @param {string} [props.verdict] - Optional verdict from skeptic
 * @param {number} [props.stepIndex] - Step number for display
 * @returns {JSX.Element} Kill chain card with claim details
 */
export default function ClaimRow({
  stage,
  claim,
  evidence_snippet,
  mitre_technique,
  mitre_name,
  confidence,
  verdict,
  stepIndex = 0,
}) {
  const borderColor = getBorderColor(verdict);

  return (
    <div
      className="p-4 transition-all hover:brightness-110"
      style={{
        backgroundColor: 'var(--surface-container)',
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      {/* Top row: step label + verdict */}
      <div className="flex justify-between items-start mb-2">
        <span className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
          STEP_{String(stepIndex + 1).padStart(2, '0')}: {stage?.toUpperCase() || 'UNKNOWN'}
        </span>
        {verdict && <VerdictBadge verdict={verdict} />}
      </div>

      {/* Claim text */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--on-surface)' }}>
        {claim}
      </p>

      {/* Evidence snippet */}
      {evidence_snippet && (
        <p
          className="code-sm mb-3 opacity-70 truncate"
          style={{ color: 'var(--on-surface-variant)' }}
          title={evidence_snippet}
        >
          {evidence_snippet}
        </p>
      )}

      {/* Bottom row: MITRE badges */}
      <div className="flex gap-2 flex-wrap">
        {mitre_technique && (
          <MitreBadge techniqueId={mitre_technique} techniqueName={mitre_name} />
        )}
        {mitre_name && (
          <span
            className="code-sm inline-flex items-center px-2 py-1"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface-variant)',
              fontSize: '10px',
            }}
          >
            OS_INT: {mitre_name.toUpperCase().replace(/\s+/g, '_')}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Returns left border color based on verdict.
 * @param {string|undefined} verdict
 * @returns {string} CSS color
 */
function getBorderColor(verdict) {
  switch (verdict) {
    case 'SUSTAINED':
      return 'var(--surface-tint)';
    case 'NEEDS_MORE_EVIDENCE':
      return 'rgba(255, 180, 171, 0.5)';
    case 'OVERRULED':
      return 'var(--error)';
    case 'ALTERNATIVE_EXPLANATION':
      return 'var(--on-tertiary-container)';
    default:
      return 'var(--error)';
  }
}
