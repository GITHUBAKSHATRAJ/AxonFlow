import React from 'react';
import { LayoutGrid, AlignCenter, CircleDot, Palette } from 'lucide-react';
import { COLOR_PALETTES } from '../../utils/flowUtils';

const ActionToolbar = ({ 
    layoutMode, 
    setLayoutMode, 
    colorPalette, 
    setColorPalette,
    showPaletteMenu,
    setShowPaletteMenu
}) => {
    return (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, display: 'flex', gap: '8px', alignItems: 'center' }}>
            
            {/* Layout Toggle Group */}
            {[
                ['horizontal', 'H-Tree', AlignCenter], 
                ['vertical', 'V-Tree', LayoutGrid], 
                ['radial', '360°', CircleDot]
            ].map(([mode, label, Icon]) => (
                <button 
                    key={mode} 
                    onClick={() => setLayoutMode(mode)}
                    title={`${label} Layout`}
                    style={{
                        background: layoutMode === mode ? '#1a73e8' : 'rgba(26,29,39,0.85)',
                        color: layoutMode === mode ? 'white' : '#e0e0e0',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        cursor: 'pointer', backdropFilter: 'blur(8px)',
                        fontSize: '12px', fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                >
                    <Icon size={15} />{label}
                </button>
            ))}

            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            {/* Color Palette Picker */}
            <div style={{ position: 'relative' }}>
                <button 
                    onClick={() => setShowPaletteMenu(p => !p)}
                    style={{
                        background: 'rgba(26,29,39,0.85)',
                        color: '#e0e0e0',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        cursor: 'pointer', backdropFilter: 'blur(8px)',
                        fontSize: '12px', fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                >
                    <Palette size={15} />
                    <div style={{ display: 'flex', gap: '3px' }}>
                        {(COLOR_PALETTES[colorPalette]?.colors || []).slice(0, 4).map((c, i) => (
                            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                        ))}
                    </div>
                </button>

                {showPaletteMenu && (
                    <div style={{
                        position: 'absolute', top: '44px', right: 0,
                        background: 'rgba(15,17,26,0.97)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '8px',
                        display: 'flex', flexDirection: 'column', gap: '4px',
                        minWidth: '160px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        zIndex: 200
                    }}>
                        {Object.entries(COLOR_PALETTES).map(([key, val]) => (
                            <button 
                                key={key}
                                onClick={() => { setColorPalette(key); setShowPaletteMenu(false); }}
                                style={{
                                    background: colorPalette === key ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    border: 'none', borderRadius: '8px',
                                    padding: '8px 12px',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    cursor: 'pointer', color: '#ffffff',
                                    fontSize: '13px', fontWeight: colorPalette === key ? 600 : 400,
                                    transition: 'background 0.15s'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {val.colors.slice(0, 5).map((c, i) => (
                                        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
                                    ))}
                                </div>
                                {val.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionToolbar;
