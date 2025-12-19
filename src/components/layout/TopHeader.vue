<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 gap-4">
    <!-- Hamburger Menu (Mobile Only) -->
    <button 
      @click="$emit('toggle-sidebar')"
      class="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <i class="fa-solid fa-bars text-lg"></i>
    </button>
    
    <!-- Search Bar -->
    <div class="flex-1 min-w-0 max-w-lg">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="search everything" 
          class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder-gray-400"
          @keyup.enter="handleSearch"
        >
      </div>
    </div>
    
    <!-- Right Side Actions -->
    <div class="flex items-center gap-2 md:gap-4 ml-0 md:ml-8 shrink-0">
      <!-- User Menu -->
      <div class="relative" ref="userMenuContainer">
        <button 
          class="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          @click.stop="toggleUserMenu"
        >
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {{ userStore.currentUser.initials }}
          </div>
          <div class="text-left hidden md:block">
            <div class="text-sm font-semibold text-gray-900">{{ userStore.currentUser.name }}</div>
            <div class="text-xs text-gray-500 capitalize">{{ userStore.currentUser.role }}</div>
          </div>
          <i class="fa-solid fa-chevron-down text-xs text-gray-400"></i>
        </button>
        
        <!-- User Dropdown -->
        <div 
          v-if="showUserMenu"
          class="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
        >
          <div class="p-3 border-b border-gray-100 bg-gray-50">
            <div class="text-sm font-semibold text-gray-900">{{ userStore.currentUser.name }}</div>
            <div class="text-xs text-gray-500">{{ userStore.currentUser.email }}</div>
          </div>
          <div class="p-2">
            <button 
              @click="switchRole('manager')"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-blue-50 text-blue-700': userStore.currentUser.role === 'manager' }"
            >
              <i class="fa-solid fa-user-shield w-4"></i> Switch to Manager
            </button>
            <button 
              @click="switchRole('salesman')"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-blue-50 text-blue-700': userStore.currentUser.role === 'salesman' }"
            >
              <i class="fa-solid fa-user-tie w-4"></i> Switch to Salesman
            </button>
            <button 
              @click="switchRole('operator')"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-blue-50 text-blue-700': userStore.currentUser.role === 'operator' }"
            >
              <i class="fa-solid fa-headset w-4"></i> Switch to Operator
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const showUserMenu = ref(false)
const userMenuContainer = ref(null)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Global search is not implemented yet; this is a no-op hook
    // that can be connected to a backend or in-memory search later.
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const switchRole = (role) => {
  userStore.switchRole(role)
  showUserMenu.value = false
  router.push('/')
}

// Click outside handler
const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

