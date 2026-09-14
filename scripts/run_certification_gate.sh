#!/bin/bash
set -euo pipefail

export VITE_SUPABASE_URL="http://localhost:54321"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYxNTg3ODgxMiwiaXNzIjoic3VwYWJhc2UiLCJyb2xlIjoiYW5vbiJ9.fake"
export VITE_SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYxNTg3ODgxMiwiaXNzIjoic3VwYWJhc2UiLCJyb2xlIjoic2VydmljZV9yb2xlIn0.fake"

echo "=================================================="
echo "ILLUMINE — PHASE 6 GATE C CERTIFICATION"
echo "=================================================="

FAILED=0

run_gate() {
  local name=$1
  local cmd=$2
  
  if eval "$cmd" > gate_${name// /_}.log 2>&1; then
    printf "[PASS] %s\n" "$name"
  else
    printf "[FAIL] %s\n" "$name"
    FAILED=1
  fi
}

run_gate "Typecheck" "npm run typecheck"

# Zero-Masking Policy: We exclude scripts folder because automation scripts can have it. We check src/capabilities and src/core
run_gate "Zero-Masking Policy" "! grep -qR '@ts-nocheck' src/capabilities src/core"

# Firestore Boundary: No firebase/firestore in financial core
run_gate "Firestore Boundary" "! grep -qR 'firebase/firestore' src/capabilities/financial/domain src/capabilities/financial/intelligence src/capabilities/financial/application/usecases"

run_gate "Legacy Financial Tests" "npx vitest run src/tests/balance-sheet"

run_gate "Intelligence Engine" "npx tsx scripts/test-intelligence-engine.ts"

run_gate "Performance" "npx tsx scripts/test-performance-scale.ts"

run_gate "Runtime Failure" "npx tsx scripts/test-runtime-failure.ts"

run_gate "Capability Boundary" "grep -q 'CapabilityNotAvailableError' src/core/runtime/financial-governance/certification/FinancialCertificationLedger.ts"

run_gate "Final Invariants" "npx tsx scripts/test-financial-invariants.ts"

echo "=================================================="

if [ $FAILED -eq 0 ]; then
  echo "GATE C: CERTIFIED"
  echo "PHASE 6: CLOSED"
  echo "PHASE 7: AUTHORIZED"
  echo "=================================================="
  exit 0
else
  echo "GATE C: NOT CERTIFIED"
  echo "PHASE 6: BLOCKED"
  echo "PHASE 7: UNAUTHORIZED"
  echo "=================================================="
  exit 1
fi
