<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Calendar" subtitle="Appointments & Events">
      <template #actions>
        <!-- Connect Calendar Button -->
        <button 
          @click="showConnectModal = true"
          class="btn-secondary flex items-center gap-2"
          :class="{ 'bg-green-50 border-green-200 text-green-700': connectedCalendars.length > 0 }"
        >
          <i class="fa-solid fa-link text-xs"></i>
          <span>{{ connectedCalendars.length > 0 ? 'Connected' : 'Connect' }}</span>
          <span 
            v-if="connectedCalendars.length > 0" 
            class="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ connectedCalendars.length }}
          </span>
        </button>
        
        <button 
          @click="showCreateEventModal = true"
          class="btn-primary"
        >
          <i class="fa-solid fa-plus"></i> New Event
        </button>
      </template>
      <template v-if="appliedFilterChips.length > 0" #bottom>
        <!-- Applied Filter Chips -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="label-upper">Active filters:</span>
          <button
            v-for="chip in appliedFilterChips"
            :key="chip.key"
            @click="removeFilterChip(chip)"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors group"
          >
            {{ chip.label }}
            <i class="fa-solid fa-xmark text-[10px] text-blue-400 group-hover:text-blue-600"></i>
          </button>
          <button
            @click="clearAllAppliedFilters"
            class="text-xs hover:text-red-600 font-medium"
          >
            Clear all
          </button>
        </div>
      </template>
    </PageHeader>
    
    <!-- Main Content Grid: Calendar (3/4) + Filters Sidebar (1/4) -->
    <div class="p-4 md:p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <!-- Calendar Area (3/4) -->
        <div class="lg:col-span-3 overflow-y-auto">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>
        
        <!-- Filters Sidebar (1/3) -->
        <div class="overflow-y-auto space-y-4">
          <!-- Quick Filters Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="label-upper">Quick Filters</h3>
              <button 
                v-if="hasActiveFilters"
                @click="clearAllFilters"
                class="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase"
              >
                Clear
              </button>
            </div>
            
            <div class="space-y-2.5">
              <label class="flex items-center justify-between cursor-pointer group">
                <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">Most relevant</span>
                <div 
                  class="w-8 h-4 rounded-full transition-colors relative"
                  :class="filters.mostRelevant ? 'bg-blue-600' : 'bg-gray-300'"
                  @click="filters.mostRelevant = !filters.mostRelevant"
                >
                  <div 
                    class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                    :class="filters.mostRelevant ? 'left-[17px]' : 'left-0.5'"
                  ></div>
                </div>
              </label>
              
              <label class="flex items-center justify-between cursor-pointer group">
                <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">Include cancelled</span>
                <div 
                  class="w-8 h-4 rounded-full transition-colors relative"
                  :class="filters.includeCancelled ? 'bg-blue-600' : 'bg-gray-300'"
                  @click="filters.includeCancelled = !filters.includeCancelled"
                >
                  <div 
                    class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                    :class="filters.includeCancelled ? 'left-[17px]' : 'left-0.5'"
                  ></div>
                </div>
              </label>
              
              <label class="flex items-center justify-between cursor-pointer group">
                <span class="text-sm text-gray-700 font-medium group-hover:text-gray-900">No-shows only</span>
                <div 
                  class="w-8 h-4 rounded-full transition-colors relative"
                  :class="filters.noShowsOnly ? 'bg-blue-600' : 'bg-gray-300'"
                  @click="filters.noShowsOnly = !filters.noShowsOnly"
                >
                  <div 
                    class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                    :class="filters.noShowsOnly ? 'left-[17px]' : 'left-0.5'"
                  ></div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Event Type Filter Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 class="label-upper mb-3">Event Types</h3>
            <input 
              v-model="eventTypeSearch"
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
                  v-model="filters.eventTypes"
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
                  v-model="filters.dealerships"
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
                  v-model="filters.teams"
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
                  v-model="filters.users"
                  class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <span class="text-sm text-gray-700">{{ u.name }}</span>
              </label>
            </div>
          </div>
          
          <!-- Apply Filters Button -->
          <div class="sticky bottom-0 bg-white rounded-xl border border-gray-200 shadow-sm p-3">
            <button 
              @click="applyFilters"
              class="btn-primary w-full justify-center"
            >
              <i class="fa-solid fa-check"></i> Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <CalendarConnectModal
      :show="showConnectModal"
      :connected-calendars="connectedCalendars"
      :connecting-to="connectingTo"
      @close="showConnectModal = false"
      @connect="connectCalendar"
      @disconnect="disconnectCalendar"
    />
    
    <!-- Create Event Modal -->
    <teleport to="body">
      <div 
        v-if="showCreateEventModal" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        @click.self="showCreateEventModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 my-4 max-h-[90vh] overflow-y-auto animate-fade-in">
          <div class="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="modal-title">Create New Event</h3>
            <p class="modal-subtitle">Fill in the details for the new event.</p>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block label-upper mb-2">Event Type</label>
              <select v-model="newEvent.type" class="input">
                <option value="test-drive">Test Drive</option>
                <option value="appointment">Dealership Visit</option>
                <option value="offsite">Offsite Visit</option>
                <option value="workshop">Workshop</option>
                <option value="call">Call</option>
                <option value="delivery">Delivery</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
            <div>
              <label class="block label-upper mb-2">Title</label>
              <input 
                v-model="newEvent.title"
                type="text" 
                placeholder="Event title..." 
                class="input"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Date</label>
                <input 
                  v-model="newEvent.date"
                  type="date" 
                  class="input"
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Time</label>
                <input 
                  v-model="newEvent.time"
                  type="time" 
                  class="input"
                >
              </div>
            </div>
            <div>
              <label class="block label-upper mb-2">Customer</label>
              <input 
                v-model="newEvent.customer"
                type="text" 
                placeholder="Customer name..." 
                class="input"
              >
            </div>
            <div>
              <label class="block label-upper mb-2">Dealership</label>
              <select v-model="newEvent.dealership" class="input">
                <option value="">Select dealership...</option>
                <option v-for="d in dealerships" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>
          <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button 
              @click="showCreateEventModal = false"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button 
              @click="createEvent"
              class="btn-primary"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </teleport>
    
    <!-- Quick View Event Modal -->
    <teleport to="body">
      <div 
        v-if="showQuickViewModal && selectedEvent" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        @click.self="showQuickViewModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 my-4 max-h-[90vh] overflow-y-auto animate-fade-in">
          <!-- Header with event type color -->
          <div class="p-5" :class="getEventTypeHeaderClass(selectedEvent.type)">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="badge-ui" :class="getEventTypeBadgeClass(selectedEvent.type)">
                    {{ getEventTypeLabel(selectedEvent.type) }}
                  </span>
                  <span 
                    v-if="selectedEvent.status === 'cancelled'"
                    class="badge-ui bg-red-100 text-red-700 border-red-200"
                  >
                    Cancelled
                  </span>
                  <span 
                    v-else-if="selectedEvent.status === 'no-show'"
                    class="badge-ui bg-orange-100 text-orange-700 border-orange-200"
                  >
                    No-show
                  </span>
                </div>
                <h3 class="font-bold text-lg" :class="getEventTypeTextClass(selectedEvent.type)">{{ selectedEvent.title }}</h3>
              </div>
              <button @click="showQuickViewModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          
          <!-- Event Details -->
          <div class="p-5 space-y-4">
            <!-- Date & Time -->
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <i class="fa-regular fa-calendar text-blue-600 text-sm"></i>
              </div>
              <div>
                <p class="text-content-bold">{{ formatEventDate(selectedEvent.start) }}</p>
                <p class="text-meta">{{ formatEventTime(selectedEvent.start) }} - {{ formatEventTime(selectedEvent.end) }}</p>
              </div>
            </div>
            
            <!-- Customer -->
            <div v-if="selectedEvent.customer" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <i class="fa-regular fa-user text-green-600 text-sm"></i>
              </div>
              <div>
                <p class="text-content-bold">{{ selectedEvent.customer }}</p>
                <p class="text-meta">Customer</p>
              </div>
            </div>
            
            <!-- Vehicle -->
            <div v-if="selectedEvent.vehicle" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-car text-purple-600 text-sm"></i>
              </div>
              <div>
                <p class="text-content-bold">{{ selectedEvent.vehicle }}</p>
                <p class="text-meta">Vehicle</p>
              </div>
            </div>
            
            <!-- Dealership -->
            <div v-if="selectedEvent.dealership" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-building text-orange-600 text-sm"></i>
              </div>
              <div>
                <p class="text-content-bold">{{ selectedEvent.dealership }}</p>
                <p class="text-meta">Dealership</p>
              </div>
            </div>
            
            <!-- Assignee -->
            <div v-if="selectedEvent.assignee" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <i class="fa-regular fa-id-badge text-indigo-600 text-sm"></i>
              </div>
              <div>
                <p class="text-content-bold">{{ selectedEvent.assignee }}</p>
                <p class="text-meta">Assigned to</p>
              </div>
            </div>
            
            <!-- Team -->
            <div v-if="selectedEvent.team" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-users text-teal-600 text-sm"></i>
              </div>
              <div>
                <p class="text-content-bold">{{ selectedEvent.team }}</p>
                <p class="text-meta">Team</p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
            <button 
              @click="deleteEvent(selectedEvent.id)"
              class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <i class="fa-regular fa-trash-can text-xs"></i> Delete
            </button>
            <div class="flex gap-2">
              <button 
                @click="showQuickViewModal = false"
                class="btn-secondary"
              >
                Close
              </button>
              <button 
                @click="openEditModal"
                class="btn-primary"
              >
                <i class="fa-regular fa-pen-to-square mr-1"></i> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    
    <!-- Edit Event Modal -->
    <teleport to="body">
      <div 
        v-if="showEditEventModal && editingEvent" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        @click.self="showEditEventModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 my-4 max-h-[90vh] overflow-y-auto animate-fade-in">
          <div class="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="modal-title">Edit Event</h3>
            <p class="modal-subtitle">Update the event details.</p>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block label-upper mb-2">Event Type</label>
              <select v-model="editingEvent.type" class="input">
                <option value="test-drive">Test Drive</option>
                <option value="appointment">Dealership Visit</option>
                <option value="offsite">Offsite Visit</option>
                <option value="workshop">Workshop</option>
                <option value="call">Call</option>
                <option value="delivery">Delivery</option>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="marketing">Marketing Event</option>
                <option value="leave">Leave</option>
                <option value="memo">Memo</option>
                <option value="recall">Recall</option>
                <option value="absence">Absence</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block label-upper mb-2">Title</label>
              <input 
                v-model="editingEvent.title"
                type="text" 
                placeholder="Event title..." 
                class="input"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Date</label>
                <input 
                  v-model="editingEvent.date"
                  type="date" 
                  class="input"
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Time</label>
                <input 
                  v-model="editingEvent.time"
                  type="time" 
                  class="input"
                >
              </div>
            </div>
            <div>
              <label class="block label-upper mb-2">Customer</label>
              <input 
                v-model="editingEvent.customer"
                type="text" 
                placeholder="Customer name..." 
                class="input"
              >
            </div>
            <div>
              <label class="block label-upper mb-2">Vehicle</label>
              <input 
                v-model="editingEvent.vehicle"
                type="text" 
                placeholder="Vehicle..." 
                class="input"
              >
            </div>
            <div>
              <label class="block label-upper mb-2">Dealership</label>
              <select v-model="editingEvent.dealership" class="input">
                <option value="">Select dealership...</option>
                <option v-for="d in dealerships" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
              <label class="block label-upper mb-2">Status</label>
              <select v-model="editingEvent.status" class="input">
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No-show</option>
              </select>
            </div>
          </div>
          <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button 
              @click="showEditEventModal = false"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button 
              @click="saveEditedEvent"
              class="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { fetchCalendarEvents, fetchCalendarFilterOptions, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/api/calendar'
