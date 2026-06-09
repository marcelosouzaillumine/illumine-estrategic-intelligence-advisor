import React, { useState } from 'react';
import { X, Activity, Save, Settings2, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BusinessIdentity } from '../../lib/business-identity-engine';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface BusinessModelOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  currentIdentity: BusinessIdentity;
  onSaved: () => void;
}

export function BusinessModelOverrideModal({
  isOpen,
  onClose,
  clientId,
  currentIdentity,
  onSaved
}: BusinessModelOverrideModalProps) {
  const [formData, setFormData] = useState({
    modeloDeNegocio: currentIdentity.modeloDeNegocio,
    setor: currentIdentity.setor,
    intensidadeCapital: currentIdentity.intensidadeCapital,
    intensidadeEstoque: currentIdentity.intensidadeEstoque,
    previsibilidadeReceita: currentIdentity.previsibilidadeReceita,
    perfilOperacional: currentIdentity.perfilOperacional
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, {
        businessModelValidation: {
          ...formData,
          validatedAt: new Date().toISOString()
        }
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar validação do modelo de negócio.');
    } finally {
      setIsSaving(false);
    }
  };

  const confidence = currentIdentity.inferenceData?.confidenceScore || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Settings2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Validação do Modelo Operacional</h2>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">Human Override</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl border border-rose-100">
              {error}
            </div>
          )}

          {/* Engine Inference Status */}
          <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2 relative z-10">
              <Activity size={14}/> Business Model Inference Engine
            </h4>
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-2xl font-black">{currentIdentity.modeloDeNegocio}</p>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  Confiança do Algoritmo: <span className={cn(
                    "font-bold",
                    confidence > 70 ? "text-emerald-400" : confidence > 40 ? "text-amber-400" : "text-rose-400"
                  )}>{confidence}%</span>
                </p>
              </div>
            </div>

            {currentIdentity.inferenceData?.explainability && currentIdentity.inferenceData.explainability.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700/50 relative z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Modelo inferido devido a:</p>
                <ul className="space-y-1">
                  {currentIdentity.inferenceData.explainability.map((exp, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span> {exp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">Ajuste Manual</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Modelo de Negócio</label>
                <input
                  type="text"
                  value={formData.modeloDeNegocio}
                  onChange={e => setFormData({ ...formData, modeloDeNegocio: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Setor</label>
                <input
                  type="text"
                  value={formData.setor}
                  onChange={e => setFormData({ ...formData, setor: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Intensidade de Capital</label>
                <select
                  value={formData.intensidadeCapital}
                  onChange={e => setFormData({ ...formData, intensidadeCapital: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                >
                  <option value="Asset Light">Asset Light</option>
                  <option value="Asset Moderate">Asset Moderate</option>
                  <option value="Asset Heavy">Asset Heavy</option>
                  <option value="Indefinida">Indefinida</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Previsibilidade de Receita</label>
                <select
                  value={formData.previsibilidadeReceita}
                  onChange={e => setFormData({ ...formData, previsibilidadeReceita: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                >
                  <option value="Alta">Alta</option>
                  <option value="Sazonal/Sensível à Demanda">Sazonal/Sensível à Demanda</option>
                  <option value="Volátil">Volátil</option>
                  <option value="Indefinida">Indefinida</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1">
                Perfil Operacional <HelpCircle size={12} className="text-slate-400" />
              </label>
              <textarea
                value={formData.perfilOperacional}
                onChange={e => setFormData({ ...formData, perfilOperacional: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Validar e Fixar Modelo
          </button>
        </div>
      </div>
    </div>
  );
}
