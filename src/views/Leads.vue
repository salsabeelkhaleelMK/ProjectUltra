<template>
  <div class="h-full overflow-y-auto bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sales</h1>
          <div class="flex items-center gap-4 mt-3">
            <button 
              @click="activeTab = 'open-leads'"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              :class="activeTab === 'open-leads' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              Open Leads <span class="ml-2 bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">{{ leadsStore.openLeads.length }}</span>
            </button>
            <button 
              @click="activeTab = 'opportunities'"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              :class="activeTab === 'opportunities' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              Open opportunities <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">321</span>
            </button>
            <button class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">
              In negotiation <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">211</span>
            </button>
            <button class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">
              Won <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">127</span>
            </button>
            <button class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">
              Lost <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">3</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Search & Filters -->
      <div class="mt-6 flex items-center gap-3 flex-wrap">
        <div class="flex-1 min-w-[300px] max-w-md">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search or ask a question" 
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        
        <select v-model="filters.priority" @change="applyFilters" class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">Priority</option>
          <option value="Hot">Hot</option>
          <option value="Normal">Normal</option>
        </select>
        
        <select v-model="filters.status" @change="applyFilters" class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">Status</option>
          <option value="Open">Open</option>
          <option value="Contacted">Contacted</option>
        </select>
        
        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <i class="fa-solid fa-plus mr-1"></i> More filters
        </button>
        
        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          Clear
        </button>
        
        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          Save
        </button>
      </div>
    </div>
    
    <!-- Leads Table -->
    <div class="p-8">
      <div v-if="leadsStore.loading" class="text-center py-12">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-gray-400"></i>
        <p class="text-gray-500 mt-4">Loading leads...</p>
      </div>
      
      <div v-else-if="leadsStore.leads.length === 0" class="text-center py-12">
        <i class="fa-solid fa-tag text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">No leads found</p>
      </div>
      
      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input type="checkbox" class="rounded">
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Next action due</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requested car</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Car status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assignee</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="lead in leadsStore.leads" 
                :key="lead.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="router.push(`/leads/${lead.id}`)"
              >
                <td class="px-6 py-4" @click.stop>
                  <input type="checkbox" class="rounded">
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {{ lead.customer.initials }}
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ lead.customer.name }}</div>
                      <div class="text-xs text-gray-500">{{ lead.customer.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="text-sm font-medium"
                    :class="lead.priority === 'Hot' ? 'text-red-600' : 'text-gray-600'"
                  >
                    {{ lead.nextActionDue }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <i class="fa-brands fa-volkswagen text-gray-400"></i>
                    <span class="text-sm font-medium text-gray-900">{{ lead.requestedCar.brand }} {{ lead.requestedCar.model }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {{ lead.carStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ lead.source }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {{ lead.assigneeInitials }}
                    </div>
                    <span class="text-sm text-gray-600">{{ lead.assignee }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="inline-flex px-2 py-1 rounded text-xs font-semibold"
                    :class="lead.priority === 'Hot' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
                  >
                    {{ lead.status }}
                  </span>
                </td>
                <td class="px-6 py-4" @click.stop>
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ leadsStore.leads.length }} of {{ leadsStore.totalLeads }} leads
          </div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Previous</button>
            <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button class="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button class="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button class="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'

const router = useRouter()
const leadsStore = useLeadsStore()

const activeTab = ref('open-leads')
const searchQuery = ref('')
const filters = ref({
  priority: '',
  status: ''
})

onMounted(() => {
  leadsStore.loadLeads()
})

const handleSearch = () => {
  leadsStore.setFilters({ search: searchQuery.value })
}

const applyFilters = () => {
  leadsStore.setFilters(filters.value)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

