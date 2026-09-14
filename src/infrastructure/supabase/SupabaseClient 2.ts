import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './SupabaseConfig';

let supabaseClientInstance: SupabaseClient | null = null;
let currentAccessTokenFetcher: (() => Promise<string | null>) | null = null;

/**
 * Initializes and returns the Supabase client.
 * For Third-Party Auth (Firebase), we intercept fetch to inject the latest Firebase JWT.
 */
export function getSupabaseClient(): SupabaseClient {
  const config = getSupabaseConfig();

  if (!config.useStaging) {
    throw new Error('Supabase client requested but VITE_USE_SUPABASE_STAGING is not true.');
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: process.env.NODE_ENV !== 'test',
        persistSession: process.env.NODE_ENV !== 'test',
        detectSessionInUrl: process.env.NODE_ENV !== 'test'
      },
      global: {
        fetch: async (url, options) => {
          if (currentAccessTokenFetcher) {
            const token = await currentAccessTokenFetcher();
            if (token) {
              const headers = new Headers(options?.headers);
              headers.set('Authorization', `Bearer ${token}`);
              return fetch(url, { ...options, headers });
            }
          }
          return fetch(url, options);
        }
      }
    });
  }

  return supabaseClientInstance;
}

/**
 * Registers the function used to retrieve the current Firebase JWT.
 * This should be called by the Identity adapter or Auth provider upon initialization.
 */
export function registerSupabaseTokenFetcher(fetcher: () => Promise<string | null>) {
  currentAccessTokenFetcher = fetcher;
}
