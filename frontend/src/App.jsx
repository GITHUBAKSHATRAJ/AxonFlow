import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/authContext';
import { setupAxiosInterceptors } from './services/api/client';

// Pages
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import MyMaps from './pages/MyMaps';
import WorkspaceView from './pages/WorkspaceView';
import LandingPage from './pages/LandingPage';

/**
 * Protected Route Component
 * Redirects to landing page if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Maintain compatibility with interceptor setup
    setupAxiosInterceptors();
  }, []);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/welcome" element={<LandingPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/maps"
        element={
          <ProtectedRoute>
            <MyMaps />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <WorkspaceView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces/:workspaceName"
        element={
          <ProtectedRoute>
            <WorkspaceView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <MyMaps filter="favorites" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <MyMaps filter="trash" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map/:id"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />

      {/* Redirect all other routes to Dashboard (or Welcome if not logged in) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
