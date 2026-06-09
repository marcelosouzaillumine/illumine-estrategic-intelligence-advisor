const fs = require('fs');
const file = 'src/components/pages/ClientExecutiveWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import \{ ExecutiveSessionContext \} from '\.\.\/\.\.\/services\/ExecutiveRuntimeAdapter';/,
  `import { ExecutiveRuntimeAdapter } from '../../services/ExecutiveRuntimeAdapter';`
);

content = content.replace(
  /ExecutiveSessionContext\.createSession/g,
  `ExecutiveRuntimeAdapter.ExecutiveSessionContext.createSession`
);

fs.writeFileSync(file, content);
console.log("Fixed workspace");
