import React from 'react';

/**
 * MitreBadge - Small dark pill badge linking to MITRE ATT&CK technique page.
 *
 * @param {Object} props
 * @param {string} props.techniqueId - MITRE technique ID (e.g. "T1059" or "T1059.001")
 * @param {string} props.techniqueName - Human-readable technique name for tooltip
 * @returns {JSX.Element} Clickable pill that opens MITRE ATT&CK URL in new tab
 */
export default function MitreBadge({ techniqueId, techniqueName }) {
  if (!techniqueId) return null;

  const url = buildMitreUrl(techniqueId);

  return (
    <button
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      title={techniqueName || techniqueId}
      className="code-sm inline-flex items-center px-2 py-1 transition-colors cursor-pointer hover:border-[var(--surface-tint)]"
      style={{
        backgroundColor: 'var(--background)',
        border: '1px solid var(--outline-variant)',
        color: 'var(--on-surface-variant)',
        fontSize: '10px',
      }}
    >
      MITRE: {techniqueId}
    </button>
  );
}

/**
 * Builds the MITRE ATT&CK URL for a given technique ID.
 * Handles sub-technique format: T1059.001 → /techniques/T1059/001/
 *
 * @param {string} techniqueId - e.g. "T1059" or "T1059.001"
 * @returns {string} Full MITRE ATT&CK URL
 */
export function buildMitreUrl(techniqueId) {
  const base = 'https://attack.mitre.org/techniques/';

  if (techniqueId.includes('.')) {
    const [parent, sub] = techniqueId.split('.');
    return `${base}${parent}/${sub}/`;
  }

  return `${base}${techniqueId}/`;
}
