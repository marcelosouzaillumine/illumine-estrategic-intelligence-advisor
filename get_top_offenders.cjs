const fs = require('fs');

const logContent = fs.readFileSync('/Users/marcelosouza/.gemini/antigravity-ide/brain/ac8fc764-2408-411f-94e2-a5b763a43ef1/.system_generated/tasks/task-1113.log', 'utf-8');

const warningIndex = logContent.indexOf('[ECA-004.4 TEMPORARY WARNING]');
if (warningIndex === -1) {
    console.log('Warning not found');
    process.exit(1);
}

const lines = logContent.slice(warningIndex).split('\n');
const violations = [];

for (const line of lines) {
    if (line.includes('->')) {
        const fileMatch = line.match(/(src\/[a-zA-Z0-9_.\/-]+\.tsx?):/);
        if (fileMatch) {
            violations.push(fileMatch[1]);
        }
    }
}

const counts = {};
for (const v of violations) {
    counts[v] = (counts[v] || 0) + 1;
}

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('Top Offenders:');
for (let i = 0; i < sorted.length; i++) {
    console.log(`${sorted[i][0]}: ${sorted[i][1]} violations`);
}
