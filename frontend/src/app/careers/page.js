import { permanentRedirect } from 'next/navigation';

// Preserve existing links to /careers without maintaining a separate landing page.
export default function CareersPage() {
  permanentRedirect('/careers/software');
}