import CalendarConnectModal from '@/components/calendar/CalendarConnectModal.vue'
import PageHeader from '@/components/shared/PageHeader.vue'

const showCreateEventModal = ref(false)
const showConnectModal = ref(false)
const showQuickViewModal = ref(false)
const showEditEventModal = ref(false)
const selectedEvent = ref(null)
const editingEvent = ref(null)
const eventTypeSearch = ref('')
const events = ref([])
const connectingTo = ref(null)
const connectedCalendars = ref([])
const appliedFilters = ref({
  mostRelevant: false,
  includeCancelled: false,
  noShowsOnly: false,
  eventTypes: [],
  dealerships: [],
  teams: [],
  users: []
})

// Filter options - loaded from data layer
const eventTypes = ref([])
const dealerships = ref([])
const teams = ref([])
const users = ref([])

// Filters state
const filters = ref({
  mostRelevant: false,
  includeCancelled: false,
  noShowsOnly: false,
  eventTypes: [],
  dealerships: [],
  teams: [],
  users: []
})

const filteredEventTypes = computed(() => {
  if (!eventTypeSearch.value) return eventTypes.value
  return eventTypes.value.filter(t => 
    t.label.toLowerCase().includes(eventTypeSearch.value.toLowerCase())
  )
})

const hasActiveFilters = computed(() => {
  return filters.value.mostRelevant || 
         filters.value.includeCancelled || 
         filters.value.noShowsOnly ||
         filters.value.eventTypes.length > 0 ||
         filters.value.dealerships.length > 0 ||
         filters.value.teams.length > 0 ||
         filters.value.users.length > 0
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.mostRelevant) count++
  if (filters.value.includeCancelled) count++
  if (filters.value.noShowsOnly) count++
  count += filters.value.eventTypes.length
  count += filters.value.dealerships.length
  count += filters.value.teams.length
  count += filters.value.users.length
  return count
})

