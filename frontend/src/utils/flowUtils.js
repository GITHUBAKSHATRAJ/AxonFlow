import { stratify, tree } from 'd3-hierarchy';

const DOT_R = 6;
const DOT_GAP = 15;
const TEXT_GAP = 15;
const FONT_PX = 14;
const COL_GAP = 50;

function measureTextPx(text) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${FONT_PX}px sans-serif`;
        return ctx.measureText(text || '').width;
    } catch {
        return (text || '').length * 8;
    }
}

function nodeVisualWidth(name, depth) {
    const textW = Math.min(measureTextPx(name), 450);
    if (depth === 0) return textW + 30;
    return DOT_R + DOT_GAP + textW + TEXT_GAP;
}

export function estimateNodeHeight(text, depth) {
    if (depth === 0) return 50;
    const textWidth = measureTextPx(text);
    const maxW = 450;
    const numLines = Math.max(1, Math.ceil(textWidth / maxW));
    const lineHeight = 18;
    return 28 + (numLines - 1) * lineHeight;
}

export const COLOR_PALETTES = {
    mono: { label: 'Mono', colors: ['#555', '#555', '#555', '#555', '#555', '#555', '#555', '#555'] },
    vibrant: { label: 'Vibrant', colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e8c', '#ff6b35'] },
    pastel: { label: 'Pastel', colors: ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea', '#f0e6ff', '#ffeaa7'] },
    neon: { label: 'Neon', colors: ['#ff0044', '#00f5ff', '#39ff14', '#ff6600', '#bf00ff', '#ffff00', '#ff1493', '#00ffcc'] },
};

function buildColorMap(nodes, palette = 'mono') {
    const colorMap = {};
    const colors = COLOR_PALETTES[palette]?.colors || COLOR_PALETTES.mono.colors;
    const root = nodes.find(n => !n.parentId);
    if (!root) return colorMap;

    colorMap[root.id] = '#888';
    const rootChildren = nodes.filter(n => n.parentId === root.id);
    rootChildren.forEach((child, idx) => {
        const color = colors[idx % colors.length];
        const assignColor = (nodeId) => {
            colorMap[nodeId] = color;
            nodes.filter(n => n.parentId === nodeId).forEach(c => assignColor(c.id));
        };
        assignColor(child.id);
    });
    return colorMap;
}

function pushNode(nodes, edges, d, pos, colorMap, layoutMode) {
    const nodeH = estimateNodeHeight(d.data.name, d.depth);
    nodes.push({
        id: d.data.id,
        type: d.depth === 0 ? 'd3Node' : 'd3Node',
        position: { x: pos.x, y: pos.y - nodeH / 2 },
        data: {
            ...d.data,
            depth: d.depth,
            branchColor: colorMap[d.data.id] || '#555',
            layoutMode,
        },
        style: { background: 'transparent', border: 'none', padding: 0 },
    });

    if (d.parent) {
        edges.push({
            id: `e-${d.parent.data.id}-${d.data.id}`,
            source: d.parent.data.id,
            target: d.data.id,
            type: 'd3Bezier',
            data: {
                layoutMode,
                originalStroke: colorMap[d.data.id] || '#555',
            },
            style: { stroke: colorMap[d.data.id] || '#555', strokeWidth: 2 },
        });
    }
}

export const buildReactFlowData = (backendNodes, layoutMode = 'horizontal', colorPalette = 'mono') => {
    if (!backendNodes || backendNodes.length === 0) return { nodes: [], edges: [] };
    const colorMap = buildColorMap(backendNodes, colorPalette);

    try {
        const root = stratify()
            .id(d => d.id)
            .parentId(d => d.parentId)(backendNodes);

        const nodes = [];
        const edges = [];

        if (layoutMode === 'radial') {
            const RADIUS = 220;
            const layout = tree().size([2 * Math.PI, RADIUS]).separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
            layout(root);
            root.each(d => {
                let pos;
                if (d.depth === 0) { pos = { x: 0, y: 0 }; }
                else {
                    const angle = d.x - Math.PI / 2;
                    const radius = d.y * d.depth;
                    pos = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
                }
                pushNode(nodes, edges, d, pos, colorMap, layoutMode);
            });
            return { nodes, edges };
        }

        if (layoutMode === 'vertical') {
            const SIBLING_GAP = 200;
            const DEPTH_GAP = 110;
            const layout = tree().nodeSize([SIBLING_GAP, DEPTH_GAP]);
            layout(root);
            root.each(d => { pushNode(nodes, edges, d, { x: d.x, y: d.y }, colorMap, layoutMode); });
            return { nodes, edges };
        }

        const layout = tree().nodeSize([1, 1]).separation((a, b) => {
            const hA = estimateNodeHeight(a.data.name, a.depth);
            const hB = estimateNodeHeight(b.data.name, b.depth);
            return (hA + hB) / 2 + 40;
        });
        layout(root);

        const depthGroups = new Map();
        root.each(d => {
            if (!depthGroups.has(d.depth)) depthGroups.set(d.depth, []);
            depthGroups.get(d.depth).push(d);
        });

        const colX = new Map();
        colX.set(0, 0);
        for (let depth = 1; depth <= root.height; depth++) {
            const prevNodes = depthGroups.get(depth - 1) || [];
            const prevColX = colX.get(depth - 1) ?? 0;
            const maxW = Math.max(160, ...prevNodes.map(d => nodeVisualWidth(d.data.name, d.depth)));
            colX.set(depth, prevColX + maxW + COL_GAP);
        }

        root.each(d => {
            const nodeH = estimateNodeHeight(d.data.name, d.depth);
            pushNode(nodes, edges, d, { x: colX.get(d.depth), y: d.x - nodeH / 2 }, colorMap, layoutMode);
        });

        return { nodes, edges };
    } catch (err) {
        console.error('Layout error:', err);
        return { nodes: [], edges: [] };
    }
};

export const filterExpandedNodes = (nodes) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const result = [];
    const traverse = (nodeId) => {
        const node = nodeMap.get(nodeId);
        if (!node) return;
        result.push(node);
        if (node.isExpanded) {
            nodes.filter(n => n.parentId === nodeId).forEach(c => traverse(c.id));
        }
    };
    const root = nodes.find(n => !n.parentId);
    if (root) traverse(root.id);
    return result;
};

export const parseIndentedText = (text, targetParentId) => {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (!lines.length) return [];
    const newNodes = [];
    const generateId = () => Math.random().toString(36).substr(2, 9);
    const stack = [{ depth: -1, id: targetParentId }];
    lines.forEach(line => {
        const match = line.match(/^([ \t]*)/);
        const indent = match ? match[1] : '';
        let depth = 0;
        for (const char of indent) { if (char === '\t') depth += 4; else if (char === ' ') depth += 1; }
        const name = line.trim().replace(/^[-*•]\s+/, '').replace(/^[A-Za-z0-9]+\.\s+/, '');
        if (!name) return;
        const id = generateId();
        while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
        const parentId = stack[stack.length - 1].id;
        newNodes.push({ id, parentId, name, isExpanded: true });
        stack.push({ depth, id });
    });
    return newNodes;
};
