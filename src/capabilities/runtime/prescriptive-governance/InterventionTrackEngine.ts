import { ExecutivePriority, InterventionTrack, TrackArea } from './PrescriptiveTypes';

export class InterventionTrackEngine {
  static groupIntoTracks(actions: ExecutivePriority[]): InterventionTrack[] {
    const trackMap = new Map<TrackArea, ExecutivePriority[]>();

    actions.forEach(action => {
      if (!trackMap.has(action.track)) {
        trackMap.set(action.track, []);
      }
      trackMap.get(action.track)!.push(action);
    });

    const tracks: InterventionTrack[] = [];

    trackMap.forEach((trackActions, trackArea) => {
      // Sort actions within track by priority rank
      trackActions.sort((a, b) => a.priorityRank - b.priorityRank);

      tracks.push({
        track: trackArea,
        title: this.getTrackTitle(trackArea),
        description: this.getTrackDescription(trackArea),
        sequencedActions: trackActions
      });
    });

    return tracks;
  }

  private static getTrackTitle(track: TrackArea): string {
    switch (track) {
      case 'LIQUIDITY': return 'Trilha de Resiliência de Liquidez';
      case 'GOVERNANCE': return 'Trilha de Reestruturação de Governança';
      case 'CAPITAL': return 'Trilha de Otimização de Capital';
      case 'OPERATIONS': return 'Trilha de Eficiência Operacional';
      case 'ESG': return 'Trilha de Adequação ESG';
      default: return 'Trilha de Intervenção Estratégica';
    }
  }

  private static getTrackDescription(track: TrackArea): string {
    switch (track) {
      case 'LIQUIDITY': return 'Ações emergenciais e de ciclo imediato focadas em proteção de caixa e capital de giro.';
      case 'GOVERNANCE': return 'Restabelecimento de alçadas, controles internos e dinâmicas de Board.';
      case 'CAPITAL': return 'Estratégias de funding, desalavancagem e estrutura de capital a longo horizonte.';
      case 'OPERATIONS': return 'Ajuste de capacidade, redução de custos e otimização de margens.';
      case 'ESG': return 'Alinhamento regulatório e fortalecimento de maturidade socioambiental.';
      default: return 'Plano de ação executivo consolidado.';
    }
  }
}
