<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ isEditMode ? 'Edit Purchase Method' : 'Add Purchase Method' }}</DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Update purchase method details' : 'Select purchase method type and fill in the details' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-6">
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
                    : 'border-D1D5DB bg-white text-body hover:border-brand-slate'"
                >
                  {{ typeOption.label }}
                </div>
              </label>
            </div>
          </div>

          <!-- Dynamic Form Based on Type -->
          <div v-if="formData.type" class="space-y-4">
            <!-- Section Header -->
            <h3 class="text-h3-card text-heading mb-4">
              {{ getTypeLabel(formData.type) }} Details
            </h3>

            <!-- Common Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">
                  Monthly Instalment <span class="text-brand-red">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-body">€</span>
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
              </div>

              <div>
                <label class="block label-upper mb-2">
                  Down Payment <span class="text-brand-red">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-body">€</span>
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
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">
                  Duration (months) <span class="text-brand-red">*</span>
                </label>
                <select
                  v-model.number="formData.fields.duration"
                  class="input"
                  :class="{ 'border-red-500': errors.duration }"
                  @change="clearError('duration')"
                >
                  <option value="">Select duration...</option>
                  <option
                    v-for="month in getDurationOptions(formData.type)"
                    :key="month"
                    :value="month"
                  >
                    {{ month }} months
                  </option>
                </select>
                <p v-if="errors.duration" class="text-xs text-red-600 mt-1">
                  {{ errors.duration }}
                </p>
              </div>

              <!-- FIN-specific: Interest Rate -->
              <div v-if="formData.type === 'FIN'">
                <label class="block label-upper mb-2">Interest Rate / APR (%)</label>
                <div class="relative">
                  <input
                    v-model.number="formData.fields.interestRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="99.99"
                    placeholder="0.00"
                    class="input pr-8"
                    :class="{ 'border-red-500': errors.interestRate }"
                    @input="clearError('interestRate')"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-body">%</span>
                </div>
                <p v-if="errors.interestRate" class="text-xs text-red-600 mt-1">
                  {{ errors.interestRate }}
                </p>
              </div>

              <!-- LEA/LTR: Mileage Limit -->
              <div v-if="formData.type === 'LEA' || formData.type === 'LTR'">
                <label class="block label-upper mb-2">Mileage Limit (annual km)</label>
                <input
                  v-model.number="formData.fields.mileageLimit"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="input"
                  :class="{ 'border-red-500': errors.mileageLimit }"
                  @input="clearError('mileageLimit')"
                />
                <p v-if="errors.mileageLimit" class="text-xs text-red-600 mt-1">
                  {{ errors.mileageLimit }}
                </p>
              </div>
            </div>

            <!-- FIN-specific Fields -->
            <template v-if="formData.type === 'FIN'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block label-upper mb-2">Effective Interest Rate / TAEG (%)</label>
                  <div class="relative">
                    <input
                      v-model.number="formData.fields.effectiveInterestRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="99.99"
                      placeholder="0.00"
                      class="input pr-8"
                      :class="{ 'border-red-500': errors.effectiveInterestRate }"
                      @input="clearError('effectiveInterestRate')"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-body">%</span>
                  </div>
                  <p v-if="errors.effectiveInterestRate" class="text-xs text-red-600 mt-1">
                    {{ errors.effectiveInterestRate }}
                  </p>
                </div>

                <div>
                  <label class="block label-upper mb-2">Guaranteed Future Value / GFV (€)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-body">€</span>
                    <input
                      v-model.number="formData.fields.gfv"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      class="input pl-8"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fin-insurance"
                  v-model="formData.fields.insuranceIncluded"
                  class="w-4 h-4 rounded border-D1D5DB"
                />
                <label for="fin-insurance" class="text-sm text-body cursor-pointer">
                  Insurance Included
                </label>
              </div>
            </template>

            <!-- LEA-specific Fields -->
            <template v-if="formData.type === 'LEA'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block label-upper mb-2">Interest Rate / APR (%)</label>
                  <div class="relative">
                    <input
                      v-model.number="formData.fields.interestRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="99.99"
                      placeholder="0.00"
                      class="input pr-8"
                      :class="{ 'border-red-500': errors.interestRate }"
                      @input="clearError('interestRate')"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-body">%</span>
                  </div>
                  <p v-if="errors.interestRate" class="text-xs text-red-600 mt-1">
                    {{ errors.interestRate }}
                  </p>
                </div>

                <div>
                  <label class="block label-upper mb-2">Final Instalment (€)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-body">€</span>
                    <input
                      v-model.number="formData.fields.finalInstalment"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      class="input pl-8"
                      :class="{ 'border-red-500': errors.finalInstalment }"
                      @input="clearError('finalInstalment')"
                    />
                  </div>
                  <p v-if="errors.finalInstalment" class="text-xs text-red-600 mt-1">
                    {{ errors.finalInstalment }}
                  </p>
                </div>
              </div>

              <!-- Calculated Total Leasing Amount -->
              <div class="bg-surfaceSecondary p-4 rounded-card border border-E5E7EB">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-body">Total Leasing Amount:</span>
                  <span class="text-lg font-bold text-heading">€ {{ formatCurrency(totalLeasingAmount) }}</span>
                </div>
                <p class="text-xs text-sub mt-1">
                  (Monthly × Duration + Down Payment + Final Instalment)
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lea-insurance"
                    v-model="formData.fields.insuranceIncluded"
                    class="w-4 h-4 rounded border-D1D5DB"
                  />
                  <label for="lea-insurance" class="text-sm text-body cursor-pointer">
                    Insurance Included
                  </label>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lea-maintenance"
                    v-model="formData.fields.maintenanceIncluded"
                    class="w-4 h-4 rounded border-D1D5DB"
                  />
                  <label for="lea-maintenance" class="text-sm text-body cursor-pointer">
                    Maintenance Included
                  </label>
                </div>
              </div>
            </template>

            <!-- LTR-specific Fields -->
            <template v-if="formData.type === 'LTR'">
              <div>
                <label class="block label-upper mb-2">
                  Customer Type <span class="text-brand-red">*</span>
                </label>
                <select
                  v-model="formData.fields.customerType"
                  class="input"
                  :class="{ 'border-red-500': errors.customerType }"
                  @change="clearError('customerType')"
                >
                  <option value="">Select customer type...</option>
                  <option value="Private">Private</option>
                  <option value="Business">Business</option>
                  <option value="Fleet">Fleet</option>
                </select>
                <p v-if="errors.customerType" class="text-xs text-red-600 mt-1">
                  {{ errors.customerType }}
                </p>
              </div>

              <!-- Calculated Total Rental Amount -->
              <div class="bg-surfaceSecondary p-4 rounded-card border border-E5E7EB">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-body">Total Rental Amount:</span>
                  <span class="text-lg font-bold text-heading">€ {{ formatCurrency(totalRentalAmount) }}</span>
                </div>
                <p class="text-xs text-sub mt-1">
                  (Monthly × Duration + Down Payment)
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ltr-insurance"
                    v-model="formData.fields.insuranceIncluded"
                    class="w-4 h-4 rounded border-D1D5DB"
                  />
                  <label for="ltr-insurance" class="text-sm text-body cursor-pointer">
                    Insurance Included
                  </label>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ltr-maintenance"
                    v-model="formData.fields.maintenanceIncluded"
                    class="w-4 h-4 rounded border-D1D5DB"
                  />
                  <label for="ltr-maintenance" class="text-sm text-body cursor-pointer">
                    Maintenance Included
                  </label>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ltr-registration"
                    v-model="formData.fields.registrationTaxesIncluded"
                    class="w-4 h-4 rounded border-D1D5DB"
                  />
                  <label for="ltr-registration" class="text-sm text-body cursor-pointer">
                    Registration/Taxes Included
                  </label>
                </div>
              </div>
            </template>

            <!-- Optional: Offer Validity Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-E5E7EB">
              <div>
                <label class="block label-upper mb-2">Offer Valid From</label>
                <input
                  v-model="formData.offerValidFrom"
                  type="date"
                  class="input"
                />
              </div>
              <div>
                <label class="block label-upper mb-2">Offer Valid To</label>
                <input
                  v-model="formData.offerValidTo"
                  type="date"
                  class="input"
                />
              </div>
            </div>
          </div>

          <!-- Validation Errors Summary -->
          <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-card p-4">
            <h4 class="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
            <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </form>

        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
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
import { Button } from '@motork/component-library'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      if (!value || value < 12 || value > 60) {
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
  if (!formData.value.fields.duration || formData.value.fields.duration < 12 || formData.value.fields.duration > 60) return false
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
