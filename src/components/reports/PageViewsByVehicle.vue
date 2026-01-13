<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
    <!-- Loading Skeleton -->
    <template v-if="loading">
      <div class="flex items-center justify-between mb-4">
        <div class="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="n in 5"
          :key="`skeleton-${n}`"
          class="bg-gray-50 rounded-lg border border-gray-200 p-3"
        >
          <div class="mb-2">
            <div class="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div class="flex items-baseline gap-1.5">
              <div class="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div class="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
            </div>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div class="h-8 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    </template>
    
    <!-- Actual Content -->
    <template v-else>
      <div class="flex items-center justify-between mb-4">
        <h2 class="heading-main">Page Views by Vehicle</h2>
        <select class="input !py-1.5 !px-3 text-sm w-auto">
          <option>This month</option>
          <option>Last month</option>
        </select>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="bg-gray-50 rounded-lg border border-gray-200 p-3"
      >
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-gray-900 truncate mb-0.5">{{ vehicle.brand }} {{ vehicle.model }}</h3>
          <div class="flex items-baseline gap-1.5">
            <span class="text-sm font-bold text-gray-900 leading-tight">{{ vehicle.views }}</span>
            <span class="text-xs text-gray-500">views</span>
          </div>
        </div>
        
        <div class="flex items-center gap-2 mb-2">
          <span
            class="text-xs font-bold flex items-center gap-0.5"
            :class="vehicle.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
          >
            <i :class="vehicle.changeType === 'increase' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'" class="text-xs"></i>
            {{ Math.abs(vehicle.change) }}%
          </span>
          <span class="text-xs text-gray-500">{{ vehicle.avgPerDay }} avg/day</span>
        </div>
        
        <!-- Mini Line Chart with Smooth Curves and Gradient -->
        <div class="h-8 relative">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient :id="`gradient-v-${vehicle.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" :style="`stop-color:${vehicle.changeType === 'increase' ? '#10b981' : '#ef4444'};stop-opacity:0.2`" />
                <stop offset="100%" :style="`stop-color:${vehicle.changeType === 'increase' ? '#10b981' : '#ef4444'};stop-opacity:0`" />
              </linearGradient>
            </defs>
            
            <!-- Area Fill -->
            <path
              :d="generateAreaPath(vehicle.trend)"
              :fill="`url(#gradient-v-${vehicle.id})`"
              class="transition-all duration-700"
            />
            
            <!-- Smooth Line -->
            <path
              :d="generateSmoothPath(vehicle.trend)"
              :stroke="vehicle.changeType === 'increase' ? '#10b981' : '#ef4444'"
              stroke-width="2.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-all duration-700"
            />
          </svg>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  vehicles: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const generateSmoothPath = (data) => {
  if (!data || data.length === 0) return ''
  
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  const width = 100
  const height = 40
  const padding = 2
  
  const points = data.map((value, index) => {
    return {
      x: (index / (data.length - 1)) * (width - padding * 2) + padding,
      y: height - padding - ((value - minValue) / range) * (height - padding * 2)
    }
  })
  
  if (points.length < 2) return ''
  
  let path = `M ${points[0].x},${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const cp1x = curr.x + (next.x - curr.x) / 2
    const cp2x = curr.x + (next.x - curr.x) / 2
    path += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`
  }
  
  return path
}

const generateAreaPath = (data) => {
  const smoothLine = generateSmoothPath(data)
  if (!smoothLine) return ''
  
  const width = 100
  const height = 40
  const padding = 2
  
  const firstPointX = padding
  const lastPointX = width - padding
  
  return `${smoothLine} L ${lastPointX},${height} L ${firstPointX},${height} Z`
}
</script>

