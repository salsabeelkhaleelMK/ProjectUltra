<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="flex w-full max-w-[90rem] flex-col max-h-[90vh] p-0">
        <DialogHeader class="flex-shrink-0 border-b border-border px-6 py-4">
          <DialogTitle class="text-foreground">Create offer</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4">
          <nav class="flex items-center justify-center gap-2 mb-4" aria-label="Steps">
            <ol class="flex items-center gap-2">
              <li
                class="flex items-center gap-1.5"
                :class="step === 'vehicle' ? 'text-foreground font-medium' : 'text-muted-foreground'"
              >
                <span
                  class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs"
                  :class="step === 'vehicle' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
                >
                  1
                </span>
                <span>Vehicle</span>
              </li>
              <li class="h-px w-4 shrink-0 bg-border" aria-hidden="true" />
              <li
                class="flex items-center gap-1.5"
                :class="step === 'form' ? 'text-foreground font-medium' : 'text-muted-foreground'"
              >
                <span
                  class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs"
                  :class="step === 'form' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
                >
                  2
                </span>
                <span>Offer</span>
              </li>
            </ol>
          </nav>
          <!-- Step 1: Vehicle -->
          <div v-if="step === 'vehicle'" class="space-y-4">
            <div v-if="vehicleSubView === 'choice'" class="space-y-4">
              <div class="grid gap-3 sm:grid-cols-1">
                <Button
                  v-if="requestedVehicle"
                  variant="outline"
                  class="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
                  @click="useRequestedVehicle"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
                    <img
                      v-if="requestedVehicle.image"
                      :src="requestedVehicle.image"
                      :alt="`${requestedVehicle.brand} ${requestedVehicle.model}`"
                      class="size-full object-cover"
                    />
                    <Car v-else class="size-5 text-foreground" />
                  </div>
                  <div class="min-w-0">
                    <span class="font-medium text-foreground">Use requested vehicle</span>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ requestedVehicle.brand }} {{ requestedVehicle.model }} ({{ requestedVehicle.year }}) — € {{ formatCurrency(requestedVehicle.price) }}
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  class="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
                  @click="vehicleSubView = 'stock'"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Package class="size-5 text-foreground" />
                  </div>
                  <div class="min-w-0">
                    <span class="font-medium text-foreground">Add from Stock</span>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      Search and select an existing vehicle from inventory
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  class="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
                  @click="vehicleSubView = 'configure'"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Settings class="size-5 text-foreground" />
                  </div>
                  <div class="min-w-0">
                    <span class="font-medium text-foreground">Configure Vehicle</span>
                    <p class="text-xs text-muted-foreground mt-0.5">Build or customize a new vehicle</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  class="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
                  @click="skipToManual"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <PenLine class="size-5 text-foreground" />
                  </div>
                  <div class="min-w-0">
                    <span class="font-medium text-foreground">Skip & Enter Manually</span>
                    <p class="text-xs text-muted-foreground mt-0.5">Create vehicle data from scratch</p>
                  </div>
                </Button>
              </div>
            </div>

            <div v-if="vehicleSubView === 'stock' || vehicleSubView === 'configure'">
              <VehicleSelectionInline
                ref="vehicleSelectionRef"
                :requested-vehicle="requestedVehicle"
                :opportunity-id="opportunityId"
                :mode="vehicleSubView === 'stock' ? 'stock' : 'configure'"
                show-back
                hide-back
                @vehicle-selected="onVehicleSelected"
                @back="vehicleSubView = 'choice'"
                @selection-change="onStockSelectionChange"
              />
            </div>
          </div>

          <!-- Step 2: Offer form -->
          <div v-if="step === 'form'" class="space-y-4">
            <OfferWidget
              ref="offerWidgetRef"
              :task-id="resolvedTaskId"
              task-type="opportunity"
              :customer="customer"
              :selected-vehicle="resolvedVehicle"
              :trade-ins="taskTradeIns"
              :financing-options="taskFinancingOptions"
              hide-header
              hide-actions
              hide-vehicle-selection
              :initial-vehicle-step="resolvedVehicle ? 'select' : 'manual'"
              @save="handleSave"
              @cancel="handleCancel"
              @open-add-tradein="$emit('open-add-tradein')"
              @open-add-financing="$emit('open-add-financing')"
            />
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col-reverse sm:flex-row gap-2 border-t border-border px-6 py-4 sm:justify-between sm:items-center">
          <div class="flex justify-end sm:justify-start order-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              class="gap-2"
              @click="handleBackClick"
            >
              <ChevronLeft class="size-4" />
              Back
            </Button>
          </div>
          <div class="flex flex-col-reverse sm:flex-row gap-2 order-2">
            <Button
              variant="outline"
              size="sm"
              class="w-full sm:w-auto"
              :disabled="isNextDisabled"
              @click="handleNext"
            >
              Next
            </Button>
            <Button
              v-if="step === 'form'"
              variant="default"
              size="sm"
              class="w-full sm:w-auto"
              :disabled="!canSubmit"
              @click="submitForm"
            >
              Create offer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { Car, ChevronLeft, Package, PenLine, Settings } from 'lucide-vue-next'
