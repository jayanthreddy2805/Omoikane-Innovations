# Omoikane repository structure

This repository contains two independently buildable applications:

```text
Omoikane-Innovations/
├── backend/                 Spring Boot API and PostgreSQL migrations
├── frontend/                Next.js website and browser-side integrations
└── .github/workflows/       Continuous-integration checks
```

## Backend

The backend is organized by business feature. Files that implement one workflow live together, so a developer does not need to jump between generic `controller`, `service`, `entity`, and `repository` directories.

```text
backend/src/main/java/com/omoikane/api/
├── OmoikaneApiApplication.java  Spring Boot entry point
├── admin/                   Protected management endpoints
├── careers/                 Job application workflow
├── contact/                 Contact enquiry workflow
├── subscription/            Company-update subscription workflow
├── email/                   Shared outbound email delivery
└── common/
    ├── config/              Security, rate limiting and error handling
    └── dto/                 Shared API response types
```

Database changes are versioned in `backend/src/main/resources/db/migration/`. Backend tests mirror the same feature names under `backend/src/test/java/com/omoikane/api/`.

## Frontend

The frontend separates route entry points, business features, shared layout, reusable UI and non-visual application code.

```text
frontend/src/
├── app/                     Next.js routes, layouts and route metadata
├── components/
│   ├── features/            Components owned by one website feature/page
│   ├── layout/              Header, footer and global layout behavior
│   └── shared/              Reusable controls, effects and UI primitives
├── data/                    Static site and assistant data
├── hooks/                   Reusable React hooks
├── lib/                     Framework-independent browser utilities
└── services/                Assistant and retrieval services
```

## Naming rules

- React component files and Java classes use `PascalCase`.
- Hooks start with `use`.
- CSS Modules sit beside the component they style.
- Feature-specific code stays inside its feature directory.
- Only code used by multiple features belongs in `shared`, `common`, `lib`, or `services`.
- Database migrations are append-only and use the next Flyway version number.
