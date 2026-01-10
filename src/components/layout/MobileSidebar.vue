<template>
  <!-- Backdrop -->
  <transition name="fade">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="$emit('close')"
    ></div>
  </transition>
  
  <!-- Sidebar Drawer -->
  <transition name="slide">
    <div 
      v-if="isOpen"
      class="fixed top-0 left-0 bottom-0 w-64 bg-[#1a1a1a] z-50 md:hidden overflow-y-auto safe-area-top safe-area-bottom"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#F90032] rounded-lg flex items-center justify-center text-white shadow-lg">
            <span class="font-bold text-lg">PU</span>
          </div>
          <span class="text-white font-bold">Project Ultra</span>
        </div>
        <button 
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Navigation Items -->
      <div class="py-4">
        <!-- Add New Section -->
        <div class="px-4 mb-1">
          <router-link
            to="/add-new"
            @click="$emit('close')"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            :class="{ 'text-white bg-gray-700': isActive('/add-new') }"
          >
            <i class="fa-solid fa-plus"></i>
            <span class="font-medium">Add New</span>
          </router-link>
        </div>

        <!-- Home -->
        <div class="px-4 mb-4">
          <router-link
            to="/home"
            @click="$emit('close')"
            class="mobile-sidebar-link"
            :class="{ 'mobile-sidebar-link-active': isActive('/home') }"
          >
            <i class="fa-solid fa-house w-5"></i>
            <span>Home</span>
          </router-link>
        </div>
        
        <!-- Primary Navigation -->
        <div class="px-4 space-y-1 mb-4">
          <router-link 
            to="/tasks/1" 
            @click="$emit('close')"
            class="mobile-sidebar-link"
            :class="{ 'mobile-sidebar-link-active': isActive('/tasks') }"
          >
            <i class="fa-solid fa-list-check w-5"></i>
            <span>Tasks</span>
            <div v-if="hotLeadsCount > 0" class="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {{ hotLeadsCount }}
            </div>
          </router-link>
          
          <router-link 
            to="/customers" 
            @click="$emit('close')"
            class="mobile-sidebar-link"
            :class="{ 'mobile-sidebar-link-active': isActive('/customers') }"
          >
            <i class="fa-solid fa-users w-5"></i>
            <span>Customers</span>
          </router-link>
          
          <router-link 
            to="/calendar" 
            @click="$emit('close')"
            class="mobile-sidebar-link"
            :class="{ 'mobile-sidebar-link-active': isActive('/calendar') }"
          >
            <i class="fa-regular fa-calendar w-5"></i>
            <span>Calendar</span>
          </router-link>
          
          <router-link 
            to="/reports" 
            @click="$emit('close')"
            class="mobile-sidebar-link"
            :class="{ 'mobile-sidebar-link-active': isActive('/reports') }"
          >
            <i class="fa-solid fa-chart-pie w-5"></i>
            <span>Reports</span>
          </router-link>
        </div>
        
        <!-- Divider -->
        <div class="h-px bg-gray-700 mx-4 my-4"></div>
        
        <!-- Secondary Navigation -->
        <div class="px-4 space-y-1">
          <!-- Lists Submenu -->
          <button
            @click="toggleListsMenu"
            class="mobile-sidebar-link"
            :class="{ 'mobile-sidebar-link-active': isActive('/vehicles') }"
          >
            <i class="fa-solid fa-list w-5"></i>
            <span>Lists</span>
            <i class="fa-solid fa-chevron-down ml-auto text-xs" :class="{ 'rotate-180': showListsMenu }"></i>
          </button>
          
          <!-- Lists Submenu Items -->
          <div v-if="showListsMenu" class="pl-8 space-y-1 mt-1">
            <router-link 
              to="/vehicles"
              @click="$emit('close')"
              class="mobile-sidebar-link text-sm"
              :class="{ 'mobile-sidebar-link-active': isActive('/vehicles') }"
            >
              <i class="fa-solid fa-car w-5 text-gray-500"></i>
              <span>Vehicles</span>
            </router-link>
          </div>
          
          <button class="mobile-sidebar-link">
            <i class="fa-solid fa-gear w-5"></i>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const route = useRoute()
const leadsStore = useLeadsStore()

const showAddMenu = ref(false)
const showListsMenu = ref(false)

const hotLeadsCount = computed(() => leadsStore.hotLeads.length)

const isActive = (path) => {
  return route.path.startsWith(path)
}

const toggleAddMenu = () => {
  showAddMenu.value = !showAddMenu.value
}

const toggleListsMenu = () => {
  showListsMenu.value = !showListsMenu.value
}

const handleAddItem = (type) => {
  showAddMenu.value = false
  emit('close')
  // TODO: Open creation modals for each entity type
}
</script>

<style scoped>
@reference "tailwindcss";
.mobile-sidebar-link {
  @apply flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors;
}

.mobile-sidebar-link-active {
  @apply text-white bg-gray-700;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>

