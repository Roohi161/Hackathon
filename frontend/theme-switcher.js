const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /bg-\[\#050810\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[\#0B0F19\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[\#0B0B0C\]/g, replace: 'bg-slate-50' },
  { regex: /bg-black/g, replace: 'bg-slate-50' },
  { regex: /bg-\[\#18191c\]/g, replace: 'bg-white' },
  { regex: /bg-\[\#1e293b\]/g, replace: 'bg-white' },
  { regex: /bg-\[\#2b2d31\]/g, replace: 'bg-slate-100' },
  { regex: /bg-\[\#334155\]/g, replace: 'bg-slate-100' },

  // Borders
  { regex: /border-\[\#1e2d4a\]/g, replace: 'border-slate-200' },
  { regex: /border-\[\#2b2d31\]/g, replace: 'border-slate-200' },
  { regex: /border-\[\#334155\]/g, replace: 'border-slate-300' },

  // Text colors
  { regex: /text-white/g, replace: 'text-slate-900' },
  { regex: /text-\[\#a0a0a0\]/g, replace: 'text-slate-600' },
  { regex: /text-\[\#e0e0e0\]/g, replace: 'text-slate-700' },
  { regex: /text-slate-300/g, replace: 'text-slate-600' },
  { regex: /text-slate-400/g, replace: 'text-slate-500' },
  { regex: /text-slate-500/g, replace: 'text-slate-500' }, // Keep 500

  // Hover states
  { regex: /hover:bg-\[\#1e293b\]/g, replace: 'hover:bg-slate-50' },
  { regex: /hover:bg-\[\#2b2d31\]/g, replace: 'hover:bg-slate-200' },
  { regex: /hover:bg-\[\#3b3d41\]/g, replace: 'hover:bg-slate-200' },
  { regex: /hover:text-white/g, replace: 'hover:text-slate-900' },

  // Specific fixes
  { regex: /border-white\/10/g, replace: 'border-slate-200' },
  { regex: /bg-white\/5/g, replace: 'bg-slate-100' },
  { regex: /text-white\/60/g, replace: 'text-slate-500' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Done refactoring theme classes.");