import { Button } from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'
import VehicleSelectionInline from '@/components/shared/VehicleSelectionInline.vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  opportunity: { type: Object, default: null }
})

const emit = defineEmits(['confirm', 'cancel', 'open-add-tradein', 'open-add-financing'])

const step = ref('vehicle')
const vehicleSubView = ref('choice')
const resolvedVehicle = ref(null)
const offerWidgetRef = ref(null)
const vehicleSelectionRef = ref(null)
const hasStockSelection = ref(false)

const resolvedTaskId = computed(() => props.opportunity?.id ?? null)
const customer = computed(() => props.opportunity?.customer ?? null)
const taskTradeIns = computed(() => props.opportunity?.tradeIns ?? [])
const taskFinancingOptions = computed(() => props.opportunity?.financingOptions ?? [])
const requestedVehicle = computed(
  () =>
    props.opportunity?.selectedVehicle ||
    props.opportunity?.vehicle ||
    props.opportunity?.requestedCar ||
    null
)
const opportunityId = computed(() => props.opportunity?.id ?? null)

const canSubmit = computed(() => !!offerWidgetRef.value?.isValid)

const isNextDisabled = computed(() => {
  if (step.value === 'form') return false
  if (step.value !== 'vehicle') return false
  if (vehicleSubView.value === 'stock') return !hasStockSelection.value
  return false
})

watch(() => props.show, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    reset()
  }
})

function reset() {
  step.value = 'vehicle'
  vehicleSubView.value = 'choice'
  resolvedVehicle.value = null
  hasStockSelection.value = false
}

function formatCurrency(val) {
  if (val == null) return '0'
  const n = typeof val === 'string' ? parseFloat(val) : val
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function useRequestedVehicle() {
  resolvedVehicle.value = { ...requestedVehicle.value }
  step.value = 'form'
}

function onStockSelectionChange({ hasSelection }) {
  hasStockSelection.value = !!hasSelection
}

function handleNext() {
  if (step.value === 'form') {
    handleCancel()
    return
  }
  if (step.value !== 'vehicle') return
  if (vehicleSubView.value === 'choice') {
    handleCancel()
    return
  }
  if (vehicleSubView.value === 'stock' && hasStockSelection.value && vehicleSelectionRef.value) {
    vehicleSelectionRef.value.confirmSelection()
    return
  }
  handleCancel()
}

function onVehicleSelected({ vehicle }) {
  resolvedVehicle.value = { ...vehicle }
  step.value = 'form'
}

function skipToManual() {
  resolvedVehicle.value = null
  step.value = 'form'
}

function goBack() {
  if (step.value === 'form') {
    step.value = 'vehicle'
    vehicleSubView.value = 'choice'
    resolvedVehicle.value = null
    hasStockSelection.value = false
  }
}

function handleBackClick() {
  if (step.value === 'form') {
    goBack()
    return
  }
  if (step.value === 'vehicle' && (vehicleSubView.value === 'stock' || vehicleSubView.value === 'configure')) {
    vehicleSubView.value = 'choice'
    hasStockSelection.value = false
    return
  }
  handleCancel()
}

function handleSave(payload) {
  emit('confirm', payload)
}

function handleCancel() {
  emit('cancel')
}

function handleOpenChange(isOpen) {
  if (!isOpen) handleCancel()
}

function submitForm() {
  if (!canSubmit.value || !offerWidgetRef.value) return
  offerWidgetRef.value.submit()
}
</script>
