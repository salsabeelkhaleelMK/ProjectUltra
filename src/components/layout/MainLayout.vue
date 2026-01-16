<template>
  <div class="h-screen flex bg-surface">
    <!-- Left Icon Sidebar (Desktop Only) -->
    <IconSidebar />
    
    <!-- Mobile Sidebar Drawer -->
    <MobileSidebar :is-open="isMobileSidebarOpen" @close="isMobileSidebarOpen = false" />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col md:ml-16 min-w-0 overflow-hidden">
      <!-- Top Header -->
      <TopHeader @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen" />
      
      <!-- Page Content -->
      <main class="flex-1 overflow-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IconSidebar from './IconSidebar.vue'
import TopHeader from './TopHeader.vue'
import MobileSidebar from './MobileSidebar.vue'

const isMobileSidebarOpen = ref(false)
</script>

