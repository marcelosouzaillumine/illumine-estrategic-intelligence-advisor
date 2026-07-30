export class ExecutiveGreetingEngine {
  public static generateGreeting(userName: string, hours: number = new Date().getHours()): string {
    let period = 'Bom dia';
    if (hours >= 12 && hours < 18) period = 'Boa tarde';
    if (hours >= 18 || hours < 5) period = 'Boa noite';

    return `${period}, ${userName}. A Illumine OS™ apresenta seu Executive Morning Briefing.`;
  }
}
