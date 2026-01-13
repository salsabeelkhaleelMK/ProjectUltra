<template>
  <div class="metadata-bar w-full">
    <!-- Stage -->
    <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper">Stage</span>
      <div class="flex items-center gap-1.5">
        <span 
          class="text-xs px-1.5 py-0.5 rounded font-semibold border"
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

    <!-- Divider -->
    <div class="metadata-divider"></div>

    <!-- Owner -->
    <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper">Owner</span>
      <button 
        @click="$emit('reassign')"
        class="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
      >
        {{ owner }}
      </button>
    </div>

    <!-- Source (optional) -->
    <template v-if="source">
      <div class="metadata-divider"></div>
      <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
        <span class="label-upper">Source</span>
        <span class="text-xs font-bold text-gray-900">{{ source }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Badge } from '@motork/component-library'
import { getDeliverySubstatusColor, getStageColor } from '@/utils/stageMapper'

/**
 * Compact summary bar for a task's commercial metadata:
 * stage, owner and (optionally) source.
 *
 * Used on both lead and opportunity tasks to keep visual
 * hierarchy and semantics identical across contexts.
 */
const props = defineProps({
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
  }
})

defineEmits(['reassign'])

const substatusColorClass = computed(() => {
  if (!props.deliverySubstatus) return ''
  return getDeliverySubstatusColor(props.deliverySubstatus)
})

const substatusTheme = computed(() => {
  if (!props.deliverySubstatus) return 'gray'
  // Map delivery substatus to library badge themes
  if (props.deliverySubstatus === 'Delivered') return 'green'
  if (props.deliverySubstatus === 'Awaiting Delivery') return 'blue'
  return 'gray'
})

// Get stage color class (same as used in LeadManagementWidget)
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
  // Only show badge for "In Negotiation" stage
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
  
  // 3+ days will auto-transition to Needs Follow-up, so no badge
  return null
})
</script>


