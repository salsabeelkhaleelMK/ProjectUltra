<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg md:text-xl font-bold text-gray-900">Page Views: Organic vs. Paid</h2>
      <select class="input text-sm w-auto">
        <option>This month</option>
        <option>Last month</option>
        <option>This quarter</option>
      </select>
    </div>
    
    <div class="space-y-4">
      <!-- Chart -->
      <div class="flex items-end gap-2 h-48">
        <div
          v-for="(day, index) in data"
          :key="index"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <div class="w-full flex flex-col justify-end h-full gap-0.5">
            <!-- Organic (bottom) -->
            <div
              class="bg-blue-600 rounded-t"
              :style="{ height: `${(day.organic / maxValue) * 100}%` }"
              :title="`Organic: ${day.organic}`"
            ></div>
            <!-- Paid (top) -->
            <div
              class="bg-orange-500 rounded-t"
              :style="{ height: `${(day.paid / maxValue) * 100}%` }"
              :title="`Paid: ${day.paid}`"
            ></div>
          </div>
          <span class="text-meta mt-2">{{ day.day }}</span>
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

