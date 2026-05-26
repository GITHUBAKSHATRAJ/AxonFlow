import React, { useEffect, useState, useRef } from 'react';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('ask ai');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [comingSoonTemplate, setComingSoonTemplate] = useState(null);

  useEffect(() => {
    loadMaps(true);
    aiApi.fetchAvailableModels().then(setAvailableModels).catch(() => setAvailableModels(['llama3']));
  }, []);

  const loadMaps = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await mapApi.fetchAllMaps({ all: 'true' });
      setMaps(data || []);
    } catch (err) {
      console.error('Failed to load maps:', err);
    } finally {
      if (showLoading) setLoading(false);
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
      const res = await mapApi.createMap(`${templateName} Map`, templateName);
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
    if (e) e.stopPropagation();
    const newIsFavorite = !map.isFavorite;
    setMaps(prev => prev.map(m => m.id === map.id ? { ...m, isFavorite: newIsFavorite } : m));
    try {
      await mapApi.updateMapAttributes(map.id, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to pin:', err);
    }
  };

  const handleTrashMap = async (mapId) => {
    // Optimistic Update: instantly remove it from the UI
    // Capture a snapshot of the single item before dropping it
    const mapBackup = maps.find(m => m.id === mapId);
    const updatedMaps = maps.filter(map => map.id !== mapId);
    //It loops through the prev array, takes out the map that matches the ID we want to delete, and returns a totally new array containing the rest. React sees this new array in memory and instantly re-renders the UI to make the deleted map disappear.
    setMaps(updatedMaps); //The JavaScript .filter() method automatically creates a brand-new array (a shallow copy). 
    try {
      await mapApi.updateMapAttributes(mapId, { isTrashed: true });
    } catch (err) {
      console.error('Failed to trash map:', err);
      loadMaps(false); // Revert on failure
    }
  };

  const handleDuplicateMap = async (mapId) => {
    try {
      // Backend creates a full copy and returns the new map object
      const newMap = await mapApi.duplicateMap(mapId);
      // Instantly inject the newly returned map into our React state array
      setMaps(prev => [newMap, ...prev]); //Here, we are using the spread operator (...) to manually create a shallow copy. The square brackets [ ] tell JavaScript to create a brand-new array in memory.
    } catch (err) {
      console.error('Failed to duplicate map:', err);
    }
  };

  const filteredMaps = maps.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const validMaps = filteredMaps.filter(m => !m.isTrashed);
  const recentMaps = [...validMaps].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);

  return (
    <div className="flex w-full h-screen bg-bg overflow-hidden text-text-h">
      <GlobalSidebar />

      <main className="flex-1 overflow-y-auto p-12 lg:p-16">
        <DashboardHeader 
          user={user} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <TemplateGrid 
          handleCreateFromTemplate={handleCreateFromTemplate} 
          setComingSoonTemplate={setComingSoonTemplate} 
        />

        {/* Quick Stats */}
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
};

export default Dashboard;
