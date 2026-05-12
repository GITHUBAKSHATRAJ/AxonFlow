import React, { useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import D3StyleNode from '../Canvas/D3StyleNode';
import D3BezierEdge from '../Canvas/D3BezierEdge';

const nodeTypes = { d3Node: D3StyleNode };
const edgeTypes = { d3Bezier: D3BezierEdge };

const ShowcaseCanvasContent = ({ nodes, edges, height = '400px' }) => {
  const { fitView, setViewport } = useReactFlow();

  useEffect(() => {
    // Force a zoom and centering after initial render
    const timer = setTimeout(() => {
      fitView({ padding: 0.1, duration: 800 });
    }, 100);
    return () => clearTimeout(timer);
  }, [nodes, fitView]);

  // Enhance edges for the showcase (thicker, more visible)
  const enhancedEdges = edges.map(edge => ({
    ...edge,
    style: { 
      ...edge.style, 
      strokeWidth: 3, 
      opacity: 0.9,
      filter: 'drop-shadow(0 0 5px ' + (edge.style?.stroke || '#6366f1') + '88)'
    }
  }));

  // Enhance nodes for the showcase (always highlighted)
  const enhancedNodes = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      isHovered: true, // Force the 'glow' effect
    }
  }));

  return (
    <div style={{ width: '100%', height }} className="opacity-90 pointer-events-none">
      <ReactFlow
        nodes={enhancedNodes}
        edges={enhancedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} color="#444" gap={25} />
      </ReactFlow>
    </div>
  );
};

export default (props) => (
  <ReactFlowProvider>
    <ShowcaseCanvasContent {...props} />
  </ReactFlowProvider>
);
