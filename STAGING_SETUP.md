# Staging Setup Guide — Illumine Platform

This document outlines the steps to run and validate the Illumine platform in a dedicated staging/homologation environment.

## 1. Environment Configuration

1. Copy `.env.staging.example` to `.env.staging` in the root of the project:
   ```bash
   cp .env.staging.example .env.staging
   ```
2. Populate `.env.staging` with your Firebase Staging credentials.

## 2. Booting in Staging Mode

To run the Vite dev server in staging mode, use:
```bash
npm run dev -- --mode staging
```
Or to build for staging:
```bash
vite build --mode staging
```

Vite will load `.env.staging` and overwrite default parameters.

## 3. Staging Users & Roles

The staging environment is populated with the following demo tenants and credentials:
- **Tenant ID**: `demo-tenant-turnaround` (Seeded turnaround case study)
- **Tenant ID**: `TENANT-1` (Default test sandbox tenant)
- **Role Map**:
  - `cfo@company.com`: CFO (Full read/write within tenant)
  - `board@company.com`: BOARD_MEMBER (Read-only, approved board packs)
  - `controller@company.com`: CONTROLLER (DRE/BP uploads)
  - `auditor@company.com`: AUDITOR (Read-only observability access)

## 4. Staging Data Seeding

All data seeded or imported in the staging environment must follow the fiduciarily audited structure:
- Must have `tenantId`
- Must include a `memorySource` or `dataSource` set to `DEMO` or `STAGING`
- Must carry a `lineageHash` reference
- Must be isolated from production records
