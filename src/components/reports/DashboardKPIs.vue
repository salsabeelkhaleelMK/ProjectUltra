<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
    <div
      v-for="kpi in kpis"
      :key="kpi.id"
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ kpi.title }}</h3>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl md:text-3xl font-bold text-gray-900">{{ kpi.value }}</span>
            <span
              class="text-xs font-semibold flex items-center gap-1"
              :class="kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
            >
              <i :class="kpi.changeType === 'increase' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
              {{ Math.abs(kpi.change) }}%
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">vs Last month</p>
        </div>
      </div>
      <!-- Mini Line Chart -->
      <div class="h-12 mt-4 flex items-end gap-0.5">
        <div
          v-for="(point, index) in kpi.trend"
          :key="index"
          class="flex-1 bg-blue-100 rounded-t"
          :style="{ height: `${(point / Math.max(...kpi.trend)) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  kpis: {
    type: Array,
    required: true
  }
})
</script>

