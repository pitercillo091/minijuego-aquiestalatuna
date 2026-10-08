import { createClient } from 'npm:@supabase/supabase-js@2'

const APP_ORIGINS = new Set([
  'https://minijuego.aquiestalatuna.es',
  'http://localhost:8765',
  'http://127.0.0.1:8765',
])
const LEVELS = [
  { song: 'clavelitos', normal: 46, hard: 156, normalThreshold: 0.5, hardThreshold: 0.545 },
  { song: 'cielito-lindo', normal: 36, hard: 72, normalThreshold: 0.5, hardThreshold: 0.545 },
  { song: 'adelita', normal: 45, hard: 81, normalThreshold: 0.525, hardThreshold: 0.57 },
  { song: 'el-rey', normal: 54, hard: 72, normalThreshold: 0.525, hardThreshold: 0.57 },
  { song: 'estudiantina-madrilena', normal: 63, hard: 99, normalThreshold: 0.55, hardThreshold: 0.595 },
  { song: 'cintas-capa', normal: 71, hard: 107, normalThreshold: 0.55, hardThreshold: 0.595 },
  { song: 'isa-canaria', normal: 81, hard: 117, normalThreshold: 0.575, hardThreshold: 0.62 },
  { song: 'morena-copla', normal: 90, hard: 117, normalThreshold: 0.575, hardThreshold: 0.62 },
  { song: 'maria-portuguesa', normal: 99, hard: 135, normalThreshold: 0.6, hardThreshold: 0.645 },
  { song: 'cartagenera', normal: 107, hard: 144, normalThreshold: 0.6, hardThreshold: 0.645 },
]
const cors = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
})
const json = (data: unknown, status: number, origin: string) => new Response(JSON.stringify(data), {
  status,
  headers: { ...cors(origin), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
})
const sha256 = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}
const randomToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}
const validUuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
const cleanName = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const name = value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleUpperCase('es-ES')
  if (name.length < 1 || name.length > 24 || !/^[\p{L}\p{N} ._'-]+$/u.test(name)) return null
  if (/<|>|&|\/|\\|@/u.test(name) || /\d{7,}/u.test(name)) return null
  if (/(puta|puto|mierda|coño|cabr[oó]n|fuck|shit|nazi)/iu.test(name)) return null
  return name
}
const serviceClient = () => {
  const url = Deno.env.get('SUPABASE_URL')
  let key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!key) {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
    key = keys.default || Object.values(keys)[0] as string | undefined
  }
  if (!url || !key) throw new Error('El servicio de rankings no está configurado.')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || ''
  if (!APP_ORIGINS.has(origin)) return new Response('Forbidden', { status: 403 })
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(origin) })
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405, origin)

  const publicKeys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}')
  const legacy = Deno.env.get('SUPABASE_ANON_KEY')
  const accepted = [...Object.values(publicKeys), legacy].filter((value): value is string => typeof value === 'string')
  if (!accepted.length || !accepted.includes(req.headers.get('apikey') || '')) return json({ error: 'Solicitud no autorizada.' }, 401, origin)
  if (!(req.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return json({ error: 'Formato no válido.' }, 415, origin)

  let body: Record<string, unknown>
  try {
    const raw = await req.text()
    if (raw.length > 5000) return json({ error: 'La solicitud es demasiado grande.' }, 413, origin)
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'La solicitud no contiene JSON válido.' }, 400, origin)
  }

  try {
    const db = serviceClient()
    await db.rpc('game_rankings_cleanup')

    if (body.action === 'start') {
      const level = Number(body.level)
      if (!Number.isInteger(level) || level < 1 || level > 20 || !validUuid(body.playerId)) return json({ error: 'Etapa no válida.' }, 400, origin)
      const spec = LEVELS[(level - 1) % LEVELS.length]
      const hard = level > LEVELS.length
      const expectedNotes = hard ? spec.hard : spec.normal
      const token = randomToken()
      const tokenHash = await sha256(token)
      const since = new Date(Date.now() - 15 * 60 * 1000).toISOString()
      const { count, error: countError } = await db.from('game_rank_sessions').select('token_hash', { count: 'exact', head: true }).eq('player_id', body.playerId).gte('started_at', since)
      if (countError) throw countError
      if ((count || 0) >= 8) return json({ error: 'Has iniciado demasiadas partidas seguidas. Espera unos minutos.' }, 429, origin)
      const chartVersion = spec.song === 'clavelitos' ? 'clavelitos-mp3-v1' : 'midi-map-v1'
      const { error } = await db.from('game_rank_sessions').insert({
        token_hash: tokenHash,
        player_id: body.playerId,
        level,
        song_id: spec.song,
        difficulty: hard ? 'dificil' : 'normal',
        chart_version: chartVersion,
        expected_notes: expectedNotes,
        accuracy_threshold: hard ? spec.hardThreshold : spec.normalThreshold,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      })
      if (error) throw error
      return json({ token, expectedNotes, chartVersion }, 200, origin)
    }

    if (body.action === 'finish') {
      const name = cleanName(body.playerName)
      if (!name) return json({ error: 'Usa un apodo de hasta 24 letras o números, sin datos de contacto.' }, 400, origin)
      if (typeof body.token !== 'string' || body.token.length < 32 || body.token.length > 128) return json({ error: 'La sesión de juego no es válida.' }, 400, origin)
      const score = Number(body.score), accuracy = Number(body.accuracy), hits = Number(body.hits), misses = Number(body.misses), notes = Number(body.notes)
      if (![score, accuracy, hits, misses, notes].every(Number.isFinite)) return json({ error: 'El resultado no es válido.' }, 400, origin)
      const deleteToken = randomToken()
      const { data, error } = await db.rpc('game_rankings_submit', {
        p_token_hash: await sha256(body.token),
        p_player_name: name,
        p_score: Math.trunc(score),
        p_accuracy: accuracy,
        p_hits: Math.trunc(hits),
        p_misses: Math.trunc(misses),
        p_notes: Math.trunc(notes),
        p_delete_token_hash: await sha256(deleteToken),
      })
      if (error) {
        const message = error.message || ''
        const status = /session_invalid|duration_invalid/.test(message) ? 409 : /score_invalid|accuracy_invalid|note_totals_invalid|name_invalid|token_invalid/.test(message) ? 400 : 503
        return json({ error: status === 503 ? 'No se pudo guardar la puntuación ahora. Tu progreso local sigue guardado.' : 'El resultado no ha superado la validación.' }, status, origin)
      }
      return json({ ...data, deleteToken: data.improved ? deleteToken : null }, 200, origin)
    }

    if (body.action === 'list') {
      const mode = body.mode === 'general' ? 'general' : body.mode === 'level' ? 'level' : ''
      const level = Number(body.level || 1), limit = Math.max(1, Math.min(50, Math.trunc(Number(body.limit) || 10))), offset = Math.max(0, Math.min(5000, Math.trunc(Number(body.offset) || 0)))
      if (!mode || (mode === 'level' && (!Number.isInteger(level) || level < 1 || level > 20))) return json({ error: 'Clasificación no válida.' }, 400, origin)
      const { data, error } = await db.rpc('game_rankings_page', { p_mode: mode, p_level: level, p_limit: limit, p_offset: offset })
      if (error) throw error
      return json(data, 200, origin)
    }

    if (body.action === 'delete') {
      if (!validUuid(body.id) || typeof body.token !== 'string' || body.token.length < 32 || body.token.length > 128) return json({ error: 'La solicitud de retirada no es válida.' }, 400, origin)
      const { data, error } = await db.rpc('game_rankings_delete', { p_id: body.id, p_delete_token_hash: await sha256(body.token) })
      if (error) throw error
      return json({ deleted: data === true }, 200, origin)
    }

    return json({ error: 'Acción desconocida.' }, 400, origin)
  } catch (error) {
    console.error('tuna-rankings request failed:', error instanceof Error ? error.message : 'unknown error')
    return json({ error: 'El servicio de clasificaciones no está disponible ahora mismo.' }, 503, origin)
  }
})
