<template>
  <ModalShell 
    :show="show" 
    @close="$emit('close')" 
    @cancel="$emit('close')"
    title="Reassign"
  >
    <p class="text-sm text-gray-600 mb-4">
      Select a user or team to reassign:
    </p>
    
    <div class="space-y-2 max-h-96 overflow-y-auto mb-4">
      <!-- Teams Section -->
      <div v-if="assignableTeams.length" class="mb-3">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">Teams</p>
        <button
          v-for="team in assignableTeams"
          :key="`team-${team.id}`"
          @click="handleSelect({ type: 'team', id: team.id, name: team.name })"
          class="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors text-left"
          :class="{ 'bg-primary-50 border-primary-400': selectedAssignee?.type === 'team' && selectedAssignee?.id === team.id }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-green-100 text-green-700"
          >
            <i class="fa-solid fa-users text-sm"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-slate-800">{{ team.name }}</p>
            <p class="text-xs text-gray-500">Team</p>
          </div>
          <i v-if="selectedAssignee?.type === 'team' && selectedAssignee?.id === team.id" class="fa-solid fa-check text-primary-600"></i>
        </button>
      </div>
      
      <!-- Users Section -->
      <div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">Users</p>
        <button
          v-for="user in assignableUsers"
          :key="`user-${user.id}`"
          @click="handleSelect({ type: 'user', id: user.id, name: user.name })"
          class="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors text-left"
          :class="{ 'bg-primary-50 border-primary-400': selectedAssignee?.type === 'user' && selectedAssignee?.id === user.id }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
            :class="getRoleAvatarClass(user.role)"
          >
            {{ user.initials }}
          </div>
          <div class="flex-1">
            <p class="font-medium text-slate-800">{{ user.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ user.role }} • {{ user.email }}</p>
          </div>
          <i v-if="selectedAssignee?.type === 'user' && selectedAssignee?.id === user.id" class="fa-solid fa-check text-primary-600"></i>
        </button>
      </div>
    </div>
    
    <!-- actions slot -->
    <template #actions>
      <Button
        label="Reassign"
        variant="primary"
        size="small"
        class="rounded-sm"
        :disabled="!selectedAssignee"
        @click="handleConfirm"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@motork/component-library'
import { useUsersStore } from '@/stores/users'
import ModalShell from '@/components/shared/ModalShell.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const usersStore = useUsersStore()
const selectedAssignee = ref(null)

const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

const getRoleAvatarClass = (role) => {
  const classes = {
    'manager': 'bg-blue-100 text-blue-700',
    'salesman': 'bg-purple-100 text-purple-700',
    'operator': 'bg-orange-100 text-orange-700'
  }
  return classes[role] || 'bg-gray-100 text-gray-700'
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    selectedAssignee.value = null
  }
})

const handleSelect = (assignee) => {
  selectedAssignee.value = assignee
}

const handleConfirm = () => {
  if (selectedAssignee.value) {
    emit('confirm', selectedAssignee.value)
    selectedAssignee.value = null
  }
}
</script>

