<template>
  <form v-click-outside="() => (showResults = false)" @submit.prevent="handleSubmit" class="max-w-4xl mx-auto">
    <!-- Contact Section -->
    <div class="bg-surface border border rounded-lg p-6 mb-6">
      <h3 class="font-bold text-gray-800 mb-4">Contact Information</h3>
      
      <!-- Toggle and Search (hidden if hideContactSelection is true) -->
      <div v-if="!hideContactSelection">
        <!-- Toggle: Existing vs New -->
        <div class="flex gap-6 mb-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="contactMode" 
              value="new"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm font-medium text-body">New Contact</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="contactMode" 
              value="existing"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm font-medium text-body">Existing Contact</span>
          </label>
        </div>
        
        <!-- Contact Search (if existing) -->
        <div v-if="contactMode === 'existing'" class="space-y-4">
          <div class="relative">
            <label class="block label-upper mb-2">Search Contact</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showResults = true"
                type="text" 
                placeholder="Search by name, email, or company..." 
                class="input pl-10"
              />
            </div>
            
            <!-- Autocomplete Dropdown -->
            <div 
              v-if="showResults && filteredContacts.length > 0"
              class="absolute z-50 w-full mt-2 bg-surface border border rounded-lg shadow-lg max-h-80 overflow-y-auto"
            >
              <div 
                v-for="contact in filteredContacts" 
                :key="contact.id"
                @click="selectContact(contact)"
                class="flex items-center gap-3 p-4 hover:bg-surfaceSecondary cursor-pointer transition-colors border-b border last:border-b-0"
              >
                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {{ contact.initials }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-800 truncate">{{ contact.name }}</div>
                  <div class="text-meta truncate">{{ contact.email }}</div>
                  <div v-if="contact.company" class="text-xs text-gray-400 truncate">{{ contact.company }}</div>
                </div>
                <i class="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
              </div>
            </div>
            
            <!-- No Results -->
            <div 
              v-if="showResults && searchQuery && filteredContacts.length === 0"
              class="absolute z-50 w-full mt-2 bg-surface border border rounded-lg shadow-lg p-4"
            >
              <div class="text-center text-gray-500">
                <i class="fa-solid fa-search text-2xl mb-2"></i>
                <p class="text-sm">No contacts found matching "{{ searchQuery }}"</p>
              </div>
            </div>
          </div>
          
          <!-- Selected Contact Display -->
          <div v-if="selectedContact" class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  {{ selectedContact.initials }}
                </div>
                <div>
                  <div class="font-bold text-gray-800">{{ selectedContact.name }}</div>
                  <div class="text-content text-gray-600">{{ selectedContact.email }}</div>
                  <div v-if="selectedContact.company" class="text-xs text-gray-500">{{ selectedContact.company }}</div>
                </div>
              </div>
              <button
                type="button"
                @click="clearSelection"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i class="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Contact Form Fields (if new) -->
        <div v-else class="space-y-4">
          <div>
            <label class="block label-upper mb-2">
              Contact Name <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="contactFormData.name"
              type="text" 
              placeholder="Enter contact name..." 
              class="input"
              :required="contactMode === 'new'"
            >
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          
          <div>
            <label class="block label-upper mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="contactFormData.email"
              type="email" 
              placeholder="contact@example.com" 
              class="input"
              :required="contactMode === 'new'"
            >
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          
          <div>
            <label class="block label-upper mb-2">Phone</label>
            <input 
              v-model="contactFormData.phone"
              type="tel" 
              placeholder="+49..." 
              class="input"
            >
          </div>
          
          <div>
            <label class="block label-upper mb-2">Company (optional)</label>
            <input 
              v-model="contactFormData.company"
              type="text" 
              placeholder="Company name..." 
              class="input"
            >
            <p class="text-xs text-gray-500 mt-1">Leave empty for individual contacts</p>
          </div>
        </div>
      </div>

      <!-- Read-only Selected Contact Display (shown if selection is hidden) -->
      <div v-else-if="selectedContact" class="bg-surfaceSecondary border border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            {{ selectedContact.initials }}
          </div>
          <div>
            <div class="font-bold text-gray-800">{{ selectedContact.name }}</div>
            <div class="text-sm text-gray-600">{{ selectedContact.email }}</div>
            <div v-if="selectedContact.company" class="text-xs text-gray-500">{{ selectedContact.company }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Vehicle Details Section (Optional) -->
    <div class="bg-surface border border rounded-lg p-6 mb-6">
      <h3 class="font-bold text-gray-800 mb-4">
        Vehicle Details 
        <span class="text-meta font-normal">(Optional)</span>
      </h3>
      
      <!-- Basic Information -->
      <div class="mb-6">
        <h4 class="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Basic Information</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block label-upper mb-2">Brand</label>
            <input 
              v-model="vehicleFormData.brand"
              type="text" 
              placeholder="e.g., Volkswagen" 
              class="input"
            >
          </div>
          
          <div>
            <label class="block label-upper mb-2">Model</label>
            <input 
              v-model="vehicleFormData.model"
              type="text" 
              placeholder="e.g., ID.4" 
              class="input"
            >
          </div>
          
          <div>
            <label class="block label-upper mb-2">Year</label>
            <input 
              v-model="vehicleFormData.year"
              type="number" 
              min="1900"
              :max="new Date().getFullYear() + 1"
              placeholder="e.g., 2024" 
              class="input"
            >
          </div>
          
          <div>
            <label class="block label-upper mb-2">Price</label>
            <input 
              v-model="vehicleFormData.price"
              type="number" 
              min="0"
              placeholder="e.g., 45000" 
              class="input"
            >
          </div>
          
          <div class="md:col-span-2">
            <label class="block label-upper mb-2">Request Message</label>
            <textarea 
              v-model="vehicleFormData.requestMessage"
              rows="3"
              placeholder="Customer's message or notes..." 
              class="input resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- Request Details -->
      <div class="mb-6">
        <h4 class="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Request Details</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block label-upper mb-2">Request Type</label>
            <select v-model="vehicleFormData.requestType" class="input">
              <option value="">Select type</option>
              <option value="Quotation">Quotation</option>
              <option value="Test Drive">Test Drive</option>
              <option value="Information">Information</option>
              <option value="Purchase">Purchase</option>
            </select>
          </div>
          
          <div>
            <label class="block label-upper mb-2">Source</label>
            <select v-model="vehicleFormData.source" class="input">
              <option value="">Select source</option>
              <option value="Marketing">Marketing</option>
              <option value="Website">Website</option>
              <option value="Phone">Phone</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          
          <div>
            <label class="block label-upper mb-2">Dealership</label>
            <input 
              v-model="vehicleFormData.dealership"
              type="text" 
              placeholder="e.g., Berlin Mitte" 
              class="input"
            >
          </div>
          
          <div>
            <label class="block label-upper mb-2">Channel</label>
            <select v-model="vehicleFormData.channel" class="input">
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Vehicle Details -->
      <div>
        <h4 class="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Vehicle Details</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block label-upper mb-2">Fuel Type</label>
            <select v-model="vehicleFormData.fuelType" class="input">
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid</option>
            </select>
          </div>
          
          <div>
            <label class="block label-upper mb-2">Gear Type</label>
            <select v-model="vehicleFormData.gearType" class="input">
              <option value="">Select gear type</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          
          <div>
            <label class="block label-upper mb-2">Kilometers</label>
            <input 
              v-model="vehicleFormData.kilometers"
              type="number" 
              min="0"
              placeholder="e.g., 50000" 
              class="input"
            >
          </div>
          
          <div>
            <label class="block label-upper mb-2">Stock Days</label>
            <input 
              v-model="vehicleFormData.stockDays"
              type="number" 
              min="0"
              placeholder="Days in stock" 
              class="input"
            >
            <p class="text-xs text-gray-500 mt-1">Leave empty if out of stock</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Task Creation Checkboxes -->
    <div class="bg-surfaceSecondary border border rounded-lg p-6 mb-6">
      <h3 class="font-bold text-gray-800 mb-4">Create Task (Optional)</h3>
      <p class="text-meta mb-4">
        Convert this contact to a lead or opportunity. 
        <span class="font-semibold">Requires vehicle details to be filled.</span>
      </p>
      
      <div v-if="!forceType" class="space-y-3">
        <div 
          class="flex items-center gap-3 p-3 bg-surface border border rounded-lg transition-all"
          :class="hasVehicleData ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300' : 'cursor-not-allowed opacity-60'"
        >
          <Checkbox
            v-model="markAsLead"
            :disabled="!hasVehicleData"
            label=""
          />
          <div>
            <span 
              class="font-medium"
              :class="hasVehicleData ? 'text-gray-800' : 'text-gray-400'"
            >
              Mark as Lead
            </span>
            <p class="text-xs text-gray-500">Create a new lead task with vehicle details</p>
          </div>
        </div>
        
        <div 
          class="flex items-center gap-3 p-3 bg-surface border border rounded-lg transition-all"
          :class="hasVehicleData ? 'cursor-pointer hover:bg-purple-50 hover:border-purple-300' : 'cursor-not-allowed opacity-60'"
        >
          <Checkbox
            v-model="markAsOpportunity"
            :disabled="!hasVehicleData"
            label=""
          />
          <div>
            <span 
              class="font-medium"
              :class="hasVehicleData ? 'text-gray-800' : 'text-gray-400'"
            >
              Mark as Opportunity
            </span>
            <p class="text-xs text-gray-500">Create a new opportunity task with vehicle details</p>
          </div>
        </div>
      </div>

      <!-- If forceType is set, just show confirmation -->
      <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
        <i class="fa-solid fa-info-circle text-blue-600"></i>
        <div>
          <p class="text-sm font-medium text-blue-900">
            Converting to {{ forceType === 'lead' ? 'Lead' : 'Opportunity' }}
          </p>
          <p class="text-xs text-blue-700">Vehicle details are required for this action.</p>
        </div>
      </div>
      
      <div v-if="!hasVehicleData" class="mt-3 flex items-start gap-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3">
        <i class="fa-solid fa-exclamation-triangle mt-0.5"></i>
        <span>Fill in vehicle details above to enable lead/opportunity creation</span>
      </div>
      
      <p v-if="!markAsLead && !markAsOpportunity && hasVehicleData" class="text-xs text-gray-500 mt-3 italic">
        <i class="fa-solid fa-info-circle mr-1"></i>
        If neither is selected, only the contact and vehicle information will be saved
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Button, Checkbox } from '@motork/component-library'
import { useCustomersStore } from '@/stores/customers'
import { useAddFormValidation } from '@/composables/useAddFormValidation'
import { useAddFormSubmission } from '@/composables/useAddFormSubmission'

const props = defineProps({
  initialContact: {
    type: Object,
    default: null
  },
  hideContactSelection: {
    type: Boolean,
    default: false
  },
  forceType: {
    type: String, // 'lead' | 'opportunity'
    default: ''
  }
})

const emit = defineEmits(['submit'])

const customersStore = useCustomersStore()

// Contact Mode
const contactMode = ref(props.initialContact ? 'existing' : 'new') // 'existing' or 'new'

// Contact Search (for existing)
const searchQuery = ref('')
const showResults = ref(false)
const selectedContact = ref(props.initialContact || null)

// Contact Form Data (for new)
const contactFormData = reactive({
  name: '',
  email: '',
  phone: '',
  company: ''
})

// Vehicle Form Data
const vehicleFormData = reactive({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: null,
  requestMessage: '',
  requestType: '',
  source: '',
  dealership: '',
  channel: 'Email',
  fuelType: '',
  gearType: '',
  kilometers: null,
  stockDays: null
})

// Task Marking
const markAsLead = ref(props.forceType === 'lead')
const markAsOpportunity = ref(props.forceType === 'opportunity')

// Update marking when forceType changes
watch(() => props.forceType, (newType) => {
  if (newType === 'lead') {
    markAsLead.value = true
    markAsOpportunity.value = false
  } else if (newType === 'opportunity') {
    markAsLead.value = false
    markAsOpportunity.value = true
  }
})

// Set initial contact if provided
watch(() => props.initialContact, (newContact) => {
  if (newContact) {
    selectedContact.value = newContact
    searchQuery.value = newContact.name
    contactMode.value = 'existing'
  }
}, { immediate: true })

let searchTimeout = null

// Use validation composable
const { errors, canSubmit, validateContactForm, clearErrors } = useAddFormValidation({
  contactMode,
  selectedContact,
  contactFormData
})

onMounted(() => {
  if (customersStore.customers.length === 0) {
    customersStore.fetchCustomers()
  }
})

// Computed
const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return customersStore.customers.slice(0, 10)
  }
  
  const query = searchQuery.value.toLowerCase()
  return customersStore.customers.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.email.toLowerCase().includes(query) ||
    (contact.company && contact.company.toLowerCase().includes(query))
  ).slice(0, 10)
})

