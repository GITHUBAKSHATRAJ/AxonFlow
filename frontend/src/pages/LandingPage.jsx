import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate, Link } from 'react-router-dom';
import { Brain, Zap, Share2, Globe, Shield, MessageSquare, ChevronRight, Play } from 'lucide-react';
import LoginModal from '../components/Auth/LoginModal';

// Import Assets
import heroImg from '../assets/hero.png';
import brainstormImg from '../assets/brainstorming.png';
import productivityImg from '../assets/productivity.png';

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
                        <a href="#vision" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Vision</a>
                        <a href="#pricing" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/10"
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
                        Visualize Your Thoughts <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            at the Speed of AI
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
                        AxonFlow transforms fragmented ideas into structured knowledge. Create complex mind maps, collaborate in real-time, and let AI help you expand your horizons.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
                        <button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Start Mapping Free <ChevronRight size={20} />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Play size={20} fill="currentColor" /> Watch Demo
                        </button>
                    </div>
                </div>

                {/* Hero Image / Mockup */}
                <div className="max-w-6xl mx-auto px-6 mt-20 relative animate-fade-in animation-delay-600">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 bg-white/5 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10" />
                        <img 
                            src={heroImg} 
                            alt="AxonFlow Canvas" 
                            className="w-full h-auto object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-700"
                        />
                        {/* Decorative glass elements */}
                        <div className="absolute bottom-12 left-12 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 z-20 hidden md:block">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Zap size={16} className="text-purple-400" />
                                </div>
                                <span className="text-sm font-bold text-white">AI Suggestion</span>
                            </div>
                            <p className="text-xs text-white/50 w-48">"Based on your map, should we add a section for 'Architecture Design'?"</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-[#0a0a0c]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-white/50">Built for individuals and teams who think visually.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="text-yellow-400" />,
                                title: "Instant Generation",
                                desc: "Turn a single prompt into a fully fleshed out mind map in seconds."
                            },
                            {
                                icon: <Share2 className="text-blue-400" />,
                                title: "Infinite Canvas",
                                desc: "No boundaries. Expand your thoughts in every direction with our high-performance D3 engine."
                            },
                            {
                                icon: <Shield className="text-purple-400" />,
                                title: "Secure by Design",
                                desc: "Your data is encrypted and private. You control who sees your workspaces."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.04] group">
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

            {/* Brainstorming Section */}
            <section className="py-24 bg-[#0a0a0c]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 mb-6">
                            Team Collaboration
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Collective Brainstorming <br /><span className="text-white/40">Redefined</span></h2>
                        <p className="text-lg text-white/50 mb-8 leading-relaxed">
                            AxonFlow isn't just for solo thinkers. Invite your team and watch as nodes branch out in real-time. Our AI suggestions help bridge the gap between divergent ideas, creating a unified vision from fragmented thoughts.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative rounded-[32px] overflow-hidden border border-white/10 group shadow-2xl shadow-purple-500/5">
                            <img src={brainstormImg} alt="Brainstorming" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Productivity/Deadline Section */}
            <section className="py-24 bg-[#0a0a0c] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-400 mb-6">
                            Efficiency First
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Master Your Deadlines <br /><span className="text-white/40">with Visual Clarity</span></h2>
                        <p className="text-lg text-white/50 mb-8 leading-relaxed">
                            Stop getting lost in spreadsheets and lists. Visualize your project timelines as branches. Set dependencies, track progress, and ensure your team stays on target with our intuitive deadline-tracking nodes.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative rounded-[32px] overflow-hidden border border-white/10 group shadow-2xl shadow-orange-500/5">
                            <img src={productivityImg} alt="Productivity" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0c]/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section id="vision" className="py-32 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
                
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            Our Vision: <br />
                            The Operating System <br />
                            <span className="text-white/40">for Collective Intelligence</span>
                        </h2>
                        <p className="text-lg text-white/50 mb-8 leading-relaxed">
                            We believe that the most powerful ideas are often hidden in the connections between thoughts. AxonFlow is designed to be more than a tool; it's an extension of your mind.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Human-AI symbiosis in creativity",
                                "Zero-friction knowledge mapping",
                                "Visual-first collaboration"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70">
                                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 w-full aspect-square relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-full animate-pulse" />
                        <div className="absolute inset-8 border border-white/10 rounded-full border-dashed animate-spin-slow" />
                        <div className="absolute inset-16 border border-white/5 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Brain size={120} className="text-white/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[40px] bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden shadow-3xl shadow-purple-500/5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">Ready to unlock your creativity?</h2>
                    <p className="text-white/60 mb-12 max-w-xl mx-auto text-lg relative z-10">
                        Join thousands of thinkers already using AxonFlow to map their dreams.
                    </p>
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="relative z-10 px-12 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-white/10"
                    >
                        Try AxonFlow for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Brain size={24} className="text-purple-500" />
                        <span className="text-lg font-bold">AxonFlow</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
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
