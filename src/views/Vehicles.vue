<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="page-header-title">Vehicles Inventory</h1>
          <p class="page-header-subtitle">{{ vehiclesStore.totalVehicles }} vehicles in inventory</p>
        </div>
        <button 
          class="btn-primary self-start sm:self-auto"
        >
          <i class="fa-solid fa-plus"></i> <span class="hidden sm:inline">Add Vehicle</span><span class="sm:hidden">Add</span>
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
              placeholder="Search vehicles..." 
              class="input-with-icon"
            >
          </div>
        </div>
        <select v-model="filters.status" @change="applyFilters" class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="In Stock">In Stock</option>
          <option value="Sold">Sold</option>
        </select>
        <select v-model="filters.brand" @change="applyFilters" class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
          <option value="">All Brands</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="Audi">Audi</option>
          <option value="Porsche">Porsche</option>
        </select>
      </div>
    </div>
    
    <!-- Vehicles Table -->
    <div class="p-4 md:p-8">
      <div v-if="vehiclesStore.loading" class="empty-state">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
        <p class="empty-state-text">Loading vehicles...</p>
      </div>
      
      <div v-else-if="vehiclesStore.vehicles.length === 0" class="empty-state">
        <i class="fa-solid fa-car empty-state-icon"></i>
        <p class="empty-state-text">No vehicles found</p>
      </div>
      
      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto -mx-4 md:mx-0">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  <input type="checkbox" class="rounded">
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Vehicle</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Price</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Kilometers</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Stock Days</th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Requested By</th>
                <th class="px-3 md:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="vehicle in vehiclesStore.vehicles" 
                :key="vehicle.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td class="px-3 md:px-6 py-4 whitespace-nowrap" @click.stop>
                  <input type="checkbox" class="rounded">
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-3">
                    <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-car text-lg md:text-2xl text-gray-400"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="font-semibold text-gray-900 text-xs truncate max-w-[120px] md:max-w-none">{{ vehicle.brand }} {{ vehicle.model }}</div>
                      <div class="text-xs text-gray-500">{{ vehicle.year }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 rounded-full text-xs font-semibold"
                    :class="vehicle.status === 'Available' ? 'bg-green-100 text-green-700' : vehicle.status === 'In Stock' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                  >
                    {{ vehicle.status }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span class="text-xs font-bold text-gray-900">€{{ formatCurrency(vehicle.price) }}</span>
                </td>
                <td class="px-3 md:px-6 py-4 text-xs text-gray-600 whitespace-nowrap hidden md:table-cell">
                  {{ formatNumber(vehicle.kilometers) }} km
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span 
                    class="text-xs font-medium"
                    :class="vehicle.stockDays > 300 ? 'text-red-600' : 'text-gray-600'"
                  >
                    {{ vehicle.stockDays }} days
                  </span>
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                  <div v-if="vehicle.requestedBy && vehicle.requestedBy.length > 0" class="flex flex-wrap gap-1">
                    <span 
                      v-for="(requester, idx) in vehicle.requestedBy.slice(0, 2)" 
                      :key="idx"
                      class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      {{ requester }}
                    </span>
                    <span v-if="vehicle.requestedBy.length > 2" class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                      +{{ vehicle.requestedBy.length - 2 }}
                    </span>
                  </div>
                  <span v-else class="text-xs text-gray-400">-</span>
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
            Showing {{ vehiclesStore.vehicles.length }} of {{ vehiclesStore.totalVehicles }} vehicles
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
import { useVehiclesStore } from '@/stores/vehicles'

const vehiclesStore = useVehiclesStore()

const searchQuery = ref('')
const filters = ref({
  status: '',
  brand: ''
})

onMounted(() => {
  vehiclesStore.loadVehicles()
})

const handleSearch = () => {
  vehiclesStore.setFilters({ search: searchQuery.value })
}

const applyFilters = () => {
  vehiclesStore.setFilters(filters.value)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>
