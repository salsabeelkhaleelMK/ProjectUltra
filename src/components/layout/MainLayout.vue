<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Left Icon Sidebar -->
    <IconSidebar />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col ml-16 min-w-0">
      <!-- Top Header -->
      <TopHeader />
      
      <!-- Page Content -->
      <main class="flex-1 overflow-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import IconSidebar from './IconSidebar.vue'
import TopHeader from './TopHeader.vue'
</script>

