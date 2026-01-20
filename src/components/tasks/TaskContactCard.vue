<template>
  <div class="rounded-card flex flex-col h-full" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-user text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Contact</h2>
      </div>
    </div>

    <!-- Card Content -->
    <div class="bg-white rounded-lg p-4 shadow-sm flex flex-col flex-1" style="box-shadow: var(--nsc-card-shadow);">
      <!-- Card Header with Avatar and Name -->
      <div class="flex items-center mb-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <button
            @click.stop="handleAvatarClick"
            class="w-12 h-12 rounded bg-brand-darkDarker text-white flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            :class="{ 'cursor-pointer': customerId }"
            :aria-label="customerId ? 'Open customer profile' : 'Customer'"
          >
            <i class="fa-solid fa-user text-lg"></i>
          </button>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-fluid-sm font-bold uppercase text-brand-dark truncate">{{ task.customer?.name || 'Unknown' }}</h3>
              <button
                @click="openCustomerPage"
                class="w-6 h-6 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                title="Open in new page"
                aria-label="Open customer page"
              >
                <i class="fa-solid fa-external-link text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Details -->
      <div class="space-y-3 pt-3">
        <!-- Email -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-surfaceSecondary flex items-center justify-center shrink-0">
            <i class="fa-regular fa-envelope text-sub text-sm"></i>
          </div>
          <span class="text-fluid-sm text-heading font-medium flex-1 min-w-0 truncate">{{ task.customer?.email || '' }}</span>
          <button 
            @click.stop="copyToClipboard(task.customer?.email || '', 'email')"
            class="w-7 h-7 flex items-center justify-center rounded hover:bg-surfaceSecondary text-sub hover:text-body transition-colors shrink-0"
            title="Copy email"
          >
            <i class="fa-regular fa-copy text-xs"></i>
          </button>
        </div>
        
        <!-- Phone -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-surfaceSecondary flex items-center justify-center shrink-0">
            <i class="fa-solid fa-phone text-sub text-sm"></i>
          </div>
          <span class="text-fluid-sm text-heading font-medium flex-1 min-w-0 truncate">{{ task.customer?.phone || '' }}</span>
          <button 
            @click.stop="copyToClipboard(task.customer?.phone || '', 'phone')"
            class="w-7 h-7 flex items-center justify-center rounded hover:bg-surfaceSecondary text-sub hover:text-body transition-colors shrink-0"
            title="Copy phone"
          >
            <i class="fa-regular fa-copy text-xs"></i>
          </button>
        </div>
        
        <!-- Address -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-surfaceSecondary flex items-center justify-center shrink-0">
            <i class="fa-solid fa-map-marker-alt text-sub text-sm"></i>
          </div>
          <span class="text-fluid-sm text-heading font-medium flex-1 min-w-0 truncate">{{ task.customer?.address || '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

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

const emit = defineEmits(['action', 'add-tag'])

const toastStore = useToastStore()
const router = useRouter()

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    toastStore.pushToast('success', `${field === 'email' ? 'Email' : 'Phone'} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}

const handleAvatarClick = () => {
  if (props.customerId) {
    router.push(`/customer/${props.customerId}`)
  }
}

const openCustomerPage = () => {
  if (props.customerId) {
    router.push(`/customer/${props.customerId}`)
  }
}
</script>
