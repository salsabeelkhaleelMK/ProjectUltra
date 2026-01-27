<template>
  <div class="page-header-main">
    <div class="page-header-content">
      <!-- Left: Customer Info -->
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <!-- Avatar -->
        <button
          @click.stop="handleAvatarClick"
          class="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shrink-0 shadow-sm"
          :class="{ 'cursor-pointer': customerId }"
        >
          <i class="fa-solid fa-user text-base"></i>
        </button>

        <!-- Info Stack -->
        <div class="min-w-0 flex-1 flex flex-col justify-center">
          <!-- Top Row: Name and Tags -->
          <div class="flex items-center gap-2 -mb-2">
            <h1 class="text-lg font-semibold text-foreground truncate leading-tight mb-0">{{ name }}</h1>
            
            <!-- Tags (desktop only, inline with name) -->
            <div class="hidden lg:flex items-center gap-1.5 ml-2">
              <Badge 
                v-for="tag in tags" 
                :key="tag"
                :text="tag"
                size="small"
                theme="blue"
              />
              <button
                @click.stop="handleAddTag"
                class="text-xs text-muted-foreground hover:text-primary font-medium hover:underline flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>tag</span>
              </button>
            </div>
          </div>
          
          <!-- Bottom Row: Contact Details - Better Organized -->
          <div class="flex items-center gap-4 flex-wrap -mt-2">
            <div class="flex items-center gap-1.5 group">
              <i class="fa-regular fa-envelope text-xs text-muted-foreground"></i>
              <span class="text-xs text-muted-foreground truncate max-w-40 sm:max-w-52">{{ email }}</span>
              <button @click.stop="copyToClipboard(email, 'email')" class="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"><i class="fa-regular fa-copy text-xs text-muted-foreground hover:text-primary"></i></button>
            </div>
            
            <div class="flex items-center gap-1.5 group">
              <i class="fa-solid fa-phone text-xs text-muted-foreground"></i>
              <span class="text-xs text-muted-foreground whitespace-nowrap">{{ phone }}</span>
              <button @click.stop="copyToClipboard(phone, 'phone')" class="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"><i class="fa-regular fa-copy text-xs text-muted-foreground hover:text-primary"></i></button>
            </div>

            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-map-marker-alt text-xs text-muted-foreground" v-if="thirdFieldLabel.toLowerCase().includes('address')"></i>
              <i class="fa-regular fa-calendar text-xs text-muted-foreground" v-else></i>
              <span class="text-xs text-muted-foreground truncate max-w-40 sm:max-w-52">{{ thirdFieldValue }}</span>
            </div>

            <!-- Tags (mobile only, inline with contact) -->
            <div class="lg:hidden flex items-center gap-1.5 ml-auto">
              <Badge 
                v-for="tag in tags" 
                :key="tag"
                :text="tag"
                size="small"
                theme="blue"
              />
              <button
                @click.stop="handleAddTag"
                class="text-xs text-muted-foreground hover:text-primary font-medium hover:underline flex items-center gap-1 transition-colors"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>tag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right: Action Buttons -->
      <div class="page-header-actions">
        <Button 
          v-if="showCloseButton"
          variant="secondary" 
          size="icon" 
          @click.stop="$emit('close')"
        >
          <X :size="16" class="text-muted-foreground" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { Button, Badge } from '@motork/component-library/future/primitives'
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

const emit = defineEmits(['add-tag', 'close'])
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
