export interface JWTPayload {
  userId: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

export class JWTProvider {
  public static sign(payload: Omit<JWTPayload, 'exp'>): string {
    const fullPayload: JWTPayload = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1h
    };
    return `jwt.${btoa(JSON.stringify(fullPayload))}.signature`;
  }

  public static verify(token: string): JWTPayload {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      throw new Error('JWT Token Inválido');
    }
    return JSON.parse(atob(parts[1]));
  }
}
