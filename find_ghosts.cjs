const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findGhostFiles(directory) {
  const files = [];
  function traverse(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
        files.push(fullPath);
      }
    });
  }
  traverse(directory);

  console.log(`Checking ${files.length} pages...`);
  const ghosts = [];

  files.forEach(file => {
    const basename = path.basename(file, '.tsx');
    // Search for the basename in the src directory using grep
    try {
      const result = execSync(`grep -rnw "src" -e "${basename}" --exclude-dir=node_modules || true`).toString();
      const lines = result.split('\n').filter(l => l.trim() !== '');
      // If the only matches are within the file itself, it's a ghost!
      const isUsedElsewhere = lines.some(line => !line.startsWith(file));
      if (!isUsedElsewhere) {
        ghosts.push(file);
      }
    } catch (e) {
      console.error("Error grep", e);
    }
  });

  console.log("\nFound Ghost Files:");
  ghosts.forEach(g => console.log(g));
}

findGhostFiles('./src/components/pages');
