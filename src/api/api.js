const CACHE_TTL_MS = 60 * 1000

const responseCache = new Map()

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

export const BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL)
export const STORAGE_URL = trimTrailingSlash(import.meta.env.VITE_IMAGE_BASE_URL)

function cloneData(data) {
  if (typeof structuredClone === 'function') return structuredClone(data)
  return JSON.parse(JSON.stringify(data))
}

function createCacheKey(url, options = {}) {
  const method = options.method || 'GET'
  const body = options.body || ''
  return `${method}:${url}:${body}`
}

function readCache(cacheKey) {
  const cached = responseCache.get(cacheKey)

  if (!cached) return null
  if (cached.expiresAt <= Date.now()) {
    responseCache.delete(cacheKey)
    return null
  }

  return cloneData(cached.data)
}

function writeCache(cacheKey, data, ttlMs) {
  responseCache.set(cacheKey, {
    data: cloneData(data),
    expiresAt: Date.now() + ttlMs,
  })
}

function createQuery(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    query.set(key, String(value))
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

async function fetchJson(path, options = {}) {
  const { useCache = true, ttlMs = CACHE_TTL_MS, ...fetchOptions } = options
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const cacheKey = createCacheKey(url, fetchOptions)

  if (useCache) {
    const cachedData = readCache(cacheKey)
    if (cachedData) return cachedData
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`)
  }

  if (useCache) writeCache(cacheKey, data, ttlMs)

  return data
}

function parseList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

export function clearApiCache() {
  responseCache.clear()
}

export function getStorageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const cleanPath = path.replace(/^\/+/, '')
  if (cleanPath.startsWith('storage/')) {
    return `${STORAGE_URL.replace(/\/storage$/, '')}/${cleanPath}`
  }

  return `${STORAGE_URL}/${cleanPath}`
}

export async function getDivisions(options = {}) {
  const data = await fetchJson('/divisions', options)
  return parseList(data)
}

export async function getOfficers(year, options = {}) {
  const query = createQuery({ year })
  const data = await fetchJson(`/officers${query}`, options)
  return parseList(data)
}

export async function getActivists(params = {}, options = {}) {
  const query = createQuery({
    subdivision_id: params.subdivisionId ?? params.subdivision_id,
    year: params.year,
  })
  const data = await fetchJson(`/activists${query}`, options)
  return parseList(data)
}

export async function getEvents(year, options = {}) {
  const query = createQuery({ year })
  const data = await fetchJson(`/events${query}`, options)
  return parseList(data)
}

export async function getArticles(options = {}) {
  const data = await fetchJson('/articles', options)
  return parseList(data)
}

export async function getVariables(names = [], options = {}) {
  const list = Array.isArray(names) ? names : [names]
  const body = JSON.stringify({ names: list })

  const data = await fetchJson('/variables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    ...options,
  })

  return parseList(data)
}

export async function getVariableMap(names = [], options = {}) {
  const variables = await getVariables(names, options)

  return variables.reduce((map, variable) => {
    map[variable.name] = variable
    return map
  }, {})
}
