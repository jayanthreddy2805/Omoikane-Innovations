import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCountries } from 'libphonenumber-js/min';
export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return getCountries().map(code => ({code})); }
export async function GET(_request: Request, {params}: {params: Promise<{code: string}>}) {
  const {code} = await params;
  if (!/^[A-Z]{2}$/.test(code) || !getCountries().includes(code as ReturnType<typeof getCountries>[number])) return new Response(null, {status: 404});
  try {
    const data = await readFile(path.join(process.cwd(), 'node_modules/country-flag-icons/3x2', `${code}.svg`), 'utf8');
    return new Response(data, {headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400, s-maxage=604800', 'X-Content-Type-Options': 'nosniff'}});
  } catch { return new Response(null, {status: 404}); }
}
