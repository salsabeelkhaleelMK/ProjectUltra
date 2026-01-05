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
        <button
          @click="$router.push('/customers')"
          class="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Back to Customers
        </button>
      </div>
    </div>

    <!-- TaskShell -->
    <TaskShell
      v-else
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
        <!-- Requested Vehicle Widget for contacts and leads -->
        <VehicleWidget
          v-if="(task.type === 'contact' || task.type === 'lead') && task.requestedCar"
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
        
        <!-- Vehicle Widget for opportunities -->
        <VehicleWidget
          v-if="task.type === 'opportunity' && task.vehicle"
          :brand="task.vehicle.brand"
          :model="task.vehicle.model"
          :year="task.vehicle.year"
          :image="task.vehicle.image || ''"
          :price="task.vehicle.price || null"
          :request-message="task.vehicle.requestMessage || ''"
          :request-type="task.vehicle.requestType || ''"
          :source="task.source || ''"
          :dealership="task.vehicle.dealership || ''"
          :registration="task.vehicle.registration || ''"
          :kilometers="task.vehicle.kilometers || null"
          :fuel-type="task.vehicle.fuelType || ''"
          :gear-type="task.vehicle.gearType || ''"
          :vin="task.vehicle.vin || ''"
          :stock-days="task.vehicle.stockDays !== undefined ? task.vehicle.stockDays : null"
          :channel="task.vehicle.channel || 'Email'"
          :ad-campaign="task.vehicle.adCampaign || ''"
          :expected-purchase-date="task.vehicle.expectedPurchaseDate || ''"
          :fiscal-entity="task.vehicle.fiscalEntity || ''"
          :source-details="task.vehicle.sourceDetails || ''"
          :ad-medium="task.vehicle.adMedium || ''"
          :ad-source="task.vehicle.adSource || ''"
          label="Vehicle"
        />
      </template>
    </TaskShell>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useContactsStore } from '@/stores/contacts'
import TaskShell from '@/components/tasks/TaskShell.vue'
import VehicleWidget from '@/components/tasks/widgets/RequestedVehicleWidget.vue'
import ContactManagementWidget from '@/components/tasks/contacts/ContactManagementWidget.vue'
import { useTaskShell } from '@/composables/useTaskShell'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const contactsStore = useContactsStore()

const loading = ref(false)
const error = ref(null)

// Get task ID and type from route
const taskId = computed(() => parseInt(route.params.id))
const taskType = computed(() => {
  const queryType = route.query.type || route.query.stage
  // Accept 'contact', 'lead', 'opportunity'
  return queryType || 'lead'
})

// Get task from store and ensure it has type property
const task = computed(() => {
  if (taskType.value === 'contact') {
    const contact = contactsStore.currentContact
    if (!contact) return null
    // Map contact to task-like structure
    return {
      ...contact,
      type: 'contact',
      customer: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address || '',
        initials: contact.initials
      },
      source: contact.source || 'Direct',
      tags: contact.tags || [],
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

// Use composable to get TaskShell props for leads/opportunities
const taskShellProps = useTaskShell(task)

// Override management widget and config for contacts
const managementWidget = computed(() => {
  if (taskType.value === 'contact') {
    return ContactManagementWidget
  }
  return taskShellProps.managementWidget.value
})

const storeAdapter = computed(() => {
  if (taskType.value === 'contact') {
    // Contacts don't have activities yet, provide empty adapter
    return {
      currentActivities: computed(() => []),
      addActivity: async () => {},
      updateActivity: async () => {},
      deleteActivity: async () => {}
    }
  }
  // Return the computed ref directly, not its value, to maintain reactivity
  return taskShellProps.storeAdapter.value
})

const addNewConfig = computed(() => {
  if (taskType.value === 'contact') {
    return {
      overviewActions: [],
      tabActions: ['note', 'email', 'sms', 'whatsapp', 'attachment']
    }
  }
  return taskShellProps.addNewConfig.value
})

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
      await contactsStore.loadContactById(taskId.value)
    } else if (taskType.value === 'lead') {
      await leadsStore.loadLeadById(taskId.value)
    } else {
      await opportunitiesStore.loadOpportunityById(taskId.value)
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
    router.replace({ path: `/lead/${newLead.id}`, query: { type: 'lead' } })
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
    router.replace({ path: `/lead/${newOpp.id}`, query: { type: 'opportunity' } })
  } catch (err) {
    console.error('Error converting to opportunity:', err)
    error.value = err.message || 'Failed to convert to opportunity'
    loading.value = false
  }
}

// Load task on mount
onMounted(async () => {
  // Ensure stores are loaded first
  if (taskType.value === 'contact') {
    await contactsStore.loadContacts()
  } else if (taskType.value === 'lead') {
    await leadsStore.loadLeads()
  } else {
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

