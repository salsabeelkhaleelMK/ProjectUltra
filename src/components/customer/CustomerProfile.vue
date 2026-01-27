<template>
  <div class="h-full flex flex-col overflow-hidden bg-surface">
    <!-- Customer Detail Content -->
    <EntityDetailLayout
      :task="task"
      :type="taskType"
      :management-widget="managementWidget"
      :store-adapter="storeAdapter"
      :add-new-config="addNewConfig"
      :show-close-button="showCloseButton"
      @close="$emit('close')"
      @car-added="handleContactCarAdded"
      @convert-to-lead="handleConvertToLead"
      @convert-to-opportunity="handleConvertToOpportunity"
      @tag-updated="handleTagUpdated"
      @appointment-created="handleAppointmentCreated"
    >
      <template #pinned-extra="{ task }">
        <!-- Responsive Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-min">
          <!-- Contact Details Card - Row 1, Col 1 (Desktop) -->
          <div class="h-auto">
            <CustomerContactDetailsCard
              :email="task?.customer?.email || customerData?.email || ''"
              :phone="task?.customer?.phone || customerData?.phone || ''"
              :address="task?.customer?.address || customerData?.address || ''"
              :title="customerData?.title || customerData?.salutation"
              :job-title="customerData?.jobTitle || customerData?.title"
              :loading="loadingCustomer"
            />
          </div>
          
          <!-- Customer Insights Card - Row 1, Col 2 (Desktop) -->
          <div class="h-auto">
            <CustomerSummaryWidget 
              :summary="task?.summary || customerData?.summary"
              :preferences="task?.preferences || customerData?.preferences"
              :customer-data="customerData"
              :loading="loadingCustomer"
            />
          </div>
          
          <!-- Account Details Card - Row 2, Col 1 (Desktop, only for company accounts) -->
          <div v-if="accountData && accountData.type === 'Company'" class="h-auto">
            <AccountDetailsCard
              :account-data="accountData"
              :current-contact-id="customerId"
              :loading="loadingAccount"
            />
          </div>
          
          <!-- Related Contacts Widget - Row 2, Col 2 (Desktop, only for company accounts) -->
          <div v-if="accountData && accountData.type === 'Company'" class="h-auto">
            <RelatedContactsWidget
              :related-contacts="relatedContacts"
              :master-contact-id="accountData?.masterContactId || accountData?.masterContact?.id"
              :current-contact-id="customerId"
              :account-data="accountData"
              :loading="loadingRelatedContacts"
            />
          </div>
          
          <!-- Suggested Next Action - Row 3, Full Width -->
          <div class="lg:col-span-2 h-auto">
            <SuggestedNextAction 
              :leads="customerLeads"
              :opportunities="customerOpportunities"
              :activities="customerActivities"
              :loading="loadingLeads || loadingOpportunities || loadingActivities"
            />
          </div>
          
          <!-- Recent Activities - Row 4, Full Width -->
          <div class="lg:col-span-2 h-auto">
            <RecentActivitiesWidget
              :next-appointment="nextAppointment"
              :activities="customerActivities"
              :leads="customerLeads"
              :opportunities="customerOpportunities"
              :customer-id="customerId"
              :loading="loadingActivities || loadingAppointments || loadingLeads || loadingOpportunities"
            />
          </div>
          
          <!-- Customer Cars Carousel - Row 5, Full Width -->
          <div v-if="customerCars.length > 0 || loadingCars" class="lg:col-span-2 h-auto">
            <VehiclesCarousel :cars="customerCars" />
          </div>
        </div>
      </template>

      <template #tab-negotiations>
        <div class="flex flex-col gap-6 mb-6">
          <CustomerLeadsWidget 
            :leads="customerLeads" 
            :all-tasks="customerTasks"
            :loading="loadingLeads"
            @add-lead="openAddModal('lead')"
          />
          <CustomerOpportunitiesWidget 
            :opportunities="customerOpportunities" 
            :all-tasks="customerTasks"
            :activities="customerActivities"
            :loading="loadingOpportunities"
            @add-opportunity="openAddModal('opportunity')"
          />
        </div>
      </template>

      <template #tab-appointments>
        <CustomerAppointmentsWidget :appointments="customerAppointments" :loading="loadingAppointments" />
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
import SuggestedNextAction from '@/components/customer/SuggestedNextAction.vue'
import RecentActivitiesWidget from '@/components/customer/RecentActivitiesWidget.vue'
import CustomerContactDetailsCard from '@/components/customer/CustomerContactDetailsCard.vue'
import AccountDetailsCard from '@/components/customer/AccountDetailsCard.vue'
import RelatedContactsWidget from '@/components/customer/RelatedContactsWidget.vue'
import { fetchLeadsByCustomerId, fetchOpportunitiesByCustomerId, fetchCustomerCars, fetchTasksByCustomerId, fetchContactsByAccountId } from '@/api/contacts'
import { fetchAccountById } from '@/api/accounts'
import { fetchLeadActivities } from '@/api/leads'
import { fetchOpportunityActivities } from '@/api/opportunities'
import { fetchAppointmentsByCustomerId } from '@/api/calendar'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  customerType: {
    type: String,
    default: 'contact', // 'contact' or 'account'
    validator: (value) => ['contact', 'account'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: false
  },
  closeOnConvert: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const customersStore = useCustomersStore()

// Individual loading states for each data type
const loadingCustomer = ref(false)
const loadingAccount = ref(false)
const loadingRelatedContacts = ref(false)
const loadingLeads = ref(false)
const loadingOpportunities = ref(false)
const loadingCars = ref(false)
const loadingActivities = ref(false)
const loadingAppointments = ref(false)
const error = ref(null)

// Customer-related data
const customerData = ref(null)
const accountData = ref(null)
const relatedContacts = ref([])
const customerLeads = ref([])
const customerOpportunities = ref([])
const customerTasks = ref([])
const customerCars = ref([])
const customerActivities = ref([])
const customerAppointments = ref([])

const taskType = computed(() => 'contact')

// Get customer from store
const customer = computed(() => {
  return customerData.value || customersStore.currentCustomer
})

// Get task from customer data
const task = computed(() => {
  const cust = customer.value
  if (!cust) {
    // Return a minimal task structure when customer is loading
    return {
      id: null,
      type: 'contact',
      summary: null,
      preferences: [],
      customer: {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '',
        initials: '?'
      },
      source: 'Direct',
      tags: [],
      stage: 'Contact',
      assignee: null,
      assigneeId: null
    }
  }
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

// Next upcoming appointment (first future one by start time)
const nextAppointment = computed(() => {
  const now = new Date()
  const future = (customerAppointments.value || []).filter(
    (apt) => apt?.start && new Date(apt.start) >= now
  )
  future.sort((a, b) => new Date(a.start) - new Date(b.start))
  return future.length > 0 ? future[0] : null
})

// Management widget should NEVER appear on customer profile
const managementWidget = computed(() => null)

// Store adapter for contacts only
const storeAdapter = computed(() => ({
  currentActivities: computed(() => customerActivities.value),
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
    // Set all loading states to true initially
    loadingCustomer.value = true
    loadingLeads.value = true
    loadingOpportunities.value = true
    loadingCars.value = true
    loadingActivities.value = true
    loadingAppointments.value = true
    
    // Fetch customer data and tasks first
    const [customer, tasksResult] = await Promise.all([
      customersStore.fetchCustomerById(props.customerId, props.customerType).finally(() => {
        loadingCustomer.value = false
      }),
      fetchTasksByCustomerId(props.customerId)
    ])
    
    customerData.value = customer || customersStore.currentCustomer
    customerTasks.value = tasksResult.data || []
    
    // Fetch account data if contact has account_id
    const accountId = customerData.value?.account_id || customerData.value?.accountId
    if (accountId) {
      try {
        loadingAccount.value = true
        accountData.value = await fetchAccountById(accountId)
        
        // If account type is Company, fetch related contacts
        if (accountData.value?.type === 'Company') {
          try {
            loadingRelatedContacts.value = true
            const relatedContactsResult = await fetchContactsByAccountId(accountId)
            // Filter out current contact from related contacts
            relatedContacts.value = (relatedContactsResult.data || []).filter(
              contact => contact.id !== props.customerId
            )
          } catch (err) {
            console.error('Failed to load related contacts:', err)
            relatedContacts.value = []
          } finally {
            loadingRelatedContacts.value = false
          }
        } else {
          relatedContacts.value = []
        }
      } catch (err) {
        console.error('Failed to load account data:', err)
        accountData.value = null
        relatedContacts.value = []
      } finally {
        loadingAccount.value = false
      }
    } else {
      accountData.value = null
      relatedContacts.value = []
    }
    
    // Fetch leads and opportunities by account_id if available, otherwise by customerId
    const [leadsResult, oppsResult, carsResult] = await Promise.all([
      fetchLeadsByCustomerId(props.customerId, accountId || null).finally(() => {
        loadingLeads.value = false
      }),
      fetchOpportunitiesByCustomerId(props.customerId, accountId || null).finally(() => {
        loadingOpportunities.value = false
      }),
      // Fetch vehicles by account_id (vehicles are owned by accounts), fallback to customerId
      fetchCustomerCars(accountId || props.customerId).finally(() => {
        loadingCars.value = false
      })
    ])
    
    customerLeads.value = leadsResult.data || []
    customerOpportunities.value = oppsResult.data || []
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
    loadingActivities.value = false
    
    // Fetch all appointments
    try {
      customerAppointments.value = await fetchAppointmentsByCustomerId(props.customerId)
    } catch (err) {
      console.error('Failed to load appointments:', err)
      customerAppointments.value = []
    } finally {
      loadingAppointments.value = false
    }
  } catch (err) {
    console.error('Error loading customer data:', err)
    error.value = err.message || 'Failed to load customer'
    // Reset all loading states on error
    loadingCustomer.value = false
    loadingAccount.value = false
    loadingRelatedContacts.value = false
    loadingLeads.value = false
    loadingOpportunities.value = false
    loadingCars.value = false
    loadingActivities.value = false
    loadingAppointments.value = false
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
    loadingLeads.value = true
    const newLead = await customersStore.convertToLead(props.customerId)
    // Close drawer if needed, then navigate
    if (props.closeOnConvert) {
      emit('close')
    }
    router.push({ path: `/tasks/${newLead.id}`, query: { type: 'lead' } })
  } catch (err) {
    console.error('Error converting to lead:', err)
    error.value = err.message || 'Failed to convert to lead'
    loadingLeads.value = false
  }
}

// Handle contact to opportunity conversion
const handleConvertToOpportunity = async () => {
  try {
    loadingOpportunities.value = true
    const newOpp = await customersStore.convertToOpportunity(props.customerId)
    // Close drawer if needed, then navigate
    if (props.closeOnConvert) {
      emit('close')
    }
    router.push({ path: `/tasks/${newOpp.id}`, query: { type: 'opportunity' } })
  } catch (err) {
    console.error('Error converting to opportunity:', err)
    error.value = err.message || 'Failed to convert to opportunity'
    loadingOpportunities.value = false
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
    if (addModalType.value === 'lead') {
      loadingLeads.value = true
    } else {
      loadingOpportunities.value = true
    }
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
  } catch (err) {
    console.error(`Error adding ${addModalType.value}:`, err)
    error.value = err.message || `Failed to add ${addModalType.value}`
    if (addModalType.value === 'lead') {
      loadingLeads.value = false
    } else {
      loadingOpportunities.value = false
    }
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
