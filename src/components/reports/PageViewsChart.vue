<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
    <div class="flex items-center justify-between mb-4">
      <h2 class="heading-main">Page Views: Organic vs. Paid</h2>
      <select class="input text-sm w-auto">
        <option>This month</option>
        <option>Last month</option>
        <option>This quarter</option>
      </select>
    </div>
    
    <div class="space-y-4">
      <!-- Chart -->
      <div class="flex items-end gap-1 h-64 overflow-x-auto pb-2">
        <div
          v-for="(day, index) in data"
          :key="index"
          class="flex flex-col items-center gap-1 min-w-[20px]"
        >
          <div class="w-full flex items-end justify-center h-full gap-0.5">
            <!-- Organic bar -->
            <div
              class="bg-blue-600 rounded-t w-2"
              :style="{ height: `${(day.organic / maxValue) * 100}%`, minHeight: '2px' }"
              :title="`Organic: ${day.organic}`"
            ></div>
            <!-- Paid bar -->
            <div
              class="bg-orange-500 rounded-t w-2"
              :style="{ height: `${(day.paid / maxValue) * 100}%`, minHeight: '2px' }"
              :title="`Paid: ${day.paid}`"
            ></div>
          </div>
          <span class="text-[9px] text-gray-500 mt-1">{{ index + 1 }}</span>
        </div>
      </div>
      
      <!-- Legend -->
      <div class="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-blue-600 rounded"></div>
          <span class="text-meta text-gray-600">Organic</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-orange-500 rounded"></div>
          <span class="text-meta text-gray-600">Paid</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const maxValue = computed(() => {
  return Math.max(...props.data.map(day => day.organic + day.paid))
})
</script>

