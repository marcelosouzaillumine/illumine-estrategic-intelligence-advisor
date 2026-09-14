export interface SupabaseConfig {
  url: string;
  anonKey: string;
  useStaging: boolean;
}

const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  return undefined;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: getEnvVar('VITE_SUPABASE_URL') || 'http://127.0.0.1:54321',
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY') || '',
    useStaging: getEnvVar('VITE_USE_SUPABASE_STAGING') === 'true',
  };
}
