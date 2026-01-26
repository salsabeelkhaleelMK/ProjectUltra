<template>
  <div class="page-container">
    <PageHeader title="Add New Customer">
      <template #actions>
      </template>
    </PageHeader>
    
    <div class="px-4 md:px-8 py-4">
      <div class="max-w-6xl mx-auto">
        <!-- Custom Tabs matching Tabs.vue style -->
        <div class="flex gap-0 md:gap-8 text-fluid-sm font-medium text-sub py-1 mb-4 border-b border-border">
          <div 
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="flex-1 md:flex-none pb-2 border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5 -mb-px"
            :class="activeTab === tab.value ? 'border-brand-dark text-brand-darkDarker' : 'border-transparent hover:text-body hover:border-slate-200'"
          >
            <!-- Icon -->
            <i 
              :class="[tab.icon, 'text-sm md:text-sm', activeTab === tab.value ? 'text-brand-darkDarker' : 'text-sub']"
            ></i>
            
            <!-- Label (hidden on mobile, visible on desktop) -->
            <span class="hidden md:inline whitespace-nowrap" :class="activeTab === tab.value ? 'text-brand-darkDarker' : ''">{{ tab.label }}</span>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="mt-6">
          <div v-if="activeTab === 'manual'">
            <ManualTab ref="manualTabRef" @submit="handleSubmit" />
          </div>

          <div v-if="activeTab === 'upload'">
            <UploadTab />
          </div>

          <div v-if="activeTab === 'integrations'">
            <IntegrationsTab />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomersStore } from '@/stores/customers'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import PageHeader from '@/components/layout/PageHeader.vue'
import ManualTab from '@/components/addnew/ManualTab.vue'
import UploadTab from '@/components/addnew/UploadTab.vue'
import IntegrationsTab from '@/components/addnew/IntegrationsTab.vue'
import { useTabPersistence } from '@/composables/useTabPersistence'

const router = useRouter()
const customersStore = useCustomersStore()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

const manualTabRef = ref(null)
const { activeTab } = useTabPersistence('add-new-active-tab', 'manual')

// Ensure manual is automatically selected on mount
onMounted(() => {
  if (!activeTab.value || !['manual', 'upload', 'integrations'].includes(activeTab.value)) {
    activeTab.value = 'manual'
  }
})

const tabs = [
  {
    value: 'manual',
    label: 'Manual',
    icon: 'fa-solid fa-pen'
  },
  {
    value: 'upload',
    label: 'Upload',
    icon: 'fa-solid fa-upload'
  },
  {
    value: 'integrations',
    label: 'Integrations',
    icon: 'fa-solid fa-plug'
  }
]

const handleSubmit = async (formData) => {
  try {
    const { contactMode, selectedContact, contactData, vehicleData, markAsLead, markAsOpportunity } = formData
    
    // Step 1: Get or create customer (contact or account)
    let contact = selectedContact
    if (contactMode === 'new') {
      contact = await customersStore.addCustomer({
        ...contactData,
        initials: contactData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        source: 'Direct',
        tags: [],
        company: contactData.company || null // Will determine if it's account or contact
      })
    }
    
    // Step 2: Determine action based on task checkboxes
    if (markAsLead) {
      // Create lead
      const leadData = {
        customer: {
          id: contact.id,
          name: contact.name,
          initials: contact.initials,
          email: contact.email,
          phone: contact.phone,
          address: contact.address || ''
        },
        status: 'Open',
        stage: 'Open Lead',
        priority: 'Normal',
        source: vehicleData?.source || 'Direct',
        assignee: null,
        assigneeInitials: '',
        isDisqualified: false,
        disqualifyReason: null,
        scheduledAppointment: null,
        contactAttempts: []
      }
      
      // Only add requestedCar if vehicle data exists
      if (vehicleData && Object.keys(vehicleData).length > 0) {
        leadData.requestedCar = vehicleData
      }
      
      const newLead = await leadsStore.createLead(leadData)
      
      router.push({ 
        path: '/customers', 
        query: { tab: 'open-leads', highlight: `lead-${newLead.id}` }
      })
    } else if (markAsOpportunity) {
      // Create opportunity
      const oppData = {
        customer: {
          id: contact.id,
          name: contact.name,
          initials: contact.initials,
          email: contact.email,
          phone: contact.phone,
          address: contact.address || ''
        },
        stage: 'Qualified',
        priority: 'Normal',
        source: vehicleData?.source || 'Direct',
        assignee: null,
        assigneeInitials: ''
      }
      
      // Only add vehicle if vehicle data exists
      if (vehicleData && Object.keys(vehicleData).length > 0) {
        oppData.vehicle = vehicleData
      }
      
      const newOpp = await opportunitiesStore.createOpportunity(oppData)
      
      router.push({ 
        path: '/customers', 
        query: { tab: 'open-opportunities', highlight: `opp-${newOpp.id}` }
      })
    } else {
      // Neither checkbox checked
      if (vehicleData && Object.keys(vehicleData).length > 0) {
        // Save vehicle to customer
        await customersStore.addRequestedCar(contact.id, vehicleData)
      }
      
      // Just redirect to contacts (contact already created/selected)
      router.push({ 
        path: '/customers', 
        query: { tab: 'contacts', highlight: `contact-${contact.id}` }
      })
    }
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Failed to save. Please try again.')
    
    // Reset submitting state
    if (manualTabRef.value) {
      manualTabRef.value.resetSubmitting()
    }
  }
}
</script>
