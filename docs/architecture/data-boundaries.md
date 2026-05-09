# Data Boundaries

## Firestore Collections Observed

| Collection | Current Use |
| --- | --- |
| `clients` | Portfolio/client master data |
| `financial_entries` | DRE, BP, cash flow, managerial DRE entries |
| `account_plans` | Chart of accounts per client |
| `client_assumptions` | Client-specific financial and growth assumptions |
| `indicators` | KPI values |
| `financial_positions` | Bank/cash position data |
| `purchases` | Purchase management |
| `payables` | Accounts payable |
| `receivables` | Accounts receivable |
| `employees` | Payroll/personnel data |
| `report_notes` | Executive commentary notes |
| `loans` | Loan data |

## Boundary Rules

- Client-owned records must remain tied to either `ownerId` or a `clientId` whose client document belongs to the authenticated user.
- Browser code may read/write Firestore only through shared hooks/services after the extraction phase.
- AI prompts should not receive sensitive production data until Gemini calls are moved behind a server-side boundary.
- Firestore rules are part of the architecture contract and must be updated with any schema change.
