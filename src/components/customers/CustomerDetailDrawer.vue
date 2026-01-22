<template>
  <div class="h-full flex flex-col overflow-hidden bg-surface">
    <!-- Drawer Header with Close Button -->
    <div class="border-b border-black/5 bg-white px-6 h-16 min-h-16 shrink-0">
      <div class="flex items-center justify-between gap-4 w-full h-full">
        <div class="flex flex-col min-w-0">
          <h2 class="text-fluid-lg font-medium text-greys-900 truncate">
            {{ customer?.name || 'Customer Details' }}
          </h2>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <!-- Close button -->
          <Button 
            variant="secondary" 
            size="icon" 
            @click="$emit('close')"
          >
            <X :size="16" class="text-greys-700" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading || !customer" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Customer Detail Content -->
    <EntityDetailLayout
      v-else
      :task="task"
      :type="taskType"
      :management-widget="managementWidget"
      :store-adapter="storeAdapter"
      :add-new-config="addNewConfig"
      @car-added="handleContactCarAdded"
      @convert-to-lead="handleConvertToLead"
      @convert-to-opportunity="handleConvertToOpportunity"
      @tag-updated="handleTagUpdated"
      @appointment-created="handleAppointmentCreated"
    >
      <template #pinned-extra="{ task }">
        <!-- Customer Summary Widget -->
        <CustomerSummaryWidget 
          :summary="task.summary || customerData?.summary"
          :preferences="task.preferences || customerData?.preferences"
          :customer-data="customerData"
        />
        
        <!-- Recent Activities Widget -->
        <RecentActivitiesWidget
          :next-appointment="nextAppointment"
          :activities="customerActivities"
          :leads="customerLeads"
          :opportunities="customerOpportunities"
          :customer-id="customerId"
        />
        
        <!-- Customer Cars Carousel - All cars from leads/opportunities -->
        <VehiclesCarousel v-if="customerCars.length > 0" :cars="customerCars" />
      </template>

      <template #tab-negotiations>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CustomerLeadsWidget 
            :leads="customerLeads" 
            :all-tasks="customerTasks"
            @add-lead="openAddModal('lead')"
          />
          <CustomerOpportunitiesWidget 
            :opportunities="customerOpportunities" 
            :all-tasks="customerTasks"
            :activities="customerActivities"
            @add-opportunity="openAddModal('opportunity')"
          />
        </div>
      </template>

      <template #tab-appointments>
        <CustomerAppointmentsWidget :appointments="customerAppointments" />
      </template>
    </EntityDetailLayout>

    <!-- Add Lead/Opportunity Modal -->
    <AddLeadOpportunityModal
      v-if="customer"
      :show="showAddModal"
      :type="addModalType"
      :contact="getContactForModal"
      @close="showAddModal = false"
      @save="handleAddModalSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@motork/component-library/future/primitives'
import { X } from 'lucide-vue-next'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCustomersStore } from '@/stores/customers'
import EntityDetailLayout from '@/components/shared/layout/EntityDetailLayout.vue'
import CustomerLeadsWidget from '@/components/customer/CustomerLeadsWidget.vue'
import CustomerOpportunitiesWidget from '@/components/customer/CustomerOpportunitiesWidget.vue'
import CustomerAppointmentsWidget from '@/components/customer/CustomerAppointmentsWidget.vue'
import VehiclesCarousel from '@/components/shared/vehicles/VehiclesCarousel.vue'
import AddLeadOpportunityModal from '@/components/modals/AddLeadOpportunityModal.vue'
import CustomerSummaryWidget from '@/components/customer/CustomerSummaryWidget.vue'
import RecentActivitiesWidget from '@/components/customer/RecentActivitiesWidget.vue'
import { fetchLeadsByCustomerId, fetchOpportunitiesByCustomerId, fetchCustomerCars, fetchTasksByCustomerId } from '@/api/contacts'
import { fetchLeadActivities } from '@/api/leads'
import { fetchOpportunityActivities, fetchAppointmentByCustomerId } from '@/api/opportunities'
import { fetchAppointmentsByCustomerId } from '@/api/calendar'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const customersStore = useCustomersStore()

const loading = ref(false)
const error = ref(null)

// Customer-related data
const customerData = ref(null)
const customerLeads = ref([])
const customerOpportunities = ref([])
const customerTasks = ref([])
const customerCars = ref([])
const customerActivities = ref([])
const customerAppointments = ref([])
const nextAppointment = ref(null)

const taskType = computed(() => 'contact')

// Get customer from store
const customer = computed(() => {
  return customerData.value || customersStore.currentCustomer
})

// Get task from customer data
const task = computed(() => {
  const cust = customer.value
  if (!cust) return null
  // Map customer/contact to task-like structure
  return {
    ...cust,
    id: cust.id,
    type: 'contact',
    customer: {
      id: cust.id,
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      address: cust.address || '',
      initials: cust.initials
    },
    source: cust.source || 'Direct',
    tags: cust.tags || [],
    stage: 'Contact',
    assignee: null,
    assigneeId: null
  }
})

// Management widget should NEVER appear on customer route
const managementWidget = computed(() => null)

// Store adapter for contacts only
const storeAdapter = computed(() => ({
  currentActivities: computed(() => []),
  addActivity: async () => {},
  updateActivity: async () => {},
  deleteActivity: async () => {}
}))

