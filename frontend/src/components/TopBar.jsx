import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Share2, 
    MoreHorizontal, 
    Layout, 
    History, 
    Settings,
    Edit3,
    Check,
    X,
    Upload
} from 'lucide-react';
import { useAuth } from '../context/authContext';

const TopBar = ({ 
    mapName, 
    onUpdateMapName,
    isSaving = false,
    onBulkImport
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(mapName);

    useEffect(() => {
        setTempName(mapName);
    }, [mapName]);

    const handleSave = () => {
        if (tempName.trim() && tempName !== mapName) {
            onUpdateMapName(tempName.trim());
        }
        setIsEditing(false);
    };

    return (
        <header className="h-[60px] bg-[#1a1d27]/80 backdrop-blur-md border-b border-[#2a2f3e] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-[1000]">
            <div className="flex items-center gap-6">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-[#222634] rounded-lg text-gray-400 hover:text-white transition-all group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <div className="h-6 w-px bg-gray-800" />

                {/* Map Title Section */}
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input 
                                autoFocus
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') { setIsEditing(false); setTempName(mapName); }
                                }}
                                className="bg-[#0f111a] border border-[#6366f1] rounded-md px-3 py-1 text-sm text-white outline-none w-64"
                            />
                            <button onClick={handleSave} className="text-green-500 hover:text-green-400"><Check size={18} /></button>
                            <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-400"><X size={18} /></button>
                        </div>
                    ) : (
                        <div 
                            className="group flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsEditing(true)}
                        >
                            <h1 className="text-[15px] font-bold text-white tracking-tight">{mapName}</h1>
                            <Edit3 size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    
                    {isSaving && (
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse ml-2">Saving...</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Action Buttons */}
                <div className="flex items-center bg-[#222634] rounded-xl p-1 border border-white/5">
                    <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        <History size={14} /> History
                    </button>
                    <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 border-l border-white/5">
                        <Settings size={14} /> Settings
                    </button>
                </div>

                <button 
                    onClick={onBulkImport}
                    className="p-2 hover:bg-[#222634] rounded-xl text-gray-400 hover:text-white transition-all flex items-center gap-2 group border border-white/5"
                    title="Bulk Import Nodes"
                >
                    <Upload size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block">Import</span>
                </button>

                <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#6366f1]/20 active:translate-y-px">
                    <Share2 size={14} /> Share
                </button>

                <div className="h-6 w-px bg-gray-800 mx-1" />

                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <img src={user?.avatar} alt="u" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
};

export default TopBar;
