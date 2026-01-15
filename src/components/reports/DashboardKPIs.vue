<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
    <!-- Loading Skeleton -->
    <div
      v-if="loading"
      v-for="n in 4"
      :key="`skeleton-${n}`"
      class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <div class="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
          <div class="flex items-baseline gap-1.5 mb-1">
            <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
          </div>
          <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      <div class="h-8 mt-2 bg-gray-100 rounded animate-pulse"></div>
    </div>
    
    <!-- Actual Content -->
    <div
      v-else
      v-for="kpi in kpis"
      :key="kpi.id"
      class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4 hover:shadow-md transition-shadow group"
    >
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <h3 class="label-upper mb-0.5">{{ kpi.title }}</h3>
          <div class="flex items-baseline gap-1.5">
            <span class="text-base font-bold leading-tight">{{ kpi.value }}</span>
            <span
              class="text-xs font-bold flex items-center gap-0.5"
              :class="kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
            >
              <i :class="kpi.changeType === 'increase' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'" class="text-xs"></i>
              {{ Math.abs(kpi.change) }}%
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">vs Last month</p>
        </div>
      </div>
      <!-- Mini Line Chart with Smooth Curves and Gradient Fill -->
      <div class="h-8 mt-2 relative">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
          <defs>
            <linearGradient :id="`gradient-${kpi.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" :style="`stop-color:${getLineColor(kpi)};stop-opacity:0.2`" />
              <stop offset="100%" :style="`stop-color:${getLineColor(kpi)};stop-opacity:0`" />
            </linearGradient>
            <filter :id="`glow-${kpi.id}`" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <!-- Area Fill -->
          <path
            :d="generateAreaPath(kpi.trend)"
            :fill="`url(#gradient-${kpi.id})`"
            class="transition-all duration-700"
          />
          
          <!-- Smooth Line -->
          <path
            :d="generateSmoothPath(kpi.trend)"
            :stroke="getLineColor(kpi)"
            stroke-width="2.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            :filter="`url(#glow-${kpi.id})`"
            class="transition-all duration-700"
          />
          
          <!-- End point dot -->
          <circle
            :cx="getEndPoint(kpi.trend).x"
            :cy="getEndPoint(kpi.trend).y"
            r="2"
            :fill="getLineColor(kpi)"
            class="group-hover:scale-150 transition-transform duration-300"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kpis: {
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
  const padding = 4
  
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
  const padding = 4
  
  const firstPointX = padding
  const lastPointX = width - padding
  
  return `${smoothLine} L ${lastPointX},${height} L ${firstPointX},${height} Z`
}

const getEndPoint = (data) => {
  if (!data || data.length === 0) return { x: 0, y: 0 }
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  const padding = 4
  return {
    x: 100 - padding,
    y: 40 - padding - ((data[data.length - 1] - minValue) / range) * (40 - padding * 2)
  }
}

const getLineColor = (kpi) => {
  if (kpi.changeType === 'increase' && kpi.id === 1) return 'var(--color-success)'
  if (kpi.changeType === 'increase' && kpi.id === 2) return 'var(--brand-blue)'
  if (kpi.changeType === 'decrease') return 'var(--brand-red)'
  if (kpi.changeType === 'increase' && kpi.id === 4) return '#f97316' // orange-500 (no theme token available)
  return 'var(--brand-slate)'
}
</script>