const clearAllFilters = () => {
  filters.value = {
    mostRelevant: false,
    includeCancelled: false,
    noShowsOnly: false,
    eventTypes: [],
    dealerships: [],
    teams: [],
    users: []
  }
}

// Applied filter chips
const appliedFilterChips = computed(() => {
  const chips = []
  
  if (appliedFilters.value.mostRelevant) {
    chips.push({ key: 'mostRelevant', label: 'Most relevant', type: 'quick' })
  }
  if (appliedFilters.value.includeCancelled) {
    chips.push({ key: 'includeCancelled', label: 'Include cancelled', type: 'quick' })
  }
  if (appliedFilters.value.noShowsOnly) {
    chips.push({ key: 'noShowsOnly', label: 'No-shows only', type: 'quick' })
  }
  
  appliedFilters.value.eventTypes.forEach(et => {
    const eventType = eventTypes.value.find(e => e.value === et)
    chips.push({ key: `eventType-${et}`, label: eventType?.label || et, type: 'eventType', value: et })
  })
  
  appliedFilters.value.dealerships.forEach(d => {
    chips.push({ key: `dealership-${d}`, label: d, type: 'dealership', value: d })
  })
  
  appliedFilters.value.teams.forEach(t => {
    chips.push({ key: `team-${t}`, label: t, type: 'team', value: t })
  })
  
  appliedFilters.value.users.forEach(uid => {
    const user = users.value.find(u => u.id === uid)
    chips.push({ key: `user-${uid}`, label: user?.name || uid, type: 'user', value: uid })
  })
  
  return chips
})

