<template>
  <div class="overflow-y-auto space-y-3">
    <!-- Quick Filters Card - Always Visible -->
    <div class="bg-surface rounded-xl border border-border shadow-nsc-card p-3">
      <div class="flex items-center justify-between mb-2">
        <h3 class="label-upper">Quick Filters</h3>
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
          <span class="text-xs text-muted-foreground font-medium group-hover:text-foreground">Only mine</span>
          <Toggle
            name="onlyMine"
            :modelValue="modelValue.onlyMine"
            @update:modelValue="(val) => updateFilter('onlyMine', val)"
          />
        </label>
        
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-xs text-muted-foreground font-medium group-hover:text-foreground">Most relevant</span>
          <Toggle
            name="mostRelevant"
            :modelValue="modelValue.mostRelevant"
            @update:modelValue="(val) => updateFilter('mostRelevant', val)"
          />
        </label>
        
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-xs text-muted-foreground font-medium group-hover:text-foreground">Include cancelled</span>
          <Toggle
            name="includeCancelled"
            :modelValue="modelValue.includeCancelled"
            @update:modelValue="(val) => updateFilter('includeCancelled', val)"
          />
        </label>
        
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-xs text-muted-foreground font-medium group-hover:text-foreground">No-shows only</span>
          <Toggle
            name="noShowsOnly"
            :modelValue="modelValue.noShowsOnly"
            @update:modelValue="(val) => updateFilter('noShowsOnly', val)"
          />
        </label>
      </div>
    </div>
    
    <!-- Event Type Filter Card - Collapsible -->
    <div class="bg-surface rounded-xl border border-border shadow-nsc-card overflow-hidden">
      <button
        @click="expandedSections.eventTypes = !expandedSections.eventTypes"
        class="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
      >
        <div class="flex items-center gap-2">
          <h3 class="label-upper text-xs">Event Types</h3>
          <span 
            v-if="modelValue.eventTypes.length > 0"
            class="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center"
          >
            {{ modelValue.eventTypes.length }}
          </span>
        </div>
        <ChevronDown 
          class="w-3 h-3 shrink-0 text-muted-foreground transition-transform"
          :class="{ 'rotate-180': expandedSections.eventTypes }"
        />
      </button>
      <transition name="accordion">
        <div v-if="expandedSections.eventTypes" class="px-3 pb-3">
          <div class="mb-2">
            <TextInput
              name="eventTypeSearch"
              :modelValue="eventTypeSearch"
              placeholder="Search..."
              @update:modelValue="(val) => $emit('update:event-type-search', val)"
            />
          </div>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="type in filteredEventTypes"
              :key="type.value"
              class="px-2 py-1.5 rounded hover:bg-muted"
            >
              <Checkbox
                :modelValue="modelValue.eventTypes.includes(type.value)"
                :label="type.label"
                @update:modelValue="(checked) => setArrayFilter('eventTypes', type.value, checked)"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Dealership Filter Card - Collapsible -->
    <div class="bg-surface rounded-xl border border-border shadow-nsc-card overflow-hidden">
      <button
        @click="expandedSections.dealerships = !expandedSections.dealerships"
        class="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
      >
        <div class="flex items-center gap-2">
          <h3 class="label-upper text-xs">Dealerships</h3>
          <span 
            v-if="modelValue.dealerships.length > 0"
            class="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center"
          >
            {{ modelValue.dealerships.length }}
          </span>
        </div>
        <ChevronDown 
          class="w-3 h-3 shrink-0 text-muted-foreground transition-transform"
          :class="{ 'rotate-180': expandedSections.dealerships }"
        />
      </button>
      <transition name="accordion">
        <div v-if="expandedSections.dealerships" class="px-3 pb-3">
          <div class="space-y-1 max-h-40 overflow-y-auto">
            <div
              v-for="d in dealerships"
              :key="d"
              class="px-2 py-1.5 rounded hover:bg-muted"
            >
              <Checkbox
                :modelValue="modelValue.dealerships.includes(d)"
                :label="d"
                @update:modelValue="(checked) => setArrayFilter('dealerships', d, checked)"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Team Filter Card - Collapsible -->
    <div class="bg-surface rounded-xl border border-border shadow-nsc-card overflow-hidden">
      <button
        @click="expandedSections.teams = !expandedSections.teams"
        class="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
      >
        <div class="flex items-center gap-2">
          <h3 class="label-upper text-xs">Teams</h3>
          <span 
            v-if="modelValue.teams.length > 0"
            class="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center"
          >
            {{ modelValue.teams.length }}
          </span>
        </div>
        <ChevronDown 
          class="w-3 h-3 shrink-0 text-muted-foreground transition-transform"
          :class="{ 'rotate-180': expandedSections.teams }"
        />
      </button>
      <transition name="accordion">
        <div v-if="expandedSections.teams" class="px-3 pb-3">
          <div class="space-y-1 max-h-40 overflow-y-auto">
            <div
              v-for="t in teams"
              :key="t"
              class="px-2 py-1.5 rounded hover:bg-muted"
            >
              <Checkbox
                :modelValue="modelValue.teams.includes(t)"
                :label="t"
                @update:modelValue="(checked) => setArrayFilter('teams', t, checked)"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Apply Filters Button -->
    <div class="sticky bottom-0 bg-surface rounded-xl border border-border shadow-nsc-card p-3 mt-3">
      <button
        @click="$emit('apply')"
        class="group w-full flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-medium text-gray-600 hover:border-red-100 hover:bg-red-50 hover:text-brand-red transition-all"
      >
        <Check class="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-brand-red" />
        <span>Apply Filters</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { Checkbox, Input, Toggle } from '@motork/component-library/future/primitives'

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

const setArrayFilter = (key, value, checked) => {
  const currentArray = props.modelValue[key]
  const hasValue = currentArray.includes(value)
  const newArray = checked
    ? (hasValue ? currentArray : [...currentArray, value])
    : currentArray.filter(v => v !== value)
  
  emit('update:modelValue', { ...props.modelValue, [key]: newArray })
}
</script>

<style scoped>
/* Ensure all filter text uses consistent smallest theme size (text-xs = 10px) */
:deep(.space-y-1 > div label),
:deep(.space-y-1 label) {
  font-size: var(--text-xs);
}

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
