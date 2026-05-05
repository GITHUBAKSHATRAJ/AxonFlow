import json
import re

def extract_json(text: str):
    """Robustly extract JSON from LLM response."""
    text = re.sub(r'```(?:json)?\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    array_match = re.search(r'\[[\s\S]*?\]', text)
    if array_match:
        try:
            return json.loads(array_match.group())
        except json.JSONDecodeError:
            pass
    obj_match = re.search(r'\{[\s\S]*\}', text)
    if obj_match:
        try:
            return json.loads(obj_match.group())
        except json.JSONDecodeError:
            pass
    lines = [l.strip().strip('"\',-•*').strip() for l in text.split('\n') if l.strip()]
    lines = [l for l in lines if l]
    if lines:
        return lines
    raise ValueError(f"Could not parse JSON from: {text[:300]}")
