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
  /**
   * HOW THIS WORKS: SVG Bezier Path Calculation
   * 
   * We use Cubic Bezier curves (C) to create smooth, organic connections between nodes.
   * A Cubic Bezier requires four points: Start (M), Control Point 1, Control Point 2, and End.
   * 
   * 1. Horizontal Mode:
   *    - The curve flows from left to right.
   *    - Control points share the source/target Y values but are placed at the horizontal midpoint (midX).
   *    - This creates a 'S' shaped horizontal curve.
   * 
   * 2. Vertical Mode:
   *    - The curve flows from top to bottom.
   *    - Control points share source/target X values but are placed at the vertical midpoint (midY).
   * 
   * 3. Radial Mode:
   *    - Similar to horizontal, but optimized for circular distribution.
   */
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
