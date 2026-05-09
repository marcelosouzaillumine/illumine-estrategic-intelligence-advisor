# Source Tree

## Current Structure

```plaintext
illumine-advisor/
├── docs/
│   ├── architecture.md
│   ├── architecture/
│   └── stories/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── constants.ts
│   ├── data.ts
│   ├── components/
│   │   ├── Common.tsx
│   │   ├── EmployeeManager.tsx
│   │   ├── ExecutiveCommentary.tsx
│   │   ├── PayrollDashboard.tsx
│   │   ├── SortableHeader.tsx
│   │   ├── modals/
│   │   └── pages/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
├── firebase-applet-config.json
├── firestore.rules
├── security_spec.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Target Extraction Structure

```plaintext
src/
├── app/
│   ├── AppShell.tsx
│   ├── navigation.ts
│   ├── routes.tsx
│   └── providers.tsx
├── features/
│   ├── advisory/
│   ├── clients/
│   ├── finance/
│   ├── reports/
│   ├── strategy/
│   └── payroll/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── services/
│   ├── ai/
│   ├── firebase/
│   └── imports/
└── data/
```

## Extraction Order

1. Move navigation metadata from `App.tsx` to `src/app/navigation.ts`.
2. Move page selection/rendering map to `src/app/routes.tsx`.
3. Move shell layout to `src/app/AppShell.tsx`.
4. Move Firebase auth/client bootstrap into an app provider or hook.
5. Group page modules by domain under `src/features/` without changing behavior.
6. Introduce lazy loading for heavy page modules.
