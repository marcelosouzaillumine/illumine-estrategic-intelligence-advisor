export class Logger {
  public static info(message: string, context?: Record<string, any>): void {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, context || '');
  }

  public static warn(message: string, context?: Record<string, any>): void {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, context || '');
  }

  public static error(message: string, context?: Record<string, any>): void {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, context || '');
  }
}
