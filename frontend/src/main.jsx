//NOTE : Reviewed on 24th may, 2026
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import './index.css';
import App from './App.jsx';

/**
 * React Application Entry Point (Bootstrap file)
 * 
 * Concepts Used:
 * 1. createRoot: React 18 API that creates a root container for the root element of our application.
 * 2. StrictMode: Development-only tool that highlights potential problems in the application.
 * 3. AuthProvider: Context Provider to handle global user authentication state.
 * 4. BrowserRouter: Router wrapper allowing URL path matching to render sub-components.
 * 5. index.css: Global styles (e.g. Tailwind imports) loaded at the root level.
 */
createRoot(document.getElementById('root')).render(  // App starts form here 
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);

