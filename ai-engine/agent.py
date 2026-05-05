from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from services import get_allowed_tools
from utils import extract_json

# ── Non-streaming versions ─────────────────────────────────────────────

def run_mindmap_agent(user_prompt: str, parent_id: str, model: str = "llama3"):
    print(f"🚀 Generating nodes for: '{user_prompt}' | Model: {model}")
    llm = ChatOllama(model=model, temperature=0.2)
    tools = get_allowed_tools()
    if tools:
        llm = llm.bind_tools(tools)
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Mind Map Architect.
Output ONLY a valid JSON array of 4-6 concise sub-topic strings. No markdown, no explanations.
CORRECT: ["Sub-topic 1", "Sub-topic 2", "Sub-topic 3", "Sub-topic 4"]"""),
        ("human", "Generate 4-6 sub-topics for: {prompt}")
    ])
    response = (prompt_template | llm).invoke({"prompt": user_prompt})
    raw = response.content.strip()
    try:
        nodes = extract_json(raw)
        if isinstance(nodes, list):
            nodes = [str(n).strip() for n in nodes if str(n).strip()]
        else:
            nodes = [str(nodes)]
    except Exception:
        nodes = [l.strip() for l in raw.split('\n') if l.strip()]
    return {"parent_id": parent_id, "nodes": nodes}


def run_full_map_agent(topic: str, model: str = "llama3"):
    print(f"🗺️ Full auto-map for: '{topic}' | Model: {model}")
    llm = ChatOllama(model=model, temperature=0.3)
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are a Mind Map expert. Output ONLY a valid JSON object, no markdown.
Structure:
{{"name": "Topic", "children": [{{"name": "Branch", "children": ["Leaf1", "Leaf2"]}}]}}
Generate 4-5 branches, each with 3-5 leaf strings."""),
        ("human", "Create a complete mind map for: {topic}")
    ])
    response = (prompt_template | llm).invoke({"topic": topic})
    raw = response.content.strip()
    try:
        tree = extract_json(raw)
        if isinstance(tree, dict) and "name" in tree:
            return {"tree": tree}
        nodes = tree if isinstance(tree, list) else [str(tree)]
        return {"tree": {"name": topic, "children": [{"name": n, "children": []} for n in nodes]}}
    except Exception:
        return {"tree": {"name": topic, "children": [
            {"name": "Overview",     "children": ["Introduction", "Key Concepts", "History"]},
            {"name": "Core Ideas",   "children": ["Concept 1", "Concept 2", "Concept 3"]},
            {"name": "Applications", "children": ["Use Case 1", "Use Case 2", "Use Case 3"]},
            {"name": "Challenges",   "children": ["Challenge 1", "Challenge 2"]},
            {"name": "Future",       "children": ["Trend 1", "Trend 2"]},
        ]}}


# ── Streaming versions (yield SSE-compatible dicts) ────────────────────

def stream_mindmap_agent(user_prompt: str, parent_id: str, model: str = "llama3"):
    """Generator that yields SSE event dicts: tokens then final result."""
    print(f"🌊 Streaming nodes for: '{user_prompt}' | Model: {model}")
    llm = ChatOllama(model=model, temperature=0.2)

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Mind Map Architect.
First think through the topic briefly, then output a JSON array of 4-6 sub-topics.
Format your final answer as a JSON array: ["Sub-topic 1", "Sub-topic 2", ...]"""),
        ("human", "Generate 4-6 sub-topics for this mind map node: {prompt}")
    ])

    chain = prompt_template | llm
    full_text = ""

    for chunk in chain.stream({"prompt": user_prompt}):
        if chunk.content:
            full_text += chunk.content
            yield {"type": "token", "content": chunk.content}

    # Parse result from accumulated text
    try:
        nodes = extract_json(full_text)
        if isinstance(nodes, list):
            nodes = [str(n).strip() for n in nodes if str(n).strip()]
        else:
            nodes = [str(nodes)]
    except Exception:
        nodes = [l.strip() for l in full_text.split('\n') if l.strip()]
        nodes = [n for n in nodes if n and not n.startswith('{') and not n.startswith('[')]

    yield {"type": "result", "data": {"parent_id": parent_id, "nodes": nodes[:8]}}
    yield {"type": "done"}


def stream_full_map_agent(topic: str, model: str = "llama3"):
    """Generator that yields SSE event dicts: tokens then final tree."""
    print(f"🌊 Streaming full map for: '{topic}' | Model: {model}")
    llm = ChatOllama(model=model, temperature=0.3)

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are a Mind Map expert.
Think through the topic, then output a complete JSON mind map object.
Structure: {{"name": "Topic", "children": [{{"name": "Branch", "children": ["Leaf1", "Leaf2"]}}]}}
Generate 4-5 branches with 3-5 leaves each. Output the JSON after thinking."""),
        ("human", "Create a complete mind map for: {topic}")
    ])

    chain = prompt_template | llm
    full_text = ""

    for chunk in chain.stream({"topic": topic}):
        if chunk.content:
            full_text += chunk.content
            yield {"type": "token", "content": chunk.content}

    # Parse final result
    try:
        tree = extract_json(full_text)
        if isinstance(tree, dict) and "name" in tree:
            pass
        else:
            nodes = tree if isinstance(tree, list) else [str(tree)]
            tree = {"name": topic, "children": [{"name": n, "children": []} for n in nodes]}
    except Exception:
        tree = {"name": topic, "children": [
            {"name": "Overview",     "children": ["Introduction", "Key Concepts", "History"]},
            {"name": "Core Ideas",   "children": ["Concept 1", "Concept 2", "Concept 3"]},
            {"name": "Applications", "children": ["Use Case 1", "Use Case 2", "Use Case 3"]},
            {"name": "Challenges",   "children": ["Challenge 1", "Challenge 2"]},
            {"name": "Future",       "children": ["Trend 1", "Trend 2"]},
        ]}

    yield {"type": "result", "data": {"tree": tree}}
    yield {"type": "done"}