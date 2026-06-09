
import React, { useState } from 'react';

import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight,
  Info,
  Lock,
  Building2,
  Calendar,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface LGPDModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function LGPDModal({ isOpen, onAccept }: LGPDModalProps) {
  const [accepted, setAccepted] = useState({
    lgpd: false,
    policies: false,
    curation: false
  });
  const [showFullTerms, setShowFullTerms] = useState(false);

  const allAccepted = accepted.lgpd && accepted.policies && accepted.curation;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300"
        >
          <div 
            className="absolute inset-0 bg-primary/80 backdrop-blur-md" 
          />
          
          <div
            className="relative w-full max-w-[95vw] md:max-w-2xl bg-background rounded-card shadow-lg overflow-hidden border border-border flex flex-col h-[95dvh] max-h-[900px] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
          >
            {/* Header */}
            <div className="bg-primary p-[clamp(1rem,3dvh,2.5rem)] text-primary-foreground relative overflow-hidden shrink-0 flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <ShieldCheck className="w-[clamp(100px,25dvh,160px)] h-[clamp(100px,25dvh,160px)]" />
              </div>
              <div className="relative z-10">
                <div className="w-[clamp(2.5rem,7dvh,4rem)] h-[clamp(2.5rem,7dvh,4rem)] rounded-button bg-white/10 flex items-center justify-center mb-[clamp(0.5rem,2dvh,1.5rem)]">
                  <Lock className="w-[50%] h-[50%] text-secondary" />
                </div>
                <h2 className="text-[clamp(1.25rem,4dvh,2.25rem)] font-medium font-display tracking-tight leading-none mb-[clamp(0.25rem,1dvh,1rem)]">
                  Termos & Governança
                </h2>
                <p className="text-primary-foreground/60 text-[clamp(0.75rem,1.8dvh,1rem)] font-medium w-full max-w-none">
                  Para prosseguir com o acesso à plataforma Illumine Governance, é necessário revisar e aceitar os termos de conformidade e governança de dados.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-[clamp(1rem,3dvh,2.5rem)] flex flex-col gap-[clamp(0.75rem,2dvh,2rem)] flex-1 overflow-hidden justify-between">
              <div className="flex flex-col gap-[clamp(0.5rem,1.5dvh,1rem)] w-full">
                {/* LGPD */}
                <div 
                  className={cn(
                    "flex items-start gap-[clamp(0.5rem,1.5dvw,1.25rem)] p-[clamp(0.75rem,2dvh,1.5rem)] rounded-md border-2 transition-all cursor-pointer group",
                    accepted.lgpd ? "border-success bg-success/10" : "border-border bg-surface-container hover:border-primary/20"
                  )}
                  onClick={() => setAccepted(prev => ({ ...prev, lgpd: !prev.lgpd }))}
                >
                  <div className={cn(
                    "w-[clamp(1.25rem,3dvh,1.5rem)] h-[clamp(1.25rem,3dvh,1.5rem)] rounded-button border-2 flex items-center justify-center transition-all mt-0.5 shrink-0",
                    accepted.lgpd ? "bg-success border-success" : "bg-background border-border group-hover:border-primary"
                  )}>
                    {accepted.lgpd && <CheckCircle2 className="w-[60%] h-[60%] text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[clamp(0.875rem,2.2dvh,1.125rem)] font-medium text-foreground mb-[clamp(0.125rem,0.5dvh,0.25rem)] leading-tight">Lei Geral de Proteção de Dados (LGPD)</h4>
                    <p className="text-[clamp(0.7rem,1.6dvh,0.875rem)] text-muted-foreground leading-snug font-medium break-words">
                      Confirmo que estou ciente do tratamento de dados pessoais realizado pela plataforma, em total conformidade com a Lei nº 13.709/2018.
                    </p>
                  </div>
                </div>

                {/* Policies */}
                <div 
                  className={cn(
                    "flex items-start gap-[clamp(0.5rem,1.5dvw,1.25rem)] p-[clamp(0.75rem,2dvh,1.5rem)] rounded-md border-2 transition-all cursor-pointer group",
                    accepted.policies ? "border-success bg-success/10" : "border-border bg-surface-container hover:border-primary/20"
                  )}
                  onClick={() => setAccepted(prev => ({ ...prev, policies: !prev.policies }))}
                >
                  <div className={cn(
                    "w-[clamp(1.25rem,3dvh,1.5rem)] h-[clamp(1.25rem,3dvh,1.5rem)] rounded-button border-2 flex items-center justify-center transition-all mt-0.5 shrink-0",
                    accepted.policies ? "bg-success border-success" : "bg-background border-border group-hover:border-primary"
                  )}>
                    {accepted.policies && <CheckCircle2 className="w-[60%] h-[60%] text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[clamp(0.875rem,2.2dvh,1.125rem)] font-medium text-foreground mb-[clamp(0.125rem,0.5dvh,0.25rem)] leading-tight">Políticas da Plataforma</h4>
                    <p className="text-[clamp(0.7rem,1.6dvh,0.875rem)] text-muted-foreground leading-snug font-medium break-words">
                      Aceito as diretrizes de uso, confidencialidade e responsabilidade operacional estabelecidas para o ambiente Illumine Governance.
                    </p>
                  </div>
                </div>

                {/* Curation */}
                <div 
                  className={cn(
                    "flex items-start gap-[clamp(0.5rem,1.5dvw,1.25rem)] p-[clamp(0.75rem,2dvh,1.5rem)] rounded-md border-2 transition-all cursor-pointer group",
                    accepted.curation ? "border-success bg-success/10" : "border-border bg-surface-container hover:border-primary/20"
                  )}
                  onClick={() => setAccepted(prev => ({ ...prev, curation: !prev.curation }))}
                >
                  <div className={cn(
                    "w-[clamp(1.25rem,3dvh,1.5rem)] h-[clamp(1.25rem,3dvh,1.5rem)] rounded-button border-2 flex items-center justify-center transition-all mt-0.5 shrink-0",
                    accepted.curation ? "bg-success border-success" : "bg-background border-border group-hover:border-primary"
                  )}>
                    {accepted.curation && <CheckCircle2 className="w-[60%] h-[60%] text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[clamp(0.875rem,2.2dvh,1.125rem)] font-medium text-foreground mb-[clamp(0.125rem,0.5dvh,0.25rem)] leading-tight">Ciência de Curadoria</h4>
                    <p className="text-[clamp(0.7rem,1.6dvh,0.875rem)] text-muted-foreground leading-snug font-medium break-words">
                      Compreendo que toda informação enviada passa por processos de curadoria e validação humana para garantir a integridade dos indicadores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-[clamp(0.5rem,1.5dvh,1.5rem)] border-t border-border flex items-center justify-between shrink-0">
                <button 
                  onClick={() => setShowFullTerms(true)}
                  className="flex items-center gap-[clamp(0.25rem,0.5dvw,0.5rem)] text-[clamp(0.6rem,1.4dvh,0.875rem)] font-medium uppercase tracking-widest text-secondary hover:underline"
                >
                  <FileText className="w-[clamp(0.75rem,1.8dvh,1rem)] h-[clamp(0.75rem,1.8dvh,1rem)]" /> Ler Termos Completos
                </button>
                <div className="flex items-center gap-[clamp(0.25rem,0.5dvw,0.5rem)] text-[clamp(0.5rem,1.2dvh,0.6rem)] font-medium text-muted-foreground hidden sm:flex">
                  <Info className="w-[clamp(0.5rem,1.2dvh,0.75rem)] h-[clamp(0.5rem,1.2dvh,0.75rem)]" /> Versão 1.0.2 (Mai/2026)
                </div>
              </div>

              <button
                disabled={!allAccepted}
                onClick={onAccept}
                className={cn(
                  "w-full py-[clamp(0.75rem,2.5dvh,1.25rem)] rounded-md text-[clamp(0.7rem,1.8dvh,0.875rem)] font-medium uppercase tracking-widest transition-all flex items-center justify-center gap-[clamp(0.5rem,1dvw,1rem)] shadow-sm shrink-0",
                  allAccepted 
                    ? "bg-primary text-primary-foreground hover:-translate-y-0.5 active:scale-98" 
                    : "bg-surface-container text-muted-foreground cursor-not-allowed shadow-none"
                )}
              >
                Confirmar e Entrar <ArrowRight className="w-[clamp(1rem,2dvh,1.25rem)] h-[clamp(1rem,2dvh,1.25rem)]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Terms Modal */}
      {showFullTerms && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300"
        >
          <div 
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            onClick={() => setShowFullTerms(false)}
          />
          <div 
            className="relative w-full max-w-4xl bg-background rounded-card shadow-lg overflow-hidden h-[80vh] flex flex-col border border-border animate-in zoom-in-95 duration-300"
          >
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-button bg-primary text-primary-foreground flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <h3 className="text-h2 font-medium text-foreground">Termos & Políticas Detalhadas</h3>
              </div>
              <button 
                onClick={() => setShowFullTerms(false)}
                className="p-3 bg-surface-container text-muted-foreground hover:text-destructive rounded-button transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar prose prose-slate max-w-none">
              <h1 className="text-4xl font-black mb-8">Políticas de Governança Illumine Governance</h1>
              <p className="text-lg text-muted-foreground mb-8">Esta plataforma foi desenvolvida para garantir a máxima transparência e integridade na assessoria estratégica corporativa.</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">1. Proteção de Dados (LGPD)</h3>
              <p>O Illumine Governance coleta e processa dados em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Os dados financeiros e operacionais inseridos são utilizados exclusivamente para a geração de indicadores estratégicos e suporte à tomada de decisão da organização contratante.</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">2. Confidencialidade Estrutural</h3>
              <p>Todas as informações transitadas no ambiente Illumine Governance são protegidas por protocolos de criptografia em repouso e em trânsito. O acesso é restrito a usuários autorizados via autenticação federada (Google Workspace).</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">3. Protocolo de Curadoria</h3>
              <p>A integridade dos dashboards e indicadores depende da veracidade dos dados importados. Por este motivo, o Illumine Governance utiliza um sistema híbrido de processamento de IA e validação humana. Documentos enviados podem levar até 24 horas para serem totalmente curados e integrados à base oficial.</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">4. Segregação de Funções (SoD)</h3>
              <p>Para evitar conflitos de interesse e erros operacionais, a plataforma permite a configuração de Segregação de Funções, onde o usuário que realiza o upload do documento não pode ser o mesmo que realiza a aprovação final para integração.</p>
              
              <div className="mt-20 p-8 bg-surface-container rounded-md border border-border text-center">
                <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Última atualização: 15 de Maio de 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface DocConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  data: {
    razaoSocial: string;
    fantasia: string;
    cnpj: string;
    tipoDocumento: string;
    competencia: string;
    nomeArquivo: string;
  };
}

export function DocConfirmationModal({ isOpen, onConfirm, onCancel, data }: DocConfirmationModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300"
        >
          <div 
            className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            onClick={onCancel}
          />
          
          <div
            className="relative w-full max-w-xl bg-background rounded-card shadow-lg overflow-hidden border border-border animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
          >
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-button bg-secondary/10 text-secondary flex items-center justify-center">
                  <FileCheck size={24} />
                </div>
                <div>
                  <h3 className="text-h3 font-medium text-foreground">Confirmação de vínculo</h3>
                  <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Protocolo de Governança</p>
                </div>
              </div>
              <button onClick={onCancel} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-body-sm font-medium text-muted-foreground leading-relaxed bg-surface-container p-6 rounded-md border border-border">
                Você está enviando este documento para o cliente abaixo. Confirme que o documento pertence ao cliente selecionado.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-button bg-background border border-border">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Razão Social</p>
                  <p className="text-body-sm font-medium text-foreground">{data.razaoSocial}</p>
                </div>
                <div className="p-4 rounded-button bg-background border border-border">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Nome Fantasia</p>
                  <p className="text-body-sm font-medium text-foreground">{data.fantasia}</p>
                </div>
                <div className="p-4 rounded-button bg-background border border-border">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1">CNPJ</p>
                  <p className="text-body-sm font-medium text-foreground">{data.cnpj}</p>
                </div>
                <div className="p-4 rounded-button bg-background border border-border">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Tipo de Documento</p>
                  <p className="text-body-sm font-medium text-foreground">{data.tipoDocumento}</p>
                </div>
                <div className="p-4 rounded-button bg-background border border-border">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Competência</p>
                  <p className="text-body-sm font-medium text-foreground">{data.competencia}</p>
                </div>
                <div className="p-4 rounded-button bg-background border border-border">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Arquivo</p>
                  <p className="text-body-sm font-medium text-foreground">{data.nomeArquivo}</p>
                </div>
              </div>

              <div 
                onClick={() => setConfirmed(!confirmed)}
                className={cn(
                  "flex items-start gap-4 p-5 rounded-button border-2 transition-all cursor-pointer",
                  confirmed ? "border-success bg-success/10" : "border-border bg-surface-container"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5",
                  confirmed ? "bg-success border-success" : "bg-background border-border"
                )}>
                  {confirmed && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <p className="text-[11px] font-medium text-foreground leading-tight">
                  Confirmo que este documento pertence ao cliente selecionado e que as informações estão corretas.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onCancel}
                  className="flex-1 py-4 bg-surface-container text-muted-foreground rounded-button text-body-sm font-medium uppercase tracking-widest hover:bg-surface-container-high transition-all"
                >
                  Cancelar
                </button>
                <button
                  disabled={!confirmed}
                  onClick={onConfirm}
                  className={cn(
                    "flex-[2] py-4 rounded-button text-body-sm font-medium uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2",
                    confirmed 
                      ? "bg-primary text-primary-foreground hover:-translate-y-0.5" 
                      : "bg-surface-container text-muted-foreground cursor-not-allowed shadow-none"
                  )}
                >
                  <CheckCircle2 size={16} /> Confirmar e Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface MandatoryClientModalProps {
  isOpen: boolean;
  onSelect: () => void;
}

export function MandatoryClientModal({ isOpen, onSelect }: MandatoryClientModalProps) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300"
        >
          <div 
            className="absolute inset-0 bg-primary/60 backdrop-blur-md" 
          />
          
          <div
            className="relative w-full max-w-md bg-background rounded-card shadow-lg p-10 text-center border border-border animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
            style={{ width: '100%', maxWidth: '448px', minWidth: '320px' }}
          >
            <div className="w-20 h-20 rounded-md bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="text-h2 font-medium text-foreground mb-4 font-display">Ação Bloqueada</h3>
            <p className="text-body-md font-medium text-muted-foreground leading-relaxed mb-10">
              Selecione o cliente ativo antes de prosseguir com o envio do documento.
            </p>

            <button
              onClick={onSelect}
              className="w-full py-5 bg-primary text-primary-foreground rounded-md text-body-sm font-medium uppercase tracking-widest shadow-sm hover:-translate-y-0.5 active:scale-98 transition-all flex items-center justify-center gap-3"
            >
              <Building2 size={18} /> Selecionar Cliente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
