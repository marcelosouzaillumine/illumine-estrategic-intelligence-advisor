const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inventoryPath = 'docs/architecture/EAC_TECHNICAL_LAYER_INVENTORY.json';
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

// 1. Select Stratified Sample
const categories = {};
inventory.forEach(item => {
  if (!categories[item.cognitiveRole]) categories[item.cognitiveRole] = [];
  categories[item.cognitiveRole].push(item);
});

const sampleSize = 25;
const sample = [];

// Pick roughly equal amounts from each category to form ~25
const catKeys = Object.keys(categories);
let remaining = sampleSize;
while (remaining > 0 && catKeys.some(k => categories[k].length > 0)) {
  for (const k of catKeys) {
    if (remaining > 0 && categories[k].length > 0) {
      sample.push(categories[k].shift());
      remaining--;
    }
  }
}

// Ensure specific archetypes are included if possible by checking path
const taxonomy = {
  TECHNICAL_EVIDENCE: /table|grid|raw|calc/i,
  DATA_PROVENANCE: /source|provenance|origin|fetch|memory/i,
  AUDIT_TRAIL: /log|audit|history|user|timestamp/i,
  DECISION_TRACE: /trace|decision|rationale|reasoning/i,
  METHODOLOGY: /methodology|formula|math/i,
  APPENDIX: /appendix|extra|attachment/i,
  ANALYTICS_NOT_TECHNICAL: /chart|graph|trend|insight/i,
  EXECUTIVE_NARRATIVE: /summary|executive|conclusion/i
};

function analyzeFileDeep(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const containsRawData = taxonomy.TECHNICAL_EVIDENCE.test(content);
  const containsProvenance = taxonomy.DATA_PROVENANCE.test(content);
  const containsAuditEvents = taxonomy.AUDIT_TRAIL.test(content);
  const containsDecisionRationale = taxonomy.DECISION_TRACE.test(content);
  const containsMethodology = taxonomy.METHODOLOGY.test(content);
  const containsRecommendations = /recommendation|suggest|action/i.test(content);
  const containsExecutiveNarrative = taxonomy.EXECUTIVE_NARRATIVE.test(content);
  const containsAnalytics = taxonomy.ANALYTICS_NOT_TECHNICAL.test(content);

  // Simple heuristic for mixed boundaries
  let rolesCount = 0;
  let detectedRoles = [];
  if (containsRawData) { rolesCount++; detectedRoles.push('TECHNICAL_EVIDENCE'); }
  if (containsProvenance) { rolesCount++; detectedRoles.push('DATA_PROVENANCE'); }
  if (containsAuditEvents) { rolesCount++; detectedRoles.push('AUDIT_TRAIL'); }
  if (containsDecisionRationale) { rolesCount++; detectedRoles.push('DECISION_TRACE'); }
  if (containsMethodology) { rolesCount++; detectedRoles.push('METHODOLOGY'); }
  if (containsAnalytics && !containsRawData) { rolesCount++; detectedRoles.push('ANALYTICS_NOT_TECHNICAL'); }
  
  let classification = 'AMBIGUOUS';
  
  if (rolesCount > 1 && containsExecutiveNarrative) {
    classification = 'MIXED_BOUNDARY';
  } else if (rolesCount > 1) {
    classification = 'MIXED_BOUNDARY';
  } else if (rolesCount === 1) {
    classification = detectedRoles[0];
  } else if (content.includes('Appendix')) {
    classification = 'APPENDIX';
  } else {
    classification = 'NOT_APPLICABLE';
  }

  // Find consumers
  const fileName = path.basename(filePath).replace('.tsx', '');
  let pageConsumers = [];
  let pageProfiles = [];
  try {
    const grepOutput = execSync(`grep -rl "import.*${fileName}" src/components/`, { encoding: 'utf-8' });
    const consumers = grepOutput.split('\n').filter(l => l.trim() !== '' && l !== filePath);
    pageConsumers = consumers.map(p => path.basename(p));
    pageProfiles = consumers.map(p => p.includes('/pages/') ? 'Page' : 'Component');
  } catch(e) {}

  return {
    filePath,
    component: fileName,
    line: 1, // simplified
    pageConsumers,
    pageProfiles,
    positionInMainReturn: 'Unknown',
    parentBlock: 'Unknown',
    childComponents: [],
    containsRawData,
    containsCalculations: containsMethodology,
    containsProvenance,
    containsAuditEvents,
    containsDecisionRationale,
    containsMethodology,
    containsRecommendations,
    containsExecutiveNarrative,
    cognitiveRole: classification,
    isArchitecturalSection: false,
    confidence: rolesCount === 1 ? 'High' : (rolesCount > 1 ? 'Medium' : 'Low'),
    rationale: `Detected roles: ${detectedRoles.join(', ')}`
  };
}

const calibratedSample = sample.map(item => analyzeFileDeep(item.filePath));

fs.writeFileSync('docs/architecture/EAC_TECHNICAL_CALIBRATION_SAMPLE.json', JSON.stringify(calibratedSample, null, 2));
console.log('Generated EAC_TECHNICAL_CALIBRATION_SAMPLE.json');
