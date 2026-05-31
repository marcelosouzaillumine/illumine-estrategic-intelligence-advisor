import { InstitutionalResilienceOutput, ResilienceEvaluationInput, ResilienceClassification } from './ResilienceTypes';
import { VulnerabilityReductionEngine } from './VulnerabilityReductionEngine';
import { CrisisLearningValidationEngine } from './CrisisLearningValidationEngine';
import { InstitutionalShockAbsorptionEngine } from './InstitutionalShockAbsorptionEngine';
import { AntifragilityAssessmentEngine } from './AntifragilityAssessmentEngine';

function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const words: number[] = [];
  const asciiLength = ascii.length;
  const maxWord = 0xffffffff;
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  let i = 0;
  for (i = 0; i < asciiLength; i++) {
    words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  words[asciiLength >> 2] |= 0x80 << (24 - (asciiLength % 4) * 8);
  const wordsLength = ((asciiLength + 8) >> 6) + 1 << 4;
  while (words.length < wordsLength) {
    words.push(0);
  }
  words[wordsLength - 1] = asciiLength * 8;
  for (let j = 0; j < wordsLength; j += 16) {
    const w = words.slice(j, j + 16);
    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];
    for (let kIndex = 0; kIndex < 64; kIndex++) {
      if (kIndex >= 16) {
        const s0 = rightRotate(w[kIndex - 15], 7) ^ rightRotate(w[kIndex - 15], 18) ^ (w[kIndex - 15] >>> 3);
        const s1 = rightRotate(w[kIndex - 2], 17) ^ rightRotate(w[kIndex - 2], 19) ^ (w[kIndex - 2] >>> 10);
        w[kIndex] = (w[kIndex - 16] + s0 + w[kIndex - 7] + s1) & maxWord;
      }
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + k[kIndex] + w[kIndex]) & maxWord;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) & maxWord;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) & maxWord;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) & maxWord;
    }
    hash[0] = (hash[0] + a) & maxWord;
    hash[1] = (hash[1] + b) & maxWord;
    hash[2] = (hash[2] + c) & maxWord;
    hash[3] = (hash[3] + d) & maxWord;
    hash[4] = (hash[4] + e) & maxWord;
    hash[5] = (hash[5] + f) & maxWord;
    hash[6] = (hash[6] + g) & maxWord;
    hash[7] = (hash[7] + h) & maxWord;
  }
  let result = '';
  for (let idx = 0; idx < 8; idx++) {
    let hex = hash[idx].toString(16);
    while (hex.length < 8) {
      hex = '0' + hex;
    }
    result += hex;
  }
  return result;
}

