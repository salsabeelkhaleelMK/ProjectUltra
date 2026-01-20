<template>
  <div class="bg-greys-100 rounded-xl p-1 flex flex-col" style="background-color: var(--base-muted, #f5f5f5)">
    <div
      class="bg-white rounded-lg shadow-sm flex flex-col"
      style="box-shadow: var(--nsc-card-shadow);"
    >
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div class="px-4 py-4 pb-4 border-b border-black/5">
          <div class="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div v-for="n in 5" :key="`row-${n}`" class="flex items-center gap-4">
              <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Actual Content -->
      <template v-else>
        <!-- Title Section -->
        <div class="px-4 py-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <Trophy :size="16" class="text-heading" />
            <h3 class="text-lg font-medium text-heading leading-5">Best performers</h3>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              This month
              <ChevronDown :size="16" class="ml-1" />
            </Button>
          </div>
        </div>
        
        <DataTable 
          :data="teamMembers" 
          :columns="columns"
          :pagination="pagination"
          :sorting="sorting"
          :pagination-options="{
            rowCount: teamMembers.length,
            pageSizeOptions: [10, 20, 50]
          }"
          @update:pagination="pagination = $event"
          @update:sorting="sorting = $event"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { ChevronDown, Trophy } from 'lucide-vue-next'
import { DataTable } from '@motork/component-library/future/components'
import { Button, Avatar, AvatarFallback } from '@motork/component-library/future/primitives'

const props = defineProps({
  teamMembers: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const sorting = ref([])

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0][0].toUpperCase()
}

// DataTable columns configuration
const columns = computed(() => [
  {
    accessorKey: 'name',
    header: () => 'Name',
    meta: { title: 'Name' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h(Avatar, { class: 'h-8 w-8' }, {
          default: () => h(AvatarFallback, 
            { class: 'bg-greys-300 text-greys-900 text-sm' },
            () => getInitials(member.name)
          )
        }),
        h('span', { class: 'text-fluid-sm font-medium text-greys-900' }, member.name)
      ])
    }
  },
  {
    accessorKey: 'leads',
    header: () => 'Leads',
    meta: { title: 'Leads' },
    cell: ({ row }) => {
      return h('div', { class: 'text-fluid-sm text-greys-900' }, row.original.leads)
    }
  },
  {
    accessorKey: 'qualifiedLeads',
    header: () => 'Qualified',
    meta: { title: 'Qualified' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'text-fluid-sm text-greys-900' }, [
        h('span', member.qualifiedLeads),
        h('span', { class: 'text-greys-500 text-fluid-xs ml-1' }, `(${member.qualifiedPercentage}%)`)
      ])
    }
  },
  {
    accessorKey: 'opportunities',
    header: () => 'Opportunities',
    meta: { title: 'Opportunities' },
    cell: ({ row }) => {
      return h('div', { class: 'text-fluid-sm text-greys-900' }, row.original.opportunities)
    }
  },
  {
    accessorKey: 'inNegotiation',
    header: () => 'In Negotiation',
    meta: { title: 'In Negotiation' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'text-fluid-sm text-greys-900' }, [
        h('span', member.inNegotiation),
        h('span', { class: 'text-greys-500 text-fluid-xs ml-1' }, `(${member.inNegotiationPercentage}%)`)
      ])
    }
  },
  {
    accessorKey: 'won',
    header: () => 'Won',
    meta: { title: 'Won' },
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'text-fluid-sm text-greys-900' }, [
        h('span', member.won),
        h('span', { class: 'text-greys-500 text-fluid-xs ml-1' }, `(${member.wonPercentage}%)`)
      ])
    }
  }
])
</script>

