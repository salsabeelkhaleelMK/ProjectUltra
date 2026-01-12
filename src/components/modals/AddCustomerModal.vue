<template>
  <ModalShell
    :show="show"
    :title="modalTitle"
    subtitle="Fill in the details below"
    size="md"
    @close="$emit('close')"
    @cancel="$emit('close')"
  >
    <div class="space-y-4">
      <!-- Form fields based on active tab -->
      <div v-if="activeTab === 'contacts'">
        <label class="block label-upper mb-2">Contact Name</label>
        <input 
          v-model="formData.customerName"
          type="text" 
          placeholder="Enter contact name..." 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Email</label>
        <input 
          v-model="formData.email"
          type="email" 
          placeholder="contact@example.com" 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Phone</label>
        <input 
          v-model="formData.phone"
          type="tel" 
          placeholder="+49..." 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Company (optional)</label>
        <input 
          v-model="formData.company"
          type="text" 
          placeholder="Company name..." 
          class="input"
        >
      </div>
      
      <div v-else-if="activeTab === 'open-leads'">
        <label class="block label-upper mb-2">Customer Name</label>
        <input 
          v-model="formData.customerName"
          type="text" 
          placeholder="Enter customer name..." 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Email</label>
        <input 
          v-model="formData.email"
          type="email" 
          placeholder="customer@example.com" 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Requested Vehicle</label>
        <input 
          v-model="formData.vehicle"
          type="text" 
          placeholder="e.g., Volkswagen ID.4" 
          class="input"
        >
      </div>
      
      <div v-else-if="activeTab === 'open-opportunities' || activeTab === 'in-negotiation'">
        <label class="block label-upper mb-2">Customer Name</label>
        <input 
          v-model="formData.customerName"
          type="text" 
          placeholder="Enter customer name..." 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Vehicle</label>
        <input 
          v-model="formData.vehicle"
          type="text" 
          placeholder="e.g., Porsche Taycan" 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Opportunity Value</label>
        <input 
          v-model="formData.value"
          type="number" 
          placeholder="0" 
          class="input"
        >
      </div>
      
      <div v-else>
        <label class="block label-upper mb-2">Customer Name</label>
        <input 
          v-model="formData.customerName"
          type="text" 
          placeholder="Enter customer name..." 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Vehicle</label>
        <input 
          v-model="formData.vehicle"
          type="text" 
          placeholder="Vehicle model" 
          class="input"
        >
        
        <label class="block label-upper mb-2 mt-4">Reason</label>
        <textarea 
          v-model="formData.reason"
          rows="3"
          :placeholder="`Reason for ${activeTab === 'won' ? 'win' : 'loss'}...`"
          class="input resize-none"
        ></textarea>
      </div>
    </div>
    
    <template #actions>
      <Button
        :label="`Create ${itemType}`"
        variant="primary"
        size="small"
        class="rounded-sm"
        @click="handleAdd"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  activeTab: {
    type: String,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  customerName: '',
  email: '',
  phone: '',
  company: '',
  vehicle: '',
  value: '',
  reason: ''
})

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    formData.value = {
      customerName: props.initialData.customerName || '',
      email: props.initialData.email || '',
      phone: props.initialData.phone || '',
      company: props.initialData.company || '',
      vehicle: props.initialData.vehicle || '',
      value: props.initialData.value || '',
      reason: props.initialData.reason || ''
    }
  }
})

const modalTitle = computed(() => {
  const titles = {
    'contacts': 'Add New Contact',
    'open-leads': 'Add New Lead',
    'open-opportunities': 'Add New Opportunity',
    'in-negotiation': 'Add Opportunity in Negotiation',
    'won': 'Add Won Opportunity',
    'lost': 'Add Lost Opportunity'
  }
  return titles[props.activeTab] || 'Add New Item'
})

const itemType = computed(() => {
  const types = {
    'contacts': 'Contact',
    'open-leads': 'Lead',
    'open-opportunities': 'Opportunity',
    'in-negotiation': 'Opportunity',
    'won': 'Won Opportunity',
    'lost': 'Lost Opportunity'
  }
  return types[props.activeTab] || 'Item'
})

const handleAdd = () => {
  emit('save', { ...formData.value })
  // Reset form after save
  formData.value = {
    customerName: '',
    email: '',
    phone: '',
    company: '',
    vehicle: '',
    value: '',
    reason: ''
  }
}
</script>

