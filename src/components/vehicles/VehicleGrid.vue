<template>
  <DataTable 
    :data="filteredVehicles" 
    :columns="columns"
    :loading="loading"
    :meta="tableMeta"
    @row-click="$emit('row-click', $event)"
    :columnFiltersOptions="{
      filterDefs: filterDefinitions
    }"
    v-model:pagination="paginationModel"
    v-model:globalFilter="globalFilterModel"
    v-model:sorting="sortingModel"
    v-model:columnFilters="columnFiltersModel"
    :paginationOptions="{
      rowCount: filteredVehicles.length
    }"
    :globalFilterOptions="{
      debounce: 300,
      placeholder: 'Q Search or ask a question'
    }"
    class="h-full"
  >
    <!-- Toolbar slot for action buttons -->
    <template #toolbar>
      <slot name="toolbar" />
    </template>
    
    <template #empty-state>
      <div class="empty-state">
        <i class="fa-solid fa-car empty-state-icon"></i>
        <p class="empty-state-text">No vehicles found</p>
      </div>
    </template>
  </DataTable>
</template>

<script setup>
import { computed } from 'vue'
import { DataTable } from '@motork/component-library/future/components'

const props = defineProps({
  filteredVehicles: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  tableMeta: {
    type: Object,
    required: true
  },
  filterDefinitions: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    required: true
  },
  globalFilter: {
    type: String,
    required: true
  },
  sorting: {
    type: Array,
    required: true
  },
  columnFilters: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['row-click', 'update:pagination', 'update:globalFilter', 'update:sorting', 'update:columnFilters'])

const paginationModel = computed({
  get: () => props.pagination,
  set: (value) => emit('update:pagination', value)
})

const globalFilterModel = computed({
  get: () => props.globalFilter,
  set: (value) => emit('update:globalFilter', value)
})

const sortingModel = computed({
  get: () => props.sorting,
  set: (value) => emit('update:sorting', value)
})

const columnFiltersModel = computed({
  get: () => props.columnFilters,
  set: (value) => emit('update:columnFilters', value)
})
</script>

<style scoped>
/* DataTable styling overrides to match reference design */
:deep(thead),
:deep(thead th),
:deep(thead tr),
:deep(thead tr th) {
  background-color: transparent !important;
  background: transparent !important;
  border-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(div[data-slot='frame-panel'].relative.bg-clip-padding) {
  background-color: rgba(245, 245, 245, 1) !important;
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
}

:deep(footer.flex.items-center.justify-between) {
  background-color: rgba(245, 245, 245, 1) !important;
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

:deep([data-radix-avatar-fallback]),
:deep(.avatar-fallback),
:deep(span[class*='AvatarFallback']) {
  background-color: #d4d4d4 !important;
}

/* Table border overrides - make borders very subtle */
:deep(table),
:deep(tbody),
:deep(tbody tr),
:deep(tbody td),
:deep(thead),
:deep(thead th) {
  border-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(tbody tr) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

:deep(tbody tr:last-child) {
  border-bottom: none !important;
}

/* Remove any dark borders from table container */
:deep([data-slot="table-container"]),
:deep(.table-wrapper) {
  border: none !important;
}

/* Frame panel - should have gray background */
:deep([data-slot="frame-panel"]) {
  background-color: rgba(245, 245, 245, 1) !important;
  padding: 1rem !important;
}

/* Pagination dropdown - transparent in footer */
:deep(footer select),
:deep(footer button[role="combobox"]) {
  background-color: transparent !important;
  border: none !important;
}

/* Search input - white background like reference */
:deep(input[type="search"]),
:deep(input[placeholder*="Search"]),
:deep([data-slot="table-search"] input) {
  background-color: white !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* Filter button - white background like reference */
:deep(button[aria-label*="filter"]),
:deep(button[aria-label*="Filter"]),
:deep([data-slot="table-filter"] button) {
  background-color: white !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* Enable horizontal and vertical scrolling */
:deep([data-slot="table-container"]) {
  overflow-x: auto !important;
  overflow-y: auto !important;
  max-height: 600px !important;
}

:deep(table) {
  min-width: 100% !important;
}
</style>

