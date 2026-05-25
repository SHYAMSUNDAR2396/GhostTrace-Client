import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDebateStream } from '../lib/useDebateStream';
import StreamLog from '../components/StreamLog';
import AttackerCard from '../components/AttackerCard';
import SkepticCard from '../components/SkepticCard';
import ArbiterReport from '../components/ArbiterReport';

/**
 * Debate - Real-time split-panel debate view in Stitch design.
 * Fixed header, stream log, split panels with pulsing divider, footer arbiter panel.
 *
 * @returns {JSX.Element} Debate page with streaming agent outputs
 */
export default function Debate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const caseId = searchParams.get('case_id');
  const [activeTab, setActiveTab] = useState('attacker');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const {
    logs,
    attackerData,
    skepticData,
    report,
    phase,
    error,
    start,
    reset,
  } = useDebateStream(caseId);

  // Auto-start debate on mount
  useEffect(() => {
    if (caseId && phase === 'idle') {
      start();
    }
  }, [caseId, start, phase]);

  // Live timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Handle missing case_id
  if (!caseId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="text-center">
          <p style={{ color: 'var(--on-surface-variant)' }}>No case ID provided.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 label-caps cursor-pointer transition-all"
            style={{
              backgroundColor: 'var(--surface-tint)',
              color: 'var(--on-primary)',
            }}
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  // Get incident type from data
  const incidentType = attackerData?.incident_type || 'SUSPECTED_RANSOMWARE';

  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative dot-grid scanline-container"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Fixed Header / TopAppBar */}
      <header
        className="fixed top-0 left-0 w-full z-50 h-16 flex justify-between items-center px-8 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(19, 19, 24, 0.9)',
          borderBottom: '1px solid var(--outline-variant)',
        }}
      >
        <div className="flex items-center gap-6">
          <span
            className="text-2xl font-bold tracking-tighter"
            style={{ color: 'var(--surface-tint)', fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            GhostTrace
          </span>
          <span style={{ color: 'var(--on-surface-variant)', opacity: 0.5 }}>/</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--on-surface)' }}>
            {caseId}
          </span>
          {/* Incident type badge */}
          <div
            className="ml-4 px-3 py-1 label-caps animate-pulse"
            style={{
              backgroundColor: 'var(--error-container)',
              color: 'var(--on-error-container)',
              border: '1px solid rgba(255, 180, 171, 0.3)',
            }}
          >
            {incidentType}
          </div>
          {/* Live timer */}
          <div className="ml-4 code-sm" style={{ color: 'var(--surface-tint)', opacity: 0.8 }}>
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-8">
          {['Attacker', 'Skeptic', 'Arbiter'].map((tab) => {
            const isActive = activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className="label-caps uppercase cursor-pointer transition-colors px-2 py-1"
                style={{
                  color: isActive ? 'var(--surface-tint)' : 'var(--on-surface-variant)',
                  borderBottom: isActive ? '2px solid var(--surface-tint)' : '2px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined transition-colors hover:text-[var(--surface-tint)]" style={{ color: 'var(--on-surface-variant)' }}>
            terminal
          </button>
          <button className="material-symbols-outlined transition-colors hover:text-[var(--surface-tint)]" style={{ color: 'var(--on-surface-variant)' }}>
            bug_report
          </button>
          <button className="material-symbols-outlined transition-colors hover:text-[var(--surface-tint)]" style={{ color: 'var(--on-surface-variant)' }}>
            settings
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mt-16 h-[calc(100vh-112px)] overflow-hidden flex flex-col relative">
        {/* Top Stream Log */}
        <StreamLog logs={logs} isComplete={phase === 'complete' || phase === 'error'} />

        {/* Dual Pane Debate Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Panel: Attacker Agent */}
          <section
            className="flex-1 overflow-y-auto"
            style={{ borderRight: '1px solid var(--outline-variant)' }}
          >
            <AttackerCard data={attackerData} phase={phase} />
          </section>

          {/* Vertical Divider with Pulse */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px z-10 flex flex-col items-center"
            style={{ backgroundColor: 'var(--outline-variant)' }}
          >
            <div
              className="h-full w-[2px] absolute blur-sm"
              style={{ backgroundColor: 'rgba(0, 228, 121, 0.2)' }}
            />
            <div
              className="w-px h-full"
              style={{
                backgroundColor: 'var(--surface-tint)',
                animation: 'pulse-border 2s infinite ease-in-out',
              }}
            />
          </div>

          {/* Right Panel: Skeptic Agent */}
          <section className="flex-1 overflow-y-auto">
            <SkepticCard data={skepticData} attackerData={attackerData} phase={phase} />
          </section>
        </div>
      </main>

      {/* Error card */}
      {phase === 'error' && (
        <div className="fixed bottom-16 left-8 right-8 z-40">
          <div
            className="p-4 flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(147, 0, 10, 0.2)',
              border: '1px solid var(--error)',
            }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} style={{ color: 'var(--error)' }} />
              <p className="text-sm" style={{ color: 'var(--error)' }}>
                {error || 'An error occurred during the debate.'}
              </p>
            </div>
            <button
              onClick={() => { reset(); start(); }}
              className="flex items-center gap-2 px-4 py-1.5 label-caps cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-container)',
                color: 'var(--on-surface)',
                border: '1px solid var(--outline-variant)',
              }}
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Arbiter report slides up from bottom */}
      {report && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: 'rgba(14, 14, 19, 0.95)', backdropFilter: 'blur(8px)' }}
        >
          <div className="min-h-screen flex flex-col items-center justify-start pt-8 pb-20 px-8">
            <div className="w-full max-w-[800px] animate-slide-up">
              <ArbiterReport report={report} />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate('/report', { state: { report, caseId } })}
                className="px-6 py-2 label-caps cursor-pointer transition-all hover:brightness-110"
                style={{
                  backgroundColor: 'var(--surface-tint)',
                  color: 'var(--on-primary)',
                }}
              >
                View Full Report
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 label-caps cursor-pointer transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)',
                }}
              >
                New Investigation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Arbiter Panel */}
      <footer
        className="fixed bottom-0 left-0 w-full z-40 h-12 flex justify-between items-center px-8"
        style={{
          backgroundColor: 'var(--surface-container-highest)',
          borderTop: '2px solid var(--outline)',
        }}
      >
        <div className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: '3s' }}>
          <span className="label-caps" style={{ color: 'var(--error)' }}>
            ARBITER_PANEL_V1 // STATUS: OBJECTIVE_FOCUS
          </span>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--error)' }} />
              <span className="code-sm" style={{ color: 'var(--on-surface)' }}>
                ATTACK_PROB: {getAttackProb(attackerData)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--secondary)' }} />
              <span className="code-sm" style={{ color: 'var(--on-surface)' }}>
                FALSE_POS: {100 - getAttackProb(attackerData)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <button
            className="code-sm transition-opacity hover:opacity-100 cursor-pointer"
            style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}
          >
            Export Forensic Report
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-1 label-caps font-bold cursor-pointer transition-all hover:brightness-110 active:scale-95"
            style={{
              backgroundColor: 'var(--surface-tint)',
              color: 'var(--on-primary)',
            }}
          >
            TERMINATE SESSION
          </button>
        </div>
      </footer>
    </div>
  );
}

/**
 * Calculate attack probability from attacker data.
 */
function getAttackProb(attackerData) {
  if (!attackerData?.kill_chain?.length) return 68;
  const total = attackerData.kill_chain.reduce((sum, s) => sum + (s.confidence || 0), 0);
  return Math.round(total / attackerData.kill_chain.length);
}
