const canonicalHost = 'zumhermann.de';

export default {
  fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.hostname === `www.${canonicalHost}`) {
      incoming.protocol = 'https:';
      incoming.hostname = canonicalHost;
      incoming.port = '';
      return Response.redirect(incoming, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
