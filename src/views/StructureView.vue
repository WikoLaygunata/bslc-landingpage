<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getStorageUrl } from '@/api/api'
import { ensureOfficersLoaded, ensureYearsLoaded, landingData } from '@/stores/data'

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)

const structureGroups = [
  {
    name: 'Executive Committee',
    titles: ['Chairman of BSLC', 'General Secretary of BSLC', 'General Treasurer of BSLC'],
  },
  {
    name: 'Regional Presidents',
    titles: ['BSLC Kemanggisan Regional President', 'BSLC Alam Sutera Regional President'],
  },
  {
    name: 'Marketing',
    titles: ['General Manager of Marketing', 'Manager Design', 'Manager Business Development'],
  },
  {
    name: 'Learning',
    titles: [
      'General Manager of Learning',
      'Manager Mentoring Alam Sutera',
      'Manager Mentoring Kemanggisan',
      'Manager People Development',
    ],
  },
  {
    name: 'Human Capital',
    titles: [
      'General Manager of Human Capital',
      'Manager Creative and Research',
      'Manager Engagement',
    ],
  },
  {
    name: 'Information & Technology',
    titles: ['General Manager of IT', 'Manager IT Development', 'Manager IT Support'],
  },
]

const years = computed(() => {
  if (landingData.years.length > 0) return landingData.years
  return [currentYear]
})

const officers = computed(() => landingData.officersByYear[selectedYear.value] || [])
const isLoadingOfficers = computed(() => landingData.loading.officersByYear[selectedYear.value])
const officersError = computed(() => landingData.errors.officersByYear[selectedYear.value] || '')
const officersByTitle = computed(() => {
  return officers.value.reduce((map, officer) => {
    map[officer.title] = officer
    return map
  }, {})
})

function getOfficer(title) {
  return officersByTitle.value[title] || { title, name: 'Coming Soon', image_path: null }
}

function initials(name = '') {
  if (!name || name === 'Coming Soon') return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

onMounted(async () => {
  await ensureYearsLoaded()

  if (landingData.years.includes(currentYear)) {
    selectedYear.value = currentYear
  } else if (landingData.years.length > 0) {
    selectedYear.value = landingData.years[0]
  }

  await ensureOfficersLoaded(selectedYear.value)
})

watch(selectedYear, async (year) => {
  await ensureOfficersLoaded(year)
})
</script>

<template>
  <main class="min-h-screen overflow-x-clip bg-white">
    <section
      class="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-white px-4 py-14 sm:px-6 md:py-20"
    >
      <div
        class="absolute right-0 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-aqua/5 blur-3xl sm:h-96 sm:w-96 sm:translate-x-1/3 sm:bg-aqua/15"
      ></div>
      <div
        class="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 rounded-full bg-dark-green/5 blur-3xl sm:h-80 sm:w-80 sm:-translate-x-1/3 sm:bg-dark-green/10"
      ></div>
      <div
        class="absolute left-1/2 top-40 hidden h-64 w-64 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl sm:block"
      ></div>

      <div class="relative z-10 mx-auto max-w-7xl">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="font-tangerine text-5xl font-bold text-aqua">Organization Structure</p>
            <h1 class="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Let's Meet our Team</h1>
            <p class="mt-4 text-gray-700">Officers of BSLC {{ selectedYear }}</p>
          </div>

          <label class="flex w-full flex-col gap-2 text-sm font-semibold text-gray-700 md:w-48">
            Year
            <select
              v-model.number="selectedYear"
              class="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/20"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </label>
        </div>

        <p
          v-if="landingData.errors.years || officersError"
          class="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {{ landingData.errors.years || officersError }}
        </p>

        <div v-if="isLoadingOfficers" class="mt-12 space-y-10">
          <div
            v-for="group in structureGroups"
            :key="group.name"
            class="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div class="h-6 w-48 animate-pulse rounded-full bg-slate-200"></div>
            <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="title in group.titles"
                :key="title"
                class="overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-slate-100"
              >
                <div class="h-64 animate-pulse bg-slate-200"></div>
                <div class="space-y-4 p-5">
                  <div class="mx-auto h-5 w-32 animate-pulse rounded-full bg-slate-200"></div>
                  <div class="mx-auto h-4 w-44 animate-pulse rounded-full bg-slate-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-12 space-y-12">
          <section
            v-for="group in structureGroups"
            :key="group.name"
            class="relative overflow-hidden rounded-4xl bg-white/90 p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200 md:p-8"
          >
            <div class="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-aqua/5 blur-2xl"></div>
            <div
              class="relative mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="h-10 w-2 rounded-full bg-aqua"></div>
                <div>
                  <h2 class="text-2xl font-bold text-slate-900 md:text-3xl">{{ group.name }}</h2>
                  <p class="text-sm font-medium text-slate-500">
                    {{ group.titles.length }} positions
                  </p>
                </div>
              </div>
            </div>

            <div class="relative flex flex-wrap justify-center gap-5">
              <article
                v-for="title in group.titles"
                :key="title"
                class="group flex w-full max-w-xs flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-aqua/30 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-1rem)]"
              >
                <div
                  class="relative h-64 overflow-hidden"
                  :class="
                    getOfficer(title).image_path
                      ? 'bg-white'
                      : 'bg-linear-to-br from-dark-green to-aqua'
                  "
                >
                  <img
                    v-if="getOfficer(title).image_path"
                    :src="getStorageUrl(getOfficer(title).image_path)"
                    :alt="getOfficer(title).name"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div
                    v-else
                    class="relative flex h-full w-full items-center justify-center text-5xl font-bold text-white"
                  >
                    <div
                      class="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                    ></div>
                    <div
                      class="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-cyan/20 blur-2xl"
                    ></div>
                    {{ initials(getOfficer(title).name) }}
                  </div>
                  <div
                    class="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                  ></div>
                </div>

                <div
                  class="flex min-h-36 flex-1 flex-col border-t border-slate-100 bg-white p-5 text-center"
                >
                  <h3 class="text-xl font-bold text-slate-900">{{ getOfficer(title).name }}</h3>
                  <div class="flex flex-1 items-center justify-center">
                    <p class="rounded-full bg-aqua/10 px-4 py-2 text-sm font-bold text-aqua">
                      {{ title }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>
