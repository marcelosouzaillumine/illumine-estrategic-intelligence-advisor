import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ResilienceAntifragilityRadarProps {
  resilienceScore: number;
  antifragilityScore: number;
  vulnerabilityReductionScore: number;
  institutionalLearningScore: number;
  shockAbsorptionScore: number;
  resilienceClassification: string;
  antifragilityValidated: boolean;
  confidenceLevel: string;
  blockedConclusions: string[];
  allowedConclusions: string[];
}

export function ResilienceAntifragilityRadar({
  resilienceScore,
  antifragilityScore,
  vulnerabilityReductionScore,
  institutionalLearningScore,
  shockAbsorptionScore,
  resilienceClassification,
  antifragilityValidated,
  confidenceLevel,
  blockedConclusions,
  allowedConclusions
}: ResilienceAntifragilityRadarProps) {

  const isAntifragileUnlocked = 
    resilienceClassification === 'ANTIFRAGILE' && 
    antifragilityValidated === true && 
    confidenceLevel === 'HIGH';

  const isFailClosed = confidenceLevel === 'LOW';

  const radarData = [
    { dimension: 'Vulnerabilidade', value: vulnerabilityReductionScore, fullMark: 100 },
    { dimension: 'Aprendizado', value: institutionalLearningScore, fullMark: 100 },
    { dimension: 'Absorção Choque', value: shockAbsorptionScore, fullMark: 100 },
    { dimension: 'Antifragilidade', value: antifragilityScore, fullMark: 100 },
    { dimension: 'Resiliência', value: resilienceScore, fullMark: 100 }
  ];

  // Determine radar stroke color based on classification
  let radarStroke = '#71717a'; // zinc-500
  let radarFill = 'rgba(113, 113, 122, 0.15)';

  if (isFailClosed) {
    radarStroke = '#52525b'; // zinc-600 muted
    radarFill = 'rgba(82, 82, 91, 0.1)';
  } else if (isAntifragileUnlocked) {
    radarStroke = '#34d399'; // emerald-400
    radarFill = 'rgba(52, 211, 153, 0.12)';
  } else if (resilienceClassification === 'RESILIENT' || resilienceClassification === 'ADAPTIVE') {
    radarStroke = '#818cf8'; // indigo-400
    radarFill = 'rgba(129, 140, 248, 0.12)';
  } else if (resilienceClassification === 'INSTITUTIONALLY_FRAGILE') {
    radarStroke = '#f87171'; // red-400
    radarFill = 'rgba(248, 113, 113, 0.12)';
  }

  const classificationLabel: Record<string, string> = {
    'INSTITUTIONALLY_FRAGILE': 'Institutionally Fragile',
    'STRUCTURALLY_STABLE': 'Structurally Stable',
    'RESILIENT': 'Resilient',
    'ADAPTIVE': 'Adaptive',
    'ANTIFRAGILE': 'Antifragile'
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono flex flex-col">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
        Resilience & Antifragility Radar
      </h3>

      {/* Classification Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isAntifragileUnlocked ? (
            <ShieldCheck size={16} className="text-emerald-400" />
          ) : (
            <Lock size={14} className="text-zinc-600" />
          )}
          <span className={`text-sm font-bold tracking-wider ${
            isAntifragileUnlocked ? 'text-emerald-400' :
            isFailClosed ? 'text-zinc-600' :
            resilienceClassification === 'INSTITUTIONALLY_FRAGILE' ? 'text-red-400' :
            'text-zinc-300'
          }`}>
            {classificationLabel[resilienceClassification] || resilienceClassification}
          </span>
        </div>
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${
          confidenceLevel === 'HIGH' ? 'text-emerald-500 border-emerald-800 bg-emerald-950/30' :
          confidenceLevel === 'MODERATE' ? 'text-yellow-500 border-yellow-800 bg-yellow-950/30' :
          'text-red-500 border-red-800 bg-red-950/30'
        }`}>
          Conf: {confidenceLevel}
        </span>
      </div>

      {/* Radar Chart */}
      <div className={`w-full ${isFailClosed ? 'opacity-40' : ''}`} style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis 
              dataKey="dimension" 
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} 
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#3f3f46', fontSize: 9 }}
              axisLine={false}
            />
            <Radar
              name="Resilience"
              dataKey="value"
              stroke={radarStroke}
              fill={radarFill}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#d4d4d8'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Antifragility Lock Status */}
      {!isAntifragileUnlocked && (
        <div className="mt-3 p-2.5 bg-zinc-900/80 border border-zinc-800 rounded flex items-start gap-2.5">
          <Lock size={14} className="text-zinc-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Antifragility badge locked. Requires: <span className="text-zinc-400">resilienceClassification = ANTIFRAGILE</span>, <span className="text-zinc-400">antifragilityValidated = true</span>, <span className="text-zinc-400">confidenceLevel = HIGH</span>.
          </p>
        </div>
      )}

      {/* Blocked / Allowed Conclusions */}
      {(blockedConclusions.length > 0 || allowedConclusions.length > 0) && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {blockedConclusions.length > 0 && (
            <div className="p-2 bg-red-950/30 border border-red-900/40 rounded">
              <p className="text-[9px] text-red-500 uppercase tracking-widest font-bold mb-1">Blocked</p>
              {blockedConclusions.map((c, i) => (
                <p key={i} className="text-[10px] text-red-400/70">{c}</p>
              ))}
            </div>
          )}
          {allowedConclusions.length > 0 && (
            <div className="p-2 bg-zinc-900/50 border border-zinc-800 rounded">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Allowed</p>
              {allowedConclusions.map((c, i) => (
                <p key={i} className="text-[10px] text-zinc-400">{c}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {isFailClosed && (
        <div className="mt-3 p-2.5 bg-red-950/40 border border-red-900/40 rounded flex items-start gap-2">
          <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-red-400">Visualização restrita por segurança fiduciária (Baixa Confiança Longitudinal). O radar de resiliência opera em modo prudencial.</p>
        </div>
      )}
    </div>
  );
}
