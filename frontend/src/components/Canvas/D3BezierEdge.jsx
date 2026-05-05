import React from 'react';

const D3BezierEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data = {},
  markerEnd,
  animated,
}) => {
  const layoutMode = data.layoutMode || 'horizontal';
  let path;

  if (layoutMode === 'vertical') {
    const midY = (sourceY + targetY) / 2;
    path = `M${sourceX},${sourceY} C${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}`;
  } else if (layoutMode === 'radial') {
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    path = `M${sourceX},${sourceY} C${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  } else {
    const midX = sourceX + (targetX - sourceX) / 2;
    path = `M${sourceX},${sourceY} C${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  }

  return (
    <path
      id={id}
      d={path}
      markerEnd={markerEnd}
      className={animated ? 'react-flow__edge-path animated' : 'react-flow__edge-path'}
      style={{
        fill:         'none',
        stroke:       style.stroke      || '#555',
        strokeWidth:  style.strokeWidth || 2,
        transition:   style.transition  || 'stroke 0.2s ease, stroke-width 0.2s ease',
        pointerEvents:'stroke',
      }}
    />
  );
};

export default D3BezierEdge;
