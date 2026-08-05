import React, { useState } from 'react';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { useTranslation } from 'react-i18next';
import { Building2, User, Mail, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveDealRoomComposition } from '@application/revenue/deal-room/composition/resolveDealRoomComposition';
import { InitializeBusinessContextCommand } from '@application/revenue/deal-room/commands/InitializeBusinessContextCommand';
import { LeadSource } from '@domain/revenue/opportunity/value-objects/LeadSource';

export function QualificationWorkspace({ stageId }: { stageId: string }) {
  const { t } = useTranslation();
  
  // Mock local state to simulate an interactive form
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    segment: 'Enterprise'
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStartOpportunity = async () => {
    if (!formData.companyName) return;
    
    setIsSaving(true);
    try {
      const { commandHandler } = resolveDealRoomComposition();
      const command = new InitializeBusinessContextCommand(
        'stark-global', // mock tenantId
        formData.companyName,
        formData.contactName,
        formData.contactEmail,
        formData.segment,
        'marcelo.souza',
        'revenue-office',
        LeadSource.INTERNAL_EXECUTIVE,
        null,
        0
      );

      const newId = await commandHandler.executeInitializeContext(command);
      
      // Redirect to the new Opportunity Deal Room
      navigate(`/executive/revenue/deal-room/${newId}`);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto py-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <ExecutiveText variant="moduleTitle" className="text-2xl mb-2">{t('dealRoom.qualification.title', 'Qualification Workspace')}</ExecutiveText>
          <ExecutiveText variant="body" className="text-muted-foreground">{t('dealRoom.qualification.desc', 'Coleta de dados iniciais e qualificação do Lead (MQL -> SQL).')}</ExecutiveText>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
          <Target size={24} />
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-card rounded-2xl border border-border p-8 shadow-sm">
        
        <div>
          <ExecutiveText variant="label" className="mb-4 block text-base border-b border-border pb-2">Informações da Empresa</ExecutiveText>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <Building2 size={14} /> Nome da Empresa
          </label>
          <input 
            type="text" 
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Ex: Stark Industries"
            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Segmento
          </label>
          <select 
            name="segment"
            value={formData.segment}
            onChange={handleChange}
            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm focus:outline-none focus:border-primary transition-all"
          >
            <option value="Enterprise">Enterprise</option>
            <option value="Corporate">Corporate</option>
            <option value="SMB">SMB</option>
          </select>
        </div>

        <div className="mt-6">
          <ExecutiveText variant="label" className="mb-4 block text-base border-b border-border pb-2">Contato Principal (Sponsor)</ExecutiveText>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <User size={14} /> Nome do Contato
          </label>
          <input 
            type="text" 
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Ex: Tony Stark"
            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <Mail size={14} /> E-mail
          </label>
          <input 
            type="email" 
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="tony@stark.com"
            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>

      </div>

      <div className="mt-8 p-6 rounded-xl border border-primary/20 bg-primary/5 flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
            <Target size={16} />
          </div>
          <div>
            <ExecutiveText variant="label" className="text-sm font-bold mb-1 text-primary">Ação Requerida</ExecutiveText>
            <ExecutiveText variant="caption" className="text-muted-foreground">Preencha os dados básicos de qualificação para iniciar a Saga Comercial desta oportunidade.</ExecutiveText>
          </div>
        </div>
        {stageId === 'qualification' && (
          <button 
            onClick={handleStartOpportunity}
            disabled={isSaving || !formData.companyName}
            className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Iniciando...' : 'Initialize Context'}
          </button>
        )}
      </div>
    </div>
  );
}
