<template>
  <div class="w-full card-container p-3 md:px-8 md:py-3.5">
    <!-- Main Content Row -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <!-- Simple Back Button -->
        <button
          @click="router.push('/customers')"
          class="w-7 h-7 flex items-center justify-center text-sub hover:text-brand-dark transition-colors shrink-0 -ml-1"
          aria-label="Back to customers"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
        </button>

        <!-- Identity and Info Section -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <!-- Avatar -->
          <button
            @click.stop="handleAvatarClick"
            class="w-20 h-20 rounded-lg bg-black text-white flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0 shadow-sm"
            :class="{ 'cursor-pointer': customerId }"
          >
            <i class="fa-solid fa-user text-3xl text-white"></i>
          </button>

          <!-- Information Stack -->
          <div class="min-w-0 flex-1">
            <h1 class="text-fluid-base font-bold uppercase text-brand-dark truncate leading-tight">{{ name }}</h1>
            
            <div class="flex flex-col gap-1.5 mt-1">
              <!-- Compact Contact Details -->
              <div class="flex flex-wrap items-center gap-x-4 gap-y-0.5">
                <div class="flex items-center gap-1.5 group">
                  <i class="fa-regular fa-envelope text-sm text-brand-dark font-bold"></i>
                  <span class="text-xs text-heading font-medium truncate max-w-36 lg:max-w-none">{{ email }}</span>
                  <button @click.stop="copyToClipboard(email, 'email')" class="transition-all"><i class="fa-regular fa-copy text-xs text-sub hover:text-brand-dark"></i></button>
                </div>
                
                <div class="flex items-center gap-1.5 group">
                  <i class="fa-solid fa-phone text-sm text-brand-dark font-bold"></i>
                  <span class="text-xs text-heading font-medium whitespace-nowrap">{{ phone }}</span>
                  <button @click.stop="copyToClipboard(phone, 'phone')" class="transition-all"><i class="fa-regular fa-copy text-xs text-sub hover:text-brand-dark"></i></button>
                </div>

                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-map-marker-alt text-sm text-brand-dark font-bold" v-if="thirdFieldLabel.toLowerCase().includes('address')"></i>
                  <i class="fa-regular fa-calendar text-sm text-brand-dark font-bold" v-else></i>
                  <span class="text-xs text-heading font-medium truncate max-w-36 lg:max-w-none">{{ thirdFieldValue }}</span>
                </div>
              </div>

              <!-- Tags Section (moved from TaskContactCard) -->
              <div class="flex flex-wrap items-center gap-1.5">
                <span 
                  v-for="tag in tags" 
                  :key="tag"
                  class="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 font-semibold rounded"
                >
                  {{ tag }}
                </span>
                <button
                  @click.stop="handleAddTag"
                  class="text-xs text-sub hover:text-brand-dark font-medium hover:underline flex items-center gap-1 transition-colors"
                >
                  <i class="fa-solid fa-plus text-xs"></i>
                  <span>add tag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Plus Button at the very end -->
      <div class="shrink-0">
        <div class="relative">
          <button 
            @click.stop="showQuickActionMenu = !showQuickActionMenu"
            class="w-9 h-9 flex items-center justify-center bg-white border border-black/5 rounded-lg hover:bg-surfaceSecondary text-brand-dark shadow-sm transition-all"
            aria-label="Quick actions"
          >
            <i class="fa-solid fa-plus text-sm"></i>
          </button>
          
          <div 
            v-if="showQuickActionMenu"
            class="absolute top-full right-0 mt-2 z-50 shadow-xl"
            v-click-outside="() => showQuickActionMenu = false"
          >
            <DropdownMenu :items="quickActionItems" className="w-48" />
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
  initials: { type: String, required: true },
  name: { type: String, required: true },
  avatarColorClass: { type: String, default: 'bg-orange-100 text-orange-600' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  thirdFieldValue: { type: String, required: true },
  emailLabel: { type: String, default: 'Email' },
  phoneLabel: { type: String, default: 'Phone' },
  thirdFieldLabel: { type: String, default: 'Expected Close' },
  taskType: { type: String, default: 'lead' },
  customerId: { type: [Number, String], default: null },
  tags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action', 'add-tag'])
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
  return base.map(item => ({ ...item, onClick: () => handleAction(item.key) }))
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

const handleAddTag = () => emit('add-tag')
const handleAvatarClick = () => {
  if (props.customerId) router.push(`/customer/${props.customerId}`)
}
</script>
