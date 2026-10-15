const corsHeaders = origin => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
});

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allowed.includes(origin)) return new Response('Forbidden origin', { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });

    const url = new URL(request.url);
    if (url.pathname !== '/show') return json({ error: 'Not found' }, 404, origin);
    if (!env.JSONBIN_BIN_ID || !env.JSONBIN_ACCESS_KEY || !env.OWNER_TOKEN) return json({ error: 'Worker is not configured' }, 503, origin);

    if (request.method === 'GET') {
      const requestedId = url.searchParams.get('id');
      if (!requestedId || requestedId.length > 80) return json({ error: 'Missing show id' }, 400, origin);
      const upstream = await fetch(`https://api.jsonbin.io/v3/b/${encodeURIComponent(env.JSONBIN_BIN_ID)}/latest`, {
        headers: { 'X-Access-Key': env.JSONBIN_ACCESS_KEY, 'X-Bin-Meta': 'false' },
        cf: { cacheTtl: 0, cacheEverything: false }
      });
      if (!upstream.ok) return json({ error: 'Storage read failed' }, 502, origin);
      const record = await upstream.json();
      const state = record.record || record;
      if (state.showId !== requestedId) return json({ error: 'Show not found' }, 404, origin);
      return json(state, 200, origin);
    }

    if (request.method === 'PUT') {
      if (request.headers.get('Authorization') !== `Bearer ${env.OWNER_TOKEN}`) return json({ error: 'Unauthorized' }, 401, origin);
      let state;
      try { state = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400, origin); }
      if (!state || typeof state.showId !== 'string' || !Array.isArray(state.playlist) || !state.playlist.length || state.playlist.length > 200 || !Number.isInteger(state.currentIndex) || state.currentIndex < 0 || state.currentIndex >= state.playlist.length) {
        return json({ error: 'Invalid show state' }, 400, origin);
      }
      const upstream = await fetch(`https://api.jsonbin.io/v3/b/${encodeURIComponent(env.JSONBIN_BIN_ID)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Access-Key': env.JSONBIN_ACCESS_KEY, 'X-Bin-Versioning': 'false' },
        body: JSON.stringify(state)
      });
      if (!upstream.ok) return json({ error: 'Storage write failed' }, 502, origin);
      return json({ ok: true }, 200, origin);
    }
    return json({ error: 'Method not allowed' }, 405, origin);
  }
};
