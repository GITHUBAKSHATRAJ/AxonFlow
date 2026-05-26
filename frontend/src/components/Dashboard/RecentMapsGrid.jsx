import React from 'react';
import MapCard from '../UI/MapCard';

const RecentMapsGrid = ({ loading, recentMaps, navigate, togglePin, onTrashMap, onDuplicateMap }) => {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold">Recent Activities</h2>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-muted animate-pulse text-lg">Syncing your workspace...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {recentMaps.map(map => (
            <MapCard 
              key={map.id} 
              map={map} 
              onClick={() => navigate(`/map/${map.id}`)}
              onTogglePin={togglePin}
              onTrashMap={onTrashMap}
              onDuplicateMap={onDuplicateMap}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RecentMapsGrid;
