export enum MemoryConfidenceLevel {
  FACT = 'FACT',                             // e.g. "O EBITDA caiu 5%." (from Engine)
  VALIDATED_INSIGHT = 'VALIDATED_INSIGHT',   // e.g. "O caixa está financiando a expansão." (Engine Insight)
  WORKING_HYPOTHESIS = 'WORKING_HYPOTHESIS', // e.g. "Pode existir pressão comercial." (Executive Discussion)
  EXPLORATORY = 'EXPLORATORY'                // e.g. "Talvez seja necessário revisar pricing." (Human exploration)
}
