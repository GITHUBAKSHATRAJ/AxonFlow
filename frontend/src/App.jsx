import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptors } from './services/api/client';

import Editor from './pages/Editor';

// Dummy components for non-editor pages
const Dashboard = () => (
    <div className="p-10 text-white bg-[#121212] min-h-screen">
        <h1 className="text-3xl font-bold mb-4">AxonFlow Dashboard</h1>
        <p className="text-gray-400">Welcome to your workspace. (Migration in progress...)</p>
        <button 
            className="mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={() => window.location.href = '/map/test-map'}
        >
            Enter Test Map
        </button>
    </div>
);

const LoginPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#0f111a] text-white">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">AxonFlow</h1>
            <p className="text-gray-500 mb-8">Next-Gen Mind Mapping</p>
            {/* Clerk's SignInButton would go here in a real scenario */}
            <div className="p-8 bg-[#1a1a2a] rounded-2xl border border-white/5">
                Please Sign In via Clerk
            </div>
        </div>
    </div>
);

function App() {
    const { getToken } = useAuth();

    useEffect(() => {
        setupAxiosInterceptors(getToken);
    }, [getToken]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={
                    <>
                        <SignedIn>
                            <Dashboard />
                        </SignedIn>
                        <SignedOut>
                            <Navigate to="/login" replace />
                        </SignedOut>
                    </>
                } />

                <Route path="/map/:id" element={
                    <>
                        <SignedIn>
                            <Editor />
                        </SignedIn>
                        <SignedOut>
                            <Navigate to="/login" replace />
                        </SignedOut>
                    </>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
