// AI Engine usually runs on a different port (8001)
const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8001';

export const fetchAvailableModels = async () => {
    try {
        const res = await fetch(`${AI_ENGINE_URL}/api/ai/models`);
        const data = await res.json();
        return data.models || ['llama3'];
    } catch {
        return ['llama3', 'llama3.1', 'mistral', 'gemma'];
    }
};

export const getAIStream = async (endpoint, payload, onToken, onResult, onError) => {
    try {
        const response = await fetch(`${AI_ENGINE_URL}/api/ai/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const event = JSON.parse(line.slice(6));
                        if (event.type === 'token') onToken(event.content);
                        if (event.type === 'result') onResult(event.data);
                        if (event.type === 'error') onError(event.content);
                    } catch (_) { }
                }
            }
        }
    } catch (err) {
        onError(err.message || 'AI Engine Network error');
    }
};

export const streamAINodes = (prompt, parentNodeId, model, onToken, onResult, onError) => 
    getAIStream('stream-nodes', { prompt, parent_node_id: parentNodeId, model }, onToken, onResult, onError);

export const streamAutoMap = (topic, model, onToken, onResult, onError) => 
    getAIStream('stream-automap', { topic, model }, onToken, onResult, onError);
