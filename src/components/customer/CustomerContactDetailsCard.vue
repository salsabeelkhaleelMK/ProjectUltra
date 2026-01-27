<template>
  <Card class="h-full">
    <CardHeader>
      <CardTitle class="text-sm font-semibold leading-5">Contact Details</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-muted rounded w-3/4"></div>
          <div class="h-4 bg-muted rounded w-2/3"></div>
          <div class="h-4 bg-muted rounded w-4/5"></div>
        </div>
      </template>
      
      <!-- Content -->
      <template v-else>
        <div class="space-y-3">
          <!-- Title/Salutation -->
          <div v-if="title" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <User class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Title</div>
              <div class="text-sm text-foreground">{{ title }}</div>
            </div>
          </div>
          
          <!-- Job Title -->
          <div v-if="jobTitle" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <Briefcase class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Job Title</div>
              <div class="text-sm text-foreground">{{ jobTitle }}</div>
            </div>
          </div>
          
          <!-- Email -->
          <div v-if="email" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <Mail class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Email</div>
              <div class="text-sm text-foreground truncate">{{ email }}</div>
            </div>
            <Button
              @click="copyToClipboard(email, 'email')"
              variant="ghost"
              size="icon"
              class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              title="Copy email"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Phone -->
          <div v-if="phone" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <Phone class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Phone</div>
              <div class="text-sm text-foreground">{{ phone }}</div>
            </div>
            <Button
              @click="copyToClipboard(phone, 'phone')"
              variant="ghost"
              size="icon"
              class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              title="Copy phone"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Address -->
          <div v-if="address" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <MapPin class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Address</div>
              <div class="text-sm text-foreground">{{ address }}</div>
            </div>
            <Button
              @click="copyToClipboard(address, 'address')"
              variant="ghost"
              size="icon"
              class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              title="Copy address"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Empty State -->
          <div v-if="!title && !jobTitle && !email && !phone && !address" class="text-center py-6 text-muted-foreground">
            <p class="text-xs">No contact details available</p>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Button } from '@motork/component-library/future/primitives'
import { Mail, Phone, MapPin, Copy, User, Briefcase } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  jobTitle: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const toastStore = useToastStore()

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    const fieldName = field === 'email' ? 'Email' : field === 'phone' ? 'Phone' : 'Address'
    toastStore.pushToast('success', `${fieldName} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}
</script>
