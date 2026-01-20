<template>
  <div class="rounded-card flex flex-col h-full" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-thumbtack text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Request</h2>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-fluid-xs text-sub font-medium">Owner:</span>
        <button 
          @click="$emit('reassign')"
          class="text-fluid-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          {{ task.assignee }}
        </button>
      </div>
    </div>

    <!-- Card Content -->
    <div class="bg-white rounded-lg p-4 shadow-sm flex flex-col flex-1" style="box-shadow: var(--nsc-card-shadow);">

      <!-- Badges Row -->
      <div class="flex items-center gap-2 flex-wrap mb-3">
        <span 
          class="px-2 py-1 rounded text-xs font-medium border"
          :class="entityType === 'lead' 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-purple-50 text-purple-700 border-purple-200'"
        >
          {{ entityType === 'lead' ? 'Lead' : 'Opportunity' }}
        </span>
        <span 
          class="px-2 py-1 rounded text-xs font-medium border"
          :class="stageColorClass"
        >
          {{ task.displayStage || task.stage }}
        </span>
        <Badge
          v-if="task.deliverySubstatus"
          :text="task.deliverySubstatus"
          size="small"
          :theme="substatusTheme"
        />
        <Badge
          v-if="negotiationBadge"
          :text="negotiationBadge.label"
          size="small"
          :theme="negotiationBadge.theme"
        />
      </div>

      <!-- Vehicle Info (if available) -->
      <div v-if="hasCar" class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-16 h-12 bg-surfaceTertiary rounded-lg overflow-hidden shrink-0">
            <img v-if="carImage" :src="carImage" alt="Car" class="w-full h-full object-cover">
            <i v-else class="fa-solid fa-car text-2xl text-sub w-full h-full flex items-center justify-center"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-heading text-fluid-sm mb-1">{{ carBrand }} {{ carModel }} ({{ carYear }})</div>
            <div class="flex items-center gap-2 flex-wrap">
              <div 
                v-if="stockDays !== undefined && stockDays !== null"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded"
              >
                <div class="w-1 h-1 bg-green-500 rounded-full"></div> In stock ({{ stockDays }} days)
              </div>
              <div 
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded"
              >
                <div class="w-1 h-1 bg-orange-500 rounded-full"></div> Out of stock
              </div>
            </div>
          </div>
          <div v-if="carPrice" class="text-right">
            <div class="text-fluid-xs text-sub font-medium">Price</div>
            <div class="font-bold text-heading text-fluid-sm">€ {{ formatCurrency(carPrice) }}</div>
          </div>
        </div>
      </div>

      <!-- Request Details (condensed) -->
      <div class="mt-3 pt-3 space-y-2">
        <div v-if="task.source" class="flex items-center justify-between text-fluid-xs">
          <span class="text-sub">Source</span>
          <span class="text-heading font-medium">{{ task.source }}</span>
        </div>
        <div v-if="task.requestType || task.requestedCar?.requestType" class="flex items-center justify-between text-fluid-xs">
          <span class="text-sub">Request Type</span>
          <span class="text-heading font-medium">{{ task.requestType || task.requestedCar?.requestType }}</span>
        </div>
        <div v-if="requestMessage" class="pt-2">
          <div class="text-fluid-xs text-sub mb-1">Message</div>
          <div class="bg-surfaceSecondary rounded-lg p-2">
            <p class="text-fluid-xs text-body leading-relaxed line-clamp-3">{{ requestMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Badge } from '@motork/component-library'
import { getStageColor } from '@/utils/stageMapper'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  entityType: {
    type: String,
    default: 'opportunity' // 'lead' or 'opportunity'
  },
  activities: {
    type: Array,
    default: () => []
  }
})

defineEmits(['reassign'])

// Computed properties for car data
const hasCar = computed(() => {
  return props.task.requestedCar && props.task.requestedCar.brand && props.task.requestedCar.model
})

const carBrand = computed(() => props.task.requestedCar?.brand || '')
const carModel = computed(() => props.task.requestedCar?.model || '')
const carYear = computed(() => props.task.requestedCar?.year || '')
const carImage = computed(() => props.task.requestedCar?.image || '')
const carPrice = computed(() => props.task.requestedCar?.price || null)
const stockDays = computed(() => props.task.requestedCar?.stockDays !== undefined ? props.task.requestedCar.stockDays : null)
const requestMessage = computed(() => props.task.requestedCar?.requestMessage || '')

// Stage color class
const stageColorClass = computed(() => {
  return getStageColor(props.task.displayStage || props.task.stage, props.entityType)
})

// Delivery substatus theme
const substatusTheme = computed(() => {
  if (!props.task.deliverySubstatus) return 'gray'
  if (props.task.deliverySubstatus === 'Delivered') return 'green'
  if (props.task.deliverySubstatus === 'Awaiting Delivery') return 'blue'
  return 'gray'
})

// Helper function to get latest offer from activities
function getLatestOffer(activities) {
  if (!activities || activities.length === 0) return null
  
  const offers = activities
    .filter(a => a.type === 'offer')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  return offers[0] || null
}

// Helper function to calculate days since a date
function calculateDaysSince(dateString) {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Compute negotiation badge for "In Negotiation" stage
const negotiationBadge = computed(() => {
  if ((props.task.displayStage || props.task.stage) !== 'In Negotiation') return null
  
  const latestOffer = getLatestOffer(props.activities)
  if (!latestOffer) return null
  
  const daysSinceOffer = calculateDaysSince(latestOffer.timestamp)
  
  if (daysSinceOffer < 1) {
    return {
      label: 'New Offer',
      theme: 'orange'
    }
  } else if (daysSinceOffer < 3) {
    return {
      label: 'Active',
      theme: 'yellow'
    }
  }
  
  return null
})

// Formatting function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>
