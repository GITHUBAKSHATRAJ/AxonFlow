import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasContainer from '../components/Canvas/CanvasContainer';
import * as nodeApi from '../services/api/nodeApi';
import * as mapApi from '../services/api/mapApi';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [backendNodes, setBackendNodes] = useState([]);
    const [mapName, setMapName] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(true);

    // Load Map Data from our new modular API
    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        
        nodeApi.fetchMapNodes(id)
            .then(data => {
                setBackendNodes(data);
                const root = data.find(n => !n.parentId);
                setMapName(root ? root.name : 'Untitled Map');
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load map nodes:', err);
                setIsLoading(false);
            });
    }, [id]);

    const handleUpdateMapName = useCallback((newName) => {
        setMapName(newName);
        // Optimistically update root node name in the list
        setBackendNodes(prev =>
            prev.map(n => (!n.parentId ? { ...n, name: newName } : n))
        );
        mapApi.updateMapAttributes(id, { name: newName }).catch(err => console.error('Rename error:', err));
    }, [id]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: '#121212',
            color: '#ffffff',
            position: 'relative',
        }}>
            {/* Simple Header for now */}
            <div style={{
                height: '60px',
                background: '#1a1a2a',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                zIndex: 1000,
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}
                    >
                        ←
                    </button>
                    <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{mapName}</h1>
                </div>
                <div style={{ color: '#555', fontSize: '12px' }}>AxonFlow v1.0</div>
            </div>

            <div style={{
                width: '100%',
                height: '100%',
                paddingTop: '60px',
                boxSizing: 'border-box',
                position: 'relative',
            }}>
                {isLoading ? (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: '#c084fc',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>🧠</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>Syncing with AxonFlow...</div>
                    </div>
                ) : (
                    <CanvasContainer
                        mapId={id}
                        initialNodes={backendNodes}
                    />
                )}
            </div>
        </div>
    );
};

export default Editor;
