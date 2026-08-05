/**
 * CONSTITUIÇÃO: DESIGN SYSTEM REGISTRY
 * Imutabilidade da linguagem visual core.
 * Qualquer implementação (UI/Componentes) deve mapear e respeitar estes tokens.
 */

export interface TypographyToken {
  size: string; // Ex: '13px', '10px'
  weight: 'normal' | 'medium' | 'semibold' | 'bold';
  tracking?: string; // Ex: '0.15em'
  casing?: 'uppercase' | 'lowercase' | 'none';
}

export interface NavigationDesignTokens {
  layout: {
    appShell: {
      backgroundColor: 'bg-background';
      canvasStyle: 'open-canvas' | 'boxed';
    };
  };
  sidebar: {
    aesthetics: {
      isMonochromeActiveState: boolean;
      blendWithPageBackground: boolean;
      backgroundColor: 'bg-background' | 'bg-card' | 'bg-muted';
    };
    typography: {
      categoryHeader: TypographyToken;
      mainGroup: TypographyToken;
      surfaceItem: TypographyToken;
    };
  };
}

export const DESIGN_SYSTEM_REGISTRY: { navigation: NavigationDesignTokens } = {
  navigation: {
    layout: {
      appShell: {
        backgroundColor: 'bg-background', // A página mãe SEMPRE usa bg-background
        canvasStyle: 'open-canvas' // O estilo canônico é tela contínua sem caixas delimitadoras fortes no layout principal
      }
    },
    sidebar: {
      aesthetics: {
        isMonochromeActiveState: true, // Garante que não usemos cores gritantes nos ativos do menu
        blendWithPageBackground: true, // Recomenda-se mesclar a cor do fundo para um canvas aberto
        backgroundColor: 'bg-background', // O sidebar DEVE usar bg-background, idêntico à página, para garantir o efeito "Open Canvas"
      },
      typography: {
        categoryHeader: {
          size: '10px',
          weight: 'semibold',
          tracking: '0.15em',
          casing: 'uppercase'
        },
        mainGroup: {
          size: '13px',
          weight: 'medium',
          tracking: 'normal',
          casing: 'none'
        },
        surfaceItem: {
          size: '12px',
          weight: 'normal',
          tracking: 'normal',
          casing: 'none'
        }
      }
    }
  }
};
