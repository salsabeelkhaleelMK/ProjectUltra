<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Vehicles Inventory" :subtitle="`${vehiclesStore.totalVehicles} vehicles in inventory`" />
    
    <!-- Filters + Table -->
    <div class="p-4 md:p-8">
      <!-- Add New button -->
      <div class="mb-6 flex justify-end">
        <button class="btn-primary-lg">
          <i class="fa-solid fa-plus"></i> Add new
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper w-full">
        <DataTable 
          :data="vehiclesStore.vehicles" 
          :columns="columns"
          :loading="vehiclesStore.loading"
          :columnFiltersOptions="{
            filterDefs: filterDefinitions
          }"
          v-model:pagination="pagination"
          v-model:globalFilter="globalFilter"
          v-model:sorting="sorting"
          v-model:columnFilters="columnFilters"
          :paginationOptions="{
            rowCount: vehiclesStore.totalVehicles
          }"
          :globalFilterOptions="{
            debounce: 300
          }"
        >
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

const vehiclesStore = useVehiclesStore()

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([])

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

// DataTable columns configuration (TanStack Table format)
const columns = computed(() => [
  {
    accessorKey: 'brand',
    header: 'Vehicle',
    meta: {
      title: 'Vehicle'
    },
    cell: ({ row }) => {
      const vehicle = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h('div', { class: 'w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center shrink-0' }, [
          h('i', { class: 'fa-solid fa-car text-2xl text-gray-400' })
        ]),
        h('div', [
          h('div', { class: 'text-content-bold' }, `${vehicle.brand} ${vehicle.model}`),
          h('div', { class: 'text-meta' }, vehicle.year)
        ])
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      title: 'Status'
    },
    cell: ({ row }) => {
      const status = row.original.status
      const statusClass = status === 'Available' 
        ? 'bg-green-100 text-green-700' 
        : status === 'In Stock' 
        ? 'bg-blue-100 text-blue-700' 
        : 'bg-gray-100 text-gray-700'
      return h('span', { class: `badge-ui font-semibold ${statusClass}` }, status)
    }
  },
  {
    accessorKey: 'price',
    header: 'Price',
    meta: {
      title: 'Price'
    },
    cell: ({ row }) => {
      return h('span', { class: 'text-content-bold' }, `€${formatCurrency(row.original.price)}`)
    }
  },
  {
    accessorKey: 'kilometers',
    header: 'Kilometers',
    meta: {
      title: 'Kilometers'
    },
    cell: ({ row }) => {
      return `${formatNumber(row.original.kilometers)} km`
    }
  },
  {
    accessorKey: 'stockDays',
    header: 'Stock Days',
    meta: {
      title: 'Stock Days'
    },
    cell: ({ row }) => {
      const stockDays = row.original.stockDays
      const textClass = stockDays > 300 ? 'text-red-600' : 'text-gray-600'
      return h('span', { class: `text-content font-medium ${textClass}` }, `${stockDays} days`)
    }
  },
  {
    accessorKey: 'requestedBy',
    header: 'Requested By',
    meta: {
      title: 'Requested By'
    },
    cell: ({ row }) => {
      const requestedBy = row.original.requestedBy
      if (requestedBy && requestedBy.length > 0) {
        const badges = requestedBy.slice(0, 2).map(requester => 
          h('span', { class: 'badge-ui bg-blue-50 text-blue-700 font-semibold' }, requester)
        )
        const extra = requestedBy.length > 2 
          ? h('span', { class: 'badge-ui bg-gray-100 text-gray-600 font-semibold' }, `+${requestedBy.length - 2}`)
          : null
        return h('div', { class: 'flex flex-wrap gap-1' }, [...badges, extra].filter(Boolean))
      }
      return h('span', { class: 'text-meta' }, '-')
    }
  }
])
</script>