const applyFilters = () => {
  appliedFilters.value = JSON.parse(JSON.stringify(filters.value))
}

const removeFilterChip = (chip) => {
  if (chip.type === 'quick') {
    appliedFilters.value[chip.key] = false
    filters.value[chip.key] = false
  } else if (chip.type === 'eventType') {
    appliedFilters.value.eventTypes = appliedFilters.value.eventTypes.filter(v => v !== chip.value)
    filters.value.eventTypes = filters.value.eventTypes.filter(v => v !== chip.value)
  } else if (chip.type === 'dealership') {
    appliedFilters.value.dealerships = appliedFilters.value.dealerships.filter(v => v !== chip.value)
    filters.value.dealerships = filters.value.dealerships.filter(v => v !== chip.value)
  } else if (chip.type === 'team') {
    appliedFilters.value.teams = appliedFilters.value.teams.filter(v => v !== chip.value)
    filters.value.teams = filters.value.teams.filter(v => v !== chip.value)
  } else if (chip.type === 'user') {
    appliedFilters.value.users = appliedFilters.value.users.filter(v => v !== chip.value)
    filters.value.users = filters.value.users.filter(v => v !== chip.value)
  }
}

const clearAllAppliedFilters = () => {
  appliedFilters.value = {
    mostRelevant: false,
    includeCancelled: false,
    noShowsOnly: false,
    eventTypes: [],
    dealerships: [],
    teams: [],
    users: []
  }
  filters.value = {
    mostRelevant: false,
    includeCancelled: false,
    noShowsOnly: false,
    eventTypes: [],
    dealerships: [],
    teams: [],
    users: []
  }
}

