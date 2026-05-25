import React, { useEffect, useRef } from 'react';

/**
 * StreamLog - Terminal-style scrolling log display in Stitch design.
 * Uses surface-container-lowest background with green timestamps and color-coded messages.
 *
 * @param {Object} props
 * @param {string[]} props.logs - Array of log message strings
 * @param {boolean} props.isComplete - Whether the stream is complete (hides blinking cursor)
 * @returns {JSX.Element} Dark terminal container with color-coded log entries
 */
export default function StreamLog({ logs = [], isComplete = false }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new log entries
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [logs.length]);

  return (
    <div
      ref={containerRef}
      className="code-sm overflow-y-auto"
      style={{
        backgroundColor: 'var(--surface-container-lowest)',
        borderBottom: '1px solid var(--outline-variant)',
        height: '128px',
        padding: '16px',
      }}
    >
      {logs.length === 0 && (
        <div className="flex gap-4 mb-1">
          <span style={{ color: 'var(--surface-tint)' }}>[--:--:--]</span>
          <span style={{ color: 'var(--on-surface-variant)', opacity: 0.8 }}>
            Waiting for agents...
          </span>
        </div>
      )}
      {logs.map((log, index) => (
        <div key={index} className="flex gap-4 mb-1">
          <span style={{ color: 'var(--surface-tint)' }}>
            {getTimestamp(index)}
          </span>
          <span style={{ color: getLogColor(log), opacity: 0.9 }}>
            {log}
          </span>
        </div>
      ))}
      {!isComplete && (
        <span
          className="inline-block w-2 h-4 cursor-blink ml-2"
          style={{ backgroundColor: 'var(--surface-tint)' }}
        >
          █
        </span>
      )}
    </div>
  );
}

/**
 * Generate a fake timestamp based on log index for visual consistency.
 * @param {number} index
 * @returns {string}
 */
function getTimestamp(index) {
  const base = 14 * 3600 + 22 * 60 + 1; // 14:22:01
  const seconds = base + index * 2;
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `[${h}:${m}:${s}]`;
}

/**
 * Returns text color based on emoji prefix in the log message.
 * 🔴 → error, 🔵 → secondary, ⚖️ → on-surface, ✅ → surface-tint
 *
 * @param {string} log - Log message string
 * @returns {string} CSS color value
 */
function getLogColor(log) {
  if (log.startsWith('🔴')) return 'var(--error)';
  if (log.startsWith('🔵')) return 'var(--secondary)';
  if (log.startsWith('⚖️')) return 'var(--on-surface)';
  if (log.startsWith('✅')) return 'var(--surface-tint)';
  return 'var(--on-surface-variant)';
}
