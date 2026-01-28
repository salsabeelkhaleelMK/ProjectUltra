<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-md max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle class="text-lg">{{ title || 'Reassign' }}</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full">
          <p class="text-xs text-muted-foreground mb-4">
            Select a user or team to assign:
          </p>
          
          <!-- Search Input -->
          <div class="mb-4 w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users or teams..."
            class="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/15"
          />
        </div>

        <!-- Combined List (Teams and Users) -->
        <div class="space-y-2 max-h-96 overflow-y-auto mb-4">
          <button
            v-for="item in filteredAssignees"
            :key="`${item.type}-${item.id}`"
            @click="handleSelect(item)"
            class="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:border-brand-dark/30 transition-colors text-left"
            :class="{ 'bg-muted border-brand-dark': selectedAssignee?.type === item.type && selectedAssignee?.id === item.id }"
          >
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
              :class="item.type === 'team' ? 'bg-green-100 text-green-700' : getRoleAvatarClass(item.role)"
            >
              <i v-if="item.type === 'team'" class="fa-solid fa-users text-sm"></i>
              <span v-else>{{ item.initials }}</span>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-foreground">{{ item.name }}</p>
              <p class="text-xs text-muted-foreground capitalize">
                {{ item.type === 'team' ? 'Team' : `${item.role} • ${item.email}` }}
              </p>
            </div>
            <i v-if="selectedAssignee?.type === item.type && selectedAssignee?.id === item.id" class="fa-solid fa-check text-brand-dark"></i>
          </button>
          
          <!-- Empty State -->
          <div v-if="filteredAssignees.length === 0" class="text-center py-8">
            <i class="fa-solid fa-search text-3xl text-muted-foreground mb-2"></i>
            <p class="text-sm text-muted-foreground">No users or teams found</p>
          </div>
          </div>
        </div>
        
        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto text-sm"
            @click="$emit('close')"
          />
          <Button
            :label="confirmLabel || 'Reassign'"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto text-sm !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
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
import { Button } from '@motork/component-library/future/primitives'
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
  },
  title: {
    type: String,
    default: 'Reassign'
  },
  confirmLabel: {
    type: String,
    default: 'Reassign'
  }
})

const emit = defineEmits(['close', 'confirm'])

// Prevent automatic attribute inheritance since DialogPortal uses Teleport
defineOptions({
  inheritAttrs: false
})

const usersStore = useUsersStore()
const selectedAssignee = ref(null)
const searchQuery = ref('')

const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

// Combine teams and users into one list
const allAssignees = computed(() => {
  const teams = assignableTeams.value.map(team => ({
    ...team,
    type: 'team'
  }))
  
  const users = assignableUsers.value.map(user => ({
    ...user,
    type: 'user'
  }))
  
  return [...teams, ...users]
})

// Filter based on search query
const filteredAssignees = computed(() => {
  if (!searchQuery.value.trim()) {
    return allAssignees.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return allAssignees.value.filter(item => {
    const name = item.name.toLowerCase()
    const email = item.email?.toLowerCase() || ''
    const role = item.role?.toLowerCase() || ''
    const type = item.type.toLowerCase()
    
    return name.includes(query) || 
           email.includes(query) || 
           role.includes(query) ||
           type.includes(query)
  })
})

const getRoleAvatarClass = (role) => {
  const classes = {
    'manager': 'bg-blue-100 text-blue-700',
    'salesman': 'bg-purple-100 text-purple-700',
    'operator': 'bg-orange-100 text-orange-700'
  }
  return classes[role] || 'bg-muted text-muted-foreground'
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    selectedAssignee.value = null
    searchQuery.value = ''
  }
})

const handleSelect = (assignee) => {
  selectedAssignee.value = assignee
}

const handleConfirm = () => {
  if (selectedAssignee.value) {
    emit('confirm', selectedAssignee.value)
    selectedAssignee.value = null
    searchQuery.value = ''
  }
}
</script>

