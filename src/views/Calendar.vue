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
        <CalendarFiltersSidebar
          v-model="filters"
          v-model:event-type-search="eventTypeSearch"
          :event-types="eventTypes"
          :dealerships="dealerships"
          :teams="teams"
          :users="users"
          @apply="applyFilters"
          @clear-all="clearAllFilters"
        />
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
    <CreateEventModal
      :show="showCreateEventModal"
      :initial-date="newEvent.date"
      :dealerships="dealerships"
      @create="handleCreateEvent"
      @cancel="showCreateEventModal = false"
    />
    
    <!-- Quick View Event Modal -->
    <QuickViewEventModal
      :show="showQuickViewModal"
      :event="selectedEvent"
      @close="showQuickViewModal = false"
      @edit="openEditModal"
      @delete="handleDeleteEvent"
    />
    
    <!-- Edit Event Modal -->
    <EditEventModal
      :show="showEditEventModal"
      :event="selectedEvent"
      :dealerships="dealerships"
      @save="handleSaveEditedEvent"
      @cancel="showEditEventModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { fetchCalendarEvents, fetchCalendarFilterOptions, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/api/calendar'
import CalendarConnectModal from '@/components/calendar/CalendarConnectModal.vue'
import PageHeader from '@/components/layout/PageHeader.vue'

// New sub-components
import CalendarFiltersSidebar from '@/components/calendar/CalendarFiltersSidebar.vue'
import CreateEventModal from '@/components/calendar/CreateEventModal.vue'
import QuickViewEventModal from '@/components/calendar/QuickViewEventModal.vue'
import EditEventModal from '@/components/calendar/EditEventModal.vue'

// Utilities
import { getEventCalendarClass } from '@/utils/calendarHelpers'

const showCreateEventModal = ref(false)
const showConnectModal = ref(false)
const showQuickViewModal = ref(false)
const showEditEventModal = ref(false)
const selectedEvent = ref(null)
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

// Filter options
const eventTypes = ref([])
const dealerships = ref([])
const teams = ref([])
const users = ref([])

// Current filters state
const filters = ref({
  mostRelevant: false,
  includeCancelled: false,
  noShowsOnly: false,
  eventTypes: [],
  dealerships: [],
  teams: [],
  users: []
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
  const emptyFilters = {
    mostRelevant: false,
    includeCancelled: false,
    noShowsOnly: false,
    eventTypes: [],
    dealerships: [],
    teams: [],
    users: []
  }
  appliedFilters.value = { ...emptyFilters }
  filters.value = { ...emptyFilters }
}

// Calendar connection functions
const connectCalendar = async (provider) => {
  connectingTo.value = provider
  await new Promise(resolve => setTimeout(resolve, 2000))
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
  // Load filter options
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
  eventColor: '#dbeafe',
  eventClassNames: (arg) => {
    return getEventCalendarClass(arg.event.extendedProps.type)
  }
})

function handleDateSelect(selectInfo) {
  newEvent.value.date = selectInfo.startStr
  showCreateEventModal.value = true
}

function handleEventClick(clickInfo) {
  const eventId = parseInt(clickInfo.event.id)
  const fullEvent = events.value.find(e => e.id === eventId)
  if (fullEvent) {
    selectedEvent.value = { ...fullEvent }
    showQuickViewModal.value = true
  }
}

const handleCreateEvent = async (eventData) => {
  const fullEventData = {
    ...eventData,
    start: `${eventData.date}T${eventData.time || '10:00:00'}`,
    end: `${eventData.date}T${eventData.time || '11:00:00'}`
  }
  const createdEvent = await createCalendarEvent(fullEventData)
  events.value.push(createdEvent)
  calendarOptions.value.events = [...events.value]
  showCreateEventModal.value = false
}

const handleDeleteEvent = async (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await deleteCalendarEvent(eventId)
    events.value = events.value.filter(e => e.id !== eventId)
    calendarOptions.value.events = [...events.value]
    showQuickViewModal.value = false
    selectedEvent.value = null
  }
}

const openEditModal = () => {
  showQuickViewModal.value = false
  showEditEventModal.value = true
}

const handleSaveEditedEvent = async (eventData) => {
  const updatedData = {
    ...eventData,
    start: `${eventData.date}T${eventData.time || '10:00'}:00`,
    end: `${eventData.date}T${eventData.time || '11:00'}:00`
  }
  await updateCalendarEvent(eventData.id, updatedData)
  const index = events.value.findIndex(e => e.id === eventData.id)
  if (index !== -1) {
    events.value[index] = { ...events.value[index], ...updatedData }
    calendarOptions.value.events = [...events.value]
  }
  showEditEventModal.value = false
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
