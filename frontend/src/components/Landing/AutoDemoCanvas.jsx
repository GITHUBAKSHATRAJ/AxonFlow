import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider, useReactFlow, Panel } from '@xyflow/react';
import { Sparkles, MousePointer2, Send, Zap, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import D3StyleNode from '../Canvas/D3StyleNode';
import D3BezierEdge from '../Canvas/D3BezierEdge';

const nodeTypes = { d3Node: D3StyleNode };
const edgeTypes = { d3Bezier: D3BezierEdge };

const DEMO_STEPS = {
  START: 0,
  MOVE_TO_ROOT: 1,
  CLICK_AI: 2,
  OPEN_AI_BOX: 3,
  TYPING: 4,
  GENERATING: 5,
  SPAWNING: 6,
  FINISHED: 7
};

const AutoDemoContent = () => {
  const { fitView, setViewport } = useReactFlow();
  const [step, setStep] = useState(DEMO_STEPS.START);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [nodes, setNodes] = useState([
    { id: 'root', type: 'd3Node', position: { x: 0, y: 0 }, data: { name: 'Marketing Strategy 2026', depth: 0, branchColor: '#6366f1' } }
  ]);
  const [edges, setEdges] = useState([]);
  const [aiText, setAiText] = useState('');
  const [showAiBox, setShowAiBox] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  const fullAiText = "Build a comprehensive SaaS marketing plan with multi-channel growth...";

  useEffect(() => {
    let active = true;
    const runSequence = async () => {
      if (!active) return;

      // Reset
      setStep(DEMO_STEPS.START);
      setNodes([{ id: 'root', type: 'd3Node', position: { x: 0, y: 0 }, data: { name: 'Marketing Strategy 2026', depth: 0, branchColor: '#6366f1' } }]);
      setEdges([]);
      setAiText('');
      setCursorPos({ x: 50, y: 50 });
      setShowAiBox(false);
      setShowToolbar(false);
      
      await new Promise(r => setTimeout(r, 2000));
      if (!active) return;

      // 1. Move to Root and show toolbar
      setCursorPos({ x: 400, y: 350 }); 
      await new Promise(r => setTimeout(r, 1200));
      setShowToolbar(true);
      await new Promise(r => setTimeout(r, 800));

      // 2. Click AI Icon
      setCursorPos({ x: 430, y: 290 });
      await new Promise(r => setTimeout(r, 600));
      setStep(DEMO_STEPS.CLICK_AI);
      await new Promise(r => setTimeout(r, 200));

      // 3. Open AI Box
      setShowAiBox(true);
      setShowToolbar(false);
      setStep(DEMO_STEPS.OPEN_AI_BOX);
      await new Promise(r => setTimeout(r, 800));

      // 4. Typing
      setStep(DEMO_STEPS.TYPING);
      for (let i = 0; i <= fullAiText.length; i++) {
        if (!active) return;
        setAiText(fullAiText.slice(0, i));
        await new Promise(r => setTimeout(r, 30));
      }
      await new Promise(r => setTimeout(r, 1000));

      // 5. Generate detailed map
      setStep(DEMO_STEPS.GENERATING);
      setShowAiBox(false);
      
      const detailedPlan = [
        { id: 'c1', name: 'Content Strategy', x: 280, y: -180, color: '#8b5cf6', children: [
          { id: 'c1-1', name: 'Blog Engine', x: 560, y: -220 },
          { id: 'c1-2', name: 'SEO Optimization', x: 560, y: -140 },
        ]},
        { id: 'c2', name: 'Paid Channels', x: 280, y: 0, color: '#ec4899', children: [
          { id: 'c2-1', name: 'Google Ads', x: 560, y: -40 },
          { id: 'c2-2', name: 'LinkedIn Ads', x: 560, y: 40 },
        ]},
        { id: 'c3', name: 'Retention & Email', x: 280, y: 180, color: '#10b981', children: [
          { id: 'c3-1', name: 'Drip Campaigns', x: 560, y: 140 },
          { id: 'c3-2', name: 'Churn Analysis', x: 560, y: 220 },
        ]}
      ];

      for (const group of detailedPlan) {
        if (!active) return;
        
        // Spawn Parent
        setNodes(prev => [...prev, { id: group.id, type: 'd3Node', position: { x: group.x, y: group.y }, data: { name: group.name, depth: 1, branchColor: group.color, isHovered: true } }]);
        setEdges(prev => [...prev, { id: `e-root-${group.id}`, source: 'root', target: group.id, type: 'd3Bezier', animated: true, style: { stroke: group.color, strokeWidth: 3 } }]);
        fitView({ padding: 0.4, duration: 800 });
        await new Promise(r => setTimeout(r, 500));

        // Spawn Children
        for (const child of group.children) {
          if (!active) return;
          setNodes(prev => [...prev, { id: child.id, type: 'd3Node', position: { x: child.x, y: child.y }, data: { name: child.name, depth: 2, branchColor: group.color, isHovered: false } }]);
          setEdges(prev => [...prev, { id: `e-${group.id}-${child.id}`, source: group.id, target: child.id, type: 'd3Bezier', animated: true, style: { stroke: group.color, strokeWidth: 2 } }]);
          fitView({ padding: 0.4, duration: 800 });
          await new Promise(r => setTimeout(r, 400));
        }
      }

      setStep(DEMO_STEPS.FINISHED);
      await new Promise(r => setTimeout(r, 6000));
      if (active) runSequence();
    };

    runSequence();
    return () => { active = false; };
  }, [fitView]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0f111a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
      >
        <Background variant={BackgroundVariant.Dots} color="#333" gap={30} />
        
        {/* Animated Toolbar */}
        <AnimatePresence>
          {showToolbar && (
            <Panel position="top-center" style={{ marginTop: '260px', marginLeft: '60px' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="flex items-center gap-2 bg-[#1a1d27]/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500"><Target size={18} /></div>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500"><TrendingUp size={18} /></div>
                <motion.div 
                  animate={{ backgroundColor: step === DEMO_STEPS.CLICK_AI ? '#6366f1' : 'rgba(99,102,241,0.1)' }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400"
                >
                  <Sparkles size={18} />
                </motion.div>
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>

        {/* Animated AI Box */}
        <AnimatePresence>
          {showAiBox && (
            <Panel position="center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="w-[450px] bg-[#1a1d27]/95 backdrop-blur-2xl border border-purple-500/30 rounded-[28px] shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(139,92,246,0.15)] overflow-hidden"
              >
                <div className="p-5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">AI Strategy Engine</span>
                      <span className="block text-[10px] text-purple-400 font-bold uppercase tracking-widest">Active Model: Llama-3 Premium</span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="p-8">
                  <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-5 text-lg text-white/90 min-h-[120px] leading-relaxed shadow-inner">
                    {aiText}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-6 bg-purple-500 ml-1 align-middle" />
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-base shadow-xl shadow-purple-500/20"
                    >
                      Generate Strategy <Send size={18} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>
      </ReactFlow>

      {/* Virtual Cursor Fix: Using left/top + absolute to ensure visibility */}
      <motion.div 
        animate={{ left: cursorPos.x, top: cursorPos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 150 }}
        className="fixed z-[10000] pointer-events-none origin-top-left"
        style={{ position: 'absolute' }}
      >
        <div className="relative">
          <MousePointer2 size={40} className="text-white fill-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
          <div className="absolute -top-1 -left-1 w-12 h-12 bg-white/10 rounded-full blur-xl" />
          {step === DEMO_STEPS.CLICK_AI && (
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              className="absolute inset-0 bg-white rounded-full"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AutoDemoContent />
  </ReactFlowProvider>
);
