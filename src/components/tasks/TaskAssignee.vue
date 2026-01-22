<template>
  <!-- EXTREMELY COMPACT DESIGN -->
  <div class="rounded-lg" style="background-color: var(--base-muted, #f5f5f5)">
    <div class="bg-white rounded-lg px-3 py-2 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
      
      <!-- ASSIGNED STATE: Compact owner info (avatar + name + team + dealership) -->
      <div v-if="isAssigned" class="flex items-center justify-between gap-2">
        <!-- Avatar + Comprehensive Info (single line) -->
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <div 
            class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
            :class="getRoleAvatarClass(ownerInfo.role)"
          >
            {{ getInitials(ownerInfo.name) }}
          </div>
          <div class="min-w-0 flex-1">
            <!-- Name + Team in one line -->
            <p class="text-xs font-semibold text-greys-900 truncate leading-tight">
              {{ ownerInfo.name }}
              <span class="font-normal text-greys-500">• {{ ownerInfo.team }}</span>
            </p>
            <!-- Dealership (tiny, subtle) -->
            <p class="text-[10px] text-greys-500 truncate leading-tight">
              {{ ownerInfo.dealership }}
            </p>
          </div>
        </div>
        
        <!-- Reassign button (minimal) -->
        <Button 
          variant="ghost" 
          size="sm"
          @click="showReassignModal = true"
          class="shrink-0 text-[11px] px-2 py-1"
        >
          Change
        </Button>
      </div>
      
      <!-- UNASSIGNED STATE: Assignment options -->
      <div v-else class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-greys-500 font-medium">Unassigned</p>
          <Button 
            variant="primary"
            size="sm"
            @click="assignToSelf"
            class="!bg-brand-red text-xs px-3 py-1"
          >
            Assign to me
          </Button>
        </div>
        
        <!-- Suggested Teams (compact pills) -->
        <div v-if="suggestedTeams.length > 0" class="flex gap-1.5 flex-wrap">
          <button
            v-for="team in suggestedTeams"
            :key="team.id"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium transition-all"
            :class="selectedTeam?.id === team.id 
              ? 'border-brand-blue bg-blue-50 text-brand-blue' 
              : 'border-E5E7EB hover:border-brand-blue/30 text-greys-600'"
            @click="handleTeamSelect(team)"
          >
            <i class="fa-solid fa-users text-[9px]"></i>
            {{ team.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Reassign Modal -->
  <ReassignUserModal
    :show="showReassignModal"
    title="Reassign task"
    confirm-label="Reassign"
    @close="showReassignModal = false"
    @confirm="handleReassign"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  taskType: {
    type: String,
    default: 'lead' // 'lead' | 'opportunity'
  }
})

const emit = defineEmits(['reassigned'])

const usersStore = useUsersStore()
const userStore = useUserStore()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

const showReassignModal = ref(false)
const selectedTeam = ref(null)

// Current user
const currentUser = computed(() => userStore.currentUser)

// Check if task is assigned
const isAssigned = computed(() => {
  return !!(props.task.assignee || props.task.owner || props.task.assignedTo)
})

// Get owner information from task
const ownerInfo = computed(() => {
  const assigneeName = props.task.assignee || props.task.owner || props.task.assignedTo || 'Unassigned'
  
  // Try to find the user in the users store to get full info
  const assigneeUser = usersStore.allUsers?.find(u => u.name === assigneeName)
  
  return {
    name: assigneeName,
    team: assigneeUser?.team || props.task.assigneeTeam || props.task.team || 'No team',
    dealership: assigneeUser?.dealership || props.task.assigneeDealership || 'MotorK Dealership',
    role: assigneeUser?.role || props.task.assigneeRole || 'salesman'
  }
})

// Check if current user owns this task
const isOwnedByCurrentUser = computed(() => {
  if (!currentUser.value || !isAssigned.value) return false
  return ownerInfo.value.name === currentUser.value.name
})

// Get suggested teams (first 3)
const suggestedTeams = computed(() => {
  const teams = usersStore.assignableTeams || []
  return teams.slice(0, 3)
})

// Helper functions
const getInitials = (name) => {
  if (!name || name === 'Unassigned') return '?'
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

// Assign to self
const assignToSelf = async () => {
  if (!currentUser.value) return
  
  try {
    if (props.taskType === 'lead') {
      await leadsStore.updateLead(props.task.id, { 
        assignee: currentUser.value.name,
        assigneeType: 'user',
        assigneeTeam: currentUser.value.team,
        assigneeDealership: currentUser.value.dealership,
        assigneeRole: currentUser.value.role
      })
    } else if (props.taskType === 'opportunity') {
      await opportunitiesStore.updateOpportunity(props.task.id, { 
        assignee: currentUser.value.name,
        assigneeType: 'user',
        assigneeTeam: currentUser.value.team,
        assigneeDealership: currentUser.value.dealership,
        assigneeRole: currentUser.value.role
      })
    }
    
    emit('reassigned', currentUser.value)
  } catch (error) {
    console.error('Error assigning to self:', error)
  }
}

// Handle team selection
const handleTeamSelect = async (team) => {
  selectedTeam.value = team
  
  try {
    if (props.taskType === 'lead') {
      await leadsStore.updateLead(props.task.id, { 
        assignee: team.name,
        assigneeType: 'team',
        teamId: team.id,
        assigneeTeam: team.name
      })
    } else if (props.taskType === 'opportunity') {
      await opportunitiesStore.updateOpportunity(props.task.id, { 
        assignee: team.name,
        assigneeType: 'team',
        teamId: team.id,
        assigneeTeam: team.name
      })
    }
    
    emit('reassigned', team)
  } catch (error) {
    console.error('Error assigning to team:', error)
  }
}

// Handle reassignment from modal
const handleReassign = async (assignee) => {
  try {
    const updateData = {
      assignee: assignee.name,
      assigneeType: assignee.type,
      assigneeTeam: assignee.team,
      assigneeDealership: assignee.dealership,
      assigneeRole: assignee.role
    }
    
    if (assignee.type === 'team') {
      updateData.teamId = assignee.id
    }
    
    if (props.taskType === 'lead') {
      await leadsStore.updateLead(props.task.id, updateData)
    } else if (props.taskType === 'opportunity') {
      await opportunitiesStore.updateOpportunity(props.task.id, updateData)
    }
    
    showReassignModal.value = false
    emit('reassigned', assignee)
  } catch (error) {
    console.error('Error reassigning:', error)
  }
}
</script>

<style scoped>
/* Compact styling - minimal height */
</style>
