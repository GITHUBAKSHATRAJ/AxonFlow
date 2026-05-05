import React from 'react';

const FloatingToolbar = ({ config, onClose }) => {
    if (!config) return null;

    const { x, y, actions } = config;

    return (
        <div
            onClick={e => e.stopPropagation()}
            style={{
                position: 'fixed',
                left: x,
                top: y - 54,
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(24, 24, 42, 0.95)',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                gap: '4px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                zIndex: 9999,
                alignItems: 'center',
                backdropFilter: 'blur(12px)',
            }}
        >
            <Btn icon="✏️" label="Rename (F2)" onClick={actions.rename} />
            <Btn icon="➕" label="Add Child (Tab)" onClick={actions.addChild} />
            <Btn icon="🗑️" label="Delete (Del)" onClick={actions.deleteNode} danger />
            <Divider />
            <Btn icon="📋" label="Copy Branch" onClick={actions.copy} />
            <Btn icon="📥" label="Paste Branch" onClick={actions.paste} />
            <Divider />
            <Btn icon="📝" label="Notes" onClick={actions.openNotes} />
            <Btn icon="🔗" label="Links" onClick={actions.openLinks} />
            <Btn icon="📎" label="Files" onClick={actions.openFiles} />
            <Divider />
            <Btn icon="🤖" label="AI Generate" onClick={actions.openAI} accent />
        </div>
    );
};

const Btn = ({ icon, label, onClick, danger, accent }) => {
    const [hovered, setHovered] = React.useState(false);
    const baseColor = danger ? '#f87171' : accent ? '#c084fc' : '#e0e0e0';
    
    return (
        <button
            title={label}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: 'none',
                color: hovered ? '#fff' : baseColor,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            }}
        >
            {icon}
        </button>
    );
};

const Divider = () => (
    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
);

export default FloatingToolbar;
