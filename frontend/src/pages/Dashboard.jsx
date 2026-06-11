import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Map as MapIcon } from 'lucide-react';

import GlobalSidebar from '../components/GlobalSidebar';
import * as mapApi from '../services/api/mapApi';
import * as aiApi from '../services/api/aiApi';

// Import newly extracted Dashboard components
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import TemplateGrid from '../components/Dashboard/TemplateGrid';
import ActionCards from '../components/Dashboard/ActionCards';
import RecentMapsGrid from '../components/Dashboard/RecentMapsGrid';
import AiGeneratorModal from '../components/Dashboard/AiGeneratorModal';
import ComingSoonModal from '../components/Dashboard/ComingSoonModal';

/**
 * [CONTAINER / NAMED COMPONENT]
 * Dashboard is the primary orchestrator container component.
 * We write it as a Named Function to make debugging simple.
 */
function Dashboard() {
  const navigate = useNavigate();
  
  // [REACT CONTEXT HOOK]
  // Accesses the global authentication user details from the AuthProvider context.
  const { user } = useAuth();
  
  // [STATE HOOKS]
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('ask ai');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [comingSoonTemplate, setComingSoonTemplate] = useState(null);

  // [REACT HOOK: useEffect]
  // Runs automatically upon component mounting. It pulls standalone maps and query models.
  useEffect(function () {
    loadMaps(true);
    aiApi.fetchAvailableModels()
      .then(setAvailableModels)
      .catch(() => setAvailableModels(['llama3']));
  }, []);

  // [NAMED FUNCTION] - Load all map records
  async function loadMaps(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const data = await mapApi.fetchAllMaps({ all: 'true' });
      setMaps(data || []);
    } catch (err) {
      console.error('Failed to load maps:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  // [NAMED FUNCTION] - Create a new blank map
  async function handleCreateNew() {
    try {
      const res = await mapApi.createMap('New Idea Map');
      navigate(`/map/${res.id}`);
    } catch (err) {
      console.error('Failed to create map:', err);
    }
  }

  // [NAMED FUNCTION] - Create a map using a layout template
  async function handleCreateFromTemplate(templateName) {
    try {
      setLoading(true);
      const res = await mapApi.createMap(`${templateName} Map`, templateName);
      navigate(`/map/${res.id}`);
    } catch (err) {
      console.error('Failed to create map from template:', err);
      setLoading(false);
    }
  }

  // [NAMED FUNCTION] - Setup layout using AI models
  async function handleCreateAI() {
    if (!aiPrompt.trim()) return;
    try {
      const res = await mapApi.createMap(aiPrompt.trim());
      navigate(`/map/${res.id}?generateAI=${encodeURIComponent(aiPrompt.trim())}&model=${encodeURIComponent(selectedModel)}`);
    } catch (err) {
      console.error('Failed to create AI map:', err);
    }
  }

  // [NAMED FUNCTION] - Pin/favorite map item
  async function togglePin(e, map) {
    if (e) e.stopPropagation();
    const newIsFavorite = !map.isFavorite;
    // Optimistic Update: instantly refresh React state array so UI updates before network returns
    setMaps(prev => prev.map(m => m.id === map.id ? { ...m, isFavorite: newIsFavorite } : m));
    try {
      await mapApi.updateMapAttributes(map.id, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to pin:', err);
    }
  }

  // [NAMED FUNCTION] - Soft delete map item
  async function handleTrashMap(mapId) {
    const updatedMaps = maps.filter(map => map.id !== mapId);
    setMaps(updatedMaps); 
    try {
      await mapApi.updateMapAttributes(mapId, { isTrashed: true });
    } catch (err) {
      console.error('Failed to trash map:', err);
      loadMaps(false); // Revert back to database state on error
    }
  }

  // [NAMED FUNCTION] - Clone map record
  async function handleDuplicateMap(mapId) {
    try {
      const newMap = await mapApi.duplicateMap(mapId);
      setMaps(prev => [newMap, ...prev]); 
    } catch (err) {
      console.error('Failed to duplicate map:', err);
    }
  }

  // Dynamic calculations performed upon every render pass:
  const filteredMaps = maps.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const validMaps = filteredMaps.filter(m => !m.isTrashed);
  const recentMaps = [...validMaps].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);

  return (
    <div className="flex w-full h-screen bg-bg overflow-hidden text-text-h">
      <GlobalSidebar />

      <main className="flex-1 overflow-y-auto p-12 lg:p-16">
        
        {/* 
          [CHILD COMPONENTS / PRESENTATION SEPARATION]
          Values and event handlers are passed down to child components via props.{variable pass}
        */}
        <DashboardHeader 
          user={user} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <TemplateGrid 
          handleCreateFromTemplate={handleCreateFromTemplate} 
          setComingSoonTemplate={setComingSoonTemplate} 
        />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-bg text-accent rounded-xl flex items-center justify-center">
              <MapIcon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">{validMaps.length}</div>
              <div className="text-xs text-text-muted uppercase tracking-wider font-bold">Active Maps</div>
            </div>
          </div>
        </div>

        <ActionCards 
          handleCreateNew={handleCreateNew} 
          setIsAiModalOpen={setIsAiModalOpen} 
        />

        <RecentMapsGrid 
          loading={loading} 
          recentMaps={recentMaps} 
          navigate={navigate} 
          togglePin={togglePin}
          onTrashMap={handleTrashMap}
          onDuplicateMap={handleDuplicateMap}
        />
      </main>

      {/* [CONDITIONAL MODAL DIALOGS] */}
      {isAiModalOpen && (
        <AiGeneratorModal 
          setIsAiModalOpen={setIsAiModalOpen}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          availableModels={availableModels}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          handleCreateAI={handleCreateAI}
        />
      )}

      <ComingSoonModal 
        comingSoonTemplate={comingSoonTemplate} 
        setComingSoonTemplate={setComingSoonTemplate} 
      />
    </div>
  );
}

export default Dashboard;
