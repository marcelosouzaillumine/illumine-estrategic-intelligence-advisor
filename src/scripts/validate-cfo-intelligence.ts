import { healthyCompanyFixture } from '../workspace/intelligence/cfo/fixtures/healthy-company.fixture';
import { attentionCompanyFixture } from '../workspace/intelligence/cfo/fixtures/attention-company.fixture';
import { criticalCompanyFixture } from '../workspace/intelligence/cfo/fixtures/critical-company.fixture';
import { startupCompanyFixture } from '../workspace/intelligence/cfo/fixtures/startup-company.fixture';
import { CfoHealthScoreEngine } from '../workspace/intelligence/cfo/cfo-health-score.engine';
import { InsightQualityValidator } from '../workspace/intelligence/validation/insight-quality.validator';
import { IntelligenceValidationFramework } from '../workspace/intelligence/validation/intelligence-validation.framework';

function validateFixture(name: string, fixture: any) {
  console.log(`\nCFO Intelligence Validation`);
  console.log(`${name}`);
  
  const scoreResult = CfoHealthScoreEngine.calculateScore(fixture);
  console.log(`✓ Score: ${scoreResult.score}`);
  console.log(`✓ Classification: ${scoreResult.classification.toUpperCase()}`);
  
  let approved = 0;
  let rejected = 0;
  
  fixture.insights.forEach((insight: any) => {
    const valid = InsightQualityValidator.validate(insight);
    if (valid.status === 'approved' || valid.status === 'approved_low_confidence') {
      approved++;
    } else {
      rejected++;
    }
  });
  
  if (approved > 0) {
    console.log(`✓ Insights: ${approved} approved`);
  }
  if (rejected > 0) {
    console.log(`✕ Insights: ${rejected} rejected`);
  }
  
  const frameworkResult = IntelligenceValidationFramework.validateSnapshot(fixture);
  if (frameworkResult.anomaliesDetected.length > 0) {
    console.log(`✓ Alerts/Risks detected: ${frameworkResult.anomaliesDetected.length}`);
  }
}

async function main() {
  validateFixture('Healthy Company', healthyCompanyFixture);
  validateFixture('Attention Company', attentionCompanyFixture);
  validateFixture('Critical Company', criticalCompanyFixture);
  validateFixture('Startup Company', startupCompanyFixture);

  console.log('\nValidation completed successfully.');
}

main();
