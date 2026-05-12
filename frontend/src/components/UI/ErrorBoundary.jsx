import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#0f111a] text-white p-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            We encountered an error while rendering this component. Try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] rounded-xl font-bold hover:bg-[#4f46e5] transition-all"
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
