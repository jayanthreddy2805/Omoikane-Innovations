# Omoikane Engineering Hero

Hero-only Next.js component using the included generated concept image as a local asset. It does not include or recreate the navbar.

## Install
Copy the `src` and `public` folders into the existing Next.js project, merging folders rather than replacing them.

Render below the existing navbar:

```tsx
import { OmoikaneEngineeringHero } from "@/components/omoikane-engineering-hero/OmoikaneEngineeringHero";

export default function ExpertisePage() {
  return (
    <>
      {/* Keep the existing navbar */}
      <OmoikaneEngineeringHero />
      {/* Keep the existing sections below */}
    </>
  );
}
```

If the project does not use the `@/` alias, change the import path. The hero image is served from `/images/omoikane-engineering-hero.png`. The CTA targets `#expertise`; ensure the relevant section has `id="expertise"` or update the link. Capability rows open an interactive detail panel. The capability index rotates automatically until the panel is opened. Responsive styling and reduced-motion support are included. No extra dependencies are required.

The image is a generated concept visual, not a factual photo of a specific Omoikane product. Preserve the existing navbar and other page sections; this package replaces only the hero.
