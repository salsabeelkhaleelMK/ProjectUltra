<template>
  <div class="rounded-lg flex flex-col bg-muted">
    <div class="pt-1 px-1">
      <div class="bg-white rounded-lg shadow-nsc-card overflow-visible">
        <div class="p-6">
          <div class="mb-3">
            <h4 class="font-bold text-foreground text-sm">Manage Offers & Follow Up</h4>
            <p class="text-sm text-muted-foreground mt-0.5">
              <template v-if="opportunity.offers && opportunity.offers.length > 0">
                {{ (opportunity.negotiationSubstatus === 'Offer Under Review' || opportunity.negotiationSubstatus === 'Awaiting Response' || opportunity.negotiationSubstatus === 'Offer Feedback') ? 'Request feedback on pending offers' : 'Follow up with customer about offers' }}
              </template>
              <template v-else>
                {{ (opportunity.negotiationSubstatus === 'Offer Under Review' || opportunity.negotiationSubstatus === 'Awaiting Response' || opportunity.negotiationSubstatus === 'Offer Feedback') ? 'Create an offer and request feedback' : 'Create an offer to continue negotiation' }}
              </template>
            </p>
          </div>
          <!-- Offers Carousel (before action buttons) -->
          <div v-if="opportunity.offers && opportunity.offers.length > 0" class="mb-4">
            <OfferCarousel
              :offers="opportunity.offers"
              :opportunity-id="opportunity.id"
              @offer-accepted="$emit('offer-accepted', $event)"
            />
          </div>
          <div v-else class="mb-4 p-4 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground">No offers yet. Create your first offer to continue.</p>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <!-- Primary Actions for Offer Under Review -->
            <template v-if="opportunity.negotiationSubstatus === 'Offer Under Review' || opportunity.negotiationSubstatus === 'Awaiting Response'">
              <Button
                variant="default"
                @click="$emit('mark-offer-accepted')"
                class="bg-green-600 hover:bg-green-700 text-white"
              >
                <i class="fa-solid fa-check-circle mr-2"></i>
                Mark as Accepted
              </Button>
              <Button
                variant="outline"
                @click="$emit('update:show-add-offer-section', true); $emit('update:show-negotiation-section', false)"
              >
                <i class="fa-solid fa-plus mr-2"></i>
                Create Another Offer
              </Button>
            </template>
            
            <!-- Regular Actions for other substatuses -->
            <template v-else>
              <div class="outcome-toggle-group flex flex-wrap gap-3">
                <Toggle
                  variant="outline"
                  :model-value="showNegotiationSection"
                  @update:model-value="(p) => { $emit('update:show-negotiation-section', p); if (p) $emit('update:show-add-offer-section', false); else { $emit('reset-negotiation-form') } }"
                  class="outcome-toggle-item"
                >
                  <i class="fa-solid fa-phone-volume"></i>
                  <span>{{ (opportunity.negotiationSubstatus === 'Offer Feedback') ? 'Request Feedback' : 'Follow Up' }}</span>
                </Toggle>
                <Toggle
                  variant="outline"
                  :model-value="showAddOfferSection"
                  @update:model-value="(p) => { $emit('update:show-add-offer-section', p); if (p) $emit('update:show-negotiation-section', false) }"
                  class="outcome-toggle-item"
                >
                  <i class="fa-solid fa-plus"></i>
                  <span>Add Offer</span>
                </Toggle>
              </div>
            </template>
            
            <!-- Secondary Actions Dropdown -->
            <SecondaryActionsDropdown
              v-if="secondaryActions && secondaryActions.length > 0"
              :actions="secondaryActions"
              @action-selected="$emit('secondary-action', $event)"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="px-4 py-4 space-y-4">
      <!-- Inline Follow Up Section -->
      <div v-if="showNegotiationSection" class="space-y-4">
        <!-- Communication Options -->
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <h5 class="font-semibold text-foreground text-sm mb-4">Contact Customer</h5>
          
          <!-- Channel Selection -->
          <div class="followup-channel-toggle-group flex flex-wrap gap-2 mb-4">
            <Toggle
              variant="outline"
              :model-value="negotiationChannel === 'call'"
              @update:model-value="(p) => p && $emit('update:negotiation-channel', 'call')"
              class="followup-toggle-item"
            >
              <i class="fa-solid fa-phone text-xs"></i>
              <span>Call</span>
            </Toggle>
            <Toggle
              variant="outline"
              :model-value="negotiationChannel === 'whatsapp'"
              @update:model-value="(p) => p && $emit('update:negotiation-channel', 'whatsapp')"
              class="followup-toggle-item"
            >
              <i class="fa-brands fa-whatsapp text-xs"></i>
              <span>WhatsApp</span>
            </Toggle>
            <Toggle
              variant="outline"
              :model-value="negotiationChannel === 'sms'"
              @update:model-value="(p) => p && $emit('update:negotiation-channel', 'sms')"
              class="followup-toggle-item"
            >
              <i class="fa-solid fa-message text-xs"></i>
              <span>SMS</span>
            </Toggle>
            <Toggle
              variant="outline"
              :model-value="negotiationChannel === 'email'"
              @update:model-value="(p) => p && $emit('update:negotiation-channel', 'email')"
              class="followup-toggle-item"
            >
              <i class="fa-solid fa-envelope text-xs"></i>
              <span>Email</span>
            </Toggle>
          </div>
            
          <!-- Message Composer -->
          <div v-if="negotiationChannel" class="space-y-3">
            <div v-if="offerSelectOptions.length > 0">
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Select offer to reference (Optional)</Label>
              <SelectMenu
                :model-value="negotiationSelectedOfferId"
                @update:model-value="$emit('update:negotiation-selected-offer-id', $event)"
                :items="offerSelectOptions"
                placeholder="Select an offer..."
                value-key="id"
                class="w-full"
              >
                <template #item="{ item }">
                  <div class="flex items-center justify-between gap-2">
                    <span>{{ item.label }}</span>
                    <span class="text-muted-foreground text-xs">€ {{ formatCurrency(item.price) }}</span>
                  </div>
                </template>
              </SelectMenu>
            </div>
            
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Message</Label>
              <Textarea
                :model-value="negotiationMessage"
                @update:model-value="$emit('update:negotiation-message', $event)"
                rows="4"
                placeholder="Type your message here..."
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Unified Negotiation Buttons -->
      <div v-if="showNegotiationSection" class="flex justify-end gap-2 pt-3">
        <Button
          variant="secondary"
          @click="$emit('cancel-negotiation')"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          :disabled="!canSendNegotiationMessage"
          @click="$emit('send-negotiation-message')"
        >
          Send Message
        </Button>
      </div>
      
      <!-- Inline Add Offer Section -->
      <div v-if="showAddOfferSection">
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <OfferWidget
            ref="addOfferWidgetRef"
            :task-id="opportunity.id"
            :task-type="'opportunity'"
            :customer="opportunity.customer"
            :selected-vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
            hide-header
            hide-actions
            @save="$emit('offer-created', $event)"
            @cancel="$emit('cancel-add-offer')"
          />
        </div>
      </div>
      
      <!-- Unified Add Offer Buttons -->
      <div v-if="showAddOfferSection" class="flex justify-end gap-2 pt-3">
        <Button
          variant="secondary"
          @click="$emit('cancel-add-offer')"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          :disabled="!canCreateInlineOffer"
          @click="$emit('confirm-add-offer')"
        >
          Create Offer
        </Button>
      </div>
      
      <!-- OFB Task Widget (only in expanded view, only for Offer Under Review status) -->
      <div v-if="shouldShowOFBTask" class="space-y-4">
        <OFBTask
          :opportunity="opportunity"
          @offer-accepted="$emit('offer-accepted', $event)"
          @postpone="$emit('ofb-postpone', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Button, Toggle, Label, Textarea } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'
