import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ghost, FileText, ArrowLeft } from 'lucide-react';
import ArbiterReport from '../components/ArbiterReport';

/**
 * Report - Professional IR report page in Stitch design.
 * Light forensic card on dark background with action buttons.
 *
 * @returns {JSX.Element} Report page with full IR report rendering
 */
export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get report from location state or localStorage fallback
  const stateData = location.state;
  const report = stateData?.report || getStoredReport();
  const caseId = stateData?.caseId || report?.case_id || 'Unknown';

  // Store report in localStorage for page refresh persistence
  React.useEffect(() => {
    if (stateData?.report) {
      localStorage.setItem('ghosttrace_report', JSON.stringify(stateData.report));
      localStorage.setItem('ghosttrace_report_case_id', stateData.caseId || '');
    }
  }, [stateData]);

  // Handle missing report
  if (!report) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 dot-grid"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline)' }}>
            description
          </span>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            No report data available.
          </p>
          <p className="code-sm" style={{ color: 'var(--outline)' }}>
            Run a debate first to generate a report.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2 label-caps cursor-pointer transition-all"
            style={{
              backgroundColor: 'var(--surface-tint)',
              color: 'var(--on-primary)',
            }}
          >
            <ArrowLeft size={14} />
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen dot-grid pb-20"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* TopAppBar */}
      <header
        className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50"
        style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--outline-variant)',
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-2xl font-bold tracking-tighter"
            style={{ color: 'var(--surface-tint)', fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            GhostTrace
          </span>
          <div className="h-6 w-px mx-2" style={{ backgroundColor: 'var(--outline-variant)' }} />
          <span className="text-lg font-semibold" style={{ color: 'var(--on-surface)' }}>
            {caseId}
          </span>
        </div>
        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate(`/debate?case_id=${caseId}`)}
            className="label-caps cursor-pointer transition-colors px-2 py-1"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            Attacker
          </button>
          <button
            onClick={() => navigate(`/debate?case_id=${caseId}`)}
            className="label-caps cursor-pointer transition-colors px-2 py-1"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            Skeptic
          </button>
          <span
            className="label-caps font-bold pb-1"
            style={{ color: 'var(--surface-tint)', borderBottom: '2px solid var(--surface-tint)' }}
          >
            Arbiter
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>terminal</button>
          <button className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>bug_report</button>
          <button className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>settings</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-12 px-8 flex justify-center">
        <div className="w-full max-w-[800px] animate-slide-up">
          <ArbiterReport report={report} />
        </div>
      </main>

      {/* Action Bar / Footer */}
      <footer
        className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-8 py-2 h-16 shadow-2xl"
        style={{
          backgroundColor: 'var(--surface-container-highest)',
          borderTop: '2px solid var(--outline)',
        }}
      >
        <div className="flex gap-4">
          <span className="label-caps self-center" style={{ color: 'var(--error)' }}>
            ARBITER_PANEL_V1 // STATUS: OBJECTIVE_FOCUS
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 label-caps cursor-pointer transition-all hover:brightness-110"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface)',
            }}
          >
            Terminate Session
          </button>
          <button
            onClick={() => alert('PDF export coming soon')}
            className="px-6 py-2 label-caps cursor-pointer transition-all hover:brightness-110 flex items-center gap-2"
            style={{
              backgroundColor: 'var(--secondary-container)',
              color: 'var(--on-secondary-container)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>picture_as_pdf</span>
            Export Forensic Report
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 label-caps cursor-pointer transition-all hover:brightness-110"
            style={{
              backgroundColor: 'var(--surface-tint)',
              color: 'var(--on-primary)',
              animation: 'glow-pulse 2s infinite',
            }}
          >
            New Investigation
          </button>
        </div>
      </footer>
    </div>
  );
}

/**
 * Retrieve stored report from localStorage.
 * @returns {Object|null}
 */
function getStoredReport() {
  try {
    const stored = localStorage.getItem('ghosttrace_report');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
