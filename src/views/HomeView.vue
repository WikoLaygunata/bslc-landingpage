<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const googleFormAction =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSchq426C-GPGO8n1S7PQ-PZIje0FQiuzmLE2hW9rnS-Fa0hMA/formResponse'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/45 transition duration-300 focus:border-aqua focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-aqua/20'

const dynamicWords = ['CONNECT', 'LEARN', 'GROW']
const wordIndex = ref(0)
let wordIntervalId = null

const rolesData = {
  mentor: {
    icon: '/home/mentor-icon.svg',
    count: '30+',
    title: 'Mentors',
    description:
      'Mentor adalah anggota BSLC yang berperan sebagai pengajar dalam kegiatan mentoring. Mentor berasal dari berbagai jurusan di BINUS University untuk memberikan bimbingan belajar bagi para adik kelasnya, atau disebut sebagai Mentee di kegiatan mentoring BSLC.',
    benefits: [
      'Soft Skill',
      'Networking',
      'SAT Points',
      'Certificate',
      'Teaching Experience',
      'Exclusive Modules',
      "Exclusive Access to BSLC's Events",
    ],
  },
  nindya: {
    icon: '/home/nindya-icon.svg',
    count: '60+',
    title: 'Nindyas',
    description:
      'Nindya adalah sebutan untuk pengurus BSLC yang bertugas menangani seluruh kegiatan BSLC, baik kegiatan mentoring, event-event BSLC seperti seminar, kebersamaan, hingga perekrutan Nindya baru itu sendiri. Kata Nindya sendiri diambil dari tingkatan tertinggi di pramuka.',
    benefits: ['Soft Skill', 'Networking', 'SAT Points', 'Certificate', 'Knowledge'],
    divisions: ['Human Capital', 'Learning', 'Marketing', 'Information Technology'],
  },
  mentee: {
    icon: '/home/mentee-icon.svg',
    count: '90+',
    title: 'Mentees',
    description:
      'Mentee adalah siswa/murid dari kegiatan mentoring. Keanggotaan Mentee BSLC hanya dapat berasal dari semester 1 dan 2. Mentee akan dibantu oleh Mentor jika ada kesulitan belajar atau memahami materi kuliah sesuai jurusannya.',
    benefits: ['Soft Skill', 'Networking', 'SAT Points', 'Exclusive Modules'],
  },
}

const roleKeys = Object.keys(rolesData)
const activeRole = ref('mentor')
const activeRoleData = computed(() => rolesData[activeRole.value])

const divisionColors = {
  'Human Capital': '#FF8484',
  Learning: '#FFB084',
  Marketing: '#8498FF',
  'Information Technology': '#C184FF',
}

const years = ['2007', '2012', '2025']
const activeYear = ref('2007')
const historyContent = {
  2007: 'Saat itu, jumlah anggota mencapai lebih dari <strong>100 mahasiswa</strong>, sementara tim penggerak (Nindya) masih berjumlah kurang dari <strong>20 orang</strong>, namun semangat mereka menjadi pondasi kuat bagi program mentoring.',
  2012: 'Seiring lahirnya Binus Online Learning, BLC beradaptasi dengan perubahan besar di dunia pendidikan. Nama komunitas resmi <strong>diperbarui menjadi Binus Student Learning Community (BSLC)</strong> untuk mencerminkan dukungan yang lebih luas, menjangkau mahasiswa baik di kelas tatap muka maupun pembelajaran online.',
  2025: 'BSLC melakukan <strong>rekonstruksi visi dan misi</strong> sebagaimana seperti yang tertulis sekarang. BSLC juga <strong>kembali mengadakan Kelas Responsi</strong> dengan total lebih dari 2000 peserta di seluruh BINUS.',
}

const isSubmitting = ref(false)
const showSuccess = ref(false)
let successTimeoutId = null

onMounted(() => {
  wordIntervalId = window.setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % dynamicWords.length
  }, 1500)
})

onUnmounted(() => {
  if (wordIntervalId) window.clearInterval(wordIntervalId)
  if (successTimeoutId) window.clearTimeout(successTimeoutId)
})

