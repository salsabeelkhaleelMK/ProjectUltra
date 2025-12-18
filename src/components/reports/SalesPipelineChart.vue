<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="section-title mb-0">Sales Pipeline</h2>
      <select class="input text-sm w-auto">
        <option>This month</option>
        <option>Last month</option>
        <option>This quarter</option>
      </select>
    </div>

    <!-- Stage Stats -->
    <div class="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
      <div
        v-for="stage in pipeline.stages"
        :key="stage.name"
        class="flex items-center gap-2"
      >
        <span class="label-upper">{{ stage.name }}:</span>
        <span class="text-content-bold">{{ stage.percentage }}%</span>
        <span class="text-meta">({{ stage.count }})</span>
      </div>
    </div>

    <!-- Pipeline Visualization -->
    <div class="mb-6">
      <div class="relative h-64 md:h-80">
        <!-- Area Chart using SVG -->
        <svg class="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <!-- Background grid lines -->
          <defs>
            <linearGradient v-for="source in pipeline.leadSources" :key="`gradient-${source.name}`" :id="`gradient-${getGradientId(source.name)}`" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" :style="`stop-color:${getSourceColor(source.color)};stop-opacity:0.8`" />
              <stop offset="100%" :style="`stop-color:${getSourceColor(source.color)};stop-opacity:0.1`" />
            </linearGradient>
          </defs>
          
          <!-- Area paths for each source (stacked) -->
          <path
            v-for="(source, idx) in pipeline.leadSources"
            :key="source.name"
            :d="generateAreaPath(source.data, idx)"
            :fill="`url(#gradient-${getGradientId(source.name)})`"
            opacity="0.7"
          />
        </svg>
      </div>

      <!-- Lead Source Legend -->
      <div class="flex flex-wrap gap-4 mt-4">
        <div
          v-for="source in pipeline.leadSources"
          :key="source.name"
          class="flex items-center gap-2"
        >
          <div
            class="w-3 h-3 rounded-full"
            :class="{
              'bg-red-500': source.color === 'red',
              'bg-orange-500': source.color === 'orange',
              'bg-blue-500': source.color === 'blue',
              'bg-gray-500': source.color === 'gray'
            }"
          ></div>
          <span class="text-meta">{{ source.name }}</span>
        </div>
      </div>
    </div>

    <!-- Average Times -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-gray-200">
      <div
        v-for="stage in pipeline.stages"
        :key="stage.name"
        class="text-center"
      >
        <div class="label-upper mb-1">{{ stage.name }}</div>
        <div class="text-content-bold">{{ stage.avgTime }}</div>
        <div class="text-meta">on avg.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pipeline: {
    type: Object,
    required: true
  }
})

const getGradientId = (name) => {
  return name.toLowerCase().replace('.', '').replace(' ', '-')
}

const getSourceColor = (color) => {
  const colors = {
    red: '#ef4444',
    orange: '#f97316',
    blue: '#3b82f6',
    gray: '#6b7280'
  }
  return colors[color] || '#6b7280'
}

const generateAreaPath = (data, index) => {
  const width = 800
  const height = 300
  const maxValue = Math.max(...props.pipeline.leadSources[0].data)
  const points = data.length
  const stepX = width / (points - 1)
  
  // Calculate cumulative values for stacking
  let cumulativeBottom = Array(points).fill(height)
  
  // Calculate bottom positions by summing all previous sources
  for (let i = 0; i < index; i++) {
    const prevData = props.pipeline.leadSources[i].data
    for (let j = 0; j < points; j++) {
      cumulativeBottom[j] -= (prevData[j] / maxValue) * height
    }
  }
  
  // Calculate top positions (bottom - current value)
  const yTopPositions = data.map((value, i) => {
    return cumulativeBottom[i] - (value / maxValue) * height
  })
  
  // Create path points
  const topPoints = data.map((value, i) => {
    const x = i * stepX
    const y = yTopPositions[i]
    return `${x},${y}`
  })
  
  const bottomPoints = data.map((value, i) => {
    const x = i * stepX
    const y = cumulativeBottom[i]
    return `${x},${y}`
  })
  
  // Create area path (closed shape)
  const topPath = topPoints.join(' L ')
  const bottomPath = bottomPoints.reverse().join(' L ')
  
  return `M ${topPoints[0]} L ${topPath} L ${bottomPath} Z`
}
</script>

