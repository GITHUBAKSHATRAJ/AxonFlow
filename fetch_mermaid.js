const fs = require('fs');
const pako = require('pako');

async function downloadMermaid(filename, mmdContent) {
    const data = new TextEncoder().encode(mmdContent);
    const compressed = pako.deflate(data, { level: 9 });
    
    // Base64 encode the compressed data, using URL safe characters
    const encoded = Buffer.from(compressed).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_');
        
    const url = `https://mermaid.ink/img/pako:${encoded}?type=png`;
    console.log('Fetching:', url);
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filename, Buffer.from(buffer));
        console.log(`Saved ${filename}`);
    } catch (e) {
        console.error('Error fetching', filename, e);
    }
}

const hld = fs.readFileSync('project_output/hld.mmd', 'utf-8');
const lld = fs.readFileSync('project_output/lld.mmd', 'utf-8');

(async () => {
    await downloadMermaid('project_output/hld_diagram.png', hld);
    await downloadMermaid('project_output/lld_diagram.png', lld);
})();
