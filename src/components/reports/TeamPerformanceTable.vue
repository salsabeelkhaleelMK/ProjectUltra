<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-4 md:p-5 border-b border-gray-200">
      <h2 class="heading-main">Team Performance</h2>
    </div>
    
    <div class="table-wrapper w-full">
      <DataTable 
        :data="teamMembers" 
        :columns="columns"
        v-model:pagination="pagination"
        v-model:globalFilter="globalFilter"
        v-model:sorting="sorting"
        :paginationOptions="{
          rowCount: teamMembers.length
        }"
        :globalFilterOptions="{
          debounce: 300
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { DataTable } from '@motork/component-library/future/components'

const props = defineProps({
  teamMembers: {
    type: Array,
    required: true
  }
})

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])

// DataTable columns configuration
const columns = computed(() => [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { title: 'Name' },
    cell: ({ row }) => {
      return h('div', { class: 'text-sm font-bold text-gray-900' }, row.original.name)
    }
  },
  {
    accessorKey: 'leads',
    header: 'Leads',
    meta: { title: 'Leads' },
    cell: ({ row }) => {
      return h('div', { class: 'text-sm text-gray-700' }, row.original.leads)
    }
  },
  {
    accessorKey: 'qualifiedLeads',
    header: 'Qualified',
    meta: { title: 'Qualified' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'text-sm text-gray-700' }, [
        h('span', member.qualifiedLeads),
        h('span', { class: 'text-gray-500 text-xs ml-1' }, `(${member.qualifiedPercentage}%)`)
      ])
    }
  },
  {
    accessorKey: 'opportunities',
    header: 'Opportunities',
    meta: { title: 'Opportunities' },
    cell: ({ row }) => {
      return h('div', { class: 'text-sm text-gray-700' }, row.original.opportunities)
    }
  },
  {
    accessorKey: 'inNegotiation',
    header: 'In Negotiation',
    meta: { title: 'In Negotiation' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'text-sm text-gray-700' }, [
        h('span', member.inNegotiation),
        h('span', { class: 'text-gray-500 text-xs ml-1' }, `(${member.inNegotiationPercentage}%)`)
      ])
    }
  },
  {
    accessorKey: 'won',
    header: 'Won',
    meta: { title: 'Won' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'text-sm text-gray-700' }, [
        h('span', member.won),
        h('span', { class: 'text-gray-500 text-xs ml-1' }, `(${member.wonPercentage}%)`)
      ])
    }
  }
])
</script>

