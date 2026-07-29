/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fitness Function Guardrail for Navigation Architecture & Registry.
 * Enforces strict alignment between docs/architecture/registry/navigation-registry.json,
 * src/app/navigation.ts, and src/app/routes.tsx.
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️  Running Navigation Registry Fitness Function Guardrail...\n');

const registryPath = path.join(process.cwd(), 'docs/architecture/registry/navigation-registry.json');
const navPath = path.join(process.cwd(), 'src/app/navigation.ts');
const routesPath = path.join(process.cwd(), 'src/app/routes.tsx');

if (!fs.existsSync(registryPath)) {
  console.error('❌ FATAL: navigation-registry.json missing at:', registryPath);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const navContent = fs.readFileSync(navPath, 'utf8');
const routesContent = fs.readFileSync(routesPath, 'utf8');

// Parse sidebar items from navContent
const sidebarMatches = [...navContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const sidebarSet = new Set(sidebarMatches);

// Parse route handlers from routesContent
const handledRouteMatches = [...routesContent.matchAll(/currentPage\s*(?:as\s+string)?\s*===\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const handledRouteSet = new Set(handledRouteMatches);

let violations = 0;
const allowedCategories = new Set(['PRIMARY', 'CONTEXTUAL', 'ADMINISTRATION', 'REAL_ORPHAN', 'CONDITIONAL']);

registry.routes.forEach(entry => {
  const { id, navigation, conditions, lifecycle } = entry;

  // 1. Fitness Check 1: Allowed Category
  if (!allowedCategories.has(navigation.category)) {
    console.error(`❌ [NAVIGATION VIOLATION] Route '${id}' has unknown category '${navigation.category}'.`);
    violations++;
  }

  // 2. Fitness Check 2: Route registered must exist in routes.tsx (if component is defined)
  const isHandledInRoutes = handledRouteSet.has(id) || routesContent.includes(`'${id}'`) || routesContent.includes(`"${id}"`);
  if (!isHandledInRoutes && lifecycle.status !== 'DEPRECATED' && entry.component !== null) {
    console.error(`❌ [NAVIGATION VIOLATION] Route '${id}' is registered in registry but NOT handled in routes.tsx.`);
    violations++;
  }

  // 3. Fitness Check 3: CONTEXTUAL pages must NOT appear in Sidebar Menu
  if (navigation.category === 'CONTEXTUAL' && sidebarSet.has(id)) {
    console.error(`❌ [NAVIGATION VIOLATION] Contextual page '${id}' is forbidden in AppSidebar menu.`);
    violations++;
  }

  // 4. Fitness Check 4: Master-only pages must belong to ADMINISTRATION or CONDITIONAL category
  if (conditions.masterOnly && navigation.category !== 'ADMINISTRATION' && navigation.category !== 'CONDITIONAL') {
    console.error(`❌ [NAVIGATION VIOLATION] Master-only page '${id}' must belong to ADMINISTRATION or CONDITIONAL category (Found: ${navigation.category}).`);
    violations++;
  }

  // 5. Fitness Check 5: REAL_ORPHAN pages cannot be visible in Sidebar Menu
  if (navigation.category === 'REAL_ORPHAN' && navigation.visibleInSidebar) {
    console.error(`❌ [NAVIGATION VIOLATION] Real orphan page '${id}' cannot be visible in Sidebar Menu.`);
    violations++;
  }

  // 6. Fitness Check 6: CANONICAL pages must have an owner
  if (lifecycle.status === 'CANONICAL' && (!lifecycle.owner || lifecycle.owner.trim() === '')) {
    console.error(`❌ [NAVIGATION VIOLATION] Canonical route '${id}' missing domain owner in lifecycle.owner.`);
    violations++;
  }
});

if (violations > 0) {
  console.error(`\n🚨 FAIL: ${violations} Navigation Architecture Guardrail Violation(s) detected.`);
  process.exit(1);
}

console.log(`✅ Navigation Registry Guardrail Passed cleanly (${registry.routes.length} cataloged routes verified across 5 categories).`);
