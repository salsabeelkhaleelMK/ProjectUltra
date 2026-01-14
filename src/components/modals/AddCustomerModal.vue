<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
          <DialogDescription>Fill in the details below</DialogDescription>
        </DialogHeader>

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
    
        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            :label="`Create ${itemType}`"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="handleAdd"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

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

