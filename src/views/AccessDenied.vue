<template>
  <div class="page-container flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center max-w-md px-4">
      <!-- Icon -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
          <i class="fa-solid fa-ban text-red-600 text-4xl"></i>
        </div>
      </div>
      
      <!-- Heading -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
      
      <!-- Message -->
      <p class="text-gray-600 mb-2">
        You don't have permission to access this page.
      </p>
      <p class="text-sm text-gray-500 mb-8">
        This page is only accessible to managers.
      </p>
      
      <!-- Action Button -->
      <button
        @click="goToTasks"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
      >
        <i class="fa-solid fa-arrow-left"></i>
        Return to Tasks
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTasks = () => {
  router.push('/tasks/1')
}
</script>

