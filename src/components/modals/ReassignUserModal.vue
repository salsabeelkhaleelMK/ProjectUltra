<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign</DialogTitle>
        </DialogHeader>

        <p class="text-meta mb-4">
          Select a user or team to reassign:
        </p>
        
        <div class="space-y-2 max-h-96 overflow-y-auto mb-4">
      <!-- Teams Section -->
      <div v-if="assignableTeams.length" class="mb-3">
        <p class="label-upper mb-2 px-1">Teams</p>
        <button
          v-for="team in assignableTeams"
          :key="`team-${team.id}`"
          @click="handleSelect({ type: 'team', id: team.id, name: team.name })"
          class="w-full flex items-center gap-3 p-3 rounded-lg border border hover:bg-surfaceSecondary hover:border-red-300 transition-colors text-left"
          :class="{ 'bg-red-50 border-red-400': selectedAssignee?.type === 'team' && selectedAssignee?.id === team.id }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-green-100 text-green-700"
          >
            <i class="fa-solid fa-users text-sm"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-heading">{{ team.name }}</p>
            <p class="text-meta">Team</p>
          </div>
          <i v-if="selectedAssignee?.type === 'team' && selectedAssignee?.id === team.id" class="fa-solid fa-check text-brand-red"></i>
        </button>
      </div>
      
      <!-- Users Section -->
      <div>
        <p class="text-xs font-semibold text-sub uppercase tracking-wide mb-2 px-1">Users</p>
        <button
          v-for="user in assignableUsers"
          :key="`user-${user.id}`"
          @click="handleSelect({ type: 'user', id: user.id, name: user.name })"
          class="w-full flex items-center gap-3 p-3 rounded-lg border border hover:bg-surfaceSecondary hover:border-red-300 transition-colors text-left"
          :class="{ 'bg-red-50 border-red-400': selectedAssignee?.type === 'user' && selectedAssignee?.id === user.id }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
            :class="getRoleAvatarClass(user.role)"
          >
            {{ user.initials }}
          </div>
          <div class="flex-1">
            <p class="font-medium text-heading">{{ user.name }}</p>
            <p class="text-meta capitalize">{{ user.role }} • {{ user.email }}</p>
          </div>
          <i v-if="selectedAssignee?.type === 'user' && selectedAssignee?.id === user.id" class="fa-solid fa-check text-brand-red"></i>
        </button>
      </div>
    </div>
    
        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            label="Reassign"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!selectedAssignee"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@motork/component-library'
import { useUsersStore } from '@/stores/users'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'

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
  return classes[role] || 'bg-surfaceSecondary text-body'
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
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

