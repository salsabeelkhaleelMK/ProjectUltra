<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Vehicles Inventory">
      <template #actions>
      </template>
    </PageHeader>
    
    <!-- Content with padding -->
    <div class="p-4 md:p-8">
      <!-- Filter Tabs -->
      <div class="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="tab in vehicleTabs"
          :key="tab.key"
          @click="setVehicleFilter(tab.key)"
          class="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-border rounded-lg cursor-pointer hover:shadow-sm transition-all shrink-0 min-w-[160px] border-t-4"
          :class="vehicleFilter === tab.key ? tab.borderColor : 'border-t-border'"
        >
          <span class="text-sm font-medium text-foreground whitespace-nowrap">{{ tab.label }}</span>
          <Badge
            :text="String(tab.count)"
            size="small"
            :theme="vehicleFilter === tab.key ? 'blue' : 'gray'"
          />
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper w-full">
        <DataTable 
          :data="filteredVehicles" 
          :columns="columns"
          :loading="vehiclesStore.loading"
          :meta="tableMeta"
          @row-click="handleRowClick"
          :columnFiltersOptions="{
            filterDefs: filterDefinitions
          }"
          v-model:pagination="pagination"
          v-model:globalFilter="globalFilter"
          v-model:sorting="sorting"
          v-model:columnFilters="columnFilters"
          :paginationOptions="{
            rowCount: filteredVehicles.length
          }"
          :globalFilterOptions="{
            debounce: 300,
            placeholder: 'Q Search or ask a question'
          }"
        >
          <!-- Toolbar slot for action buttons -->
          <template #toolbar>
            <div class="flex items-center justify-end gap-3">
              <button 
                v-if="vehicleFilter === 'customer-vehicles'" 
                @click="showAddModal = true" 
                class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <i class="fa-solid fa-plus"></i>
                <span>Add new</span>
              </button>
              <button 
                class="group flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                <i class="fa-solid fa-arrow-left text-gray-400 group-hover:text-purple-500"></i>
                <span class="hidden sm:inline">Switch back to old design</span>
              </button>
            </div>
          </template>
          
          <template #empty-state>
            <div class="empty-state">
              <i class="fa-solid fa-car empty-state-icon"></i>
              <p class="empty-state-text">No vehicles found</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Add Vehicle Modal -->
    <ModalShell
      :show="showAddModal"
      title="Add Customer Vehicle"
      subtitle="Fill in the details for the new customer vehicle."
      @close="handleCloseModal"
      size="lg"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Vehicle Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block label-upper mb-2">Brand</label>
            <input 
              v-model="newVehicle.brand"
              type="text" 
              placeholder="e.g., Volkswagen" 
              class="input"
              required
            >
          </div>
          <div>
            <label class="block label-upper mb-2">Model</label>
            <input 
              v-model="newVehicle.model"
              type="text" 
              placeholder="e.g., ID.4" 
              class="input"
              required
            >
          </div>
          <div>
            <label class="block label-upper mb-2">Year</label>
            <input 
              v-model="newVehicle.year"
              type="number" 
              placeholder="e.g., 2024" 
              class="input"
              min="1900"
              :max="new Date().getFullYear() + 1"
              required
            >
          </div>
        </div>

        <!-- Identification -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block label-upper mb-2">VIN</label>
            <input 
              v-model="newVehicle.vin"
              type="text" 
              placeholder="Vehicle Identification Number" 
              class="input"
            >
          </div>
          <div>
            <label class="block label-upper mb-2">Plates</label>
            <input 
              v-model="newVehicle.plates"
              type="text" 
              placeholder="License plate number" 
              class="input"
            >
          </div>
        </div>

        <!-- Vehicle Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block label-upper mb-2">Fuel Type</label>
            <select v-model="newVehicle.fuelType" class="input">
              <option value="">Select fuel type...</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid</option>
            </select>
          </div>
          <div>
            <label class="block label-upper mb-2">Gear Type</label>
            <select v-model="newVehicle.gearType" class="input">
              <option value="">Select gear type...</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          <div>
            <label class="block label-upper mb-2">Mileage (km)</label>
            <input 
              v-model.number="newVehicle.kilometers"
              type="number" 
              placeholder="0" 
              class="input"
              min="0"
            >
          </div>
        </div>

        <!-- Registration & Ownership -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block label-upper mb-2">Registered At</label>
            <input 
              v-model="newVehicle.registration"
              type="text" 
              placeholder="MM/YYYY (e.g., 01/2024)" 
              class="input"
            >
          </div>
          <div>
            <label class="block label-upper mb-2">Owned Since</label>
            <input 
              v-model="newVehicle.ownedSince"
              type="text" 
              placeholder="MM/YYYY (e.g., 01/2024)" 
              class="input"
            >
          </div>
        </div>

        <!-- Owner Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block label-upper mb-2">Owner</label>
            <input 
              v-model="newVehicle.owner"
              type="text" 
              placeholder="Owner name" 
              class="input"
            >
          </div>
          <div>
            <label class="block label-upper mb-2">Ownership Type</label>
            <select v-model="newVehicle.ownershipType" class="input">
              <option value="">Select ownership type...</option>
              <option value="Private">Private</option>
              <option value="Company">Company</option>
              <option value="Lease">Lease</option>
              <option value="Fleet">Fleet</option>
            </select>
          </div>
        </div>

        <!-- Warranty -->
        <div>
          <label class="block label-upper mb-2">Warranty Info</label>
          <textarea 
            v-model="newVehicle.warrantyInfo"
            rows="3"
            placeholder="Warranty information..." 
            class="input"
          ></textarea>
        </div>
      </form>

      <template #actions>
        <Button
          label="Cancel"
          variant="outline"
          @click="handleCloseModal"
        />
        <Button
          label="Add Vehicle"
          variant="primary"
          @click="handleSubmit"
        />
      </template>
    </ModalShell>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'
