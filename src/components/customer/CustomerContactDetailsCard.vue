<template>
  <Card class="h-full">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm font-semibold leading-5">{{ displayName || 'Contact Details' }}</CardTitle>
        <Button
          @click="showEditModal = true"
          variant="ghost"
          size="sm"
          class="text-xs"
        >
          Edit Contact
        </Button>
      </div>
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
        <!-- Header Section: Job Title, Master Contact Badge -->
        <div v-if="jobTitle || isMasterContact" class="mb-4 pb-4 border-b border-border">
          <div class="flex items-center gap-2 mb-1">
            <Badge
              v-if="isMasterContact"
              variant="outline"
              class="text-xs px-1.5 py-0"
            >
              <Star class="w-3 h-3 mr-1" />
              Master Contact
            </Badge>
          </div>
          <div v-if="jobTitle" class="text-sm text-muted-foreground">{{ jobTitle }}</div>
          <div v-if="accountName && isMasterContact" class="text-xs text-muted-foreground mt-1">
            at {{ accountName }}
          </div>
        </div>

        <div class="space-y-4">
          <!-- Personal Info Section -->
          <div v-if="title || birthDate || gender || placeOfBirth" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Personal Info</h4>
            <div class="space-y-2">
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
              
              <!-- Birth Date -->
              <div v-if="birthDate" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Calendar class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Birth Date</div>
                  <div class="text-sm text-foreground">{{ formatDate(birthDate) }}</div>
                </div>
              </div>
              
              <!-- Gender -->
              <div v-if="gender" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <User class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Gender</div>
                  <div class="text-sm text-foreground">{{ gender }}</div>
                </div>
              </div>
              
              <!-- Place of Birth -->
              <div v-if="placeOfBirth" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Place of Birth</div>
                  <div class="text-sm text-foreground">{{ placeOfBirth }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Methods Section -->
          <div v-if="primaryEmail || secondaryEmailValue || primaryPhone || secondaryPhoneValue || mobilePhoneValue" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Methods</h4>
            <div class="space-y-2">
              <!-- Primary Email -->
              <div v-if="primaryEmail" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Mail class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Primary Email</div>
                  <a :href="`mailto:${primaryEmail}`" class="text-sm text-primary hover:underline truncate block">{{ primaryEmail }}</a>
                </div>
                <Button
                  @click="copyToClipboard(primaryEmail, 'email')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy email"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Secondary Email -->
              <div v-if="secondaryEmailValue" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Mail class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Secondary Email</div>
                  <a :href="`mailto:${secondaryEmailValue}`" class="text-sm text-primary hover:underline truncate block">{{ secondaryEmailValue }}</a>
                </div>
                <Button
                  @click="copyToClipboard(secondaryEmailValue, 'email')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy email"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Primary Phone -->
              <div v-if="primaryPhone" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Phone class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Primary Phone</div>
                  <a :href="`tel:${primaryPhone}`" class="text-sm text-primary hover:underline">{{ primaryPhone }}</a>
                </div>
                <Button
                  @click="copyToClipboard(primaryPhone, 'phone')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy phone"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Secondary Phone -->
              <div v-if="secondaryPhoneValue" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Phone class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Secondary Phone</div>
                  <a :href="`tel:${secondaryPhoneValue}`" class="text-sm text-primary hover:underline">{{ secondaryPhoneValue }}</a>
                </div>
                <Button
                  @click="copyToClipboard(secondaryPhoneValue, 'phone')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy phone"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Mobile Phone -->
              <div v-if="mobilePhoneValue" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Smartphone class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Mobile Phone</div>
                  <a :href="`tel:${mobilePhoneValue}`" class="text-sm text-primary hover:underline">{{ mobilePhoneValue }}</a>
                </div>
                <Button
                  @click="copyToClipboard(mobilePhoneValue, 'phone')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy phone"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div v-if="hasAddress || addressFull" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</h4>
            <div class="space-y-2">
              <!-- Street Address Line 1 -->
              <div v-if="addressStreetLine1" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Street Address</div>
                  <div class="text-sm text-foreground">{{ addressStreetLine1 }}</div>
                </div>
                <Button
                  @click="copyToClipboard(addressStreetLine1, 'address')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy address"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Street Address Line 2 -->
              <div v-if="addressStreetLine2" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground opacity-0" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-foreground">{{ addressStreetLine2 }}</div>
                </div>
              </div>
              
              <!-- City, Postal Code, Region, Country -->
              <div v-if="addressCity || addressPostalCode || addressRegion || addressCountry" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground opacity-0" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-foreground">
                    <span v-if="addressCity">{{ addressCity }}</span>
                    <span v-if="addressCity && addressPostalCode">, </span>
                    <span v-if="addressPostalCode">{{ addressPostalCode }}</span>
                    <span v-if="(addressCity || addressPostalCode) && addressRegion">, </span>
                    <span v-if="addressRegion">{{ addressRegion }}</span>
                    <span v-if="(addressCity || addressPostalCode || addressRegion) && addressCountry">, </span>
                    <span v-if="addressCountry">{{ addressCountry }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Fallback: Full Address if breakdown not available -->
              <div v-if="addressFull && !hasAddress" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Address</div>
                  <div class="text-sm text-foreground">{{ addressFull }}</div>
                </div>
                <Button
                  @click="copyToClipboard(addressFull, 'address')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy address"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Metadata Section -->
          <div v-if="externalId || createdDateValue || updatedDateValue || preferredContactMethodDisplay || (contactCustomFields && Object.keys(contactCustomFields).length > 0)" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Metadata</h4>
            <div class="space-y-1.5">
              <!-- Preferred Contact Method -->
              <div v-if="preferredContactMethodDisplay" class="flex items-center gap-2">
                <MessageCircle class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span class="text-xs text-muted-foreground">Preferred Method:</span>
                <span class="text-xs text-foreground font-medium">{{ preferredContactMethodDisplay }}</span>
              </div>
              
              <!-- External ID -->
              <div v-if="externalId" class="flex items-center gap-2 group">
                <Hash class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span class="text-xs text-muted-foreground">External ID:</span>
                <span class="text-xs text-foreground font-mono">{{ externalId }}</span>
                <Button
                  @click="copyToClipboard(externalId, 'External ID')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-5 w-5 ml-auto"
                  title="Copy External ID"
                >
                  <Copy class="w-3 h-3" />
                </Button>
              </div>
              
              <!-- Created Date -->
              <div v-if="createdDateValue" class="flex items-center gap-2">
                <Calendar class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span class="text-xs text-muted-foreground">Created:</span>
                <span class="text-xs text-foreground">{{ formatDate(createdDateValue) }}</span>
              </div>
              
              <!-- Last Updated Date -->
              <div v-if="updatedDateValue" class="flex items-center gap-2">
                <Clock class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span class="text-xs text-muted-foreground">Last Updated:</span>
                <span class="text-xs text-foreground">{{ formatDate(updatedDateValue) }}</span>
              </div>
              
              <!-- Custom Fields -->
              <template v-if="contactCustomFields && Object.keys(contactCustomFields).length > 0">
                <div v-for="(value, key) in contactCustomFields" :key="key" class="flex items-center gap-2">
                  <FileText class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span class="text-xs text-muted-foreground">{{ key }}:</span>
                  <span class="text-xs text-foreground truncate">{{ value }}</span>
                </div>
              </template>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="!hasAnyData" class="text-center py-6 text-muted-foreground">
            <p class="text-xs">No contact details available</p>
          </div>
        </div>
      </template>
    </CardContent>

    <!-- Edit Contact Modal -->
    <ComingSoonModal
      :show="showEditModal"
      title="Edit Contact"
      @close="showEditModal = false"
    />
  </Card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Button, Badge } from '@motork/component-library/future/primitives'
import { 
  Mail, Phone, MapPin, Copy, User, Briefcase, Calendar, 
  Smartphone, MessageCircle, Hash, FileText, Clock, Star 
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'

const props = defineProps({
  // Basic info
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  name: { type: String, default: '' },
  initials: { type: String, default: '' },
  title: { type: String, default: '' },
  salutation: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  // Personal info
  birthDate: { type: String, default: '' },
  gender: { type: String, default: '' },
  placeOfBirth: { type: String, default: '' },
  // Contact methods - can be string or object { primary, secondary, mobile }
  email: { type: [String, Object], default: () => '' },
  secondaryEmail: { type: String, default: '' },
  phone: { type: [String, Object], default: () => '' },
  secondaryPhone: { type: String, default: '' },
  mobilePhone: { type: String, default: '' },
  preferredContactMethod: { type: String, default: '' },
  preferredChannel: { type: String, default: '' },
  // Address - can be string or object { streetLine1, streetLine2, city, postalCode, region, country }
  address: { type: [String, Object], default: () => '' },
  streetAddress1: { type: String, default: '' },
  streetAddress2: { type: String, default: '' },
  city: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  region: { type: String, default: '' },
  country: { type: String, default: '' },
  // Metadata - dates can be createdAt/updatedAt or createdDate/lastUpdatedDate
  contactCustomFields: { type: Object, default: () => ({}) },
  externalId: { type: String, default: '' },
  createdAt: { type: String, default: '' },
  createdDate: { type: String, default: '' },
  updatedAt: { type: String, default: '' },
  lastUpdatedDate: { type: String, default: '' },
  lastActivityDate: { type: String, default: '' },
  // Account relationship
  isMasterContact: { type: Boolean, default: false },
  accountName: { type: String, default: '' },
  // Loading
  loading: { type: Boolean, default: false }
})

const toastStore = useToastStore()
const showEditModal = ref(false)

const displayName = computed(() => {
  if (props.firstName || props.lastName) {
    return `${props.firstName || ''} ${props.lastName || ''}`.trim()
  }
  return props.name || ''
})

// Extract email values - support both object { primary, secondary } and string
const primaryEmail = computed(() => {
  if (typeof props.email === 'object' && props.email !== null) {
    return props.email.primary || ''
  }
  return props.email || ''
})

const secondaryEmailValue = computed(() => {
  if (typeof props.email === 'object' && props.email !== null) {
    return props.email.secondary || ''
  }
  return props.secondaryEmail || ''
})

// Extract phone values - support both object { primary, secondary, mobile } and string
const primaryPhone = computed(() => {
  if (typeof props.phone === 'object' && props.phone !== null) {
    return props.phone.primary || ''
  }
  return props.phone || ''
})

const secondaryPhoneValue = computed(() => {
  if (typeof props.phone === 'object' && props.phone !== null) {
    return props.phone.secondary || ''
  }
  return props.secondaryPhone || ''
})

const mobilePhoneValue = computed(() => {
  if (typeof props.phone === 'object' && props.phone !== null) {
    return props.phone.mobile || ''
  }
  return props.mobilePhone || ''
})

// Extract address values - support both object and flat fields
const addressStreetLine1 = computed(() => {
  if (typeof props.address === 'object' && props.address !== null) {
    return props.address.streetLine1 || ''
  }
  return props.streetAddress1 || props.streetAddress || ''
})

const addressStreetLine2 = computed(() => {
  if (typeof props.address === 'object' && props.address !== null) {
    return props.address.streetLine2 || ''
  }
  return props.streetAddress2 || ''
})

const addressCity = computed(() => {
  if (typeof props.address === 'object' && props.address !== null) {
    return props.address.city || ''
  }
  return props.city || ''
})

const addressPostalCode = computed(() => {
  if (typeof props.address === 'object' && props.address !== null) {
    return props.address.postalCode || ''
  }
  return props.postalCode || props.zipCode || ''
})

const addressRegion = computed(() => {
  if (typeof props.address === 'object' && props.address !== null) {
    return props.address.region || ''
  }
  return props.region || props.state || props.county || ''
})

const addressCountry = computed(() => {
  if (typeof props.address === 'object' && props.address !== null) {
    return props.address.country || ''
  }
  return props.country || ''
})

const addressFull = computed(() => {
  if (typeof props.address === 'string') {
    return props.address
  }
  return ''
})

const hasAddress = computed(() => {
  return !!(addressStreetLine1.value || addressCity.value || addressPostalCode.value || addressRegion.value || addressCountry.value)
})

// Extract date values - support both createdAt/updatedAt and createdDate/lastUpdatedDate
const createdDateValue = computed(() => {
  return props.createdAt || props.createdDate || ''
})

const updatedDateValue = computed(() => {
  return props.updatedAt || props.lastUpdatedDate || ''
})

const hasAnyData = computed(() => {
  return !!(props.title || props.jobTitle || primaryEmail.value || secondaryEmailValue.value || 
    primaryPhone.value || secondaryPhoneValue.value || mobilePhoneValue.value || 
    preferredContactMethodDisplay.value || hasAddress.value || addressFull.value ||
    props.birthDate || props.gender || props.placeOfBirth ||
    props.externalId || createdDateValue.value || updatedDateValue.value || 
    (props.contactCustomFields && Object.keys(props.contactCustomFields).length > 0))
})

const preferredContactMethodDisplay = computed(() => {
  return props.preferredContactMethod || props.preferredChannel || ''
})

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (e) {
    return dateString
  }
}

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    const fieldName = field === 'email' ? 'Email' : field === 'phone' ? 'Phone' : field === 'address' ? 'Address' : field
    toastStore.pushToast('success', `${fieldName} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}
</script>
