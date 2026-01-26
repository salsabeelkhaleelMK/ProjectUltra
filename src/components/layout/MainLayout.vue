<template>
  <div class="app-main-container">
    <!-- Left Icon Sidebar (Desktop Only) -->
    <IconSidebar />
    
    <!-- Mobile Sidebar Drawer -->
    <MobileSidebar :is-open="isMobileSidebarOpen" @close="isMobileSidebarOpen = false" />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden main-content-area">
      <!-- Mobile Header (Mobile Only) -->
      <header class="mobile-header md:hidden h-16 border-b flex items-center px-4 shrink-0 z-50">
        <Transition name="fade-button">
          <button 
            v-if="!isMobileSidebarOpen"
            @click="isMobileSidebarOpen = true"
            class="w-11 h-11 flex items-center justify-center text-body hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            aria-label="Open navigation menu"
            :aria-expanded="false"
          >
            <Menu :size="20" />
          </button>
        </Transition>
      </header>
      
      <!-- Page Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu } from 'lucide-vue-next'
import IconSidebar from './IconSidebar.vue'
import MobileSidebar from './MobileSidebar.vue'

const isMobileSidebarOpen = ref(false)
</script>

<style scoped>
.fade-button-enter-active,
.fade-button-leave-active {
  transition: opacity 0.2s ease;
}

.fade-button-enter-from,
.fade-button-leave-to {
  opacity: 0;
}
</style>
