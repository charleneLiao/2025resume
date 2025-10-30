<!-- MasonryGallery.vue -->
<template>
  <section>
    <!-- Tabs -->
    <div class="mb-6 flex gap-3 text-sm font-medium">
      <button
        v-for="c in categories"
        :key="c"
        @click="activeCategory = c"
        class="px-4 py-1 rounded-full border transition"
        :style="{
          backgroundColor:
            activeCategory === c ? categoryColors[c] : 'transparent',
          borderColor: activeCategory === c ? categoryColors[c] : '#d1d5db',
          color: activeCategory === c ? '#fff' : '#6b7280',
        }"
      >
        {{ c === "all" ? "全部" : c }}
      </button>
    </div>

    <!-- Masonry 容器 -->
    <div ref="gridRef" class="grid">
      <div class="grid-sizer"></div>
      <div class="gutter-sizer"></div>

      <article
        v-for="(card, idx) in filteredItems"
        :key="card.id"
        class="grid-item ..."
      >
      <h3 class="text-gray-400 mb-2">
            <a :href="card.link" target="_blank" class="hover:underline">{{
              card.title
            }}</a>
          </h3>
        <button
          class="block w-full text-left"
          @click.prevent="openLightbox(idx)"
        >
          <img
            :src="card.image"
            class="w-full h-auto"
            loading="lazy"
            :alt="card.title"
          />
        </button>
        <div class="p-3">
          <p class="mt-1 text-sm text-gray-500">{{ card.subtitle }}</p>
        </div>
      </article>
    </div>
    <!-- 🔦 Lightbox Overlay -->
    <div
      v-if="isLightboxOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
      @click.self="closeLightbox"
    >
      <!-- 左右切換 -->
      <button
        @click.stop="prev"
        class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 p-3 text-white"
        aria-label="上一張"
      >
        ‹
      </button>

      <figure class="max-w-[92vw] max-h-[85vh] text-center">
        <img
          :src="currentItem?.imageLarge || currentItem?.image"
          :alt="currentItem?.title"
          class="mx-auto max-h-[85vh] rounded-xl shadow-2xl"
        />
        <figcaption class="mt-3 text-white/90 text-sm">
          {{ currentItem?.title }}（{{ lightboxIndex + 1 }} /
          {{ filteredItems.length }}）
        </figcaption>
      </figure>

      <button
        @click.stop="next"
        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 p-3 text-white"
        aria-label="下一張"
      >
        ›
      </button>

      <!-- 關閉 -->
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/30 p-2 text-white"
        aria-label="關閉"
      >
        ✕
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import imagesLoaded from "imagesloaded";
import Masonry from "masonry-layout";

const activeCategory = ref("all");

const gridRef = ref(null);
let msnry = null;

const loading = ref(true);
const items = ref([]);

// ✅ 讀 public/data/works.json（或用環境變數覆蓋）
const API_URL = import.meta.env.VITE_WORKS_API || "/api/works.json";

const categories = computed(() => {
  const set = new Set(["all"]);
  items.value.forEach((i) => i?.category && set.add(i.category));
  return Array.from(set);
});

const filteredItems = computed(() => {
  if (activeCategory.value === "all") return items.value;
  return items.value.filter((i) => i.category === activeCategory.value);
});

// 切換分類或資料變動 → 重新排版
watch([activeCategory, items], async () => {
  await nextTick();
  imagesLoaded(gridRef.value, () => {
    if (msnry) {
      msnry.reloadItems();
      msnry.layout();
    }
  });
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    items.value = Array.isArray(data) ? data : data.items || [];
  } finally {
    loading.value = false;
    await nextTick();
    imagesLoaded(gridRef.value, () => {
      if (!msnry) initMasonry();
      else {
        msnry.reloadItems();
        msnry.layout();
      }
    });
  }
}

function initMasonry() {
  msnry = new Masonry(gridRef.value, {
    itemSelector: ".grid-item",
    columnWidth: ".grid-sizer",
    gutter: ".gutter-sizer",
    percentPosition: true,
    transitionDuration: "0.2s",
  });
}

function destroyMasonry() {
  if (msnry) {
    msnry.destroy();
    msnry = null;
  }
}

function refresh() {
  destroyMasonry();
  fetchData();
}
// 狀態
const isLightboxOpen = ref(false);
const lightboxIndex = ref(0);
const currentItem = computed(() => filteredItems.value[lightboxIndex.value]);

function openLightbox(idx) {
  lightboxIndex.value = idx;
  isLightboxOpen.value = true;
}
function closeLightbox() {
  isLightboxOpen.value = false;
}
function next() {
  lightboxIndex.value = (lightboxIndex.value + 1) % filteredItems.value.length;
}
function prev() {
  lightboxIndex.value =
    (lightboxIndex.value - 1 + filteredItems.value.length) %
    filteredItems.value.length;
}

// 鍵盤快捷鍵（← → ESC）
function onKey(e) {
  if (!isLightboxOpen.value) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
}
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));

// 開燈箱時禁用背景滾動
watch(isLightboxOpen, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});

const colorPool = [
  "var(--menu-1)",
  "var(--menu-2)",
  "var(--menu-3)",
  "var(--menu-4)",
];

const categoryColors = computed(() => {
  const map = {};
  categories.value.forEach((c, i) => {
    map[c] = colorPool[i % colorPool.length]; // 迴圈配色
  });
  return map;
});

onMounted(fetchData);
onUnmounted(destroyMasonry);
</script>

<style scoped>
/* —— Masonry 版面設定 ——
     以 grid-sizer 決定欄寬；gutter-sizer 控制間距。你也可改成固定 px。 */
.grid {
  /* 讓容器寬度自動縮放 */
}

.grid-sizer {
  width: 32%;
  /* 3 欄 */
}

.gutter-sizer {
  width: 16px;
  /* 欄間距 */
}

.grid-item {
  width: 32%;
  margin-bottom: 16px;
  /* 與下一行間距 */
}

/* RWD：md 以上 3 欄、sm 以上 2 欄、手機 1 欄 */
@media (max-width: 1024px) {
  .grid-sizer,
  .grid-item {
    width: 31%;
  }
}

@media (max-width: 768px) {
  .grid-sizer,
  .grid-item {
    width: 48%;
  }
}

@media (max-width: 480px) {
  .grid-sizer,
  .grid-item {
    width: 100%;
  }
}
</style>
