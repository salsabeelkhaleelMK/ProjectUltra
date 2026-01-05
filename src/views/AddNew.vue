<template>
  <div class="page-container">
    <PageHeader title="Add New Customer" subtitle="Create contacts, leads, or opportunities" />
    
    <div class="p-4 md:p-8">
      <UnifiedAddForm ref="formRef" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import PageHeader from '@/components/layout/PageHeader.vue'
import UnifiedAddForm from '@/components/addnew/UnifiedAddForm.vue'

const router = useRouter()
const contactsStore = useContactsStore()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

const formRef = ref(null)

const handleSubmit = async (formData) => {
  try {
    const { contactMode, selectedContact, contactData, vehicleData, markAsLead, markAsOpportunity } = formData
    
    // Step 1: Get or create contact
    let contact = selectedContact
    if (contactMode === 'new') {
      contact = await contactsStore.addContact({
        ...contactData,
        initials: contactData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        source: 'Direct',
        tags: []
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
        // Save vehicle to contact
        await contactsStore.addRequestedCarToContact(contact.id, vehicleData)
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
    if (formRef.value) {
      formRef.value.resetSubmitting()
    }
  }
}
</script>

