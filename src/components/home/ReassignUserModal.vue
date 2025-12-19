<template>
  <ModalShell :show="show" @close="$emit('close')" title="Reassign">
    <p class="text-sm text-gray-600 mb-4">
      Select a user to reassign:
    </p>
    
    <div class="space-y-2 max-h-96 overflow-y-auto mb-4">
      <button
        v-for="user in assignableUsers"
        :key="user.id"
        @click="handleSelect(user.id)"
        class="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors text-left"
        :class="{ 'bg-primary-50 border-primary-400': selectedUserId === user.id }"
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
        <i v-if="selectedUserId === user.id" class="fa-solid fa-check text-primary-600"></i>
      </button>
    </div>
    
    <!-- Override footer slot to prevent default footer -->
    <template #footer>
      <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          :disabled="!selectedUserId"
          class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reassign
        </button>
      </div>
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
const selectedUserId = ref(null)

const assignableUsers = computed(() => usersStore.assignableUsers)

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
    selectedUserId.value = null
  }
})

const handleSelect = (userId) => {
  selectedUserId.value = userId
}

const handleConfirm = () => {
  if (selectedUserId.value) {
    emit('confirm', selectedUserId.value)
    selectedUserId.value = null
  }
}
</script>

