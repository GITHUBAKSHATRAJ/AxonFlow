Here's the full `FAQ.md`:

```markdown
# AxonFlow — Frequently Asked Questions (FAQ) 🧠⚡

> A comprehensive FAQ covering project vision, critical thinking scenarios, tech stack deep-dives, implementation patterns, and interview preparation.

---

## 📌 Table of Contents

### Part 1 — Non-Technical & HR Questions
- [1.1 Project Vision & Motivation](#11-project-vision--motivation)
- [1.2 What It Does & Who It Serves](#12-what-it-does--who-it-serves)
- [1.3 Critical Thinking & Scenario-Based Questions](#13-critical-thinking--scenario-based-questions)
- [1.4 Team, Process & Soft Skills](#14-team-process--soft-skills)

### Part 2 — Technical & Tech Stack FAQ
- [2.1 Architecture & Design Decisions](#21-architecture--design-decisions)
- [2.2 React & Frontend FAQ](#22-react--frontend-faq)
- [2.3 React Flow & D3 Canvas FAQ](#23-react-flow--d3-canvas-faq)
- [2.4 Node.js & Express Backend FAQ](#24-nodejs--express-backend-faq)
- [2.5 MongoDB & Mongoose FAQ](#25-mongodb--mongoose-faq)
- [2.6 Python, FastAPI & AI Engine FAQ](#26-python-fastapi--ai-engine-faq)
- [2.7 Authentication & Security FAQ](#27-authentication--security-faq)
- [2.8 Feature-Wise File Mapping](#28-feature-wise-file-mapping)
- [2.9 Prerequisites & Learning Resources](#29-prerequisites--learning-resources)

---

# Part 1 — Non-Technical & HR Questions

---

## 1.1 Project Vision & Motivation

### Q1. Why did you build AxonFlow?

**Answer:** Traditional mind-mapping tools like XMind, MindMeister, and Coggle are either:
- **Closed-source and expensive** (per-seat licensing)
- **Lack AI capabilities** (manual-only node creation)
- **Cloud-dependent** (no local/offline AI)

I wanted to build a tool that combines the visual power of mind mapping with **locally-hosted AI** (via Ollama) — so users get intelligent idea generation without sending sensitive data to third-party APIs. AxonFlow proves that a solo developer can build a production-grade, AI-integrated SPA using modern open-source tools.

---

### Q2. What problem does AxonFlow solve?

**Answer:** AxonFlow solves three core problems:

| Problem | How AxonFlow Solves It |
|---------|----------------------|
| **Information overload** | Converts unstructured ideas into visual hierarchical maps |
| **Blank canvas syndrome** | AI generates subtopics and full map structures automatically |
| **Fragmented organization** | Workspaces + folders + tags + favorites provide structured project management |

---

### Q3. How is AxonFlow different from existing mind-mapping tools?

**Answer:**

| Feature | XMind | MindMeister | Coggle | **AxonFlow** |
|---------|-------|-------------|--------|-------------|
| Open Source | ❌ | ❌ | ❌ | ✅ |
| AI Node Generation | ❌ | ❌ | ❌ | ✅ (Local LLM) |
| Real-time AI Streaming | ❌ | ❌ | ❌ | ✅ (SSE) |
| Self-hosted | ❌ | ❌ | ❌ | ✅ |
| Multiple Layout Modes | Limited | Limited | 1 | ✅ (3 modes) |
| File Attachments per Node | ❌ | ✅ | ❌ | ✅ |
| No vendor lock-in | ❌ | ❌ | ❌ | ✅ |

The key differentiator is **privacy-first AI**: all LLM inference runs locally via Ollama — no data leaves the user's machine.

---

### Q4. What was your biggest learning from this project?

**Answer:** The biggest learning was understanding the **separation between data structure and visual representation**. In AxonFlow, the database stores a flat list of nodes with `parentId` references — but the canvas needs positioned `{x, y}` coordinates. Building the bridge between these two representations using D3's `stratify()` and `tree()` algorithms taught me how graph databases and visualization engines work under the hood.

---

### Q5. If you had to start over, what would you do differently?

**Answer:**
1. **Use TypeScript from day one** — The codebase grew complex enough that type safety would have prevented several runtime bugs
2. **Implement WebSocket early** — For real-time collaboration, retrofitting WebSocket is harder than building it in from the start
3. **Use a state management library** — As the canvas state grew complex, React Context + hooks became unwieldy; Zustand or Jotai would have simplified state slicing
4. **Add comprehensive tests** — I'd write integration tests for the service layer before building features

---

### Q6. What is the business model potential for AxonFlow?

**Answer:** AxonFlow could follow a **freemium open-core** model:
- **Free tier**: Self-hosted, unlimited local maps, local AI
- **Pro tier**: Cloud sync, team collaboration, shared workspaces
- **Enterprise**: SSO integration, audit logs, custom LLM endpoints, admin dashboard

The open-source core builds community trust, while premium features monetize team/enterprise needs.

---

## 1.2 What It Does & Who It Serves

### Q7. Who is the target audience for AxonFlow?

**Answer:**
- **Students** — Studying and organizing course material, thesis planning, research paper structuring
- **Developers** — System design brainstorming, architecture planning, feature breakdowns
- **Project Managers** — Sprint planning, feature roadmaps, stakeholder presentations
- **Content Creators** — Blog outlines, video scripts, content calendars
- **Researchers** — Literature reviews, hypothesis mapping, concept relationships

---

### Q8. Can you explain AxonFlow to a non-technical person in 30 seconds?

**Answer:** "AxonFlow is like a digital whiteboard where you can map out your ideas as connected bubbles. You start with one central idea, and you can branch out into sub-ideas — just like a tree. The special part is that it has a built-in AI assistant that can automatically suggest related ideas for you, so you never stare at a blank page. Everything is saved automatically, and you can organize your maps into folders and workspaces."

---

### Q9. What are the core user stories (features) of AxonFlow?

**Answer:**

| # | As a... | I want to... | So that... |
|---|---------|-------------|-----------|
| 1 | User | Create a new mind map | I can visually brainstorm ideas |
| 2 | User | Add child/sibling nodes via keyboard | I can rapidly build idea trees |
| 3 | User | Ask AI to generate subtopics | I overcome creative blocks |
| 4 | User | Drag a node onto another node | I can reorganize my idea hierarchy |
| 5 | User | Attach notes, links, and files to nodes | I can store rich context per idea |
| 6 | User | Organize maps into workspaces and folders | I can manage multiple projects |
| 7 | User | Favorite/trash/restore maps | I can manage my map lifecycle |
| 8 | User | Switch between layout modes | I can view my map in the optimal orientation |
| 9 | User | Bulk import indented text | I can convert existing outlines into mind maps |
| 10 | User | Duplicate a map | I can create variations without losing the original |

---

## 1.3 Critical Thinking & Scenario-Based Questions

### Q10. Scenario: A user reports that their mind map with 500+ nodes is loading very slowly. How would you diagnose and fix this?

**Answer:** I'd investigate at multiple layers:

**Step 1 — Frontend Performance:**
- Check if `buildReactFlowData()` in `flowUtils.js` is being called too frequently (excessive re-renders)
- Add `useMemo` around the D3 layout computation (already done in `useCanvasState.js`)
- Check if React Flow's `fitView` is causing layout thrashing on every node change

**Step 2 — Network:**
- Check the `GET /api/nodes/map/:mapId` response time — if MongoDB is slow, add an index on `{ mapId: 1, userId: 1 }`
- Verify if all 500 nodes are fetched in one call (they are) — consider pagination or lazy-loading collapsed subtrees

**Step 3 — D3 Layout:**
- The `d3.tree()` algorithm is O(n) but `separation()` calls `estimateNodeHeight()` which uses `canvas.measureText()` — this DOM call for 500+ nodes could be expensive
- **Fix:** Cache text measurements or use a font-size estimation formula instead of DOM measurement

**Step 4 — React Flow:**
- Enable React Flow's `nodesDraggable={false}` for nodes not in viewport
- Use `onlyRenderVisibleElements` prop to skip rendering off-screen nodes

---

### Q11. Scenario: Two users edit the same map simultaneously. One adds a node, the other deletes the parent of that node. How do you handle this conflict?

**Answer:** Currently AxonFlow doesn't support real-time collaboration, but here's how I'd design it:

**Conflict Resolution Strategy: Last Write Wins + Orphan Detection**

1. **WebSocket layer**: Both clients connect to a room for `mapId`
2. **Operation broadcasting**: Each mutation (add/delete/rename) is broadcast as an operation with a timestamp
3. **Conflict case**: User A adds `Node C` under `Node B`. User B deletes `Node B`.
   - When User A's "add child" arrives, the server checks if `parentId` exists
   - If parent is deleted → the new node becomes an **orphan**
   - **Resolution**: Either auto-attach orphans to the root node, or queue them in a "conflict tray" for manual resolution
4. **CRDT approach** (advanced): Use a tree-CRDT like Yjs to handle concurrent edits with automatic merge

---

### Q12. Scenario: The AI engine generates inappropriate or nonsensical subtopics. How do you handle quality control?

**Answer:**

**Prevention:**
- Use specific system prompts: `"Output ONLY a valid JSON array of 4-6 concise sub-topic strings"`
- Set low temperature (0.2) for subtopic generation to reduce randomness
- Validate JSON structure before inserting into the database

**Detection:**
- Check if the AI returns valid JSON — if `extract_json()` fails, fall back to line-splitting
- Verify array length is within expected range (4-8 items)
- Optionally add a profanity/relevance filter before display

**Recovery:**
- Show a "Regenerate" button if results are unsatisfactory
- Allow users to delete individual AI-generated nodes
- Log failed generations for model tuning

**In AxonFlow's implementation** (`agent.py`):
```python
try:
    nodes = extract_json(raw)
    if isinstance(nodes, list):
        nodes = [str(n).strip() for n in nodes if str(n).strip()]
    else:
        nodes = [str(nodes)]
