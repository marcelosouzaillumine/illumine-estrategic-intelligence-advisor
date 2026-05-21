
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="lgpd-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-md" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-background rounded-card shadow-lg overflow-hidden border border-border flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-primary p-6 md:p-10 text-primary-foreground relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <ShieldCheck size={160} />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-button bg-white/10 flex items-center justify-center mb-6">
                  <Lock size={32} className="text-secondary" />
                </div>
                <h2 className="text-h1 font-medium font-display tracking-tight leading-none mb-4">
                  Termos & Governança
                </h2>
                <p className="text-primary-foreground/60 text-body-md font-medium w-full max-w-none">
                  Para prosseguir com o acesso à plataforma Illumine Strategic Intelligence & Advisor, é necessário revisar e aceitar os termos de conformidade e governança de dados.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {/* LGPD */}
                <div 
                  className={cn(
                    "flex items-start gap-5 p-6 rounded-md border-2 transition-all cursor-pointer group",
                    accepted.lgpd ? "border-success bg-success/10" : "border-border bg-surface-container hover:border-primary/20"
                  )}
                  onClick={() => setAccepted(prev => ({ ...prev, lgpd: !prev.lgpd }))}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-button border-2 flex items-center justify-center transition-all mt-1 shrink-0",
                    accepted.lgpd ? "bg-success border-success" : "bg-background border-border group-hover:border-primary"
                  )}>
                    {accepted.lgpd && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div>
                    <h4 className="text-h3 font-medium text-foreground mb-1">Lei Geral de Proteção de Dados (LGPD)</h4>
                    <p className="text-body-sm text-muted-foreground leading-relaxed font-medium">
                      Confirmo que estou ciente do tratamento de dados pessoais realizado pela plataforma, em total conformidade com a Lei nº 13.709/2018.
                    </p>
                  </div>
                </div>

                {/* Policies */}
                <div 
                  className={cn(
                    "flex items-start gap-5 p-6 rounded-md border-2 transition-all cursor-pointer group",
                    accepted.policies ? "border-success bg-success/10" : "border-border bg-surface-container hover:border-primary/20"
                  )}
                  onClick={() => setAccepted(prev => ({ ...prev, policies: !prev.policies }))}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-button border-2 flex items-center justify-center transition-all mt-1 shrink-0",
                    accepted.policies ? "bg-success border-success" : "bg-background border-border group-hover:border-primary"
                  )}>
                    {accepted.policies && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-h3 font-medium text-foreground mb-1">Políticas da Plataforma</h4>
                    </div>
                    <p className="text-body-sm text-muted-foreground leading-relaxed font-medium">
                      Aceito as diretrizes de uso, confidencialidade e responsabilidade operacional estabelecidas para o ambiente Illumine Strategic Intelligence & Advisor.
                    </p>
                  </div>
                </div>

                {/* Curation */}
                <div 
                  className={cn(
                    "flex items-start gap-5 p-6 rounded-md border-2 transition-all cursor-pointer group",
                    accepted.curation ? "border-success bg-success/10" : "border-border bg-surface-container hover:border-primary/20"
                  )}
                  onClick={() => setAccepted(prev => ({ ...prev, curation: !prev.curation }))}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-button border-2 flex items-center justify-center transition-all mt-1 shrink-0",
                    accepted.curation ? "bg-success border-success" : "bg-background border-border group-hover:border-primary"
                  )}>
                    {accepted.curation && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div>
                    <h4 className="text-h3 font-medium text-foreground mb-1">Ciência de Curadoria</h4>
                    <p className="text-body-sm text-muted-foreground leading-relaxed font-medium">
                      Compreendo que toda informação enviada passa por processos de curadoria e validação humana para garantir a integridade dos indicadores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between shrink-0">
                <button 
                  onClick={() => setShowFullTerms(true)}
                  className="flex items-center gap-2 text-body-sm font-medium uppercase tracking-widest text-secondary hover:underline"
                >
                  <FileText size={14} /> Ler Termos Completos
                </button>
                <div className="flex items-center gap-2 text-[9px] font-medium text-muted-foreground">
                  <Info size={12} /> Versão 1.0.2 (Mai/2026)
                </div>
              </div>

              <button
                disabled={!allAccepted}
                onClick={onAccept}
                className={cn(
                  "w-full py-5 rounded-md text-body-sm font-medium uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-sm shrink-0",
                  allAccepted 
                    ? "bg-primary text-primary-foreground hover:-translate-y-0.5 active:scale-98" 
                    : "bg-surface-container text-muted-foreground cursor-not-allowed shadow-none"
                )}
              >
                Confirmar e Entrar <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Full Terms Modal */}
      {showFullTerms && (
        <motion.div 
          key="full-terms"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-6"
        >
          <div 
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            onClick={() => setShowFullTerms(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl bg-background rounded-card shadow-lg overflow-hidden h-[80vh] flex flex-col border border-border"
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
              <h1 className="text-4xl font-black mb-8">Políticas de Governança Illumine Strategic Intelligence & Advisor</h1>
              <p className="text-lg text-slate-600 mb-8">Esta plataforma foi desenvolvida para garantir a máxima transparência e integridade na assessoria estratégica corporativa.</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">1. Proteção de Dados (LGPD)</h3>
              <p>O Illumine Strategic Intelligence & Advisor coleta e processa dados em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Os dados financeiros e operacionais inseridos são utilizados exclusivamente para a geração de indicadores estratégicos e suporte à tomada de decisão da organização contratante.</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">2. Confidencialidade Estrutural</h3>
              <p>Todas as informações transitadas no ambiente Illumine Strategic Intelligence & Advisor são protegidas por protocolos de criptografia em repouso e em trânsito. O acesso é restrito a usuários autorizados via autenticação federada (Google Workspace).</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">3. Protocolo de Curadoria</h3>
              <p>A integridade dos dashboards e indicadores depende da veracidade dos dados importados. Por este motivo, o Illumine Strategic Intelligence & Advisor utiliza um sistema híbrido de processamento de IA e validação humana. Documentos enviados podem levar até 24 horas para serem totalmente curados e integrados à base oficial.</p>
              
              <h3 className="text-xl font-bold mt-10 mb-4">4. Segregação de Funções (SoD)</h3>
              <p>Para evitar conflitos de interesse e erros operacionais, a plataforma permite a configuração de Segregação de Funções, onde o usuário que realiza o upload do documento não pode ser o mesmo que realiza a aprovação final para integração.</p>
              
              <div className="mt-20 p-8 bg-surface-container rounded-md border border-border text-center">
                <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Última atualização: 15 de Maio de 2026</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="doc-confirmation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        >
          <div 
            className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            onClick={onCancel}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-background rounded-card shadow-lg overflow-hidden border border-border"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MandatoryClientModalProps {
  isOpen: boolean;
  onSelect: () => void;
}

export function MandatoryClientModal({ isOpen, onSelect }: MandatoryClientModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="mandatory-client"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-md" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-background rounded-card shadow-lg p-10 text-center border border-border"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
