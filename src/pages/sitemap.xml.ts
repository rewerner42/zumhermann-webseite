import type { APIRoute } from 'astro';
import { site, siteOrigin } from '../config/site';

const routes = ['/', '/impressum', '/datenschutz', '/support'];

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = () => {
  const origin = siteOrigin() ?? site.domain.replace(/\/$/, '');
  const entries = routes
    .map((route) => `  <url><loc>${escapeXml(`${origin}${route}`)}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
