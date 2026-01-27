<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-2xl max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>{{ isEditMode ? 'Edit Purchase Method' : 'Add Purchase Method' }}</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-6">
          <!-- Type Selector (Radio buttons styled as tabs) -->
          <div>
            <label class="block label-upper mb-3">Purchase Method Type</label>
            <div class="flex gap-2">
              <label
                v-for="typeOption in typeOptions"
                :key="typeOption.value"
                class="flex-1 cursor-pointer"
              >
                <input
                  type="radio"
                  :value="typeOption.value"
                  v-model="formData.type"
                  class="sr-only"
                  @change="handleTypeChange"
                />
                <div
                  class="px-4 py-3 rounded-btn border-2 text-center text-sm font-medium transition-colors"
                  :class="formData.type === typeOption.value
                    ? 'border-brand-red bg-brand-red/5 text-brand-red'
                    : 'border-D1D5DB bg-white text-muted-foreground hover:border-brand-slate'"
                >
                  {{ typeOption.label }}
                </div>
              </label>
            </div>
          </div>

          <!-- Dynamic Form Based on Type -->
          <div v-if="formData.type" class="space-y-4">
            <!-- Section Header -->
            <h3 class="text-h3-card text-foreground mb-4">
              {{ getTypeLabel(formData.type) }} Details
            </h3>

            <!-- Common Fields: Monthly Instalment and Down Payment -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">
                  Monthly Instalment <span class="text-brand-red">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <input
                    v-model.number="formData.fields.monthlyInstalment"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="input pl-8"
                    :class="{ 'border-red-500': errors.monthlyInstalment }"
                    @input="clearError('monthlyInstalment')"
                    @blur="validateField('monthlyInstalment')"
                  />
                </div>
                <p v-if="errors.monthlyInstalment" class="text-xs text-red-600 mt-1">
                  {{ errors.monthlyInstalment }}
                </p>
                <p class="text-xs text-muted-foreground mt-1">Customer's desired monthly payment amount</p>
              </div>

              <div>
                <label class="block label-upper mb-2">
                  Down Payment <span class="text-brand-red">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <input
                    v-model.number="formData.fields.downPayment"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="input pl-8"
                    :class="{ 'border-red-500': errors.downPayment }"
                    @input="clearError('downPayment')"
                    @blur="validateField('downPayment')"
                  />
                </div>
                <p v-if="errors.downPayment" class="text-xs text-red-600 mt-1">
                  {{ errors.downPayment }}
                </p>
                <p class="text-xs text-muted-foreground mt-1">Amount at contract signing</p>
              </div>
            </div>

            <!-- LTR-specific: Duration and Unlock Kilometers -->
            <template v-if="formData.type === 'LTR'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">
                  Duration (months) <span class="text-brand-red">*</span>
                </label>
                <Select
                  v-model="formData.fields.duration"
                  @update:model-value="clearError('duration')"
                >
                  <SelectTrigger class="w-full h-10 min-h-10" :class="{ 'border-red-500': errors.duration }">
                    <SelectValue placeholder="Select duration..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="month in getDurationOptions(formData.type)"
                      :key="month"
                      :value="month"
                    >
                      {{ month }} months
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p v-if="errors.duration" class="text-xs text-red-600 mt-1">
                  {{ errors.duration }}
                </p>
              </div>

                <div class="space-y-2">
                  <Label class="block text-sm font-semibold text-foreground">Unlock Kilometers</Label>
                  <Input
                    v-model.number="formData.fields.mileageLimit"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full h-10"
                    :class="{ 'border-red-500': errors.mileageLimit }"
                    @input="clearError('mileageLimit')"
                  />
                  <p v-if="errors.mileageLimit" class="text-xs text-red-600 mt-1">
                    {{ errors.mileageLimit }}
                  </p>
                </div>
              </div>
            </template>

            <!-- FIN and LEA: Only Monthly Instalment and Down Payment (no additional fields) -->
            <!-- LTR-specific Fields -->
            <template v-if="formData.type === 'LTR'">
              <div>
                <label class="block label-upper mb-2">
                  Customer Type <span class="text-brand-red">*</span>
                </label>
                <Select
                  v-model="formData.fields.customerType"
                  @update:model-value="clearError('customerType')"
                >
                  <SelectTrigger class="w-full h-10 min-h-10" :class="{ 'border-red-500': errors.customerType }">
                    <SelectValue placeholder="Select customer type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Fleet">Fleet</SelectItem>
                  </SelectContent>
                </Select>
                <p v-if="errors.customerType" class="text-xs text-red-600 mt-1">
                  {{ errors.customerType }}
                </p>
              </div>

              <!-- Calculated Total Rental Amount -->
              <div class="bg-muted p-4 rounded-lg border border-border">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Total Rental Amount:</span>
                  <span class="text-lg font-bold text-foreground">€ {{ formatCurrency(totalRentalAmount) }}</span>
                </div>
                <p class="text-xs text-muted-foreground mt-1">
                  (Monthly × Duration + Down Payment)
                </p>
              </div>

              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                  <Checkbox
                    id="ltr-insurance"
                    v-model:checked="formData.fields.insuranceIncluded"
                  />
                  <Label for="ltr-insurance" class="text-sm text-muted-foreground cursor-pointer">
                    Insurance Included
                  </Label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    id="ltr-maintenance"
                    v-model:checked="formData.fields.maintenanceIncluded"
                  />
                  <Label for="ltr-maintenance" class="text-sm text-muted-foreground cursor-pointer">
                    Maintenance Included
                  </Label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    id="ltr-registration"
                    v-model:checked="formData.fields.registrationTaxesIncluded"
                  />
                  <Label for="ltr-registration" class="text-sm text-muted-foreground cursor-pointer">
                    Registration/Taxes Included
                  </Label>
                </div>
              </div>
            </template>

            <!-- Optional: Offer Validity Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Offer Valid From</Label>
                <Input
                  v-model="formData.offerValidFrom"
                  type="date"
                  class="w-full h-10"
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Offer Valid To</Label>
                <Input
                  v-model="formData.offerValidTo"
                  type="date"
                  class="w-full h-10"
                />
              </div>
            </div>
          </div>

          <!-- Validation Errors Summary -->
          <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
            <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            :label="isEditMode ? 'Update Purchase Method' : 'Save Purchase Method'"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!isFormValid || saving"
            @click="handleSubmit"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>{{ isEditMode ? 'Update' : 'Save' }}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { 
  Button,
  Input,
  Label,
  Checkbox,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import { usePurchaseMethodsStore } from '@/stores/purchaseMethods'
import { purchaseMethodService } from '@/services/purchaseMethodService'
import { formatCurrency } from '@/utils/formatters'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  taskType: {
    type: String,
    default: 'lead',
    validator: (value) => ['lead', 'opportunity'].includes(value)
  },
  taskId: {
    type: [String, Number],
    required: true
  },
  purchaseMethod: {
    type: Object,
    default: null
  },
  vehicleId: {
    type: [String, Number],
    default: null
  },
  offerId: {
    type: [String, Number],
    default: null
  },
  vehiclePrice: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const purchaseMethodsStore = usePurchaseMethodsStore()
const userStore = useUserStore()

const saving = ref(false)
const errors = ref({})
const validationErrors = ref([])

const typeOptions = [
  { value: 'FIN', label: 'FIN' },
  { value: 'LEA', label: 'LEA' },
  { value: 'LTR', label: 'LTR' }
]

const formData = ref({
  type: '',
  fields: {
    monthlyInstalment: null,
    downPayment: null,
    duration: null,
    interestRate: null,
    effectiveInterestRate: null,
    gfv: null,
    mileageLimit: null,
    finalInstalment: null,
    customerType: '',
    insuranceIncluded: false,
    maintenanceIncluded: false,
    registrationTaxesIncluded: false
  },
  currency: 'EUR',
  offerValidFrom: null,
  offerValidTo: null
})

const isEditMode = computed(() => !!props.purchaseMethod)

// Computed calculated fields
const totalLeasingAmount = computed(() => {
  if (formData.value.type !== 'LEA') return 0
  const monthly = parseFloat(formData.value.fields.monthlyInstalment) || 0
  const duration = parseInt(formData.value.fields.duration) || 0
  const downPayment = parseFloat(formData.value.fields.downPayment) || 0
  const finalInstalment = parseFloat(formData.value.fields.finalInstalment) || 0
  return (monthly * duration) + downPayment + finalInstalment
})

const totalRentalAmount = computed(() => {
  if (formData.value.type !== 'LTR') return 0
  const monthly = parseFloat(formData.value.fields.monthlyInstalment) || 0
  const duration = parseInt(formData.value.fields.duration) || 0
  const downPayment = parseFloat(formData.value.fields.downPayment) || 0
  return (monthly * duration) + downPayment
})

// Get duration options based on type
const getDurationOptions = (type) => {
  if (type === 'FIN') return [12, 24, 36, 48, 60]
  if (type === 'LEA') return [24, 36, 48, 60]
  if (type === 'LTR') return [12, 24, 36, 48, 60]
  return []
}

const getTypeLabel = (type) => {
  const labels = {
    FIN: 'Captive Financing',
    LEA: 'Leasing',
    LTR: 'Long-Term Rental'
  }
  return labels[type] || type
}

// Validation
const validateField = (fieldName) => {
  const value = formData.value.fields[fieldName]
  
  switch (fieldName) {
    case 'monthlyInstalment':
      if (!value || value <= 0) {
        errors.value.monthlyInstalment = 'Monthly Instalment must be greater than 0'
      } else {
        delete errors.value.monthlyInstalment
      }
      break
    case 'downPayment':
      if (value === null || value === undefined || value < 0) {
        errors.value.downPayment = 'Down Payment must be greater than or equal to 0'
      } else {
        delete errors.value.downPayment
      }
      break
    case 'duration':
      // Duration is only required for LTR
      if (formData.value.type === 'LTR' && (!value || value < 12 || value > 60)) {
        errors.value.duration = 'Duration must be between 12 and 60 months'
      } else {
        delete errors.value.duration
      }
      break
    case 'customerType':
      if (formData.value.type === 'LTR' && (!value || !['Private', 'Business', 'Fleet'].includes(value))) {
        errors.value.customerType = 'Customer Type is required'
      } else {
        delete errors.value.customerType
      }
      break
  }
}

const clearError = (fieldName) => {
  delete errors.value[fieldName]
}

const validateForm = () => {
  validationErrors.value = []
  errors.value = {}
  
  const validation = purchaseMethodService.validate({
    type: formData.value.type,
    fields: formData.value.fields
  })
  
  if (!validation.isValid) {
    validationErrors.value = validation.errors
    // Map errors to field-specific errors for display
    validation.errors.forEach(error => {
      if (error.includes('Monthly Instalment')) {
        errors.value.monthlyInstalment = error
      } else if (error.includes('Down Payment')) {
        errors.value.downPayment = error
      } else if (error.includes('Duration')) {
        errors.value.duration = error
      } else if (error.includes('Customer Type')) {
        errors.value.customerType = error
      }
    })
  }
  
  return validation.isValid
}

const isFormValid = computed(() => {
  if (!formData.value.type) return false
  if (!formData.value.fields.monthlyInstalment || formData.value.fields.monthlyInstalment <= 0) return false
  if (formData.value.fields.downPayment === null || formData.value.fields.downPayment === undefined || formData.value.fields.downPayment < 0) return false
  // Duration is only required for LTR
  if (formData.value.type === 'LTR' && (!formData.value.fields.duration || formData.value.fields.duration < 12 || formData.value.fields.duration > 60)) return false
  if (formData.value.type === 'LTR' && !formData.value.fields.customerType) return false
  return Object.keys(errors.value).length === 0
})

const handleTypeChange = () => {
  // Reset type-specific fields when type changes
  if (formData.value.type !== 'FIN') {
    formData.value.fields.effectiveInterestRate = null
    formData.value.fields.gfv = null
  }
  if (formData.value.type !== 'LEA') {
    formData.value.fields.finalInstalment = null
  }
  if (formData.value.type !== 'LTR') {
    formData.value.fields.customerType = ''
    formData.value.fields.registrationTaxesIncluded = false
  }
  if (formData.value.type !== 'LEA' && formData.value.type !== 'LTR') {
    formData.value.fields.mileageLimit = null
    formData.value.fields.maintenanceIncluded = false
  }
  errors.value = {}
  validationErrors.value = []
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  
  try {
    const purchaseMethodData = {
      type: formData.value.type,
      fields: { ...formData.value.fields },
      currency: formData.value.currency,
      offerValidFrom: formData.value.offerValidFrom || null,
      offerValidTo: formData.value.offerValidTo || null,
      createdBy: userStore.currentUser?.id || null
    }
    
    // Add associations
    if (props.taskType === 'lead') {
      purchaseMethodData.leadId = parseInt(props.taskId)
    } else if (props.taskType === 'opportunity') {
      purchaseMethodData.opportunityId = parseInt(props.taskId)
    }
    
    if (props.vehicleId) {
      purchaseMethodData.vehicleId = parseInt(props.vehicleId)
    }
    
    if (props.offerId) {
      purchaseMethodData.offerId = parseInt(props.offerId)
    }
    
    let result
    if (isEditMode.value) {
      result = await purchaseMethodsStore.updatePurchaseMethod(props.purchaseMethod.id, purchaseMethodData)
    } else {
      result = await purchaseMethodsStore.createPurchaseMethod(purchaseMethodData)
    }
    
    // Emit success event with formatted message
    const typeLabel = getTypeLabel(result.type)
    const monthly = formatCurrency(result.fields.monthlyInstalment || 0)
    emit('save', {
      ...result,
      successMessage: `Purchase Method Added: ${typeLabel} - €${monthly}/month`
    })
    emit('close')
  } catch (error) {
    validationErrors.value = [error.message || 'Failed to save purchase method']
  } finally {
    saving.value = false
  }
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

// Load existing purchase method data if editing
onMounted(() => {
  if (props.purchaseMethod) {
    formData.value = {
      type: props.purchaseMethod.type || '',
      fields: {
        ...formData.value.fields,
        ...props.purchaseMethod.fields
      },
      currency: props.purchaseMethod.currency || 'EUR',
      offerValidFrom: props.purchaseMethod.offerValidFrom || null,
      offerValidTo: props.purchaseMethod.offerValidTo || null
    }
  }
})

// Reset form when modal closes
watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    // Reset form after a short delay to allow close animation
    setTimeout(() => {
      formData.value = {
        type: '',
        fields: {
          monthlyInstalment: null,
          downPayment: null,
          duration: null,
          interestRate: null,
          effectiveInterestRate: null,
          gfv: null,
          mileageLimit: null,
          finalInstalment: null,
          customerType: '',
          insuranceIncluded: false,
          maintenanceIncluded: false,
          registrationTaxesIncluded: false
        },
        currency: 'EUR',
        offerValidFrom: null,
        offerValidTo: null
      }
      errors.value = {}
      validationErrors.value = []
      saving.value = false
    }, 300)
  } else if (props.purchaseMethod) {
    // Load purchase method data when opening for edit
    formData.value = {
      type: props.purchaseMethod.type || '',
      fields: {
        ...formData.value.fields,
        ...props.purchaseMethod.fields
      },
      currency: props.purchaseMethod.currency || 'EUR',
      offerValidFrom: props.purchaseMethod.offerValidFrom || null,
      offerValidTo: props.purchaseMethod.offerValidTo || null
    }
  }
})
</script>

<style scoped>
/* label-upper and .input classes are defined globally in style.css */
/* No need to redefine them here */
</style>
