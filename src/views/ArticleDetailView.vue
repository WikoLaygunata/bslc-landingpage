<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getStorageUrl } from '@/api/api'
import { ensureArticleDetailLoaded, landingData } from '@/stores/data'

const route = useRoute()
const slug = computed(() => route.params.slug)
const article = computed(() => landingData.articleDetailsBySlug[slug.value])

function formatDate(date) {
  if (!date) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

onMounted(() => {
  ensureArticleDetailLoaded(slug.value)
})

watch(slug, (nextSlug) => {
  ensureArticleDetailLoaded(nextSlug)
})
</script>

<template>
  <main class="min-h-screen bg-white">
    <section class="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
      <RouterLink to="/articles" class="font-semibold text-aqua transition hover:text-aqua-hover">
        ← Back to Articles
      </RouterLink>

      <div v-if="landingData.loading.articleDetail" class="mt-8 space-y-5">
        <div class="h-72 animate-pulse rounded-3xl bg-slate-100"></div>
        <div class="h-8 w-3/4 animate-pulse rounded bg-slate-100"></div>
        <div class="h-4 w-40 animate-pulse rounded bg-slate-100"></div>
        <div class="space-y-3">
          <div v-for="index in 5" :key="index" class="h-4 animate-pulse rounded bg-slate-100"></div>
        </div>
      </div>

      <div v-else-if="landingData.errors.articleDetail" class="mt-8 rounded-xl bg-red-50 px-4 py-3 text-red-700">
        {{ landingData.errors.articleDetail }}
      </div>

      <article v-else-if="article" class="mt-8">
        <img
          v-if="article.thumbnail"
          :src="getStorageUrl(article.thumbnail)"
          :alt="article.title"
          class="h-72 w-full rounded-3xl object-cover shadow-lg md:h-96"
        />
        <div
          v-else
          class="flex h-72 w-full items-center justify-center rounded-3xl bg-linear-to-br from-dark-green to-aqua p-8 text-center shadow-lg md:h-96"
        >
          <span class="text-3xl font-bold text-white md:text-5xl">{{ article.title }}</span>
        </div>

        <p class="mt-8 text-sm font-semibold text-aqua">{{ formatDate(article.created_at) }}</p>
        <h1 class="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
          {{ article.title }}
        </h1>

        <div
          class="prose-article mt-8 max-w-none text-base leading-8 text-slate-700"
          v-html="article.content"
        ></div>
      </article>

      <div v-else class="mt-8 rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center">
        <p class="text-lg font-semibold text-slate-700">Article not found.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.prose-article :deep(p) {
  margin-bottom: 1.25rem;
}

.prose-article :deep(h1),
.prose-article :deep(h2),
.prose-article :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.prose-article :deep(ul),
.prose-article :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.prose-article :deep(ul) {
  list-style: disc;
}

.prose-article :deep(ol) {
  list-style: decimal;
}
</style>
