<template>
  <div class="overflow-y-auto space-y-4">
    <!-- Quick Filters Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="label-upper">Quick Filters</h3>
        <button 
          v-if="hasActiveFilters"
          @click="$emit('clear-all')"
          class="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase"
        >
          Clear
        </button>
      </div>
      
      <div class="space-y-2.5">
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">Only mine</span>
          <div 
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="modelValue.onlyMine ? 'bg-blue-600' : 'bg-gray-300'"
            @click="updateFilter('onlyMine', !modelValue.onlyMine)"
          >
            <div 
              class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
              :class="modelValue.onlyMine ? 'left-[17px]' : 'left-0.5'"
            ></div>
          </div>
        </label>
        
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">Most relevant</span>
          <div 
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="modelValue.mostRelevant ? 'bg-blue-600' : 'bg-gray-300'"
            @click="updateFilter('mostRelevant', !modelValue.mostRelevant)"
          >
            <div 
              class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
              :class="modelValue.mostRelevant ? 'left-[17px]' : 'left-0.5'"
            ></div>
          </div>
        </label>
        
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">Include cancelled</span>
          <div 
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="modelValue.includeCancelled ? 'bg-blue-600' : 'bg-gray-300'"
            @click="updateFilter('includeCancelled', !modelValue.includeCancelled)"
          >
            <div 
              class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
              :class="modelValue.includeCancelled ? 'left-[17px]' : 'left-0.5'"
            ></div>
          </div>
        </label>
        
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">No-shows only</span>
          <div 
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="modelValue.noShowsOnly ? 'bg-blue-600' : 'bg-gray-300'"
            @click="updateFilter('noShowsOnly', !modelValue.noShowsOnly)"
          >
            <div 
              class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
              :class="modelValue.noShowsOnly ? 'left-[17px]' : 'left-0.5'"
            ></div>
          </div>
        </label>
      </div>
    </div>
    
    <!-- Event Type Filter Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 class="label-upper mb-3">Event Types</h3>
      <input 
        :value="eventTypeSearch"
        @input="$emit('update:event-type-search', $event.target.value)"
        type="text" 
        placeholder="Search..." 
        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-blue-500"
      >
      <div class="space-y-1 max-h-48 overflow-y-auto">
        <label 
          v-for="type in filteredEventTypes" 
          :key="type.value"
          class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
        >
          <input 
            type="checkbox" 
            :value="type.value"
            :checked="modelValue.eventTypes.includes(type.value)"
            @change="toggleArrayFilter('eventTypes', type.value)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700">{{ type.label }}</span>
        </label>
      </div>
    </div>
    
    <!-- Dealership Filter Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 class="label-upper mb-3">Dealerships</h3>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <label 
          v-for="d in dealerships" 
          :key="d"
          class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
        >
          <input 
            type="checkbox" 
            :value="d"
            :checked="modelValue.dealerships.includes(d)"
            @change="toggleArrayFilter('dealerships', d)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700">{{ d }}</span>
        </label>
      </div>
    </div>
    
    <!-- Team Filter Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 class="label-upper mb-3">Teams</h3>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <label 
          v-for="t in teams" 
          :key="t"
          class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
        >
          <input 
            type="checkbox" 
            :value="t"
            :checked="modelValue.teams.includes(t)"
            @change="toggleArrayFilter('teams', t)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700">{{ t }}</span>
        </label>
      </div>
    </div>
    
    <!-- Users Filter Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 class="label-upper mb-3">Users</h3>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <label 
          v-for="u in users" 
          :key="u.id"
          class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
        >
          <input 
            type="checkbox" 
            :value="u.id"
            :checked="modelValue.users.includes(u.id)"
            @change="toggleArrayFilter('users', u.id)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700">{{ u.name }}</span>
        </label>
      </div>
    </div>
    
    <!-- Apply Filters Button -->
    <div class="sticky bottom-0 bg-white rounded-xl border border-gray-200 shadow-sm p-3">
      <button 
        @click="$emit('apply')"
        class="btn-primary w-full justify-center"
      >
        <i class="fa-solid fa-check"></i> Apply Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  eventTypeSearch: {
    type: String,
    default: ''
  },
  eventTypes: {
    type: Array,
    default: () => []
  },
  dealerships: {
    type: Array,
    default: () => []
  },
  teams: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:event-type-search', 'apply', 'clear-all'])

const filteredEventTypes = computed(() => {
  if (!props.eventTypeSearch) return props.eventTypes
  return props.eventTypes.filter(t => 
    t.label.toLowerCase().includes(props.eventTypeSearch.toLowerCase())
  )
})

const hasActiveFilters = computed(() => {
  return props.modelValue.onlyMine ||
         props.modelValue.mostRelevant || 
         props.modelValue.includeCancelled || 
         props.modelValue.noShowsOnly ||
         props.modelValue.eventTypes.length > 0 ||
         props.modelValue.dealerships.length > 0 ||
         props.modelValue.teams.length > 0 ||
         props.modelValue.users.length > 0
})

const updateFilter = (key, value) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const toggleArrayFilter = (key, value) => {
  const currentArray = props.modelValue[key]
  const newArray = currentArray.includes(value)
    ? currentArray.filter(v => v !== value)
    : [...currentArray, value]
  
  emit('update:modelValue', { ...props.modelValue, [key]: newArray })
}
</script>

