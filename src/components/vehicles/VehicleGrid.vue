<template>
  <div class="table-wrapper w-full">
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
  </div>
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

