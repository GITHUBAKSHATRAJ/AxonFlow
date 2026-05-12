import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, Map as MapIcon, 
  Sparkles, Star, LayoutGrid, X, Upload 
} from 'lucide-react';

import GlobalSidebar from '../components/GlobalSidebar';
import MapCard from '../components/UI/MapCard';
import { PrimaryButton, GlassCard } from '../components/UI/UIComponents';
import * as mapApi from '../services/api/mapApi';
import * as nodeApi from '../services/api/nodeApi';
import * as aiApi from '../services/api/aiApi';

// Utility getGradientClass moved to MapCard.jsx

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
  const [comingSoonTemplate, setComingSoonTemplate] = useState(null);
  
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

  const handleCreateFromTemplate = async (templateName) => {
    try {
      setLoading(true);
      const res = await mapApi.createMap(`${templateName} Map`);
      navigate(`/map/${res.id}`);
    } catch (err) {
      console.error('Failed to create map from template:', err);
      setLoading(false);
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

        {/* Recommended Templates */}
        <div className="mb-12">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Recommended Templates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Brainstorming', desc: 'Free-form exploration', svg: (
                <svg width="100%" height="80" className="mb-3 bg-white/5 rounded-xl" viewBox="0 0 160 80">
                  <line x1="80" y1="40" x2="35" y2="25" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                  <line x1="80" y1="40" x2="125" y2="25" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                  <line x1="80" y1="40" x2="50" y2="60" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                  <line x1="80" y1="40" x2="110" y2="60" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                  <circle cx="80" cy="40" r="11" fill="#6366f1" opacity="0.9" />
                  <circle cx="35" cy="25" r="7" fill="#fff" opacity="0.4" />
                  <circle cx="125" cy="25" r="7" fill="#fff" opacity="0.4" />
                  <circle cx="50" cy="60" r="7" fill="#fff" opacity="0.4" />
                  <circle cx="110" cy="60" r="7" fill="#fff" opacity="0.4" />
                </svg>
              )},
              { name: 'Flowchart', desc: 'Process & logic mapping', svg: (
                <svg width="100%" height="80" className="mb-3 bg-white/5 rounded-xl" viewBox="0 0 160 80">
                  <line x1="80" y1="22" x2="80" y2="34" stroke="#6366f1" strokeWidth="2" opacity="0.6" />
                  <line x1="80" y1="46" x2="80" y2="58" stroke="#6366f1" strokeWidth="2" opacity="0.6" />
                  <rect x="55" y="10" width="50" height="13" rx="4" fill="#fff" opacity="0.3" />
                  <polygon points="80,33 96,42 80,51 64,42" fill="#6366f1" opacity="0.8" />
                  <rect x="55" y="58" width="50" height="13" rx="4" fill="#fff" opacity="0.3" />
                </svg>
              )},
              { name: 'Project Planning', desc: 'Milestones & timelines', svg: (
                <svg width="100%" height="80" className="mb-3 bg-white/5 rounded-xl" viewBox="0 0 160 80">
                  <line x1="30" y1="15" x2="30" y2="65" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
                  <line x1="30" y1="22" x2="130" y2="22" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
                  <line x1="30" y1="42" x2="130" y2="42" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
                  <line x1="30" y1="62" x2="130" y2="62" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
                  <rect x="40" y="15" width="45" height="12" rx="3" fill="#6366f1" opacity="0.8" />
                  <rect x="65" y="35" width="55" height="12" rx="3" fill="#fff" opacity="0.3" />
                  <rect x="90" y="55" width="35" height="12" rx="3" fill="#fff" opacity="0.2" />
                </svg>
              )}
            ].map((template) => (
              <button 
                key={template.name}
                onClick={() => {
                  if (template.name === 'Brainstorming') handleCreateFromTemplate(template.name);
                  else setComingSoonTemplate(template.name);
                }}
                className="bg-[#1a1d27] border border-[#2a2f3e] hover:border-[#6366f1] rounded-2xl p-6 text-left transition-all hover:-translate-y-1 group"
              >
                {template.svg}
                <div className="font-bold text-white mb-1">{template.name}</div>
                <div className="text-xs text-gray-500">{template.desc}</div>
              </button>
            ))}
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
                    <MapCard 
                        key={map.id} 
                        map={map} 
                        onClick={() => navigate(`/map/${map.id}`)}
                        onTogglePin={togglePin}
                    />
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
                    <PrimaryButton 
                        onClick={handleCreateAI}
                        disabled={!aiPrompt.trim()}
                        icon={Sparkles}
                    >
                        Generate Map
                    </PrimaryButton>
                </div>
            </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {comingSoonTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1d27] border border-[#2a2f3e] rounded-3xl w-full max-w-sm p-8 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#6366f1]/10 text-[#6366f1] rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">{comingSoonTemplate} Template</h3>
            <p className="text-gray-400 mb-8">This template is currently under development and will be available soon!</p>
            <button 
              onClick={() => setComingSoonTemplate(null)}
              className="w-full bg-[#6366f1] text-white rounded-xl py-3 font-bold hover:bg-[#4f46e5] transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
