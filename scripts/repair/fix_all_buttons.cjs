const fs = require('fs');
const path = require('path');

const baseClasses = ['btn-executive', 'btn-primary', 'btn-secondary', 'btn-tertiary', 'btn-accent', 'btn-ghost'];

function isTextSizingClass(c) {
  if (c.startsWith('text-[')) return true;
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', 'h1', 'h2', 'h3', 'h4', 'body-sm', 'body-md', 'body-lg'];
  return sizes.some(size => c === `text-${size}`);
}

function isFontWeightClass(c) {
  if (c.startsWith('font-[')) return true;
  const weights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
  return weights.some(weight => c === `font-${weight}`);
}

function cleanClassString(str) {
  const classes = str.split(/\s+/);
  const hasBaseClass = classes.some(c => baseClasses.includes(c));
  if (!hasBaseClass) {
    // If it's a raw button, let's make sure it has responsive padding if it has hardcoded padding
    let newClasses = [...classes];
    
    // Check for hardcoded px/py combinations and make them responsive
    const pxIndex = newClasses.findIndex(c => c.startsWith('px-') && !c.includes('md:'));
    const pyIndex = newClasses.findIndex(c => c.startsWith('py-') && !c.includes('md:'));
    
    if (pxIndex !== -1 && pyIndex !== -1) {
      const pxVal = newClasses[pxIndex];
      const pyVal = newClasses[pyIndex];
      
      // Giant buttons
      if (pxVal === 'px-12' && pyVal === 'py-5') {
        newClasses[pxIndex] = 'px-6 md:px-12';
        newClasses[pyIndex] = 'py-3.5 md:py-5';
      } else if (pxVal === 'px-12' && pyVal === 'py-4') {
        newClasses[pxIndex] = 'px-6 md:px-12';
        newClasses[pyIndex] = 'py-3 md:py-4';
      } else if (pxVal === 'px-10' && pyVal === 'py-5') {
        newClasses[pxIndex] = 'px-6 md:px-10';
        newClasses[pyIndex] = 'py-3 md:py-5';
      } else if (pxVal === 'px-10' && pyVal === 'py-4') {
        newClasses[pxIndex] = 'px-6 md:px-10';
        newClasses[pyIndex] = 'py-3 md:py-4';
      }
      // Large buttons
      else if (pxVal === 'px-8' && pyVal === 'py-5') {
        newClasses[pxIndex] = 'px-5 md:px-8';
        newClasses[pyIndex] = 'py-3 md:py-5';
      } else if (pxVal === 'px-8' && pyVal === 'py-4') {
        newClasses[pxIndex] = 'px-5 md:px-8';
        newClasses[pyIndex] = 'py-2.5 md:py-4';
      } else if (pxVal === 'px-8' && pyVal === 'py-3.5') {
        newClasses[pxIndex] = 'px-5 md:px-8';
        newClasses[pyIndex] = 'py-2.5 md:py-3.5';
      } else if (pxVal === 'px-8' && pyVal === 'py-3') {
        newClasses[pxIndex] = 'px-5 md:px-8';
        newClasses[pyIndex] = 'py-2 md:py-3';
      }
      // Medium buttons
      else if (pxVal === 'px-6' && pyVal === 'py-4') {
        newClasses[pxIndex] = 'px-4 md:px-6';
        newClasses[pyIndex] = 'py-2.5 md:py-4';
      } else if (pxVal === 'px-6' && pyVal === 'py-3.5') {
        newClasses[pxIndex] = 'px-4 md:px-6';
        newClasses[pyIndex] = 'py-2 md:py-3.5';
      } else if (pxVal === 'px-6' && pyVal === 'py-3') {
        newClasses[pxIndex] = 'px-4 md:px-6';
        newClasses[pyIndex] = 'py-2 md:py-3';
      } else if (pxVal === 'px-6' && pyVal === 'py-2.5') {
        newClasses[pxIndex] = 'px-4 md:px-6';
        newClasses[pyIndex] = 'py-2 md:py-2.5';
      } else if (pxVal === 'px-6' && pyVal === 'py-2') {
        newClasses[pxIndex] = 'px-4 md:px-6';
        newClasses[pyIndex] = 'py-1.5 md:py-2';
      }
    }
    return newClasses.join(' ');
  }

  // Filter out overriding padding, text sizing, font weight, and tracking from standard buttons
  const filtered = classes.filter(c => {
    if (c.startsWith('px-') || c.startsWith('py-')) return false;
    if (isTextSizingClass(c)) return false;
    if (isFontWeightClass(c)) return false;
    if (c.startsWith('tracking-')) return false;
    return true;
  });

  return filtered.join(' ');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Replace class strings in single quotes, double quotes, and template literals (only single-line to avoid matching JS block structures)
  const stringRegex = /(["'`])((?:[^\n\r\\]|\\.)*?)\1/g;
  
  content = content.replace(stringRegex, (match, quote, str) => {
    const hasBase = baseClasses.some(bc => str.includes(bc));
    const hasPaddings = str.includes('px-') && str.includes('py-');
    
    if (hasBase || hasPaddings) {
      const cleaned = cleanClassString(str);
      if (cleaned !== str) {
        return `${quote}${cleaned}${quote}`;
      }
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated button classes in: ${filePath}`);
  }
}

function walkDir(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

// Start processing from src/
console.log('Starting button standardization across all src/ files (single-line strings)...');
walkDir('./src');
console.log('Standardization complete.');
