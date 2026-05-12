import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { Brain, Zap, Share2, Shield, ChevronRight, Edit3, Sparkles } from 'lucide-react';

// Import Components
import LoginModal from '../components/Auth/LoginModal';
import AutoDemoCanvas from '../components/Landing/AutoDemoCanvas';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Brain size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            AxonFlow
                        </span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">How it Works</a>
                    </div>

                    <div className="flex items-center gap-4">
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8 animate-fade-in">
                        <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                        Next-Gen Mind Mapping Powered by AI
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight animate-slide-up">
                        Map your thoughts <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            at the speed of AI
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
                        AxonFlow turns messy ideas into structured knowledge in seconds. Build, collaborate, and scale with intelligent mind maps.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
                        <button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Start for Free <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Hero Auto-Demo Canvas */}
                <div className="max-w-6xl mx-auto px-6 mt-20 relative animate-fade-in animation-delay-600 h-[700px]">
                    <div className="relative h-full rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 bg-white/5 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10 pointer-events-none" />
                        <AutoDemoCanvas />
                        <div className="absolute bottom-12 left-12 p-6 rounded-2xl bg-[#1a1d27]/90 backdrop-blur-2xl border border-white/10 z-20 hidden md:block shadow-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Zap size={16} className="text-purple-400" />
                                </div>
                                <span className="text-sm font-bold text-white">Live Product Demo</span>
                            </div>
                            <p className="text-xs text-white/50 w-48">Watch AxonFlow build a complex strategy in seconds using AI.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-[#0a0a0c]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-white/50">Everything you need to visualize your next big idea.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles className="text-yellow-400" />,
                                title: "AI Power",
                                desc: "Generate instant mind maps from a single prompt. Let AI expand your thoughts."
                            },
                            {
                                icon: <Share2 className="text-blue-400" />,
                                title: "Infinite Canvas",
                                desc: "No lag, high-performance D3 engine. Scale your maps to thousands of nodes."
                            },
                            {
                                icon: <Shield className="text-purple-400" />,
                                title: "Collaboration",
                                desc: "Share your maps with your team and work together in real-time."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.04] group animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-white/50 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-32 bg-[#0a0a0c] relative overflow-hidden border-t border-white/5">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How it Works</h2>
                        <p className="text-white/50 text-lg">Go from idea to map in 3 simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting line (hidden on mobile) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
                        
                        {[
                            {
                                step: "01",
                                title: "Prompt",
                                desc: "Type any topic, project, or messy idea into the AI assistant.",
                                icon: <Sparkles size={24} className="text-purple-400" />
                            },
                            {
                                step: "02",
                                title: "Generate",
                                desc: "Watch the AI build the branches and connections automatically.",
                                icon: <Zap size={24} className="text-yellow-400" />
                            },
                            {
                                step: "03",
                                title: "Refine",
                                desc: "Edit, color-code, and share your map with the world.",
                                icon: <Edit3 size={24} className="text-blue-400" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: `${i * 200}ms` }}>
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative group hover:border-purple-500/50 transition-colors shadow-xl">
                                    <span className="absolute -top-4 -left-4 text-[10px] font-bold text-white/20 tracking-widest">{item.step}</span>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-white/50 leading-relaxed max-w-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                            <Brain size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold">AxonFlow</span>
                    </div>
                    <p className="text-sm text-white/20">© 2026 AxonFlow AI. All rights reserved.</p>
                </div>
            </footer>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <LoginModal onClose={() => setIsLoginModalOpen(false)} />
            )}
        </div>
    );
};

export default LandingPage;
