const fs = require('fs');

const content = fs.readFileSync('src/app/navigation.ts', 'utf8');
const itemsMatch = content.match(/items:\s*\[([\s\S]*?)\]/g);

if (itemsMatch) {
  const iconCounts = {};
  const itemIcons = [];
  
  itemsMatch.forEach(block => {
    const lines = block.split('\n');
    lines.forEach(line => {
      const match = line.match(/label:\s*'([^']+)',\s*icon:\s*([A-Za-z0-9_]+)/);
      if (match) {
        const label = match[1];
        const icon = match[2];
        itemIcons.push({ label, icon });
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
      }
    });
  });
  
  console.log("=== DUPLICATE ICONS ===");
  Object.keys(iconCounts).forEach(icon => {
    if (iconCounts[icon] > 1) {
      console.log(`\nIcon: ${icon} (${iconCounts[icon]} times)`);
      itemIcons.filter(item => item.icon === icon).forEach(item => {
        console.log(`  - ${item.label}`);
      });
    }
  });
}
