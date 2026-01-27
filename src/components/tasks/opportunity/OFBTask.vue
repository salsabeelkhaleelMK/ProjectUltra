<template>
  <div class="space-y-4">
    <!-- Title and Description Card -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <div class="flex justify-between items-start mb-1">
        <div class="flex-1">
          <h4 class="font-bold text-foreground text-sm mb-1">Offer Feedback Task</h4>
          <p class="text-sm text-muted-foreground">
            This opportunity has been in negotiation for {{ daysInNegotiation }} days without a contract. Follow up with customer to get feedback and move forward.
          </p>
        </div>
        <button
          @click="$emit('postpone', 'ofb')"
          class="bg-white border border-D1D5DB text-brand-dark font-medium px-4 py-2 rounded-btn text-xs flex items-center gap-2 transition-colors hover:bg-muted ml-4"
        >
          <i class="fa-solid fa-clock"></i>
          <span>Postpone</span>
        </button>
      </div>
    </div>

    <!-- Offers Carousel -->
    <div v-if="opportunity.offers && opportunity.offers.length > 0" class="mb-4">
      <OfferCarousel
        :offers="opportunity.offers"
        :opportunity-id="opportunity.id"
        @offer-accepted="handleOfferAccepted"
      />
    </div>

    <!-- Communication Options -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h5 class="font-semibold text-foreground text-sm mb-4">Contact Customer</h5>
      
      <!-- Channel Selection -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <Button
          variant="outline"
          @click="communicationChannel = 'call'"
          class="flex items-center justify-center gap-2"
          :class="communicationChannel === 'call' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
        >
          <i class="fa-solid fa-phone text-xs"></i>
          <span>Call</span>
        </Button>
        <Button
          variant="outline"
          @click="communicationChannel = 'whatsapp'"
          class="flex items-center justify-center gap-2"
          :class="communicationChannel === 'whatsapp' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
        >
          <i class="fa-brands fa-whatsapp text-xs"></i>
          <span>WhatsApp</span>
        </Button>
        <Button
          variant="outline"
          @click="communicationChannel = 'sms'"
          class="flex items-center justify-center gap-2"
          :class="communicationChannel === 'sms' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
        >
          <i class="fa-solid fa-message text-xs"></i>
          <span>SMS</span>
        </Button>
        <Button
          variant="outline"
          @click="communicationChannel = 'email'"
          class="flex items-center justify-center gap-2"
          :class="communicationChannel === 'email' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
        >
          <i class="fa-solid fa-envelope text-xs"></i>
          <span>Email</span>
        </Button>
      </div>
      
      <!-- Message Composer -->
      <div v-if="communicationChannel" class="space-y-3">
        <div v-if="offerSelectOptions.length > 0">
          <Label class="block text-sm font-medium text-muted-foreground mb-2">Select offer to reference</Label>
          <SelectMenu
            v-model="selectedOfferId"
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
            v-model="message"
            rows="4"
            placeholder="Type your message here..."
            class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button, Label, Textarea } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'
import OfferCarousel from '@/components/shared/OfferCarousel.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['offer-accepted', 'offer-deleted', 'view-offer', 'send-message', 'postpone'])

const communicationChannel = ref(null)
const message = ref('')
const selectedOfferId = ref(null)

const daysInNegotiation = computed(() => {
  const date = props.opportunity.lastActivity || props.opportunity.createdAt
  if (!date) return 0
  const negotiationDate = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - negotiationDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const offerSelectOptions = computed(() => {
  if (!props.opportunity.offers || props.opportunity.offers.length === 0) return []
  
  return props.opportunity.offers
    .filter(o => o.status === 'active')
    .map(offer => ({
      id: offer.id,
      label: `${offer.vehicleBrand} ${offer.vehicleModel} (${offer.vehicleYear})`,
      price: offer.price,
      value: offer.id
    }))
})

const canSubmit = computed(() => {
  return communicationChannel.value && message.value.trim().length > 0
})

function formatCurrency(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

function handleOfferAccepted(offer) {
  emit('offer-accepted', offer)
}

function handleOfferDeleted(offer) {
  emit('offer-deleted', offer)
}

function handleViewOffer(offer) {
  emit('view-offer', offer)
}

async function submit() {
  if (!canSubmit.value) return
  
  emit('send-message', {
    channel: communicationChannel.value,
    message: message.value,
    offerId: selectedOfferId.value
  })
  
  // Reset form
  communicationChannel.value = null
  message.value = ''
  selectedOfferId.value = null
}

// Expose for parent component
defineExpose({
  canSubmit,
  submit
})
</script>

