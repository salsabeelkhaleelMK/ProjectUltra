<template>
  <div class="page-container flex items-center justify-center min-h-screen bg-muted">
    <div class="text-center max-w-md px-4">
      <!-- Icon -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
          <i class="fa-solid fa-ban text-red-600 text-4xl"></i>
        </div>
      </div>
      
      <!-- Heading -->
      <h1 class="page-header-title mb-4">Access Denied</h1>
      
      <!-- Message -->
      <p class="text-content mb-2">
        You don't have permission to access this page.
      </p>
      <p class="text-meta mb-8">
        This page is only accessible to managers.
      </p>
      
      <!-- Action Button -->
      <button
        @click="goToTasks"
        class="group flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-red-100 hover:bg-red-50 hover:text-brand-red transition-all"
      >
        <i class="fa-solid fa-arrow-left text-muted-foreground group-hover:text-brand-red"></i>
        Return to Tasks
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTasks = () => {
  router.push('/tasks')
}
</script>






