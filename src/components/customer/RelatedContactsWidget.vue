<template>
  <Card v-if="accountData || loading" class="h-full">
    <CardHeader>
      <div class="flex items-center gap-2">
        <Users class="w-4 h-4 text-foreground" />
        <CardTitle class="text-sm font-semibold leading-5">Related Contacts</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="space-y-3 animate-pulse">
          <div v-for="n in 3" :key="`skeleton-${n}`" class="flex items-center gap-3 p-3">
            <div class="w-10 h-10 bg-muted rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-muted rounded w-3/4"></div>
              <div class="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Content -->
      <template v-else-if="relatedContacts && relatedContacts.length > 0">
        <div class="space-y-2">
          <div
            v-for="contact in relatedContacts"
            :key="contact.id"
            @click="navigateToContact(contact.id)"
            class="flex items-center gap-3 p-3 hover:bg-muted transition-colors rounded-md cursor-pointer group"
          >
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-xs font-semibold text-primary">
                {{ contact.initials || getInitials(contact.name) }}
              </span>
            </div>
            
            <!-- Contact Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-medium text-foreground truncate">
                  {{ contact.name }}
                </span>
                <Badge
                  v-if="isMasterContact(contact.id)"
                  variant="outline"
                  class="text-xs px-1.5 py-0"
                >
                  <Star class="w-3 h-3 mr-1" />
                  Master
                </Badge>
              </div>
              <div v-if="contact.jobTitle || contact.title" class="text-xs text-muted-foreground truncate">
                {{ contact.jobTitle || contact.title }}
              </div>
              <div class="flex items-center gap-3 mt-1">
                <div v-if="contact.email" class="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail class="w-3 h-3" />
                  <span class="truncate max-w-32">{{ contact.email }}</span>
                </div>
                <div v-if="contact.phone" class="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone class="w-3 h-3" />
                  <span class="truncate">{{ contact.phone }}</span>
                </div>
              </div>
            </div>
            
            <!-- Arrow Icon -->
            <ArrowRight class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </div>
      </template>
      
      <!-- Empty State -->
      <template v-else-if="!loading">
        <div class="text-center py-6 text-muted-foreground">
          <Users class="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p class="text-xs">No related contacts found</p>
        </div>
      </template>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Badge } from '@motork/component-library/future/primitives'
import { Users, Mail, Phone, ArrowRight, Star } from 'lucide-vue-next'

const props = defineProps({
  relatedContacts: {
    type: Array,
    default: () => []
  },
  masterContactId: {
    type: [Number, String],
    default: null
  },
  currentContactId: {
    type: [Number, String],
    default: null
  },
  accountData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const isMasterContact = (contactId) => {
  if (!props.masterContactId) return false
  return String(contactId) === String(props.masterContactId)
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const navigateToContact = (contactId) => {
  if (contactId && String(contactId) !== String(props.currentContactId)) {
    router.push({ path: `/customer/${contactId}`, query: { type: 'contact' } })
  }
}
</script>
