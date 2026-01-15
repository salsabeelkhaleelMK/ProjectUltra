<template>
  <div class="w-full bg-white">
    <!-- Row 1: Header with customer info, actions, and expander arrow -->
    <div class="flex items-center justify-between gap-3 md:gap-4">
      <div class="flex items-center gap-3 md:gap-4 flex-1">
        <!-- Customer Icon -->
        <button
          @click.stop="handleAvatarClick"
          class="w-14 h-14 rounded bg-brand-darkDarker text-white flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          :class="{ 'cursor-pointer': customerId }"
          :aria-label="customerId ? 'Open customer profile' : 'Customer'"
        >
          <i class="fa-solid fa-user text-xl"></i>
        </button>
        
        <!-- Name & Tags -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold uppercase text-brand-dark truncate leading-tight">{{ name }}</h1>
            <slot name="name-action"></slot>
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <slot name="tags"></slot>
            <button
              @click.stop="handleAddTag"
              class="text-xs text-brand-red hover:text-brand-red-dark font-medium hover:underline flex items-center gap-1"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              <span>add tag</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Action Button and Expander Arrow -->
      <div class="flex items-center gap-1 ml-2">
        <div class="relative">
          <button 
            @click.stop="showQuickActionMenu = !showQuickActionMenu"
            class="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shrink-0"
            aria-label="Quick actions"
          >
            <i class="fa-solid fa-plus text-base text-gray-600"></i>
          </button>
          
          <!-- Quick Action Dropdown Menu -->
          <div 
            v-if="showQuickActionMenu"
            class="absolute top-full right-0 mt-2 z-50"
            v-click-outside="() => showQuickActionMenu = false"
          >
            <DropdownMenu :items="quickActionItems" className="w-48" />
          </div>
        </div>
        
        <button 
          @click="showContactInfo = !showContactInfo" 
          class="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shrink-0"
        >
          <i class="fa-solid fa-chevron-up text-sm transition-transform duration-200" :class="{ 'rotate-180': showContactInfo }"></i>
        </button>
      </div>
    </div>
    
    <!-- Row 2: Expanded Contact Details -->
    <div 
      v-if="showContactInfo" 
      class="mt-4 pt-4 border-t-2 border-dashed border-gray-300 animate-fade-in relative"
    >
      <div class="flex items-center gap-4">
        <!-- Contact Details -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <!-- Email -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <i class="fa-regular fa-envelope text-gray-500 text-xs"></i>
            </div>
            <span class="text-meta text-gray-900 font-medium">{{ email }}</span>
            <button 
              @click.stop="copyToClipboard(email, 'email')"
              class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Copy email"
            >
              <i class="fa-regular fa-copy text-xs"></i>
            </button>
          </div>
          
          <!-- Phone -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-phone text-gray-500 text-xs"></i>
            </div>
            <span class="text-meta text-gray-900 font-medium">{{ phone }}</span>
            <button 
              @click.stop="copyToClipboard(phone, 'phone')"
              class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Copy phone"
            >
              <i class="fa-regular fa-copy text-xs"></i>
            </button>
          </div>
          
          <!-- Third Field (Address/Date) -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-map-marker-alt text-gray-500 text-xs" v-if="thirdFieldLabel.toLowerCase().includes('address')"></i>
              <i class="fa-regular fa-calendar text-gray-500 text-xs" v-else></i>
            </div>
            <span class="text-meta text-gray-900 font-medium">{{ thirdFieldValue }}</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DropdownMenu } from '@motork/component-library'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  initials: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatarColorClass: {
    type: String,
    default: 'bg-orange-100 text-orange-600'
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  thirdFieldValue: {
    type: String,
    required: true
  },
  emailLabel: {
    type: String,
    default: 'Email'
  },
  phoneLabel: {
    type: String,
    default: 'Phone'
  },
  thirdFieldLabel: {
    type: String,
    default: 'Expected Close'
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

const showContactInfo = ref(false)
const showQuickActionMenu = ref(false)
const toastStore = useToastStore()
const router = useRouter()


const quickActionItems = computed(() => {
  const base = [
    { key: 'note', label: 'Note' },
    { key: 'financing', label: 'Financing' },
    { key: 'tradein', label: 'Trade-in' },
    { key: 'purchase', label: 'Purchase' },
    { key: 'attachment', label: 'Attachment' },
    { key: 'whatsapp', label: 'WhatsApp msg' },
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
    { key: 'call', label: 'Call' },
    ...(props.taskType === 'opportunity' ? [{ key: 'appointment', label: 'Appointment' }] : [])
  ]

  return base.map(item => ({
    ...item,
    onClick: () => handleAction(item.key)
  }))
})

const handleAction = (action) => {
  showQuickActionMenu.value = false
  emit('action', action)
}

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    toastStore.pushToast('success', `${field === 'email' ? 'Email' : 'Phone'} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}

const handleAddTag = () => {
  emit('add-tag')
}

const handleAvatarClick = () => {
  if (props.customerId) {
    router.push(`/customer/${props.customerId}`)
  }
}
</script>
