<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const isOpen = ref(false)
const route = useRoute()

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/articles', label: 'Articles' },
  { to: '/structure', label: 'Structure' },
  { to: '/products', label: 'Products' },
]

const year = computed(() => new Date().getFullYear())

const socialLinks = [
  {
    href: 'https://www.youtube.com/c/BinusStudentLearningCommunity',
    icon: '/social/youtube-white.svg',
    label: 'YouTube',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'https://twitter.com/BSLC_BINUS',
    icon: '/social/x-white.svg',
    label: 'X',
    imgClass: 'h-6 w-6 sm:h-7 sm:w-7',
  },
  {
    href: 'https://id.linkedin.com/company/binus-student-learning-community',
    icon: '/social/linkedln.svg',
    label: 'LinkedIn',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=hlh6945o',
    icon: '/social/line-white.svg',
    label: 'LINE',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'https://www.instagram.com/bslc_binus/',
    icon: '/social/instagram-white.svg',
    label: 'Instagram',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'mailto:bslccommunity@gmail.com',
    icon: '/social/email.svg',
    label: 'Email',
    imgClass: 'h-8 w-8 sm:h-9 sm:w-9',
  },
]

const isActive = (to) =>
  route.path === to

const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground antialiased">
    <header class="sticky top-0 z-50 bg-white px-6 py-6 text-black shadow-md md:px-20 xl:px-28">
      <div class="mx-auto flex max-w-6xl items-center justify-between">
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="flex items-center gap-3" @click="closeMenu">
            <img
              src="/logo/cropped-logo-192x192.png"
              alt="BSLC Logo"
              class="h-9 w-9 object-contain"
              draggable="false"
            />
            <span class="text-base leading-snug text-bslc-ink transition hover:opacity-80">
              <span class="font-bold text-2xl text-bslc-green sm:hidden">BSLC</span>
              <span class="hidden sm:inline">
                <span class="font-bold text-bslc-green">BINUS&nbsp;</span>
                <span class="font-bold">Student Learning Community</span>
              </span>
            </span>
          </RouterLink>
        </div>

        <nav class="hidden items-center gap-10 text-base font-semibold md:flex">
          <RouterLink
            v-for="item in links"
            :key="item.to"
            :to="item.to"
            class="transition-colors duration-300 ease-out hover:text-aqua-hover"
            :class="{ 'text-aqua': isActive(item.to) }"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <button
          class="text-2xl transition-transform duration-300 ease-out md:hidden"
          :class="{ 'rotate-90': isOpen }"
          type="button"
          @click="isOpen = !isOpen"
        >
          {{ isOpen ? '✕' : '☰' }}
        </button>
      </div>

      <Transition name="mobile-menu">
        <nav
          v-if="isOpen"
          class="absolute left-0 top-full w-full overflow-hidden bg-white px-6 pb-3 text-black shadow-md md:hidden"
        >
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 pt-4">
            <RouterLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
              class="border-b border-gray-200 pb-2 font-medium transition-colors duration-300"
              :class="isActive(item.to) ? 'text-aqua' : 'text-black hover:text-aqua-hover'"
              @click="closeMenu"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </nav>
      </Transition>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-foreground text-white">
      <section class="mx-auto max-w-6xl py-10 sm:py-12 px-8">
        <div class="flex flex-col items-center sm:flex-row sm:justify-between">
          <div class="flex justify-center sm:flex-1 sm:justify-start">
            <img
              src="/logo/Logo_BSLC_White-01-1.png"
              alt="BSLC Logo"
              class="h-28 w-auto object-contain"
            />
          </div>

          <div class="mt-8 flex flex-col items-center gap-4 sm:mt-0 sm:flex-1 sm:items-end">
            <p class="text-sm font-medium text-white/95 sm:text-right">Contact us on</p>
            <div class="flex flex-wrap items-center justify-center gap-5 sm:justify-end sm:gap-6">
              <a
                v-for="item in socialLinks"
                :key="item.label"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="opacity-90 transition hover:opacity-100"
                :aria-label="item.label"
              >
                <img
                  :src="item.icon"
                  :alt="item.label"
                  class="object-contain"
                  :class="item.imgClass"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div
        class="border-t border-white/10 bg-footer py-4 text-center text-xs text-white/60 sm:text-sm"
      >
        <p>Copyright © {{ year }} | BINUS Student Learning Community</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    max-height 0.35s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  max-height: 280px;
  opacity: 1;
  transform: translateY(0);
}
</style>
