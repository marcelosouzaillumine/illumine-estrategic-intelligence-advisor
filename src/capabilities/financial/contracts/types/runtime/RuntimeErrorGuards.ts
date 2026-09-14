/**
 * Runtime Error Guards
 * 
 * Padrão oficial de Runtime Narrowing da plataforma Illumine Governance.
 * Centraliza o tratamento de unknown capturados em blocos catch para
 * extração segura de propriedades e preservação do Type Safety fiduciário.
 */

export interface ErrorLike {
  message: string;
  name?: string;
  stack?: string;
}

export interface ViolationLike extends ErrorLike {
  violationCode: string;
}

/**
 * Valida se um payload desconhecido possui a estrutura básica de um Error (contendo 'message').
 */
export function isErrorLike(error: unknown): error is ErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Valida se um payload desconhecido possui a estrutura de uma violação (contendo 'violationCode').
 */
export function isViolationLike(error: unknown): error is ViolationLike {
  return (
    isErrorLike(error) &&
    'violationCode' in error &&
    typeof (error as Record<string, unknown>).violationCode === 'string'
  );
}

/**
 * Extrai a mensagem de erro de forma segura, fazendo fallback para stringificação se necessário.
 */
export function getErrorMessage(error: unknown, fallback = 'Unknown error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (isErrorLike(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return fallback;
  }
}

/**
 * Extrai o stack trace de forma segura, retornando undefined caso não exista.
 */
export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  if (isErrorLike(error)) {
    return error.stack;
  }
  return undefined;
}
