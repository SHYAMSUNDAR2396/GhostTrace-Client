import { useState, useRef, useCallback, useEffect } from 'react';
import { BASE_URL } from './api';

/**
 * Custom React hook that manages an SSE connection to the GhostTrace debate pipeline.
 * Handles phase transitions, event dispatching, and cleanup.
 *
 * @param {string} caseId - The case ID to stream debate results for.
 * @returns {{
 *   logs: string[],
 *   attackerData: object|null,
 *   skepticData: object|null,
 *   report: object|null,
 *   phase: 'idle'|'attacker'|'skeptic'|'arbiter'|'complete'|'error',
 *   error: string|null,
 *   start: () => void,
 *   reset: () => void
 * }}
 */
export function useDebateStream(caseId) {
  const [logs, setLogs] = useState([]);
  const [attackerData, setAttackerData] = useState(null);
  const [skepticData, setSkepticData] = useState(null);
  const [report, setReport] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  /**
   * Start the SSE connection to the debate pipeline.
   * Creates an EventSource that listens for debate events and
   * dispatches them to the appropriate state setters.
   */
  const start = useCallback(() => {
    if (!caseId) return;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setPhase('attacker');
    setError(null);

    const es = new EventSource(`${BASE_URL}/run?case_id=${caseId}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'log':
            setLogs((prev) => [...prev, data.message]);
            if (phase === 'idle') {
              setPhase('attacker');
            }
            break;

          case 'node_complete':
            if (data.node === 'attacker') {
              setAttackerData(data.data?.attacker_parsed || data.data);
              setPhase('skeptic');
            } else if (data.node === 'skeptic') {
              setSkepticData(data.data?.skeptic_parsed || data.data);
              setPhase('arbiter');
            }
            break;

          case 'complete':
            setReport(data.report);
            setPhase('complete');
            es.close();
            break;

          case 'error':
            setError(data.message);
            setPhase('error');
            es.close();
            break;

          default:
            break;
        }
      } catch (parseError) {
        // Ignore malformed SSE messages
      }
    };

    es.onerror = () => {
      // Only set error if we haven't already completed or errored
      setPhase((currentPhase) => {
        if (currentPhase !== 'complete' && currentPhase !== 'error') {
          setError('Connection to debate stream lost');
          return 'error';
        }
        return currentPhase;
      });
      es.close();
    };
  }, [caseId]);

  /**
   * Reset all state to initial values and close the EventSource connection.
   */
  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setLogs([]);
    setAttackerData(null);
    setSkepticData(null);
    setReport(null);
    setPhase('idle');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return { logs, attackerData, skepticData, report, phase, error, start, reset };
}
