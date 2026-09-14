import fs from 'fs';
import path from 'path';

export interface DatasetValidationResult {
  passed: boolean;
  violations: string[];
}

export function validateAgainstGoldenDataset(datasetName: string, runtimeOutput: any): DatasetValidationResult {
  const datasetPath = path.resolve(process.cwd(), 'src/governance/golden-datasets', `${datasetName}.json`);
  const violations: string[] = [];

  if (!fs.existsSync(datasetPath)) {
    return { passed: false, violations: [`Golden Dataset ${datasetName} não encontrado.`] };
  }

  const goldenDataStr = fs.readFileSync(datasetPath, 'utf8');
  let goldenData;
  try {
    goldenData = JSON.parse(goldenDataStr);
  } catch (e) {
    return { passed: false, violations: [`Falha ao realizar parse do Golden Dataset ${datasetName}.`] };
  }

  // Verifica chaves principais
  if (goldenData.confidence && runtimeOutput.confidence !== goldenData.confidence) {
    violations.push(`Deriva detectada no campo confidence. Esperado: ${goldenData.confidence}, Recebido: ${runtimeOutput.confidence}`);
  }

  if (goldenData.success !== undefined && runtimeOutput.success !== goldenData.success) {
    violations.push(`Divergência de success status. Esperado: ${goldenData.success}`);
  }
  
  if (goldenData.engineName && runtimeOutput.engineName !== goldenData.engineName) {
     violations.push(`EngineName divergente. Esperado: ${goldenData.engineName}`);
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
