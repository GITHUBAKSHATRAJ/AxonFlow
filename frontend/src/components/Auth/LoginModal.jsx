import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { X, LogIn, Loader2 } from 'lucide-react';

const LoginModal = ({ onClose }) => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleDemoLogin = () => {
        setIsLoading(true);
        // Simulate a delay for the "Google Auth" experience
        setTimeout(() => {
            login();
            setIsLoading(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#121214] border border-white/10 rounded-[32px] shadow-2xl p-8 overflow-hidden animate-scale-in">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h2 className="text-2xl font-bold">Welcome back</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6 relative z-10">
                    <p className="text-white/50 text-sm">
                        Experience the power of AxonFlow. Sign in to sync your mind maps across devices.
                    </p>

                    <button 
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                Sign in with Google (Demo)
                            </>
                        )}
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#121214] px-4 text-white/30">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">
                            Github
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">
                            Apple
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-white/20 mt-8">
                        By signing in, you agree to our Terms of Service <br /> and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
