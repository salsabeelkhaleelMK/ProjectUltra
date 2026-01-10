<template>
  <div class="hidden md:flex w-16 bg-[#1a1a1a] flex-col items-center py-5 gap-6 text-gray-400 shrink-0 z-20 h-screen fixed left-0 top-0">
    <!-- Logo/Brand -->
    <div 
      class="w-10 h-10 bg-[#F90032] rounded-lg flex items-center justify-center text-white mb-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
      @click="router.push('/home')"
    >
      <span class="font-bold text-lg">PU</span>
    </div>
    
    <!-- Navigation Icons -->
    <!-- Add New (Direct link to add-new page) -->
    <router-link
      to="/add-new"
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/add-new') }"
      title="Add New Customer"
    >
      <i class="fa-solid fa-plus"></i>
    </router-link>

    <!-- Home -->
    <router-link
      to="/home"
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/home') }"
    >
      <i class="fa-solid fa-house"></i>
    </router-link>
    
    <!-- Primary Navigation -->
    <router-link 
      to="/tasks" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/tasks') }"
      title="Tasks"
    >
      <i class="fa-solid fa-list-check"></i>
      <div v-if="hotLeadsCount > 0" class="absolute -right-1 top-0 w-2 h-2 bg-red-500 rounded-full"></div>
    </router-link>
    
    <router-link 
      to="/customers" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/customers') }"
      title="Customers"
    >
      <i class="fa-solid fa-users"></i>
    </router-link>
    
    <router-link 
      to="/calendar" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/calendar') }"
      title="Calendar"
    >
      <i class="fa-regular fa-calendar"></i>
    </router-link>
    
    <router-link 
      v-if="userStore.canAccessReports()"
      to="/reports" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/reports') }"
      title="Reports"
    >
      <i class="fa-solid fa-chart-pie"></i>
    </router-link>
    
    <!-- Bottom Icons -->
    <div class="mt-auto pb-4 flex flex-col gap-6 items-center w-full">
      <!-- Lists Icon with Dropdown -->
      <div class="relative" ref="listsContainer">
        <button
          @click.stop="toggleListsMenu"
          class="nav-icon"
          :class="{ 'nav-icon-active': isActive('/vehicles') || showListsMenu }"
          title="Lists"
        >
          <i class="fa-solid fa-list"></i>
        </button>
        
        <!-- Lists Dropdown Menu -->
        <transition name="dropdown">
          <div 
            v-if="showListsMenu"
            class="absolute left-full ml-2 bottom-0 mb-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-[100]"
            @click.stop
          >
            <router-link 
              to="/vehicles"
              @click="showListsMenu = false"
              class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
              :class="{ 'bg-blue-50 text-blue-700': isActive('/vehicles') }"
            >
              <i class="fa-solid fa-car w-5 text-gray-400" :class="{ 'text-blue-600': isActive('/vehicles') }"></i> Vehicles
            </router-link>
          </div>
        </transition>
      </div>
      
      <!-- Settings Icon -->
      <button
        v-if="userStore.canAccessSettings()"
        class="nav-icon"
        title="Settings"
      >
        <i class="fa-solid fa-gear"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const leadsStore = useLeadsStore()
const userStore = useUserStore()

const showListsMenu = ref(false)
const listsContainer = ref(null)

const hotLeadsCount = computed(() => leadsStore.hotLeads.length)

const isActive = (path) => {
  return route.path.startsWith(path)
}

const toggleListsMenu = () => {
  showListsMenu.value = !showListsMenu.value
}

const handleClickOutside = (event) => {
  if (listsContainer.value && !listsContainer.value.contains(event.target)) {
    showListsMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-icon {
  @apply w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all relative;
  @apply hover:text-white hover:bg-gray-700;
}

.nav-icon-active {
  @apply text-white bg-gray-700;
}

.nav-divider {
  @apply w-8 h-px bg-gray-700/60 self-center my-1;
}

.nav-label {
  @apply text-[10px] uppercase tracking-[0.15em] text-gray-400 text-center w-full;
}

/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
