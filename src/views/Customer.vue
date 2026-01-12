<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500">Loading...</p>
      </div>
    </div>

    <!-- Error/Not Found State -->
    <div v-else-if="error || !task" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <i class="fa-solid fa-exclamation-circle text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 mb-2">{{ error || 'Task not found' }}</p>
        <Button
          label="Back to Customers"
          variant="primary"
          size="medium"
          @click="$router.push('/customers')"
        />
      </div>
    </div>

    <!-- TaskShell - Only show when task ID matches route ID -->
    <TaskShell
      v-else-if="task && task.id === taskId"
      :task="task"
      :type="taskType"
      :management-widget="managementWidget"
      :store-adapter="storeAdapter"
      :add-new-config="addNewConfig"
      @car-added="handleContactCarAdded"
      @convert-to-lead="handleConvertToLead"
      @convert-to-opportunity="handleConvertToOpportunity"
    >
      <template #pinned-extra="{ task }">
        <!-- Customer Overview Widgets -->
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
        <VehiclesCarousel v-if="customerCars.length > 0" :cars="customerCars" />
        
        <!-- Requested Vehicle Widget for contacts only (leads/opportunities handled in CustomerShell) -->
        <VehicleWidget
          v-if="task.type === 'contact' && task.requestedCar"
          :brand="task.requestedCar.brand"
          :model="task.requestedCar.model"
          :year="task.requestedCar.year"
          :image="task.requestedCar.image || ''"
          :price="task.requestedCar.price || null"
          :request-message="task.requestedCar.requestMessage || ''"
          :request-type="task.requestedCar.requestType || ''"
          :source="task.source || ''"
          :dealership="task.requestedCar.dealership || ''"
          :registration="task.requestedCar.registration || ''"
          :kilometers="task.requestedCar.kilometers || null"
          :fuel-type="task.requestedCar.fuelType || ''"
          :gear-type="task.requestedCar.gearType || ''"
          :vin="task.requestedCar.vin || ''"
          :stock-days="task.requestedCar.stockDays !== undefined ? task.requestedCar.stockDays : null"
          :channel="task.requestedCar.channel || 'Email'"
          :ad-campaign="task.requestedCar.adCampaign || ''"
          :expected-purchase-date="task.requestedCar.expectedPurchaseDate || ''"
          :fiscal-entity="task.requestedCar.fiscalEntity || ''"
          :source-details="task.requestedCar.sourceDetails || ''"
          :ad-medium="task.requestedCar.adMedium || ''"
          :ad-source="task.requestedCar.adSource || ''"
          label="Requested Car"
        />
      </template>
    </TaskShell>

    <!-- Add Lead/Opportunity Modal -->
    <AddLeadOpportunityModal
      v-if="task"
      :show="showAddModal"
      :type="addModalType"
      :contact="getContactForModal"
      @close="showAddModal = false"
      @save="handleAddModalSave"
    />

    <!-- Loading state for ID mismatch (prevents showing stale data) -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useContactsStore } from '@/stores/contacts'
import { Button } from '@motork/component-library'
import TaskShell from '@/components/customer/CustomerShell.vue'
import VehicleWidget from '@/components/shared/vehicles/VehicleWidget.vue'
import CustomerLeadsWidget from '@/components/customer/CustomerLeadsWidget.vue'
import CustomerOpportunitiesWidget from '@/components/customer/CustomerOpportunitiesWidget.vue'
import VehiclesCarousel from '@/components/shared/vehicles/VehiclesCarousel.vue'
import AddLeadOpportunityModal from '@/components/modals/AddLeadOpportunityModal.vue'
import { fetchLeadsByCustomerId, fetchOpportunitiesByCustomerId, fetchCustomerCars, fetchTasksByCustomerId } from '@/api/contacts'
import { fetchCustomerById } from '@/api/customers'
import { mockActivities } from '@/api/mockData'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const contactsStore = useContactsStore()

const loading = ref(false)
const error = ref(null)

// Customer-related data (only for contacts)
const customerData = ref(null)
const customerLeads = ref([])
const customerOpportunities = ref([])
const customerTasks = ref([])
const customerCars = ref([])
const customerActivities = ref([])

// Get task ID and type from route
const taskId = computed(() => parseInt(route.params.id))
const taskType = computed(() => {
  const queryType = route.query.type || route.query.stage
  // Accept 'contact', 'lead', 'opportunity' (default to 'contact' for customer route)
  return queryType || 'contact'
})

// Get task from store and ensure it has type property
const task = computed(() => {
  if (taskType.value === 'contact') {
    // Use customerData if available, otherwise fallback to contact
    const customer = customerData.value || contactsStore.currentContact
    if (!customer) return null
    // Map customer/contact to task-like structure
    return {
      ...customer,
      id: customer.id,
      type: 'contact',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
        initials: customer.initials
      },
      source: customer.source || 'Direct',
      tags: customer.tags || [],
      stage: 'Contact', // Contacts don't have stages
      assignee: null,
      assigneeId: null
    }
  } else if (taskType.value === 'lead') {
    const lead = leadsStore.currentLead
    return lead ? { ...lead, type: 'lead' } : null
  } else {
    const opp = opportunitiesStore.currentOpportunity
    return opp ? { ...opp, type: 'opportunity' } : null
  }
})

// Management widget should NEVER appear on customer route
// Customer route is only for viewing customer/contact information
// Leads and opportunities should be viewed via /tasks/:id?type=lead|opportunity
const managementWidget = computed(() => null)

