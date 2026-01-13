<template>
  <div class="overflow-y-auto space-y-3">
    <!-- Quick Filters Card - Always Visible -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
      <div class="flex items-center justify-between mb-2">
        <h3 class="label-upper text-xs">Quick Filters</h3>
        <button 
          v-if="hasActiveFilters"
          @click="$emit('clear-all')"
          class="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase"
        >
          Clear
        </button>
      </div>
      
      <div class="space-y-2">
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
    
    <!-- Event Type Filter Card - Collapsible -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        @click="expandedSections.eventTypes = !expandedSections.eventTypes"
        class="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-2">
          <h3 class="label-upper text-xs">Event Types</h3>
          <span 
            v-if="modelValue.eventTypes.length > 0"
            class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ modelValue.eventTypes.length }}
          </span>
        </div>
        <i 
          class="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform"
          :class="{ 'rotate-180': expandedSections.eventTypes }"
        ></i>
      </button>
      <transition name="accordion">
        <div v-if="expandedSections.eventTypes" class="px-3 pb-3">
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
      </transition>
    </div>
    
    <!-- Dealership Filter Card - Collapsible -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        @click="expandedSections.dealerships = !expandedSections.dealerships"
        class="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-2">
          <h3 class="label-upper text-xs">Dealerships</h3>
          <span 
            v-if="modelValue.dealerships.length > 0"
            class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ modelValue.dealerships.length }}
          </span>
        </div>
        <i 
          class="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform"
          :class="{ 'rotate-180': expandedSections.dealerships }"
        ></i>
      </button>
      <transition name="accordion">
        <div v-if="expandedSections.dealerships" class="px-3 pb-3">
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
      </transition>
    </div>
    
    <!-- Team Filter Card - Collapsible -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        @click="expandedSections.teams = !expandedSections.teams"
        class="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-2">
          <h3 class="label-upper text-xs">Teams</h3>
          <span 
            v-if="modelValue.teams.length > 0"
            class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ modelValue.teams.length }}
          </span>
        </div>
        <i 
          class="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform"
          :class="{ 'rotate-180': expandedSections.teams }"
        ></i>
      </button>
      <transition name="accordion">
        <div v-if="expandedSections.teams" class="px-3 pb-3">
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
      </transition>
    </div>
    
    <!-- Apply Filters Button -->
    <div class="sticky bottom-0 bg-white rounded-xl border border-gray-200 shadow-sm p-3 mt-3">
      <button
        @click="$emit('apply')"
        class="group w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
      >
        <i class="fa-solid fa-check text-gray-400 group-hover:text-indigo-500"></i>
        <span>Apply Filters</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

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

// Collapsible sections state - all collapsed by default
const expandedSections = ref({
  eventTypes: false,
  dealerships: false,
  teams: false
})

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

<style scoped>
@reference "tailwindcss";

/* Accordion transition */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
