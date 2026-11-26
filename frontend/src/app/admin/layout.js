// Admin is a private operational interface, not a public search result.
// Keep route metadata separate from the public homepage; no UI changes.
export const metadata = {
  title: "Operations Console | Omoikane Innovations",
  description: "Restricted Omoikane Innovations operations access.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

export default function AdminLayout({ children }) {
  return children;
}
