import { reactive } from 'vue'
import { getEvents, getVariableMap } from '@/api/api'

const currentYear = new Date().getFullYear()

export const landingData = reactive({
  years: [],
  eventsByYear: {},
  loading: {
    years: false,
    events: false,
  },
  errors: {
    years: '',
    events: '',
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
