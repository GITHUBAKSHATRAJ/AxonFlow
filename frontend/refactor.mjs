import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const basePath = 'c:/Users/Akshat Raj/OneDrive/Desktop/important/Project/AxonFlow/frontend/src';

walkDir(basePath, function(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/bg-\[\#0f111a\]/g, 'bg-bg');
  content = content.replace(/bg-\[\#1a1d27\]/g, 'bg-bg-card');
  content = content.replace(/bg-\[\#222634\]/g, 'bg-bg-card-hover');
  content = content.replace(/bg-\[\#141721\]/g, 'bg-bg-card-hover');
  content = content.replace(/bg-\[\#6366f1\]\/10/g, 'bg-accent-bg');
  content = content.replace(/bg-\[\#6366f1\]\/20/g, 'bg-accent-bg');
  content = content.replace(/bg-\[\#6366f1\]/g, 'bg-accent');
  content = content.replace(/hover:bg-\[\#222634\]/g, 'hover:bg-bg-card-hover');
  content = content.replace(/hover:bg-\[\#4f46e5\]/g, 'hover:bg-accent-hover');

  // Borders
  content = content.replace(/border-\[\#2a2f3e\]/g, 'border-border');
  content = content.replace(/border-\[\#6366f1\]/g, 'border-border-focus');
  content = content.replace(/group-hover:border-\[\#6366f1\]/g, 'group-hover:border-border-focus');
  content = content.replace(/hover:border-\[\#6366f1\]/g, 'hover:border-border-focus');

  // Shadows
  content = content.replace(/shadow-\[\#6366f1\]\/20/g, 'shadow-accent/20');
  content = content.replace(/shadow-\[\#6366f1\]\/40/g, 'shadow-accent/40');

  // Text colors
  content = content.replace(/text-\[\#6366f1\]/g, 'text-accent');
  content = content.replace(/hover:text-\[\#6366f1\]/g, 'hover:text-accent');
  content = content.replace(/group-hover:text-\[\#6366f1\]/g, 'group-hover:text-accent');
  
  // Muted text
  content = content.replace(/text-gray-400/g, 'text-text-muted');
  content = content.replace(/text-gray-500/g, 'text-text-muted');
  content = content.replace(/text-gray-300/g, 'text-text-muted');

  // Text white (careful! if it follows bg-accent, we want it to stay white)
  content = content.replace(/text-white/g, 'text-text-h');
  content = content.replace(/text-\[\#f9fafb\]/g, 'text-text-h');
  
  // Fixes for buttons where we want the text to remain white despite theme
  content = content.replace(/bg-accent text-text-h/g, 'bg-accent text-white');
  content = content.replace(/text-text-h flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/g, 'text-white flex items-center gap-2 px-6 py-3 rounded-xl bg-accent');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