except Exception:
    # Fallback: split by newlines
    nodes = [l.strip() for l in raw.split('\n') if l.strip()]
```

---

### Q13. Scenario: Your MongoDB instance runs out of disk space during a production deployment. What happens to AxonFlow and how do you prevent this?

**Answer:**

**What happens:**
- `mongoose.connect()` throws a connection error
- The `catch` block in `index.js` logs the error and calls `process.exit(1)` — the server stops
- Frontend API calls fail with network errors; optimistic updates succeed locally but never persist

**Prevention:**
1. **Monitor disk usage** with alerts at 80% threshold
2. **TTL indexes** on trashed maps — auto-delete after 30 days:
   ```javascript
   // In Map.js schema
   trashedAt: { type: Date, default: null }
   // Create TTL index
   MapSchema.index({ trashedAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
   ```
3. **File upload limits** — Set Multer file size limits:
   ```javascript
   const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
   ```
4. **Database connection pooling** and retry logic with exponential backoff

---

### Q14. Scenario: A competitor launches a similar AI mind-mapping tool with GPT-4 integration. How does AxonFlow compete?

**Answer:**

| Their Advantage | AxonFlow's Counter |
|----------------|-------------------|
| GPT-4 quality | Privacy: No data leaves the user's machine |
| Cloud-hosted | Self-hosted: No subscription lock-in |
| Polished UX | Open-source: Community-driven improvements |
| API cost | Zero cost: Ollama runs locally for free |
| Vendor dependency | Model flexibility: Use any Ollama-compatible model |

**Strategic response:**
1. Add support for **optional cloud LLM providers** (OpenAI, Anthropic) as an alternative to Ollama — giving users choice
2. Focus on **offline-first** capabilities — maps work without internet
3. Build **export features** (PDF, PNG, Markdown) that competitors paywall
4. Emphasize **data ownership** — users control their data entirely

---

### Q15. Scenario: You need to scale AxonFlow to support 10,000 concurrent users. What changes would you make?

**Answer:**

```
Current Architecture (Single Server):
  Browser → Express (1 instance) → MongoDB (1 instance)

Scaled Architecture:
  Browser → CDN (static assets)
         → Load Balancer (Nginx)
            ├── Express Instance 1 ──┐
            ├── Express Instance 2 ──┤──→ MongoDB Replica Set
            ├── Express Instance 3 ──┘    (Primary + 2 Secondaries)
            └── WebSocket Server ────→ Redis (Pub/Sub)
         → AI Engine Cluster
            ├── FastAPI Worker 1 ──→ Ollama GPU Server 1
            ├── FastAPI Worker 2 ──→ Ollama GPU Server 2
            └── FastAPI Worker 3 ──→ Ollama GPU Server 3
```

**Specific changes:**
1. **Frontend**: Deploy to CDN (Vercel/CloudFront) for static asset caching
2. **Backend**: Run multiple Express instances behind Nginx load balancer
3. **Database**: MongoDB replica set with read preference `secondaryPreferred` for list queries
4. **Session**: Move auth from in-memory to Redis-backed sessions
5. **AI Engine**: Queue AI requests with Redis/Bull — GPU is the bottleneck
6. **File uploads**: Move from local disk to S3/MinIO object storage
7. **Caching**: Redis cache for frequently accessed maps and workspace lists

---

## 1.4 Team, Process & Soft Skills

### Q16. How did you manage this project as a solo developer?

**Answer:**
- **Phase 1 (Foundation)**: Set up monorepo, backend models, basic REST API
- **Phase 2 (Canvas)**: Built the React Flow canvas, D3 layout engine, node CRUD
- **Phase 3 (Organization)**: Added workspaces, folders, favorites, trash
- **Phase 4 (AI)**: Integrated Ollama via FastAPI, added streaming, prompt engineering
- **Phase 5 (Polish)**: Multi-theme support, bulk import, map duplication, error boundaries

I used Git for version control, maintained a `startup.md` for initialization decisions, and documented the schema in `schema.md`.

---

### Q17. How would you onboard a new developer to this codebase?

**Answer:**
1. **Start with `README.md`** — Understand the 3-service architecture
2. **Read `schema.md`** — Understand the data model relationships
3. **Trace one feature end-to-end**: Follow "Create Map" from button click → Dashboard.jsx → mapApi.js → mapRoutes.js → mapController.js → mapService.js → Map.js
4. **Run the project locally** — Follow the Getting Started guide
5. **Make a small change** — Add a new field to the Node schema and display it in the UI
6. **Review the hooks** — `useCanvasState`, `useCanvasActions`, `useCanvasEvents` are the core canvas logic

---

### Q18. What was the hardest bug you encountered and how did you fix it?

**Answer:** The hardest bug was **D3 layout breaking when nodes had very long text**. The `d3.tree()` algorithm assigns uniform spacing, but nodes with 100+ character names would overlap visually.

**Root Cause:** The `separation()` function in `d3.tree()` didn't account for variable node heights.

**Fix:** I created a custom `estimateNodeHeight()` function that measures text width using `canvas.measureText()`, calculates line wrapping, and returns pixel height. This was fed into the `separation()` callback:

```javascript
// flowUtils.js
const layout = tree().nodeSize([1, 1]).separation((a, b) => {
    const hA = estimateNodeHeight(a.data.name, a.depth);
    const hB = estimateNodeHeight(b.data.name, b.depth);
    return (hA + hB) / 2 + 40; // Dynamic spacing based on content height
});
```

For horizontal layout, I also built a **column-width calculator** that measures the widest node at each depth level and spaces columns accordingly — preventing overlap on deeply nested maps.

---

### Q19. How do you handle feedback and criticism about your code?

**Answer:** I actively seek it. The codebase has `// NOTE: Reviewed on 24th May, 2026` comments in several files — these track self-review cycles. When receiving feedback, I:
1. Reproduce the concern to understand it fully
2. Evaluate whether it's a style preference vs. a correctness issue
3. If valid, fix it and add a code comment explaining the reasoning
4. If debatable, discuss tradeoffs (performance vs. readability, etc.)

---

### Q20. Where do you see AxonFlow in 1 year?

**Answer:**
- **Q1**: Real-time collaboration (WebSocket/Yjs CRDT), Clerk auth integration
- **Q2**: Export to PDF/PNG/Markdown, mobile-responsive canvas
- **Q3**: Template marketplace, shared workspaces, permission system
- **Q4**: Plugin API, custom node types, Gantt/timeline view integration

---

# Part 2 — Technical & Tech Stack FAQ

---

## 2.1 Architecture & Design Decisions

### Q21. Why did you choose a monorepo structure instead of separate repositories?

**Answer:**
- **Shared context**: All three services (frontend, backend, AI engine) evolve together — a monorepo keeps changes atomic
- **Easier local development**: One `git clone` gets everything needed
- **Shared documentation**: README, schema docs, and startup guides live alongside code
- **No version mismatch**: API contract changes are visible in the same commit

**Tradeoff:** A monorepo gets heavier with time. For a team of 10+, I'd consider tools like Nx or Turborepo for build orchestration.

---

### Q22. Why did you separate the AI engine from the Node.js backend?

**Answer:**

| Reason | Explanation |
|--------|-------------|
| **Language fit** | Python has superior ML/AI libraries (LangChain, Ollama bindings) |
| **Independent scaling** | AI is GPU-bound; backend is I/O-bound — different scaling needs |
| **Fault isolation** | AI engine crash doesn't take down map CRUD operations |
| **Deployment flexibility** | AI can run on a GPU server while backend runs on a cheap VPS |

The frontend talks to both services directly — the backend for CRUD, and the AI engine for generation:

```
Frontend ──REST──→ Backend (:5000) ──→ MongoDB
Frontend ──SSE───→ AI Engine (:8001) ──→ Ollama (:11434)
```

---

### Q23. Why did you use a Service Layer pattern in the backend instead of putting logic directly in controllers?

**Answer:**

**Without Service Layer (Fat Controller):**
```javascript
// ❌ Bad: Business logic inside the controller
exports.createMap = async (req, res) => {
    const map = new Map({ name: req.body.name, userId: req.auth.userId });
    await map.save();
    const root = new Node({ mapId: map._id, name: map.name, parentId: null });
    await root.save();
    map.rootNodeId = root._id;
    await map.save();
    res.json(map);
};
```

**With Service Layer (AxonFlow's approach):**
```javascript
// ✅ Good: Controller is thin, delegates to service
// mapController.js
exports.createMap = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        const newMap = await mapService.createMap(req.auth.userId, req.body);
        res.status(201).json(newMap);
    } catch (err) { next(err); }
};

// mapService.js
async createMap(userId, data) {
    const newMap = new Map({ name: data.name, userId, workspace: data.workspace });
    const savedMap = await newMap.save();
    const rootNode = new Node({ mapId: savedMap._id, userId, parentId: null, name: savedMap.name });
    const savedRoot = await rootNode.save();
    savedMap.rootNodeId = savedRoot._id;
    await savedMap.save();
    return savedMap;
}
```

**Benefits:**
- Controllers handle HTTP concerns only (parsing, auth, response codes)
- Services contain business logic and are reusable across routes
- Services can call other services (e.g., `mapService.duplicateMap()` uses the Node model directly)
- Easier to unit test — services don't need `req`/`res` mocks

---

## 2.2 React & Frontend FAQ

### Q24. Why React 19? What features do you use?

**Answer:** React 19 was chosen for its mature ecosystem and specific features used in AxonFlow:

| Feature | Where Used | File |
|---------|-----------|------|
| `createRoot` | App bootstrap (React 18+ concurrent rendering) | `main.jsx` |
| `useContext` + `createContext` | Global auth state management | `authContext.jsx` |
| `useCallback` | Memoizing canvas action handlers | `CanvasContainer.jsx` |
| `useMemo` | Caching D3-computed node positions | `CanvasContainer.jsx` |
| `useRef` | Persisting `backendNodes` without re-renders | `CanvasContainer.jsx` |
| `useEffect` | Data fetching on mount, theme application | All pages |
| `useState` | Local component state | All components |

---

### Q25. How does React Context API work in AxonFlow? Can you explain with code?

**Answer:** React Context solves "prop drilling" — passing data through many component levels.

**Step 1 — Create Context:**
```javascript
// authContext.jsx
const AuthContext = createContext(null);
```

**Step 2 — Provider wraps the app:**
```javascript
// authContext.jsx
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    function login() {
        const demoUser = { id: 'user_demo_123', name: 'Demo User' };
        localStorage.setItem('axonflow_user', JSON.stringify(demoUser));
        setIsAuthenticated(true);
        setUser(demoUser);
    }

    function logout() {
        localStorage.removeItem('axonflow_user');
        setIsAuthenticated(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

**Step 3 — Mount at the top of the tree:**
```javascript
// main.jsx
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>      {/* ← All children can access auth */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
```

**Step 4 — Consume anywhere:**
```javascript
// Dashboard.jsx
const { user } = useAuth();  // Custom hook wrapping useContext(AuthContext)
```

**Flow Diagram:**
```
<AuthProvider>  ──provides──→  { isAuthenticated, user, login, logout }
    │
    ├── <LandingPage>  ──consumes──→  isAuthenticated (for redirect)
    ├── <Dashboard>    ──consumes──→  user.name (for greeting)
    ├── <GlobalSidebar>──consumes──→  user.avatar, logout()
    └── <ProtectedRoute>──consumes──→ isAuthenticated (for guard)
```

---

### Q26. What is the difference between `useCallback` and `useMemo`? How are they used in AxonFlow?

**Answer:**

| Hook | Memoizes | Returns | Use Case |
|------|----------|---------|----------|
| `useCallback` | A function definition | The same function reference | Prevent child re-renders when passing callbacks |
| `useMemo` | A computed value | The cached result | Skip expensive calculations |

**`useCallback` in AxonFlow** — Memoizing the map rename handler:
```javascript
// Editor.jsx
const handleUpdateMapName = useCallback(async function (newName) {
    setMapName(newName);
    setIsSaving(true);
    setBackendNodes(prev =>
        prev.map(n => (!n.parentId ? { ...n, name: newName } : n))
    );
    await mapApi.updateMapAttributes(id, { name: newName });
    setIsSaving(false);
}, [id]);  // Only recreated when map ID changes
```

**`useMemo` in AxonFlow** — Caching styled nodes to avoid recomputing on every render:
```javascript
// CanvasContainer.jsx
const styledNodes = useMemo(function () {
    return nodes.map(n => ({
        ...n,
        selected: n.id === focusedNodeId,
        data: {
            ...n.data,
            isHovered: n.id === hoveredNodeId,
            isDropTarget: n.id === dropTargetId,
        }
    }));
}, [nodes, focusedNodeId, hoveredNodeId, dropTargetId]);
```

Without `useMemo`, this mapping would run on every render — including mouse moves, which fire rapidly during canvas panning.

---

### Q27. What is React Router and how does AxonFlow implement protected routes?

**Answer:** React Router enables client-side navigation without full page reloads.

**Route Configuration:**
```javascript
// routes.jsx
<Routes>
    <Route path="/welcome" element={<LandingPage />} />           {/* Public */}
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/map/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
    <Route path="/maps" element={<ProtectedRoute><MyMaps /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />      {/* Catch-all */}
</Routes>
```

**ProtectedRoute Pattern:**
```javascript
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Spinner />;                    // Show loader while checking
    if (!isAuthenticated) return <Navigate to="/welcome" replace />;  // Redirect
    return children;                                     // Render protected content
};
```

**How `useParams` extracts the map ID:**
```javascript
// Editor.jsx
const { id } = useParams();  // URL: /map/abc123 → id = "abc123"
```

---

### Q28. What is "Optimistic Update" and where is it used in AxonFlow?

**Answer:** Optimistic Update means updating the UI **immediately** before the server confirms success, then reverting if the API call fails.

**Example — Toggling Favorite in Dashboard.jsx:**
```javascript
async function togglePin(e, map) {
    e.stopPropagation();
    const newIsFavorite = !map.isFavorite;

    // 1. OPTIMISTIC: Update UI instantly (no waiting for network)
    setMaps(prev => prev.map(m =>
        m.id === map.id ? { ...m, isFavorite: newIsFavorite } : m
    ));

    // 2. PERSIST: Send update to server in background
    try {
        await mapApi.updateMapAttributes(map.id, { isFavorite: newIsFavorite });
    } catch (err) {
        // 3. REVERT: If API fails, we could revert the state
        console.error('Failed to pin:', err);
    }
}
```

**Why?** Without optimistic updates, the user clicks "favorite" and sees nothing happen for 200-500ms while the network request completes. With it, the star icon toggles instantly, making the app feel responsive.

---

### Q29. What is Axios? How does AxonFlow configure it?

**Answer:** Axios is an HTTP client library for making API requests. AxonFlow creates a centralized instance with interceptors:

```javascript
// client.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Centralized instance — all API calls go through this
export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor: automatically inject auth headers on EVERY request
api.interceptors.request.use((config) => {
    config.headers['x-user-id'] = 'user_demo_123';
    return config;
});
```

**Usage in API modules:**
```javascript
// mapApi.js
import { api } from './client';

export async function fetchAllMaps(params = {}) {
    const response = await api.get('/maps/list', { params });
    return response.data;
}
```

**Why an interceptor?** Instead of adding `headers: { 'x-user-id': ... }` to every single API call (20+ places), the interceptor injects it once globally. When you later integrate Clerk auth, you only change one file.

---

## 2.3 React Flow & D3 Canvas FAQ

### Q30. What is React Flow and why was it chosen for AxonFlow?

**Answer:** React Flow (`@xyflow/react`) is a library for building interactive node-based graphs and diagrams.

**Why React Flow over alternatives:**

| Library | Why Not / Why |
|---------|--------------|
| **React Flow** ✅ | Built for React, supports custom nodes/edges, excellent performance with virtualization |
| D3.js (raw) | Too low-level — would require building drag, zoom, selection from scratch |
| vis.js | Not React-native, harder to integrate with React state |
| Cytoscape.js | Better for network graphs, not ideal for hierarchical mind maps |
| GoJS | Commercial license, expensive |

**Key React Flow features used:**

```javascript
// CanvasContainer.jsx
<ReactFlow
    nodes={styledNodes}             // Positioned node objects
    edges={edges}                    // Connection lines
    onNodesChange={onNodesChange}   // Handles drag, select, remove
    onEdgesChange={onEdgesChange}
    onNodeClick={onNodeClick}       // Single click handler
    onNodeDrag={onNodeDrag}         // Drag-to-reparent
    onNodeDragStop={onNodeDragStop}
    onNodeContextMenu={onNodeContextMenu}  // Right-click menu
    nodeTypes={nodeTypes}           // Custom D3StyleNode renderer
    edgeTypes={edgeTypes}           // Custom D3BezierEdge renderer
    fitView                         // Auto-zoom to fit content
    minZoom={0.05}                  // Zoom out far for large maps
    maxZoom={2.5}
>
    <Background variant="dots" />
    <Controls />
</ReactFlow>
```

---

### Q31. How does D3-hierarchy work in AxonFlow? Explain the layout algorithm.

**Answer:** D3-hierarchy converts a flat list of nodes into a positioned tree layout. Here's the pipeline:

**Step 1 — Stratify (Flat → Tree):**
```javascript
import { stratify, tree } from 'd3-hierarchy';

// Convert flat MongoDB documents into a D3 hierarchy
const root = stratify()
    .id(d => d.id)
    .parentId(d => d.parentId)(backendNodes);

// Input:  [{ id: 'A', parentId: null }, { id: 'B', parentId: 'A' }, ...]
// Output: Tree with root.children, root.depth, root.height, etc.
```

**Step 2 — Layout (Tree → Positions):**
```javascript
// Horizontal mode: custom column widths
const layout = tree()
    .nodeSize([1, 1])
    .separation((a, b) => {
        const hA = estimateNodeHeight(a.data.name, a.depth);
        const hB = estimateNodeHeight(b.data.name, b.depth);
        return (hA + hB) / 2 + 40;  // Spacing based on text height
    });

layout(root);  // Assigns x, y to each node in the tree
```

**Step 3 — Column-Width Calculation (Horizontal Mode):**
```javascript
// Measure the widest node at each depth to prevent overlap
const colX = new Map();
colX.set(0, 0);
for (let depth = 1; depth <= root.height; depth++) {
    const prevNodes = depthGroups.get(depth - 1) || [];
    const maxW = Math.max(160, ...prevNodes.map(d => nodeVisualWidth(d.data.name, d.depth)));
    colX.set(depth, prevColX + maxW + COL_GAP);
}
```

**Three Layout Modes:**
```
Horizontal:  Root ──→ Branch ──→ Leaf    (left-to-right, column-based)
Vertical:    Root                         (top-to-bottom, standard tree)
               ├── Branch
               └── Branch
Radial:      Nodes spread in a circle     (polar coordinates)
             Uses Math.cos/Math.sin to convert angle → x,y
```

---

### Q32. How does the custom D3StyleNode work?

**Answer:** `D3StyleNode.jsx` is a custom React Flow node renderer. Instead of React Flow's default rectangular nodes, AxonFlow uses a minimal D3-inspired design:

```
[●]──── Node Label Text           ← Regular node (dot + text)
        ┌──────────────────────┐
        │     Root Node Label  │   ← Root node (centered text + bottom dot)
        │          [●]         │
        └──────────────────────┘
```

**Key implementation details:**

1. **Text measurement** — Uses Canvas API to calculate node width:
```javascript
function measureText(text, fontSize = 14) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px sans-serif`;
    return ctx.measureText(text || '').width;
}
```

2. **Inline editing** — Uses uncontrolled `<input>` for performance:
```javascript
// Uses defaultValue instead of value to avoid re-renders while typing
<input
    ref={inputRef}
    autoFocus
    defaultValue={data.name || ''}
    onKeyDown={e => {
        if (e.key === 'Enter') data.onDraftConfirm?.(data.id, e.target.value);
        if (e.key === 'Escape') data.onDraftCancel?.(data.id);
    }}
    className="nodrag nopan"  // Prevents drag/pan when clicking input
/>
```

3. **Status tags** — Visual indicators per node:
```javascript
const STATUS_MAP = {
    reading:    { icon: BookOpen,      color: '#38bdf8' },
    completed:  { icon: CheckCircle2,  color: '#4ade80' },
    incomplete: { icon: Clock,         color: '#f87171' },
    important:  { icon: AlertCircle,   color: '#fbbf24' },
    revise:     { icon: RefreshCcw,    color: '#c084fc' },
};
```

---

## 2.4 Node.js & Express Backend FAQ

### Q33. What is Express.js and how is the middleware pipeline structured?

**Answer:** Express.js is a minimal Node.js web framework. AxonFlow's middleware pipeline processes every request in order:

```javascript
// app.js
const app = express();

// 1. CORS — Allow cross-origin requests from frontend (:5173)
app.use(cors());

// 2. Body Parser — Parse JSON request bodies
app.use(express.json());

// 3. Auth Middleware — Extract userId from headers
app.use((req, res, next) => {
    const userId = req.headers['x-user-id'] || 'user_demo_123';
    req.auth = { userId };
    next();
});

// 4. Routes — Match URL paths to handlers
app.use('/api', apiRoutes);

// 5. Error Handler — Catch all thrown errors
app.use((err, req, res, next) => {
    console.error('❌ Error Stack:', err.stack);
    if (err.message === 'Unauthenticated') {
        return res.status(401).json({ error: 'Unauthenticated!' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
});
```

**Request lifecycle:**
```
Browser request: PATCH /api/maps/abc123/attributes
    │
    ▼ cors() — adds Access-Control-Allow-Origin headers
    ▼ express.json() — parses body: { isFavorite: true }
    ▼ auth middleware — sets req.auth = { userId: 'user_demo_123' }
    ▼ router.use('/api', apiRoutes) — matches /maps
    ▼ mapRoutes: PATCH /:mapId/attributes — matches abc123
    ▼ mapController.updateMapAttributes(req, res, next)
    ▼ mapService.updateMap('abc123', 'user_demo_123', { isFavorite: true })
    ▼ Map.findOne({ _id: 'abc123', userId: 'user_demo_123' })
    ▼ map.save()
    ▼ res.json(updatedMap)
```

---

### Q34. How does file upload work in AxonFlow?

**Answer:** File uploads use **Multer** — a middleware for handling `multipart/form-data`:

**Configuration:**
```javascript
// fileStorageService.js
const multer = require('multer');

const uploadDir = process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });
```

**Route:**
```javascript
// fileRoutes.js
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/:filename', fileController.getFile);
```

**Response — Returns a URL the frontend stores in the node's `files` array:**
```javascript
// fileController.js
exports.uploadFile = async (req, res) => {
    const response = {
        fileName: req.file.originalname,
        fileUrl: `${req.protocol}://${req.get('host')}/api/files/${req.file.filename}`
    };
    res.json(response);
};
```

---

### Q35. What is the `bulkWrite` operation and why is it used?

**Answer:** `bulkWrite` sends multiple update operations to MongoDB in a single network round-trip instead of N separate calls.

**Scenario:** User drags nodes on canvas → 50 nodes need position updates.

**Without bulkWrite (N API calls):**
```javascript
// ❌ Slow: 50 separate HTTP + DB calls
for (const node of nodes) {
    await Node.findByIdAndUpdate(node.id, { x: node.x, y: node.y });
}
```

**With bulkWrite (1 API call):**
```javascript
// ✅ Fast: 1 HTTP call + 1 DB call
async bulkUpdateNodes(userId, nodesData) {
    const operations = nodesData.map(node => {
        const { id, ...updateFields } = node;
        return {
            updateOne: {
                filter: { _id: id, userId },
                update: { $set: updateFields },
                upsert: false
            }
        };
    });
    return await Node.bulkWrite(operations);
}
```

**Performance comparison for 50 nodes:**
- Without bulkWrite: ~50 × 5ms = 250ms (50 round trips)
- With bulkWrite: ~1 × 15ms = 15ms (1 round trip, batched operations)

---

## 2.5 MongoDB & Mongoose FAQ

### Q36. Why MongoDB over PostgreSQL for AxonFlow?

**Answer:**

| Factor | MongoDB ✅ | PostgreSQL |
|--------|-----------|------------|
| **Schema flexibility** | Node fields vary (notes, links, files, status) — document model fits naturally | Would need JSON columns or many nullable columns |
| **Hierarchical data** | `parentId` references work elegantly in documents | Would need recursive CTEs or adjacency list patterns |
| **Embedded sub-documents** | `links: [{ title, url }]` and `files: [{ fileName, fileUrl }]` embed naturally | Would need separate join tables |
| **Read pattern** | Most queries are "get all nodes for map X" — single collection scan | Would require JOINs across tables |
| **Scalability** | Horizontal sharding by `userId` or `mapId` | Vertical scaling primarily |

**However, PostgreSQL would be better if:**
- We needed complex cross-entity queries (e.g., "find all nodes with status='important' across all maps")
- We needed ACID transactions for multi-document operations
- We needed full-text search across node content

---

### Q37. Explain the Mongoose schema design with `toJSON` transforms.

**Answer:** Mongoose schemas use `toJSON` transforms to clean up API responses:

```javascript
// Map.js
const MapSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    rootNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' },
    // ... more fields
}, {
    timestamps: true,  // Auto-adds createdAt, updatedAt
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;    // Add 'id' field (frontend-friendly)
            delete ret._id;       // Remove '_id' (MongoDB internal)
            delete ret.__v;       // Remove version key
        }
    }
});
```

**Before transform:**
```json
{ "_id": "665a1b2c...", "__v": 0, "name": "My Map", ... }
```

**After transform:**
```json
{ "id": "665a1b2c...", "name": "My Map", ... }
```

This ensures the frontend always receives clean `id` fields instead of MongoDB's `_id`.

---

### Q38. How does recursive deletion work for nodes?

**Answer:** When a user deletes a node, all its descendants must also be deleted (cascade):

```javascript
// nodeService.js
async deleteNodeRecursive(nodeId, userId) {
    // 1. Find the node
    const node = await Node.findOne({ _id: nodeId, userId });
    if (!node) return;

    // 2. Find all direct children
    const children = await Node.find({ parentId: nodeId, userId });

    // 3. Recursively delete each child (depth-first)
    for (const child of children) {
        await this.deleteNodeRecursive(child._id, userId);
    }

    // 4. Delete the node itself (after all children are gone)
    await Node.deleteOne({ _id: nodeId, userId });
}
```

**Execution for a tree like:**
```
    A
   / \
  B   C
 / \
