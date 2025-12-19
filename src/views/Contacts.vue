<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Contacts & Accounts" :subtitle="`${contactsStore.totalContacts} contacts`" />
    
    <!-- Filters + Table -->
    <div class="p-4 md:p-8">
      <!-- Filters row in gray background above table -->
      <div class="mb-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <!-- Left: search + basic filters -->
          <div class="flex flex-wrap items-center gap-2 md:gap-3">
            <div class="w-full sm:w-auto sm:min-w-[260px] sm:max-w-md">
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
              <i class="fa-solid fa-filter mr-1"></i> Filters
            </button>
            
            <button class="btn-secondary text-sm">
              Clear
            </button>
          </div>

          <!-- Right: Add New button aligned to the far right -->
          <div class="flex justify-end">
            <button 
              @click="showCreateModal = true"
              class="btn-primary-lg"
            >
              <i class="fa-solid fa-plus"></i> Add new
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
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
                <th class="px-3 md:px-6 py-3 text-left">
                  <input type="checkbox" class="rounded">
                </th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Contact</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Company</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Email</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Phone</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Source</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap hidden xl:table-cell">Tags</th>
                <th class="px-3 md:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="contact in contactsStore.contacts" 
                :key="contact.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
                  <input type="checkbox" class="rounded">
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-3">
                    <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {{ contact.initials }}
                    </div>
                    <div class="min-w-0">
                      <div class="text-content-bold truncate max-w-[120px] md:max-w-none">{{ contact.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 text-content text-gray-600 whitespace-nowrap">
                  <span class="truncate block max-w-[100px]">{{ contact.company || '-' }}</span>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="text-content text-gray-600 truncate max-w-[150px]">{{ contact.email }}</div>
                </td>
                <td class="px-3 md:px-6 py-3 text-content text-gray-600 whitespace-nowrap">
                  {{ contact.phone }}
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span class="badge-ui bg-gray-100 text-gray-700 font-semibold">
                    {{ contact.source }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap hidden xl:table-cell">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="tag in contact.tags" 
                      :key="tag"
                      class="badge-ui bg-blue-50 text-blue-700 font-semibold"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="!contact.tags || contact.tags.length === 0" class="text-xs text-gray-400">-</span>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
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
          <div class="text-sm text-gray-600">
            Showing {{ contactsStore.contacts.length }} of {{ contactsStore.totalContacts }} contacts
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button class="btn-secondary text-sm whitespace-nowrap">Previous</button>
            <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium">1</button>
            <button class="btn-secondary text-sm">2</button>
            <button class="btn-secondary text-sm whitespace-nowrap">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import PageHeader from '@/components/shared/PageHeader.vue'

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