// Store adapter for contacts only (customer route only handles contacts)
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
const loadCustomerData = async (explicitId = null) => {
  const customerId = explicitId || (taskType.value === 'contact' ? taskId.value : task.value?.customerId)
  if (!customerId) return
  
  try {
    // Fetch customer data, leads, opportunities, tasks, and cars
    const [customer, leadsResult, oppsResult, tasksResult, carsResult] = await Promise.all([
      fetchCustomerById(customerId),
      fetchLeadsByCustomerId(customerId),
      fetchOpportunitiesByCustomerId(customerId),
      fetchTasksByCustomerId(customerId),
      fetchCustomerCars(customerId)
    ])
    
    customerData.value = customer
    customerLeads.value = leadsResult.data || []
    customerOpportunities.value = oppsResult.data || []
    customerTasks.value = tasksResult.data || []
    customerCars.value = carsResult.data || []
    
    // Fetch activities from mockActivities
    const allActivities = []
    customerLeads.value.forEach(lead => {
      const leadActivities = mockActivities.filter(a => a.leadId === lead.id)
      allActivities.push(...leadActivities)
    })
    customerOpportunities.value.forEach(opp => {
      const oppActivities = mockActivities.filter(a => a.opportunityId === opp.id)
      allActivities.push(...oppActivities)
    })
    customerActivities.value = allActivities
  } catch (err) {
    console.error('Error loading customer data:', err)
  }
}

// Load task data
const loadTask = async () => {
  if (!taskId.value) {
    error.value = 'No task ID provided'
    return
  }

  loading.value = true
  error.value = null

  try {
    if (taskType.value === 'contact') {
      // Load customer data directly
      await loadCustomerData()
    } else if (taskType.value === 'lead') {
      await leadsStore.loadLeadById(taskId.value)
      // Also load associated customer data for widgets
      await loadCustomerData()
    } else {
      await opportunitiesStore.loadOpportunityById(taskId.value)
      // Also load associated customer data for widgets
      await loadCustomerData()
    }
  } catch (err) {
    error.value = err.message || 'Failed to load task'
    console.error('Error loading task:', err)
  } finally {
    loading.value = false
  }
}

// Handle contact car addition
const handleContactCarAdded = async (carData) => {
  try {
    await contactsStore.addRequestedCar(taskId.value, carData)
    // Reload contact to show updated data
    await loadTask()
  } catch (err) {
    console.error('Error adding car to contact:', err)
    error.value = err.message || 'Failed to add car'
  }
}

// Handle contact to lead conversion
const handleConvertToLead = async () => {
  try {
    loading.value = true
    const newLead = await contactsStore.convertToLead(taskId.value)
    // Navigate to the new lead view on the same page
    router.replace({ path: `/customer/${newLead.id}`, query: { type: 'lead' } })
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
    const newOpp = await contactsStore.convertToOpportunity(taskId.value)
    // Navigate to the new opportunity view on the same page
    router.replace({ path: `/customer/${newOpp.id}`, query: { type: 'opportunity' } })
  } catch (err) {
    console.error('Error converting to opportunity:', err)
    error.value = err.message || 'Failed to convert to opportunity'
    loading.value = false
  }
}

// Add Lead/Opportunity Modal State
const showAddModal = ref(false)
const addModalType = ref('lead')

// Get contact data for modal (extract customer from task)
const getContactForModal = computed(() => {
  if (!task.value) {
    return { id: null, name: 'Unknown', email: '', phone: '', initials: '?' }
  }
  
  const t = task.value
  const isContact = taskType.value === 'contact'
  
  // For contacts, use task properties directly
  if (isContact) {
    return {
      id: t.id,
      name: t.name || 'Unknown',
      email: t.email || '',
      phone: t.phone || '',
      initials: t.initials || '?'
    }
  }
  
  // For leads/opportunities, extract from customer property
  const customer = t.customer || {}
  return {
    id: customer.id || t.customerId || t.id,
    name: customer.name || 'Unknown',
    email: customer.email || '',
    phone: customer.phone || '',
    initials: customer.initials || '?'
  }
})

const openAddModal = (type) => {
  console.log('openAddModal called with type:', type, 'task:', task.value)
  addModalType.value = type
  showAddModal.value = true
  console.log('showAddModal set to:', showAddModal.value, 'contact:', getContactForModal.value)
}

const handleAddModalSave = async (data) => {
  try {
    loading.value = true
    showAddModal.value = false
    
    // Get the customer ID from the current task
    const customerId = taskType.value === 'contact' ? taskId.value : task.value?.customerId
    
    if (!customerId) {
      throw new Error('Customer ID not found')
    }
    
    // Process the data from UnifiedAddForm
    if (addModalType.value === 'lead') {
      await contactsStore.convertToLead(customerId, data.vehicleData)
    } else {
      await contactsStore.convertToOpportunity(customerId, data.vehicleData)
    }
    
    // Reload data to show the new item
    await loadCustomerData(customerId)
    loading.value = false
  } catch (err) {
    console.error(`Error adding ${addModalType.value}:`, err)
    error.value = err.message || `Failed to add ${addModalType.value}`
    loading.value = false
  }
}

// Load task on mount
onMounted(async () => {
  // Ensure stores are loaded first
  if (taskType.value === 'lead') {
    await leadsStore.loadLeads()
  } else if (taskType.value === 'opportunity') {
    await opportunitiesStore.loadOpportunities()
  }
  await loadTask()
})

// Watch for route changes to reload task
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTask()
  }
})

// Watch for stage/type changes
watch(() => [route.query.stage, route.query.type], () => {
  if (taskId.value) {
    loadTask()
  }
})
</script>

