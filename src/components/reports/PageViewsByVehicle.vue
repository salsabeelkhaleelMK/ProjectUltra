<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg md:text-xl font-bold text-gray-900">Page Views by Vehicle</h2>
      <select class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500">
        <option>This month</option>
        <option>Last month</option>
        <option>This quarter</option>
      </select>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="bg-gray-50 rounded-lg border border-gray-200 p-4"
      >
        <div class="mb-3">
          <h3 class="text-sm font-bold text-gray-900 mb-1">{{ vehicle.brand }} {{ vehicle.model }}</h3>
          <div class="flex items-baseline gap-2">
            <span class="text-sm font-bold text-gray-900">{{ vehicle.views }}</span>
            <span class="text-xs text-gray-500">views</span>
          </div>
        </div>
        
        <div class="flex items-center gap-2 mb-3">
          <span
            class="text-xs font-semibold flex items-center gap-1"
            :class="vehicle.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
          >
            <i :class="vehicle.changeType === 'increase' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
            {{ Math.abs(vehicle.change) }}%
          </span>
          <span class="text-xs text-gray-500">{{ vehicle.avgPerDay }} avg/day</span>
        </div>
        
        <!-- Mini Line Chart -->
        <div class="h-12 flex items-end gap-0.5">
          <div
            v-for="(point, index) in vehicle.trend"
            :key="index"
            class="flex-1 bg-blue-100 rounded-t"
            :style="{ height: `${(point / Math.max(...vehicle.trend)) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  vehicles: {
    type: Array,
    required: true
  }
})
</script>

