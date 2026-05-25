import React from 'react';
import { AlertTriangle } from 'lucide-react';
import VerdictBadge from './VerdictBadge';

/**
 * SkepticCard - Displays the Skeptic Agent's challenges and verdicts in Stitch style.
 * Blue icon, "DEFENSE_MODE_ACTIVE" badge, rebuttal cards with border-r-4, DO NOT DO warning.
 *
 * @param {Object} props
 * @param {Object|null} props.data - SkepticOutput object with challenges and assessment
 * @param {Object|null} props.attackerData - AttackerOutput for cross-referencing claims
 * @param {string} props.phase - Current debate phase
 * @returns {JSX.Element} Card with blue-themed agent badge and challenge rows
 */
export default function SkepticCard({ data, attackerData, phase }) {
  const isLoading = !data && phase === 'skeptic';

  return (
    <div className="h-full overflow-y-auto p-6" style={{ backgroundColor: 'rgba(27, 27, 32, 0.3)' }}>
      {/* Agent header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--secondary-container)',
              border: '1px solid rgba(174, 198, 255, 0.5)',
            }}
          >
            <AlertTriangle size={20} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <h2
              className="text-lg font-semibold uppercase tracking-widest"
              style={{ color: 'var(--secondary)' }}
            >
              Skeptic Agent
            </h2>
            <span
              className="inline-block px-2 py-0.5 text-[9px] font-bold"
              style={{
                backgroundColor: 'rgba(174, 198, 255, 0.1)',
                color: 'var(--secondary)',
                border: '1px solid rgba(174, 198, 255, 0.3)',
              }}
            >
              DEFENSE_MODE_ACTIVE
            </span>
          </div>
        </div>
        {data && (
          <div className="text-right">
            <div className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
              OVERALL_ASSESSMENT
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--secondary)' }}>
              {data.overall_assessment || 'MODERATE'}
            </div>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && <LoadingSkeleton />}

      {/* Content */}
      {data && (
        <>
          {/* Challenge rows */}
          <div className="space-y-4 mb-6">
            {data.challenges?.map((challenge, index) => (
              <div
                key={index}
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${1.2 + index * 0.5}s` }}
              >
                <ChallengeRow challenge={challenge} index={index} />
              </div>
            ))}
          </div>

          {/* DO NOT DO warning box */}
          {data.do_not_do && (
            <div
              className="mt-8 p-4 relative overflow-hidden glow-pulse animate-slide-up"
              style={{
                backgroundColor: 'rgba(147, 0, 10, 0.2)',
                border: '2px solid var(--error)',
                animationDelay: '2.5s',
              }}
            >
              {/* Background warning icon */}
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--error)' }}>
                  warning
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2" style={{ color: 'var(--error)' }}>
                <span className="material-symbols-outlined font-bold">cancel</span>
                <span className="label-caps font-bold">DO NOT DO</span>
              </div>
              <ul className="code-sm space-y-2 list-disc list-inside" style={{ color: 'rgba(255, 180, 171, 0.9)' }}>
                {Array.isArray(data.do_not_do) ? (
                  data.do_not_do.map((item, i) => <li key={i}>{item}</li>)
                ) : (
                  <li>{data.do_not_do}</li>
                )}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Idle state */}
      {!data && !isLoading && (
        <p className="text-sm" style={{ color: 'var(--outline)' }}>
          Waiting for Skeptic Agent to cross-examine claims...
        </p>
      )}
    </div>
  );
}

/**
 * ChallengeRow - Single skeptic rebuttal card with border-r-4 border-secondary.
 * @param {Object} props
 * @param {Object} props.challenge - SkepticChallenge object
 * @param {number} props.index - Index for labeling
 */
function ChallengeRow({ challenge, index }) {
  return (
    <div
      className="p-4 transition-all hover:brightness-110"
      style={{
        backgroundColor: 'var(--surface-container)',
        borderRight: '4px solid var(--secondary)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
          REBUTTAL_{String(index + 1).padStart(2, '0')}: {challenge.claim_challenged?.toUpperCase().slice(0, 20) || 'CLAIM'}
        </span>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xs" style={{ color: 'var(--secondary)' }}>
            priority_high
          </span>
          <span className="font-bold" style={{ color: 'var(--secondary)', fontSize: '10px' }}>
            {challenge.verdict === 'ALTERNATIVE_EXPLANATION' ? 'ALTERNATIVE_CAUSE' : 'CORRELATION_GAP'}
          </span>
        </div>
      </div>
      <p className="text-sm italic leading-relaxed" style={{ color: 'var(--on-surface)' }}>
        "{challenge.reasoning}"
      </p>
      {challenge.critical_gap && (
        <p className="code-sm mt-2 opacity-70" style={{ color: 'var(--on-surface-variant)' }}>
          Gap: {challenge.critical_gap}
        </p>
      )}
      {challenge.verdict && (
        <div className="mt-2">
          <VerdictBadge verdict={challenge.verdict} />
        </div>
      )}
    </div>
  );
}

/**
 * Loading skeleton placeholder with pulse animation.
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32" style={{ backgroundColor: 'var(--surface-container)' }} />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24"
            style={{ backgroundColor: 'var(--surface-container)', borderRight: '4px solid var(--secondary-container)' }}
          />
        ))}
      </div>
      <div
        className="h-20"
        style={{ backgroundColor: 'rgba(147, 0, 10, 0.1)', border: '1px solid var(--outline-variant)' }}
      />
    </div>
  );
}
