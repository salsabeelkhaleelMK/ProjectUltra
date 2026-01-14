import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as contactsApi from '@/api/contacts'

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref([])
  const currentContact = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  
  // Getters
  const totalContacts = computed(() => contacts.value.length)
  
  // Actions
  const fetchContacts = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await contactsApi.fetchContacts({ search: searchQuery.value })
      contacts.value = result.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const fetchContactById = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentContact.value = await contactsApi.fetchContactById(id)
      return currentContact.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const addContact = async (contactData) => {
    loading.value = true
    error.value = null
    try {
      const newContact = await contactsApi.createContact(contactData)
      contacts.value.unshift(newContact)
      return newContact
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const modifyContact = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updatedContact = await contactsApi.updateContact(id, updates)
      const index = contacts.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contacts.value[index] = updatedContact
      }
      return updatedContact
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const removeContact = async (id) => {
    loading.value = true
    error.value = null
    try {
      await contactsApi.deleteContact(id)
      contacts.value = contacts.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  function setSearchQuery(query) {
    searchQuery.value = query
    fetchContacts()
  }
  
  const addRequestedCar = async (contactId, carData) => {
    loading.value = true
    error.value = null
    try {
      const updatedContact = await contactsApi.addRequestedCarToContact(contactId, carData)
      
      // Update the contact in the store
      const index = contacts.value.findIndex(c => c.id === contactId)
      if (index !== -1) {
        contacts.value[index] = updatedContact
      }
      
      // Update current contact if it's the same one
      if (currentContact.value && currentContact.value.id === contactId) {
        currentContact.value = updatedContact
      }
      
      return updatedContact
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const convertToLead = async (contactId) => {
    loading.value = true
    error.value = null
    try {
      const newLead = await contactsApi.convertContactToLead(contactId)
      
      // Remove from contacts
      contacts.value = contacts.value.filter(c => c.id !== contactId)
      
      // Clear current contact
      currentContact.value = null
      
      return newLead
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const convertToOpportunity = async (contactId) => {
    loading.value = true
    error.value = null
    try {
      const newOpp = await contactsApi.convertContactToOpportunity(contactId)
      
      // Remove from contacts
      contacts.value = contacts.value.filter(c => c.id !== contactId)
      
      // Clear current contact
      currentContact.value = null
      
      return newOpp
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    contacts,
    currentContact,
    loading,
    error,
    searchQuery,
    totalContacts,
    fetchContacts,
    fetchContactById,
    addContact,
    modifyContact,
    removeContact,
    setSearchQuery,
    addRequestedCar,
    convertToLead,
    convertToOpportunity
  }
})



