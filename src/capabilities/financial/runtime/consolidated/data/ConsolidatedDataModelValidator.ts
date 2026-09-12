import { EconomicGroupModel } from './GroupOnboardingRepository';
import { EconomicGroupEntityModel } from './GroupEntityMappingRepository';
import { IntercompanyRelationModel } from './IntercompanyRelationRepository';

export interface ModelValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConsolidatedDataModelValidator {
  /**
   * Pre-Flight Check: Valida integridade topológica do grupo antes de permitir execução.
   * Não efetua NENHUM cálculo financeiro de BP/DRE.
   */
  static validate(
    group: EconomicGroupModel,
    entities: EconomicGroupEntityModel[],
    relations: IntercompanyRelationModel[]
  ): ModelValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Grupo vazio
    if (entities.length === 0) {
      errors.push('Grupo econômico não possui nenhuma entidade vinculada.');
    }

    // 2. Multiplos controladores
    const controllingCount = entities.filter(e => e.isControllingEntity).length;
    if (controllingCount === 0 && entities.length > 0) {
      warnings.push('Grupo não possui entidade controladora definida.');
    }
    if (controllingCount > 1) {
      errors.push('Grupo possui múltiplas entidades marcadas como controladoras. Apenas uma holding primária é permitida na Fase 1.');
    }

    // 3. Verificações por entidade
    let totalProportionalOwnership = 0;
    const entityIds = new Set<string>();

    for (const entity of entities) {
      // Entidade sem legacyClientId (Ponte quebrada)
      if (!entity.legacyClientId) {
        errors.push(`Entidade "${entity.entityName}" (ID: ${entity.id}) não possui legacyClientId mapeado. O Motor não conseguirá extrair BP/DRE.`);
      }

      // Duplicidade
      if (entityIds.has(entity.id)) {
        errors.push(`Entidade "${entity.entityName}" está duplicada no mapeamento.`);
      }
      entityIds.add(entity.id);

      // Soma societária
      if (entity.institutionalRole === 'SUBSIDIARY' && entity.consolidationMethod === 'PROPORTIONAL') {
        totalProportionalOwnership += entity.ownershipPercentage;
      }

      // Validação de exclusão
      if (!entity.includeInConsolidation) {
        warnings.push(`Entidade "${entity.entityName}" está excluída do perímetro de consolidação.`);
      }
    }

    // A soma societária de proporcionais não deve exceder 100% de controle.
    if (totalProportionalOwnership > 100) {
      errors.push('A soma de participação societária proporcional excede 100%.');
    }

    // 4. Verificações Intercompany
    for (const relation of relations) {
      // Relação apontando para entidade de fora do grupo (ou não mapeada)
      if (!entityIds.has(relation.fromEntityId)) {
        errors.push(`Relação Intercompany [${relation.id}]: Entidade de origem (from) não existe ou não pertence a este grupo.`);
      }
      if (!entityIds.has(relation.toEntityId)) {
        errors.push(`Relação Intercompany [${relation.id}]: Entidade de destino (to) não existe ou não pertence a este grupo.`);
      }

      // Relação circular nela mesma
      if (relation.fromEntityId === relation.toEntityId) {
        errors.push(`Relação Intercompany [${relation.id}]: Relação circular nela mesma detectada (Source = Target).`);
      }

      // Relação envolvendo entidade excluída
      const fromEntity = entities.find(e => e.id === relation.fromEntityId);
      const toEntity = entities.find(e => e.id === relation.toEntityId);
      
      if (fromEntity && !fromEntity.includeInConsolidation) {
        errors.push(`Relação Intercompany [${relation.id}]: Origem está marcada como excluída da consolidação.`);
      }
      if (toEntity && !toEntity.includeInConsolidation) {
        errors.push(`Relação Intercompany [${relation.id}]: Destino está marcado como excluído da consolidação.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
