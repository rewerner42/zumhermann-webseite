import type { APIRoute } from 'astro';
import { site, siteOrigin } from '../config/site';

export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const releaseReady =
    origin &&
    site.hosting.privacyDetailsComplete &&
    site.legal.textsApproved &&
    site.release.publicReleaseApproved;
  const body = releaseReady
    ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n\n# Veröffentlichung gesperrt, bis alle Pflichtangaben und Freigaben vorliegen.\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
