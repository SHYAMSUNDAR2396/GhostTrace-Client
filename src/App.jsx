import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import Debate from './pages/Debate';
import Report from './pages/Report';

/**
 * ErrorBoundary - Catches rendering errors in child components.
 * Displays a fallback UI with navigation options.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-4"
          style={{ backgroundColor: 'var(--background)' }}
        >
          <div className="text-center space-y-4 max-w-md">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--error)' }}
            >
              Something went wrong
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 text-sm font-medium cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--surface-container)',
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)',
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-4 py-2 text-sm font-medium no-underline"
                style={{
                  backgroundColor: 'var(--surface-tint)',
                  color: 'var(--on-primary)',
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * App - Root application component with React Router.
 * Provides routing between Upload, Debate, and Report pages.
 * Wraps Debate and Report in error boundaries.
 *
 * @returns {JSX.Element} Application shell with routing
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route
            path="/debate"
            element={
              <ErrorBoundary>
                <Debate />
              </ErrorBoundary>
            }
          />
          <Route
            path="/report"
            element={
              <ErrorBoundary>
                <Report />
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
