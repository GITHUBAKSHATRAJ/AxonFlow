import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, Map as MapIcon, 
  Sparkles, Star, LayoutGrid, X, Upload 
} from 'lucide-react';

import GlobalSidebar from '../components/GlobalSidebar';
import * as mapApi from '../services/api/mapApi';
import * as nodeApi from '../services/api/nodeApi';
import * as aiApi from '../services/api/aiApi';

const getGradientClass = (id) => {
  if (!id) return 'bg-grad-1';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % 6 + 1;
  return `bg-grad-${index}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3');
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadMaps();
    aiApi.fetchAvailableModels().then(setAvailableModels).catch(() => setAvailableModels(['llama3']));
  }, []);

  const loadMaps = async () => {
    setLoading(true);
    try {
      const data = await mapApi.fetchAllMaps({ all: 'true' });
      setMaps(data || []);
    } catch (err) {
      console.error('Failed to load maps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const res = await mapApi.createMap('New Idea Map');
      navigate(`/map/${res.id}`);
    } catch (err) {
      console.error('Failed to create map:', err);
    }
  };

  const handleCreateAI = async () => {
    if (!aiPrompt.trim()) return;
    try {
      const res = await mapApi.createMap(aiPrompt.trim());
      navigate(`/map/${res.id}?generateAI=${encodeURIComponent(aiPrompt.trim())}&model=${encodeURIComponent(selectedModel)}`);
    } catch (err) {
      console.error('Failed to create AI map:', err);
    }
  };

  const togglePin = async (e, map) => {
    e.stopPropagation();
    const newIsFavorite = !map.isFavorite;
    setMaps(prev => prev.map(m => m.id === map.id ? { ...m, isFavorite: newIsFavorite } : m));
    try {
      await mapApi.updateMapAttributes(map.id, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to pin:', err);
    }
  };

  const filteredMaps = maps.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const validMaps = filteredMaps.filter(m => !m.isTrashed);
  const recentMaps = [...validMaps].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);

  return (
    <div className="flex w-full h-screen bg-[#0f111a] overflow-hidden text-white">
      <GlobalSidebar />

      <main className="flex-1 overflow-y-auto p-12 lg:p-16">
        {/* Welcome Banner */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Akshat'}!
            </h1>
            <p className="text-gray-400 text-lg">Your AI-powered mind mapping hub.</p>
          </div>

          <div className="relative w-96 hidden md:block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search your maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d27] border border-[#2a2f3e] rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-[#6366f1] transition-all"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1a1d27] border border-[#2a2f3e] rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6366f1]/10 text-[#6366f1] rounded-xl flex items-center justify-center">
              <MapIcon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">{validMaps.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Active Maps</div>
            </div>
          </div>
          {/* Add more stats if needed */}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <button 
            onClick={handleCreateNew}
            className="group relative overflow-hidden bg-gradient-to-br from-[#1a1d27] to-[#141721] border border-[#2a2f3e] hover:border-[#6366f1] rounded-3xl p-8 flex items-center gap-6 transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-[#6366f1] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
              <Plus size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">New Blank Map</h3>
              <p className="text-gray-500 text-sm">Start from scratch with a clean canvas.</p>
            </div>
          </button>

          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="group relative overflow-hidden bg-gradient-to-br from-[#1a1d27] to-[#141721] border border-[#8b5cf6]/30 hover:border-[#8b5cf6] rounded-3xl p-8 flex items-center gap-6 transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30">
              <Sparkles size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Generate with AI</h3>
              <p className="text-gray-500 text-sm">Describe a topic and watch AxonFlow build it.</p>
            </div>
          </button>
        </div>

        {/* Recent Maps Grid */}
        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Activities</h2>
        </div>

        {loading ? (
            <div className="py-20 text-center text-gray-500 animate-pulse text-lg">Syncing your workspace...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {recentMaps.map(map => (
                    <div 
                        key={map.id} 
                        onClick={() => navigate(`/map/${map.id}`)}
                        className="group bg-[#1a1d27] border border-[#2a2f3e] hover:border-[#6366f1] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                    >
                        <div className={`h-28 w-full relative ${getGradientClass(map.id)}`}>
                            <button 
                                onClick={(e) => togglePin(e, map)}
                                className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-lg text-white hover:bg-black/40 transition-colors"
                            >
                                <Star size={16} fill={map.isFavorite ? '#ffd700' : 'none'} className={map.isFavorite ? 'text-[#ffd700]' : 'text-white'} />
                            </button>
                        </div>
                        <div className="p-5 flex items-center gap-4">
                            <div className="p-2.5 bg-[#6366f1]/10 text-[#6366f1] rounded-lg">
                                <MapIcon size={20} />
                            </div>
                            <div className="truncate">
                                <h4 className="font-bold truncate group-hover:text-[#6366f1] transition-colors">{map.name || 'Untitled'}</h4>
                                <p className="text-xs text-gray-500">Edited recently</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </main>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1d27] border border-[#2a2f3e] rounded-[32px] w-full max-w-2xl p-8 shadow-2xl relative">
                <button onClick={() => setIsAiModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-[#8b5cf6]" size={24} />
                        <h2 className="text-2xl font-bold">AI Mind Map Generator</h2>
                    </div>
                    <p className="text-gray-400">Describe what you want to visualize, and AxonFlow will do the rest.</p>
                </div>

                <div className="mb-6">
                    <div className="p-1 bg-gradient-to-r from-[#d946ef] via-[#8b5cf6] to-[#6366f1] rounded-2xl">
                        <textarea 
                            autoFocus
                            placeholder="e.g. History of Space Exploration or Marketing Strategy for a SaaS"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full h-40 bg-[#1a1d27] rounded-[15px] p-6 text-white outline-none resize-none text-lg placeholder:text-gray-600"
                        />
                    </div>
                    <div className="flex justify-between items-center mt-3 px-2">
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                            <Upload size={14} /> Add Reference File
                        </button>
                        <span className="text-xs text-gray-600">{aiPrompt.length} / 5000</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mb-8">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">AI Model Selection</label>
                    <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-[#141721] border border-[#2a2f3e] rounded-xl p-3 text-white outline-none cursor-pointer hover:border-gray-600 transition-colors"
                    >
                        {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={() => setIsAiModalOpen(false)}
                        className="px-6 py-3 rounded-xl border border-[#2a2f3e] font-semibold hover:bg-[#222634] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateAI}
                        disabled={!aiPrompt.trim()}
                        className="px-8 py-3 rounded-xl bg-[#6366f1] text-white font-bold hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#6366f1]/20"
                    >
                        Generate Map
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
