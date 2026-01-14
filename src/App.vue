<template>
  <div id="app" class="h-screen">
    <router-view />
    <Toast :notifications="toastStore.notifications" :delay="toastStore.defaultDelayMs" />
  </div>
</template>

<script setup>
import { Toast } from '@motork/component-library'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>
