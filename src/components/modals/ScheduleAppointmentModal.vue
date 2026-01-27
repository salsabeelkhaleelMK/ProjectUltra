<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-4xl max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle class="text-lg">Schedule Appointment</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-6">
          <!-- Assignment Options -->
          <div class="space-y-3">
            <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="assignmentMode === 'assign-only' 
                ? 'border-green-600 bg-green-50' 
                : 'border-border hover:border-green-600/30'">
              <input 
                type="radio" 
                v-model="assignmentMode"
                value="assign-only"
                class="w-4 h-4 text-green-600 focus:ring-green-600 border-gray-300"
              />
              <span class="text-sm font-medium text-foreground">Assign only</span>
            </label>
            
            <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="assignmentMode === 'assign-and-schedule' 
                ? 'border-green-600 bg-green-50' 
                : 'border-border hover:border-green-600/30'">
              <input 
                type="radio" 
                v-model="assignmentMode"
                value="assign-and-schedule"
                class="w-4 h-4 text-green-600 focus:ring-green-600 border-gray-300"
              />
              <span class="text-sm font-medium text-foreground">Assign and schedule</span>
            </label>
          </div>

          <!-- Schedule Section -->
          <div v-if="assignmentMode === 'assign-and-schedule'" class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
            <h5 class="font-semibold text-foreground text-sm mb-4">{{ t('forms.schedule.title') }}</h5>
            
            <!-- Event Type -->
            <div class="mb-4">
              <Label class="block text-sm font-medium text-muted-foreground mb-1.5">{{ t('forms.schedule.eventType.label') }}</Label>
              <SelectMenu
                v-model="appointmentType"
                :items="eventTypeOptions"
                :placeholder="t('forms.schedule.eventType.placeholder')"
                value-key="value"
                class="w-full"
              >
                <template #item="{ item }">
                  <span>{{ item.label }}</span>
                </template>
              </SelectMenu>
            </div>
            
            <!-- Duration -->
            <div class="mb-4">
              <Label class="block text-sm font-medium text-muted-foreground mb-1.5">{{ t('forms.schedule.duration.label') }}</Label>
              <div class="flex gap-2">
                <button 
                  @click="duration = '30min'"
                  class="px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all"
                  :class="duration === '30min' 
                    ? 'border-primary bg-muted text-foreground' 
                    : 'border-border text-muted-foreground hover:border-primary/30'"
                >
                  {{ t('forms.schedule.duration.30min') }}
                </button>
                <button 
                  @click="duration = '60min'"
                  class="px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all"
                  :class="duration === '60min' 
                    ? 'border-primary bg-muted text-foreground' 
                    : 'border-border text-muted-foreground hover:border-primary/30'"
                >
                  {{ t('forms.schedule.duration.60min') }}
                </button>
                <button 
                  @click="duration = 'custom'"
                  class="px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all"
                  :class="duration === 'custom' 
                    ? 'border-primary bg-muted text-foreground' 
                    : 'border-border text-muted-foreground hover:border-primary/30'"
                >
                  {{ t('forms.schedule.duration.custom') }}
                </button>
              </div>
            </div>

            <!-- Calendar and Time Slots - Two Column Layout -->
            <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Left Column - Calendar -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <button 
                      @click="previousMonth"
                      class="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <i class="fa-solid fa-chevron-left text-sm text-muted-foreground"></i>
                    </button>
                    <h6 class="text-sm font-semibold text-foreground">{{ currentMonthYear }}</h6>
                    <button 
                      @click="nextMonth"
                      class="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <i class="fa-solid fa-chevron-right text-sm text-muted-foreground"></i>
                    </button>
                  </div>
                  
                  <!-- Calendar Grid -->
                  <div class="grid grid-cols-7 gap-1 mb-2">
                    <div v-for="day in calendarDayLabels" 
                      :key="day"
                      class="text-center text-xs font-medium text-muted-foreground py-2">
                      {{ day }}
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-7 gap-1">
                    <div 
                      v-for="(day, index) in calendarDays" 
                      :key="index"
                      @click="selectDate(day)"
                      class="aspect-square flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all"
                      :class="isSelectedDate(day) 
                        ? 'bg-primary text-white' 
                        : day ? 'text-muted-foreground hover:bg-muted' : 'text-transparent'"
                    >
                      {{ day }}
                    </div>
                  </div>
                </div>

                <!-- Right Column - Time Slots -->
                <div>
                  <h6 class="text-sm font-semibold text-foreground mb-4">{{ selectedDateLabel }}</h6>
                  <div v-if="appointmentDate && availableSlots.length > 0" class="space-y-2">
                    <button 
                      v-for="slot in availableSlots"
                      :key="slot"
                      @click="selectedTimeSlot = slot"
                      class="w-full py-2 px-4 bg-white border border-border rounded-lg shadow-sm text-sm font-medium text-center transition-all"
                      :class="selectedTimeSlot === slot 
                        ? 'border-primary bg-muted text-foreground' 
                        : 'text-muted-foreground hover:border-primary/30'"
                    >
                      {{ slot }}
                    </button>
                  </div>
                  <div v-else-if="appointmentDate && availableSlots.length === 0" class="text-sm text-muted-foreground py-4 text-center">
                    {{ t('forms.schedule.timeSlots.noSlots') }}
                  </div>
                  <div v-else class="text-sm text-muted-foreground py-4 text-center">
                    {{ t('forms.schedule.timeSlots.selectDate') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 mt-6">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto text-sm"
            @click="handleClose"
          />
          <Button
            label="Confirm Appointment"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto text-sm !bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            :disabled="!isValid"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SelectMenu } from '@motork/component-library/future/components'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  Label
} from '@motork/component-library/future/primitives'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'
import { 
  getAvailabilityForAssignee, 
  getAvailabilityStatus,
  findAlternativeAssignees 
} from '@/services/availabilityService'

