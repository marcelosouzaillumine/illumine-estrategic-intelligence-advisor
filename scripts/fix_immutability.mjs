import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to replace T[] with readonly T[]
      // We'll target specific ones to be safe
      content = content.replace(/dependencies: CapabilityId\[\]/g, 'dependencies: readonly CapabilityId[]');
      content = content.replace(/certificationHistory: string\[\]/g, 'certificationHistory: readonly string[]');
      content = content.replace(/affectedFiles: string\[\]/g, 'affectedFiles: readonly string[]');
      content = content.replace(/evidences: EvidenceContract\[\]/g, 'evidences: readonly EvidenceContract[]');
      content = content.replace(/affectedCapabilities: CapabilityId\[\]/g, 'affectedCapabilities: readonly CapabilityId[]');
      content = content.replace(/approvedBy: string\[\]/g, 'approvedBy: readonly string[]');
      content = content.replace(/findings: FindingContract\[\]/g, 'findings: readonly FindingContract[]');

      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(path.join(process.cwd(), 'packages/architecture-governance-contracts/src'));
replaceInDir(path.join(process.cwd(), 'packages/architecture-governance-domain/src'));

console.log('Immutability fixed.');
