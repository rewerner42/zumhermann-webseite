import type { APIRoute } from 'astro';
import { isPublicReleaseReady, siteOrigin } from '../config/site';

export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const body = isPublicReleaseReady()
    ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
    : 'User-agent: *\nAllow: /\n\n# Seiten bleiben per noindex von der Indexierung ausgeschlossen, bis App-Audit und öffentliche Freigabe vorliegen.\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
