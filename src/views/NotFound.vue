<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="min-h-screen overflow-x-clip bg-white">
    <section
      class="relative flex min-h-[70vh] items-center overflow-hidden bg-linear-to-b from-white via-slate-50 to-white px-4 py-16 sm:px-6"
    >
      <div
        class="absolute right-0 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-aqua/5 blur-3xl sm:h-96 sm:w-96 sm:translate-x-1/3 sm:bg-aqua/15"
      ></div>
      <div
        class="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 rounded-full bg-dark-green/5 blur-3xl sm:h-80 sm:w-80 sm:-translate-x-1/3 sm:bg-dark-green/10"
      ></div>

      <div class="relative z-10 mx-auto max-w-3xl text-center">
        <span
          class="inline-flex rounded-full border border-aqua/20 bg-aqua/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-aqua"
        >
          Page Not Found
        </span>
        <h1 class="mt-5 text-7xl font-black tracking-tight text-aqua sm:text-8xl md:text-9xl">
          404
        </h1>
        <h2 class="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">
          Oops, this page is missing.
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <RouterLink
            to="/"
            class="inline-flex justify-center rounded-full bg-aqua px-6 py-3 font-bold text-white shadow-lg shadow-aqua/20 transition hover:-translate-y-0.5 hover:bg-aqua-hover"
          >
            Back to Home
          </RouterLink>
          <RouterLink
            to="/articles"
            class="inline-flex justify-center rounded-full border border-aqua bg-white px-6 py-3 font-bold text-aqua transition hover:-translate-y-0.5 hover:bg-aqua hover:text-white"
          >
            Browse Articles
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
