<template>
  <div class="w-full mb-6">
    <div class="bg-surface border border rounded-xl shadow-sm overflow-hidden">
      <!-- Header section with Title and Stage, Owner integrated -->
      <div class="px-4 md:px-6 py-3 border-b border">
        <div class="flex flex-row items-center justify-between gap-2 md:gap-4">
          <!-- Left: Request title with chips (when request data exists) -->
          <div v-if="showRequestSection" class="flex items-center gap-2 shrink-0 flex-wrap">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-thumbtack text-sub text-xs"></i>
              <h3 class="font-bold text-heading text-sm">Request</h3>
            </div>
            <div class="flex items-center gap-1.5">
              <span 
                class="px-2 py-0.5 rounded text-xs font-medium border"
                :class="entityType === 'lead' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-purple-50 text-purple-700 border-purple-200'"
              >
                {{ entityType === 'lead' ? 'Lead' : 'Opportunity' }}
              </span>
              <span 
                class="px-2 py-0.5 rounded text-xs font-medium border"
                :class="stageColorClass"
              >
                {{ stage }}
              </span>
              <Badge
                v-if="deliverySubstatus"
                :text="deliverySubstatus"
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
          </div>
          <div v-else></div>

          <!-- Right: Owner -->
          <div class="flex items-center gap-2">
            <span class="hidden md:inline text-xs text-sub font-medium">Owner</span>
            <button 
              @click="$emit('reassign')"
              class="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              {{ owner }}
            </button>
          </div>
        </div>
      </div>

      <!-- Request Details Section (shown when request data exists) -->
      <div v-if="showRequestSection" class="p-4 md:p-6">
        <!-- Car details (if car exists) -->
        <div v-if="hasCar" class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-20 h-14 bg-surfaceTertiary rounded-lg overflow-hidden shrink-0 border border">
                <img v-if="carImage" :src="carImage" alt="Car" class="w-full h-full object-cover">
                <i v-else class="fa-solid fa-car text-3xl text-sub w-full h-full flex items-center justify-center"></i>
              </div>
              <div>
                <div class="font-bold text-heading text-base md:text-lg mb-2">{{ carBrand }} {{ carModel }} ({{ carYear }})</div>
                <div class="flex items-center gap-2 flex-wrap">
                  <div 
                    v-if="stockDays !== undefined && stockDays !== null"
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-md"
                  >
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div> In stock ({{ stockDays }} days)
                  </div>
                  <div 
                    v-else-if="hasCar"
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold rounded-md"
                  >
                    <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Out of stock
                  </div>
                  <!-- Source next to stock availability -->
                  <div v-if="source" class="inline-flex items-center gap-1.5 px-2 py-1 bg-surfaceSecondary border border text-body text-xs font-semibold rounded-md">
                    <span class="text-xs text-sub font-medium">Source:</span>
                    <span class="text-xs font-bold text-heading">{{ source }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="carPrice" class="text-right">
              <div class="text-xs text-sub font-medium mb-1">Price</div>
              <div class="font-bold text-heading text-lg">€ {{ formatCurrency(carPrice) }}</div>
            </div>
          </div>

          <!-- Request message (when car exists) -->
          <div v-if="requestMessage" class="pt-2">
            <div class="text-xs text-sub font-medium mb-2">Request Message</div>
            <div class="bg-surfaceSecondary border border rounded-lg p-3">
              <p class="text-sm text-body leading-relaxed">{{ requestMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Request-only display (no car but request data exists) -->
        <div v-else class="space-y-3">
          <div v-if="requestType" class="flex items-center gap-2">
            <span class="text-xs text-sub font-medium">Request Type:</span>
            <span class="text-sm font-semibold text-heading">{{ requestType }}</span>
          </div>
          <div v-if="requestMessage" class="bg-surfaceSecondary border border rounded-lg p-3">
            <div class="text-xs text-sub font-medium mb-2">Request Message</div>
            <p class="text-sm text-body leading-relaxed">{{ requestMessage }}</p>
          </div>
        </div>
      </div>
      
      <!-- Separator and toggle button (only show if there are expandable details) -->
      <div v-if="hasExpandableDetails" class="border-t border">
        <button
          @click="isExpanded = !isExpanded"
          class="w-full p-3 flex items-center justify-center gap-2 text-sm text-body hover:text-heading hover:bg-surfaceSecondary transition-colors"
        >
          <span class="font-medium">{{ isExpanded ? 'Hide' : 'View' }} Details</span>
          <i 
            class="fa-solid fa-chevron-down text-xs transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
          ></i>
        </button>
      </div>
      
      <!-- Expandable details -->
      <div v-if="isExpanded && hasExpandableDetails" class="border-t border p-6 bg-surfaceSecondary/30 text-sm animate-fade-in">
        <!-- REQUEST DETAILS -->
        <div class="mb-6">
          <h4 class="text-xs font-bold uppercase text-sub tracking-wider mb-4">REQUEST DETAILS</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
            <div v-if="requestType">
              <div class="text-xs text-sub mb-1">Request type</div>
              <div class="font-medium text-body">{{ requestType }}</div>
            </div>
            <div v-if="source">
              <div class="text-xs text-sub mb-1">Source</div>
              <div class="font-medium text-body">{{ source }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">Source details</div>
              <div class="font-medium" :class="sourceDetails ? 'text-body' : 'text-sub'">{{ sourceDetails || '--' }}</div>
            </div>
            <div v-if="dealership">
              <div class="text-xs text-sub mb-1">Dealership</div>
              <div class="font-medium text-body">{{ dealership }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">Channel</div>
              <div class="font-medium text-body">{{ channel || 'Email' }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">AdCampaign</div>
              <div class="font-medium" :class="adCampaign ? 'text-body' : 'text-sub'">{{ adCampaign || '--' }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">AdMedium</div>
              <div class="font-medium" :class="adMedium ? 'text-body' : 'text-sub'">{{ adMedium || '--' }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">AdSource</div>
              <div class="font-medium" :class="adSource ? 'text-body' : 'text-sub'">{{ adSource || '--' }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">Expected purchase date</div>
              <div class="font-medium" :class="expectedPurchaseDate ? 'text-body' : 'text-sub'">{{ expectedPurchaseDate || '--' }}</div>
            </div>
            <div>
              <div class="text-xs text-sub mb-1">Fiscal entity</div>
              <div class="font-medium" :class="fiscalEntity ? 'text-body' : 'text-sub'">{{ fiscalEntity || '--' }}</div>
            </div>
          </div>
        </div>
        
        <!-- VEHICLE DETAILS (only if car exists) -->
        <div v-if="hasCar">
          <div class="border-t border my-4"></div>
          <div>
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-xs font-bold uppercase text-sub tracking-wider">VEHICLE DETAILS</h4>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
              <div v-if="registration">
                <div class="text-xs text-sub mb-1">Registration</div>
                <div class="font-medium text-body">{{ registration }}</div>
              </div>
              <div v-if="kilometers !== undefined && kilometers !== null">
                <div class="text-xs text-sub mb-1">Kilometers</div>
                <div class="font-medium text-body">{{ formatNumber(kilometers) }} Km</div>
              </div>
              <div v-if="fuelType">
                <div class="text-xs text-sub mb-1">Fuel type</div>
                <div class="font-medium text-body">{{ fuelType }}</div>
              </div>
              <div v-if="gearType">
                <div class="text-xs text-sub mb-1">Gear type</div>
                <div class="font-medium text-body">{{ gearType }}</div>
              </div>
              <div v-if="vin">
                <div class="text-xs text-sub mb-1">VIN Number</div>
                <div class="font-mono text-xs bg-surface border border px-2 py-1 rounded inline-block text-body">
                  {{ vin }}
                </div>
              </div>
              <div v-if="dealership">
                <div class="text-xs text-sub mb-1">Dealership</div>
                <div class="font-medium text-body">{{ dealership }}</div>
              </div>
            </div>
            <div v-if="showTechnicalSpecs" class="mt-6 flex justify-end">
              <button class="bg-surface border border text-body hover:text-blue-600 hover:border-blue-200 font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 group">
                <i class="fa-solid fa-list-check text-sub group-hover:text-blue-500"></i> View technical specs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Badge } from '@motork/component-library'
import { getDeliverySubstatusColor, getStageColor } from '@/utils/stageMapper'

const props = defineProps({
  // Stage/Owner/Source props
  stage: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  deliverySubstatus: {
    type: String,
    default: null
  },
  activities: {
    type: Array,
    default: () => []
  },
  entityType: {
    type: String,
    default: 'opportunity' // 'lead' or 'opportunity'
  },
  // Request/Vehicle props
  requestType: {
    type: String,
    default: ''
  },
  requestMessage: {
    type: String,
    default: ''
  },
  requestedCar: {
    type: Object,
    default: null
  },
  task: {
    type: Object,
    default: null
  }
})

defineEmits(['reassign'])

const isExpanded = ref(false)

// Computed properties for Stage/Owner/Source functionality
const substatusColorClass = computed(() => {
  if (!props.deliverySubstatus) return ''
  return getDeliverySubstatusColor(props.deliverySubstatus)
})

const substatusTheme = computed(() => {
  if (!props.deliverySubstatus) return 'gray'
  if (props.deliverySubstatus === 'Delivered') return 'green'
  if (props.deliverySubstatus === 'Awaiting Delivery') return 'blue'
  return 'gray'
})

const stageColorClass = computed(() => {
  return getStageColor(props.stage, props.entityType)
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
  if (props.stage !== 'In Negotiation') return null
  
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

// Computed properties for request/vehicle data
const hasCar = computed(() => {
  return props.requestedCar && props.requestedCar.brand && props.requestedCar.model
})

const showRequestSection = computed(() => {
  return props.requestType || props.requestMessage || hasCar.value
})

const carBrand = computed(() => {
  return props.requestedCar?.brand || ''
})

const carModel = computed(() => {
  return props.requestedCar?.model || ''
})

const carYear = computed(() => {
  return props.requestedCar?.year || ''
})

const carImage = computed(() => {
  return props.requestedCar?.image || ''
})

const carPrice = computed(() => {
  return props.requestedCar?.price || null
})

const stockDays = computed(() => {
  return props.requestedCar?.stockDays !== undefined ? props.requestedCar.stockDays : null
})

const dealership = computed(() => {
  return props.requestedCar?.dealership || props.task?.dealership || ''
})

const registration = computed(() => {
  return props.requestedCar?.registration || ''
})

const kilometers = computed(() => {
  return props.requestedCar?.kilometers !== undefined ? props.requestedCar.kilometers : null
})

const fuelType = computed(() => {
  return props.requestedCar?.fuelType || ''
})

const gearType = computed(() => {
  return props.requestedCar?.gearType || ''
})

const vin = computed(() => {
  return props.requestedCar?.vin || ''
})

const channel = computed(() => {
  return 'Email' // Default, could be enhanced if task has channel field
})

const adCampaign = computed(() => {
  return props.task?.sourceDetails || props.requestedCar?.adCampaign || ''
})

const expectedPurchaseDate = computed(() => {
  return props.requestedCar?.expectedPurchaseDate || ''
})

const fiscalEntity = computed(() => {
  return props.task?.fiscalEntity || ''
})

const sourceDetails = computed(() => {
  return props.task?.sourceDetails || ''
})

const adMedium = computed(() => {
  return props.requestedCar?.adMedium || ''
})

const adSource = computed(() => {
  return props.requestedCar?.adSource || ''
})

const showOpenAd = computed(() => {
  return true
})

const showTechnicalSpecs = computed(() => {
  return true
})

const hasExpandableDetails = computed(() => {
  // Show expandable section if there are request details or vehicle details to show
  return hasCar.value || props.requestType || props.source || sourceDetails.value || 
         adCampaign.value || expectedPurchaseDate.value || fiscalEntity.value ||
         adMedium.value || adSource.value
})

// Formatting functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>
