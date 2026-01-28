<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Calendar">
      <template #actions>
        <!-- Mobile Filter Button -->
        <div class="lg:hidden flex items-center gap-2">
          <Button
            @click="showFilterDrawer = true"
            variant="outline"
            size="small"
            class="flex items-center gap-2"
          >
            <Filter class="w-4 h-4 shrink-0" />
            <span class="hidden sm:inline">Filters</span>
          </Button>
          <Badge
            v-if="activeFilterCount > 0"
            :text="String(activeFilterCount)"
            theme="primary"
            size="small"
          />
        </div>
        
        <!-- Connect Calendar Button (Secondary) -->
        <div class="flex items-center gap-2">
          <Button
            @click="showConnectModal = true"
            variant="outline"
            size="small"
            class="flex items-center gap-2"
          >
            <Link class="w-4 h-4 shrink-0" />
            <span class="hidden sm:inline">{{ connectedCalendars.length > 0 ? 'Connected' : 'Connect' }}</span>
          </Button>
          <Badge
            v-if="connectedCalendars.length > 0"
            :text="String(connectedCalendars.length)"
            theme="success"
            size="small"
          />
        </div>
        
        <!-- New Event Button (Secondary) -->
        <Button
          @click="showCreateEventModal = true"
          variant="outline"
          size="small"
          class="flex items-center gap-2"
        >
          <Plus class="w-4 h-4 shrink-0" />
          <span class="hidden sm:inline">New Event</span>
        </Button>
      </template>
      <template v-if="appliedFilterChips.length > 0" #bottom>
        <!-- Applied Filter Chips -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="label-upper">Active filters:</span>
          <button
            v-for="chip in appliedFilterChips"
            :key="chip.key"
            @click="removeFilterChip(chip)"
            class="inline-flex items-center gap-1.5"
          >
            <Badge
              :text="chip.label"
              size="small"
              theme="blue"
              class="cursor-pointer hover:opacity-80"
            />
            <X class="w-3 h-3 shrink-0 text-blue-400 hover:text-blue-600" />
          </button>
          <Button
            label="Clear all"
            variant="ghost"
            size="small"
            @click="clearAllAppliedFilters"
            class="text-xs hover:text-red-600"
          />
        </div>
      </template>
    </PageHeader>
    
    <!-- Main Content Grid: Calendar (3/4) + Filters Sidebar (1/4) -->
    <div class="p-4 md:p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <!-- Calendar Area (3/4) -->
        <div class="lg:col-span-3 overflow-y-auto">
          <div class="bg-surface rounded-xl border border-border shadow-nsc-card p-2 md:p-3 lg:p-4">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>
        
        <!-- Filters Sidebar (1/4) - Desktop Only -->
        <div class="hidden lg:block">
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
    </div>
    
    <!-- Mobile Filter Drawer Backdrop -->
    <transition name="fade">
      <div 
        v-if="showFilterDrawer"
        class="fixed inset-0 bg-black/50 z-50 lg:hidden"
        @click="showFilterDrawer = false"
      ></div>
    </transition>
    
    <!-- Mobile Filter Drawer -->
    <transition name="slide-right">
      <div 
        v-if="showFilterDrawer"
        class="fixed top-0 right-0 bottom-0 w-80 max-w-screen-sm bg-surface z-50 lg:hidden overflow-y-auto shadow-xl"
      >
        <div class="sticky top-0 bg-surface border-b border p-4 flex items-center justify-between z-10">
          <h3 class="heading-sub">Filters</h3>
          <button 
            @click="showFilterDrawer = false"
            class="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded transition-colors"
            aria-label="Close filters"
          >
            <X class="w-5 h-5 shrink-0" />
          </button>
        </div>
        <div class="p-4">
          <CalendarFiltersSidebar
            v-model="filters"
            v-model:event-type-search="eventTypeSearch"
            :event-types="eventTypes"
            :dealerships="dealerships"
            :teams="teams"
            :users="users"
            @apply="handleMobileApplyFilters"
            @clear-all="clearAllFilters"
          />
        </div>
      </div>
    </transition>
    
    <CalendarConnectModal
      :show="showConnectModal"
      :connected-calendars="connectedCalendars"
      :connecting-to="connectingTo"
      @close="showConnectModal = false"
      @connect="handleConnectCalendar"
      @disconnect="handleDisconnectCalendar"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Filter, Link, Plus, X } from 'lucide-vue-next'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { fetchCalendarEvents, fetchCalendarFilterOptions, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/api/calendar'
import CalendarConnectModal from '@/components/modals/CalendarConnectModal.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { Button, Badge } from '@motork/component-library/future/primitives'
import { useUserStore } from '@/stores/user'

// New sub-components
import CalendarFiltersSidebar from '@/components/calendar/CalendarFiltersSidebar.vue'
import CreateEventModal from '@/components/modals/CreateEventModal.vue'
import QuickViewEventModal from '@/components/modals/QuickViewEventModal.vue'
import EditEventModal from '@/components/modals/EditEventModal.vue'

// Utilities
import { getEventCalendarClass } from '@/utils/calendarHelpers'

const userStore = useUserStore()

const showCreateEventModal = ref(false)
const showConnectModal = ref(false)
const showQuickViewModal = ref(false)
const showEditEventModal = ref(false)
const showFilterDrawer = ref(false)
const selectedEvent = ref(null)
const eventTypeSearch = ref('')
const events = ref([])
const connectingTo = ref(null)
const connectedCalendars = ref([])
const appliedFilters = ref({
  onlyMine: false,
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
  onlyMine: false,
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
    onlyMine: false,
    mostRelevant: false,
    includeCancelled: false,
    noShowsOnly: false,
    eventTypes: [],
    dealerships: [],
    teams: [],
    users: []
  }
}

// Active filter count for mobile badge
const activeFilterCount = computed(() => {
  let count = 0
  if (appliedFilters.value.onlyMine) count++
  if (appliedFilters.value.mostRelevant) count++
  if (appliedFilters.value.includeCancelled) count++
  if (appliedFilters.value.noShowsOnly) count++
  count += appliedFilters.value.eventTypes.length
  count += appliedFilters.value.dealerships.length
  count += appliedFilters.value.teams.length
  count += appliedFilters.value.users.length
  return count
})

// Applied filter chips
const appliedFilterChips = computed(() => {
  const chips = []
  
  if (appliedFilters.value.onlyMine) {
    chips.push({ key: 'onlyMine', label: 'Only mine', type: 'quick' })
  }
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

const applyFilters = async () => {
  appliedFilters.value = JSON.parse(JSON.stringify(filters.value))
  
  // Add current user ID if "Only mine" is selected
  const filtersToApply = { ...appliedFilters.value }
  if (filtersToApply.onlyMine) {
    filtersToApply.currentUserId = userStore.currentUser?.id
  }
  
  // Reload events with applied filters
  const result = await fetchCalendarEvents(filtersToApply)
  events.value = result
  calendarOptions.value.events = events.value
}

const handleMobileApplyFilters = async () => {
  await applyFilters()
  showFilterDrawer.value = false
}

const removeFilterChip = async (chip) => {
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
  
  // Reload events with updated filters
  const filtersToApply = { ...appliedFilters.value }
  if (filtersToApply.onlyMine) {
    filtersToApply.currentUserId = userStore.currentUser?.id
  }
  const result = await fetchCalendarEvents(filtersToApply)
  events.value = result
  calendarOptions.value.events = events.value
}

const clearAllAppliedFilters = async () => {
  const emptyFilters = {
    onlyMine: false,
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
  
  // Reload events without filters
  const result = await fetchCalendarEvents()
  events.value = result
  calendarOptions.value.events = events.value
}

// Calendar connection functions (keeping our fixed version)
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

// Responsive calendar options
const getCalendarOptions = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
  return {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: isMobile ? 'prev,next' : 'prev,next today',
      center: 'title',
      right: isMobile ? 'today' : 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events.value,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: handleDateSelect,
    eventClick: handleEventClick,
    eventColor: 'var(--brand-blue-light)',
    eventClassNames: (arg) => {
      return getEventCalendarClass(arg.event.extendedProps.type)
    },
    height: isMobile ? 'auto' : undefined,
    aspectRatio: isMobile ? 1.2 : 1.8
  }
}

const calendarOptions = ref(getCalendarOptions())

// Update calendar options on window resize
let resizeHandler = null
onMounted(() => {
  if (typeof window !== 'undefined') {
    resizeHandler = () => {
      calendarOptions.value = getCalendarOptions()
    }
    window.addEventListener('resize', resizeHandler)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
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
  font-size: 0.875rem;
}

.fc .fc-button {
  background-color: var(--brand-dark) !important;
  border-color: var(--brand-dark) !important;
  color: white !important;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.fc .fc-button:hover {
  background-color: var(--brand-dark-darker) !important;
  border-color: var(--brand-dark-darker) !important;
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
  background-color: var(--brand-dark-darker) !important;
  border-color: var(--brand-dark-darker) !important;
}

.fc .fc-button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--brand-dark) !important;
  border-color: var(--brand-dark) !important;
}

.fc .fc-button:focus {
  background-color: var(--brand-dark-darker) !important;
  border-color: var(--brand-dark-darker) !important;
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 40, 40, 0.15);
}

.fc .fc-toolbar-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.fc .fc-col-header-cell {
  background-color: rgba(249, 250, 251, 0.5);
  border-bottom: 1px solid #f3f4f6;
}

.fc .fc-col-header-cell-cushion {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #6b7280;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.fc .fc-daygrid-day {
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

.fc .fc-daygrid-day.fc-day-today {
  background-color: rgba(239, 246, 255, 0.3);
}

.fc .fc-daygrid-day-number {
  font-size: 0.875rem;
  color: #374151;
  padding: 0.375rem;
  font-weight: 500;
}

.fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
  font-weight: 700;
  color: #2563eb;
}

.fc .fc-event {
  cursor: pointer;
  border: 0;
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.fc .fc-event-title {
  font-weight: 500;
}

.fc .fc-daygrid-event {
  margin-bottom: 0.125rem;
}

.fc .fc-scrollgrid {
  border-color: #f3f4f6;
}

.fc .fc-scrollgrid-section-header {
  border-color: #f3f4f6;
}

.fc .fc-timegrid-slot {
  border-color: #f3f4f6;
}

.fc .fc-timegrid-col {
  border-color: #f3f4f6;
}

.fc .fc-timegrid-axis {
  border-color: #f3f4f6;
}

.fc .fc-timegrid-axis-cushion {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Custom event type colors with light backgrounds */
.fc .fc-event.event-blue {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
}
.fc .fc-event.event-green {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}
.fc .fc-event.event-emerald {
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
}
.fc .fc-event.event-indigo {
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4338ca;
}
.fc .fc-event.event-orange {
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
  color: #c2410c;
}
.fc .fc-event.event-teal {
  background-color: #f0fdfa;
  border: 1px solid #99f6e4;
  color: #0f766e;
}
.fc .fc-event.event-purple {
  background-color: #faf5ff;
  border: 1px solid #e9d5ff;
  color: #7c3aed;
}
.fc .fc-event.event-pink {
  background-color: #fdf2f8;
  border: 1px solid #fbcfe8;
  color: #be185d;
}
.fc .fc-event.event-yellow {
  background-color: #fefce8;
  border: 1px solid #fef08a;
  color: #a16207;
}
.fc .fc-event.event-red {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}
.fc .fc-event.event-gray {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
}
.fc .fc-event.event-cyan {
  background-color: #ecfeff;
  border: 1px solid #a5f3fc;
  color: #0e7490;
}
.fc .fc-event.event-rose {
  background-color: #fff1f2;
  border: 1px solid #fecdd3;
  color: #be123c;
}
.fc .fc-event.event-slate {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
}

/* Mobile Filter Drawer Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Mobile Calendar Adjustments */
@media (max-width: 1023px) {
  .fc .fc-toolbar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .fc .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
  }
  
  .fc .fc-button {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
  
  .fc .fc-toolbar-title {
    font-size: 0.875rem;
  }
}
</style>