import PageHeader from '@/components/layout/PageHeader.vue'
import ModalShell from '@/components/shared/ModalShell.vue'
import { DataTable } from '@motork/component-library/future/components'
import { Button, Badge } from '@motork/component-library'

const router = useRouter()

const vehiclesStore = useVehiclesStore()

// Vehicle filter state
const vehicleFilter = ref('in-stock') // 'in-stock' or 'customer-vehicles'

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([])

// Filter vehicles based on active filter
const filteredVehicles = computed(() => {
  if (vehicleFilter.value === 'in-stock') {
    // In stock: vehicles with stockDays !== null
    return vehiclesStore.vehicles.filter(v => v.stockDays !== null && v.stockDays !== undefined)
  } else {
    // Customer vehicles: vehicles with stockDays === null or undefined
    return vehiclesStore.vehicles.filter(v => v.stockDays === null || v.stockDays === undefined)
  }
})

// Vehicle tabs
const vehicleTabs = computed(() => [
  {
    key: 'in-stock',
    label: 'In stock',
    count: vehiclesStore.vehicles.filter(v => v.stockDays !== null && v.stockDays !== undefined).length,
    borderColor: 'border-t-blue-600'
  },
  {
    key: 'customer-vehicles',
    label: "Customers' vehicles",
    count: vehiclesStore.vehicles.filter(v => v.stockDays === null || v.stockDays === undefined).length,
    borderColor: 'border-t-purple-600'
  }
])

const setVehicleFilter = (key) => {
  vehicleFilter.value = key
}

// Add Vehicle Modal State
const showAddModal = ref(false)
const newVehicle = ref({
  brand: '',
  model: '',
  year: '',
  vin: '',
  plates: '',
  fuelType: '',
  gearType: '',
  kilometers: '',
  registration: '',
  owner: '',
  ownershipType: '',
  ownedSince: '',
  warrantyInfo: '',
  stockDays: null // Customer vehicles have null stockDays
})

const handleCloseModal = () => {
  showAddModal.value = false
  // Reset form
  newVehicle.value = {
    brand: '',
    model: '',
    year: '',
    vin: '',
    plates: '',
    fuelType: '',
    gearType: '',
    kilometers: '',
    registration: '',
    owner: '',
    ownershipType: '',
    ownedSince: '',
    warrantyInfo: '',
    stockDays: null
  }
}

const handleSubmit = async () => {
  try {
    const vehicleData = {
      brand: newVehicle.value.brand,
      model: newVehicle.value.model,
      year: parseInt(newVehicle.value.year) || null,
      vin: newVehicle.value.vin || null,
      plates: newVehicle.value.plates || null,
      fuelType: newVehicle.value.fuelType || null,
      gearType: newVehicle.value.gearType || null,
      kilometers: parseInt(newVehicle.value.kilometers) || 0,
      registration: newVehicle.value.registration || null,
      owner: newVehicle.value.owner || null,
      ownershipType: newVehicle.value.ownershipType || null,
      ownedSince: newVehicle.value.ownedSince || null,
      warrantyInfo: newVehicle.value.warrantyInfo || null,
      stockDays: null, // Customer vehicles have null stockDays
      status: 'Available'
    }
    
    await vehiclesStore.addVehicle(vehicleData)
    handleCloseModal()
  } catch (error) {
    console.error('Error adding vehicle:', error)
  }
}

