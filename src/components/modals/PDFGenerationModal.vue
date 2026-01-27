<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-2xl max-h-[calc(100vh-4rem)] flex flex-col p-0">
        <DialogHeader class="flex-shrink-0 p-6 pb-4 border-b border">
          <DialogTitle>{{ documentType === 'contract' ? 'Generate Contract PDF' : 'Generate Offer PDF' }}</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto p-6 w-full space-y-6">
          <!-- Document Type Selection (if not pre-selected) -->
          <div v-if="!preSelectedDocumentType">
            <Label class="text-sm font-semibold text-foreground mb-3 block">Document Type</Label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  documentType === 'contract'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                ]"
                @click="documentType = 'contract'"
              >
                <div class="font-semibold text-sm text-foreground mb-1">Contract</div>
                <div class="text-xs text-muted-foreground">Formal contract with signature area</div>
              </button>
              <button
                type="button"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  documentType === 'offer'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                ]"
                @click="documentType = 'offer'"
              >
                <div class="font-semibold text-sm text-foreground mb-1">Offer</div>
                <div class="text-xs text-muted-foreground">Purchase proposal for customer</div>
              </button>
            </div>
          </div>

          <!-- Offer Selection (if document type is offer) -->
          <div v-if="documentType === 'offer' && availableOffers && availableOffers.length > 0">
            <Label class="text-sm font-semibold text-foreground mb-3 block">Select Offer</Label>
            <Select v-model="selectedOfferId">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select an offer..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="offer in availableOffers"
                  :key="offer.id"
                  :value="offer.id"
                >
                  {{ getOfferLabel(offer) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Template Selection -->
          <div>
            <Label class="text-sm font-semibold text-foreground mb-3 block">Template Style</Label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  options.template === 'classic'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                ]"
                @click="options.template = 'classic'"
              >
                <div class="font-semibold text-sm text-foreground mb-1">Classic</div>
                <div class="text-xs text-muted-foreground">
                  {{ documentType === 'contract' 
                    ? 'Detailed with comprehensive information and legal sections' 
                    : 'Includes VAT table, trade-in section, and vehicle images' }}
                </div>
              </button>
              <button
                type="button"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  options.template === 'express'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                ]"
                @click="options.template = 'express'"
              >
                <div class="font-semibold text-sm text-foreground mb-1">Express</div>
                <div class="text-xs text-muted-foreground">
                  {{ documentType === 'contract' 
                    ? 'Streamlined with essential information' 
                    : 'Simplified condensed layout for stock vehicles' }}
                </div>
              </button>
            </div>
          </div>

          <!-- Language Selection -->
          <div>
            <Label class="text-sm font-semibold text-foreground mb-3 block">Language</Label>
            <Select v-model="options.language">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="nl">Nederlands</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Customization Options -->
          <div class="space-y-4">
            <Label class="text-sm font-semibold text-foreground block">Options</Label>
            
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                :id="'terms-' + _uid"
                v-model="options.includeTermsAndConditions"
                class="mt-1"
              />
              <label :for="'terms-' + _uid" class="text-sm text-foreground cursor-pointer">
                Include Terms & Conditions
              </label>
            </div>

            <div 
              v-if="documentType === 'contract'"
              class="flex items-start gap-3"
            >
              <input
                type="checkbox"
                :id="'disclaimer-' + _uid"
                v-model="options.includeDisclaimerPage"
                class="mt-1"
              />
              <label :for="'disclaimer-' + _uid" class="text-sm text-foreground cursor-pointer">
                Include Disclaimer Page (last page)
              </label>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 p-6 pt-4 bg-muted flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 border-t border">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            :disabled="isGenerating || isPreviewing"
            @click="$emit('close')"
          />
          <Button
            label="Preview"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            :disabled="!isValid || isGenerating || isPreviewing"
            @click="handlePreview"
          />
          <Button
            label="Generate PDF"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!isValid || isGenerating || isPreviewing"
            @click="handleGenerate"
          >
            <template v-if="isGenerating">
              <i class="fa-solid fa-spinner fa-spin mr-2"></i>
              Generating...
            </template>
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Button, Label } from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@motork/component-library/future/primitives'
import { useContractPDF } from '@/composables/useContractPDF'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  opportunityId: {
    type: [String, Number],
    required: true
  },
  documentType: {
    type: String,
    default: null, // 'contract' | 'offer' | null (user selects)
    validator: (value) => !value || ['contract', 'offer'].includes(value)
  },
  offerId: {
    type: [String, Number],
    default: null
  },
  availableOffers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'generate', 'preview'])

const {
  isGenerating,
  isPreviewing,
  error: pdfError,
  getDefaultOptions,
  ensureTemplatesLoaded
} = useContractPDF()

const preSelectedDocumentType = computed(() => props.documentType !== null)
const documentType = ref(props.documentType || 'contract')
const selectedOfferId = ref(props.offerId)
const options = ref({
  template: 'classic',
  language: 'en',
  includeTermsAndConditions: true,
  includeDisclaimerPage: true
})

const error = computed(() => pdfError.value)

// Initialize with defaults
onMounted(async () => {
  await ensureTemplatesLoaded()
  const defaults = getDefaultOptions()
  options.value = {
    ...defaults,
    ...options.value
  }
})

// Watch for document type changes
watch(() => props.documentType, (newType) => {
  if (newType) {
    documentType.value = newType
  }
})

// Watch for offer ID changes
watch(() => props.offerId, (newId) => {
  if (newId) {
    selectedOfferId.value = newId
  }
})

const isValid = computed(() => {
  if (documentType.value === 'offer') {
    return selectedOfferId.value !== null && selectedOfferId.value !== undefined
  }
  return true
})

const getOfferLabel = (offer) => {
  if (offer.data) {
    const data = offer.data
    return `${data.brand || ''} ${data.model || ''} (${data.year || ''}) - €${(data.price || 0).toLocaleString()}`
  }
  if (offer.vehicleBrand) {
    return `${offer.vehicleBrand} ${offer.vehicleModel} (${offer.vehicleYear}) - €${(offer.price || 0).toLocaleString()}`
  }
  return `Offer #${offer.id}`
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleGenerate = async () => {
  if (!isValid.value) return

  try {
    const finalOptions = {
      ...options.value,
      includeDisclaimerPage: documentType.value === 'contract' ? options.value.includeDisclaimerPage : false
    }

    if (documentType.value === 'contract') {
      emit('generate', {
        type: 'contract',
        opportunityId: props.opportunityId,
        options: finalOptions
      })
    } else {
      if (!selectedOfferId.value) {
        error.value = 'Please select an offer'
        return
      }
      emit('generate', {
        type: 'offer',
        opportunityId: props.opportunityId,
        offerId: selectedOfferId.value,
        options: finalOptions
      })
    }
  } catch (err) {
    console.error('Error generating PDF:', err)
  }
}

const handlePreview = async () => {
  if (!isValid.value) return

  try {
    const finalOptions = {
      ...options.value,
      includeDisclaimerPage: documentType.value === 'contract' ? options.value.includeDisclaimerPage : false
    }

    if (documentType.value === 'contract') {
      emit('preview', {
        type: 'contract',
        opportunityId: props.opportunityId,
        options: finalOptions
      })
    } else {
      if (!selectedOfferId.value) {
        error.value = 'Please select an offer'
        return
      }
      emit('preview', {
        type: 'offer',
        opportunityId: props.opportunityId,
        offerId: selectedOfferId.value,
        options: finalOptions
      })
    }
  } catch (err) {
    console.error('Error previewing PDF:', err)
  }
}
</script>
