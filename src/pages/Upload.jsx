import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Ghost } from 'lucide-react';
import EvidenceUploader from '../components/EvidenceUploader';
import { uploadEvidence } from '../lib/api';

/**
 * Preset scenario definitions for quick-loading sample evidence.
 */
const PRESETS = [
  { label: 'RANSOMWARE', icon: 'lock', file: 'sample_ransomware.json' },
  { label: 'INSIDER', icon: 'person_search', file: 'sample_insider_threat.json' },
  { label: 'APT', icon: 'security', file: 'sample_apt_lateral.json' },
];

/**
 * Upload - Landing page with Stitch design system.
 * Centered layout with dot-grid background, scanline effect, and terminal aesthetic.
 *
 * @returns {JSX.Element} Upload page with evidence uploader and launch button
 */
export default function Upload() {
  const navigate = useNavigate();
  const [evidenceData, setEvidenceData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPreset, setLoadingPreset] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  /**
   * Handle file loaded from EvidenceUploader or preset button.
   */
  const handleFileLoaded = useCallback((data) => {
    setEvidenceData(data);
    setError(null);
  }, []);

  /**
   * Load a preset scenario by fetching the sample JSON from the backend evidence directory.
   */
  const handlePresetClick = async (preset) => {
    setLoadingPreset(preset.file);
    setSelectedPreset(preset.file);
    setError(null);
    try {
      const response = await fetch(`/evidence/${preset.file}`);
      if (!response.ok) {
        throw new Error(`Failed to load preset: ${response.status}`);
      }
      const data = await response.json();
      setEvidenceData(data);
    } catch (err) {
      try {
        const res = await fetch(`http://localhost:8000/evidence/${preset.file}`);
        if (res.ok) {
          const data = await res.json();
          setEvidenceData(data);
        } else {
          setError(`Could not load preset: ${err.message}`);
        }
      } catch {
        setError(`Could not load preset: ${err.message}`);
      }
    } finally {
      setLoadingPreset(null);
    }
  };

  /**
   * Upload evidence and navigate to debate page.
   */
  const handleLaunchDebate = async () => {
    if (!evidenceData) return;

    setIsUploading(true);
    setError(null);

    try {
      const blob = new Blob([JSON.stringify(evidenceData)], { type: 'application/json' });
      const file = new File([blob], `${evidenceData.case_id || 'evidence'}.json`, {
        type: 'application/json',
      });

      const result = await uploadEvidence(file);
      navigate(`/debate?case_id=${result.case_id}`);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden dot-grid"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      {/* Header / Branding */}
      <header className="mb-12 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--surface-tint)' }}>
            mist
          </span>
          <h1
            className="code-lg font-bold tracking-tighter"
            style={{ fontSize: '28px', color: 'var(--surface-tint)' }}
          >
            GhostTrace
          </h1>
        </div>
        <p className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
          ADVERSARIAL MULTI-AGENT FORENSIC DEBATE
        </p>
      </header>

      {/* Main Upload Card */}
      <main
        className="w-full max-w-[560px] relative transition-all duration-500 hover:border-[rgba(0,228,121,0.5)]"
        style={{
          backgroundColor: 'var(--surface-container)',
          border: '1px solid var(--outline-variant)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Scanline effect */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 pointer-events-none"
          style={{
            background: 'rgba(0, 228, 121, 0.2)',
            animation: 'scanline 4s linear infinite',
          }}
        />

        <div className="p-8">
          {/* Drop Zone */}
          <div className="mb-8">
            <EvidenceUploader onFileLoaded={handleFileLoaded} error={null} />
          </div>

          {/* Preset Scenarios */}
          <div className="mb-8">
            <h3 className="label-caps mb-4" style={{ color: 'var(--outline)' }}>
              SELECT PRESET_SCENARIO
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.file}
                  onClick={() => handlePresetClick(preset)}
                  disabled={loadingPreset !== null}
                  className="flex flex-col items-center p-4 transition-all group active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-container-lowest)',
                    border: `1px solid ${selectedPreset === preset.file ? 'var(--surface-tint)' : 'var(--outline-variant)'}`,
                    ...(selectedPreset === preset.file && { backgroundColor: 'rgba(0, 228, 121, 0.05)' }),
                  }}
                >
                  {loadingPreset === preset.file ? (
                    <Loader2 size={20} className="animate-spin mb-2" style={{ color: 'var(--surface-tint)' }} />
                  ) : (
                    <span
                      className="material-symbols-outlined mb-2 group-hover:text-[var(--surface-tint)] transition-colors"
                      style={{ color: 'var(--on-surface-variant)' }}
                    >
                      {preset.icon}
                    </span>
                  )}
                  <span className="label-caps" style={{ fontSize: '10px' }}>
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleLaunchDebate}
            disabled={!evidenceData || isUploading}
            className="w-full h-14 flex items-center justify-center gap-3 transition-all uppercase tracking-widest label-caps cursor-pointer disabled:cursor-not-allowed"
            style={{
              fontSize: '14px',
              backgroundColor: evidenceData ? 'var(--surface-tint)' : 'var(--surface-container-highest)',
              color: evidenceData ? 'var(--on-primary)' : 'var(--on-surface-variant)',
              border: evidenceData ? 'none' : '1px solid var(--outline-variant)',
              boxShadow: evidenceData ? '0 0 20px rgba(0, 228, 121, 0.2)' : 'none',
            }}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>INITIALIZING AGENTS...</span>
              </>
            ) : (
              <>
                <span>LAUNCH DEBATE</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>terminal</span>
              </>
            )}
          </button>

          {/* Error display */}
          {error && (
            <div
              className="mt-4 p-3 text-sm"
              style={{
                backgroundColor: 'rgba(147, 0, 10, 0.2)',
                border: '1px solid var(--error)',
                color: 'var(--error)',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div
          className="px-4 py-2 flex justify-between items-center"
          style={{
            backgroundColor: 'var(--surface-container-lowest)',
            borderTop: '1px solid var(--outline-variant)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: evidenceData ? 'var(--surface-tint)' : 'var(--error)' }}
              />
              <span className="code-sm" style={{ color: 'var(--on-surface-variant)' }}>
                SESSION: {evidenceData ? 'READY' : 'IDLE'}
              </span>
            </div>
            <span className="code-sm" style={{ color: 'var(--outline)' }}>|</span>
            <span className="code-sm" style={{ color: 'var(--outline)' }}>V0.9.4-BETA</span>
          </div>
          <span className="code-sm" style={{ color: 'rgba(0, 228, 121, 0.5)' }}>
            {evidenceData ? 'DATA_LOADED' : 'W8ING_FOR_DATA'}
          </span>
        </div>
      </main>

      {/* Footer Text */}
      <footer className="mt-12 opacity-50">
        <p className="code-sm italic" style={{ color: 'var(--on-surface-variant)' }}>
          "Hallucinations collapse under cross-examination."
        </p>
      </footer>

      {/* Visual Atmospheric Element */}
      <div className="fixed bottom-0 left-0 p-8 pointer-events-none opacity-20">
        <div className="space-y-1">
          <div className="w-48 h-1" style={{ backgroundColor: 'rgba(0, 228, 121, 0.3)' }} />
          <div className="w-32 h-1" style={{ backgroundColor: 'rgba(0, 228, 121, 0.2)' }} />
          <div className="w-16 h-1" style={{ backgroundColor: 'rgba(0, 228, 121, 0.1)' }} />
        </div>
      </div>
    </div>
  );
}
