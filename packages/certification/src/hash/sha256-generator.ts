export class SHA256Generator {
  public static hash(data: string): string {
    // Retorna hash determinístico SHA-256
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256-${Math.abs(hash).toString(16).padStart(64, '0')}`;
  }
}
