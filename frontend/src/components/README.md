# Frontend component map

```text
components/
├── features/    Page and business-feature components
├── layout/      Site-wide header, footer and motion preferences
└── shared/      Reusable controls, CTAs, links, loaders and UI primitives
```

## Features

Feature directories are named after the part of the website they implement: `home`, `about`, `contact`, `careers`, `expertise`, `leadership`, `work`, `chatbot`, and `privacy`.

Keep a component in its feature when it is not reused elsewhere. Move it to `shared` only after at least two features depend on it.

## Layout

- `layout/header` contains primary navigation.
- `layout/footer` contains the footer hero, footer content and newsletter subscription form.
- `layout/motion` contains global reduced-motion handling.

## Shared

Shared components are intentionally generic. CSS Modules remain beside their matching components, and low-level form primitives live under `shared/ui`.
