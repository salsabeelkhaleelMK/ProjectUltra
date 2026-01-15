<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 gap-4" style="background-color: var(--brand-gray);">
    <!-- Hamburger Menu (Mobile Only) -->
    <button 
      @click="$emit('toggle-sidebar')"
      class="md:hidden w-11 h-11 flex items-center justify-center text-gray-600 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
      aria-label="Open navigation menu"
      aria-expanded="false"
    >
      <i class="fa-solid fa-bars text-lg"></i>
    </button>
    
    <!-- Search Bar -->
    <div class="flex-1 min-w-0 max-w-lg">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="search everything" 
          class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-600 focus:bg-white transition-all placeholder-gray-400"
          @keyup.enter="handleSearch"
        >
      </div>
    </div>
    
    <!-- Right Side Actions -->
    <div class="flex items-center gap-2 md:gap-4 ml-0 md:ml-8 shrink-0">
      <!-- Action Items Icon (hidden) -->
      <router-link 
        v-if="false"
        to="/action-items"
        class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Action Items"
      >
        <i class="fa-solid fa-bell text-lg text-gray-600"></i>
        <span 
          v-if="actionItemsCount > 0"
          class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ actionItemsCount > 9 ? '9+' : actionItemsCount }}
        </span>
      </router-link>
      
      <!-- User Menu -->
      <div class="relative" v-click-outside="() => (showUserMenu = false)">
        <button 
          class="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          @click.stop="toggleUserMenu"
        >
          <div class="text-left hidden md:block">
            <div class="text-sm font-semibold text-gray-900">{{ userStore.currentUser.name }}</div>
            <div class="text-xs capitalize text-gray-500">{{ userStore.currentUser.role }}</div>
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
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-brand-red rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': userStore.currentUser.role === 'manager' }"
            >
              <i class="fa-solid fa-user-shield w-4"></i> Switch to Manager
            </button>
            <button 
              @click="switchRole('salesman')"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': userStore.currentUser.role === 'salesman' }"
            >
              <i class="fa-solid fa-user-tie w-4"></i> Switch to Salesman
            </button>
            <button 
              @click="switchRole('operator')"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': userStore.currentUser.role === 'operator' }"
            >
              <i class="fa-solid fa-headset w-4"></i> Switch to Operator
            </button>
          </div>
          <!-- Separator -->
          <div class="h-px bg-gray-200 mx-2"></div>
          <!-- Logout -->
          <div class="p-2">
            <button 
              @click="handleLogout"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <i class="fa-solid fa-right-from-bracket w-4"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useActionableQuestions } from '@/composables/useActionableQuestions'

const router = useRouter()
const userStore = useUserStore()
const { totalQuestionsCount, loadQuestions } = useActionableQuestions()

const searchQuery = ref('')
const showUserMenu = ref(false)

const actionItemsCount = computed(() => totalQuestionsCount.value)

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
  router.push('/home')
}

const handleLogout = () => {
  showUserMenu.value = false
  // TODO: Implement logout functionality
}

onMounted(() => {
  // Load action items count
  loadQuestions()
})
</script>

