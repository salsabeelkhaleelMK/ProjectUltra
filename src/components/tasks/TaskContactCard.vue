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
      <h3 class="text-base font-medium text-foreground leading-6">Customer information</h3>
      <Button
        v-if="task.customer?.id"
        variant="ghost"
        size="icon"
        @click="openCustomerProfileInNewTab"
        :class="'h-7 w-7'"
        title="Open customer profile in new tab"
      >
        <ExternalLink :size="14" class="text-muted-foreground" />
      </Button>
    </div>
    
    <!-- Card Content --><div class="flex flex-col">
      <!-- Contact Details -->
      <div class="space-y-3">
        <!-- Customer Name -->
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm text-muted-foreground leading-5 shrink-0">Customer</p>
          <p class="text-sm font-medium text-foreground leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer?.name || 'Unknown' }}
          </p>
        </div>
        
        <!-- Email -->
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm text-muted-foreground leading-5 shrink-0">Email</p>
          <p class="text-sm font-medium text-foreground leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer?.email || 'N/A' }}
          </p>
        </div>
        
        <!-- Phone -->
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground leading-5 shrink-0">Phone</p>
          <div class="flex items-center gap-1 min-w-0 flex-1 justify-end">
            <p class="text-sm font-medium text-foreground leading-5 text-right truncate min-w-0">
              {{ task.customer?.phone || 'N/A' }}
            </p>
            <Button
              v-if="task.customer?.phone"
              variant="ghost"
              size="icon"
              class="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
              title="Copy phone number"
              @click="copyToClipboard(task.customer.phone, 'phone')"
            >
              <Copy :size="14" />
            </Button>
          </div>
        </div>
        
        <!-- Address -->
        <div v-if="task.customer?.address" class="flex items-start justify-between gap-2">
          <p class="text-sm text-muted-foreground leading-5 shrink-0">Address</p>
          <p class="text-sm font-medium text-foreground leading-5 text-right wrap-break-word min-w-0 flex-1">
            {{ task.customer.address }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { Button } from '@motork/component-library/future/primitives'
import { ExternalLink, Copy } from 'lucide-vue-next'

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

// Get related tasks from the same customer (limited to 3 most recent)

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

</script>

