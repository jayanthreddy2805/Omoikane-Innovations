import Client from './ContactClient';
export default async function Page({ searchParams }) {
  const query = await searchParams;
  return <Client query={query} />;
}
