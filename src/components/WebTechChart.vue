<template>
  <div ref="chart" class="w-full max-w-md"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import c3 from "c3";
import "c3/c3.css";

const chart = ref(null);

onMounted(() => {
  c3.generate({
    bindto: chart.value,
    data: {
      columns: [
        ["Vue 3 + Composition API", 40],
        ["Tailwind CSS", 24],
        ["AOS 動畫 / 微互動節奏", 15],
        ["JSON API / 結構思考", 10],
        ["GitHub Pages 部署", 6],
        ["Netlify 自動化部署", 5],
      ],
      type: "donut", // ✅ 改這裡
    },
    donut: {
      title: "技術構成比例", // ✅ 可改字
      width: 50, // ✅ 甜甜圈厚度
        format: (value) => `${value}%`,
      },
    color: {
      pattern: [
    "var(--menu-1)", // 莓紫
    "var(--menu-2)", // 青藍
    "var(--menu-3)", // 抹茶綠
    "var(--menu-4)", // 琥珀橘
    "var(--gray-500, #6b7280)", // 備用灰（若未定義時不會爆）
  ],
    },
    size: {
      height: 260, // ✅ 圓大小可調
    },
  });
});
</script>
