const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

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
      
      // Look for lines that have bg-blue-*** or bg-[#3b82f6] and change text-slate-900 back to text-white
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('bg-blue-') || lines[i].includes('bg-[#3b82f6]') || lines[i].includes('bg-[#2563eb]')) {
           lines[i] = lines[i].replace(/text-slate-900/g, 'text-white');
           // Also if the next line or inner elements have text-slate-900 they might need fixing,
           // but normally they are on the same line in Tailwind.
        }
      }
      
      content = lines.join('\n');
      
      // specific button fixes where they might span multiple lines:
      // Since it's hard to parse HTML with regex, let's just do a global replace for things we KNOW should be white.
      content = content.replace(/text-slate-900 text-white/g, 'text-white'); // in case of weird overlaps
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Done fixing blue buttons.");
