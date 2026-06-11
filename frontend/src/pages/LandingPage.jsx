//NOTE: Reviewed on 24th May, 2026
import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { Brain, ChevronRight } from 'lucide-react';

// Import Components
import LoginModal from '../components/Auth/LoginModal';

/**
 * [NAMED FUNCTION COMPONENT]
 * We use standard named function syntax to make our main pages highly readable and easy to debug.
 */
function LandingPage() {
    // [CONTEXT STATE HOOK]
    // Fetches authentication parameters globally from our custom React Authentication Context.
    const { isAuthenticated } = useAuth();

    // [LOCAL STATE HOOK]
    // Tracks whether the login modal overlay dialog is active on the screen.
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // [CONDITIONAL REDIRECT ROUTE]
    // If the context indicates the user is already logged in, we render the '<Navigate />' 
    // React Router component to redirect them directly to the main workspaces/dashboard page.
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-bg text-text-h selection:bg-purple-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Brain size={24} className="text-text-h" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            AxonFlow
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* 
                          [INLINE ARROW FUNCTION]
                          We use simple inline arrow functions for small event triggers 
                          like toggling state values.
                        */}
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="px-6 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/10"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight animate-slide-up">
                        Map your thoughts <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            at the speed of AI
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
                        AxonFlow turns messy ideas into structured knowledge in seconds. Build, collaborate, and scale with intelligent mind maps.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-text-h font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Start for Free <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* 
              [CONDITIONAL RENDERING]
              Only loads and draws the '<LoginModal />' child component on screen
              if 'isLoginModalOpen' is set to true.
            */}
            {isLoginModalOpen && (
                <LoginModal onClose={() => setIsLoginModalOpen(false)} />
            )}
        </div>
    );
}

export default LandingPage;
