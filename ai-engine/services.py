import json
import os
import httpx
from tools.web_scraper import search_web, scrape_website
from tools.file_reader import list_uploaded_files, read_file_content

PERMISSIONS_PATH = os.path.join(os.path.dirname(__file__), "permissions.json")

def read_permissions():
    """Reads allowed tools from JSON."""
    try:
        with open(PERMISSIONS_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"allowed_tools": {"web_search": False, "file_read": False}}

def write_permissions(payload: dict):
    """Writes allowed tools flags to JSON."""
    with open(PERMISSIONS_PATH, "w") as f:
        json.dump(payload, f, indent=2)

def get_allowed_tools():
    """Returns actual python tool functions mapping to user's permissions."""
    perms = read_permissions()
    active_tools = []
    if perms.get("allowed_tools", {}).get("web_search", False):
        active_tools.extend([search_web, scrape_website])
    if perms.get("allowed_tools", {}).get("file_read", False):
        active_tools.extend([list_uploaded_files, read_file_content])
    return active_tools

async def fetch_ollama_models():
    """Fetches list of available Ollama models."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("http://localhost:11434/api/tags")
            data = response.json()
            models = [m["name"] for m in data.get("models", [])]
            return {"status": "success", "models": models if models else ["llama3"]}
    except Exception as e:
        print(f"⚠️ Could not fetch Ollama models: {e}")
        return {"status": "fallback", "models": ["llama3", "llama3.1", "mistral", "codellama", "gemma3:4b"]}
