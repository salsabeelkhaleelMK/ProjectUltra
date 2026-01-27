<template>
  <BaseTaskWidget
    :title="noShowTitle"
    :description="`Appointment was scheduled for ${appointmentDate} but customer did not show up. ${noShowMessage}`"
    :color-scheme="{ background: 'bg-yellow-50/50', border: 'border-yellow-100' }"
  >
    <template #content>
      <!-- Assignment Section (only for NS1 and NS2, not NS3) -->
      <div v-if="noShowCount < 3" class="mt-4 pt-4 border-t border-black/5">
        <h5 class="font-semibold text-heading text-sm mb-4">Assign to</h5>
        
        <div class="grid grid-cols-2 gap-4">
          <!-- Team -->
          <div>
            <Label class="block text-sm font-medium text-body mb-1.5">Team <span class="text-red-600">*</span></Label>
            <SelectMenu
              v-model="selectedTeamId"
              :items="teamSelectOptions"
              placeholder="Search and select team..."
              value-key="id"
              class="w-full"
            >
              <template #item="{ item }">
                <div class="flex items-center gap-2">
                  <span class="text-sub">{{ item.dealership || 'No location' }}</span>
                  <span class="text-sub">→</span>
                  <span class="font-medium text-heading">{{ item.name }}</span>
                </div>
              </template>
            </SelectMenu>
          </div>

          <!-- Salesperson -->
          <div>
            <Label class="block text-sm font-medium text-body mb-1.5">Salesperson <span class="text-sub text-xs">(optional)</span></Label>
            <SelectMenu
              v-model="selectedSalesmanId"
              :items="salespersonSelectOptions"
              :disabled="!selectedTeam"
              placeholder="Search and select salesperson..."
              value-key="id"
              class="w-full"
            >
              <template #item="{ item }">
                <div class="flex items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
                    :class="getRoleAvatarClass(item.role)"
                  >
                    {{ getInitials(item.name) }}
                  </div>
                  <span class="font-medium text-heading">{{ item.name }}</span>
                </div>
              </template>
            </SelectMenu>
          </div>
        </div>

        <!-- Notes for sellers -->
        <div class="mt-4">
          <Label class="block text-sm font-medium text-body mb-1.5">Note for sellers</Label>
          <Textarea 
            v-model="noteForSellers"
            rows="4" 
            class="w-full"
            placeholder="Add any notes or instructions for the sellers..."
          />
        </div>

        <!-- Assign Button -->
        <div class="mt-4 flex justify-end">
          <Button
            variant="primary"
            :disabled="!selectedTeam"
            @click="handleAssignmentConfirm"
            class="bg-primary"
          >
            Assign
          </Button>
        </div>
      </div>
      
      <!-- Close as Lost Section (only for NS3) -->
      <div v-if="noShowCount >= 3" class="mt-4 pt-4 border-t border-black/5">
        <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
          <h5 class="font-semibold text-heading text-sm mb-4">Close Opportunity as Lost</h5>
          <p class="text-sm text-body mb-4">
            This is the third no-show. The opportunity should be closed as lost.
          </p>
          
          <div class="flex justify-end">
            <Button
              label="Close Opportunity as Lost"
              variant="primary"
              size="small"
              @click="handleCloseAsLost"
            />
          </div>
        </div>
      </div>
    </template>
    
  </BaseTaskWidget>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import BaseTaskWidget from '@/components/tasks/shared/BaseTaskWidget.vue'
import { Button, Label, Textarea } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { useOpportunitiesStore } from '@/stores/opportunities'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  scheduledAppointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['not-responding', 'auto-close-lost', 'set-callback', 'assigned', 'close-as-lost'])

const usersStore = useUsersStore()
const userStore = useUserStore()
const opportunitiesStore = useOpportunitiesStore()

// Assignment state (similar to LQTask.vue)
const selectedTeam = ref(null)
const selectedSalesman = ref(null)
const noteForSellers = ref('')

const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

const teamSelectOptions = computed(() => {
  return assignableTeams.value.map(team => ({
    ...team,
    label: `${team.dealership || 'No location'} → ${team.name}`,
    value: team.id
  }))
})

const salespersonSelectOptions = computed(() => {
  if (!selectedTeam.value) return []
  
  const team = selectedTeam.value
  const users = assignableUsers.value?.filter(user => 
    user.team === team.name || user.teamId === team.id
  ) || []
  
  return users.map(user => ({
    ...user,
    label: user.name,
    value: user.id
  }))
})

const selectedTeamId = computed({
  get: () => selectedTeam.value?.id || null,
  set: (id) => {
    if (!id) {
      selectedTeam.value = null
      return
    }
    const team = assignableTeams.value?.find(t => t.id === id)
    selectedTeam.value = team || null
    // Reset salesman when team changes
    if (team) {
      selectedSalesman.value = null
    }
  }
})

