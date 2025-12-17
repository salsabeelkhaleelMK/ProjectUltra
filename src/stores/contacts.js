import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchContacts, fetchContactById, createContact, updateContact, deleteContact } from '@/api/contacts'

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
  async function loadContacts() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchContacts({ search: searchQuery.value })
      contacts.value = result.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function loadContactById(id) {
    loading.value = true
    error.value = null
    try {
      currentContact.value = await fetchContactById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function addContact(contactData) {
    loading.value = true
    error.value = null
    try {
      const newContact = await createContact(contactData)
      contacts.value.unshift(newContact)
      return newContact
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function modifyContact(id, updates) {
    loading.value = true
    error.value = null
    try {
      const updatedContact = await updateContact(id, updates)
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
  
  async function removeContact(id) {
    loading.value = true
    error.value = null
    try {
      await deleteContact(id)
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
    loadContacts()
  }
  
  return {
    contacts,
    currentContact,
    loading,
    error,
    searchQuery,
    totalContacts,
    loadContacts,
    loadContactById,
    addContact,
    modifyContact,
    removeContact,
    setSearchQuery
  }
})

