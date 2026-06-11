// AI Engine usually runs on a different port (8001)
const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8001';

/**
 * [NAMED FUNCTION]
 * Fetch the lists of AI LLM models supported by the Ollama/AI endpoint.
 * 
 * Concept: uses the modern 'fetch' API to make an HTTP GET request, 
 * resolving the response as JSON. It falls back to default models if the server is offline.
 */
export async function fetchAvailableModels() {
    try {
        const res = await fetch(`${AI_ENGINE_URL}/api/ai/models`);
        const data = await res.json();
        return data.models || ['llama3'];
    } catch {
        // Fallback models array in case of local offline testing
        return ['llama3', 'llama3.1', 'mistral', 'gemma'];
    }
}

/**
 * [NAMED FUNCTION]
 * Connects to a streaming server endpoint (Server-Sent Events / SSE style chunk stream).
 * 
 * Concept: Reads raw streaming byte arrays chunk-by-chunk using a stream reader,
 * decodes the binary array to strings, parses lines beginning with 'data: ', and fires callbacks.
 */
export async function getAIStream(endpoint, payload, onToken, onResult, onError) {
    try {
        const response = await fetch(`${AI_ENGINE_URL}/api/ai/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Get readable stream reader interface
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Decode raw chunk buffer
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Hold remaining incomplete lines in buffer

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
}

/**
 * [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
 * Wrapper to request an AI node subtree generation stream.
 */
export const streamAINodes = (prompt, parentNodeId, model, onToken, onResult, onError) => 
    getAIStream('stream-nodes', { prompt, parent_node_id: parentNodeId, model }, onToken, onResult, onError);

/**
 * [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
 * Wrapper to request a full AI mind map structure generation stream.
 */
export const streamAutoMap = (topic, model, onToken, onResult, onError) => 
    getAIStream('stream-automap', { topic, model }, onToken, onResult, onError);
