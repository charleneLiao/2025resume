<template>
 <aside class="w-60 h-screen sticky top-0 bg-white border-r flex flex-col items-center py-8 overflow-y-auto shrink-0 scroll-area">
    <!-- 頭像 -->
    <img
      v-if="profile"
      class="w-28 h-28 rounded-full object-cover mb-4"
      :src="profile.avatar"
      alt="avatar"
    />
    <!-- 名字 -->
    <div class="w-full text-center flex flex-col items-center mb-2">
      <!-- 行內：GitHub + 名稱 + 職稱 -->
      <div class="flex items-center gap-4">
        <!-- 名字 + 職稱 -->
        <div class="flex flex-col">
          <h2 v-if="profile" class="text-lg font-semibold">
            {{ profile.name }}
          </h2>
          <h5 v-if="profile" class="text-sm text-gray-600">
            {{ profile.jobTitle }}
          </h5>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <div class="flex gap-3 mt-0">
          <!-- GitHub -->
          <a
            v-if="profile?.github"
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            style="--btn-color: var(--icon-git)"
          >
            <font-awesome-icon :icon="['fab', 'github']" class="text-xl" />
          </a>

          <!-- Email -->
          <a
            v-if="profile?.email"
            :href="`mailto:${profile.email}`"
            class="icon-btn"
            style="--btn-color: var(--icon-mail)"
          >
            <font-awesome-icon :icon="['fas', 'envelope']" class="text-xl" />
          </a>

          <!-- CodePen -->
          <a
            v-if="profile?.codepen"
            :href="profile.codepen"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            style="--btn-color: var(--icon-codepen)"
          >
            <font-awesome-icon :icon="['fab', 'codepen']" class="text-xl" />
          </a>
        </div>
      </div>
    </div>

    <!-- 選單（API） -->
    <nav
      class="menu grid grid-cols-2 gap-px w-full mt-6 bg-gray-100"
    >
      <a
        v-for="(item, index) in menu"
        :key="item.id"
        :href="item.href"
        class="flex flex-col items-center justify-center text-center py-4 bg-white transition-all duration-300 ease-out hover:-translate-y-[2px]"
        :style="{ '--c': `var(--menu-${(index % 4) + 1})` }"
      >
        <!-- Icon → 吃 var(--c) -->
        <font-awesome-icon
          :icon="['fas', item.icon]"
          class="text-2xl mb-2 transition-all duration-300 text-[var(--c)]"
        />

        <!-- 文字 → 始終是黑色 -->
        <span
          class="text-sm font-medium transition-all duration-300 text-gray-800"
        >
          {{ item.label }}
        </span>
      </a>
    </nav>
  </aside>
</template>
<style scoped></style>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  profile: Object, // { name, avatar, jobTitle, github }
  menu: Array,
});

const entered = ref(false);
onMounted(() => {
  // 等一幀再顯示，達成「由下淡入」的動畫
  requestAnimationFrame(() => {
    entered.value = true;
  });
});
</script>
