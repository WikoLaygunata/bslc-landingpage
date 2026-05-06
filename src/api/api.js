function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

export const BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL)
export const STORAGE_URL = trimTrailingSlash(import.meta.env.VITE_IMAGE_BASE_URL)

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
  const fetchOptions = options
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`)
  }

  return data
}

function parseList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

function parsePaginated(data) {
  const items = Array.isArray(data?.data) ? data.data : []

  return {
    items,
    meta: {
      currentPage: data?.current_page ?? 1,
      pageSize: data?.per_page ?? items.length,
      total: data?.total ?? items.length,
      lastPage: data?.last_page ?? 1,
      from: data?.from ?? null,
      to: data?.to ?? null,
    },
    raw: data,
  }
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

export async function getArticles(params = {}, options = {}) {
  const query = createQuery({
    search: params.search,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 12,
  })
  const data = await fetchJson(`/articles${query}`, options)
  return parsePaginated(data)
}

export async function getArticleDetail(slug, options = {}) {
  if (!slug) return null
  return await fetchJson(`/article/${encodeURIComponent(slug)}`, options)
}

export async function getVariables(names = [], options = {}) {
  const list = Array.isArray(names) ? names : [names]
  const query = new URLSearchParams()

  list.forEach((name, index) => {
    if (name) query.append(`names[${index}]`, name)
  })

  const queryString = query.toString()
  const data = await fetchJson(`/variables${queryString ? `?${queryString}` : ''}`, options)

  return parseList(data)
}

export async function getVariableMap(names = [], options = {}) {
  const variables = await getVariables(names, options)

  return variables.reduce((map, variable) => {
    map[variable.name] = variable
    return map
  }, {})
}
