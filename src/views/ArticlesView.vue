<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getStorageUrl } from '@/api/api'
import { createArticlesKey, ensureArticlesLoaded, landingData } from '@/stores/data'

const searchInput = ref('')
const search = ref('')
const articleType = ref('All')
const page = ref(1)
const pageSize = 12
const typeOptions = ['All', 'Event', 'Info']

const articlesKey = computed(() =>
  createArticlesKey({
    search: search.value,
    type: articleType.value === 'All' ? '' : articleType.value,
    page: page.value,
    pageSize,
  }),
)
const articlePage = computed(() => landingData.articlesByKey[articlesKey.value])
const articles = computed(() => articlePage.value?.items || [])
const meta = computed(
  () => articlePage.value?.meta || { currentPage: page.value, lastPage: 1, total: 0 },
)
const isLoadingArticles = computed(() => landingData.loading.articlesByKey[articlesKey.value])
const articlesError = computed(() => landingData.errors.articlesByKey[articlesKey.value] || '')
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
  ensureArticlesLoaded({
    search: search.value,
    type: articleType.value === 'All' ? '' : articleType.value,
    page: page.value,
    pageSize,
  })
})

watch(articleType, () => {
  page.value = 1
})

watch([search, page, articleType], () => {
  ensureArticlesLoaded({
    search: search.value,
    type: articleType.value === 'All' ? '' : articleType.value,
    page: page.value,
    pageSize,
  })
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
        class="absolute bottom-10 left-0 h-64 w-64 -translate-x-1/2 rounded-full bg-dark-green/5 blur-3xl sm:h-80 sm:w-80 sm:-translate-x-1/3 sm:bg-dark-green/10"
      ></div>
      <div
        class="absolute left-1/2 top-36 hidden h-64 w-64 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl sm:block"
      ></div>

      <div class="relative z-10 mx-auto max-w-7xl">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="font-tangerine text-5xl font-bold text-aqua">Articles</p>
            <h1 class="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Latest Articles</h1>
            <p class="mt-4 max-w-2xl text-gray-700">
              Read stories, updates, and insights from BINUS Student Learning Community.
            </p>
          </div>

          <form
            class="flex w-full gap-2 rounded-2xl border border-slate-200 bg-white/85 p-2 shadow-xl shadow-slate-200/60 backdrop-blur md:w-md"
            @submit.prevent="submitSearch"
          >
            <input
              v-model="searchInput"
              type="search"
              class="min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-aqua/30 focus:bg-white focus:ring-2 focus:ring-aqua/10 sm:px-4 sm:py-3 sm:text-base"
              placeholder="Search article..."
            />
            <button
              type="submit"
              class="rounded-xl bg-aqua px-4 py-2 text-sm font-bold text-white shadow-lg shadow-aqua/20 transition hover:bg-aqua-hover sm:px-5 sm:py-3 sm:text-base"
            >
              Search
            </button>
          </form>
        </div>

        <p
          v-if="articlesError"
          class="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {{ articlesError }}
        </p>

        <div v-if="isLoadingArticles" class="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
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
              <div class="ml-auto h-3 w-20 animate-pulse rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>

        <div v-else class="mt-12">
          <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm font-medium text-slate-500">
              Showing {{ articles.length }} of {{ meta.total }} articles
            </p>
            <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              Type
              <select
                v-model="articleType"
                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/20"
              >
                <option v-for="option in typeOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
          </div>

          <div
            v-if="articles.length === 0"
            class="rounded-3xl border border-dashed border-aqua/30 bg-white/85 px-6 py-16 text-center shadow-xl shadow-slate-100"
          >
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aqua/10 text-3xl font-bold text-aqua"
            >
              ?
            </div>
            <p class="text-lg font-semibold text-slate-700">No articles found.</p>
            <p class="mt-2 text-sm text-slate-500">Try another keyword or type.</p>
          </div>

          <div v-else class="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            <RouterLink
              v-for="article in articles"
              :key="article.id"
              :to="`/articles/${article.slug}`"
              class="group flex overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-aqua/30"
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
                    class="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-dark-green to-aqua p-4 text-center"
                  >
                    <div
                      class="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl"
                    ></div>
                    <div
                      class="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-cyan/20 blur-2xl"
                    ></div>
                    <span class="text-lg font-bold text-white">{{ article.title }}</span>
                  </div>
                  <div
                    class="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/55 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                  ></div>
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition duration-300 group-hover:opacity-100"
                  >
                    <span
                      class="rounded-full border border-white/40 bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur sm:text-sm"
                    >
                      Read Article
                    </span>
                  </div>
                </div>

                <div class="flex flex-1 flex-col p-4">
                  <h2
                    class="line-clamp-3 text-sm font-bold leading-snug text-slate-900 sm:text-base md:text-md"
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
        </div>

        <div v-if="meta.lastPage > 1" class="mt-10 flex items-center justify-end gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-aqua hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
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
              class="flex h-10 w-10 items-center justify-center rounded-full border font-bold shadow-sm transition"
              :class="
                page === item
                  ? 'border-aqua bg-aqua text-white shadow-aqua/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-aqua hover:text-aqua'
              "
              @click="goToPage(item)"
            >
              {{ item }}
            </button>
          </template>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-aqua hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page >= meta.lastPage"
            @click="goToPage(page + 1)"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
