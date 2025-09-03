// Cloudflare Pages Functions reverse proxy for HTTP backends
// Usage: request /api/<path> and this will fetch from TARGET_ORIGIN/<path>
// Set TARGET_ORIGIN as a Pages Environment Variable, e.g. http://148.113.196.189:7010

export async function onRequest(context: any): Promise<Response> {
  const { request, params, env } = context;

  // Basic CORS preflight support
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  const targetPath = Array.isArray(params?.path) ? params.path.join('/') : '';
  const origin = (env?.TARGET_ORIGIN as string) || 'http://148.113.196.189:7010';
  const targetUrl = `${origin.replace(/\/$/, '')}/${targetPath}`;

  try {
    // Clone incoming headers; set an explicit UA; drop host header
    const inHeaders = new Headers(request.headers);
    inHeaders.set('User-Agent', 'Cloudflare-Proxy');
    inHeaders.delete('host');

    // Only forward a body for non-GET/HEAD requests
    const hasBody = !['GET', 'HEAD'].includes(request.method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const resp = await fetch(targetUrl, {
      method: request.method,
      headers: inHeaders,
      body,
      redirect: 'follow',
    });

    // Build response with passthrough status and content-type, plus permissive CORS
    const outHeaders = new Headers();
    const ct = resp.headers.get('content-type') || 'application/json';
    outHeaders.set('Content-Type', ct);
    // Allow caching headers from origin if present
    const cacheControl = resp.headers.get('cache-control');
    if (cacheControl) outHeaders.set('Cache-Control', cacheControl);
    // CORS
    applyCors(outHeaders);

    return new Response(resp.body, {
      status: resp.status,
      headers: outHeaders,
    });
  } catch (err: any) {
    const message = err?.message || 'Proxy error';
    return new Response(JSON.stringify({ error: message, target: targetUrl }), {
      status: 502,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function applyCors(h: Headers) {
  const base = corsHeaders();
  for (const [k, v] of Object.entries(base)) {
    h.set(k, v);
  }
}

