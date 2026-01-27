<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
    <!-- Loading Skeleton -->
    <div
      v-if="loading"
      v-for="n in 4"
      :key="`skeleton-${n}`"
      class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-4 relative"
    >
      <div class="flex flex-col gap-2">
        <div class="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
        <div class="flex items-baseline gap-1.5 mb-1">
          <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
        </div>
        <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      <div class="h-8 mt-2 bg-gray-100 rounded animate-pulse"></div>
    </div>
    
    <!-- Actual Content -->
    <div
      v-else
      v-for="kpi in kpis"
      :key="kpi.id"
      class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-4 relative"
    >
      <div class="flex flex-col gap-2">
        <h4 class="text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
          {{ kpi.title }}
        </h4>

        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-2">
            <h2 class="text-xl font-semibold text-foreground leading-none">
              {{ kpi.value }}
            </h2>
            <Badge
              :variant="kpi.changeType === 'increase' ? 'success' : 'error'"
              size="sm"
              class="inline-flex items-center gap-1"
            >
              <ArrowUp v-if="kpi.changeType === 'increase'" :size="12" />
              <ArrowDown v-else :size="12" />
              <span>{{ kpi.changeType === 'increase' ? '+' : '-' }}{{ Math.abs(kpi.change) }}%</span>
            </Badge>
          </div>
          <p class="text-sm text-muted-foreground">vs last month</p>
        </div>
      </div>
      <!-- Mini Line Chart -->
      <div class="absolute top-1/2 -translate-y-1/2 right-3">
        <svg
          width="60"
          height="24"
          viewBox="0 0 60 24"
          preserveAspectRatio="none"
          class="overflow-visible"
        >
          <defs>
            <linearGradient :id="`gradient-${kpi.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" :stop-color="getLineColor(kpi)" stop-opacity="0.4" />
              <stop offset="100%" :stop-color="getLineColor(kpi)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <polygon
            :points="getTrendGraphAreaPath(kpi.trend)"
            :fill="`url(#gradient-${kpi.id})`"
          />
          <polyline
            :points="getTrendGraphPath(kpi.trend)"
            fill="none"
            :stroke="getLineColor(kpi)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUp, ArrowDown } from 'lucide-vue-next'
import { Badge } from '@motork/component-library/future/primitives'

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

const getTrendGraphPath = (data) => {
  const width = 60
  const height = 24
  const padding = 3
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * (width - padding * 2)
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return points
}

const getTrendGraphAreaPath = (data) => {
  const width = 60
  const height = 24
  const padding = 3
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (width - padding * 2)
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  if (points.length === 0) return ''
  const firstX = points[0]?.split(',')[0] || '0'
  const lastX = points[points.length - 1]?.split(',')[0] || '0'
  const bottomY = height - padding

  return `${points.join(' ')}, ${lastX},${bottomY}, ${firstX},${bottomY}`
}

const getLineColor = (kpi) => {
  if (kpi.changeType === 'increase' && kpi.id === 1) return 'var(--color-success)'
  if (kpi.changeType === 'increase' && kpi.id === 2) return 'var(--brand-blue)'
  if (kpi.changeType === 'decrease') return 'var(--brand-red)'
  if (kpi.changeType === 'increase' && kpi.id === 4) return '#f97316' // orange-500 (no theme token available)
  return 'var(--brand-slate)'
}
</script>