async function handleContactSubmit(event) {
  const form = event.target
  const formData = new FormData(form)

  isSubmitting.value = true

  try {
    await fetch(googleFormAction, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })

    form.reset()
    showSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (successTimeoutId) window.clearTimeout(successTimeoutId)
    successTimeoutId = window.setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="overflow-x-clip">
    <Transition name="success-message">
      <div
        v-if="showSuccess"
        class="fixed left-1/2 top-24 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-aqua/30 bg-white/95 px-5 py-4 text-center text-sm font-semibold text-aqua shadow-2xl shadow-aqua/10 backdrop-blur"
      >
        Message sent successfully. Thank you for contacting BSLC.
      </div>
    </Transition>

    <section
      id="home"
      class="relative flex h-screen w-full items-center justify-center text-center"
    >
      <div class="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/home/mainImage.svg"
          alt="BINUS Student Learning Community"
          class="absolute inset-x-0 top-[-20%] h-[120%] w-full object-cover"
        />
      </div>
      <div class="absolute inset-0 z-10 bg-black/60"></div>
      <div
        class="pointer-events-none absolute -left-32 bottom-24 z-10 h-72 w-72 rounded-full bg-aqua/25 blur-3xl"
      ></div>
      <div
        class="pointer-events-none absolute -right-28 top-24 z-10 h-80 w-80 rounded-full bg-cyan/15 blur-3xl"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-linear-to-t from-black/50 to-transparent"
      ></div>

      <div class="relative z-20 flex flex-col items-center justify-center px-4">
        <p
          class="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-light uppercase tracking-[0.28em] text-white/90 shadow-lg backdrop-blur md:text-base"
        >
          BINUS STUDENT LEARNING COMMUNITY
        </p>

        <h1
          class="mt-2 flex flex-nowrap items-center justify-center gap-3 text-[clamp(1.65rem,8vw,2.5rem)] font-medium text-white sm:gap-3 sm:text-5xl md:gap-4 md:text-6xl"
        >
          <span class="flex shrink-0 flex-col text-center leading-none md:block md:leading-normal">
            <span>Where</span>
            <span class="md:ml-2">Students</span>
          </span>
          <span class="ms-4 inline-block w-[9ch] shrink-0 overflow-hidden text-left">
            <Transition name="hero-word" mode="out-in">
              <span
                :key="dynamicWords[wordIndex]"
                class="inline-block font-bold text-aqua drop-shadow-[0_2px_8px_rgba(25,168,157,0.7)]"
              >
                {{ dynamicWords[wordIndex] }}
              </span>
            </Transition>
          </span>
        </h1>
      </div>

      <div
        class="absolute bottom-0 left-1/2 z-20 w-11/12 max-w-6xl -translate-x-1/2 translate-y-1/4 overflow-hidden rounded-[20px] border border-white/25 bg-linear-to-br from-aqua via-aqua to-dark-green px-4 py-6 text-center text-white shadow-2xl shadow-aqua/25 transition-all duration-300 ease-in-out before:absolute before:-left-20 before:-top-20 before:h-48 before:w-48 before:rounded-full before:bg-white/15 before:blur-2xl after:absolute after:-bottom-20 after:-right-20 after:h-52 after:w-52 after:rounded-full after:bg-cyan/20 after:blur-2xl md:translate-y-1/3 md:rounded-[30px] md:px-6 md:py-8 lg:translate-y-1/2 lg:py-10"
      >
        <h2 class="relative text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-none">
          About <span class="font-tangerine">Us</span>
        </h2>
        <p class="relative mt-2 px-2 text-[clamp(0.875rem,2.5vw,1rem)] leading-snug text-white/95">
          <strong>BINUS Student Learning Community (BSLC)</strong> adalah sebuah unit kegiatan
          kemahasiswaan yang berfokus pada bidang penalaran. Sejak pendiriannya di tahun 2008, BSLC
          terus berkembang sebagai <strong>rekan belajar bagi para Binusian</strong> dalam
          menciptakan suasana belajar yang menyenangkan salah satunya melalui program mentoring.
          Sebagai sebuah komunitas belajar, BSLC juga berperan untuk meningkatkan soft skill dan
          hard skill mahasiswa terutama di bidang
          <strong>Academic, Employability, dan Organizational.</strong>
        </p>
      </div>
    </section>

    <section
      id="visimisi"
      class="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-white py-28 md:py-36"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/5 blur-3xl"
      ></div>
      <img
        src="/home/vision.svg"
        alt=""
        class="absolute -right-28 top-0 z-0 h-[400px] w-[400px] -translate-y-1/4 object-contain opacity-70 drop-shadow-2xl md:-right-36 md:h-[500px] md:w-[500px] lg:-right-24 lg:h-[600px] lg:w-[600px]"
        aria-hidden="true"
      />
      <img
        src="/home/mission.svg"
        alt=""
        class="absolute -left-28 bottom-0 z-0 h-[400px] w-[400px] translate-y-1/4 object-contain opacity-70 drop-shadow-2xl md:-left-36 md:h-[500px] md:w-[500px] lg:-left-24 lg:h-[600px] lg:w-[600px]"
        aria-hidden="true"
      />

      <div class="relative z-10 mx-auto max-w-7xl space-y-24 px-4 lg:px-8">
        <div class="flex justify-end">
          <div class="w-full md:w-3/5 lg:w-1/2">
            <div
              class="rounded-3xl border border-white/70 bg-white/70 p-6 text-center shadow-xl shadow-slate-200/50 backdrop-blur md:p-8 md:text-right"
            >
              <h3 class="text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
                <span class="font-tangerine text-aqua">Our</span> Vision
              </h3>
              <p class="mt-4 text-base text-gray-700 md:text-lg">
                Menjadi komunitas belajar yang unggul dan kolaboratif untuk menghasilkan generasi
                berprestasi melalui pengembangan akademik, keterampilan, dan kepemimpinan yang
                berdampak bagi masyarakat.
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-start">
          <div class="w-full md:w-3/5 lg:w-1/2">
            <div
              class="rounded-3xl border border-white/70 bg-white/70 p-6 text-center shadow-xl shadow-slate-200/50 backdrop-blur md:p-8 md:text-left"
            >
              <h3 class="text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
                <span class="font-tangerine text-aqua">Our</span> Mission
              </h3>
              <ul
                class="mx-auto mt-4 max-w-xl list-outside list-disc space-y-3 pl-5 text-left text-base text-gray-700 md:mx-0 md:text-lg"
              >
                <li>
                  Menyediakan program pembelajaran yang menyenangkan, suportif, dan inklusif di
                  lingkungan kampus untuk mendukung akademik mahasiswa BINUS.
                </li>
                <li>
                  Mengembangkan ekosistem organisasi yang adaptif, profesional, dan berintegritas.
                </li>
                <li>
                  Mendorong pertumbuhan soft skill dan employability melalui pengalaman belajar
                  kolaboratif dan berdampak.
                </li>
                <li>
                  Memberikan kontribusi nyata di lingkungan sosial melalui program edukasi dan
                  pemberdayaan masyarakat.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="about"
      class="relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-slate-100 via-white to-slate-100 px-4 py-8 text-center"
    >
      <div
        class="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-aqua/10 blur-3xl"
      ></div>
      <div
        class="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-dark-green/10 blur-3xl"
      ></div>
      <section id="roles" class="w-full px-2 py-20 sm:px-4 lg:px-6">
        <div class="relative mx-auto max-w-7xl text-center">
          <div class="mb-12">
            <p class="font-tangerine text-4xl font-bold text-aqua">Membership</p>
            <h2 class="mt-2 text-4xl font-bold text-slate-800">Explore the Roles</h2>
          </div>

          <div
            class="mx-auto flex w-fit justify-center rounded-full border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/60"
          >
            <button
              v-for="role in roleKeys"
              :key="role"
              type="button"
              class="cursor-pointer rounded-full px-4 py-2 text-base font-semibold capitalize transition-all duration-300 sm:px-6 sm:text-lg"
              :class="
                activeRole === role
                  ? 'bg-aqua text-white shadow-md shadow-aqua/25'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              "
              @click="activeRole = role"
            >
              {{ role }}
            </button>
          </div>

          <div
            class="mt-10 rounded-4xl border border-white bg-white/80 p-6 text-left shadow-2xl shadow-slate-200/70 backdrop-blur md:p-10"
          >
            <div class="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-12">
              <div
                class="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl bg-linear-to-b from-aqua/10 to-transparent p-8 text-center"
              >
                <img
                  :src="activeRoleData.icon"
                  :alt="`${activeRoleData.title} Icon`"
                  class="mb-4 h-28 w-28 drop-shadow-xl"
                />
                <p class="text-5xl font-bold text-aqua">{{ activeRoleData.count }}</p>
                <p class="text-lg text-slate-600">{{ activeRoleData.title }}</p>
              </div>

              <div>
                <p class="mb-8 text-slate-600">{{ activeRoleData.description }}</p>
                <div :class="activeRole === 'nindya' ? 'grid gap-8 lg:grid-cols-2' : ''">
                  <div>
                    <h3 class="mb-4 text-2xl font-semibold text-slate-800">Benefits</h3>
                    <ul
                      class="grid grid-cols-1 gap-x-6 gap-y-3 text-slate-700"
                      :class="{ 'sm:grid-cols-2': activeRole !== 'nindya' }"
                    >
                      <li
                        v-for="benefit in activeRoleData.benefits"
                        :key="benefit"
                        class="flex items-center rounded-xl bg-slate-50 px-3 py-2"
                      >
                        <svg
                          class="mr-2 h-5 w-5 shrink-0 text-aqua"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {{ benefit }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="activeRole === 'nindya'">
                    <h3 class="mb-4 text-2xl font-semibold text-slate-800">Available Division</h3>
                    <div class="flex flex-col space-y-3">
                      <span
                        v-for="division in activeRoleData.divisions"
                        :key="division"
                        class="inline-flex w-60 items-center rounded-xl px-3 py-2 font-normal text-white shadow-md"
                        :style="{ backgroundColor: divisionColors[division] }"
                      >
                        {{ division }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <section
      id="history"
      class="relative w-full overflow-hidden bg-white px-4 py-16 text-center md:py-24"
    >
      <img
        src="/home/solution.svg"
        alt=""
        class="absolute right-[5%] top-1/4 z-0 hidden w-1/4 max-w-xs translate-x-1/4 rotate-12 select-none lg:block"
        aria-hidden="true"
      />
      <img
        src="/home/growth.svg"
        alt=""
        class="absolute bottom-1/4 left-[5%] z-0 hidden w-1/4 max-w-xs -translate-x-1/5 -rotate-12 select-none lg:block"
        aria-hidden="true"
      />

      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-aqua/30 to-transparent"
      ></div>
      <div class="relative z-10 mx-auto max-w-4xl">
        <header
          class="rounded-4xl border border-slate-100 bg-white/80 px-6 py-8 shadow-xl shadow-slate-100/80 backdrop-blur"
        >
          <h3 class="font-tangerine text-5xl italic text-aqua">History</h3>
          <h2 class="mt-2 text-4xl font-bold text-slate-800 md:text-5xl">
            Where Journey of Growth Began
          </h2>
          <p class="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-600">
            Semua berawal dari visi sederhana: membantu mahasiswa Binus meraih kelulusan tanpa harus
            mengandalkan bimbel mahal. Dari sana, lahirlah BLC. Dengan berkembangnya Binus, BLC
            bertransformasi menjadi BSLC, dan hadir Nindya sebagai penggerak utama kegiatan
            mentoring.
          </p>
        </header>

        <div class="mt-16">
          <div
            class="relative mx-auto flex max-w-lg items-start justify-between rounded-full bg-slate-50 px-4 py-3 shadow-inner"
          >
            <div
              class="absolute left-1/2 top-[48px] z-0 h-0.5 w-4/5 -translate-x-1/2 bg-slate-200"
            ></div>

            <div
              v-for="year in years"
              :key="year"
              class="relative z-10 flex flex-col items-center gap-4"
            >
              <button
                type="button"
                class="rounded-full px-3 py-1 text-2xl font-light transition-all duration-300 md:text-3xl"
                :class="
                  activeYear === year
                    ? 'bg-white text-aqua shadow-md'
                    : 'text-slate-300 hover:text-aqua'
                "
                @click="activeYear = year"
              >
                {{ year }}
              </button>
              <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke-width="2"
                  fill="none"
                  class="transition-all duration-300"
                  :class="activeYear === year ? 'stroke-aqua' : 'stroke-slate-300'"
                ></circle>
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  class="transition-all duration-300"
                  :class="activeYear === year ? 'fill-aqua' : 'fill-slate-300'"
                ></circle>
              </svg>
            </div>
          </div>

          <div
            class="mx-auto mt-8 flex h-[250px] max-w-2xl items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 md:h-[210px]"
          >
            <p
              class="mx-auto max-w-xl text-center leading-loose text-slate-700"
              v-html="historyContent[activeYear]"
            ></p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="wheel"
      class="relative w-full overflow-hidden bg-linear-to-b from-white via-slate-50 to-white py-16 md:py-24"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-aqua/10 blur-3xl"
      ></div>
      <div
        class="relative flex w-full"
        style="
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        "
      >
        <div class="wheel-scroll flex">
          <img
            src="/home/wheel.png"
            alt="Kumpulan logo dan gambar layanan"
            class="h-96 max-w-none shrink-0"
          />
          <img src="/home/wheel.png" alt="" class="h-96 max-w-none shrink-0" aria-hidden="true" />
        </div>
      </div>

      <div
        class="relative mx-auto mt-32 flex w-fit max-w-[calc(100%-2rem)] flex-col items-center justify-center gap-6 rounded-3xl border border-slate-100 bg-white/90 px-8 py-6 shadow-2xl shadow-slate-200/70 backdrop-blur md:flex-row md:gap-8"
      >
        <p class="text-2xl font-bold text-slate-700 md:text-3xl">Supported by</p>
        <img src="/logo/logo_dewaweb.svg" alt="Logo Dewaweb" class="h-auto w-60 object-contain" />
      </div>
    </section>

    <section
      id="contact"
      class="relative overflow-hidden bg-[#0F2D2A] px-4 py-20 text-white sm:px-6 md:py-32 lg:px-8"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.9)_0%,transparent_50%)]"
      ></div>
      <div
        class="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-aqua/20 blur-3xl"
      ></div>
      <div
        class="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/3 rounded-full bg-cyan/10 blur-3xl"
      ></div>

      <div
        class="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-8"
      >
        <div class="text-center md:text-left">
          <h2 class="text-5xl font-semibold leading-tight text-aqua md:text-7xl">
            Get in
            <br />
            Touch <span aria-hidden="true" class="ml-2">→</span>
          </h2>
          <p class="mt-4 text-lg text-white">Let's Build Something Together</p>
        </div>

        <form
          class="w-full rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8"
          @submit.prevent="handleContactSubmit"
        >
          <div class="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
            <div class="flex flex-1 flex-col gap-6">
              <div>
                <label for="contact-name" class="sr-only">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="entry.1533914090"
                  placeholder="Input Your Name"
                  :class="inputClass"
                  required
                />
              </div>

              <div>
                <label for="contact-email" class="sr-only">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="entry.4811378"
                  placeholder="Input Your Email"
                  :class="inputClass"
                  required
                />
              </div>

              <div>
                <label for="contact-subject" class="sr-only">Email Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="entry.1296170595"
                  placeholder="Input Email Subject"
                  :class="inputClass"
                  required
                />
              </div>
            </div>

            <div class="flex flex-1 flex-col">
              <div class="grow">
                <label for="contact-body" class="sr-only">Email Body</label>
                <textarea
                  id="contact-body"
                  name="entry.16163941"
                  rows="8"
                  placeholder="Input Email Body"
                  :class="[inputClass, 'h-full resize-none']"
                  required
                ></textarea>
              </div>

              <div class="mt-8 text-right">
                <button
                  type="submit"
                  class="rounded-xl border border-aqua bg-aqua px-10 py-3 font-semibold text-[#0F2D2A] shadow-lg shadow-aqua/20 transition duration-300 hover:bg-transparent hover:text-aqua disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'SENDING...' : 'SUBMIT' }}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes wheel-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.wheel-scroll {
  animation: wheel-scroll 30s linear infinite;
}

.hero-word-enter-active,
.hero-word-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.hero-word-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.hero-word-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.success-message-enter-active,
.success-message-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.success-message-enter-from,
.success-message-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