export class InstitutionalResilienceEngine {
  public static evaluate(input: ResilienceEvaluationInput): InstitutionalResilienceOutput {
    // 1. Evaluate Vulnerability Reduction
    const vulnResult = VulnerabilityReductionEngine.evaluate(input);

    // 2. Evaluate Crisis Learning
    const learningResult = CrisisLearningValidationEngine.evaluate(input);

    // 3. Evaluate Shock Absorption
    const shockResult = InstitutionalShockAbsorptionEngine.evaluate(input);

    // 4. Evaluate Antifragility
    const antifragilityResult = AntifragilityAssessmentEngine.evaluate(
      input,
      vulnResult.vulnerabilityReductionScore,
      learningResult.institutionalLearningScore,
      shockResult.shockAbsorptionScore,
      shockResult.treasuryStrengtheningStatus,
      learningResult.governanceEvolutionStatus,
      vulnResult.continuityResilienceStatus,
      learningResult.crisisRecurrenceRisk
    );

    // 5. Calculate Consolidated Resilience Score
    // Weighting: 40% Vulnerability, 30% Learning, 30% Shock Absorption
    const resilienceScore = Math.round(
      (vulnResult.vulnerabilityReductionScore * 0.4) +
      (learningResult.institutionalLearningScore * 0.3) +
      (shockResult.shockAbsorptionScore * 0.3)
    );

    // 6. Determine Classification
    let classification: ResilienceClassification = 'STRUCTURALLY_STABLE'; // Default safe middle ground
    let confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';
    
    const history = input.longitudinalRuntimeHistory || [];
    const hasSufficientHistory = history.length >= 3;

    if (!hasSufficientHistory) {
      confidenceLevel = 'LOW';
      // Fail-closed enforcement: cannot exceed STRUCTURALLY_STABLE without history
      if (resilienceScore < 40) {
        classification = 'INSTITUTIONALLY_FRAGILE';
      } else {
        classification = 'STRUCTURALLY_STABLE';
      }
    } else if (antifragilityResult.falseResilienceDetected) {
      confidenceLevel = 'MODERATE';
      classification = 'INSTITUTIONALLY_FRAGILE';
    } else {
      if (resilienceScore < 40) {
        classification = 'INSTITUTIONALLY_FRAGILE';
      } else if (resilienceScore < 60) {
        classification = 'STRUCTURALLY_STABLE';
      } else if (resilienceScore < 80) {
        classification = 'RESILIENT';
      } else {
        classification = 'ADAPTIVE';
      }

      // Upgrade to ANTIFRAGILE only if conditions are met
      if (classification === 'ADAPTIVE' && antifragilityResult.antifragilityValidated) {
        // Enforce the user condition: ANTIFRAGILE requires strong longitudinal evidence of crisis survival.
        const survivalTriggersCount = history.filter(h => h.survivalModeActive).length;
        if (survivalTriggersCount >= 1) {
          classification = 'ANTIFRAGILE';
        }
      }
    }

    const blockedConclusions: string[] = [];
    const allowedConclusions: string[] = [];
    let narrative = '';

    if (classification === 'INSTITUTIONALLY_FRAGILE') {
      blockedConclusions.push('Resiliência', 'Antifragilidade', 'Estabilidade Consolidada');
      allowedConclusions.push('Fragilidade Operacional', 'Dependência de Sobrevivência');
      narrative = 'Organização apresenta fragilidade estrutural, com alta dependência de medidas de sobrevivência e baixa absorção de choques.';
    } else if (classification === 'STRUCTURALLY_STABLE') {
      blockedConclusions.push('Antifragilidade', 'Resiliência Comprovada');
      allowedConclusions.push('Estabilidade Operacional', 'Recuperação Funcional');
      narrative = 'Organização demonstra estabilidade operacional inicial, porém sem evidências longitudinais de resiliência antifrágil.';
    } else if (classification === 'RESILIENT') {
      blockedConclusions.push('Antifragilidade');
      allowedConclusions.push('Resiliência Estrutural', 'Recuperação Consolidada');
      narrative = 'Organização exibe resiliência estrutural com capacidade validada de absorção de estresse e recuperação de crises.';
    } else if (classification === 'ADAPTIVE') {
      blockedConclusions.push('Antifragilidade Plena');
      allowedConclusions.push('Resiliência', 'Maturidade Adaptativa');
      narrative = 'Organização demonstra capacidade adaptativa em evolução, aprendendo com pressões e reduzindo vulnerabilidades de forma contínua.';
    } else if (classification === 'ANTIFRAGILE') {
      allowedConclusions.push('Antifragilidade Estrutural', 'Resiliência Plena', 'Maturidade Governamental');
      narrative = 'Organização comprovadamente antifrágil: fortaleceu tesouraria, governança e liquidez como resposta direta a crises anteriores.';
    }

    const lineagePayload = JSON.stringify({
      score: resilienceScore,
      classification,
      historyCount: history.length,
      timestamp: new Date().toISOString()
    });
    const lineageHash = sha256(lineagePayload);

    const auditTrail = [
      `IRAE Evaluated at ${new Date().toISOString()}`,
      `History Length: ${history.length} cycles. Sufficient: ${hasSufficientHistory}`,
      `Vulnerability Score: ${vulnResult.vulnerabilityReductionScore}`,
      `Learning Score: ${learningResult.institutionalLearningScore}`,
      `Shock Absorption Score: ${shockResult.shockAbsorptionScore}`,
      `False Resilience Detected: ${antifragilityResult.falseResilienceDetected}`,
      `Antifragility Validated: ${antifragilityResult.antifragilityValidated}`,
      `Final Classification: ${classification}`
    ];

    return {
      resilienceClassification: classification,
      falseResilienceDetected: antifragilityResult.falseResilienceDetected,
      antifragilityValidated: antifragilityResult.antifragilityValidated,
      resilienceScore,
      antifragilityScore: antifragilityResult.antifragilityScore,
      vulnerabilityReductionScore: vulnResult.vulnerabilityReductionScore,
      institutionalLearningScore: learningResult.institutionalLearningScore,
      shockAbsorptionScore: shockResult.shockAbsorptionScore,
      treasuryStrengtheningStatus: shockResult.treasuryStrengtheningStatus,
      governanceEvolutionStatus: learningResult.governanceEvolutionStatus,
      continuityResilienceStatus: vulnResult.continuityResilienceStatus,
      crisisRecurrenceRisk: learningResult.crisisRecurrenceRisk,
      resilienceDrivers: [
        ...vulnResult.vulnerabilityDrivers,
        ...learningResult.institutionalLearningDrivers
      ],
      antifragilityDrivers: antifragilityResult.antifragilityDrivers,
      vulnerabilityDrivers: vulnResult.vulnerabilityDrivers,
      institutionalLearningDrivers: learningResult.institutionalLearningDrivers,
      blockedConclusions,
      allowedConclusions,
      resilienceNarrative: narrative,
      auditTrail,
      lineageHash,
      confidenceLevel
    };
  }
}
