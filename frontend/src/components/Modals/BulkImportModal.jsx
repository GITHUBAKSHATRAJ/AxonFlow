import React, { useState } from 'react';
import { X, Upload, Info, AlertCircle } from 'lucide-react';

const BulkImportModal = ({ onClose, onImport }) => {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const parseIndentedText = (inputText) => {
        const lines = inputText.split('\n').filter(line => line.trim() !== '');
        const nodes = [];
        const stack = [];

        lines.forEach((line, index) => {
            // Count leading spaces or tabs
            const indentMatch = line.match(/^(\s*)/);
            const indent = indentMatch ? indentMatch[0].length : 0;
            const name = line.trim();

            // Simple heuristic: 4 spaces or 1 tab = 1 level
            // We'll normalize by finding the minimum non-zero indent and using it as a unit
            // But for simplicity, we'll just use the stack method based on absolute indent
            
            while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
                stack.pop();
            }

            const parent = stack.length > 0 ? stack[stack.length - 1] : null;
            
            const node = {
                tempId: `temp_${index}`,
                name,
                indent,
                parentTempId: parent ? parent.tempId : null,
                level: stack.length
            };

            nodes.push(node);
            stack.push(node);
        });

        return nodes;
    };

    const handleImport = async () => {
        if (!text.trim()) return;
        setIsProcessing(true);
        try {
            const parsedNodes = parseIndentedText(text);
            await onImport(parsedNodes);
            onClose();
        } catch (err) {
            console.error('Import failed:', err);
            alert('Failed to import nodes. Please check the format.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1d27] border border-[#2a2f3e] rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-[#2a2f3e] flex justify-between items-center bg-[#1a1d27]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
                            <Upload size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Bulk Import Nodes</h2>
                            <p className="text-xs text-gray-500">Paste indented text to create branches</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 flex gap-4">
                        <Info className="text-blue-400 shrink-0" size={20} />
                        <div className="text-xs text-blue-100/70 leading-relaxed">
                            <strong>Format Tip:</strong> Use indentation (spaces or tabs) to define the hierarchy. 
                            The first line will be the parent of indented lines below it.
                            <pre className="mt-2 bg-black/20 p-2 rounded-lg text-blue-300">
                                Root Topic{'\n'}
                                {'    '}Sub Topic A{'\n'}
                                {'        '}Detail 1{'\n'}
                                {'    '}Sub Topic B
                            </pre>
                        </div>
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your text here..."
                        className="w-full h-80 bg-[#0f111a] border border-[#2a2f3e] rounded-2xl p-6 text-white outline-none focus:border-[#6366f1] transition-all resize-none font-mono text-sm"
                        autoFocus
                    />
                </div>

                <div className="p-8 bg-[#141721] flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-gray-400 font-semibold hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleImport}
                        disabled={isProcessing || !text.trim()}
                        className="px-8 py-3 bg-[#6366f1] text-white font-bold rounded-xl hover:bg-[#4f46e5] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-[#6366f1]/20 flex items-center gap-2"
                    >
                        {isProcessing ? 'Creating Nodes...' : 'Import Branches'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkImportModal;
