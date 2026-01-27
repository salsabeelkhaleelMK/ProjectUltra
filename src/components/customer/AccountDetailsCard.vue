<template>
  <Card v-if="accountData || loading" class="h-full">
    <CardHeader>
      <CardTitle class="text-sm font-semibold leading-5">Account Details</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-muted rounded w-3/4"></div>
          <div class="h-4 bg-muted rounded w-2/3"></div>
          <div class="h-4 bg-muted rounded w-4/5"></div>
          <div class="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </template>
      
      <!-- Content -->
      <template v-else-if="accountData">
        <div class="space-y-3">
          <!-- Company Name -->
          <div v-if="accountData.name || accountData.companyName" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <Building2 class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Company Name</div>
              <div class="text-sm font-medium text-foreground">{{ accountData.name || accountData.companyName }}</div>
            </div>
            <Badge v-if="accountData.type" variant="outline" class="text-xs">
              {{ accountData.type }}
            </Badge>
          </div>
          
          <!-- Account Type -->
          <div v-if="accountData.type" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <FileText class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Account Type</div>
              <div class="text-sm text-foreground">{{ accountData.type === 'Company' ? 'Company Account' : 'Private Account' }}</div>
            </div>
          </div>
          
          <!-- VAT Number -->
          <div v-if="accountData.vat || accountData.vatNumber" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <FileText class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">VAT Number</div>
              <div class="text-sm text-foreground">{{ accountData.vat || accountData.vatNumber }}</div>
            </div>
            <Button
              @click="copyToClipboard(accountData.vat || accountData.vatNumber, 'VAT')"
              variant="ghost"
              size="icon"
              class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              title="Copy VAT"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Tax Code / Fiscal Code -->
          <div v-if="accountData.taxCode || accountData.fiscalCode" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <FileText class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Tax Code</div>
              <div class="text-sm text-foreground">{{ accountData.taxCode || accountData.fiscalCode }}</div>
            </div>
            <Button
              @click="copyToClipboard(accountData.taxCode || accountData.fiscalCode, 'Tax Code')"
              variant="ghost"
              size="icon"
              class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              title="Copy Tax Code"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Account Owner -->
          <div v-if="accountData.accountOwner || accountData.owner" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <User class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Account Owner</div>
              <div class="text-sm text-foreground">
                {{ getOwnerName(accountData.accountOwner || accountData.owner) }}
              </div>
            </div>
          </div>
          
          <!-- Number of Employees (Company only) -->
          <div v-if="accountData.type === 'Company' && accountData.numberOfEmployees" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <Users class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Employees</div>
              <div class="text-sm text-foreground">{{ accountData.numberOfEmployees }}</div>
            </div>
          </div>
          
          <!-- Account Description/Notes -->
          <div v-if="accountData.description || accountData.notes" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <FileText class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-muted-foreground mb-0.5">Description</div>
              <div class="text-sm text-foreground whitespace-pre-line">{{ accountData.description || accountData.notes }}</div>
            </div>
          </div>
          
          <!-- Master Contact Indicator (if current contact is master) -->
          <div v-if="isMasterContact" class="flex items-center gap-3 p-3 bg-primary/10 rounded-md border border-primary/20">
            <Star class="w-4 h-4 text-primary" />
            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-primary mb-0.5">Master Contact</div>
              <div class="text-sm text-foreground">You are the primary contact for this account</div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="!accountData.name && !accountData.companyName && !accountData.vat && !accountData.taxCode" class="text-center py-6 text-muted-foreground">
            <p class="text-xs">No account details available</p>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Button, Badge } from '@motork/component-library/future/primitives'
import { Building2, FileText, User, Users, Copy, Star } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  accountData: {
    type: Object,
    default: null
  },
  currentContactId: {
    type: [Number, String],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const toastStore = useToastStore()

const isMasterContact = computed(() => {
  if (!props.accountData || !props.currentContactId) return false
  const masterId = props.accountData.masterContactId || props.accountData.masterContact?.id
  return masterId && String(masterId) === String(props.currentContactId)
})

const getOwnerName = (owner) => {
  if (!owner) return 'Not assigned'
  if (typeof owner === 'string') return owner
  if (owner.name) return owner.name
  if (owner.firstName && owner.lastName) return `${owner.firstName} ${owner.lastName}`
  return 'Unknown'
}

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    toastStore.pushToast('success', `${field} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}
</script>
