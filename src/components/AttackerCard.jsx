import React from 'react';
import { Shield } from 'lucide-react';
import ClaimRow from './ClaimRow';

/**
 * AttackerCard - Displays the Attacker Agent's narrative and kill chain in Stitch style.
 * Red icon, "PROSECUTION_MODE_ACTIVE" badge, confidence score, kill chain cards.
 *
 * @param {Object} props
 * @param {Object|null} props.data - AttackerOutput object with hypothesis and kill_chain
 * @param {string} props.phase - Current debate phase (idle, attacker, skeptic, arbiter, complete)
 * @returns {JSX.Element} Card with red-themed agent badge and kill chain claims
 */
export default function AttackerCard({ data, phase }) {
  const isLoading = !data && phase === 'attacker';

  return (
    <div className="h-full overflow-y-auto p-6" style={{ backgroundColor: 'rgba(27, 27, 32, 0.3)' }}>
      {/* Agent header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--error-container)',
              border: '1px solid rgba(255, 180, 171, 0.5)',
            }}
          >
            <Shield size={20} style={{ color: 'var(--error)' }} />
          </div>
          <div>
            <h2
              className="text-lg font-semibold uppercase tracking-widest"
              style={{ color: 'var(--error)' }}
            >
              Attacker Agent
            </h2>
            <span
              className="inline-block px-2 py-0.5 text-[9px] font-bold"
              style={{
                backgroundColor: 'rgba(255, 180, 171, 0.1)',
                color: 'var(--error)',
                border: '1px solid rgba(255, 180, 171, 0.3)',
              }}
            >
              PROSECUTION_MODE_ACTIVE
            </span>
          </div>
        </div>
        {data && (
          <div className="text-right">
            <div className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
              CONFIDENCE_SCORE
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--error)' }}>
              {getConfidenceScore(data)}%
            </div>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && <LoadingSkeleton />}

      {/* Content */}
      {data && (
        <>
          {/* Hypothesis */}
          {data.hypothesis && (
            <p
              className="text-sm italic mb-6 leading-relaxed"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {data.hypothesis}
            </p>
          )}

          {/* Kill chain stages */}
          <div className="space-y-4">
            {data.kill_chain?.map((stage, index) => (
              <div
                key={index}
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${1.0 + index * 0.5}s` }}
              >
                <ClaimRow
                  stage={stage.stage}
                  claim={stage.claim}
                  evidence_snippet={stage.evidence}
                  mitre_technique={stage.mitre_technique}
                  mitre_name={stage.mitre_name}
                  confidence={stage.confidence}
                  stepIndex={index}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Idle state */}
      {!data && !isLoading && (
        <p className="text-sm" style={{ color: 'var(--outline)' }}>
          Waiting for Attacker Agent to analyze evidence...
        </p>
      )}
    </div>
  );
}

/**
 * Calculate average confidence from kill chain stages.
 */
function getConfidenceScore(data) {
  if (!data?.kill_chain?.length) return 0;
  const total = data.kill_chain.reduce((sum, s) => sum + (s.confidence || 0), 0);
  return Math.round(total / data.kill_chain.length);
}

/**
 * Loading skeleton placeholder with pulse animation.
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-3/4" style={{ backgroundColor: 'var(--surface-container)' }} />
      <div className="h-3 w-full" style={{ backgroundColor: 'var(--surface-container)' }} />
      <div className="h-3 w-5/6" style={{ backgroundColor: 'var(--surface-container)' }} />
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24"
            style={{ backgroundColor: 'var(--surface-container)', borderLeft: '4px solid var(--error-container)' }}
          />
        ))}
      </div>
    </div>
  );
}
