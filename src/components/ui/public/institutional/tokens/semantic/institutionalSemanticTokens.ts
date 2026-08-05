import { physicalTokens } from '../physical/institutionalTokens';

export const semanticTokens = {
  typography: {
    hero: {
      title: {
        scale: physicalTokens.typography.scale['Display XL'],
        weight: physicalTokens.typography.weight.bold,
        color: physicalTokens.colors.base.white,
      },
      lead: {
        scale: physicalTokens.typography.scale['Body XL'],
        weight: physicalTokens.typography.weight.medium,
        color: physicalTokens.colors.slate[400],
      }
    },
    section: {
      label: {
        scale: physicalTokens.typography.scale['Label'],
        weight: physicalTokens.typography.weight.bold,
        color: physicalTokens.colors.amber[500],
        textTransform: 'uppercase',
      },
      title: {
        scale: physicalTokens.typography.scale['Heading XL'],
        weight: physicalTokens.typography.weight.bold,
        color: physicalTokens.colors.base.white,
      },
      lead: {
        scale: physicalTokens.typography.scale['Body L'],
        weight: physicalTokens.typography.weight.medium,
        color: physicalTokens.colors.slate[400],
      }
    },
    card: {
      title: {
        scale: physicalTokens.typography.scale['Heading M'],
        weight: physicalTokens.typography.weight.bold,
        color: physicalTokens.colors.base.white,
      }
    },
    editorial: {
      body: {
        scale: physicalTokens.typography.scale['Body L'],
        weight: physicalTokens.typography.weight.regular,
        color: physicalTokens.colors.slate[400],
      },
      quote: {
        scale: physicalTokens.typography.scale['Heading M'],
        weight: physicalTokens.typography.weight.medium,
        color: physicalTokens.colors.base.white,
        fontStyle: 'italic',
      }
    },
    executive: {
      finding: {
        scale: physicalTokens.typography.scale['Body XL'],
        weight: physicalTokens.typography.weight.medium,
        color: physicalTokens.colors.base.white,
      },
      evidence: {
        scale: physicalTokens.typography.scale['Body M'],
        weight: physicalTokens.typography.weight.regular,
        color: physicalTokens.colors.slate[300],
      }
    },
    metric: {
      value: {
        scale: physicalTokens.typography.scale['Metric'],
        weight: physicalTokens.typography.weight.bold,
        color: physicalTokens.colors.base.white,
      },
      label: {
        scale: physicalTokens.typography.scale['Body S'],
        weight: physicalTokens.typography.weight.medium,
        color: physicalTokens.colors.slate[500],
      }
    }
  },
  surface: {
    primary: physicalTokens.colors.background.default,
    secondary: physicalTokens.colors.background.elevated,
    tertiary: physicalTokens.colors.background.subtle,
  },
  text: {
    primary: physicalTokens.colors.base.white,
    secondary: physicalTokens.colors.slate[400],
    tertiary: physicalTokens.colors.slate[500],
    accent: physicalTokens.colors.amber[500],
  },
  layout: {
    maxWidth: {
      reading: physicalTokens.layout.maxWidth.reading,
      hero: physicalTokens.layout.maxWidth.hero,
      container: physicalTokens.layout.maxWidth.container,
    }
  }
};
