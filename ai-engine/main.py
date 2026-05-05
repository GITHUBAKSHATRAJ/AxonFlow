from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models import NodeGenRequest, AutoMapRequest
from services import read_permissions, write_permissions, fetch_ollama_models
from agent import (
    run_mindmap_agent, run_full_map_agent,
    stream_mindmap_agent, stream_full_map_agent
)
import json

app = FastAPI(title="Mind Map AI Engine 🧠")

# ── FIX: Do NOT use allow_credentials=True with allow_origins=["*"] ──────
# That combination is rejected by browsers (CORS spec violation).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Non-streaming (kept for compatibility) ─────────────────────────────
@app.post("/api/ai/generate-nodes")
def generate_mindmap_nodes(request: NodeGenRequest):
    result = run_mindmap_agent(request.prompt, request.parent_node_id, request.model)
    return {"status": "success", "data": result}


@app.post("/api/ai/auto-map")
def generate_auto_map(request: AutoMapRequest):
    result = run_full_map_agent(request.topic, request.model)
    return {"status": "success", "data": result}


# ── STREAMING: token-by-token (SSE) ───────────────────────────────────

@app.post("/api/ai/stream-nodes")
def stream_nodes(request: NodeGenRequest):
    """Streams thinking tokens then a final parsed result as SSE."""
    def generate():
        try:
            for event in stream_mindmap_agent(
                request.prompt, request.parent_node_id, request.model
            ):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/api/ai/stream-automap")
def stream_automap(request: AutoMapRequest):
    """Streams thinking tokens then a final parsed tree as SSE."""
    def generate():
        try:
            for event in stream_full_map_agent(request.topic, request.model):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Permissions API ────────────────────────────────────────────────────

@app.get("/api/ai/permissions")
def get_permissions():
    return read_permissions()


@app.post("/api/ai/permissions")
def save_permissions(payload: dict):
    write_permissions(payload)
    return {"status": "saved"}


# ── Models list ────────────────────────────────────────────────────────

@app.get("/api/ai/models")
async def get_models():
    return await fetch_ollama_models()


@app.get("/")
def read_root():
    return {"message": "AI Mind Map Engine is running! 🚀🧠"}