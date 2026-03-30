const fs = require('fs');
const path = require('path');

const colorMap = {
  'text-text-primary': 'text-gray-900',
  'text-text-secondary': 'text-gray-600',
  'bg-background': 'bg-white',
  'bg-surface': 'bg-slate-50',
  'text-error': 'text-red-600',
  'text-success': 'text-green-600',
  'border-error': 'border-red-600',
  'bg-error/10': 'bg-red-50',
  'divide-border': 'divide-slate-200',
  'border-border': 'border-slate-200',
  'text-primary-700': 'text-blue-700',
  'text-primary-800': 'text-blue-800',
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [old, newClass] of Object.entries(colorMap)) {
    if (content.includes(old)) {
      content = content.split(old).join(newClass);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules')) {
        walkDir(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.css')) {
      fixFile(filePath);
    }
  }
}

walkDir('./src');
console.log('Done!');