// Filter definitions for AI-powered filtering
const filterDefinitions = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    operators: [
      { value: 'eq', label: 'is' },
      { value: 'ne', label: 'is not' }
    ],
    options: [
      { value: 'Available', label: 'Available' },
      { value: 'In Stock', label: 'In Stock' },
      { value: 'Sold', label: 'Sold' }
    ],
    aiHint: 'Vehicle availability status'
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'multiselect',
    operators: [
      { value: 'in', label: 'is any of' },
      { value: 'notIn', label: 'is none of' }
    ],
    options: [
      { value: 'Volkswagen', label: 'Volkswagen' },
      { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
      { value: 'Audi', label: 'Audi' },
      { value: 'Porsche', label: 'Porsche' }
    ],
    aiHint: 'Car manufacturer brand'
  },
  {
    key: 'price',
    label: 'Price',
    type: 'inputrange',
    inputType: 'number',
    operators: [
      { value: 'between', label: 'is between' },
      { value: 'gte', label: 'is at least' },
      { value: 'lte', label: 'is at most' }
    ],
    prefix: '€',
    aiHint: 'Vehicle price in euros'
  },
  {
    key: 'stockDays',
    label: 'Stock Days',
    type: 'inputrange',
    inputType: 'number',
    operators: [
      { value: 'between', label: 'is between' },
      { value: 'gte', label: 'is at least' },
      { value: 'lte', label: 'is at most' }
    ],
    aiHint: 'Number of days in stock'
  }
]

onMounted(() => {
  vehiclesStore.loadVehicles()
})

// Handle row click - navigate to vehicle detail or show vehicle info
const handleRowClick = (row) => {
  const vehicle = row.original || row
  // For now, we can navigate to a vehicle detail page if it exists
  // Or you could open a modal with vehicle details
  // Since there's no vehicle detail route yet, we'll just log it
  // You can add navigation here when vehicle detail page is created
  // router.push({ path: `/vehicles/${vehicle.id}` })
  console.log('Vehicle clicked:', vehicle)
}


const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

// Table meta for row styling
const tableMeta = computed(() => ({
  class: {
    tr: () => 'cursor-pointer hover:bg-gray-50 transition-colors'
  }
}))

// Helper to get vehicle type
const getVehicleType = (vehicle) => {
  if (vehicle.kilometers === 0) {
    return vehicle.year === new Date().getFullYear() ? 'New' : 'New 0km'
  }
  // Could check other conditions for Demo, but for now use Used
  return 'Used'
}

// Helper to format registration date
const formatRegistration = (registration) => {
  if (!registration) return 'N/A'
  // If it's already formatted (MM/YYYY), return as is
  if (typeof registration === 'string' && registration.includes('/')) {
    return registration
  }
  // Otherwise try to format
  return registration
}

