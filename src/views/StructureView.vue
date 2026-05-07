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
    titles: [
      'BSLC Kemanggisan Regional President',
      'BSLC Alam Sutera Regional President',
      'BSLC Bekasi Regional President',
    ],
  },
  {
    name: 'Marketing',
    titles: [
      'General Manager of Marketing',
      'Manager Design',
      'Manager Public Relation',
      'Manager Business Development',
      'Staff Design',
    ],
  },
  {
    name: 'Learning',
    titles: [
      'General Manager of Learning',
      'Manager Mentoring Alam Sutera',
      'Manager Mentoring Kemanggisan',
      'Manager Mentoring',
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

function groupLayoutClass(count) {
  if (count === 4) return 'grid grid-cols-2 justify-items-center lg:grid-cols-4'
  if (count === 3) return 'grid grid-cols-2 justify-items-center lg:grid-cols-3'
  if (count === 2) return 'grid grid-cols-2 justify-items-center'

  return 'flex flex-wrap justify-center'
}

function officerCardClass(count, index) {
  if (count <= 4) {
    if (count === 3 && index === 0) {
      return 'w-full max-w-40 col-span-2 sm:max-w-xs lg:col-span-1'
    }

    return 'w-full max-w-40 sm:max-w-xs'
  }

  return 'w-full max-w-xs sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-1rem)]'
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
            class="rounded-4xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-200/70 backdrop-blur md:p-7"
          >
            <div class="h-5 w-40 animate-pulse rounded-full bg-slate-200 md:h-6 md:w-48"></div>
            <div class="mt-6 gap-3 sm:gap-5" :class="groupLayoutClass(group.titles.length)">
              <div
                v-for="(title, index) in group.titles"
                :key="title"
                class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100"
                :class="officerCardClass(group.titles.length, index)"
              >
                <div
                  class="aspect-square animate-pulse bg-linear-to-br from-dark-green/10 via-slate-100 to-aqua/10"
                ></div>
                <div class="space-y-3 p-3 sm:space-y-4 sm:p-5">
                  <div
                    class="mx-auto h-4 w-24 animate-pulse rounded-full bg-slate-200 sm:h-5 sm:w-32"
                  ></div>
                  <div
                    class="mx-auto h-3 w-28 animate-pulse rounded-full bg-slate-100 sm:h-4 sm:w-44"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-12 space-y-12">
          <section
            v-for="group in structureGroups"
            :key="group.name"
            class="relative overflow-hidden rounded-4xl bg-white/75 p-4 shadow-sm shadow-slate-200/60 ring-1 ring-slate-200/70 backdrop-blur md:p-7"
          >
            <div class="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-aqua/5 blur-2xl"></div>
            <div
              class="relative mb-5 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="h-8 w-1.5 rounded-full bg-aqua sm:h-10 sm:w-2"></div>
                <div>
                  <h2 class="text-xl font-bold text-slate-900 md:text-3xl">{{ group.name }}</h2>
                  <p class="text-xs font-medium text-slate-500 sm:text-sm">
                    {{ group.titles.length }} positions
                  </p>
                </div>
              </div>
            </div>

            <div class="relative gap-3 sm:gap-5" :class="groupLayoutClass(group.titles.length)">
              <article
                v-for="(title, index) in group.titles"
                :key="title"
                class="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-aqua/10 hover:ring-aqua/25"
                :class="officerCardClass(group.titles.length, index)"
              >
                <div
                  class="relative aspect-square overflow-hidden"
                  :class="
                    getOfficer(title).image_path
                      ? 'bg-linear-to-br from-dark-green/10 via-white to-aqua/10'
                      : 'bg-linear-to-br from-dark-green to-aqua'
                  "
                >
                  <div
                    v-if="getOfficer(title).image_path"
                    class="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/15 blur-2xl sm:h-44 sm:w-44"
                  ></div>
                  <img
                    v-if="getOfficer(title).image_path"
                    :src="getStorageUrl(getOfficer(title).image_path)"
                    :alt="getOfficer(title).name"
                    class="relative h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    v-else
                    class="relative flex h-full w-full items-center justify-center text-3xl font-bold text-white sm:text-5xl"
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
                  class="flex min-h-20 flex-1 flex-col border-t border-slate-100 bg-white p-2.5 text-center sm:min-h-32 sm:p-5"
                >
                  <h3 class="text-xs font-bold leading-snug text-slate-900 sm:text-lg">
                    {{ getOfficer(title).name }}
                  </h3>
                  <div class="flex flex-1 items-center justify-center">
                    <p
                      class="rounded-2xl bg-aqua/10 px-2 py-1.5 text-[9px] font-bold leading-snug text-aqua sm:px-4 sm:py-2 sm:text-sm"
                    >
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
