from pydantic import BaseModel
from typing import Optional

class NodeGenRequest(BaseModel):
    prompt: str
    parent_node_id: str
    model: Optional[str] = "llama3"

class AutoMapRequest(BaseModel):
    topic: str
    model: Optional[str] = "llama3"
