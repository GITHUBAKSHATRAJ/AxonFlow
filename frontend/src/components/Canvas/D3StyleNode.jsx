import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Clock, AlertCircle, RefreshCcw, BookOpen } from 'lucide-react';

const STATUS_MAP = {
  reading: { icon: BookOpen, color: '#38bdf8' },
  completed: { icon: CheckCircle2, color: '#4ade80' },
  incomplete: { icon: Clock, color: '#f87171' },
  important: { icon: AlertCircle, color: '#fbbf24' },
  revise: { icon: RefreshCcw, color: '#c084fc' },
};

const DOT_R = 6;   // circle radius (px)
const DOT_GAP = 15;  // circle -> text gap
const TEXT_GAP = 15;  // text end -> edge start gap
const FONT_SIZE = 14;  // px

/** Estimate text width using a canvas 2D context */
function measureText(text, fontSize = FONT_SIZE) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px sans-serif`;
    return ctx.measureText(text || '').width;
  } catch {
    return (text || '').length * 8;
  }
}

const D3StyleNode = ({ data, selected }) => {
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);
  const isRoot = data.depth === 0;
  const hasChildren = data.hasChildren;
  const isEditing = data._isDraft || data._isEditing;
  const label = data.name || '';
  const notesFlag = data.notes?.length > 0 ? ' 📝' : '';
  const displayText = isEditing ? (label || 'Type name...') : (label + notesFlag);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const val = inputRef.current.value || '';
          inputRef.current.setSelectionRange(val.length, val.length);
        }
      }, 50);
    }
  }, [isEditing]);

  const maxW = 450;
  const measuredW = isEditing ? Math.max(measureText(displayText), 140) : measureText(displayText);
  const textWidth = Math.min(measuredW, maxW);
  const totalW = DOT_R + DOT_GAP + textWidth + TEXT_GAP;
  const nodeH = isRoot ? 50 : 'auto';

  const circleColor = hasChildren
    ? (data.branchColor || '#007bff')
    : '#222';

  const hoverColor = data.branchColor && data.branchColor !== '#555' && data.branchColor !== '#888'
    ? data.branchColor
    : '#ffaa00';
  const showAmber = hovered || selected || data.isHovered;

  if (isRoot) {
    const rootW = textWidth + 30;
    return (
      <div
        style={{ position: 'relative', width: rootW, height: nodeH }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          border: showAmber ? `1.5px solid ${hoverColor}` : '1.5px solid transparent',
          borderRadius: '6px',
          boxShadow: showAmber ? `0 0 8px 2px ${hoverColor}55` : 'none',
          pointerEvents: 'none',
          transition: 'border-color 0.18s, box-shadow 0.18s',
        }} />

        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          textAlign: 'center',
          color: '#ffffff',
          fontSize: FONT_SIZE,
          fontFamily: 'sans-serif',
          lineHeight: '20px',
          userSelect: 'none',
          textShadow: '0 0 6px #121212, 0 0 6px #121212',
          whiteSpace: 'nowrap',
        }}>
          {displayText}
        </div>

        <div style={{
          position: 'absolute',
          bottom: 2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: DOT_R * 2,
          height: DOT_R * 2,
          borderRadius: '50%',
          background: circleColor,
          cursor: hasChildren ? 'pointer' : 'default',
        }}
          onClick={e => { e.stopPropagation(); data.onToggle?.(data.id, data.isExpanded !== false ? false : true); }}
        />

        <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 2, height: 2, right: 0, top: '75%' }} />
        <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 2, height: 2 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: totalW,
        height: nodeH,
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => {
        setHovered(true);
        data.onHover?.(data.id);
      }}
      onMouseLeave={() => {
        setHovered(false);
        data.onHoverEnd?.();
      }}
    >
      <div style={{
        position: 'absolute',
        inset: '-6px',
        borderRadius: '8px',
        border: showAmber ? `2px solid ${hoverColor}` : '2px solid transparent',
        boxShadow: showAmber ? `0 0 12px 3px ${hoverColor}55` : 'none',
        pointerEvents: 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
      }} />

      {data.isDropTarget && (
        <div style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '8px',
          border: '2px solid #1a73e8',
          boxShadow: '0 0 14px 4px rgba(26,115,232,0.7)',
          pointerEvents: 'none',
          animation: 'pulseRing 1s ease-in-out infinite',
        }} />
      )}

      <div
        onClick={e => { e.stopPropagation(); if (hasChildren) data.onToggle?.(data.id, data.isExpanded !== false ? false : true); }}
        style={{
          flexShrink: 0,
          width: DOT_R * 2,
          height: DOT_R * 2,
          borderRadius: '50%',
          background: circleColor,
          cursor: hasChildren ? 'pointer' : 'default',
          marginRight: DOT_GAP,
          zIndex: 2,
        }}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          autoFocus
          defaultValue={data.name || ''}
          placeholder="Type name..."
          style={{
            background: '#1a1a1a',
            color: '#ffffff',
            border: '2px solid #c68a00',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: `${FONT_SIZE}px`,
            fontFamily: 'sans-serif',
            outline: 'none',
            width: `${textWidth}px`,
            boxSizing: 'border-box',
            zIndex: 10,
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              data.onDraftConfirm?.(data.id, e.target.value, data._draftMode || 'rename', data._targetId);
            } else if (e.key === 'Escape') {
              data.onDraftCancel?.(data.id, data._draftMode || 'rename');
            }
          }}
          onBlur={e => {
            data.onDraftConfirm?.(data.id, e.target.value, data._draftMode || 'rename', data._targetId);
          }}
          className="nodrag nopan"
          onPointerDownCapture={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        />
      ) : (
        <span style={{
          color: '#ffffff',
          fontSize: FONT_SIZE,
          fontFamily: 'sans-serif',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          userSelect: 'none',
          lineHeight: '1.4',
          textShadow: '0 0 8px #121212, 0 0 8px #121212',
          flex: 1,
          maxWidth: `${maxW}px`,
        }}>
          {displayText}
        </span>
      )}

      <Handle
        type="target"
        position={data.layoutMode === 'vertical' ? Position.Top : Position.Left}
        style={{
          opacity: 0,
          width: data.layoutMode === 'radial' ? 1 : DOT_R * 2,
          height: data.layoutMode === 'radial' ? 1 : DOT_R * 2,
          left: data.layoutMode === 'vertical' ? '50%' : 0,
          top: data.layoutMode === 'vertical' ? 0 : '50%',
          transform: data.layoutMode === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)',
        }}
      />

      <Handle
        type="source"
        position={data.layoutMode === 'vertical' ? Position.Bottom : Position.Right}
        style={{
          opacity: 0,
          width: 2,
          height: 2,
          right: data.layoutMode === 'vertical' ? 'auto' : 0,
          bottom: data.layoutMode === 'vertical' ? 0 : 'auto',
          left: data.layoutMode === 'vertical' ? '50%' : 'auto',
          top: data.layoutMode === 'vertical' ? 'auto' : '50%',
          transform: data.layoutMode === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)',
        }}
      />
    </div>
  );
};

export default D3StyleNode;
