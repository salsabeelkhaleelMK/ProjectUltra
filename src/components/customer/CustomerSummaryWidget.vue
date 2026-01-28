<template>
  <Card class="h-full">
    <CardHeader>
      <div class="flex items-center gap-2">
        <Lightbulb class="w-4 h-4 text-foreground" />
        <CardTitle class="text-sm font-semibold leading-5">Customer Insights</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="space-y-3 animate-pulse">
          <div class="space-y-2">
            <div class="h-4 bg-muted rounded w-3/4"></div>
            <div class="h-4 bg-muted rounded w-full"></div>
            <div class="h-4 bg-muted rounded w-5/6"></div>
          </div>
          <div class="flex flex-wrap gap-2 pt-3">
            <div class="h-6 bg-muted rounded w-24"></div>
            <div class="h-6 bg-muted rounded w-32"></div>
            <div class="h-6 bg-muted rounded w-20"></div>
          </div>
        </div>
      </template>
      
      <!-- Content -->
      <template v-else>
        <div class="divide-y divide-border">
          <!-- Summary Section -->
          <div class="py-3">
            <p v-if="summary" class="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {{ summary }}
            </p>
            <div v-else class="flex items-center gap-3 py-1 text-muted-foreground">
              <Info class="w-4 h-4 opacity-20" />
              <p class="text-xs italic">No customer insights available yet. Insights will appear as we learn more about this customer's preferences and behavior.</p>
            </div>
          </div>
          
          <!-- Preferences Tags Section -->
          <div v-if="preferences && preferences.length > 0" class="py-3">
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="(pref, index) in preferences" 
                :key="index"
                variant="outline"
                class="text-xs font-semibold uppercase tracking-wider"
              >
                <component :is="getPreferenceIcon(pref.icon)" class="w-3 h-3 mr-1.5 text-primary" />
                {{ pref.label }}
              </Badge>
            </div>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Badge } from '@motork/component-library/future/primitives'
import { Lightbulb, Info, Car, MessageCircle, Phone, Mail, MessageSquare, Clock, DollarSign } from 'lucide-vue-next'

const props = defineProps({
  summary: {
    type: String,
    default: null
  },
  preferences: {
    type: Array,
    default: () => []
  },
  customerData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Map Font Awesome icon classes to lucide-vue-next components
const getPreferenceIcon = (iconClass) => {
  const iconMap = {
    'fa-solid fa-car': Car,
    'fa-brands fa-whatsapp': MessageCircle,
    'fa-solid fa-phone': Phone,
    'fa-solid fa-envelope': Mail,
    'fa-solid fa-message': MessageSquare,
    'fa-solid fa-comment': MessageCircle,
    'fa-solid fa-clock': Clock,
    'fa-solid fa-dollar-sign': DollarSign
  }
  return iconMap[iconClass] || Info
}

// Generate preferences from customer data if available
const preferences = computed(() => {
  if (props.preferences && props.preferences.length > 0) {
    return props.preferences
  }
  
  // Auto-generate preferences from customer data if available
  const prefs = []
  const data = props.customerData
  
  if (!data) return prefs
  
  // Vehicle preference
  if (data.preferredVehicleType) {
    prefs.push({
      icon: 'fa-solid fa-car',
      label: `Prefers ${data.preferredVehicleType}s`
    })
  }
  
  // Communication channel
  if (data.preferredChannel) {
    const channelIcons = {
      'whatsapp': 'fa-brands fa-whatsapp',
      'phone': 'fa-solid fa-phone',
      'email': 'fa-solid fa-envelope',
      'sms': 'fa-solid fa-message'
    }
    prefs.push({
      icon: channelIcons[data.preferredChannel.toLowerCase()] || 'fa-solid fa-comment',
      label: `Prefers ${data.preferredChannel}`
    })
  }
  
  // Contact time
  if (data.preferredContactTime) {
    prefs.push({
      icon: 'fa-solid fa-clock',
      label: data.preferredContactTime
    })
  }
  
  // Budget
  if (data.budgetRange) {
    prefs.push({
      icon: 'fa-solid fa-dollar-sign',
      label: data.budgetRange
    })
  }
  
  return prefs
})
</script>
