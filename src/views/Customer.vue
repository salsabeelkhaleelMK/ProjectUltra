<template>
  <div class="h-full flex flex-col overflow-hidden bg-surface">
    <!-- Loading State -->
    <div v-if="loading || !task || (task && task.id !== taskId)" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- EntityDetailLayout - Only show when task ID matches route ID -->
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
          :customer-id="taskId"
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
      v-if="task"
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
import { useRoute, useRouter } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const customersStore = useCustomersStore()

const loading = ref(false)
const error = ref(null)

// Customer-related data (only for contacts)
const customerData = ref(null)
const customerLeads = ref([])
const customerOpportunities = ref([])
const customerTasks = ref([])
const customerCars = ref([])
const customerActivities = ref([])
const customerAppointments = ref([])
const nextAppointment = ref(null)

// Get task ID from route - customer page always shows contact view
const taskId = computed(() => parseInt(route.params.id))
const taskType = computed(() => 'contact')

// Get task from store - always a contact/customer
const task = computed(() => {
  // Use customerData if available, otherwise fallback to contact
  const customer = customerData.value || customersStore.currentCustomer
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
  const customerId = explicitId || taskId.value
  if (!customerId) return
  
  try {
    // Fetch customer data, leads, opportunities, tasks, and cars
    // Determine customer type from route query (for account vs contact)
    const customerType = route.query.type === 'account' ? 'account' : 'contact'
    const [customer, leadsResult, oppsResult, tasksResult, carsResult] = await Promise.all([
      customersStore.fetchCustomerById(customerId, customerType),
      fetchLeadsByCustomerId(customerId),
      fetchOpportunitiesByCustomerId(customerId),
      fetchTasksByCustomerId(customerId),
      fetchCustomerCars(customerId)
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
      nextAppointment.value = await fetchAppointmentByCustomerId(customerId)
    } catch (err) {
      console.error('Failed to load next appointment:', err)
      nextAppointment.value = null
    }
    try {
      customerAppointments.value = await fetchAppointmentsByCustomerId(customerId)
    } catch (err) {
      console.error('Failed to load appointments:', err)
      customerAppointments.value = []
    }
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
    // Always load customer data - customer page only shows contacts
    await loadCustomerData()
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
    // Determine customer type from task
    const customerType = task.value?.type === 'contact' ? 'contact' : 'account'
    await customersStore.addRequestedCar(taskId.value, carData)
    // Reload customer to show updated data
    await loadTask()
  } catch (err) {
    console.error('Error adding car to customer:', err)
    error.value = err.message || 'Failed to add car'
  }
}

// Handle contact to lead conversion
const handleConvertToLead = async () => {
  try {
    loading.value = true
    const newLead = await customersStore.convertToLead(taskId.value)
    // Navigate to tasks view for the new lead
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
    const newOpp = await customersStore.convertToOpportunity(taskId.value)
    // Navigate to tasks view for the new opportunity
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

// Get contact data for modal (always a contact on customer page)
const getContactForModal = computed(() => {
  if (!task.value) {
    return { id: null, name: 'Unknown', email: '', phone: '', initials: '?' }
  }
  
  const t = task.value
  return {
    id: t.id,
    name: t.name || 'Unknown',
    email: t.email || '',
    phone: t.phone || '',
    initials: t.initials || '?'
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
    
    // Get the customer ID from the current task (always a contact on customer page)
    const customerId = taskId.value
    
    if (!customerId) {
      throw new Error('Customer ID not found')
    }
    
    // Process the data from UnifiedAddForm
    if (addModalType.value === 'lead') {
      await customersStore.convertToLead(customerId)
    } else {
      await customersStore.convertToOpportunity(customerId)
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
  await loadTask()
})

// Handle tag updates - reload customer data to reflect changes
const handleTagUpdated = async () => {
  await loadCustomerData()
}

// Handle appointment created (from modal or inline form) - refresh appointments list
const handleAppointmentCreated = async () => {
  await loadCustomerData()
}

// Watch for route changes to reload task
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTask()
  }
})
</script>
