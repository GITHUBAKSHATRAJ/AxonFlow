import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

/**
 * [CLASS COMPONENT / ERROR BOUNDARY]
 * Concept: In React, Error Boundaries must be written as Class Components 
 * because lifecycle methods like 'getDerivedStateFromError' and 'componentDidCatch' 
 * do not have equivalent Hook alternatives in Functional Components yet.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Updates state so the next render shows the fallback UI instead of crashing the app
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Logs error context to monitoring services
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      /* Dynamic Error Fallback Screen */
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-bg text-text-h p-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-text-muted mb-8 max-w-md">
            We encountered an error while rendering this component. Try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-accent rounded-xl font-bold hover:bg-accent-hover transition-all"
          >
            <RefreshCcw size={18} />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
