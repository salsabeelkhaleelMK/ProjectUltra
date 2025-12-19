<template>
  <ModalShell
    :show="show"
    title="Requalify as Lead"
    size="lg"
    @cancel="$emit('cancel')"
  >
    <!-- Custom header with icon -->
    <template #header>
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <i class="fa-solid fa-exclamation-triangle text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-1">Requalify as Lead</h3>
            <p class="text-sm text-gray-600">
              This will convert the opportunity back to a lead. Some data will be lost.
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Body with scrollable content -->
    <div class="space-y-6 max-h-[60vh] overflow-y-auto">
      <!-- What will be lost -->
      <div>
        <h4 class="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
          <i class="fa-solid fa-times-circle"></i>
          What will be lost
        </h4>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-minus text-red-500 text-xs mt-1"></i>
            <span>Opportunity stage, probability, and expected close date</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-minus text-red-500 text-xs mt-1"></i>
            <span>Opportunity value and negotiation history</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-minus text-red-500 text-xs mt-1"></i>
            <span>Stock or configured vehicles added to the opportunity</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-minus text-red-500 text-xs mt-1"></i>
            <span>Offer history and negotiation data</span>
          </li>
        </ul>
      </div>

      <!-- What will be kept -->
      <div>
        <h4 class="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
          <i class="fa-solid fa-check-circle"></i>
          What will be kept
        </h4>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check text-green-500 text-xs mt-1"></i>
            <span>Customer information and contact details</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check text-green-500 text-xs mt-1"></i>
            <span>Original requested car details</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check text-green-500 text-xs mt-1"></i>
            <span>All activities (notes, calls, emails, etc.)</span>
          </li>
        </ul>
      </div>

      <!-- Warning notice -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-sm text-yellow-800">
          <i class="fa-solid fa-info-circle mr-2"></i>
          This action cannot be undone. The opportunity will be permanently removed and replaced with a new lead.
        </p>
      </div>
    </div>

    <template #actions>
      <button
        @click="$emit('confirm')"
        class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
      >
        Confirm Requalification
      </button>
    </template>
  </ModalShell>
</template>

<script setup>
import ModalShell from '@/components/shared/ModalShell.vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
</script>
