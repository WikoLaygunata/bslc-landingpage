import { reactive } from 'vue'
import { getArticleDetail, getArticles, getEvents, getOfficers, getVariableMap } from '@/api/api'

const currentYear = new Date().getFullYear()

export const landingData = reactive({
  years: [],
  eventsByYear: {},
  officersByYear: {},
  articlesByKey: {},
  articleDetailsBySlug: {},
  loading: {
    years: false,
    eventsByYear: {},
    officersByYear: {},
    articlesByKey: {},
    articleDetailsBySlug: {},
  },
  errors: {
    years: '',
    eventsByYear: {},
    officersByYear: {},
    articlesByKey: {},
    articleDetailsBySlug: {},
  },
})

function parseYears(value) {
  return String(value || '')
    .split(',')
    .map((year) => Number(year.trim()))
    .filter((year) => Number.isInteger(year))
}

export async function ensureYearsLoaded() {
  if (landingData.years.length > 0 || landingData.loading.years) return

  landingData.loading.years = true
  landingData.errors.years = ''

  try {
    const variables = await getVariableMap(['years'])
    const parsedYears = parseYears(variables.years?.value)

    landingData.years = parsedYears.length > 0 ? parsedYears : [currentYear]
  } catch (error) {
    landingData.errors.years = error.message || 'Failed to load years.'
    landingData.years = [currentYear]
  } finally {
    landingData.loading.years = false
  }
}

export async function ensureEventsLoaded(year = currentYear) {
  const selectedYear = Number(year) || currentYear

  if (landingData.eventsByYear[selectedYear] || landingData.loading.eventsByYear[selectedYear])
    return

  landingData.loading.eventsByYear[selectedYear] = true
  landingData.errors.eventsByYear[selectedYear] = ''

  try {
    landingData.eventsByYear[selectedYear] = await getEvents(selectedYear)
  } catch (error) {
    landingData.errors.eventsByYear[selectedYear] = error.message || 'Failed to load events.'
  } finally {
    landingData.loading.eventsByYear[selectedYear] = false
  }
}

export async function ensureOfficersLoaded(year = currentYear) {
  const selectedYear = Number(year) || currentYear

  if (landingData.officersByYear[selectedYear] || landingData.loading.officersByYear[selectedYear])
    return

  landingData.loading.officersByYear[selectedYear] = true
  landingData.errors.officersByYear[selectedYear] = ''

  try {
    landingData.officersByYear[selectedYear] = await getOfficers(selectedYear)
  } catch (error) {
    landingData.errors.officersByYear[selectedYear] = error.message || 'Failed to load officers.'
  } finally {
    landingData.loading.officersByYear[selectedYear] = false
  }
}

export function createArticlesKey(params = {}) {
  const search = String(params.search || '')
    .trim()
    .toLowerCase()
  const type = String(params.type || '')
    .trim()
    .toLowerCase()
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 12

  return `${search}|${type}|${page}|${pageSize}`
}

export async function ensureArticlesLoaded(params = {}) {
  const key = createArticlesKey(params)

  if (landingData.articlesByKey[key] || landingData.loading.articlesByKey[key]) return

  landingData.loading.articlesByKey[key] = true
  landingData.errors.articlesByKey[key] = ''

  try {
    landingData.articlesByKey[key] = await getArticles(params)
  } catch (error) {
    landingData.errors.articlesByKey[key] = error.message || 'Failed to load articles.'
  } finally {
    landingData.loading.articlesByKey[key] = false
  }
}

export async function ensureArticleDetailLoaded(slug) {
  if (
    !slug ||
    landingData.articleDetailsBySlug[slug] ||
    landingData.loading.articleDetailsBySlug[slug]
  )
    return

  landingData.loading.articleDetailsBySlug[slug] = true
  landingData.errors.articleDetailsBySlug[slug] = ''

  try {
    landingData.articleDetailsBySlug[slug] = await getArticleDetail(slug)
  } catch (error) {
    landingData.errors.articleDetailsBySlug[slug] =
      error.message || 'Failed to load article detail.'
  } finally {
    landingData.loading.articleDetailsBySlug[slug] = false
  }
}
