import { reactive } from 'vue'
import { getArticleDetail, getArticles, getEvents, getVariableMap } from '@/api/api'

const currentYear = new Date().getFullYear()

export const landingData = reactive({
  years: [],
  eventsByYear: {},
  articlesByKey: {},
  articleDetailsBySlug: {},
  loading: {
    years: false,
    events: false,
    articles: false,
    articleDetail: false,
  },
  errors: {
    years: '',
    events: '',
    articles: '',
    articleDetail: '',
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

  if (landingData.eventsByYear[selectedYear] || landingData.loading.events) return

  landingData.loading.events = true
  landingData.errors.events = ''

  try {
    landingData.eventsByYear[selectedYear] = await getEvents(selectedYear)
  } catch (error) {
    landingData.errors.events = error.message || 'Failed to load events.'
    landingData.eventsByYear[selectedYear] = []
  } finally {
    landingData.loading.events = false
  }
}

export function createArticlesKey(params = {}) {
  const search = String(params.search || '').trim().toLowerCase()
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 12

  return `${search}|${page}|${pageSize}`
}

export async function ensureArticlesLoaded(params = {}) {
  const key = createArticlesKey(params)

  if (landingData.articlesByKey[key] || landingData.loading.articles) return

  landingData.loading.articles = true
  landingData.errors.articles = ''

  try {
    landingData.articlesByKey[key] = await getArticles(params)
  } catch (error) {
    landingData.errors.articles = error.message || 'Failed to load articles.'
    landingData.articlesByKey[key] = {
      items: [],
      meta: { currentPage: 1, pageSize: params.pageSize ?? 12, total: 0, lastPage: 1 },
      raw: null,
    }
  } finally {
    landingData.loading.articles = false
  }
}

export async function ensureArticleDetailLoaded(slug) {
  if (!slug || landingData.articleDetailsBySlug[slug] || landingData.loading.articleDetail) return

  landingData.loading.articleDetail = true
  landingData.errors.articleDetail = ''

  try {
    landingData.articleDetailsBySlug[slug] = await getArticleDetail(slug)
  } catch (error) {
    landingData.errors.articleDetail = error.message || 'Failed to load article detail.'
    landingData.articleDetailsBySlug[slug] = null
  } finally {
    landingData.loading.articleDetail = false
  }
}
