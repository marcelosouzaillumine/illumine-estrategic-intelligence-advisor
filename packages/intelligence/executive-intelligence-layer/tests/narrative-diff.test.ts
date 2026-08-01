import { AdaptiveNarrativeEngine } from '../src/narrative/AdaptiveNarrativeEngine';
import { DecisionAssessmentContract } from '../contracts/DecisionAssessmentContract';

// Helper function to calculate Jaccard similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return (intersection.size / union.size) * 100;
}

describe('Narrative Diff Test (Cognitive Divergence)', () => {
  it('should guarantee that divergent financial states produce narratives with < 65% similarity', () => {
    
    // Empório 2024 (Balanced)
    const decision24: DecisionAssessmentContract = {
      proposedDecision: 'Expansão de 15% na capacidade',
      status: 'APPROVED',
      reasons: ['Base de capital robusta'],
      recommendedAlternative: 'Manter liquidez atual'
    };
    const narrative24 = AdaptiveNarrativeEngine.generateNarrativeBlocks('PRESSÃO FINANCEIRA CONTROLADA', [], decision24);
    
    // Empório 2025 (Recovery / Cash Protection)
    const decision25: DecisionAssessmentContract = {
      proposedDecision: 'Expansão de 15% na capacidade',
      status: 'BLOCKED',
      reasons: ['Capital de giro negativo', 'Restrição de liquidez severa'],
      recommendedAlternative: 'Preservação imediata de caixa'
    };
    const narrative25 = AdaptiveNarrativeEngine.generateNarrativeBlocks('RISCO DE CONTINUIDADE', [], decision25);

    // Extract all text bodies
    const text24 = narrative24.narrativeBlocks.map(b => b.body).join(' ');
    const text25 = narrative25.narrativeBlocks.map(b => b.body).join(' ');

    const similarity = calculateSimilarity(text24, text25);
    
    // The test asserts that the narratives are cognitively divergent
    // Meaning they shouldn't share more than 65% of vocabulary/structure
    expect(similarity).toBeLessThan(65);
    
    // As extra guarantee, checking that they don't produce the exact same fallback sentence
    expect(text24).not.toEqual(text25);
  });
});