D   E
```

**Delete A → calls:**
1. `deleteNodeRecursive(B)` → `deleteNodeRecursive(D)` → delete D → `deleteNodeRecursive(E)` → delete E → delete B
2. `deleteNodeRecursive(C)` → delete C
3. delete A

**Note:** The `userId` filter on every query ensures a user can only delete their own nodes — this is security at the data layer.

---

## 2.6 Python, FastAPI & AI Engine FAQ

### Q39. Why FastAPI over Flask or Django for the AI engine?

**Answer:**

| Feature | FastAPI ✅ | Flask | Django |
|---------|----------|-------|--------|
| Async support | Native (ASGI) | Requires extensions | Limited |
| Streaming responses | Built-in `StreamingResponse` | Possible but manual | Complex |
| Auto API docs | Swagger UI at `/docs` | None by default | DRF adds it |
| Type validation | Pydantic models (automatic) | Manual | Serializers |
| Performance | High (Starlette-based) | Moderate | Lower |

The key reason: **SSE streaming**. FastAPI's `StreamingResponse` made it trivial to stream token-by-token AI output:

```python
@app.post("/api/ai/stream-nodes")
def stream_nodes(request: NodeGenRequest):
    def generate():
        for event in stream_mindmap_agent(request.prompt, request.parent_node_id, request.model):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )
