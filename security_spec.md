# Security Specification (TDD)

## Data Invariants
1. A Client document must have an `ownerId` matching the authenticated user.
2. Financial Entires must belong to a Client that the authenticated user owns.
3. Loans must belong to a Client that the authenticated user owns.
4. Timestamps (`createdAt`, `updatedAt`) must be set via `request.time`.
5. Strategic fields like `ownerId` are immutable.

## The Dirty Dozen (Vulnerability Payloads)
1. **Identity Spoofing**: Creating a client with `ownerId` of another user.
2. **Resource Poisoning**: Setting a 1MB string as Client `fantasia`.
3. **Cross-Tenant Write**: Adding a Financial Entry to a `clientId` that belongs to another consultant.
4. **Shadow Field Injection**: Adding `isVerified: true` to a Client document.
5. **Orphaned Record**: Creating a Financial Entry for a non-existent `clientId`.
6. **Negative Value Poisoning**: Setting a negative `valorEmprestimo` in a Loan.
7. **Timestamp Backdating**: Setting a manual `createdAt` date in the past.
8. **Client ID Hijacking**: Updating a Loan's `clientId` to move it to another client.
9. **Unauthenticated Read**: Attempting to list clients without being signed in.
10. **Global Search Leak**: Querying for all financial entries without filtering by a specific client/owner.
11. **Type Confusion**: Sending `value` as a string instead of a number in `FinancialEntry`.
12. **Immutable Field Bypass**: Changing the `ownerId` of an existing Client.

## Test Runner (Mocks)
*Tests will be verified using the generated firestore.rules.*
