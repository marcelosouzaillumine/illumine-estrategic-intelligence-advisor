import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { DecisionRecord, DecisionStatus } from '../../../packages/shell/executive-intelligence-layer/src/governance/DecisionRecord';
import { DecisionContextPanel } from '../executive-architecture/DecisionContextPanel';
import { ScenarioSimulationPanel } from '../executive-architecture/ScenarioSimulationPanel';
import { DeliberationRecordPanel } from '../executive-architecture/DeliberationRecordPanel';
import { HumanJudgmentGate } from '../executive-architecture/HumanJudgmentGate';
import { DecisionSignaturePanel } from '../executive-architecture/DecisionSignaturePanel';
import { Button } from '../ui/button';

interface ExecutiveDecisionRoomProps {
  record: DecisionRecord;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ExecutiveDecisionRoom({ record, onApprove, onReject }: ExecutiveDecisionRoomProps) {
  if (!record) return null;

  const isApproved = record.approval.status === DecisionStatus.APPROVED || record.approval.status === DecisionStatus.APPROVED_WITH_CONDITIONS;

  return (
    <ExecutivePageTemplate header={{
      title: "Executive Decision Room™",
      description: "Ambiente institucional de deliberação, julgamento executivo e registro de memória decisória.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">
        
        {/* Camada 1: Contexto da Decisão */}
        <DecisionContextPanel context={record.decisionContext} />

        {/* Camada 2: Simulação de Cenários (War Gaming) */}
        <ScenarioSimulationPanel scenarios={record.deliberation.scenarios} />

        {/* Camada 3: Registro de Deliberação */}
        <DeliberationRecordPanel deliberation={record.deliberation} />

        {/* Camada 4: Julgamento Humano */}
        <HumanJudgmentGate 
          reviewerName={record.approval.signature?.approvedBy || "Aguardando Revisão"}
          reviewerRole={record.approval.signature?.role || "Aguardando Autoridade"}
          date={record.approval.signature?.signatureDate || new Date().toISOString()}
          authorityLevel={record.approval.signature?.role === 'Board' ? 'Comitê' : 'Executivo'}
          isConfirmed={isApproved}
        />

        {/* Ações de Decisão (Aparecem apenas se não aprovado) */}
        {!isApproved && (
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={onReject} className="w-48">
              Solicitar Revisão
            </Button>
            <Button variant="default" onClick={onApprove} className="w-48 bg-executive-primary text-white">
              Aprovar Decisão
            </Button>
          </div>
        )}

        {/* Camada 5: Assinatura Institucional (Aparece se aprovado) */}
        {isApproved && record.approval.signature && (
          <DecisionSignaturePanel signature={record.approval.signature} />
        )}

      </div>
    </ExecutivePageTemplate>
  );
}
