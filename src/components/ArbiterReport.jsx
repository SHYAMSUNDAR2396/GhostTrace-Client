import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import VerdictBadge from './VerdictBadge';
import MitreBadge from './MitreBadge';

/**
 * ArbiterReport - Full forensic report in Stitch style.
 * Light forensic card (#f0f0f8) on dark background with sections.
 *
 * @param {Object} props
 * @param {Object} props.report - ArbiterReport object with all report sections
 * @returns {JSX.Element} Professional IR report layout
 */
export default function ArbiterReport({ report }) {
  if (!report) return null;

  return (
    <div
      className="relative overflow-hidden p-12 shadow-2xl"
      style={{
        backgroundColor: '#f0f0f8',
        color: '#1a1a2e',
        border: '2px solid #000',
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>mist</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight">
              Forensic Audit Report
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="code-sm opacity-60">
                CASE ID: {report.case_id || 'UNKNOWN'}
              </span>
              <ClassificationBadge classification={report.classification} />
            </div>
          </div>
        </div>
        {/* Confidence Meter */}
        <ConfidenceMeter score={report.overall_confidence} />
      </div>

      {/* Horizontal Ruler */}
      <div className="h-1 bg-black mb-10" />

      {/* Incident Summary */}
      {report.incident_summary && (
        <section className="mb-12">
          <p className="text-sm leading-relaxed" style={{ color: '#4a4a5a' }}>
            {report.incident_summary}
          </p>
        </section>
      )}

      {/* Confirmed Findings */}
      {report.confirmed_findings?.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color: '#007139' }}>check_circle</span>
            <h2 className="label-caps" style={{ color: '#007139' }}>
              Section 01: Confirmed Findings
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {report.confirmed_findings.map((finding, index) => (
              <FindingRow key={index} finding={finding} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Unresolved Items */}
      {report.unresolved_items?.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color: '#8039d3' }}>warning</span>
            <h2 className="label-caps uppercase" style={{ color: '#8039d3' }}>
              Section 02: Unresolved Items
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {report.unresolved_items.map((item, index) => (
              <div
                key={index}
                className="p-4"
                style={{
                  backgroundColor: '#ffe8d6',
                  border: '1px solid #ff8c00',
                }}
              >
                <h3 className="code-sm font-bold mb-1" style={{ color: '#8b4513' }}>
                  {typeof item === 'string' ? item : item.item || item.claim || 'UNRESOLVED'}
                </h3>
                {item.required_artifact && (
                  <p className="text-xs leading-relaxed" style={{ color: '#8b4513' }}>
                    Needs: {item.required_artifact}
                  </p>
                )}
                {item.priority && (
                  <p className="text-xs mt-1" style={{ color: '#8b4513' }}>
                    Priority: {item.priority}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Actions */}
      {report.recommended_actions?.length > 0 && (
        <section className="mb-12">
          <h2 className="label-caps uppercase mb-4 pb-1" style={{ borderBottom: '1px solid #000' }}>
            Section 03: Recommended Actions
          </h2>
          <ol className="list-none space-y-3">
            {report.recommended_actions.map((action, index) => (
              <li key={index} className="flex gap-4 items-start">
                <span
                  className="code-lg font-bold w-6 h-6 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                >
                  {index + 1}
                </span>
                <p className="text-sm pt-0.5" style={{ color: '#1a1a2e' }}>
                  {action}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Skeptic Key Flag */}
      {report.skeptic_key_flag && (
        <section
          className="p-6 mb-12"
          style={{
            backgroundColor: 'rgba(0, 99, 216, 0.05)',
            border: '2px solid var(--secondary-container)',
          }}
        >
          <div className="flex gap-4 items-center mb-2">
            <span className="material-symbols-outlined" style={{ color: '#0063d8' }}>priority_high</span>
            <h3 className="code-lg font-bold uppercase" style={{ color: '#0063d8' }}>
              Skeptic Agent Key Warning
            </h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#4a4a5a' }}>
            {report.skeptic_key_flag}
          </p>
        </section>
      )}

      {/* Excluded Claims */}
      {report.excluded_claims?.length > 0 && (
        <section className="mb-12">
          <h2 className="label-caps uppercase mb-4" style={{ color: '#666' }}>
            Excluded Claims
          </h2>
          <ul className="space-y-1">
            {report.excluded_claims.map((claim, index) => (
              <li
                key={index}
                className="text-sm line-through"
                style={{ color: '#999' }}
              >
                {claim}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Forensic Background Decoration */}
      <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>verified_user</span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-12 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="label-caps opacity-40" style={{ fontSize: '10px' }}>
          Document generated by GhostTrace Arbiter Core // Hash: {generateHash()}
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-black" />
          <div className="w-3 h-3" style={{ backgroundColor: '#00e479' }} />
          <div className="w-3 h-3" style={{ backgroundColor: '#0063d8' }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Classification badge with color coding.
 */
function ClassificationBadge({ classification }) {
  const colors = {
    Confirmed: { bg: '#007139', text: '#fff' },
    Probable: { bg: '#0063d8', text: '#e1e8ff' },
    Suspected: { bg: '#ff8c00', text: '#fff' },
    Inconclusive: { bg: '#666', text: '#fff' },
  };

  const style = colors[classification] || colors.Inconclusive;

  return (
    <span
      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.bg}`,
      }}
    >
      {classification || 'Unknown'}
    </span>
  );
}

/**
 * Single confirmed finding row.
 */
function FindingRow({ finding, index }) {
  const text = typeof finding === 'string' ? finding : finding.claim || finding.finding || '';
  const evidence = typeof finding === 'object' ? finding.evidence : null;
  const timestamp = typeof finding === 'object' ? finding.timestamp : null;

  return (
    <div
      className="bg-white p-4 shadow-sm"
      style={{ borderLeft: '4px solid #00e479' }}
    >
      <div className="flex justify-between mb-2">
        <span className="code-sm font-bold uppercase">
          Trace-{String.fromCharCode(65 + index)}: {typeof finding === 'object' ? (finding.stage || finding.claim?.slice(0, 30)) : text.slice(0, 30)}
        </span>
        {timestamp && (
          <span className="code-sm opacity-40">TIMESTAMP: {timestamp}</span>
        )}
      </div>
      <p className="text-sm italic" style={{ color: '#4a4a5a' }}>
        "{text}"
      </p>
      {evidence && (
        <p className="code-sm mt-1 opacity-60">{evidence}</p>
      )}
      {typeof finding === 'object' && finding.mitre_technique && (
        <div className="mt-2">
          <MitreBadge techniqueId={finding.mitre_technique} techniqueName={finding.mitre_name} />
        </div>
      )}
    </div>
  );
}

/**
 * Generate a fake document hash for display.
 */
function generateHash() {
  return Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6);
}