// Calendar connection functions
const connectCalendar = async (provider) => {
  connectingTo.value = provider
  
  // Simulate OAuth popup and authentication
  // In a real app, this would open an OAuth popup window
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate successful connection
  const newCalendar = {
    id: Date.now(),
    type: provider,
    email: provider === 'google' ? 'user@gmail.com' : 'user@outlook.com',
    connectedAt: new Date().toISOString()
  }
  
  connectedCalendars.value.push(newCalendar)
  connectingTo.value = null
}

const disconnectCalendar = (calendarId) => {
  connectedCalendars.value = connectedCalendars.value.filter(c => c.id !== calendarId)
}

onMounted(async () => {
  // Load filter options from data layer
  const filterOptions = await fetchCalendarFilterOptions()
  eventTypes.value = filterOptions.eventTypes
  dealerships.value = filterOptions.dealerships
  teams.value = filterOptions.teams
  users.value = filterOptions.users
  
  // Load calendar events
  const result = await fetchCalendarEvents()
  events.value = result
  calendarOptions.value.events = events.value
})

const newEvent = ref({
  type: 'test-drive',
  title: '',
  date: '',
  time: '',
  customer: '',
  dealership: ''
})

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: events.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  eventColor: '#dbeafe',
  eventClassNames: (arg) => {
    const typeColors = {
      'test-drive': 'event-blue',
      'appointment': 'event-green',
      'offsite': 'event-emerald',
      'workshop': 'event-indigo',
      'call': 'event-orange',
      'delivery': 'event-teal',
      'meeting': 'event-purple',
      'training': 'event-pink',
      'marketing': 'event-yellow',
      'leave': 'event-red',
      'memo': 'event-gray',
      'recall': 'event-cyan',
      'absence': 'event-rose',
      'other': 'event-slate'
    }
    return typeColors[arg.event.extendedProps.type] || 'event-blue'
  }
})

function handleDateSelect(selectInfo) {
  newEvent.value.date = selectInfo.startStr
  showCreateEventModal.value = true
}

function handleEventClick(clickInfo) {
  // Find the full event data from our events array
  const eventId = parseInt(clickInfo.event.id)
  const fullEvent = events.value.find(e => e.id === eventId)
  
  if (fullEvent) {
    selectedEvent.value = { ...fullEvent }
    showQuickViewModal.value = true
  }
}

function handleEvents(updatedEvents) {
  // Handle events update
}

// Helper functions for quick view modal
const getEventTypeLabel = (type) => {
  const typeMap = {
    'test-drive': 'Test Drive',
    'appointment': 'Dealership Visit',
    'offsite': 'Offsite Visit',
    'workshop': 'Workshop',
    'call': 'Call',
    'delivery': 'Delivery',
    'meeting': 'Meeting',
    'training': 'Training',
    'marketing': 'Marketing Event',
    'leave': 'Leave',
    'memo': 'Memo',
    'recall': 'Recall',
    'absence': 'Absence',
    'other': 'Other'
  }
  return typeMap[type] || type
}

