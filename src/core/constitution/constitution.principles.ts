/**
 * Illumine Platform Constitution™ Principles
 * 
 * These are the immutable laws governing the architecture of the platform.
 * By convention and rule, no system component may violate these constraints.
 */
export const CONSTITUTION_PRINCIPLES = [
  {
    id: 'PRINCIPLE_1',
    title: 'Constitution First',
    description: 'Todo novo Workspace, Module ou Feature nasce obrigatoriamente na Constituição, nunca na Navigation Layer ou Execution Layer.'
  },
  {
    id: 'PRINCIPLE_2',
    title: 'Immutable Registries',
    description: 'Os Registries constitucionais são estritamente declarativos e imutáveis em tempo de execução.'
  },
  {
    id: 'PRINCIPLE_3',
    title: 'Read-Only Resolver',
    description: 'A Constituição é consultada através do Constitution Resolver, que é um serviço inviolável de apenas leitura.'
  },
  {
    id: 'PRINCIPLE_4',
    title: 'Projection Integrity',
    description: 'A Execution Layer (Navigation, Landing) consome a Constituição exclusivamente por meio da Projection API, nunca de forma ad-hoc.'
  },
  {
    id: 'PRINCIPLE_5',
    title: 'Feature Without UI',
    description: 'Uma Feature pode existir sem uma Surface (interface gráfica), atuando exclusivamente via API ou como domínio para Agentes de IA.'
  },
  {
    id: 'PRINCIPLE_6',
    title: 'Decoupled Layers',
    description: 'A Constitution Layer é agnóstica ao produto e não conhece React, abstrações de UI ou dependências da Execution Layer.'
  }
] as const;
