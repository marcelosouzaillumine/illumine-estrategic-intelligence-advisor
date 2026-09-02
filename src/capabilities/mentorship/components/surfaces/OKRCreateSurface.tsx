import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { OKRRepository } from '../../repositories/OKRRepository';
import type { KeyResult, KeyResultType } from '../../domain';

const KR_TYPES: { value: KeyResultType; label: string }[] = [
  { value: 'NUMERIC', label: 'Numérico' },
  { value: 'PERCENTAGE', label: 'Percentual (%)' },
  { value: 'BINARY', label: 'Sim/Não' },
  { value: 'MILESTONE', label: 'Milestone (0–n)' },
];

interface OKRCreateSurfaceProps {
  menteeId: string;
  programId: string;
  tenantId: string;
}

interface DraftKR {
  description: string;
  type: KeyResultType;
  startValue: number;
  targetValue: number;
  unit: string;
}

const BLANK_KR: DraftKR = {
  description: '',
  type: 'NUMERIC',
  startValue: 0,
  targetValue: 100,
  unit: '',
};

export const OKRCreateSurface: React.FC<OKRCreateSurfaceProps> = ({ menteeId, programId, tenantId }) => {
  const navigate = useNavigate();
  const [objective, setObjective] = useState('');
  const [quarter, setQuarter] = useState('');
  const [krs, setKRs] = useState<DraftKR[]>([{ ...BLANK_KR }]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!objective.trim()) e.objective = 'Defina o objetivo';
    if (!quarter) e.quarter = 'Selecione o trimestre';
    krs.forEach((kr, i) => {
      if (!kr.description.trim()) e[`kr_${i}`] = 'Descreva o resultado';
      if (kr.targetValue <= kr.startValue && kr.type !== 'BINARY') {
        e[`kr_target_${i}`] = 'Meta deve ser maior que o valor inicial';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addKR = () => setKRs(prev => [...prev, { ...BLANK_KR }]);
  const removeKR = (i: number) => setKRs(prev => prev.filter((_, idx) => idx !== i));
  const updateKR = (i: number, field: keyof DraftKR, value: string | number) =>
    setKRs(prev => prev.map((kr, idx) => idx === i ? { ...kr, [field]: value } : kr));

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const keyResults: KeyResult[] = krs.map((kr, i) => ({
        id: `kr_${Date.now()}_${i}`,
        description: kr.description.trim(),
        type: kr.type,
        startValue: kr.type === 'BINARY' ? 0 : kr.startValue,
        currentValue: kr.type === 'BINARY' ? 0 : kr.startValue,
        targetValue: kr.type === 'BINARY' ? 1 : kr.targetValue,
        unit: kr.unit || undefined,
        progress: 0,
        status: 'ACTIVE',
        updates: [],
      }));

      await OKRRepository.create({
        menteeId,
        programId,
        tenantId,
        objective: objective.trim(),
        quarter,
        keyResults,
        overallProgress: 0,
        status: 'ACTIVE',
        linkedSessionIds: [],
      });

      navigate('/mentee/workspace/journey');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/mentee/workspace/journey')}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-foreground">Novo OKR</h1>
          <p className="text-xs text-muted-foreground">Defina seu objetivo e os resultados-chave</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Objetivo</label>
          <textarea
            value={objective}
            onChange={e => {
              setObjective(e.target.value);
              setErrors(prev => ({ ...prev, objective: '' }));
            }}
            placeholder="Ex: Tornar-me um líder técnico reconhecido até o final do programa"
            rows={3}
            className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none ${errors.objective ? 'border-red-500' : 'border-border'}`}
          />
          {errors.objective && <p className="text-xs text-red-500">{errors.objective}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Trimestre</label>
          <select
            value={quarter}
            onChange={e => {
              setQuarter(e.target.value);
              setErrors(prev => ({ ...prev, quarter: '' }));
            }}
            className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${errors.quarter ? 'border-red-500' : 'border-border'}`}
          >
            <option value="">Selecione...</option>
            {[1, 2, 3, 4].flatMap(q => {
              const y = new Date().getFullYear();
              return [
                <option key={`${y}-Q${q}`} value={`${y}-Q${q}`}>{y} · Q{q}</option>,
                <option key={`${y + 1}-Q${q}`} value={`${y + 1}-Q${q}`}>{y + 1} · Q{q}</option>,
              ];
            })}
          </select>
          {errors.quarter && <p className="text-xs text-red-500">{errors.quarter}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">Resultados-Chave</p>
          {krs.length < 5 && (
            <button
              type="button"
              onClick={addKR}
              className="flex items-center gap-1 text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
            >
              <Plus size={12} />
              Adicionar KR
            </button>
          )}
        </div>

        {krs.map((kr, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">KR {i + 1}</span>
              {krs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKR(i)}
                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                value={kr.description}
                onChange={e => {
                  updateKR(i, 'description', e.target.value);
                  setErrors(prev => ({ ...prev, [`kr_${i}`]: '' }));
                }}
                placeholder="Descreva o resultado mensurável"
                className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${errors[`kr_${i}`] ? 'border-red-500' : 'border-border'}`}
              />
              {errors[`kr_${i}`] && <p className="text-xs text-red-500">{errors[`kr_${i}`]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Tipo</label>
                <select
                  value={kr.type}
                  onChange={e => updateKR(i, 'type', e.target.value as KeyResultType)}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none"
                >
                  {KR_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Unidade</label>
                <input
                  type="text"
                  value={kr.unit}
                  onChange={e => updateKR(i, 'unit', e.target.value)}
                  placeholder="ex: pts, hrs..."
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {kr.type !== 'BOOLEAN' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">Valor Inicial</label>
                  <input
                    type="number"
                    value={kr.startValue}
                    onChange={e => updateKR(i, 'startValue', Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">Meta</label>
                  <input
                    type="number"
                    value={kr.targetValue}
                    onChange={e => {
                      updateKR(i, 'targetValue', Number(e.target.value));
                      setErrors(prev => ({ ...prev, [`kr_target_${i}`]: '' }));
                    }}
                    className={`w-full px-2 py-1.5 bg-background border rounded-lg text-xs text-foreground focus:outline-none ${errors[`kr_target_${i}`] ? 'border-red-500' : 'border-border'}`}
                  />
                  {errors[`kr_target_${i}`] && <p className="text-[10px] text-red-500">{errors[`kr_target_${i}`]}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        Criar OKR
      </button>
    </div>
  );
};
