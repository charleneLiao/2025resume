<template>
    <section id="experience" class="min-h-screen snap-start px-6 py-6">
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
  
          <!-- 左欄：工作經歷 -->
          <div>
            <header class="mb-6 flex items-center gap-3">
              <span class="inline-grid h-10 w-10 place-items-center rounded-full bg-gray-200">
                <!-- briefcase icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 2a2 2 0 0 0-2 2v1H6a3 3 0 0 0-3 3v2h18V8a3 3 0 0 0-3-3h-2V4a2 2 0 0 0-2-2h-4Zm4 3V4h-4v1h4Z"/>
                  <path d="M21 11H3v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7Zm-9 2h0a1 1 0 0 1 1 1v1h6v-2H5v2h6v-1a1 1 0 0 1 1-1Z"/>
                </svg>
              </span>
              <h2 class="text-2xl font-semibold tracking-wide text-gray-800">RECENT EXPERIENCE</h2>
            </header>
  
            <ol class="relative border-s-2 border-gray-200">
              <li v-for="(it, i) in works" :key="i" class="group relative mb-8 ps-5">
                <!-- node -->
                <span class="absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 shadow ring-1 ring-indigo-300"></span>
                <!-- glow on hover -->
                <span
                  class="pointer-events-none absolute -left-[18px] top-0 hidden h-8 w-8 rounded-full bg-indigo-400/40 group-hover:block animate-ping">
                </span>
  
                <h3 class="text-lg font-semibold text-gray-800">
                  <span class="text-brand/90">{{ it.title }}</span>
                </h3>
                <p class="text-sm text-gray-500">{{ it.range }}</p>
                <p class="mt-1 text-gray-600">{{ it.desc }}</p>
              </li>
            </ol>
          </div>
  
          <!-- 右欄：學歷 -->
          <div>
            <header class="mb-6 flex items-center gap-3">
              <span class="inline-grid h-10 w-10 place-items-center rounded-full bg-gray-200">
                <!-- graduation-cap icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 1 7l11 5 8-3.636V17h2V7L12 2Z"/><path d="M6 10.273V15c0 2.761 2.91 5 6 5s6-2.239 6-5v-4.364l-6 2.727-6-2.09Z"/>
                </svg>
              </span>
              <h2 class="text-2xl font-semibold tracking-wide text-gray-800">EDUCATION</h2>
            </header>
  
            <ol class="relative border-s-2 border-gray-200">
              <li v-for="(it, i) in edu" :key="i" class="group relative mb-8 ps-5">
                <!-- node -->
                <span class="absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-600 shadow ring-1 ring-emerald-300"></span>
                <!-- glow on hover -->
                <span
                  class="pointer-events-none absolute -left-[18px] top-0 hidden h-8 w-8 rounded-full bg-emerald-400/40 group-hover:block animate-ping">
                </span>
  
                <h3 class="text-lg font-semibold text-gray-800">
                  <span class="text-gray-700">{{ it.school }}</span>
                </h3>
                <p class="text-sm text-gray-500">{{ it.range }}</p>
                <p class="mt-1 text-gray-600">{{ it.dept }}</p>
              </li>
            </ol>
          </div>
  
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue"
  
  const works = ref([])
  const edu = ref([])
  
  onMounted(async () => {
    const res = await fetch("/api/experience.json")
    const data = await res.json()
    works.value = data.work
    edu.value = data.education
  })
  </script>
  
  
  <style scoped>
  /* 讓左側縱線更柔和一點 */
  ol::before {
    /* 已用 Tailwind 的 border-s-2 生成線條，這裡不用再畫 */
  }
  /* 微調文字排版可在此加強（選配） */
  </style>
  