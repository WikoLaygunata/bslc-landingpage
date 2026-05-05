<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const googleFormAction =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSchq426C-GPGO8n1S7PQ-PZIje0FQiuzmLE2hW9rnS-Fa0hMA/formResponse'

const inputClass =
  'w-full border-b border-gray-500 bg-transparent py-3 text-white placeholder-gray-400 transition duration-300 focus:border-aqua focus:outline-none'

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
  }, 1000)
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
  <main>
    <Transition name="success-message">
      <div
        v-if="showSuccess"
        class="fixed left-1/2 top-24 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-aqua/30 bg-white px-5 py-4 text-center text-sm font-semibold text-aqua shadow-xl"
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

      <div class="relative z-20 flex flex-col items-center justify-center px-4">
        <p class="text-lg font-light uppercase tracking-widest text-white md:text-xl">
          BINUS STUDENT LEARNING COMMUNITY
        </p>

        <h1
          class="mt-2 flex flex-nowrap items-center justify-center gap-3 text-[clamp(1.65rem,8vw,2.5rem)] font-medium text-white sm:gap-3 sm:text-5xl md:gap-4 md:text-6xl"
        >
          <span class="flex shrink-0 flex-col text-center leading-none md:block md:leading-normal">
            <span>Where</span>
            <span class="md:ml-2">Students</span>
          </span>
          <span class="inline-block w-[9ch] shrink-0 text-left ms-4">
            <span class="font-bold text-aqua drop-shadow-[0_2px_8px_rgba(25,168,157,0.7)]">
              {{ dynamicWords[wordIndex] }}
            </span>
          </span>
        </h1>
      </div>

      <div
        class="absolute bottom-0 left-1/2 z-20 w-11/12 max-w-6xl -translate-x-1/2 translate-y-1/4 rounded-[15px] bg-aqua px-4 py-6 text-center text-white shadow-xl transition-all duration-300 ease-in-out md:translate-y-1/3 md:rounded-[30px] md:px-6 md:py-8 lg:translate-y-1/2 lg:py-10"
      >
        <h2 class="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-none">
          About <span class="font-tangerine">Us</span>
        </h2>
        <p class="mt-2 px-2 text-[clamp(0.875rem,2.5vw,1rem)] leading-snug">
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

    <section id="visimisi" class="relative overflow-hidden bg-white py-28 md:py-36">
      <img
        src="/home/vision.svg"
        alt=""
        class="absolute -right-28 top-0 z-0 h-[400px] w-[400px] -translate-y-1/4 object-contain opacity-100 md:-right-36 md:h-[500px] md:w-[500px] lg:-right-24 lg:h-[600px] lg:w-[600px]"
        aria-hidden="true"
      />
      <img
        src="/home/mission.svg"
        alt=""
        class="absolute -left-28 bottom-0 z-0 h-[400px] w-[400px] translate-y-1/4 object-contain opacity-100 md:-left-36 md:h-[500px] md:w-[500px] lg:-left-24 lg:h-[600px] lg:w-[600px]"
        aria-hidden="true"
      />

      <div class="relative z-10 mx-auto max-w-7xl space-y-24 px-4 lg:px-8">
        <div class="flex justify-end">
          <div class="w-full md:w-3/5 lg:w-1/2">
            <div class="p-4 text-center md:p-8 md:text-right">
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
            <div class="p-4 text-center md:p-8 md:text-left">
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
      class="flex flex-col items-center justify-center bg-slate-100 px-4 py-8 text-center"
    >
      <section id="roles" class="w-full px-2 py-20 sm:px-4 lg:px-6">
        <div class="mx-auto max-w-7xl text-center">
          <div class="mb-12">
            <p class="font-tangerine text-4xl font-bold text-aqua">Membership</p>
            <h2 class="mt-2 text-4xl font-bold text-slate-800">Explore the Roles</h2>
          </div>

          <div class="flex justify-center border-b border-slate-300">
            <button
              v-for="role in roleKeys"
              :key="role"
              type="button"
              class="cursor-pointer px-4 py-3 text-base font-semibold capitalize transition-colors duration-300 sm:px-6 sm:text-lg"
              :class="
                activeRole === role
                  ? 'border-b-2 border-aqua text-aqua'
                  : 'text-slate-500 hover:text-slate-800'
              "
              @click="activeRole = role"
            >
              {{ role }}
            </button>
          </div>

          <div class="mt-12">
            <div class="grid items-center gap-10 text-left md:grid-cols-2 lg:gap-1">
              <div class="flex flex-col items-center text-center">
                <img
                  :src="activeRoleData.icon"
                  :alt="`${activeRoleData.title} Icon`"
                  class="mb-4 h-24 w-24"
                />
                <p class="text-4xl font-bold text-aqua">{{ activeRoleData.count }}</p>
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
                        class="flex items-center"
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
                        class="inline-flex w-60 items-center rounded-lg px-3 py-2 font-normal text-white"
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

      <div class="relative z-10 mx-auto max-w-4xl">
        <header>
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
          <div class="relative mx-auto flex max-w-lg items-start justify-between">
            <div
              class="absolute left-1/2 top-[38px] -z-10 h-0.5 w-4/5 -translate-x-1/2 bg-slate-200"
            ></div>

            <div v-for="year in years" :key="year" class="flex flex-col items-center gap-4">
              <button
                type="button"
                class="text-2xl font-light transition-colors duration-300 md:text-3xl"
                :class="activeYear === year ? 'text-aqua' : 'text-slate-300 hover:text-aqua'"
                @click="activeYear = year"
              >
                {{ year }}
              </button>
              <svg class="h-6 w-6 bg-white p-1" viewBox="0 0 24 24" aria-hidden="true">
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

          <div class="mt-8 min-h-[120px]">
            <p
              class="mx-auto max-w-xl leading-loose text-slate-700"
              v-html="historyContent[activeYear]"
            ></p>
          </div>
        </div>
      </div>
    </section>

    <section id="wheel" class="w-full overflow-hidden bg-white py-16 md:py-24">
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
            src="/home/wheel.svg"
            alt="Kumpulan logo dan gambar layanan"
            class="h-96 max-w-none shrink-0"
          />
          <img src="/home/wheel.svg" alt="" class="h-96 max-w-none shrink-0" aria-hidden="true" />
        </div>
      </div>

      <div
        class="mx-auto mt-32 flex max-w-6xl flex-col items-center justify-center gap-6 px-4 md:flex-row md:gap-8"
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

        <form class="w-full" @submit.prevent="handleContactSubmit">
          <div class="flex flex-col gap-y-10 md:flex-row md:gap-x-8">
            <div class="flex flex-1 flex-col gap-10">
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
                  class="border border-aqua px-10 py-3 font-semibold text-aqua transition duration-300 hover:bg-aqua hover:text-[#0F2D2A] disabled:cursor-not-allowed disabled:opacity-60"
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
  animation: wheel-scroll 15s linear infinite;
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
