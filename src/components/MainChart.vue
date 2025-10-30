<template>
  <div class="w-full flex justify-center">
    <div ref="chartRef" class="w-[320px] h-[320px]"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";
import c3 from "c3";
import "c3/c3.css";

const chartRef = ref(null);

onMounted(() => {
  // ✅ 讀取 CSS 變數（它會自動對應你的設計系統）
  const styles = getComputedStyle(document.documentElement);
  const colors = [
    styles.getPropertyValue("--menu-1").trim(),
    styles.getPropertyValue("--menu-2").trim(),
    styles.getPropertyValue("--menu-3").trim(),
    styles.getPropertyValue("--menu-4").trim(),
  ];
  c3.generate({
    bindto: chartRef.value,
    data: {
      columns: [
        ["前端開發", 80],
        ["UI / UX 設計", 95],
        ["行銷企劃", 90],
        ["視覺設計", 95],
      ],
      type: "pie",
    },
    color: {
      pattern: colors, // ✅ 自動套你的 CSS 變數色
    },
    pie: {
      label: {
        format: (value, ratio, id) => `${value}%`,
      },
    },
    tooltip: {
      format: {
        value: (value) => `${value}%`,
      },
    },
    transition: {
      duration: 800,
    },
  });
});
</script>

<style scoped>
/* 讓圓餅圖控制起來更柔和精緻 */
.c3-chart-arcs-title {
  font-size: 1.2rem !important;
  font-weight: 600;
  fill: #333;
}
</style>