const selectedSalesmanId = computed({
  get: () => selectedSalesman.value?.id || null,
  set: (id) => {
    if (!id) {
      selectedSalesman.value = null
      return
    }
    const user = salespersonSelectOptions.value.find(u => u.id === id)
    selectedSalesman.value = user || null
  }
})

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRoleAvatarClass = (role) => {
  const classes = {
    'manager': 'bg-blue-100 text-blue-700',
    'salesman': 'bg-purple-100 text-purple-700',
    'operator': 'bg-orange-100 text-orange-700'
  }
  return classes[role] || 'bg-surfaceSecondary text-body'
}

// Assignment handler
async function handleAssignmentConfirm() {
  if (!selectedTeam.value) return
  
  const assigneeName = selectedSalesman.value?.name || selectedTeam.value?.name
  
  // Update opportunity with assignment
  const updateData = {
    assignee: assigneeName
  }
  
  // Add assignment note if provided
  if (noteForSellers.value) {
    updateData.assignmentNote = noteForSellers.value
  }
  
  await opportunitiesStore.updateOpportunity(props.opportunity.id, updateData)
  
  // Create activity for assignment
  await opportunitiesStore.addActivity(props.opportunity.id, {
    type: 'assignment',
    user: userStore.currentUser?.name || 'You',
    action: 'assigned opportunity',
    content: `Opportunity assigned to ${assigneeName}${noteForSellers.value ? ` with note: ${noteForSellers.value}` : ''}`,
    timestamp: new Date().toISOString()
  })
  
  // Emit assignment event
  emit('assigned', {
    opportunity: props.opportunity,
    assignee: assigneeName,
    note: noteForSellers.value
  })
  
  // Reset assignment form
  selectedTeam.value = null
  selectedSalesman.value = null
  noteForSellers.value = ''
}

// Handle close as lost for NS3
function handleCloseAsLost() {
  emit('close-as-lost', {
    opportunity: props.opportunity,
    reason: 'Multiple no shows'
  })
}

// Initialize assignment from current opportunity assignee
onMounted(() => {
  if (props.opportunity.assignee && !selectedTeam.value && !selectedSalesman.value) {
    const assigneeUser = assignableUsers.value?.find(u => u.name === props.opportunity.assignee)
    const assigneeTeam = assignableTeams.value?.find(t => t.name === props.opportunity.assignee)
    
    if (assigneeUser) {
      const userTeam = assignableTeams.value?.find(team => 
        team.name === assigneeUser.team || team.id === assigneeUser.teamId
      )
      if (userTeam) {
        selectedTeam.value = userTeam
        selectedSalesman.value = assigneeUser
      }
    } else if (assigneeTeam) {
      selectedTeam.value = assigneeTeam
    }
  }
  
  // Pre-populate assignment note if available
  if (props.opportunity.assignmentNote) {
    noteForSellers.value = props.opportunity.assignmentNote
  }
})

// Watch for opportunity assignee changes
watch(() => props.opportunity.assignee, (newAssignee) => {
  if (newAssignee && !selectedTeam.value && !selectedSalesman.value) {
    const assigneeUser = assignableUsers.value?.find(u => u.name === newAssignee)
    const assigneeTeam = assignableTeams.value?.find(t => t.name === newAssignee)
    
    if (assigneeUser) {
      const userTeam = assignableTeams.value?.find(team => 
        team.name === assigneeUser.team || team.id === assigneeUser.teamId
      )
      if (userTeam) {
        selectedTeam.value = userTeam
        selectedSalesman.value = assigneeUser
      }
    } else if (assigneeTeam) {
      selectedTeam.value = assigneeTeam
    }
  }
})

const noShowCount = computed(() => {
  return props.scheduledAppointment?.noShowCount || 0
})

const noShowTitle = computed(() => {
  const count = noShowCount.value
  if (count === 0 || count === 1) return 'NS1'
  if (count === 2) return 'NS2'
  if (count >= 3) return 'NS3'
  return `NS${count}`
})

const noShowMessage = computed(() => {
  const count = noShowCount.value
  if (count >= 3) {
    return 'This is the third no-show. The opportunity will be automatically closed as lost if another appointment is not successfully completed.'
  }
  if (count >= 2) {
    return 'This is the second no-show. Please make every effort to reach the customer and reschedule.'
  }
  return 'Follow up with customer to understand the situation and book another appointment.'
})

const appointmentDate = computed(() => {
  if (!props.scheduledAppointment?.start) return 'unknown date'
  const date = new Date(props.scheduledAppointment.start)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

</script>

