# Architecture Decisions

## ADR-001: Keep Vite/React As The Frontend Foundation

**Status:** Accepted

The imported app already builds with Vite and React. There is no current requirement that justifies migrating to another framework before stabilizing the codebase.

## ADR-002: Extract Before Rewriting

**Status:** Accepted

The app has broad business surface area and working screens. The first architecture move should be decomposition of `App.tsx` and domain grouping, not a rewrite.

## ADR-003: Keep Firestore Collections Stable

**Status:** Accepted

Firestore rules and pages already depend on current collection names. Schema changes should be handled as explicit data work with rules updates and migration planning.

## ADR-004: Move Gemini Behind A Server Boundary Before Production Sensitive Use

**Status:** Proposed

The current Gemini integration reads `process.env.GEMINI_API_KEY` into the browser build. This is acceptable only as a prototype pattern. Production use with sensitive advisory data should call a server-side endpoint or function.