const hasVehicleData = computed(() => {
  return !!(
    vehicleFormData.brand ||
    vehicleFormData.model ||
    vehicleFormData.year !== new Date().getFullYear() ||
    vehicleFormData.price ||
    vehicleFormData.requestMessage ||
    vehicleFormData.requestType ||
    vehicleFormData.source ||
    vehicleFormData.dealership ||
    vehicleFormData.fuelType ||
    vehicleFormData.gearType ||
    vehicleFormData.kilometers ||
    vehicleFormData.stockDays
  )
})

// Use submission composable
const { isSubmitting, handleSubmit: submitHandler, resetSubmitting } = useAddFormSubmission({
  contactMode,
  selectedContact,
  contactFormData,
  vehicleFormData,
  markAsLead,
  markAsOpportunity,
  validateContactForm,
  onSubmit: (submissionData) => {
    emit('submit', submissionData)
  }
})

// Methods
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    showResults.value = true
  }, 300)
}

const selectContact = (contact) => {
  selectedContact.value = contact
  searchQuery.value = contact.name
  showResults.value = false
}

const clearSelection = () => {
  selectedContact.value = null
  searchQuery.value = ''
  showResults.value = false
}

const handleClear = () => {
  // Reset contact mode to new
  contactMode.value = 'new'
  
  // Clear contact search
  selectedContact.value = null
  searchQuery.value = ''
  showResults.value = false
  
  // Clear contact form
  contactFormData.name = ''
  contactFormData.email = ''
  contactFormData.phone = ''
  contactFormData.company = ''
  
  // Clear vehicle form
  Object.keys(vehicleFormData).forEach(key => {
    if (key === 'year') {
      vehicleFormData[key] = new Date().getFullYear()
    } else if (key === 'channel') {
      vehicleFormData[key] = 'Email'
    } else if (typeof vehicleFormData[key] === 'number') {
      vehicleFormData[key] = null
    } else {
      vehicleFormData[key] = ''
    }
  })
  
  // Clear task marking
  markAsLead.value = false
  markAsOpportunity.value = false
  
  // Clear errors
  clearErrors()
}

defineExpose({
  resetSubmitting,
  submit: submitHandler,
  clear: handleClear,
  canSubmit,
  isSubmitting
})
</script>
