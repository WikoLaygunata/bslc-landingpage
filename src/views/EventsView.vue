<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getStorageUrl } from '@/api/api'
import { ensureEventsLoaded, ensureYearsLoaded, landingData } from '@/stores/data'

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const selectedEvent = ref(null)

const years = computed(() => {
  if (landingData.years.length > 0) return landingData.years
  return [currentYear]
})

const events = computed(() => {
  const eventList = landingData.eventsByYear[selectedYear.value] || []

  return [...eventList].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

function formatDate(date) {
  if (!date) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function openEventModal(event) {
  selectedEvent.value = event
}

function closeEventModal() {
  selectedEvent.value = null
}

onMounted(async () => {
  await ensureYearsLoaded()

  if (landingData.years.includes(currentYear)) {
    selectedYear.value = currentYear
  } else if (landingData.years.length > 0) {
    selectedYear.value = landingData.years[0]
  }

  await ensureEventsLoaded(selectedYear.value)
})

watch(selectedYear, async (year) => {
  await ensureEventsLoaded(year)
})
</script>

<template>
  <main class="min-h-screen bg-white">
    <section class="relative overflow-hidden bg-slate-50 px-4 py-14 sm:px-6 md:py-20">
      <div class="absolute right-0 top-0 h-72 w-72 translate-x-1/3 rounded-full bg-aqua/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 rounded-full bg-dark-green/10 blur-3xl"></div>

      <div class="relative z-10 mx-auto max-w-6xl">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="font-tangerine text-5xl font-bold text-aqua">Events</p>
          <h1 class="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Our Events</h1>
          <p class="mt-4 max-w-2xl text-gray-700">
            Explore BSLC events and programs by year.
          </p>
        </div>

        <label class="flex w-full flex-col gap-2 text-sm font-semibold text-gray-700 md:w-48">
          Year
          <select
            v-model.number="selectedYear"
            class="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/20"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </label>
      </div>

      <p
        v-if="landingData.errors.years || landingData.errors.events"
        class="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ landingData.errors.years || landingData.errors.events }}
      </p>

      <div v-if="landingData.loading.events" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="index in 4"
          :key="index"
          class="h-96 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
        ></div>
      </div>

      <div
        v-else-if="events.length === 0"
        class="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center"
      >
        <p class="text-lg font-semibold text-slate-700">No events found for {{ selectedYear }}.</p>
        <p class="mt-2 text-sm text-slate-500">Try selecting another year.</p>
      </div>

      <div v-else class="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="event in events"
          :key="event.id"
          class="group flex cursor-pointer overflow-hidden rounded-3xl bg-white text-left shadow-lg ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          role="button"
          tabindex="0"
          @click="openEventModal(event)"
          @keydown.enter="openEventModal(event)"
          @keydown.space.prevent="openEventModal(event)"
        >
          <div class="flex w-full flex-col">
            <div class="relative h-56 overflow-hidden bg-dark-green">
              <img
                v-if="event.image_path"
                :src="getStorageUrl(event.image_path)"
                :alt="event.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-linear-to-br from-dark-green to-aqua p-8 text-center"
              >
                <span class="text-3xl font-bold text-white">{{ event.title }}</span>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent"></div>
            </div>

            <div class="flex flex-1 flex-col p-6">
              <p v-if="event.created_at" class="mb-3 text-sm font-semibold text-aqua">
                {{ formatDate(event.created_at) }}
              </p>
              <h2 class="text-2xl font-bold leading-tight text-slate-900">{{ event.title }}</h2>
              <p class="mt-3 line-clamp-4 leading-relaxed text-slate-600">
                {{ event.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="event-modal">
        <div
          v-if="selectedEvent"
          class="fixed inset-0 z-70 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
          @click.self="closeEventModal"
        >
          <article
            class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:max-w-6xl lg:flex-row"
          >
            <div class="relative h-64 shrink-0 bg-dark-green sm:h-80 lg:h-auto lg:w-[58%]">
              <img
                v-if="selectedEvent.image_path"
                :src="getStorageUrl(selectedEvent.image_path)"
                :alt="selectedEvent.title"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-linear-to-br from-dark-green to-aqua p-8 text-center"
              >
                <span class="text-3xl font-bold text-white sm:text-4xl">{{ selectedEvent.title }}</span>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-32 lg:bg-linear-to-l"></div>
              <button
                type="button"
                class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-700 shadow transition hover:bg-white hover:text-aqua lg:hidden"
                aria-label="Close event detail"
                @click="closeEventModal"
              >
                ×
              </button>
            </div>

            <div class="relative max-h-[calc(90vh-16rem)] overflow-y-auto p-6 sm:p-8 lg:max-h-[90vh] lg:flex-1 lg:p-10">
              <button
                type="button"
                class="absolute right-5 top-5 hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-700 transition hover:bg-aqua hover:text-white lg:flex"
                aria-label="Close event detail"
                @click="closeEventModal"
              >
                ×
              </button>
              <p v-if="selectedEvent.created_at" class="text-sm font-semibold text-aqua">
                {{ formatDate(selectedEvent.created_at) }}
              </p>
              <h2 class="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:pr-12">
                {{ selectedEvent.title }}
              </h2>
              <p class="mt-1 text-sm font-medium text-slate-400">Event year {{ selectedEvent.year }}</p>
              <p class="mt-6 whitespace-pre-line text-base leading-8 text-slate-700">
                {{ selectedEvent.description }}
              </p>
            </div>
          </article>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.event-modal-enter-active,
.event-modal-leave-active {
  transition: opacity 0.2s ease;
}

.event-modal-enter-from,
.event-modal-leave-to {
  opacity: 0;
}
</style>
