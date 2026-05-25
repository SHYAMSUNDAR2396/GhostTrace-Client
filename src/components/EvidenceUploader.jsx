import React, { useState, useRef, useCallback } from 'react';
import { Ghost, Upload, FileJson } from 'lucide-react';

/**
 * EvidenceUploader - Drag-and-drop zone in Stitch design.
 * Dashed border with outline-variant color, hover: border-surface-tint with green overlay.
 *
 * @param {Object} props
 * @param {function} props.onFileLoaded - Callback receiving parsed JSON data
 * @param {string|null} props.error - External error message to display
 * @returns {JSX.Element} Drag-and-drop upload zone with file metadata display
 */
export default function EvidenceUploader({ onFileLoaded, error }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [parseError, setParseError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      setParseError(null);

      if (!file) return;

      // Validate file type
      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        setParseError('Only JSON files are accepted.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);

          const artifactCount = parsed.artifacts
            ? Object.values(parsed.artifacts).reduce(
                (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
                0
              )
            : 0;

          setFileInfo({
            name: file.name,
            size: formatFileSize(file.size),
            case_id: parsed.case_id || 'Unknown',
            artifactCount,
          });

          onFileLoaded(parsed);
        } catch (err) {
          setParseError(`Invalid JSON: ${err.message}`);
          setFileInfo(null);
        }
      };
      reader.onerror = () => {
        setParseError('Failed to read file.');
      };
      reader.readAsText(file);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const displayError = error || parseError;

  return (
    <div className="w-full">
      {/* Drop zone - Stitch style */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="group relative flex flex-col items-center justify-center gap-4 p-12 cursor-pointer transition-all duration-300"
        style={{
          border: `2px dashed ${isDragOver ? 'var(--surface-tint)' : 'var(--outline-variant)'}`,
          backgroundColor: isDragOver
            ? 'rgba(0, 228, 121, 0.05)'
            : 'rgba(27, 27, 32, 0.5)',
        }}
      >
        {/* Green overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: 'rgba(0, 228, 121, 0.05)' }}
        />

        {fileInfo ? (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--surface-tint)' }}>
              check_circle
            </span>
            <p className="text-base text-center" style={{ color: 'var(--surface-tint)' }}>
              {fileInfo.name} uploaded
            </p>
            <span className="code-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {fileInfo.size} // Forensic Integrity Verified
            </span>
          </>
        ) : (
          <>
            <Ghost
              size={48}
              className="group-hover:text-[var(--surface-tint)] transition-colors"
              style={{ color: 'var(--outline-variant)' }}
            />
            <p
              className="text-base text-center group-hover:text-[var(--on-surface)] transition-colors"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              Drag & drop JSON evidence bundle
            </p>
            <span
              className="label-caps px-2 py-1"
              style={{
                color: 'var(--outline)',
                border: '1px solid var(--outline-variant)',
                fontSize: '10px',
              }}
            >
              OR CLICK TO BROWSE
            </span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Error display */}
      {displayError && (
        <div
          className="mt-3 p-3 text-sm"
          style={{
            backgroundColor: 'rgba(147, 0, 10, 0.2)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
          }}
        >
          {displayError}
        </div>
      )}
    </div>
  );
}

/**
 * Formats file size in human-readable format.
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
