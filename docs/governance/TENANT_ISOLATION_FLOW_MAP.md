# Tenant Isolation Flow Map™
**Wave RC-001 — Phase 1 Discovery**

## Executive Summary
This document maps the exact lifecycle of the `tenantId` across the Illumine OS™ Cognitive Architecture, identifying critical drop-off points where institutional identity is lost, enabling cross-tenant contamination.

## The Cognitive Flow (Current State)

### 1. Presentation Layer (`InstitutionalCopilotPage.tsx`)
- **Status:** 🔴 **CRITICAL DROP-OFF**
- **Analysis:** The UI component instantiates `useInstitutionalCopilotPageViewModel({ clientId: '' })` with an empty string. The `clientId` is entirely omitted from the component's state initialization.
- **Code Reference:** `InstitutionalCopilotPage.tsx:22`

### 2. Client Boundary (`CopilotChatPanel.tsx`)
- **Status:** 🔴 **CRITICAL DROP-OFF**
- **Analysis:** The component hardcodes `mockTenant = 'TENANT-HQ'` and `mockWorkspace = 'WS-1'`. The actual authenticated user's `tenantId` is NOT extracted from the TenancyProvider Context.
- **Code Reference:** `CopilotChatPanel.tsx:20-23`

### 3. API Payload / Query Request (`AIQueryRequest`)
- **Status:** 🟡 **VULNERABLE**
- **Analysis:** The request interface demands `tenantId`, but because the upstream UI is hardcoded, the backend receives a mocked or empty tenant. 
- **Code Reference:** `AIGovernanceTypes.ts:13`

### 4. Copilot Runtime (`InstitutionalCopilotRuntime.ts`)
- **Status:** 🔴 **CRITICAL DROP-OFF**
- **Analysis:** The runtime relies on the `request.tenantId` for audit logging (`AIUsageAuditLogger.logEvent`) and trace binding (`AITraceBinder.bind`). It **does not** validate if the `tenantId` belongs to the current session user. It blindly trusts the client payload.
- **Code Reference:** `InstitutionalCopilotRuntime.ts:19, 63`

### 5. Context Resolution & RAG (`AIContextResolver.ts`)
- **Status:** 🔴 **CRITICAL DROP-OFF**
- **Analysis:** `AIContextResolver.resolveContext(request)` attempts to fetch allowed contexts. Because there is no `TenantIsolationKernel` wrapping this call, the resolver performs a wide search that lacks a mandatory `tenantId` metadata filter at the embedding search level.

### 6. LLM Generation (`MockLLMProvider.ts`)
- **Status:** 🟢 **SAFE (But Compromised)**
- **Analysis:** The LLM receives the `allowedContexts`. Since the contexts are already cross-contaminated by Step 5, the LLM hallucinates insights based on mixed institutional memory.

## The Disappearance Point
**Where exactly does the institutional identity disappear?**
The institutional identity is lost at **Step 1 (UI Level)** and completely ignored at **Step 4 (Runtime Validation Level)**. Because the Copilot Runtime does not demand a `TenantIsolationContext` at instantiation, it is defenseless against spoofed, empty, or cross-tenant payloads.

## Transformation Required (Phases 2-7)
The system must be inverted. The `TenantIsolationKernel` must be injected into the `InstitutionalCopilotRuntime` at instantiation (server-side), and the `AIContextResolver` must be wrapped by an `EmbeddingIsolationGuard`.
