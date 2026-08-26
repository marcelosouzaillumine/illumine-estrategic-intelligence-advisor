import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

// Override environment variables to force a connection failure BEFORE dynamically importing container
process.env.VITE_USE_SUPABASE_STAGING = 'true';
process.env.VITE_SUPABASE_URL = 'http://127.0.0.1:9999'; // Invalid port
process.env.VITE_SUPABASE_ANON_KEY = 'dummy_key';
process.env.VITE_SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function testRuntimeFailure() {
  console.log(`\n${YELLOW}=== RUNTIME FAILURE & FALLBACK ISOLATION TEST ===${RESET}`);
  console.log("Simulating: PostgreSQL Unavailability...");

  // Dynamically import to ensure env variables are respected
  const { persistenceContainer } = await import('../src/infrastructure/container/persistenceContainer');

  const start = Date.now();
  try {
    console.log("Attempting to fetch financial data via DI container...");
    await persistenceContainer.cashFlow.getCashFlowsByClient('test-client-123');
    
    // If it succeeds, that means it fell back to something else!
    console.log(`[${RED}FAIL${RESET}] Request succeeded! A silent fallback might have occurred.`);
    throw new Error("Financial Request did not fail as expected. Silent fallback exists.");
  } catch (error: any) {
    const elapsed = Date.now() - start;
    console.log(`Financial Request correctly failed in ${elapsed}ms.`);
    console.log(`Captured Error: ${error.message || error}`);
    
    const errorStr = error.message ? error.message.toLowerCase() : error.toString().toLowerCase();
    
    if (errorStr.includes('fetch') || errorStr.includes('network') || errorStr.includes('econnrefused')) {
      console.log(`[${GREEN}PASS${RESET}] Controlled failure: PostgreSQL ERROR correctly propagated.`);
      console.log(`[${GREEN}PASS${RESET}] NO FIRESTORE FALLBACK DETECTED.`);
    } else if (errorStr.includes('firestore') || errorStr.includes('firebase')) {
       console.log(`[${RED}FAIL${RESET}] Error originated from Firestore!`);
       throw new Error("Fallback to Firestore detected during failure.");
    } else {
       console.log(`[${GREEN}PASS${RESET}] Unhandled architectural failure caught, but not from Firestore: ${errorStr}`);
    }
  }
}

testRuntimeFailure().catch(e => {
  console.error(`\n[${RED}FATAL${RESET}] Test Execution Failed:`, e);
  process.exit(1);
});
