const fs = require('fs');
const path = require('path');

const govDir = path.join(__dirname, 'src/components/pages/governance');
const viewModelsDir = path.join(__dirname, 'src/viewmodels/governance'); // if it exists
const capabilitiesViewModelsDir = path.join(__dirname, 'src/capabilities/governance/presentation/view-models'); // if it exists

const files = fs.readdirSync(govDir).filter(f => f.endsWith('.tsx'));

const results = files.map(file => {
  const filePath = path.join(govDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hooksMatch = content.match(/use(State|Effect|Memo|Callback)\b/g);
  const directImportsMatch = content.match(/from\s+['"](firebase|.*Firebase.*|.*ClientIntelligence.*|.*Runtime.*|.*BrasilAPI.*|.*ai-.*|.*operational-intelligence.*)['"]/g);
  const hasViewModel = content.includes('ViewModel');
  
  const status = (!hooksMatch && !directImportsMatch && hasViewModel) ? 'Certified' :
                 (hasViewModel && (hooksMatch || directImportsMatch)) ? 'Partially Migrated' : 'Pending';

  return {
    file,
    hooksCount: hooksMatch ? hooksMatch.length : 0,
    directImports: directImportsMatch ? directImportsMatch.join(', ') : 'None',
    hasViewModel,
    status
  };
});

fs.writeFileSync('gov_discovery.json', JSON.stringify(results, null, 2));
console.log('Discovery complete.');
