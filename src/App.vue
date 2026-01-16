<template>
  <div id="app" class="h-screen">
    <router-view />
    <Toast :notifications="toastStore.notifications" :delay="toastStore.defaultDelayMs" />
  </div>
</template>

<script setup>
import { Toast } from '@motork/component-library'
import { useToastStore } from '@/stores/toast'
import { useTheme } from '@/composables/useTheme'

const toastStore = useToastStore()

// Initialize theme on app load
useTheme()
</script>
