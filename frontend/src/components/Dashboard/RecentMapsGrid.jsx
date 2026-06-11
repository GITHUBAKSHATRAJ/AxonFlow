import React from 'react';
import MapCard from '../UI/MapCard';

/**
 * [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
 * RecentMapsGrid renders a card grid of recently updated mind maps.
 * 
 * Concept: Passes down callbacks (onTogglePin, onTrashMap, onDuplicateMap) 
 * to MapCard children using prop-drilling layout paradigms.
 */
function RecentMapsGrid({ loading, recentMaps, navigate, togglePin, onTrashMap, onDuplicateMap }) {
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
            /* 
              [DOM DIFFING & RECONCILIATION]
              Uses map.id as the key for list item tracking.
            */
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
}

export default RecentMapsGrid;
