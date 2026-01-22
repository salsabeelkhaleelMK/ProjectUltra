<template>
  <div class="w-full card-container p-3 md:px-8 md:py-3.5">
    <!-- Main Content Row -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <!-- Identity and Info Section -->
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <!-- Avatar -->
          <button
            @click.stop="handleAvatarClick"
            class="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0 shadow-sm"
            :class="{ 'cursor-pointer': customerId }"
          >
            <i class="fa-solid fa-user text-xl text-white"></i>
          </button>

          <!-- Information Stack -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h1 class="text-fluid-base font-bold uppercase text-brand-dark truncate leading-tight">{{ name }}</h1>
              <button
                v-if="customerId"
                @click.stop="handleOpenCustomerPage"
                class="w-6 h-6 flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                title="Open in new page"
                aria-label="Open customer page"
              >
                <i class="fa-solid fa-external-link text-xs"></i>
              </button>
            </div>
            
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
            </div>
          </div>
        </div>

        <!-- Tags Section - Full Row Below Avatar -->
        <div class="flex flex-wrap items-center gap-1.5 ml-16">
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
      
      <!-- Action Buttons (Plus + Close) at the very end -->
      <div class="shrink-0 flex items-center gap-2">
        <!-- Plus Button -->
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
            class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-black/10 py-1 z-50"
            v-click-outside="() => showQuickActionMenu = false"
            @click.stop
          >
            <!-- Communication Group -->
            <button
              @click="handleAction('email')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-envelope text-sm" style="color: #2563eb;"></i>
              Email
            </button>
            <button
              @click="handleAction('sms')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-comment text-sm" style="color: #9333ea;"></i>
              SMS
            </button>
            <button
              @click="handleAction('whatsapp')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-brands fa-whatsapp text-sm" style="color: #16a34a;"></i>
              WhatsApp
            </button>
            <button
              @click="handleAction('call')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-phone text-sm" style="color: #16a34a;"></i>
              Call
            </button>

            <!-- Separator -->
            <div class="border-t border-black/10 my-1"></div>

            <!-- Activities Group -->
            <button
              @click="handleAction('note')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-sticky-note text-sm" style="color: #ea580c;"></i>
              Note
            </button>
            <button
              @click="handleAction('attachment')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-paperclip text-sm" style="color: #6b7280;"></i>
              Attachment
            </button>

            <!-- Separator -->
            <div class="border-t border-black/10 my-1"></div>

            <!-- Business Group -->
            <button
              @click="handleAction('financing')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-file-invoice-dollar text-sm" style="color: #4f46e5;"></i>
              Financing
            </button>
            <button
              @click="handleAction('tradein')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-arrow-right-arrow-left text-sm" style="color: #2563eb;"></i>
              Trade-in
            </button>
            <button
              @click="handleAction('purchase')"
              class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-handshake text-sm" style="color: #4f46e5;"></i>
              Offer
            </button>

            <!-- Appointment (conditional) -->
            <template v-if="props.taskType === 'opportunity' || props.taskType === 'contact'">
              <!-- Separator -->
              <div class="border-t border-black/10 my-1"></div>
              <button
                @click="handleAction('appointment')"
                class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
              >
                <i class="fa-regular fa-calendar text-sm" style="color: #9333ea;"></i>
                Appointment
              </button>
            </template>
          </div>
        </div>
        
        <!-- Close Button (only shown when showCloseButton is true) -->
        <Button 
          v-if="showCloseButton"
          variant="secondary" 
          size="icon" 
          @click.stop="$emit('close')"
        >
          <X :size="16" class="text-greys-700" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { Button } from '@motork/component-library/future/primitives'
import { X } from 'lucide-vue-next'

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
  },
  showCloseButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['action', 'add-tag', 'close'])
const showQuickActionMenu = ref(false)
const toastStore = useToastStore()
const router = useRouter()

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

const handleOpenCustomerPage = () => {
  if (props.customerId) {
    const url = router.resolve(`/customer/${props.customerId}`).href
    window.open(url, '_blank')
  }
}
</script>
