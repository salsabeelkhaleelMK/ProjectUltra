<template>
  <div class="page-container">
    <!-- Header using Motork Card -->
    <Card class="border-b border-border rounded-none">
      <CardHeader class="px-4 md:px-8 py-4">
        <CardTitle>Add New Customer</CardTitle>
      </CardHeader>
    </Card>
    
    <div class="px-4 md:px-8 py-4">
      <div class="max-w-6xl mx-auto">
        <!-- Tabs using Motork Button components -->
        <div class="flex gap-0 md:gap-8 text-fluid-sm font-medium text-sub py-1 mb-4 border-b border-border">
          <Button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            variant="ghost"
            size="small"
            class="flex-1 md:flex-none pb-2 border-b-2 rounded-none"
            :class="activeTab === tab.key 
              ? 'border-brand-dark text-brand-darkDarker' 
              : 'border-transparent text-sub hover:text-body hover:border-border'"
          >
            <div class="flex items-center justify-center gap-1.5">
              <i :class="[getTabIcon(tab.key), 'text-sm', activeTab === tab.key ? 'text-brand-darkDarker' : 'text-sub']"></i>
              <span class="hidden md:inline whitespace-nowrap" :class="activeTab === tab.key ? 'text-brand-darkDarker' : 'text-sub'">{{ tab.label }}</span>
            </div>
          </Button>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomersStore } from '@/stores/customers'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { Button } from '@motork/component-library'
import { Card, CardHeader, CardTitle } from '@motork/component-library/future/primitives'
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

// Watch for tab changes to update persistence
watch(activeTab, (newTab) => {
  if (newTab && ['manual', 'upload', 'integrations'].includes(newTab)) {
    // Tab persistence is handled by useTabPersistence composable
  }
})

const tabs = [
  {
    key: 'manual',
    label: 'Manual'
  },
  {
    key: 'upload',
    label: 'Upload'
  },
  {
    key: 'integrations',
    label: 'Integrations'
  }
]

// Icon mapping for tabs
const getTabIcon = (tabKey) => {
  const iconMap = {
    manual: 'fa-solid fa-pen',
    upload: 'fa-solid fa-upload',
    integrations: 'fa-solid fa-plug'
  }
  return iconMap[tabKey] || 'fa-solid fa-circle'
}

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
