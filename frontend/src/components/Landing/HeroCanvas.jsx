import React, { useMemo } from 'react';
import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider } from '@xyflow/react';

// These import the custom "Look" we designed for our nodes and connecting lines
import D3StyleNode from '../Canvas/D3StyleNode';
import D3BezierEdge from '../Canvas/D3BezierEdge';

// nodeTypes: Links the word 'd3Node' to our actual custom visual component
const nodeTypes = { d3Node: D3StyleNode };
// edgeTypes: Links the word 'd3Bezier' to our custom curved line component
const edgeTypes = { d3Bezier: D3BezierEdge };

// initialNodes: An array of objects that defines the ID, position, and text for every box
const initialNodes = [
  { id: '1', type: 'd3Node', position: { x: 0, y: 0 }, data: { name: 'AxonFlow AI', depth: 0, branchColor: '#6366f1' } },
  { id: '2', type: 'd3Node', position: { x: 250, y: -80 }, data: { name: 'Intelligent Mapping', depth: 1, branchColor: '#8b5cf6' } },
  { id: '3', type: 'd3Node', position: { x: 250, y: 80 }, data: { name: 'Real-time Sync', depth: 1, branchColor: '#ec4899' } },
  { id: '4', type: 'd3Node', position: { x: 500, y: -120 }, data: { name: 'LLM Powered', depth: 2, branchColor: '#8b5cf6' } },
  { id: '5', type: 'd3Node', position: { x: 500, y: -40 }, data: { name: 'Context Aware', depth: 2, branchColor: '#8b5cf6' } },
];

// initialEdges: An array that defines which Node ID is the 'source' and which is the 'target'
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'd3Bezier', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', type: 'd3Bezier', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', type: 'd3Bezier', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e2-5', source: '2', target: '5', type: 'd3Bezier', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
];

// HeroCanvasContent: The functional component that actually builds the visual map on your screen
const HeroCanvas = () => {
  return (
    <div className="w-full h-full opacity-60 pointer-events-none">

      {/* ReactFlow: The main engine that takes our nodes and edges and draws them */}
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView // Automatically zooms the camera so all nodes fit on screen
        fitViewOptions={{ padding: 0.5 }} // Adds a bit of empty space around the nodes
        nodesDraggable={false} // Prevents the user from dragging nodes in the demo
        nodesConnectable={false} // Can't draw new lines from these
        elementsSelectable={false} // Can't click to select them
        panOnDrag={false}  // Stops the user from moving the background
        zoomOnScroll={false} // Stops the mouse wheel from zooming in/out
      >
        {/* Background: Draws the subtle dot pattern you see behind the nodes */}
        <Background variant={BackgroundVariant.Dots} color="#333" gap={30} />
      </ReactFlow>
    </div>
  );
};

// HeroCanvas: The "Wrapper" that provides the necessary context for the Flow engine to run
export default () => (
  <ReactFlowProvider>
    <HeroCanvas />
  </ReactFlowProvider>
);
