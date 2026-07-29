const fs = require('fs');
const path = require('path');

const mapPath = path.join(process.cwd(), 'docs/architecture/EAC_COGNITIVE_BOUNDARY_MAP.json');
const data = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const candidates = data.filter(c => {
  if (c.implementationStatus === 'COMPLETED' || c.implementationStatus === 'SEMANTIC_REVIEW_COMPLETED' || c.implementationStatus === 'NOT_REQUIRED') {
    return false;
  }
  
  if (c.consumerResolution.status !== 'ORPHAN_CONFIRMED') {
    return false;
  }
  
  if (c.separationStrategy !== 'INTERNAL_WRAP' && c.separationStrategy !== 'NO_ACTION_REQUIRED') {
    return false;
  }
  
  return true;
});

console.log(JSON.stringify(candidates.map(c => ({
  component: c.component,
  strategy: c.separationStrategy,
  rolesCount: c.roles ? c.roles.length : 0,
  risk: c.metrics?.riskScore
})), null, 2));
