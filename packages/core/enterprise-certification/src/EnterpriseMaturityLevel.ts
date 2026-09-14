export enum EnterpriseMaturityLevel {
  FRAGMENTED = 'Fragmented',             // 0-20
  CONNECTED = 'Connected',               // 21-40
  INTEGRATED = 'Integrated',             // 41-60
  INTELLIGENT = 'Intelligent',           // 61-80
  NETWORKED_ENTERPRISE = 'Networked Enterprise' // 81-100
}

export class EnterpriseMaturityEvaluator {
  public static getLevelForScore(score: number): EnterpriseMaturityLevel {
    if (score <= 20) return EnterpriseMaturityLevel.FRAGMENTED;
    if (score <= 40) return EnterpriseMaturityLevel.CONNECTED;
    if (score <= 60) return EnterpriseMaturityLevel.INTEGRATED;
    if (score <= 80) return EnterpriseMaturityLevel.INTELLIGENT;
    return EnterpriseMaturityLevel.NETWORKED_ENTERPRISE;
  }
}
