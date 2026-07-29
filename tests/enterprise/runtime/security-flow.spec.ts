import { JWTProvider, AuthorizationService } from '../../../packages/security/src/index';

export function testSecurityFlow(): boolean {
  // 1. Sign & Verify JWT Token
  const token = JWTProvider.sign({
    userId: 'usr-cfo-01',
    tenantId: 'tnt-alpha',
    roles: ['CFO'],
    permissions: ['READ_FINANCE']
  });

  const payload = JWTProvider.verify(token);
  if (payload.userId !== 'usr-cfo-01' || !payload.roles.includes('CFO')) {
    throw new Error('Falha no teste de verificação JWT');
  }

  // 2. Test Authorization Service com integração SEE Engine
  const authorized = AuthorizationService.authorizeUserAction(
    payload.userId,
    payload.roles,
    'financial.dashboard',
    'read'
  );

  if (!authorized) {
    throw new Error('Falha no teste de autorização integrada ao SEE Engine');
  }

  return true;
}
