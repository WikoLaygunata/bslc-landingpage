<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getStorageUrl } from '@/api/api'
import { createArticlesKey, ensureArticlesLoaded, landingData } from '@/stores/data'

const searchInput = ref('')
const search = ref('')
const page = ref(1)
const pageSize = 12

const articlesKey = computed(() =>
  createArticlesKey({ search: search.value, page: page.value, pageSize }),
)
const articlePage = computed(() => landingData.articlesByKey[articlesKey.value])
const articles = computed(() => articlePage.value?.items || [])
const meta = computed(
  () => articlePage.value?.meta || { currentPage: page.value, lastPage: 1, total: 0 },
)
const paginationItems = computed(() => {
  const lastPage = meta.value.lastPage
  const currentPage = page.value

  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, index) => index + 1)

  const pages = new Set([1, lastPage, currentPage, currentPage - 1, currentPage + 1])
  const sortedPages = [...pages]
    .filter((item) => item >= 1 && item <= lastPage)
    .sort((a, b) => a - b)
  const items = []

  sortedPages.forEach((item, index) => {
    if (index > 0 && item - sortedPages[index - 1] > 1) {
      items.push(`ellipsis-${item}`)
    }
    items.push(item)
  })

  return items
})

function formatDate(date) {
  if (!date) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function submitSearch() {
  search.value = searchInput.value.trim()
  page.value = 1
}

function goToPage(nextPage) {
  if (nextPage < 1 || nextPage > meta.value.lastPage) return
  page.value = nextPage
}

onMounted(() => {
  ensureArticlesLoaded({ search: search.value, page: page.value, pageSize })
})

watch([search, page], () => {
  ensureArticlesLoaded({ search: search.value, page: page.value, pageSize })
})
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="font-tangerine text-5xl font-bold text-aqua">Articles</p>
          <h1 class="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Latest Articles</h1>
          <p class="mt-4 max-w-2xl text-gray-700">
            Read stories, updates, and insights from BINUS Student Learning Community.
          </p>
        </div>

        <form class="flex w-full gap-2 md:w-md" @submit.prevent="submitSearch">
          <input
            v-model="searchInput"
            type="search"
            class="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/20"
            placeholder="Search article..."
          />
          <button
            type="submit"
            class="rounded-xl bg-aqua px-5 py-3 font-semibold text-white transition hover:bg-aqua-hover"
          >
            Search
          </button>
        </form>
      </div>

      <p
        v-if="landingData.errors.articles"
        class="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ landingData.errors.articles }}
      </p>

      <div
        v-if="landingData.loading.articles"
        class="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
      >
        <div
          v-for="index in 8"
          :key="index"
          class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          <div class="h-36 animate-pulse bg-slate-200 sm:h-44"></div>
          <div class="space-y-3 p-4">
            <div class="h-3 w-24 animate-pulse rounded-full bg-slate-200"></div>
            <div class="h-4 w-full animate-pulse rounded-full bg-slate-200"></div>
            <div class="h-4 w-3/4 animate-pulse rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      <div
        v-else-if="articles.length === 0"
        class="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
      >
        <p class="text-lg font-semibold text-slate-700">No articles found.</p>
        <p class="mt-2 text-sm text-slate-500">Try another keyword.</p>
      </div>

      <div v-else class="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        <RouterLink
          v-for="article in articles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="group flex overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex w-full flex-col">
            <div class="relative h-36 overflow-hidden bg-dark-green sm:h-44">
              <img
                v-if="article.thumbnail"
                :src="getStorageUrl(article.thumbnail)"
                :alt="article.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-linear-to-br from-dark-green to-aqua p-4 text-center"
              >
                <span class="text-lg font-bold text-white">{{ article.title }}</span>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-4">
              <h2
                class="line-clamp-3 text-sm font-bold leading-snug text-slate-900 sm:text-base md:text-lg"
              >
                {{ article.title }}
              </h2>
              <p class="mt-auto pt-5 text-right text-xs font-semibold text-aqua">
                {{ formatDate(article.created_at) }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-if="meta.lastPage > 1" class="mt-10 flex items-center justify-end gap-2">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 transition hover:border-aqua hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
        >
          &lt;
        </button>
        <template v-for="item in paginationItems" :key="item">
          <span
            v-if="typeof item === 'string'"
            class="flex h-10 w-10 items-center justify-center text-sm font-semibold text-slate-400"
          >
            ...
          </span>
          <button
            v-else
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border font-semibold transition"
            :class="
              page === item
                ? 'border-aqua bg-aqua text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-aqua hover:text-aqua'
            "
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 transition hover:border-aqua hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page >= meta.lastPage"
          @click="goToPage(page + 1)"
        >
          &gt;
        </button>
      </div>
    </section>
  </main>
</template>
