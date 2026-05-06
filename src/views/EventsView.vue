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
const isLoadingEvents = computed(() => landingData.loading.eventsByYear[selectedYear.value])
const eventsError = computed(() => landingData.errors.eventsByYear[selectedYear.value] || '')
const selectedEventIndex = computed(() => {
  if (!selectedEvent.value) return -1
  return events.value.findIndex((event) => event.id === selectedEvent.value.id)
})
const canNavigateEvents = computed(() => events.value.length > 1 && selectedEventIndex.value >= 0)

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

function showPreviousEvent() {
  if (!canNavigateEvents.value) return

  const previousIndex = (selectedEventIndex.value - 1 + events.value.length) % events.value.length
  selectedEvent.value = events.value[previousIndex]
}

function showNextEvent() {
  if (!canNavigateEvents.value) return

  const nextIndex = (selectedEventIndex.value + 1) % events.value.length
  selectedEvent.value = events.value[nextIndex]
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
    <section
      class="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-white px-4 py-14 sm:px-6 md:pt-20 md:pb-24"
    >
      <div
        class="absolute right-0 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-aqua/5 blur-3xl sm:h-96 sm:w-96 sm:translate-x-1/3 sm:bg-aqua/15"
      ></div>
      <div
        class="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 rounded-full bg-dark-green/5 blur-3xl sm:h-80 sm:w-80 sm:-translate-x-1/3 sm:bg-dark-green/10"
      ></div>
      <div
        class="absolute left-1/2 top-32 hidden h-64 w-64 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl sm:block"
      ></div>

      <div class="relative z-10 mx-auto max-w-6xl">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="font-tangerine text-5xl font-bold text-aqua">Events</p>
            <h1 class="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Our Events</h1>
            <p class="mt-4 max-w-2xl text-gray-700">Explore BSLC events and programs by year.</p>
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
          v-if="landingData.errors.years || eventsError"
          class="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ landingData.errors.years || eventsError }}
        </p>

        <div v-if="isLoadingEvents" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="index in 4"
            :key="index"
            class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
          >
            <div class="h-56 animate-pulse bg-slate-200"></div>
            <div class="space-y-4 p-6">
              <div class="h-5 w-4/5 animate-pulse rounded-full bg-slate-200"></div>
              <div class="h-4 w-full animate-pulse rounded-full bg-slate-100"></div>
              <div class="h-4 w-2/3 animate-pulse rounded-full bg-slate-100"></div>
              <div class="ml-auto h-4 w-28 animate-pulse rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="events.length === 0"
          class="mt-12 rounded-3xl border border-dashed border-aqua/30 bg-white/80 px-6 py-16 text-center shadow-xl shadow-slate-100"
        >
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aqua/10 text-3xl font-bold text-aqua"
          >
            ?
          </div>
          <p class="text-lg font-semibold text-slate-700">
            No events found for {{ selectedYear }}.
          </p>
          <p class="mt-2 text-sm text-slate-500">Try selecting another year.</p>
        </div>

        <div v-else class="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="event in events"
            :key="event.id"
            class="group flex cursor-pointer overflow-hidden rounded-3xl bg-white text-left shadow-lg ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-aqua/30"
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
                  class="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-dark-green to-aqua p-8 text-center"
                >
                  <div
                    class="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                  ></div>
                  <div
                    class="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-cyan/20 blur-2xl"
                  ></div>
                  <span class="text-3xl font-bold text-white">{{ event.title }}</span>
                </div>
                <div
                  class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent"
                ></div>
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition duration-300 group-hover:opacity-100"
                >
                  <span
                    class="rounded-full border border-white/40 bg-white/20 px-5 py-2 text-sm font-bold text-white backdrop-blur"
                  >
                    View Details
                  </span>
                </div>
              </div>

              <div class="flex flex-1 flex-col p-6">
                <h2 class="text-2xl font-bold leading-tight text-slate-900">{{ event.title }}</h2>
                <p class="mt-3 line-clamp-4 leading-relaxed text-slate-600">
                  {{ event.description }}
                </p>
                <p
                  v-if="event.created_at"
                  class="mt-auto pt-5 text-right text-sm font-semibold text-aqua"
                >
                  {{ formatDate(event.created_at) }}
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
          <button
            v-if="canNavigateEvents"
            type="button"
            class="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/90 text-3xl font-bold text-slate-700 shadow-xl backdrop-blur transition hover:bg-aqua hover:text-white sm:left-5 sm:h-12 sm:w-12"
            aria-label="Show previous event"
            @click.stop="showPreviousEvent"
          >
            ‹
          </button>
          <button
            v-if="canNavigateEvents"
            type="button"
            class="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/90 text-3xl font-bold text-slate-700 shadow-xl backdrop-blur transition hover:bg-aqua hover:text-white sm:right-5 sm:h-12 sm:w-12"
            aria-label="Show next event"
            @click.stop="showNextEvent"
          >
            ›
          </button>
          <article
            class="event-modal-card flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:max-w-6xl lg:flex-row"
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
                <span class="text-3xl font-bold text-white sm:text-4xl">{{
                  selectedEvent.title
                }}</span>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-32 lg:bg-linear-to-l"
              ></div>
              <button
                type="button"
                class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-700 shadow transition hover:bg-white hover:text-aqua lg:hidden"
                aria-label="Close event detail"
                @click="closeEventModal"
              >
                ×
              </button>
            </div>

            <div
              class="relative max-h-[calc(90vh-16rem)] overflow-y-auto p-6 sm:p-8 lg:max-h-[90vh] lg:flex-1 lg:p-10"
            >
              <button
                type="button"
                class="absolute right-5 top-5 hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-700 transition hover:bg-aqua hover:text-white lg:flex"
                aria-label="Close event detail"
                @click="closeEventModal"
              >
                ×
              </button>
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="selectedEvent.created_at"
                  class="rounded-full bg-aqua/10 px-3 py-1 text-sm font-bold text-aqua"
                >
                  {{ formatDate(selectedEvent.created_at) }}
                </span>
                <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
                  {{ selectedEvent.year }}
                </span>
              </div>
              <h2 class="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:pr-12">
                {{ selectedEvent.title }}
              </h2>
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
  transition: opacity 0.22s ease;
}

.event-modal-enter-from,
.event-modal-leave-to {
  opacity: 0;
}

.event-modal-enter-active .event-modal-card,
.event-modal-leave-active .event-modal-card {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.event-modal-enter-from .event-modal-card,
.event-modal-leave-to .event-modal-card {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
