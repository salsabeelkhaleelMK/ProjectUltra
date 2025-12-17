<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="page-header-title">Contacts & Accounts</h1>
          <p class="page-header-subtitle">{{ contactsStore.totalContacts }} contacts</p>
        </div>
        <button 
          @click="showCreateModal = true"
          class="btn-primary self-start sm:self-auto"
        >
          <i class="fa-solid fa-plus"></i> <span class="hidden sm:inline">New Contact</span><span class="sm:hidden">New</span>
        </button>
      </div>
      
      <!-- Search & Filters -->
      <div class="mt-4 md:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="flex-1 min-w-0 sm:max-w-md">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search contacts..." 
              class="input-with-icon"
            >
          </div>
        </div>
        <button class="btn-secondary text-sm">
          <i class="fa-solid fa-filter mr-2"></i> Filters
        </button>
      </div>
    </div>
    
    <!-- Contacts Table -->
    <div class="p-4 md:p-8">
      <div v-if="contactsStore.loading" class="empty-state">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
        <p class="empty-state-text">Loading contacts...</p>
      </div>
      
      <div v-else-if="contactsStore.contacts.length === 0" class="empty-state">
        <i class="fa-solid fa-users empty-state-icon"></i>
        <p class="empty-state-text">No contacts found</p>
      </div>
      
      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto -mx-4 md:mx-0">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  <input type="checkbox" class="rounded">
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Company</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Phone</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Source</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Tags</th>
                <th class="px-3 md:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="contact in contactsStore.contacts" 
                :key="contact.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td class="px-3 md:px-6 py-4 whitespace-nowrap" @click.stop>
                  <input type="checkbox" class="rounded">
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-3">
                    <div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {{ contact.initials }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none">{{ contact.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-4 text-xs text-gray-600 whitespace-nowrap">
                  <span class="truncate block max-w-[100px]">{{ contact.company || '-' }}</span>
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div class="text-xs text-gray-600 truncate max-w-[150px]">{{ contact.email }}</div>
                </td>
                <td class="px-3 md:px-6 py-4 text-xs text-gray-600 whitespace-nowrap">
                  {{ contact.phone }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {{ contact.source }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="tag in contact.tags" 
                      :key="tag"
                      class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="!contact.tags || contact.tags.length === 0" class="text-xs text-gray-400">-</span>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap" @click.stop>
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div class="text-xs text-gray-600">
            Showing {{ contactsStore.contacts.length }} of {{ contactsStore.totalContacts }} contacts
          </div>
          <div class="flex items-center gap-1 md:gap-2 flex-wrap">
            <button class="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-200 rounded hover:bg-gray-50 whitespace-nowrap">Previous</button>
            <button class="px-2 md:px-3 py-1 text-xs md:text-sm bg-blue-600 text-white rounded">1</button>
            <button class="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button class="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-200 rounded hover:bg-gray-50 whitespace-nowrap">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'

const contactsStore = useContactsStore()
const searchQuery = ref('')
const showCreateModal = ref(false)

onMounted(() => {
  contactsStore.loadContacts()
})

const handleSearch = () => {
  contactsStore.setSearchQuery(searchQuery.value)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