const getEventTypeHeaderClass = (type) => {
  const colorMap = {
    'test-drive': 'bg-blue-50 border-b border-blue-200',
    'appointment': 'bg-green-50 border-b border-green-200',
    'offsite': 'bg-emerald-50 border-b border-emerald-200',
    'workshop': 'bg-indigo-50 border-b border-indigo-200',
    'call': 'bg-orange-50 border-b border-orange-200',
    'delivery': 'bg-teal-50 border-b border-teal-200',
    'meeting': 'bg-purple-50 border-b border-purple-200',
    'training': 'bg-pink-50 border-b border-pink-200',
    'marketing': 'bg-yellow-50 border-b border-yellow-200',
    'leave': 'bg-red-50 border-b border-red-200',
    'memo': 'bg-gray-50 border-b border-gray-200',
    'recall': 'bg-cyan-50 border-b border-cyan-200',
    'absence': 'bg-rose-50 border-b border-rose-200',
    'other': 'bg-slate-50 border-b border-slate-200'
  }
  return colorMap[type] || 'bg-blue-50 border-b border-blue-200'
}

const getEventTypeBadgeClass = (type) => {
  const colorMap = {
    'test-drive': 'bg-blue-100 text-blue-700 border-blue-200',
    'appointment': 'bg-green-100 text-green-700 border-green-200',
    'offsite': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'workshop': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'call': 'bg-orange-100 text-orange-700 border-orange-200',
    'delivery': 'bg-teal-100 text-teal-700 border-teal-200',
    'meeting': 'bg-purple-100 text-purple-700 border-purple-200',
    'training': 'bg-pink-100 text-pink-700 border-pink-200',
    'marketing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'leave': 'bg-red-100 text-red-700 border-red-200',
    'memo': 'bg-gray-100 text-gray-700 border-gray-200',
    'recall': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'absence': 'bg-rose-100 text-rose-700 border-rose-200',
    'other': 'bg-slate-100 text-slate-700 border-slate-200'
  }
  return colorMap[type] || 'bg-blue-100 text-blue-700 border-blue-200'
}

const getEventTypeTextClass = (type) => {
  const colorMap = {
    'test-drive': 'text-blue-900',
    'appointment': 'text-green-900',
    'offsite': 'text-emerald-900',
    'workshop': 'text-indigo-900',
    'call': 'text-orange-900',
    'delivery': 'text-teal-900',
    'meeting': 'text-purple-900',
    'training': 'text-pink-900',
    'marketing': 'text-yellow-900',
    'leave': 'text-red-900',
    'memo': 'text-gray-900',
    'recall': 'text-cyan-900',
    'absence': 'text-rose-900',
    'other': 'text-slate-900'
  }
  return colorMap[type] || 'text-blue-900'
}

const formatEventDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatEventTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  })
}

const openEditModal = () => {
  if (selectedEvent.value) {
    const startDate = new Date(selectedEvent.value.start)
    editingEvent.value = {
      id: selectedEvent.value.id,
      type: selectedEvent.value.type,
      title: selectedEvent.value.title,
      date: startDate.toISOString().split('T')[0],
      time: startDate.toTimeString().slice(0, 5),
      customer: selectedEvent.value.customer || '',
      vehicle: selectedEvent.value.vehicle || '',
      dealership: selectedEvent.value.dealership || '',
      status: selectedEvent.value.status || 'confirmed'
    }
    showQuickViewModal.value = false
    showEditEventModal.value = true
  }
}

const saveEditedEvent = async () => {
  if (editingEvent.value && editingEvent.value.title && editingEvent.value.date) {
    const updatedData = {
      title: editingEvent.value.title,
      start: `${editingEvent.value.date}T${editingEvent.value.time || '10:00'}:00`,
      end: `${editingEvent.value.date}T${editingEvent.value.time || '11:00'}:00`,
      type: editingEvent.value.type,
      customer: editingEvent.value.customer,
      vehicle: editingEvent.value.vehicle,
      dealership: editingEvent.value.dealership,
      status: editingEvent.value.status
    }
    
    await updateCalendarEvent(editingEvent.value.id, updatedData)
    
    // Update local events array
    const index = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updatedData }
      calendarOptions.value.events = [...events.value]
    }
    
    showEditEventModal.value = false
    editingEvent.value = null
  }
}

const deleteEvent = async (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await deleteCalendarEvent(eventId)
    
    // Remove from local events array
    events.value = events.value.filter(e => e.id !== eventId)
    calendarOptions.value.events = [...events.value]
    
    showQuickViewModal.value = false
    selectedEvent.value = null
  }
}

