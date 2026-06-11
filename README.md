# AxonFlow 🧠⚡

> **AI-Powered Autonomous Mind-Mapping Engine** — Transform messy ideas into structured knowledge graphs at the speed of thought.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7+-green.svg)](https://www.mongodb.com/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Data Flow](#-data-flow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [System Design](#-system-design)
- [Use Case Diagram](#-use-case-diagram)
- [UML Class Diagram](#-uml-class-diagram)
- [Frontend Component Architecture](#-frontend-component-architecture)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌟 Overview

**AxonFlow** is a next-generation, full-stack mind-mapping platform that combines an interactive canvas editor with AI-powered node generation. It enables users to visually brainstorm, plan projects, and explore logical flows — powered by local LLMs (via Ollama) for intelligent subtopic generation and complete mind map auto-creation.

The project uses a **monorepo architecture** with three independently deployable services:

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **Frontend** | React 19 + Vite | `5173` | Interactive canvas UI with React Flow |
| **Backend** | Node.js + Express 5 | `5000` | REST API, data persistence, file uploads |
| **AI Engine** | Python + FastAPI | `8001` | LLM-powered node generation via Ollama |

---

## ✨ Key Features

### 🗺️ Mind Map Canvas
- **Interactive React Flow canvas** with drag-and-drop node manipulation
- **Three layout modes**: Horizontal (D3 column-based), Vertical (top-down tree), Radial (polar coordinates)
- **Four color palettes**: Mono, Vibrant, Pastel, Neon — applied per branch hierarchy
- **Keyboard shortcuts**: `Tab` (add child), `Enter` (add sibling), `F2` (rename), `Del` (delete)
- **Drag-to-reparent**: Drag a node onto another to change its parent relationship
- **D3-powered auto-layout**: Uses `d3-hierarchy` with custom column-width calculations

### 🤖 AI-Powered Generation
- **Sub-topic generation**: Select any node → ask AI to generate 4–6 child ideas
- **Full auto-map creation**: Provide a topic → AI generates a complete hierarchical mind map
- **Real-time streaming (SSE)**: Token-by-token AI responses streamed to the UI
- **Multi-model support**: Choose from available Ollama models (LLaMA 3, Mistral, Gemma, etc.)
- **Tool-augmented agents**: Optional web search and file reading capabilities via LangChain

### 📂 Organization & Management
- **Workspaces**: Top-level categories to group related maps
- **Nested folders**: Infinite folder nesting within workspaces
- **Favorites system**: Pin important maps for quick access
- **Soft-delete (Trash)**: Recoverable deletion with restore capability
- **Map duplication**: Deep-clone entire maps including all node trees
- **Bulk operations**: Multi-select maps for batch trash/favorite operations

### 📝 Rich Node Content
- **Notes**: Attach text notes to any node
- **Links**: Add titled URL references to nodes
- **File attachments**: Upload files and attach them to specific nodes
- **Status tags**: Mark nodes as Reading, Completed, Incomplete, Important, or Revise
- **Expand/Collapse**: Toggle subtree visibility for focused exploration

### 🎨 UI/UX
- **Multi-theme support**: Dark, Light, and Neon themes with CSS custom properties
- **Bulk import**: Paste indented text to auto-create nested node hierarchies
- **Global sidebar**: Persistent navigation with recursive workspace folder tree
- **Responsive design**: Tailwind CSS-powered layouts adapting to screen sizes
- **Optimistic updates**: Instant UI feedback before API confirmation

---

## 🏗 Architecture Overview

```mermaid
flowchart TB
    subgraph CLIENT["CLIENT · Browser"]
        direction TB
        subgraph Pages["Pages"]
            LP["Landing Page"]
            DP["Dashboard"]
            MM["MyMaps"]
            ED["Editor Page"]
        end
        subgraph Canvas["Canvas Engine"]
            CC["CanvasContainer\n(React Flow)"]
            GS["GlobalSidebar"]
            WV["WorkspaceView"]
        end
        subgraph Services["Services Layer · Axios + Fetch"]
            MA["mapApi.js"]
            NA["nodeApi.js"]
            FA["folderApi.js"]
            AA["aiApi.js (SSE)"]
        end
        ED --> CC
    end

    subgraph BACKEND["BACKEND · Node.js · Express 5 · Port 5000"]
        direction TB
        RT["Routes"] --> CT["Controllers"]
        CT --> SV["Services"]
        SV --> MG["Mongoose ODM"]
    end

    subgraph AI_ENGINE["AI ENGINE · Python · FastAPI · Port 8001"]
        direction TB
        EP1["/api/ai/stream-nodes"]
        EP2["/api/ai/stream-automap"]
        EP3["/api/ai/generate-nodes"]
        EP4["/api/ai/models"]
        LC["LangChain + ChatOllama"]
        EP1 & EP2 & EP3 --> LC
    end

    subgraph DATA["DATA LAYER"]
        MONGO[("MongoDB\naxonflow_db")]
        FS[("File System\n./uploads")]
    end

    subgraph INFERENCE["INFERENCE LAYER"]
        OL["Ollama Server\nPort 11434"]
        M1["llama3 / llama3.1"]
        M2["mistral"]
        M3["gemma / codellama"]
        OL --- M1 & M2 & M3
    end

    MA & NA & FA -->|"HTTP REST"| BACKEND
    AA -->|"HTTP SSE Stream"| AI_ENGINE
    MG --> MONGO
    SV --> FS
    LC --> OL

    style CLIENT fill:#1a1a2e,stroke:#6366f1,color:#e0e0ff
    style BACKEND fill:#0d1b2a,stroke:#3b82f6,color:#e0e0ff
    style AI_ENGINE fill:#1b0d2a,stroke:#a855f7,color:#e0e0ff
    style DATA fill:#0a1a0a,stroke:#22c55e,color:#e0e0ff
    style INFERENCE fill:#1a0d0d,stroke:#f97316,color:#e0e0ff
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI component framework |
| Vite | 8.x | Build tool & dev server |
| React Flow (`@xyflow/react`) | 12.x | Interactive canvas & graph rendering |
| d3-hierarchy | 3.x | Tree layout algorithms (horizontal, vertical, radial) |
| React Router DOM | 7.x | Client-side routing & navigation |
| Axios | 1.x | HTTP client for REST API calls |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Lucide React | 1.x | Icon library |
| Framer Motion | 12.x | Animation library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Server runtime |
| Express | 5.x | Web framework |
| Mongoose | 9.x | MongoDB ODM |
| Multer | 2.x | File upload middleware |
| CORS | 2.x | Cross-origin resource sharing |
| dotenv | 17.x | Environment variable management |
| Clerk SDK | 4.x | Authentication (prepared, currently mock) |

### AI Engine
| Technology | Purpose |
|-----------|---------|
| FastAPI | Async Python web framework |
| LangChain + LangChain-Ollama | LLM orchestration framework |
| Ollama | Local LLM inference server |
| Pydantic | Request/response validation |
| httpx | Async HTTP client |
| BeautifulSoup4 | Web scraping tool (agent capability) |
| DuckDuckGo-Search | Web search tool (agent capability) |

---

## 📁 Project Structure

```
AxonFlow/
├── frontend/                          # React + Vite Application
│   ├── src/
│   │   ├── main.jsx                   # App bootstrap (StrictMode, AuthProvider, BrowserRouter)
│   │   ├── App.jsx                    # Root component — sets up Axios interceptors + routes
│   │   ├── routes.jsx                 # Route definitions with ProtectedRoute wrapper
│   │   ├── index.css                  # Global styles & CSS custom properties (themes)
│   │   │
│   │   ├── context/
│   │   │   └── authContext.jsx        # Auth state (login/logout/user) via React Context API
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx        # Public hero page with login modal
│   │   │   ├── Dashboard.jsx          # Main hub: templates, AI generator, recent maps
│   │   │   ├── MyMaps.jsx             # Map listing with filter modes (all/favorites/trash/shared)
│   │   │   ├── WorkspaceView.jsx      # Workspace & folder browser with breadcrumb navigation
│   │   │   └── Editor.jsx             # Mind map editor page — loads CanvasContainer
│   │   │
│   │   ├── components/
│   │   │   ├── GlobalSidebar.jsx      # Persistent nav sidebar with recursive folder tree
│   │   │   ├── TopBar.jsx             # Editor top bar (map name, save status, actions)
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   └── LoginModal.jsx     # Demo login modal overlay
│   │   │   │
│   │   │   ├── Canvas/
│   │   │   │   ├── CanvasContainer.jsx    # ReactFlow wrapper (ErrorBoundary + Provider)
│   │   │   │   ├── D3StyleNode.jsx        # Custom node renderer (dot + text + inline editing)
│   │   │   │   ├── D3BezierEdge.jsx       # Custom bezier edge with layout-aware curves
│   │   │   │   ├── ActionToolbar.jsx      # Canvas toolbar (layout/palette/import controls)
│   │   │   │   ├── FloatingToolbar.jsx    # Right-click context menu for nodes
│   │   │   │   ├── NodeRegistry.js        # Node type registration for React Flow
│   │   │   │   └── hooks/
│   │   │   │       ├── useCanvasState.js  # D3 layout computation & React Flow state sync
│   │   │   │       ├── useCanvasActions.js # CRUD operations (create/rename/delete/copy/paste)
│   │   │   │       ├── useCanvasEvents.js # Click, keyboard & hover event handlers
│   │   │   │       └── useDragReparent.js # Drag-drop node reparenting logic
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardHeader.jsx    # Welcome greeting + search bar
│   │   │   │   ├── TemplateGrid.jsx       # Template cards (Mind Map, SWOT, Timeline, etc.)
│   │   │   │   ├── ActionCards.jsx        # Quick action cards (New Map, AI Generate)
│   │   │   │   ├── RecentMapsGrid.jsx     # Recently accessed maps grid
│   │   │   │   ├── AiGeneratorModal.jsx   # AI prompt input + model selector modal
│   │   │   │   └── ComingSoonModal.jsx    # Placeholder for upcoming templates
│   │   │   │
│   │   │   ├── Workspace/
│   │   │   │   ├── WorkspaceHeader.jsx    # Header with breadcrumbs & view mode toggle
│   │   │   │   ├── WorkspaceCard.jsx      # Workspace tile (icon + name)
│   │   │   │   ├── FolderCard.jsx         # Folder tile
│   │   │   │   └── CreateItemModal.jsx    # Generic create dialog (workspace/folder/map)
│   │   │   │
│   │   │   ├── Modals/
│   │   │   │   └── BulkImportModal.jsx    # Indented text → node tree parser modal
│   │   │   │
│   │   │   └── UI/
│   │   │       ├── MapCard.jsx            # Map card component (grid/list views, actions menu)
│   │   │       ├── ErrorBoundary.jsx      # React error boundary with fallback UI
│   │   │       └── UIComponents.jsx       # Shared reusable UI primitives
│   │   │
│   │   ├── services/api/
│   │   │   ├── client.js              # Axios instance + interceptors (auth headers)
│   │   │   ├── mapApi.js              # Map CRUD API (list, create, update, duplicate, bulk)
│   │   │   ├── nodeApi.js             # Node CRUD API (list, create, update, delete, bulk)
│   │   │   ├── folderApi.js           # Folder & workspace API (CRUD, rename, delete)
│   │   │   ├── aiApi.js               # AI engine API (models, SSE streaming)
│   │   │   └── index.js               # Barrel export
│   │   │
│   │   └── utils/
│   │       └── flowUtils.js           # D3 layout builder, color palettes, text parser
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # Node.js Express Server
│   ├── src/
│   │   ├── index.js                   # Entry point — MongoDB connect + server start
│   │   ├── app.js                     # Express app config (CORS, JSON, auth middleware, routes)
│   │   │
│   │   ├── models/
│   │   │   ├── Map.js                 # Mongoose schema — map metadata (name, workspace, folder, tags)
│   │   │   ├── Node.js               # Mongoose schema — node content (name, notes, links, files, position)
│   │   │   ├── Folder.js             # Mongoose schema — folder hierarchy (name, workspace, parentId)
│   │   │   └── schema.md             # Schema documentation
│   │   │
│   │   ├── controllers/
│   │   │   ├── mapController.js       # Map request handlers
│   │   │   ├── nodeController.js      # Node request handlers
│   │   │   ├── folderController.js    # Folder & workspace request handlers
│   │   │   └── fileController.js      # File upload/download handlers
│   │   │
│   │   ├── services/
│   │   │   ├── mapService.js          # Map business logic (CRUD, duplicate with recursive node copy)
│   │   │   ├── nodeService.js         # Node business logic (CRUD, recursive delete, bulkWrite)
│   │   │   ├── folderService.js       # Folder business logic (CRUD, recursive delete, workspace ops)
│   │   │   └── fileStorageService.js  # Multer disk storage configuration
│   │   │
│   │   └── routes/
│   │       ├── index.js               # Route aggregator (/api prefix)
│   │       ├── mapRoutes.js           # Map route definitions
│   │       ├── nodeRoutes.js          # Node route definitions
│   │       ├── folderRoutes.js        # Folder & workspace route definitions
│   │       └── fileRoutes.js          # File upload/download route definitions
│   │
│   ├── uploads/                       # File upload storage directory
│   ├── .env.example
│   └── package.json
│
├── ai-engine/                         # Python FastAPI AI Service
│   ├── main.py                        # FastAPI app — endpoints (streaming SSE + REST)
│   ├── agent.py                       # LangChain agent logic (streaming + non-streaming)
│   ├── models.py                      # Pydantic request models (NodeGenRequest, AutoMapRequest)
│   ├── services.py                    # Permissions, Ollama model fetching, tool resolution
│   ├── utils.py                       # JSON extraction from LLM responses
│   ├── permissions.json               # Tool permission flags (web_search, file_read)
│   └── requirements.txt              # Python dependencies
│
├── docs/                              # Additional documentation
├── scripts/                           # Utility scripts
├── .gitignore
├── LICENSE                            # MIT License
├── startup.md                         # Project initialization log
└── README.md                          # ← You are here
```

---

## 🗄 Database Schema

AxonFlow uses a **Structural Flat-Tree Architecture** — separating file metadata from canvas content for performance and scalability.

### Hierarchy

```
Workspace (string) → Folder (nested) → Map (metadata) → Nodes (content)
```

### Maps Collection

| Field | Type | Description |
|:------|:-----|:------------|
| `name` | String | Name of the mind map |
| `userId` | String | Owner identifier (from Clerk/auth) |
| `rootNodeId` | ObjectId → Node | Reference to the root node |
| `workspace` | String | Top-level workspace category |
| `folderId` | ObjectId → Folder | Parent folder reference |
| `template` | String | Template used during creation |
| `isFavorite` | Boolean | Pinned to favorites sidebar |
| `isTrashed` | Boolean | Soft-delete flag |
| `tags` | [String] | Custom labels for filtering |
| `lastAccessedAt` | Date | Used for "Recently Viewed" sorting |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

### Nodes Collection

| Field | Type | Description |
|:------|:-----|:------------|
| `mapId` | ObjectId → Map | Parent map reference |
| `userId` | String | Owner identifier |
| `parentId` | ObjectId → Node | Parent node (null = root) |
| `name` | String | Display text content |
| `isExpanded` | Boolean | UI subtree visibility |
| `notes` | [String] | Attached text notes |
| `links` | [{title, url}] | Attached URL references |
| `files` | [{fileName, fileUrl}] | Attached file uploads |
| `status` | String | Tag: reading/completed/incomplete/important/revise |
| `x`, `y` | Number | Canvas coordinates |

### Folders Collection

| Field | Type | Description |
|:------|:-----|:------------|
| `name` | String | Folder name |
| `workspace` | String | Parent workspace |
| `parentId` | ObjectId → Folder | Parent folder (supports infinite nesting) |
| `userId` | String | Owner identifier |

---

## 📡 API Reference

### Map Endpoints (`/api/maps`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/list` | List maps with filters (`isFavorite`, `isTrashed`, `workspace`, `folderId`) |
| `POST` | `/create` | Create map + auto-generate root node |
| `PATCH` | `/:mapId/attributes` | Update map metadata (name, favorite, trash, tags) |
| `POST` | `/:mapId/duplicate` | Deep-clone map with all nodes |
| `PATCH` | `/bulk-attributes` | Bulk update multiple maps |

### Node Endpoints (`/api/nodes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/map/:mapId` | Get all nodes for a map |
| `POST` | `/map/:mapId` | Create a child node |
| `PATCH` | `/:id` | Update node fields (name, notes, links, files, status) |
| `PATCH` | `/:id/position` | Update node x,y coordinates |
| `DELETE` | `/:id` | Recursive delete (node + all descendants) |
| `POST` | `/bulk-update` | Batch update nodes (MongoDB bulkWrite) |
| `POST` | `/bulk-create` | Batch insert multiple nodes |

### Folder & Workspace Endpoints (`/api/folders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/workspaces/list` | List unique workspace names |
| `PATCH` | `/workspaces/rename` | Rename workspace across all folders and maps |
| `DELETE` | `/workspaces/:name` | Delete workspace (cascading) |
| `GET` | `/list` | List folders (filterable by workspace, parentId) |
| `POST` | `/create` | Create folder |
| `DELETE` | `/:id` | Recursive delete folder (subfolders + trash maps) |

### File Endpoints (`/api/files`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload file (multipart form) |
| `GET` | `/:filename` | Download/serve uploaded file |

### AI Engine Endpoints (`/api/ai`) — Port 8001

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/stream-nodes` | SSE stream: generate 4–6 subtopics for a node |
| `POST` | `/stream-automap` | SSE stream: generate complete mind map tree |
| `POST` | `/generate-nodes` | Non-streaming subtopic generation |
| `POST` | `/auto-map` | Non-streaming full map generation |
| `GET` | `/models` | List available Ollama models |
| `GET` | `/permissions` | Read tool permission flags |
| `POST` | `/permissions` | Update tool permission flags |

---

## 🔄 Data Flow

### 1. Mind Map Creation Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend (Dashboard.jsx)
    participant BE as Backend (Express)
    participant DB as MongoDB (Mongoose)

    User->>FE: Click "New Map"
    FE->>BE: POST /api/maps/create {name}
    Note over BE: mapService.createMap()
    BE->>DB: 1. Create Map document (metadata)
    BE->>DB: 2. Create Root Node document (content)
    BE->>DB: 3. Link rootNodeId to Map
    DB-->>BE: Success
    BE-->>FE: Return new Map object
    FE->>FE: Navigate to /map/:id
    Note over FE: Editor.jsx mounts
    FE->>BE: GET /api/nodes/map/:mapId
    BE->>DB: Find nodes by mapId
    DB-->>BE: Return nodes list
    BE-->>FE: Return nodes array
    Note over FE: useCanvasState layout triggers
    FE->>FE: Prune collapsed nodes & run D3 tree layout
    FE->>User: Render nodes and connections on canvas
```

### 2. AI Node Generation Flow (SSE Streaming)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend (CanvasContainer)
    participant AI as AI Engine (FastAPI :8001)
    participant OL as Ollama Server (:11434)
    participant BE as Backend (Express :5000)

    User->>FE: Select Node -> Click "AI Generate"
    FE->>AI: POST /api/ai/stream-nodes {prompt, parentId, model}
    Note over AI: stream_mindmap_agent()
    AI->>OL: Connect & request stream via ChatOllama
    loop Streaming tokens
        OL-->>AI: Yield text chunk
        AI-->>FE: SSE data: {type: "token", content: "..."}
    end
    OL-->>AI: Final response
    Note over AI: extract_json(full_text)
    AI-->>FE: SSE data: {type: "result", data: {nodes}}
    Note over FE: onResult callback triggers
    FE->>BE: POST /api/nodes/bulk-create {newNodes}
    BE->>BE: Mongoose bulk insert
    BE-->>FE: Return created nodes
    Note over FE: useCanvasState: setBackendNodes()
    Note over FE: Run D3 re-layout & assign branch colors
    FE->>User: Re-render canvas with new subtopics
```

### 3. Node Interaction Flow

```mermaid
flowchart TD
    User([User Canvas Action]) --> Click[Click Node]
    User --> Tab[Press Tab Key]
    User --> Enter[Press Enter Key]
    User --> F2[Press F2 Key]
    User --> Del[Press Delete Key]
    User --> Drag[Drag Node]

    Click -->|Focus Node| ToggleShortcuts[Enable Keyboard Shortcuts]
    
    Tab -->|New Child| InlineInput1[Open Inline Input]
    InlineInput1 -->|Submit| CreateNodeAPI[nodeApi.createNode]
    
    Enter -->|New Sibling| InlineInput2[Open Inline Input]
    InlineInput2 -->|Submit| CreateNodeAPI
    
    F2 -->|Rename| InlineInput3[Open Inline Input]
    InlineInput3 -->|Submit| UpdateNodeAPI[nodeApi.updateNode]
    
    Del -->|Delete subtree| DeleteAPI[nodeApi.deleteNodeRecursive]
    
    Drag -->|Reparent node| HoverCheck{Hovering over target?}
    HoverCheck -->|Yes| DragReparent[useDragReparent]
    DragReparent -->|Drop| UpdateParentAPI[nodeApi.updateNode parentId]
    
    CreateNodeAPI & UpdateNodeAPI & DeleteAPI & UpdateParentAPI --> UpdateState[setBackendNodes]
    UpdateState --> RecalcD3[Recalculate D3 Layout]
    RecalcD3 --> ReRender[React Flow Redraws Canvas]

    classDef default fill:#0f172a,stroke:#3b82f6,stroke-width:1.5px,color:#f8fafc;
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** ≥ 7.x (running locally or Atlas URI)
- **Python** ≥ 3.10 (for AI Engine)
- **Ollama** (optional, for AI features — [install guide](https://ollama.com))

### 1. Clone the Repository

```bash
git clone https://github.com/AkshatRaj/AxonFlow.git
cd AxonFlow
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file from template
cp .env.example .env
# Edit .env with your MongoDB URI

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

### 4. AI Engine Setup (Optional)

```bash
cd ai-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Ensure Ollama is running with at least one model
ollama pull llama3

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### 5. Open the App

Navigate to `http://localhost:5173` in your browser.

---

## 🔐 Environment Variables

### Backend (`/backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | `mongodb://localhost:27017/axonflow_db` | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | — | Clerk auth public key (future) |
| `CLERK_SECRET_KEY` | — | Clerk auth secret key (future) |
| `UPLOAD_PATH` | `./uploads` | File upload directory |

### Frontend (`/frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `VITE_AI_ENGINE_URL` | `http://localhost:8001` | AI Engine base URL |

---

## 🏛 System Design

### High-Level Design (HLD)

```mermaid
flowchart TB
    subgraph PL ["PRESENTATION LAYER (Client)"]
        direction LR
        ReactApp["React SPA (Vite)<br>• React Flow (Canvas)<br>• D3-Hierarchy (Layout)<br>• React Context (Auth State)"]
    end

    subgraph AL ["APPLICATION LAYER (Server)"]
        direction LR
        ExpressServer["Express.js Server<br>• Auth Middleware<br>• Service Layer Pattern<br>• Multer (File Upload)"]
    end

    subgraph IL ["INTELLIGENCE LAYER (AI)"]
        direction LR
        FastAPIServer["FastAPI AI Engine<br>• LangChain Agent<br>• SSE Streaming Client<br>• Web Search & File Tools"]
    end

    subgraph DL ["DATA LAYER"]
        direction LR
        MongoDB[("MongoDB Database<br>• Maps, Nodes, Folders")]
        FS[("File System<br>• File Uploads")]
    end

    subgraph INF ["INFERENCE LAYER"]
        direction LR
        Ollama[("Ollama Server<br>• LLaMA 3 / 3.1 / Mistral / Gemma")]
    end

    %% Communication protocols
    ReactApp -->|"REST API (JSON / Multipart)"| ExpressServer
    ReactApp -->|"SSE Stream (HTTP)"| FastAPIServer
    ExpressServer -->|"Mongoose ODM"| MongoDB
    ExpressServer -->|"Disk Write"| FS
    FastAPIServer -->|"LangChain / Ollama SDK"| Ollama
    
    %% Styling
    style PL fill:#111827,stroke:#3b82f6,stroke-width:2px,color:#fff
    style AL fill:#111827,stroke:#10b981,stroke-width:2px,color:#fff
    style IL fill:#111827,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style DL fill:#111827,stroke:#f59e0b,stroke-width:2px,color:#fff
    style INF fill:#111827,stroke:#ef4444,stroke-width:2px,color:#fff
```

### Low-Level Design (LLD)

#### Backend Service Layer Pattern

```mermaid
flowchart TD
    Req([HTTP Request]) --> Route["Route (mapRoutes.js)"]
    Route -->|URL Matching & Method Binding| Ctrl["Controller (mapController.js)"]
    Ctrl -->|Request Parsing & Auth Verification| Service["Service (mapService.js)"]
    Service -->|Business Logic & Transaction Management| Model["Model (Map.js)"]
    Model -->|Mongoose DB Operations| DB[(MongoDB)]

    classDef default fill:#0f172a,stroke:#10b981,stroke-width:1.5px,color:#e2e8f0;
```

#### Frontend State Management Pattern

```mermaid
flowchart TD
    UI([User Interaction]) --> Page["Editor.jsx (Container Page)"]
    Page -->|State: backendNodes| Hook1["useCanvasState.js"]
    Page -->|Action Triggers| Hook2["useCanvasActions.js"]
    
    Hook1 -->|1. filterExpandedNodes| Prune["Prune Collapsed Subtrees"]
    Prune -->|2. d3.stratify| Hierarchy["Flat List ➔ Hierarchical Tree"]
    Hierarchy -->|3. d3.tree| Layout["Compute Node X/Y Coordinates"]
    Layout -->|4. buildColorMap| Color["Assign Harmonic Branch Colors"]
    Color -->|5. Update Viewport| RFNodes["React Flow Nodes & Edges"]
    
    Hook2 -->|API Calls| API["nodeApi.js / mapApi.js"]
    API -->|HTTP REST Request| BE[Backend Server]
    BE -->|Update DB| Hook2

    classDef default fill:#0f172a,stroke:#3b82f6,stroke-width:1.5px,color:#e2e8f0;
```

#### AI Agent Architecture

```mermaid
flowchart TD
    Req([Request: prompt, model]) --> PromptTemplate["ChatPromptTemplate"]
    PromptTemplate -->|"System & User Messages"| Ollama["ChatOllama (LangChain)"]
    Ollama -->|Optional Tools| ToolCheck{Tools enabled?}
    ToolCheck -->|Yes| Tools["Web Search / File Reader"]
    Tools --> Ollama
    Ollama -->|Streamed Output| Stream["chain.stream() yields tokens"]
    Stream --> SSE["SSE Client Streams to UI"]
    
    Stream -->|Complete Output| Extract["extract_json(full_text)"]
    Extract --> ParseCheck{JSON valid?}
    ParseCheck -->|Yes| Out[Structured Node List]
    ParseCheck -->|No| RegexFallback["Regex match [...] or {...}"]
    RegexFallback --> SplitFallback["Split by newlines / list markers"]
    SplitFallback --> Out

    classDef default fill:#0f172a,stroke:#8b5cf6,stroke-width:1.5px,color:#e2e8f0;
```

---

## 🧩 Use Case Diagram

```mermaid
flowchart LR
    User(((User)))
    
    subgraph Boundary ["AxonFlow System Boundary"]
        subgraph Group1 ["Workspace & File Management"]
            UC1(["Create & Organize Workspaces/Folders"])
            UC2(["Manage Mind Maps (Duplicate, Trash, Favorite)"])
        end
        
        subgraph Group2 ["Canvas Interactions"]
            UC3(["Edit Nodes (Add, Rename, Delete)"])
            UC4(["Reparent Nodes via Drag & Drop"])
            UC5(["Customize Canvas (Layouts, Colors)"])
            UC6(["Attach Content (Notes, Links, Files)"])
            UC7(["Bulk Import Indented Text"])
        end
        
        subgraph Group3 ["AI Capabilities"]
            UC8(["Select Ollama LLM Model"])
            UC9(["Stream Node Subtopics via SSE"])
            UC10(["Auto-generate Complete Mind Maps"])
        end
    end
    
    AIEngine(((AI Engine)))

    %% User Connections
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10

    %% AI Connections
    UC9 --> AIEngine
    UC10 --> AIEngine

    %% Styling
    classDef actor fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef usecase fill:#0f172a,stroke:#06b6d4,stroke-width:1.5px,color:#e2e8f0;
    classDef system fill:#090d16,stroke:#3b82f6,stroke-dasharray: 5 5,color:#fff;
    
    class User,AIEngine actor;
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10 usecase;
    style Boundary fill:#070a13,stroke:#1e293b,stroke-width:2px;
```

---

## 📊 UML Class Diagram

```mermaid
classDiagram
    class Map {
        +ObjectId _id
        +String name
        +String userId
        +ObjectId rootNodeId
        +String workspace
        +ObjectId folderId
        +String template
        +Boolean isFavorite
        +Boolean isTrashed
        +String[] tags
        +Date lastAccessedAt
        +Date createdAt
        +Date updatedAt
        +toJSON() Object
    }

    class Node {
        +ObjectId _id
        +ObjectId mapId
        +String userId
        +ObjectId parentId
        +String name
        +Boolean isExpanded
        +String[] notes
        +LinkSchema[] links
        +FileSchema[] files
        +String status
        +Number x
        +Number y
        +Date createdAt
        +Date updatedAt
        +toJSON() Object
    }

    class Folder {
        +ObjectId _id
        +String name
        +String workspace
        +ObjectId parentId
        +String userId
        +Date createdAt
        +Date updatedAt
        +toJSON() Object
    }

    class LinkSchema {
        +String title
        +String url
    }

    class FileSchema {
        +String fileName
        +String fileUrl
    }

    class MapService {
        +listMaps()
        +createMap()
        +updateMap()
        +duplicateMap()
        +bulkUpdateMaps()
    }

    class NodeService {
        +getNodesByMap()
        +createNode()
        +updateNode()
        +updatePosition()
        +deleteNodeRecursive()
        +bulkUpdateNodes()
        +bulkCreateNodes()
        +toggleExpansion()
    }

    class FolderService {
        +getWorkspaces()
        +renameWorkspace()
        +deleteWorkspace()
        +getFolders()
        +createFolder()
        +deleteFolderRec()
    }

    class NodeGenRequest {
        +String prompt
        +String parent_node_id
        +String model
    }

    class AutoMapRequest {
        +String topic
        +String model
    }

    Map "1" *-- "1" Node : has rootNode
    Map "1" *-- "*" Node : belongs to map
    Folder "1" *-- "*" Map : contains
    Folder "0..1" <-- "1" Folder : parentId (nested folders)
    Node "0..1" <-- "1" Node : parentId (tree hierarchy)
    Node "1" *-- "*" LinkSchema : has links
    Node "1" *-- "*" FileSchema : has files
```

---

## 🧩 Frontend Component Architecture
```mermaid
flowchart TD
    StrictMode["&lt;StrictMode&gt;"] --> AuthProvider["&lt;AuthProvider&gt;<br>(Context: user, auth status)"]
    AuthProvider --> BrowserRouter["&lt;BrowserRouter&gt;"]
    BrowserRouter --> App["&lt;App&gt;<br>(Axios setup + Routing)"]
    App --> AppRoutes["&lt;AppRoutes&gt;"]

    subgraph PublicRoutes ["Public Routes"]
        AppRoutes --> LandingPage["&lt;LandingPage&gt;"]
        LandingPage --> LoginModal["&lt;LoginModal&gt;"]
    end

    subgraph ProtectedRoutes ["Protected Dashboard & Folders"]
        AppRoutes --> ProtectedRoute["&lt;ProtectedRoute&gt;"]
        ProtectedRoute --> GlobalSidebar["&lt;GlobalSidebar&gt;<br>(Recursive Folder Tree)"]
        
        ProtectedRoute --> Dashboard["&lt;Dashboard&gt;"]
        Dashboard --> DashboardHeader["&lt;DashboardHeader&gt;"]
        Dashboard --> TemplateGrid["&lt;TemplateGrid&gt;"]
        Dashboard --> ActionCards["&lt;ActionCards&gt;"]
        Dashboard --> RecentMapsGrid["&lt;RecentMapsGrid&gt;"]
        Dashboard --> AiGeneratorModal["&lt;AiGeneratorModal&gt;"]
        Dashboard --> ComingSoonModal["&lt;ComingSoonModal&gt;"]
        RecentMapsGrid --> MapCard1["&lt;MapCard&gt; (xN)"]
        
        ProtectedRoute --> MyMaps["&lt;MyMaps&gt;"]
        MyMaps --> MapCard2["&lt;MapCard&gt; (xN)"]

        ProtectedRoute --> WorkspaceView["&lt;WorkspaceView&gt;"]
        WorkspaceView --> WorkspaceHeader["&lt;WorkspaceHeader&gt;"]
        WorkspaceView --> WorkspaceCard["&lt;WorkspaceCard&gt;"]
        WorkspaceView --> FolderCard["&lt;FolderCard&gt;"]
        WorkspaceView --> CreateItemModal["&lt;CreateItemModal&gt;"]
    end

    subgraph EditorRoute ["Interactive Mind Map Editor"]
        AppRoutes --> Editor["&lt;Editor&gt;"]
        Editor --> TopBar["&lt;TopBar&gt;"]
        Editor --> CanvasContainer["&lt;CanvasContainer&gt;<br>(ErrorBoundary + Provider)"]
        CanvasContainer --> ReactFlowProvider["&lt;ReactFlowProvider&gt;"]
        ReactFlowProvider --> MindMapInner["&lt;MindMapInner&gt;<br>(React Flow Canvas)"]
        
        MindMapInner --> ReactFlow["&lt;ReactFlow&gt;"]
        ReactFlow --> D3StyleNode["&lt;D3StyleNode&gt;<br>(Custom node renderer)"]
        ReactFlow --> D3BezierEdge["&lt;D3BezierEdge&gt;<br>(Layout-aware curves)"]
        ReactFlow --> RFControls["&lt;Controls&gt; / &lt;Background&gt;"]
        
        MindMapInner --> ActionToolbar["&lt;ActionToolbar&gt;"]
        MindMapInner --> FloatingToolbar["&lt;FloatingToolbar&gt;"]
        MindMapInner --> BulkImportModal["&lt;BulkImportModal&gt;"]
    end

    style StrictMode fill:#0f172a,stroke:#3b82f6,color:#fff
    style AuthProvider fill:#0f172a,stroke:#3b82f6,color:#fff
    style PublicRoutes fill:#020617,stroke:#ef4444,stroke-dasharray: 5 5,color:#fff
    style ProtectedRoutes fill:#020617,stroke:#10b981,stroke-dasharray: 5 5,color:#fff
    style EditorRoute fill:#020617,stroke:#8b5cf6,stroke-dasharray: 5 5,color:#fff
```

---

## 🗺 Roadmap

- [x] Core mind-mapping canvas with React Flow
- [x] D3-powered layout engine (horizontal, vertical, radial)
- [x] Backend REST API with full CRUD
- [x] AI node generation with Ollama/LangChain
- [x] SSE streaming for real-time AI responses
- [x] Workspace & folder organization system
- [x] File attachments & notes per node
- [x] Multi-theme support (dark, light, neon)
- [x] Bulk import from indented text
- [x] Map duplication with recursive node cloning
- [ ] Clerk authentication integration (prepared, not active)
- [ ] Real-time collaboration (WebSocket/CRDT)
- [ ] Export to PDF / PNG / Markdown
- [ ] Node-level deadlines & Gantt view
- [ ] Template marketplace
- [ ] Mobile-responsive canvas
- [ ] Shared maps & permission system
- [ ] Version history & undo/redo

---

## 👤 Author

**Akshat Raj** — [GitHub](https://github.com/AkshatRaj)

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).