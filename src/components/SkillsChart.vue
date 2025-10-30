<template>
  <section id="about" class="w-full h-[40vh] sm:h-[50vh] md:h-[10vh]">
  <!-- 標題 ：置中 + 更有展示感 -->
  <h2 class="w-full border-gray-300 border border-gray-300 rounded-lg px-4 py-2
           text-lg font-semibold mb-10 text-center tracking-wide mx-auto text-gray-400 letter-spacing-1">
  前端工程
</h2>


  <!-- Chart 高度：桌機 60vh / 平板 50vh / 手機 40vh -->
  <div ref="chartRef"></div>
</section>

</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as d3 from "d3";
import c3 from "c3";
import "c3/c3.css";

const chartRef = ref(null);
let chart = null;
const animated = ref(false)

// 你的技能資料（想改就改這裡）
const skills = [
  ["Vue", 75],
  ["React", 70],
  ["JavaScript", 80],
  ["TypeScript", 70],
  ["Ajax", 70],
  ["HTML5", 100],
  ["CSS3", 100],
  ["Sass", 100],
  ["TailwindCSS", 90],
  ["Git", 80],
];

// 讀取全站 CSS 變數做一致配色
const css = getComputedStyle(document.documentElement);
const colors = [
  css.getPropertyValue("--menu-1").trim() || "#a21caf",
  css.getPropertyValue("--menu-2").trim() || "#2563eb",
  css.getPropertyValue("--menu-3").trim() || "#65a30d",
  css.getPropertyValue("--menu-4").trim() || "#d97706",
  "#6b7280",
];

// 轉成「單一資料列 + 類別軸」
const names = skills.map((s) => s[0]);
const values = skills.map((s) => s[1]);
const zeroValues = values.map(() => 0)
const startValues = values.map(v => Math.round(v * 0.2)) // ✅ 20% 起始值

onMounted(() => {
  const zeroValues = values.map(() => 0)
  const startValues = values.map(v => Math.round(v * 0.2)) // 20% baseline

  chart = c3.generate({
    bindto: chartRef.value,
    data: {
      columns: [['Score', ...zeroValues]], // 初次：0 → 100
      type: 'bar',
      labels: { format: v => `${v}%` },
      color: (color, d) => colors[d.index % colors.length],
    },
    axis: {
      x: { type: 'category', categories: names },
      y: { max: 100, tick: { values: [0, 25, 50, 75, 100] } },
    },
    bar: { width: { ratio: 0.5 } },
    tooltip: { show: false },
    legend: { show: false },
    transition: { duration: 1000 },
  })

  let firstPlayed = false

  const playFromZero = () => {
    chart.load({ columns: [['Score', ...zeroValues]] })
    setTimeout(() => {
      chart.load({ columns: [['Score', ...values]] })
    }, 200)
  }

  const playFromTwenty = () => {
    chart.load({ columns: [['Score', ...startValues]] })
    setTimeout(() => {
      chart.load({ columns: [['Score', ...values]] })
    }, 200)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (entry.isIntersecting) {
        // ✅ 第一次進來：0 → 100
        if (!firstPlayed) {
          firstPlayed = true
          playFromZero()
        }
        // ✅ 回來時：20% → 100%
        else {
          playFromTwenty()
        }
      } else {
        // 🔄 離開 Skills 時 → 重設回 20% baseline
        chart.load({ columns: [['Score', ...startValues]] })
      }
    },
    { threshold: 0.5 }
  )

  observer.observe(document.querySelector('#skills'))
})
onBeforeUnmount(() => {
  if (chart) chart.destroy();
});
</script>

<style scoped>
:deep(.c3) {
  font-family: inherit;
}
:deep(.c3-grid line) {
  stroke: #e5e7eb;
} /* gray-200 */
:deep(.c3-axis-y .tick text),
:deep(.c3-axis-x .tick text) {
  fill: #34373f;
  font-size: 12px;
}
/* 改 X / Y 主軸線 */
:deep(.c3-axis .domain) {
  stroke: #d1d5db !important; /* gray-300 */
}

/* 改 X / Y 刻度線 (tick) */
:deep(.c3-axis .tick line) {
  stroke: #d1d5db !important;
}
/* 改刻度文字顏色更柔和 */
:deep(.c3-axis .tick text) {
  fill: #34373f !important; /* gray-500 */
  font-size: 1em;
}
</style>
