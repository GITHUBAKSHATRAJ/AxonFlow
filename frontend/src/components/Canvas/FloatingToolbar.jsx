import React from 'react';
import { 
    Edit2, 
    Plus, 
    Trash2, 
    Copy, 
    Download, 
    FileText, 
    Link as LinkIcon, 
    Paperclip, 
    Sparkles,
    Upload
} from 'lucide-react';

const FloatingToolbar = ({ config, onClose }) => {
    if (!config) return null;

    const { x, y, actions } = config;

    return (
        <div
            onClick={e => e.stopPropagation()}
            style={{
                position: 'fixed',
                left: x,
                top: y - 60,
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(24, 24, 42, 0.95)',
                border: '1px solid rgba(192, 132, 252, 0.2)',
                borderRadius: '16px',
                padding: '6px',
                display: 'flex',
                gap: '2px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                zIndex: 9999,
                alignItems: 'center',
                backdropFilter: 'blur(16px)',
            }}
        >
            <Btn icon={<Edit2 size={16} />} label="Rename (F2)" onClick={actions.rename} />
            <Btn icon={<Plus size={18} />} label="Add Child (Tab)" onClick={actions.addChild} />
            <Btn icon={<Trash2 size={16} />} label="Delete (Del)" onClick={actions.deleteNode} danger />
            
            <Divider />
            
            <Btn icon={<Copy size={16} />} label="Copy Branch" onClick={actions.copy} />
            <Btn icon={<Download size={16} />} label="Quick Paste" onClick={actions.paste} />
            <Btn icon={<Upload size={16} />} label="Bulk Import (Indented Text)" onClick={actions.import} accent />
            
            <Divider />
            
            <Btn icon={<FileText size={16} />} label="Notes" onClick={actions.openNotes} />
            <Btn icon={<LinkIcon size={16} />} label="Links" onClick={actions.openLinks} />
            <Btn icon={<Paperclip size={16} />} label="Files" onClick={actions.openFiles} />
            
            <Divider />
            
            <Btn icon={<Sparkles size={16} />} label="AI Generate" onClick={actions.openAI} ai />
        </div>
    );
};

const Btn = ({ icon, label, onClick, danger, accent, ai }) => {
    const [hovered, setHovered] = React.useState(false);
    
    let color = '#9ca3af';
    let bg = 'transparent';
    
    if (hovered) {
        bg = 'rgba(255, 255, 255, 0.08)';
        color = '#fff';
        if (danger) { bg = 'rgba(239, 68, 68, 0.15)'; color = '#f87171'; }
        if (accent) { bg = 'rgba(99, 102, 241, 0.15)'; color = '#818cf8'; }
        if (ai) { bg = 'rgba(192, 132, 252, 0.15)'; color = '#c084fc'; }
    }
    
    return (
        <button
            title={label}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: bg,
                border: 'none',
                color: color,
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
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
    <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 6px' }} />
);

export default FloatingToolbar;
