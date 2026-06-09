const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // 1. Remove hardcoded sizing from buttons that already use global base classes
      // This allows the global CSS responsive rules to take over cleanly.
      let prevContent;
      do {
        prevContent = content;
        content = content.replace(/className="([^"]*)(btn-executive|btn-primary|btn-secondary)([^"]*)(px-\d+(\.\d+)?|py-\d+(\.\d+)?|text-\[?[a-z0-9.]+\]?|font-[a-z]+|tracking-[a-z0-9.\[\]]+)([^"]*)"/g, 
        (match, before, baseClass, middle, badClass, p4, p5, after) => {
           return `className="${before}${baseClass}${middle}${after}"`.replace(/\s+/g, ' ').replace(' "', '"').replace('" ', '"');
        });
      } while (content !== prevContent);

      // 2. Make raw buttons responsive by injecting md: breakpoint classes
      const btnRawRegex = /<button[^>]*className="([^"]*)"/g;
      content = content.replace(btnRawRegex, (match, classes) => {
         if (classes.includes('btn-executive') || classes.includes('btn-primary') || classes.includes('btn-secondary')) {
            return match; // Already handled globally
         }
         
         let newClasses = classes;
         // Huge buttons
         if (newClasses.includes('px-12') && newClasses.includes('py-5')) {
             newClasses = newClasses.replace('px-12', 'px-6 md:px-12').replace('py-5', 'py-3.5 md:py-5');
         } else if (newClasses.includes('px-12') && newClasses.includes('py-4')) {
             newClasses = newClasses.replace('px-12', 'px-6 md:px-12').replace('py-4', 'py-3 md:py-4');
         } else if (newClasses.includes('px-10') && newClasses.includes('py-5')) {
             newClasses = newClasses.replace('px-10', 'px-6 md:px-10').replace('py-5', 'py-3 md:py-5');
         } else if (newClasses.includes('px-10') && newClasses.includes('py-4')) {
             newClasses = newClasses.replace('px-10', 'px-6 md:px-10').replace('py-4', 'py-3 md:py-4');
         } 
         // Large buttons
         else if (newClasses.includes('px-8') && newClasses.includes('py-5')) {
             newClasses = newClasses.replace('px-8', 'px-5 md:px-8').replace('py-5', 'py-3 md:py-5');
         } else if (newClasses.includes('px-8') && newClasses.includes('py-4')) {
             newClasses = newClasses.replace('px-8', 'px-5 md:px-8').replace('py-4', 'py-2.5 md:py-4');
         } else if (newClasses.includes('px-8') && newClasses.includes('py-3.5')) {
             newClasses = newClasses.replace('px-8', 'px-5 md:px-8').replace('py-3.5', 'py-2.5 md:py-3.5');
         } else if (newClasses.includes('px-8') && newClasses.includes('py-3')) {
             newClasses = newClasses.replace('px-8', 'px-5 md:px-8').replace('py-3', 'py-2 md:py-3');
         } 
         // Medium buttons
         else if (newClasses.includes('px-6') && newClasses.includes('py-4')) {
             newClasses = newClasses.replace('px-6', 'px-4 md:px-6').replace('py-4', 'py-2.5 md:py-4');
         } else if (newClasses.includes('px-6') && newClasses.includes('py-3.5')) {
             newClasses = newClasses.replace('px-6', 'px-4 md:px-6').replace('py-3.5', 'py-2 md:py-3.5');
         } else if (newClasses.includes('px-6') && newClasses.includes('py-3')) {
             newClasses = newClasses.replace('px-6', 'px-4 md:px-6').replace('py-3', 'py-2 md:py-3');
         } else if (newClasses.includes('px-6') && newClasses.includes('py-2.5')) {
             newClasses = newClasses.replace('px-6', 'px-4 md:px-6').replace('py-2.5', 'py-2 md:py-2.5');
         } else if (newClasses.includes('px-6') && newClasses.includes('py-2')) {
             newClasses = newClasses.replace('px-6', 'px-4 md:px-6').replace('py-2', 'py-1.5 md:py-2');
         }
         
         if (newClasses !== classes) {
             return match.replace(classes, newClasses);
         }
         return match;
      });

      if (content !== fs.readFileSync(fullPath, 'utf-8')) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('./src/components');
console.log('Finished updating button paddings across the application.');