async function createEvent() {
  if (newEvent.value.title && newEvent.value.date) {
    const eventData = {
      title: newEvent.value.title,
      start: `${newEvent.value.date}T${newEvent.value.time || '10:00:00'}`,
      end: `${newEvent.value.date}T${newEvent.value.time || '11:00:00'}`,
      type: newEvent.value.type,
      customer: newEvent.value.customer,
      dealership: newEvent.value.dealership
    }
    
    const createdEvent = await createCalendarEvent(eventData)
    events.value.push(createdEvent)
    calendarOptions.value.events = [...events.value]
    showCreateEventModal.value = false
    
    // Reset form
    newEvent.value = {
      type: 'test-drive',
      title: '',
      date: '',
      time: '',
      customer: '',
      dealership: ''
    }
  }
}
</script>

<style>
/* FullCalendar custom styles - Improved readability */
.fc {
  @apply font-sans text-sm;
}

.fc .fc-button {
  @apply bg-blue-600 border-blue-600 hover:bg-blue-700 text-white font-medium px-2 py-1 rounded-lg text-sm transition-colors;
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
  @apply bg-blue-700;
}

.fc .fc-button-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.fc .fc-toolbar-title {
  @apply text-base font-bold text-gray-900;
}

.fc .fc-col-header-cell {
  @apply bg-gray-50/50 border-b border-gray-100;
}

.fc .fc-col-header-cell-cushion {
  @apply text-sm font-bold uppercase tracking-wide text-gray-500 py-1.5;
}

.fc .fc-daygrid-day {
  @apply border-r border-b border-gray-100;
}

.fc .fc-daygrid-day.fc-day-today {
  @apply bg-blue-50/30;
}

.fc .fc-daygrid-day-number {
  @apply text-sm text-gray-700 p-1.5 font-medium;
}

.fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
  @apply font-bold text-blue-600;
}

.fc .fc-event {
  @apply cursor-pointer border-0 rounded px-1.5 py-0.5 text-sm font-medium;
}

.fc .fc-event-title {
  @apply font-medium;
}

.fc .fc-daygrid-event {
  @apply mb-0.5;
}

.fc .fc-scrollgrid {
  @apply border-gray-100;
}

.fc .fc-scrollgrid-section-header {
  @apply border-gray-100;
}

.fc .fc-timegrid-slot {
  @apply border-gray-100;
}

.fc .fc-timegrid-col {
  @apply border-gray-100;
}

.fc .fc-timegrid-axis {
  @apply border-gray-100;
}

.fc .fc-timegrid-axis-cushion {
  @apply text-sm text-gray-500;
}

/* Custom event type colors with light backgrounds */
.fc .fc-event.event-blue {
  @apply bg-blue-50 border border-blue-200 text-blue-700;
}
.fc .fc-event.event-green {
  @apply bg-green-50 border border-green-200 text-green-700;
}
.fc .fc-event.event-emerald {
  @apply bg-emerald-50 border border-emerald-200 text-emerald-700;
}
.fc .fc-event.event-indigo {
  @apply bg-indigo-50 border border-indigo-200 text-indigo-700;
}
.fc .fc-event.event-orange {
  @apply bg-orange-50 border border-orange-200 text-orange-700;
}
.fc .fc-event.event-teal {
  @apply bg-teal-50 border border-teal-200 text-teal-700;
}
.fc .fc-event.event-purple {
  @apply bg-purple-50 border border-purple-200 text-purple-700;
}
.fc .fc-event.event-pink {
  @apply bg-pink-50 border border-pink-200 text-pink-700;
}
.fc .fc-event.event-yellow {
  @apply bg-yellow-50 border border-yellow-200 text-yellow-700;
}
.fc .fc-event.event-red {
  @apply bg-red-50 border border-red-200 text-red-700;
}
.fc .fc-event.event-gray {
  @apply bg-gray-50 border border-gray-200 text-gray-700;
}
.fc .fc-event.event-cyan {
  @apply bg-cyan-50 border border-cyan-200 text-cyan-700;
}
.fc .fc-event.event-rose {
  @apply bg-rose-50 border border-rose-200 text-rose-700;
}
.fc .fc-event.event-slate {
  @apply bg-slate-50 border border-slate-200 text-slate-700;
}
</style>