// Add new config for contacts only
const addNewConfig = computed(() => ({
  overviewActions: [],
  tabActions: ['note', 'email', 'sms', 'whatsapp', 'attachment']
}))

// Load customer-related data
const loadCustomerData = async () => {
  if (!props.customerId) return
  
  try {
    loading.value = true
    // Fetch customer data, leads, opportunities, tasks, and cars
    const [customer, leadsResult, oppsResult, tasksResult, carsResult] = await Promise.all([
      customersStore.fetchCustomerById(props.customerId),
      fetchLeadsByCustomerId(props.customerId),
      fetchOpportunitiesByCustomerId(props.customerId),
      fetchTasksByCustomerId(props.customerId),
      fetchCustomerCars(props.customerId)
    ])
    
    customerData.value = customer || customersStore.currentCustomer
    customerLeads.value = leadsResult.data || []
    customerOpportunities.value = oppsResult.data || []
    customerTasks.value = tasksResult.data || []
    customerCars.value = carsResult.data || []
    
    // Fetch activities using API wrappers
    const allActivities = []
    for (const lead of customerLeads.value) {
      try {
        const leadActivities = await fetchLeadActivities(lead.id)
        allActivities.push(...leadActivities)
      } catch (err) {
        console.error(`Failed to load activities for lead ${lead.id}:`, err)
      }
    }
    for (const opp of customerOpportunities.value) {
      try {
        const oppActivities = await fetchOpportunityActivities(opp.id)
        allActivities.push(...oppActivities)
      } catch (err) {
        console.error(`Failed to load activities for opportunity ${opp.id}:`, err)
      }
    }
    customerActivities.value = allActivities
    
    // Fetch next appointment and all appointments
    try {
      nextAppointment.value = await fetchAppointmentByCustomerId(props.customerId)
    } catch (err) {
      console.error('Failed to load next appointment:', err)
      nextAppointment.value = null
    }
    try {
      customerAppointments.value = await fetchAppointmentsByCustomerId(props.customerId)
    } catch (err) {
      console.error('Failed to load appointments:', err)
      customerAppointments.value = []
    }
  } catch (err) {
    console.error('Error loading customer data:', err)
    error.value = err.message || 'Failed to load customer'
  } finally {
    loading.value = false
  }
}

// Handle contact car addition
const handleContactCarAdded = async (carData) => {
  try {
    await customersStore.addRequestedCar(props.customerId, carData)
    await loadCustomerData()
  } catch (err) {
    console.error('Error adding car to customer:', err)
    error.value = err.message || 'Failed to add car'
  }
}

// Handle contact to lead conversion
const handleConvertToLead = async () => {
  try {
    loading.value = true
    const newLead = await customersStore.convertToLead(props.customerId)
    // Close drawer and navigate to tasks view for the new lead
    emit('close')
    router.push({ path: `/tasks/${newLead.id}`, query: { type: 'lead' } })
  } catch (err) {
    console.error('Error converting to lead:', err)
    error.value = err.message || 'Failed to convert to lead'
    loading.value = false
  }
}

// Handle contact to opportunity conversion
const handleConvertToOpportunity = async () => {
  try {
    loading.value = true
    const newOpp = await customersStore.convertToOpportunity(props.customerId)
    // Close drawer and navigate to tasks view for the new opportunity
    emit('close')
    router.push({ path: `/tasks/${newOpp.id}`, query: { type: 'opportunity' } })
  } catch (err) {
    console.error('Error converting to opportunity:', err)
    error.value = err.message || 'Failed to convert to opportunity'
    loading.value = false
  }
}

// Add Lead/Opportunity Modal State
const showAddModal = ref(false)
const addModalType = ref('lead')

// Get contact data for modal
const getContactForModal = computed(() => {
  if (!customer.value) {
    return { id: null, name: 'Unknown', email: '', phone: '', initials: '?' }
  }
  
  const cust = customer.value
  return {
    id: cust.id,
    name: cust.name || 'Unknown',
    email: cust.email || '',
    phone: cust.phone || '',
    initials: cust.initials || '?'
  }
})

const openAddModal = (type) => {
  addModalType.value = type
  showAddModal.value = true
}

const handleAddModalSave = async (data) => {
  try {
    loading.value = true
    showAddModal.value = false
    
    if (!props.customerId) {
      throw new Error('Customer ID not found')
    }
    
    // Process the data from UnifiedAddForm
    if (addModalType.value === 'lead') {
      await customersStore.convertToLead(props.customerId)
    } else {
      await customersStore.convertToOpportunity(props.customerId)
    }
    
    // Reload data to show the new item
    await loadCustomerData()
    loading.value = false
  } catch (err) {
    console.error(`Error adding ${addModalType.value}:`, err)
    error.value = err.message || `Failed to add ${addModalType.value}`
    loading.value = false
  }
}

// Handle tag updates - reload customer data to reflect changes
const handleTagUpdated = async () => {
  await loadCustomerData()
}

// Handle appointment created (from modal or inline form) - refresh appointments list
const handleAppointmentCreated = async () => {
  await loadCustomerData()
}

// Load customer data on mount
onMounted(async () => {
  await loadCustomerData()
})

// Watch for customerId changes
watch(() => props.customerId, (newId) => {
  if (newId) {
    loadCustomerData()
  }
})
</script>