const { t } = useI18n()

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  preselectedAssignee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'confirm'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const assignmentMode = ref('assign-and-schedule')
const appointmentType = ref('')
const selectedAssignee = ref(null)
const appointmentDate = ref('')
const selectedTimeSlot = ref('')
const duration = ref('30min')
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDay = ref(null)

// Get assignable users and teams from store
const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

// Current month/year display
const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// Calendar days for current month (Monday = 0, Sunday = 6)
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const daysInMonth = lastDay.getDate()
  // Convert Sunday (0) to 6, Monday (1) to 0, etc. so Monday is first
  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  
  const days = []
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }
  return days
})

// Event type options
const eventTypeOptions = computed(() => [
  { value: 'Showroom Visit', label: t('forms.schedule.eventType.options.showroomVisit') },
  { value: 'Test Drive', label: t('forms.schedule.eventType.options.testDrive') },
  { value: 'Video Call', label: t('forms.schedule.eventType.options.videoCall') },
  { value: 'Home Visit', label: t('forms.schedule.eventType.options.homeVisit') },
  { value: 'Closing Meeting', label: t('forms.schedule.eventType.options.closingMeeting') }
])

// Calendar day labels - start from Monday
const calendarDayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

// Selected date label
const selectedDateLabel = computed(() => {
  if (!selectedDay.value || !appointmentDate.value) {
    return t('forms.schedule.timeSlots.selectDate')
  }
  const date = new Date(appointmentDate.value)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
})

// Check if date is selected
const isSelectedDate = (day) => {
  if (!day || !appointmentDate.value) return false
  const selected = new Date(appointmentDate.value)
  return selected.getDate() === day && 
         selected.getMonth() === currentMonth.value && 
         selected.getFullYear() === currentYear.value
}

// Select date
const selectDate = (day) => {
  if (!day) return
  const date = new Date(currentYear.value, currentMonth.value, day)
  appointmentDate.value = date.toISOString().split('T')[0]
  selectedDay.value = day
  selectedTimeSlot.value = ''
}

// Navigate months
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Get available slots for selected assignee and date
const availableSlots = computed(() => {
  if (!appointmentDate.value || !selectedAssignee.value) return []
  return getAvailabilityForAssignee(selectedAssignee.value, appointmentDate.value)
})

// Initialize assignee function
const initializeAssignee = () => {
  if (props.preselectedAssignee) {
    const { type, id } = props.preselectedAssignee
    selectedAssignee.value = `${type}-${id}`
  } else {
    selectedAssignee.value = `user-${userStore.currentUser?.id || 1}`
  }
}

// Initialize assignee immediately
initializeAssignee()

// Check if form is valid
const isValid = computed(() => {
  if (assignmentMode.value === 'assign-only') {
    return true // Just assigning, no schedule needed
  }
  return !!(appointmentType.value && appointmentDate.value && selectedTimeSlot.value && selectedAssignee.value)
})

// Initialize assignee when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    initializeAssignee()
  } else {
    resetForm()
  }
})

// Watch for date changes to reset time slot
watch(appointmentDate, () => {
  selectedTimeSlot.value = ''
})

const resetForm = () => {
  assignmentMode.value = 'assign-and-schedule'
  appointmentType.value = ''
  appointmentDate.value = ''
  selectedTimeSlot.value = ''
  duration.value = '30min'
  selectedDay.value = null
  const today = new Date()
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleConfirm = () => {
  if (!isValid.value) {
    return
  }
  
  const isTeam = selectedAssignee.value.startsWith('team-')
  const id = parseInt(selectedAssignee.value.split('-')[1])
  
  let assigneeData = {}
  
  if (isTeam) {
    const team = usersStore.getTeamById(id)
    assigneeData = {
      assigneeType: 'team',
      teamId: id,
      team: team?.name || 'Unknown Team',
      assignee: null,
      assigneeId: null
    }
  } else {
    const selectedUser = usersStore.getUserById(id)
    assigneeData = {
      assigneeType: 'user',
      assigneeId: id,
      assignee: selectedUser?.name || 'Unknown',
      teamId: null,
      team: null
    }
  }
  
  const confirmData = {
    ...assigneeData
  }
  
  if (assignmentMode.value === 'assign-and-schedule') {
    confirmData.type = appointmentType.value
    confirmData.date = appointmentDate.value
    confirmData.time = selectedTimeSlot.value
    confirmData.duration = duration.value
  }
  
  emit('confirm', confirmData)
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>
