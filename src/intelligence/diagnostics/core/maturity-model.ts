import { MaturityLevel } from './diagnostic-types';

export interface MaturityLevelDefinition {
  level: MaturityLevel;
  title: string;
  description: string;
  executiveMeaning: string;
}

export const MATURITY_LEVELS: Record<MaturityLevel, MaturityLevelDefinition> = {
  initial: {
    level: "initial",
    title: "Initial",
    description: "Práticas informais e altamente dependentes de esforços individuais.",
    executiveMeaning: "A organização opera de forma reativa. Decisões estratégicas carecem de embasamento sistêmico, aumentando a exposição ao risco."
  },
  developing: {
    level: "developing",
    title: "Developing",
    description: "Práticas estruturadas em silos, com início de padronização.",
    executiveMeaning: "A organização possui práticas estruturadas, porém ainda depende de análises reativas para tomada de decisão global."
  },
  structured: {
    level: "structured",
    title: "Structured",
    description: "Processos formalizados e integrados na maioria das áreas chaves.",
    executiveMeaning: "A organização alcançou estabilidade processual, permitindo uma gestão preditiva de seus principais vetores de valor."
  },
  advanced: {
    level: "advanced",
    title: "Advanced",
    description: "Práticas otimizadas com forte apoio de dados e tecnologia.",
    executiveMeaning: "A organização utiliza inteligência estruturada de forma proativa para alavancar vantagens competitivas e mitigar riscos antes de sua materialização."
  },
  excellence: {
    level: "excellence",
    title: "Excellence",
    description: "Práticas estado da arte, com melhoria contínua e inovação disruptiva.",
    executiveMeaning: "A organização opera como referência absoluta, moldando dinâmicas de mercado através de uma arquitetura estratégica antifrágil."
  }
};