import SecondaryActionsDropdown from '@/components/shared/SecondaryActionsDropdown.vue'
import OfferCarousel from '@/components/shared/OfferCarousel.vue'
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'
import OFBTask from '@/components/tasks/opportunity/OFBTask.vue'
import { OpportunityConditions } from '@/utils/opportunityRules'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  showNegotiationSection: {
    type: Boolean,
    default: false
  },
  showAddOfferSection: {
    type: Boolean,
    default: false
  },
  negotiationChannel: {
    type: String,
    default: null
  },
  negotiationMessage: {
    type: String,
    default: ''
  },
  negotiationSelectedOfferId: {
    type: String,
    default: null
  },
  offerSelectOptions: {
    type: Array,
    default: () => []
  },
  canSendNegotiationMessage: {
    type: Boolean,
    default: false
  },
  canCreateInlineOffer: {
    type: Boolean,
    default: false
  },
  secondaryActions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:show-negotiation-section',
  'update:show-add-offer-section',
  'update:negotiation-channel',
  'update:negotiation-message',
  'update:negotiation-selected-offer-id',
  'reset-negotiation-form',
  'send-negotiation-message',
  'cancel-negotiation',
  'offer-created',
  'cancel-add-offer',
  'confirm-add-offer',
  'offer-accepted',
  'mark-offer-accepted',
  'secondary-action',
  'ofb-postpone'
])

const addOfferWidgetRef = ref(null)

// Check if OFB task should be shown (only in expanded view, only for Offer Under Review)
const shouldShowOFBTask = computed(() => {
  // Only show when negotiation section or add offer section is expanded
  if (!props.showNegotiationSection && !props.showAddOfferSection) {
    return false
  }
  
  // Only show for "Offer Under Review" status
  const substatus = props.opportunity?.negotiationSubstatus
  if (substatus !== 'Offer Under Review' && substatus !== 'Awaiting Response') {
    return false
  }
  
  // Check OFB condition
  const context = {
    opportunity: props.opportunity,
    hasOffers: props.opportunity?.offers && props.opportunity.offers.length > 0,
    stage: 'In Negotiation',
    activities: []
  }
  
  return OpportunityConditions['negotiation-5-plus-days-no-contract-has-offers'](context)
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('€', '€')
}

// Expose refs for parent component
defineExpose({
  addOfferWidgetRef
})
</script>
