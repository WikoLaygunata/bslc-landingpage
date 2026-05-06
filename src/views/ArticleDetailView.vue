<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getStorageUrl } from '@/api/api'
import { ensureArticleDetailLoaded, landingData } from '@/stores/data'

const route = useRoute()
const slug = computed(() => route.params.slug)
const article = computed(() => landingData.articleDetailsBySlug[slug.value])
const isLoadingArticle = computed(() => landingData.loading.articleDetailsBySlug[slug.value])
const articleError = computed(() => landingData.errors.articleDetailsBySlug[slug.value] || '')

function normalizeTiptapHtml(html = '') {
  if (typeof document === 'undefined') return html

  const template = document.createElement('template')
  template.innerHTML = html

  template.content.querySelectorAll('img').forEach((image) => {
    const containerStyle = image.getAttribute('containerstyle')
    const wrapperStyle = image.getAttribute('wrapperstyle')

    if (!containerStyle && !wrapperStyle) return

    const wrapper = document.createElement('div')
    const container = document.createElement('div')

    if (wrapperStyle) wrapper.setAttribute('style', wrapperStyle)
    if (containerStyle) container.setAttribute('style', containerStyle)

    image.removeAttribute('wrapperstyle')
    image.removeAttribute('containerstyle')

    image.parentNode?.insertBefore(wrapper, image)
    wrapper.appendChild(container)
    container.appendChild(image)
  })

  return template.innerHTML
}

const normalizedArticleContent = computed(() => normalizeTiptapHtml(article.value?.content || ''))

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

      <div v-if="isLoadingArticle" class="mt-8 space-y-5">
        <div class="h-72 animate-pulse rounded-3xl bg-slate-100"></div>
        <div class="h-8 w-3/4 animate-pulse rounded bg-slate-100"></div>
        <div class="h-4 w-40 animate-pulse rounded bg-slate-100"></div>
        <div class="space-y-3">
          <div v-for="index in 5" :key="index" class="h-4 animate-pulse rounded bg-slate-100"></div>
        </div>
      </div>

      <div v-else-if="articleError" class="mt-8 rounded-xl bg-red-50 px-4 py-3 text-red-700">
        {{ articleError }}
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
          v-html="normalizedArticleContent"
        ></div>
      </article>

      <div
        v-else
        class="mt-8 rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center"
      >
        <p class="text-lg font-semibold text-slate-700">Article not found.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.prose-article :deep(p) {
  margin: 0.5rem 0;
}

.prose-article :deep(p:empty) {
  min-height: 1rem;
  margin: 0.25rem 0;
}

.prose-article :deep(h1),
.prose-article :deep(h2),
.prose-article :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #0f172a;
}

.prose-article :deep(h1) {
  font-size: 2.25rem;
  line-height: 1.2;
}

.prose-article :deep(h2) {
  font-size: 1.875rem;
  line-height: 1.25;
}

.prose-article :deep(h3) {
  font-size: 1.5rem;
  line-height: 1.3;
}

.prose-article :deep(ul),
.prose-article :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.prose-article :deep(ul) {
  list-style: disc;
}

.prose-article :deep(ol) {
  list-style: decimal;
}

.prose-article :deep(img) {
  max-width: 100%;
  height: auto;
}

.prose-article :deep(blockquote) {
  margin: 0.75rem 0;
  border-left: 4px solid var(--aqua);
  background: #f8fafc;
  padding: 1rem 1.25rem;
  color: #475569;
}

.prose-article :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.prose-article :deep(mark) {
  border-radius: 0.25rem;
  background: #fef08a;
  padding: 0.1rem 0.25rem;
}

.prose-article :deep(code) {
  border-radius: 0.375rem;
  background: #e2e8f0;
  padding: 0.15rem 0.35rem;
  color: #0f172a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 0.9em;
}

.prose-article :deep(pre) {
  margin: 0.75rem 0;
  overflow-x: auto;
  border-radius: 1rem;
  background: #0f172a;
  padding: 1rem;
  color: #e2e8f0;
}

.prose-article :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.prose-article :deep(a) {
  color: var(--aqua);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose-article :deep(ul[data-type='taskList']) {
  list-style: none;
  padding-left: 0;
}

.prose-article :deep(li[data-type='taskItem']) {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin: 0.25rem 0;
}

.prose-article :deep(li[data-type='taskItem'] > label) {
  margin-top: 0.25rem;
}

.prose-article :deep(li[data-type='taskItem'] input[type='checkbox']) {
  width: 1rem;
  height: 1rem;
  accent-color: var(--aqua);
}

.prose-article :deep(li[data-type='taskItem'] > div p) {
  margin-bottom: 0;
  transform: translateY(-4px);
}
</style>
