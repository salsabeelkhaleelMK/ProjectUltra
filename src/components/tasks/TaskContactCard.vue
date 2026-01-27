<template>
  <!-- Simplified: No outer background container, just the card -->
  <div 
    class="overflow-hidden p-4"
    style="
      border-radius: var(--border-radius-rounded-lg, 10px);
      background: var(--base-card, #FFF);
      box-shadow: var(--nsc-card-shadow);
    "
  >
    <div class="flex items-center justify-between gap-2 mb-4">
      <h3 class="text-base font-medium text-heading leading-6">Customer information</h3>
      <Button
        v-if="task.customer?.id"
        variant="ghost"
        size="icon"
        @click="openCustomerProfileInNewTab"
        :class="'h-7 w-7'"
        title="Open customer profile in new tab"
      >
        <ExternalLink :size="14" class="text-sub" />
      </Button>
    </div>
    
    <!-- Card Content --><div class="flex flex-col">
      <!-- Contact Details -->
      <div class="space-y-3">
        <!-- Customer Name -->
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm text-sub leading-5 shrink-0">Customer</p>
          <p class="text-sm font-medium text-heading leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer?.name || 'Unknown' }}
          </p>
        </div>
        
        <!-- Email -->
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm text-sub leading-5 shrink-0">Email</p>
          <p class="text-sm font-medium text-heading leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer?.email || 'N/A' }}
          </p>
        </div>
        
        <!-- Phone -->
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm text-sub leading-5 shrink-0">Phone</p>
          <p class="text-sm font-medium text-heading leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer?.phone || 'N/A' }}
          </p>
        </div>
        
        <!-- Address -->
        <div v-if="task.customer?.address" class="flex items-start justify-between gap-2">
          <p class="text-sm text-sub leading-5 shrink-0">Address</p>
          <p class="text-sm font-medium text-heading leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer.address }}
          </p>
        </div>
      </div>

      <!-- Other Tasks from Same Customer (Ultra-Compact) -->
      <div v-if="relatedTasks.length > 0" class="mt-4 pt-4 border-t border-black/5">
        <h3 class="text-base font-medium text-heading mb-4 leading-6">Other customer requests</h3>
        <div class="space-y-0.5">
          <div
            v-for="relatedTask in relatedTasks"
            :key="relatedTask.compositeId"
            @click="goToTask(relatedTask)"
            class="group px-2 py-1 rounded-lg border border-transparent hover:border-brand-blue/30 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <!-- Single Line: Type + Stage + Vehicle + Price + Date -->
            <span 
              class="text-sm font-bold uppercase px-1 py-0.5 rounded leading-normal shrink-0"
              :class="relatedTask.type === 'lead' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'"
            >
              {{ relatedTask.type === 'lead' ? 'Lead' : 'Opp' }}
            </span>
            <span class="text-sm font-medium text-heading truncate shrink-0 min-w-0">
              {{ getTaskStage(relatedTask) }}
            </span>
            <span class="text-sm text-body truncate flex-1 min-w-0">
              {{ getVehicleDisplay(relatedTask) }}
            </span>
            <span v-if="relatedTask.type === 'opportunity' && relatedTask.estimatedValue" class="text-sm font-bold text-heading shrink-0">
              {{ formatCurrency(relatedTask.estimatedValue) }}
            </span>
            <span class="text-sm text-sub shrink-0">
              {{ formatTaskDate(relatedTask) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { Button } from '@motork/component-library/future/primitives'
import { Info, ExternalLink, Copy, Phone, Mail, Calendar } from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  taskType: {
    type: String,
    default: 'lead' // 'lead' | 'opportunity' | 'contact'
  },
  customerId: {
    type: [Number, String],
    default: null
  }
})

const toastStore = useToastStore()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

const negotiationsCount = computed(() => {
  // Check for negotiations in different possible fields
  return props.task.negotiations || props.task.activeNegotiations || 0
})

// Get related tasks from the same customer (limited to 3 most recent)
const relatedTasks = computed(() => {
  if (!props.task.customer) return []
  
  const customerEmail = props.task.customer.email
  const customerPhone = props.task.customer.phone
  const currentTaskId = props.task.compositeId
  
  // Combine all leads and opportunities
  const allTasks = [
    ...(leadsStore.leads || []).map(lead => ({ ...lead, type: 'lead', compositeId: `lead-${lead.id}` })),
    ...(opportunitiesStore.opportunities || []).map(opp => ({ ...opp, type: 'opportunity', compositeId: `opportunity-${opp.id}` }))
  ]
  
  // Filter by same customer (email or phone match) and exclude current task
  return allTasks
    .filter(task => {
      if (task.compositeId === currentTaskId) return false
      if (!task.customer) return false
      
      return task.customer.email === customerEmail || task.customer.phone === customerPhone
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3) // Only show top 3 to save space
})

const copyToClipboard = async (text, field) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    toastStore.pushToast('success', `${field === 'email' ? 'Email' : 'Phone'} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}

const openCustomerPage = () => {
  if (props.customerId) {
    router.push(`/customer/${props.customerId}`)
  }
}

const openCustomerProfileInNewTab = () => {
  const customerId = props.task.customer?.id || props.customerId
  if (customerId) {
    const url = router.resolve(`/customer/${customerId}`).href
    window.open(url, '_blank')
  }
}

const goToTask = (task) => {
  const [type, id] = task.compositeId.split('-')
  router.push({ 
    path: `/tasks/${id}`, 
    query: { type } 
  })
}

const getTaskStage = (task) => {
  return task.stage || task.currentStage || 'Unknown'
}

// Format date (e.g., Dec 10, 24)
const formatTaskDate = (task) => {
  const date = task.createdAt || task.nextActionDue || task.updatedAt
  if (!date) return ''
  
  try {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit' 
    })
  } catch {
    return ''
  }
}

// Vehicle display - super compact
const getVehicleDisplay = (task) => {
  const vehicle = task.requestedCar || task.vehicle
  if (!vehicle) return 'No vehicle'
  
  const brand = vehicle.brand || ''
  const model = vehicle.model || ''
  const year = vehicle.year ? `(${vehicle.year})` : ''
  return `${brand} ${model} ${year}`.trim() || 'Vehicle info N/A'
}

// Format currency (e.g., €45k)
const formatCurrency = (amount) => {
  if (!amount) return '€0'
  if (amount >= 1000) {
    return '€' + (amount / 1000).toFixed(0) + 'k'
  }
  return '€' + amount
}
</script>

