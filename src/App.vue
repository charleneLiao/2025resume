<template>
  <div class="flex min-h-screen">
    <!-- 左側固定欄 -->
    <aside class="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto">
      <Sidebar :profile="profile" :menu="menu" />
    </aside>

    <!-- 右側內容：可滾 + Scroll Snap -->
    <main class="flex-1 snap-y snap-mandatory">
      <!--- 關於我 -->
      <section
        id="about"
        class="min-h-screen snap-start px-6 py-6 flex flex-col"
      >
        <h2
          data-aos="fade-up"
          class="mb-8 text-2xl font-semibold text-brand tracking-wide"
        >
          關於我
        </h2>

        <!-- 兩欄佈局：桌機左右、手機上下 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div class="flex justify-center">
            <MainChart />
          </div>
          <div
            class="border-l-4 border-brand pl-6 text-gray-700 leading-relaxed space-y-4"
          >
            <p v-for="(line, i) in profile?.intro.split('\n')" :key="i">
              {{ line }}
            </p>
          </div>
        </div>
      </section>

      <!--- 工作經歷 -->
      <section
        id="experience"
        class="min-h-screen snap-start px-6 py-6 flex flex-col"
      >
        <h2 class="text-2xl font-semibold text-brand tracking-wide">
          工作經歷
        </h2>
        <!-- 兩欄佈局：桌機左右、手機上下 -->
        <div class="grid grid-cols-1 gap-10 items-center">
          <ExperienceSection />
        </div>
      </section>

      <!-- 🎯 技術能力區塊（獨立，不在 sections loop 裡） -->
      <section id="skills" class="min-h-screen snap-start px-6 py-6">
        <h2 class="mb-8 text-2xl font-semibold text-brand tracking-wide">
          技術能力
        </h2>
        <SkillsChart />
      </section>
      <!-- 🧱 作品集 Masonry（瀑布流） -->
      <section id="portfolio" class="min-h-screen snap-start px-6 py-6">
        <h2 class="mb-8 text-2xl font-semibold text-brand tracking-wide">
          作品實績
        </h2>

        <!-- 直接使用元件 -->
        <MasonryGallery :projects="projects"/>
      </section>

      <!--- 本站說明 -->
      <section id="webDes" class="min-h-screen snap-start px-6 py-6">
        <h2
          class="mb-8 text-2xl font-semibold text-brand tracking-wide uppercase"
        >
          本站建置技術
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <!-- 左：文字敘述（WebDescription） -->
          <div class="leading-relaxed space-y-4 text-gray-700">
            <WebDescription />
          </div>

          <!-- 右：C3 圖表 -->
          <div class="flex justify-center">
            <WebTechChart />
            <!-- 我下一段直接給你可用的組件 -->
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Sidebar from "./components/Sidebar.vue";
import SkillsChart from "./components/SkillsChart.vue";
import MainChart from "./components/MainChart.vue";
import MasonryGallery from "./components/MasonryGallery.vue";
import ExperienceSection from "./components/ExperienceSection.vue";
import WebDescription from "./components/WebDescription.vue";
import WebTechChart from "./components/WebTechChart.vue";
import AOS from "aos";
import "aos/dist/aos.css";

const profile = ref(null);
const menu = ref([]);
const sections = ref([]);

onMounted(async () => {
  try {
    // 1) 平行抓資料
    const [p, m, s] = await Promise.all([
      fetch("/api/profile.json").then(r => r.json()),
      fetch("/api/menu.json").then(r => r.json()),
      fetch("/api/sections.json").then(r => r.json()),
    ]);

    profile.value = p;
    menu.value = m;
    sections.value = s.map(sec => ({ ...sec, visible: false }));

    // 2) 等畫面把 sections 渲染好再綁觀察器與 AOS
    await nextTick();

    // ✅ IntersectionObserver（進入視口 → 設為 visible）
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const sec = sections.value.find(x => x.id === id);
            if (sec) sec.visible = true;
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.value.forEach(sec => {
      const el = sec?.id ? document.getElementById(sec.id) : null;
      if (el) observer.observe(el);
    });

    // ✅ AOS（修正拼字 once:false）
    AOS.init({
      duration: 600,
      easing: "ease-out-sine",
      offset: 40,
      once: false,
    });
    AOS.refresh();
  } catch (err) {
    console.error("[App mounted] 初始化失敗：", err);
  }
});
</script>

