<template>
  <form v-click-outside="() => (showResults = false)" @submit.prevent="handleSubmit" class="w-full">
    <!-- Contact Section -->
    <Card class="mb-4">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        
        <!-- Toggle and Search (hidden if hideContactSelection is true) -->
        <div v-if="!hideContactSelection">
          <!-- Toggle: Existing vs New -->
          <div class="flex gap-4 mb-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="contactMode" 
                value="new"
              />
              <span class="text-fluid-xs font-medium text-body">New Contact</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="contactMode" 
                value="existing"
              />
              <span class="text-fluid-xs font-medium text-body">Existing Contact</span>
            </label>
          </div>
        
        <!-- Contact Search (if existing) -->
        <div v-if="contactMode === 'existing'" class="space-y-3">
          <div class="relative">
            <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Search Contact</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sub text-xs z-10"></i>
              <TextInput 
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showResults = true"
                type="text" 
                placeholder="Search by name, email, or company..."
                class="pl-9"
              />
            </div>
            
            <!-- Autocomplete Dropdown -->
            <Card 
              v-if="showResults && filteredContacts.length > 0"
              class="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto"
            >
              <CardContent class="p-0">
                <div 
                  v-for="contact in filteredContacts" 
                  :key="contact.id"
                  @click="selectContact(contact)"
                  class="flex items-center gap-2 p-3 hover:bg-surfaceSecondary cursor-pointer border-b border-border last:border-b-0"
                >
                  <div class="w-8 h-8 rounded-full bg-surfaceSecondary text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {{ contact.initials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-heading text-fluid-xs truncate">{{ contact.name }}</div>
                    <div class="text-meta text-fluid-xs truncate">{{ contact.email }}</div>
                  </div>
                  <i class="fa-solid fa-chevron-right text-sub text-xs"></i>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <!-- Selected Contact Display -->
          <Card v-if="selectedContact" class="bg-surfaceSecondary">
            <CardContent>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-surfaceSecondary text-primary flex items-center justify-center text-xs font-bold">
                    {{ selectedContact.initials }}
                  </div>
                  <div>
                    <div class="font-bold text-heading text-fluid-xs">{{ selectedContact.name }}</div>
                    <div class="text-body text-fluid-xs text-sub">{{ selectedContact.email }}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  @click="clearSelection"
                >
                  <i class="fa-solid fa-xmark text-sm"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <!-- Contact Form Fields (if new) -->
        <div v-else class="space-y-3">
          <div>
            <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">
              Contact Name <span class="text-brand-red">*</span>
            </label>
            <TextInput 
              v-model="contactFormData.name"
              type="text" 
              placeholder="Enter contact name..."
              :required="contactMode === 'new'"
              :error="errors.name"
            />
            <p v-if="errors.name" class="text-brand-red text-fluid-xs mt-1">{{ errors.name }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">
                Email <span class="text-brand-red">*</span>
              </label>
              <TextInput 
                v-model="contactFormData.email"
                type="email" 
                placeholder="contact@example.com"
                :required="contactMode === 'new'"
                :error="errors.email"
              />
              <p v-if="errors.email" class="text-brand-red text-fluid-xs mt-1">{{ errors.email }}</p>
            </div>
            
            <div>
              <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Phone</label>
              <TextInput 
                v-model="contactFormData.phone"
                type="tel" 
                placeholder="+49..."
              />
            </div>
          </div>
          
          <div>
            <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Company (optional)</label>
            <TextInput 
              v-model="contactFormData.company"
              type="text" 
              placeholder="Company name..."
            />
          </div>
        </div>
        </div>

        <!-- Read-only Selected Contact Display (shown if selection is hidden) -->
        <Card v-else-if="selectedContact" class="bg-surfaceSecondary">
          <CardContent>
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-full bg-surfaceSecondary text-primary flex items-center justify-center text-xs font-bold">
                {{ selectedContact.initials }}
              </div>
              <div>
                <div class="font-bold text-heading text-fluid-xs">{{ selectedContact.name }}</div>
                <div class="text-fluid-xs text-body text-sub">{{ selectedContact.email }}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
    
    <!-- Vehicle Details Section (Optional) -->
    <Card class="mb-4">
      <CardHeader>
        <CardTitle>
          Vehicle Details 
          <span class="text-meta font-normal text-fluid-xs">(Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Basic Information -->
        <div class="mb-4">
          <h4 class="text-fluid-xs font-bold uppercase text-sub tracking-wider mb-2.5">Basic Information</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Brand</label>
              <TextInput 
                v-model="vehicleFormData.brand"
                type="text" 
                placeholder="e.g., VW"
              />
            </div>
            
            <div>
              <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Model</label>
              <TextInput 
                v-model="vehicleFormData.model"
                type="text" 
                placeholder="e.g., ID.4"
              />
            </div>
            
            <div>
              <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Year</label>
              <TextInput 
                v-model="vehicleFormData.year"
                type="number" 
                :min="1900"
                :max="new Date().getFullYear() + 1"
                placeholder="2024"
              />
            </div>
            
            <div>
              <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Price</label>
              <TextInput 
                v-model="vehicleFormData.price"
                type="number" 
                :min="0"
                placeholder="45000"
              />
            </div>
          </div>
        </div>
      
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Request Details -->
          <div>
            <h4 class="text-fluid-xs font-bold uppercase text-sub tracking-wider mb-2.5">Request Details</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Request Type</label>
                <select v-model="vehicleFormData.requestType" class="input text-fluid-xs">
                  <option value="">Select type</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Test Drive">Test Drive</option>
                  <option value="Information">Information</option>
                  <option value="Purchase">Purchase</option>
                </select>
              </div>
              
              <div>
                <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Source</label>
                <select v-model="vehicleFormData.source" class="input text-fluid-xs">
                  <option value="">Select source</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Website">Website</option>
                  <option value="Phone">Phone</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Vehicle Specs -->
          <div>
            <h4 class="text-fluid-xs font-bold uppercase text-sub tracking-wider mb-2.5">Vehicle Specs</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Fuel Type</label>
                <select v-model="vehicleFormData.fuelType" class="input text-fluid-xs">
                  <option value="">Select fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Gear Type</label>
                <select v-model="vehicleFormData.gearType" class="input text-fluid-xs">
                  <option value="">Select gear</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">Request Message</label>
          <Textarea 
            v-model="vehicleFormData.requestMessage"
            :rows="2"
            placeholder="Customer's message or notes..."
          />
        </div>
      </CardContent>
    </Card>
    
    <!-- Task Creation Checkboxes -->
    <Card class="bg-surfaceSecondary mb-4">
      <CardHeader>
        <CardTitle>Create Task (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-meta text-fluid-xs mb-3">
          Convert this contact to a lead or opportunity. 
          <span class="font-semibold">Requires vehicle details.</span>
        </p>
        
        <div v-if="!forceType" class="flex flex-col md:flex-row gap-3">
          <Card 
            class="flex-1"
            :class="hasVehicleData ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'"
          >
            <CardContent class="flex items-center gap-3">
              <Checkbox
                v-model="markAsLead"
                :disabled="!hasVehicleData"
                label=""
              />
              <div>
                <span 
                  class="text-fluid-xs font-bold"
                  :class="hasVehicleData ? 'text-heading' : 'text-sub'"
                >
                  Mark as Lead
                </span>
                <p class="text-fluid-xs text-meta">New lead task</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            class="flex-1"
            :class="hasVehicleData ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'"
          >
            <CardContent class="flex items-center gap-3">
              <Checkbox
                v-model="markAsOpportunity"
                :disabled="!hasVehicleData"
                label=""
              />
              <div>
                <span 
                  class="text-fluid-xs font-bold"
                  :class="hasVehicleData ? 'text-heading' : 'text-sub'"
                >
                  Mark as Opportunity
                </span>
                <p class="text-fluid-xs text-meta">New opportunity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- If forceType is set, just show confirmation -->
        <Card v-else class="bg-surfaceSecondary">
          <CardContent class="flex items-center gap-3">
            <i class="fa-solid fa-info-circle text-primary text-xs"></i>
            <div>
              <p class="text-fluid-xs font-bold text-heading">
                Converting to {{ forceType === 'lead' ? 'Lead' : 'Opportunity' }}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card v-if="!hasVehicleData" class="bg-surfaceSecondary border-border mt-2">
          <CardContent class="flex items-start gap-2">
            <i class="fa-solid fa-exclamation-triangle text-warning mt-0.5"></i>
            <span class="text-fluid-xs text-warning">Fill in vehicle details to enable lead/opportunity creation</span>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Button, Checkbox, TextInput, Toggle } from '@motork/component-library'
import { Card, CardHeader, CardTitle, CardContent, Textarea } from '@motork/component-library/future/primitives'
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
