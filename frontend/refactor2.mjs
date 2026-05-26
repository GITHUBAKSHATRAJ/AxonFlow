import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('c:/Users/Akshat Raj/OneDrive/Desktop/important/Project/AxonFlow/frontend/src/pages/LandingPage.jsx', 'utf8');

content = content.replace(/bg-\[\#0a0a0c\]\/80/g, 'bg-bg/80');
content = content.replace(/bg-\[\#0a0a0c\]/g, 'bg-bg');
content = content.replace(/text-text-h\/50/g, 'text-text-muted');

fs.writeFileSync('c:/Users/Akshat Raj/OneDrive/Desktop/important/Project/AxonFlow/frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Fixed LandingPage.jsx');
