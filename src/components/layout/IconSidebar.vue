<template>
  <div class="w-16 bg-[#1a1a1a] flex flex-col items-center py-5 gap-6 text-gray-400 shrink-0 z-20 h-screen fixed left-0 top-0">
    <!-- Logo/Brand -->
    <div 
      class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-900 mb-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
      @click="router.push('/')"
    >
      <span class="font-bold text-lg">L</span>
    </div>
    
    <!-- Navigation Icons -->
    <!-- Add Button with Dropdown -->
    <div class="relative" ref="addContainer">
      <button
        @click.stop="toggleAddMenu"
        class="nav-icon"
        :class="{ 'nav-icon-active': showAddMenu }"
        title="Add New"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
      
      <!-- Add Dropdown Menu -->
      <transition name="dropdown">
        <div 
          v-if="showAddMenu"
          class="absolute left-full ml-2 top-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-[100]"
          @click.stop
        >
          <button 
            @click="handleAddItem('lead')"
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <i class="fa-solid fa-address-book w-5 text-gray-400"></i> Lead
          </button>
          <button 
            @click="handleAddItem('opportunity')"
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
          >
            <i class="fa-solid fa-gem w-5 text-gray-400"></i> Opportunity
          </button>
          <button 
            @click="handleAddItem('contact')"
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
          >
            <i class="fa-solid fa-user w-5 text-gray-400"></i> Contact
          </button>
          <button 
            @click="handleAddItem('account')"
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
          >
            <i class="fa-solid fa-building w-5 text-gray-400"></i> Account
          </button>
        </div>
      </transition>
    </div>
    
    <!-- Primary -->
    <router-link 
      to="/tasks/1" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/tasks') }"
      title="Tasks"
    >
      <i class="fa-solid fa-list-check"></i>
      <div v-if="hotLeadsCount > 0" class="absolute -right-1 top-0 w-2 h-2 bg-red-500 rounded-full"></div>
    </router-link>
    
    <router-link 
      to="/pipeline" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/pipeline') }"
      title="Pipeline"
    >
      <i class="fa-solid fa-diagram-project"></i>
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
      to="/reports" 
      class="nav-icon"
      :class="{ 'nav-icon-active': isActive('/reports') }"
      title="Reports"
    >
      <i class="fa-solid fa-chart-pie"></i>
    </router-link>
    
    <!-- Bottom Icons -->
    <div class="mt-auto pb-4 flex flex-col gap-6 items-center w-full">
      <!-- Marketing Icon -->
      <router-link 
        to="/marketing" 
        class="nav-icon"
        :class="{ 'nav-icon-active': isActive('/marketing') }"
        title="Marketing"
      >
        <i class="fa-solid fa-bullhorn"></i>
      </router-link>
      
      <!-- Lists Icon with Dropdown -->
      <div class="relative" ref="listsContainer">
        <button
          @click.stop="toggleListsMenu"
          class="nav-icon"
          :class="{ 'nav-icon-active': isActive('/contacts') || isActive('/vehicles') || showListsMenu }"
          title="Lists"
        >
          <i class="fa-solid fa-list"></i>
        </button>
        
        <!-- Lists Dropdown Menu -->
        <transition name="dropdown">
          <div 
            v-if="showListsMenu"
            class="absolute left-full ml-2 bottom-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-[100]"
            @click.stop
          >
            <router-link 
              to="/contacts"
              @click="showListsMenu = false"
              class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
              :class="{ 'bg-blue-50 text-blue-700': isActive('/contacts') }"
            >
              <i class="fa-solid fa-users w-5 text-gray-400"></i> Contacts & Accounts
            </router-link>
            <router-link 
              to="/vehicles"
              @click="showListsMenu = false"
              class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
              :class="{ 'bg-blue-50 text-blue-700': isActive('/vehicles') }"
            >
              <i class="fa-solid fa-car w-5 text-gray-400"></i> Vehicles
            </router-link>
          </div>
        </transition>
      </div>
      
      <!-- Settings Icon -->
      <button
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

const router = useRouter()
const route = useRoute()
const leadsStore = useLeadsStore()

const showAddMenu = ref(false)
const showListsMenu = ref(false)
const addContainer = ref(null)
const listsContainer = ref(null)

const hotLeadsCount = computed(() => leadsStore.hotLeads.length)

const isActive = (path) => {
  return route.path.startsWith(path)
}

const toggleAddMenu = () => {
  showAddMenu.value = !showAddMenu.value
  if (showAddMenu.value) {
    showListsMenu.value = false
  }
}

const toggleListsMenu = () => {
  showListsMenu.value = !showListsMenu.value
  if (showListsMenu.value) {
    showAddMenu.value = false
  }
}

const handleAddItem = (type) => {
  showAddMenu.value = false
  // For now, we navigate to relevant pages. In the future this can
  // be extended to open specific creation modals per entity type.
  switch (type) {
    case 'lead':
    case 'opportunity':
      // Navigate to tasks page
      router.push('/tasks/1')
      break
    case 'contact':
      router.push('/contacts')
      break
    case 'account':
      router.push('/contacts')
      break
  }
}

const handleClickOutside = (event) => {
  if (addContainer.value && !addContainer.value.contains(event.target)) {
    showAddMenu.value = false
  }
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
