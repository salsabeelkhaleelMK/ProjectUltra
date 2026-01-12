<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Vehicles Inventory" :subtitle="`${filteredVehicles.length} vehicles`" />
    
    <!-- Content with padding -->
    <div class="p-4 md:p-8">
      <!-- Filter Tabs -->
      <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
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
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-plus text-sm"></i>
              <Button
                label="Add new"
                variant="primary"
                size="large"
              />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useVehiclesStore } from '@/stores/vehicles'
import PageHeader from '@/components/layout/PageHeader.vue'
import { DataTable } from '@motork/component-library/future/components'
import { Button, Badge } from '@motork/component-library'

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
