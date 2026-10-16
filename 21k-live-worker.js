// 21K List Live Worker: JSONBin-backed shared show data and public song requests.
// Configure JSONBIN_BIN_ID, JSONBIN_MASTER_KEY and OWNER_TOKEN as Worker secrets/vars.
const JSONBIN = 'https://api.jsonbin.io/v3/b';

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}

function cors(request, env) {
  const origin = request.headers.get('Origin') || '*';
  const allowed = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allowed === '*' ? origin : allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

async function readRecord(env) {
  const response = await fetch(`${JSONBIN}/${env.JSONBIN_BIN_ID}/latest`, {
    headers: { 'X-Master-Key': env.JSONBIN_MASTER_KEY }
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    const error = new Error(`JSONBin อ่านข้อมูลไม่สำเร็จ (HTTP ${response.status})${detail ? `: ${detail}` : ''}`);
    error.upstreamStatus = response.status;
    throw error;
  }
  const result = await response.json();
  return result.record && typeof result.record === 'object' ? result.record : {};
}

async function writeRecord(env, record) {
  const response = await fetch(`${JSONBIN}/${env.JSONBIN_BIN_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': env.JSONBIN_MASTER_KEY },
    body: JSON.stringify(record)
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    const error = new Error(`JSONBin บันทึกข้อมูลไม่สำเร็จ (HTTP ${response.status})${detail ? `: ${detail}` : ''}`);
    error.upstreamStatus = response.status;
    throw error;
  }
}

function mergeNamedSettings(existing, incoming) {
  const result = new Map();
  for (const item of [...(Array.isArray(existing) ? existing : []), ...(Array.isArray(incoming) ? incoming : [])]) {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) continue;
    result.set(item.name.trim().toLowerCase(), { name: item.name.trim(), color: /^#[0-9a-f]{6}$/i.test(item.color || '') ? item.color : '#10b981' });
  }
  return [...result.values()];
}

function validShowId(value) { return typeof value === 'string' && /^SHOW_[A-Z0-9]{4,16}$/.test(value); }

function songIdentity(song) {
  if (song && song._syncId) return String(song._syncId);
  return [song && song.title, song && song.songKey, song && song.firstChord]
    .map(value => String(value || '').trim().toLowerCase()).join('|');
}

function mergeSongLists(existing, incoming) {
  const merged = Array.isArray(existing) ? existing.map(song => ({ ...song })) : [];
  const positions = new Map(merged.map((song, index) => [songIdentity(song), index]));
  for (const song of (Array.isArray(incoming) ? incoming : [])) {
    if (!song || typeof song !== 'object' || !String(song.title || '').trim()) continue;
    const key = songIdentity(song);
    const existingIndex = positions.get(key);
    if (existingIndex === undefined) {
      positions.set(key, merged.length);
      merged.push(song);
    } else {
      const previous = merged[existingIndex];
      if (Number(song._syncUpdatedAt || 0) >= Number(previous._syncUpdatedAt || 0)) merged[existingIndex] = song;
    }
  }
  return merged;
}

export default {
  async fetch(request, env) {
    const headers = cors(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    try {
      if (!env.JSONBIN_BIN_ID || !env.JSONBIN_MASTER_KEY || !env.OWNER_TOKEN) return json({ error: 'Worker is not configured' }, 503, headers);
      const url = new URL(request.url);
      const showId = url.searchParams.get('id');
      if (!url.pathname.endsWith('/library') && !validShowId(showId)) return json({ error: 'Invalid show id' }, 400, headers);
      const owner = request.headers.get('Authorization') === `Bearer ${env.OWNER_TOKEN}`;
      if (url.pathname.endsWith('/library') && !owner) return json({ error: 'Unauthorized' }, 401, headers);
      const record = await readRecord(env);
      record.shows = record.shows && typeof record.shows === 'object' ? record.shows : {};
      const show = record.shows[showId];

      if (url.pathname.endsWith('/library') && request.method === 'GET') {
        const library = record.library && typeof record.library === 'object' ? record.library : {};
        return json({ songs: Array.isArray(library.songs) ? library.songs : [], deletedIds: Array.isArray(library.deletedIds) ? library.deletedIds : [], settings: library.settings || {}, updatedAt: library.updatedAt || 0 }, 200, headers);
      }
      if (url.pathname.endsWith('/library') && request.method === 'PUT') {
        const body = await request.json();
        if (!Array.isArray(body.songs) || body.songs.length > 3000) return json({ error: 'Invalid library data' }, 400, headers);
        const library = record.library && typeof record.library === 'object' ? record.library : {};
        const deletedIds = [...new Set([...(Array.isArray(library.deletedIds) ? library.deletedIds : []), ...(Array.isArray(body.deletedIds) ? body.deletedIds : [])].map(String))];
        const deleted = new Set(deletedIds);
        const songs = mergeSongLists(library.songs, body.songs).filter(song => !deleted.has(songIdentity(song)));
        const oldSettings = library.settings && typeof library.settings === 'object' ? library.settings : {};
        const incomingSettings = body.settings && typeof body.settings === 'object' ? body.settings : {};
        const settings = {
          grooves: mergeNamedSettings(oldSettings.grooves, incomingSettings.grooves),
          crowdControls: mergeNamedSettings(oldSettings.crowdControls, incomingSettings.crowdControls)
        };
        record.library = { songs, deletedIds, settings, updatedAt: Date.now() };
        await writeRecord(env, record);
        return json({ ok: true, songs, deletedIds, updatedAt: record.library.updatedAt }, 200, headers);
      }

      if (url.pathname.endsWith('/show') && request.method === 'GET') {
        if (!show) return json({ error: 'Show not found' }, 404, headers);
        return json(show, 200, headers);
      }
      if (url.pathname.endsWith('/show') && request.method === 'PUT') {
        if (!owner) return json({ error: 'Unauthorized' }, 401, headers);
        const body = await request.json();
        if (body.showId !== showId || !Array.isArray(body.playlist) || !body.playlist.length) return json({ error: 'Invalid show data' }, 400, headers);
        record.shows[showId] = {
          ...body,
          requests: show && Array.isArray(show.requests) ? show.requests : [],
          birthdays: show && Array.isArray(show.birthdays) ? show.birthdays : []
        };
        await writeRecord(env, record);
        return json({ ok: true }, 200, headers);
      }
      if (url.pathname.endsWith('/requests') && request.method === 'GET') {
        if (!show) return json({ requests: [] }, 200, headers);
        return json({ requests: Array.isArray(show.requests) ? show.requests : [] }, 200, headers);
      }
      if (url.pathname.endsWith('/requests') && request.method === 'POST') {
        if (!show) return json({ error: 'Show not found' }, 404, headers);
        const body = await request.json();
        const song = String(body.song || '').trim().slice(0, 120);
        if (!song) return json({ error: 'Song name is required' }, 400, headers);
        const requests = Array.isArray(show.requests) ? show.requests : [];
        if (requests.length >= 200) return json({ error: 'Request list is full' }, 429, headers);
        requests.push({
          id: crypto.randomUUID(), song,
          name: String(body.name || '').trim().slice(0, 60),
          note: String(body.note || '').trim().slice(0, 300),
          date: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        });
        record.shows[showId] = { ...show, requests };
        await writeRecord(env, record);
        return json({ ok: true }, 201, headers);
      }
      if (url.pathname.endsWith('/birthdays') && request.method === 'GET') {
        if (!show) return json({ birthdays: [] }, 200, headers);
        return json({ birthdays: Array.isArray(show.birthdays) ? show.birthdays : [] }, 200, headers);
      }
      if (url.pathname.endsWith('/birthdays') && request.method === 'POST') {
        if (!show) return json({ error: 'Show not found' }, 404, headers);
        const body = await request.json();
        const person = String(body.person || '').trim().slice(0, 80);
        if (!person) return json({ error: 'Birthday name is required' }, 400, headers);
        const birthdays = Array.isArray(show.birthdays) ? show.birthdays : [];
        if (birthdays.length >= 200) return json({ error: 'Birthday list is full' }, 429, headers);
        birthdays.push({
          id: crypto.randomUUID(), person,
          name: String(body.name || '').trim().slice(0, 60),
          message: String(body.message || '').trim().slice(0, 200),
          date: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        });
        record.shows[showId] = { ...show, birthdays };
        await writeRecord(env, record);
        return json({ ok: true }, 201, headers);
      }
      return json({ error: 'Not found' }, 404, headers);
    } catch (error) {
      const upstreamStatus = Number(error.upstreamStatus || 0);
      const status = upstreamStatus === 429 ? 503 : (upstreamStatus ? 502 : 500);
      return json({ error: error.message || 'Request failed', source: upstreamStatus ? 'JSONBin' : 'Worker' }, status, headers);
    }
  }
};
