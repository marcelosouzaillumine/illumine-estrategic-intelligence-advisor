import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Trophy, Target } from 'lucide-react';
import { OrganizationalAchievementContract } from '../../../../packages/domain/executive-contracts/src/companion/OrganizationalAchievementContract';

export interface AchievementGalleryProps {
  readonly achievements?: readonly OrganizationalAchievementContract[];
}

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) return null;

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-amber-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-foreground">Achievement Gallery™</h3>
        </div>
        <ExecutiveBadge variant="warning" className="font-mono">
          {achievements.length} Conquistas Registradas
        </ExecutiveBadge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
        {achievements.map((ach) => (
          <div key={ach.achievementId} className="p-3 rounded-lg bg-background/50 border border-border/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-300 text-xs">{ach.title}</span>
                {ach.isSimulatedBenchmark && (
                  <ExecutiveBadge variant="warning" className="text-[8px] font-mono">SIMULADO</ExecutiveBadge>
                )}
              </div>
              <p className="text-muted-foreground text-[11px] mb-2">{ach.description}</p>
            </div>
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px]">
              <span className="font-bold text-amber-400 block mb-0.5 flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-400" /> PRÓXIMA CONQUISTA SUGERIDA:
              </span>
              <span className="text-foreground">{ach.suggestedNextAchievement}</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
