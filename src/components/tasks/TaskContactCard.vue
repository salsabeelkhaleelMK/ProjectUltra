<template>
  <div class="rounded-card flex flex-col h-full" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-thumbtack text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Customer information</h2>
      </div>
    </div>

    <!-- Card Content -->
    <div class="bg-white rounded-lg p-4 shadow-sm flex flex-col flex-1" style="box-shadow: var(--nsc-card-shadow);">
      <!-- Contact Details -->
      <div class="space-y-2 mb-4">
      <!-- Customer Name -->
      <div class="flex justify-between gap-2 items-center">
        <p class="text-sm text-greys-500 shrink-0">Customer</p>
        <div class="flex items-center gap-2 min-w-0">
          <p class="text-sm font-medium text-greys-900 truncate">
            {{ task.customer?.name || 'Unknown' }}
          </p>
          <button
            v-if="customerId"
            @click="openCustomerPage"
            class="w-5 h-5 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-700 transition-colors shrink-0"
            title="Open customer profile"
          >
            <ExternalLink :size="12" />
          </button>
        </div>
      </div>
      
      <!-- Email -->
      <div class="flex justify-between gap-2 items-center">
        <p class="text-sm text-greys-500 shrink-0">Email</p>
        <div class="flex items-center gap-2 min-w-0">
          <p class="text-sm font-medium text-greys-900 truncate">
            {{ task.customer?.email || 'N/A' }}
          </p>
          <button 
            v-if="task.customer?.email"
            @click.stop="copyToClipboard(task.customer.email, 'email')"
            class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-greys-500 hover:text-greys-900 transition-colors shrink-0"
            title="Copy email"
          >
            <Copy :size="12" />
          </button>
        </div>
      </div>
      
      <!-- Phone -->
      <div class="flex justify-between gap-2 items-center">
        <p class="text-sm text-greys-500 shrink-0">Phone</p>
        <div class="flex items-center gap-2 min-w-0">
          <p class="text-sm font-medium text-greys-900 truncate">
            {{ task.customer?.phone || 'N/A' }}
          </p>
          <button 
            v-if="task.customer?.phone"
            @click.stop="copyToClipboard(task.customer.phone, 'phone')"
            class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-greys-500 hover:text-greys-900 transition-colors shrink-0"
            title="Copy phone"
          >
            <Copy :size="12" />
          </button>
        </div>
      </div>
      
      <!-- Address -->
      <div v-if="task.customer?.address" class="flex justify-between gap-2 items-start">
        <p class="text-sm text-greys-500 shrink-0">Address</p>
        <p class="text-sm font-medium text-greys-900 text-right min-w-0">
          {{ task.customer.address }}
        </p>
      </div>
    </div>
    
      <!-- Negotiations Banner -->
      <div 
        v-if="negotiationsCount > 0" 
        class="rounded-btn p-3 flex items-center gap-2"
        style="background-color: rgba(59, 130, 246, 0.1);"
      >
        <Info :size="16" class="text-blue-600 shrink-0" />
        <p class="text-sm text-blue-900">
          {{ negotiationsCount }} other negotiation{{ negotiationsCount > 1 ? 's' : '' }} active
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { Info, ExternalLink, Copy } from 'lucide-vue-next'

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

const negotiationsCount = computed(() => {
  // Check for negotiations in different possible fields
  return props.task.negotiations || props.task.activeNegotiations || 0
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
</script>

<style scoped>
.text-greys-500 {
  color: #6B7280;
}

.text-greys-900 {
  color: #111827;
}
</style>