```

---

### Q40. How does LangChain work in AxonFlow?

**Answer:** LangChain is used to build a "chain" that connects a prompt template to an LLM:

```python
# agent.py
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

def stream_mindmap_agent(user_prompt, parent_id, model="llama3"):
    # 1. Initialize LLM
    llm = ChatOllama(model=model, temperature=0.2)

    # 2. Create prompt template
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Mind Map Architect.
            Output ONLY a valid JSON array of 4-6 sub-topic strings."""),
        ("human", "Generate 4-6 sub-topics for: {prompt}")
    ])

    # 3. Create chain (template | llm)
    chain = prompt_template | llm

    # 4. Stream output token by token
    full_text = ""
    for chunk in chain.stream({"prompt": user_prompt}):
        if chunk.content:
            full_text += chunk.content
            yield {"type": "token", "content": chunk.content}  # Stream to frontend

    # 5. Parse final result
    nodes = extract_json(full_text)
    yield {"type": "result", "data": {"parent_id": parent_id, "nodes": nodes}}
```

**Chain composition (`|` operator):**
```
prompt_template | llm
     ↓              ↓
  Formats the    Sends to Ollama
  messages         and gets response
```

---

### Q41. How does SSE (Server-Sent Events) streaming work end-to-end?

**Answer:**

**Backend (FastAPI) — Sends events:**
```python
def generate():
    yield 'data: {"type": "token", "content": "Art"}\n\n'
    yield 'data: {"type": "token", "content": "ificial"}\n\n'
    yield 'data: {"type": "token", "content": " Intelligence"}\n\n'
    yield 'data: {"type": "result", "data": {"nodes": ["ML", "NLP", "CV"]}}\n\n'

return StreamingResponse(generate(), media_type="text/event-stream")
```

**Frontend (aiApi.js) — Reads events:**
```javascript
export async function getAIStream(endpoint, payload, onToken, onResult, onError) {
    const response = await fetch(`${AI_ENGINE_URL}/api/ai/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();  // Keep incomplete line in buffer

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const event = JSON.parse(line.slice(6));
                if (event.type === 'token')  onToken(event.content);   // Display character
                if (event.type === 'result') onResult(event.data);     // Insert nodes
                if (event.type === 'error')  onError(event.content);
            }
        }
    }
}
```

**Why SSE over WebSocket?**
- SSE is **simpler** — server pushes, client listens (one-direction)
- No handshake protocol — just HTTP with `text/event-stream` content type
- Perfect for AI streaming where the client doesn't need to send data mid-stream
- Automatic reconnection built into the EventSource browser API

---

## 2.7 Authentication & Security FAQ

### Q42. How does authentication currently work? What's the plan for production?

**Answer:**

**Current (Development Mock):**
```javascript
// Backend: app.js — Extracts user ID from header
app.use((req, res, next) => {
    const userId = req.headers['x-user-id'] || 'user_demo_123';
    req.auth = { userId };
    next();
});

// Frontend: client.js — Sends hardcoded user ID
api.interceptors.request.use((config) => {
    config.headers['x-user-id'] = 'user_demo_123';
    return config;
});
```

**Production Plan (Clerk Integration):**
```javascript
// Backend: Replace mock middleware with Clerk verification
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
app.use(ClerkExpressRequireAuth());  // Verifies JWT, sets req.auth

// Frontend: Replace hardcoded ID with Clerk token
import { useAuth } from '@clerk/clerk-react';
const { getToken } = useAuth();
api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${await getToken()}`;
    return config;
});
```

Clerk is already in `package.json` for both frontend and backend — it's prepared but not activated.

---

### Q43. How does AxonFlow ensure data isolation between users?

**Answer:** Every database query includes a `userId` filter:

```javascript
// nodeService.js — User can only see their own nodes
async getNodesByMap(mapId, userId) {
    return await Node.find({ mapId, userId });  // ← userId filter
}

// nodeService.js — User can only update their own nodes
async updateNode(nodeId, userId, updateData) {
    const node = await Node.findOneAndUpdate(
        { _id: nodeId, userId },  // ← userId filter prevents unauthorized access
        { $set: updateData },
        { new: true }
    );
    if (!node) throw new Error('Node not found or unauthorized');
    return node;
}
```

This pattern is applied to **every single service method** — it's security at the data layer, not just the API layer.

---

## 2.8 Feature-Wise File Mapping

### Feature: Create Mind Map

```
User clicks "New Map" button
│
├── Frontend
│   ├── Dashboard.jsx           → handleCreateNew() called
│   ├── services/api/mapApi.js  → createMap('New Idea Map') sends POST
│   └── services/api/client.js  → Axios adds auth header
│
├── Backend
│   ├── routes/mapRoutes.js     → POST /api/maps/create matched
│   ├── controllers/mapController.js → createMap() handler
│   ├── services/mapService.js  → createMap() business logic
│   │   ├── models/Map.js       → new Map({...}).save()
│   │   └── models/Node.js      → new Node({...}).save() (root node)
│   └── Response: { id, name, rootNodeId, ... }
│
└── Frontend
    └── Dashboard.jsx → navigate(`/map/${res.id}`) → Editor loads
```

### Feature: AI Node Generation

```
User right-clicks node → "AI Generate"
│
├── Frontend
│   ├── CanvasContainer.jsx     → openAI(rfNode) called
│   ├── hooks/useCanvasActions.js → sets AI panel open
│   └── services/api/aiApi.js   → streamAINodes(prompt, parentId, model)
│       └── fetch() with ReadableStream
│
├── AI Engine (Python :8001)
│   ├── main.py                 → POST /api/ai/stream-nodes
│   ├── agent.py                → stream_mindmap_agent()
│   │   ├── ChatOllama          → connects to Ollama :11434
│   │   └── chain.stream()      → yields SSE events
│   └── utils.py                → extract_json() parses LLM output
│
├── Frontend receives SSE stream
│   ├── aiApi.js → onToken() displays thinking text
│   └── aiApi.js → onResult() receives parsed nodes array
│
├── Frontend inserts nodes
│   ├── services/api/nodeApi.js → bulkCreateNodes(newNodes)
│   └── Backend POST /api/nodes/bulk-create → MongoDB insert
│
└── Frontend re-renders
    └── hooks/useCanvasState.js → D3 recalculates layout
```

### Feature: Workspace & Folder Organization

```
User navigates to /workspaces
│
├── Frontend
│   ├── WorkspaceView.jsx       → loadWorkspaces() on mount
│   └── services/api/folderApi.js → fetchWorkspaces()
│
├── Backend
│   ├── routes/folderRoutes.js  → GET /api/folders/workspaces/list
│   ├── controllers/folderController.js → getWorkspaces()
│   └── services/folderService.js → getWorkspaces()
│       ├── Map.distinct('workspace', { userId })
│       └── Folder.distinct('workspace', { userId })
│       └── Combines + deduplicates workspace names
│
├── User clicks a workspace → navigates to /workspaces/:name
│   ├── WorkspaceView.jsx → loadWorkspaceContent()
│   ├── folderApi.fetchFolders(workspace, null)
│   └── mapApi.fetchAllMaps({ workspace, folderId })
│
└── Renders folders (FolderCard) + maps (MapCard) in grid
```

### Feature: Multi-Theme Support

```
User clicks theme toggle in GlobalSidebar
│
├── GlobalSidebar.jsx → toggleTheme()
│   └── Cycles: 'dark' → 'light' → 'neon' → 'dark'
│
├── useEffect → document.documentElement.setAttribute('data-theme', theme)
│   └── localStorage.setItem('app-theme', theme)
│
└── index.css applies CSS custom properties:
    [data-theme="dark"] {
        --bg: #0a0a0c;
        --text-h: #ffffff;
        --accent: #6d28d9;
    }
    [data-theme="light"] {
        --bg: #f5f5f5;
        --text-h: #111111;
        --accent: #7c3aed;
    }
    [data-theme="neon"] {
        --bg: #0a0a12;
        --text-h: #e0e0ff;
        --accent: #00ff9f;
    }
```

### Feature: Drag-to-Reparent

```
User drags Node B onto Node C
│
├── hooks/useDragReparent.js
│   ├── onNodeDrag(event, draggedNode)
│   │   └── Finds nearest node under cursor → sets dropTargetId
│   │       └── D3StyleNode shows blue glow ring (isDropTarget)
│   │
│   └── onNodeDragStop(event, draggedNode)
│       ├── If dropTargetId exists AND is not self AND is not descendant:
│       │   ├── nodeApi.updateNode(draggedNode.id, { parentId: dropTargetId })
│       │   └── setBackendNodes(prev => prev.map(...update parentId...))
│       └── D3 recalculates layout → canvas re-renders
```

---

## 2.9 Prerequisites & Learning Resources

### What should I learn before building a project like AxonFlow?

```
Tier 1: FOUNDATIONS (Must Know)
├── HTML / CSS / JavaScript (ES6+)
│   ├── Arrow functions, destructuring, async/await, modules
│   └── Resource: MDN Web Docs, javascript.info
│
├── React Fundamentals
│   ├── Components, props, state, useEffect, useState
│   ├── Context API, custom hooks
│   └── Resource: react.dev (official docs), Full Stack Open
│
├── Node.js + Express
│   ├── HTTP methods, middleware, routing, error handling
│   └── Resource: Node.js docs, Express docs
│
└── MongoDB + Mongoose
    ├── Documents, collections, CRUD, schemas, references
    └── Resource: MongoDB University (free), Mongoose docs

Tier 2: INTERMEDIATE (Project-Specific)
├── React Router DOM
│   ├── Routes, params, navigation, protected routes
│   └── Resource: reactrouter.com
│
├── Axios & REST API design
│   ├── Interceptors, error handling, API module pattern
│   └── Resource: Axios docs
│
├── Tailwind CSS
│   ├── Utility classes, responsive design, custom themes
│   └── Resource: tailwindcss.com
│
└── Git & GitHub
    ├── Branching, commits, .gitignore
    └── Resource: Pro Git book (free)

Tier 3: ADVANCED (AxonFlow-Specific)
├── React Flow (@xyflow/react)
│   ├── Custom nodes, edges, event handlers
│   └── Resource: reactflow.dev
│
├── D3.js (d3-hierarchy)
│   ├── Stratify, tree layout, separation functions
│   └── Resource: d3js.org, Observable notebooks
│
├── Python + FastAPI
│   ├── Async endpoints, Pydantic models, StreamingResponse
│   └── Resource: fastapi.tiangolo.com
│
├── LangChain + Ollama
│   ├── ChatModels, prompt templates, chains, streaming
│   └── Resource: python.langchain.com, ollama.com
│
└── Server-Sent Events (SSE)
    ├── EventSource API, streaming HTTP responses
    └── Resource: MDN EventSource docs
```

### Recommended Learning Path (6-8 weeks):

| Week | Topic | Build |
|------|-------|-------|
| 1 | HTML, CSS, JS fundamentals | Static portfolio page |
| 2 | React basics (components, state, props) | Todo app with CRUD |
| 3 | React Router + Context API | Multi-page app with auth |
| 4 | Node.js + Express + MongoDB | REST API with Mongoose |
| 5 | Connect frontend to backend (Axios) | Full-stack CRUD app |
| 6 | React Flow + D3 basics | Simple interactive graph |
| 7 | Python FastAPI + LangChain | AI-powered API endpoint |
| 8 | Integration + polish | Mini AxonFlow clone |

### Key npm/pip Packages to Know:

**Frontend:**
```bash
npm install react react-dom react-router-dom    # Core React
npm install @xyflow/react                        # Canvas engine
npm install d3-hierarchy                         # Layout algorithms
npm install axios                                # HTTP client
npm install lucide-react                         # Icons
npm install framer-motion                        # Animations
npm install tailwindcss @tailwindcss/vite        # Styling
```

**Backend:**
```bash
npm install express mongoose cors dotenv multer  # Core server stack
npm install nodemon --save-dev                   # Auto-restart on changes
```

**AI Engine:**
```bash
pip install fastapi uvicorn pydantic             # Web framework
pip install langchain langchain-ollama langchain-core  # LLM orchestration
pip install httpx requests beautifulsoup4        # HTTP + scraping
```

---

## Bonus: Quick Interview Cheat Sheet

| Question Pattern | Key Answer Points |
|-----------------|-------------------|
| "Why this tech?" | Compare 3 alternatives, state tradeoffs |
| "How does X work?" | Explain the data flow from UI → API → DB → response |
| "What if it fails?" | Describe error handling: try/catch, fallback, user feedback |
| "How would you scale?" | Load balancer, replica sets, caching, CDN, queue |
| "What's the hardest part?" | D3 layout with variable text sizes (custom `separation()` function) |
| "What would you improve?" | TypeScript, WebSocket for collaboration, test coverage |
| "Security concerns?" | userId filter on every query, input validation, CORS configuration |
| "Performance?" | useMemo, useCallback, bulkWrite, optimistic updates |

---

## 📜 License

This FAQ document is part of the [AxonFlow](../README.md) project, licensed under the [MIT License](../LICENSE).
```

That's the complete `FAQ.md` — drop it into your AxonFlow project root or a `docs/` folder. It covers **20+ non-technical/HR/scenario questions** and **20+ technical deep-dives** with actual code from your project, feature-to-file mappings, prerequisite learning paths, and a quick interview cheat sheet.