# Architecture Rule Catalog

## Governance Foundation Certification (GFC)

- **AR-GFC-001**: Package Dependency Direction (Types -> Contracts -> Domain)
- **AR-GFC-002**: Runtime Purity (No external libraries like React, Firebase)
- **AR-GFC-003**: Value Object Integrity (Opaque Types with __brand)
- **AR-GFC-004**: Domain Purity (Entities must not depend on engines or services)
- **AR-GFC-005**: Event Contracts (Events must be pure interfaces)
- **AR-GFC-006**: Public Surface Integrity (Exports must be complete in index.ts)
- **AR-GFC-007**: Circular Dependency Prevention (No cycles between types, contracts, domain)
- **AR-GFC-009**: Deep Immutability (Arrays must be readonly)
- **AR-GFC-010**: Entity Constructor Complexity (Constructors must only contain assignments)