// DataTable columns configuration - dynamic based on filter
const columns = computed(() => {
  if (vehicleFilter.value === 'in-stock') {
    // In stock columns
    return [
      {
        accessorKey: 'image',
        header: 'Photo',
        meta: {
          title: 'Photo'
        },
        cell: ({ row }) => {
          const vehicle = row.original
          if (vehicle.image) {
            return h('img', {
              src: vehicle.image,
              alt: `${vehicle.brand} ${vehicle.model}`,
              class: 'w-16 h-16 object-cover rounded-md'
            })
          }
          return h('div', { class: 'w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center shrink-0' }, [
            h('i', { class: 'fa-solid fa-car text-2xl text-gray-400' })
          ])
        }
      },
      {
        accessorKey: 'brand',
        header: 'Vehicle',
        meta: {
          title: 'Vehicle'
        },
        cell: ({ row }) => {
          const vehicle = row.original
          return h('div', [
            h('div', { class: 'text-content-bold' }, `${vehicle.brand} ${vehicle.model}`),
            h('div', { class: 'text-meta' }, vehicle.year)
          ])
        }
      },
      {
        accessorKey: 'type',
        header: 'Type',
        meta: {
          title: 'Type'
        },
        cell: ({ row }) => {
          const vehicle = row.original
          const type = getVehicleType(vehicle)
          return h('span', { class: 'text-sm text-gray-600' }, type)
        }
      },
      {
        accessorKey: 'engine',
        header: 'Engine',
        meta: {
          title: 'Engine'
        },
        cell: ({ row }) => {
          // Engine info not in mock data, show N/A
          return h('span', { class: 'text-sm text-gray-600' }, 'N/A')
        }
      },
      {
        accessorKey: 'fuelType',
        header: 'Fuel type',
        meta: {
          title: 'Fuel type'
        },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600' }, row.original.fuelType || 'N/A')
        }
      },
      {
        accessorKey: 'gearType',
        header: 'Gear type',
        meta: {
          title: 'Gear type'
        },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600' }, row.original.gearType || 'N/A')
        }
      },
      {
        accessorKey: 'registration',
        header: 'Registered at',
        meta: {
          title: 'Registered at'
        },
        cell: ({ row }) => {
          const vehicle = row.original
          return h('span', { class: 'text-sm text-gray-600' }, formatRegistration(vehicle.registration) || 'N/A')
        }
      },
      {
        accessorKey: 'kilometers',
        header: 'Mileage',
        meta: {
          title: 'Mileage'
        },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600' }, `${formatNumber(row.original.kilometers)} km`)
        }
      },
      {
        accessorKey: 'stockDays',
        header: 'Days in stock',
        meta: {
          title: 'Days in stock'
        },
        cell: ({ row }) => {
          const stockDays = row.original.stockDays
          const textClass = stockDays > 300 ? 'text-red-600' : 'text-gray-600'
          return h('span', { class: `text-sm font-medium ${textClass}` }, `${stockDays} days`)
        }
      },
      {
        accessorKey: 'dealership',
        header: 'Dealership',
        meta: {
          title: 'Dealership'
        },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600' }, row.original.dealership || 'N/A')
        }
      },
      {
        accessorKey: 'status',
        header: 'Availability',
        meta: {
          title: 'Availability'
        },
        cell: ({ row }) => {
          const status = row.original.status
          const theme = status === 'Available' 
            ? 'green' 
            : status === 'In Stock' 
            ? 'blue' 
            : 'gray'
          return h(Badge, { 
            text: status,
            size: 'small',
            theme: theme
          })
        }
      }
    ]
  } else {
    // Customers' vehicles columns
    return [
      {
        accessorKey: 'brand',
        header: 'Vehicle',
        meta: {
          title: 'Vehicle'
        },
        cell: ({ row }) => {
          const vehicle = row.original
          return h('div', [
            h('div', { class: 'text-content-bold' }, `${vehicle.brand} ${vehicle.model}`),
            h('div', { class: 'text-meta' }, vehicle.year)
          ])
        }
      },
      {
        accessorKey: 'plates',
        header: 'Plates',
        meta: {
          title: 'Plates'
        },
        cell: ({ row }) => {
          // Plates not in mock data, derive from VIN or show N/A
          const vehicle = row.original
          const plates = vehicle.plates || (vehicle.vin ? vehicle.vin.slice(-6) : null) || 'N/A'
          return h('span', { class: 'text-sm text-gray-600' }, plates)
        }
      },
      {
        accessorKey: 'kilometers',
        header: 'Mileage',
        meta: {
          title: 'Mileage'
        },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600' }, `${formatNumber(row.original.kilometers)} km`)
        }
      },
      {
        accessorKey: 'registration',
        header: 'Registered at',
        meta: {
          title: 'Registered at'
        },
        cell: ({ row }) => {
          const vehicle = row.original
          return h('span', { class: 'text-sm text-gray-600' }, formatRegistration(vehicle.registration) || 'N/A')
        }
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        meta: {
          title: 'Owner'
        },
        cell: ({ row }) => {
          // Owner not in mock data, show N/A or derive from requestedBy
          const vehicle = row.original
          const owner = vehicle.owner || (vehicle.requestedBy && vehicle.requestedBy.length > 0 ? vehicle.requestedBy[0] : null) || 'N/A'
          return h('span', { class: 'text-sm text-gray-600' }, owner)
        }
      },
      {
        accessorKey: 'ownershipType',
        header: 'Ownership type',
        meta: {
          title: 'Ownership type'
        },
        cell: ({ row }) => {
          // Ownership type not in mock data
          return h('span', { class: 'text-sm text-gray-600' }, 'N/A')
        }
      },
      {
        accessorKey: 'ownedSince',
        header: 'Owned since',
        meta: {
          title: 'Owned since'
        },
        cell: ({ row }) => {
          // Owned since not in mock data, could derive from registration
          const vehicle = row.original
          return h('span', { class: 'text-sm text-gray-600' }, formatRegistration(vehicle.registration) || 'N/A')
        }
      },
      {
        accessorKey: 'warrantyInfo',
        header: 'Warranty info',
        meta: {
          title: 'Warranty info'
        },
        cell: ({ row }) => {
          // Warranty info not in mock data
          return h('span', { class: 'text-sm text-gray-600' }, 'N/A')
        }
      }
    ]
  }
})
</script>
