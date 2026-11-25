import Client from './ApplyClient';
export default async function Page({ searchParams }) {
  const query = await searchParams;
  return <Client key={`${query.dept || ""}:${query.role || ""}`} query={query} />;
}
