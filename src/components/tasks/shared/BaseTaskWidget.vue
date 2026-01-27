<template>
  <div
    class="rounded-lg flex flex-col bg-muted"
  >
    <div
      class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
    >
      <div class="p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-foreground text-sm">{{ title }}</h4>
            <p class="text-xs text-muted-foreground mt-0.5">{{ description }}</p>
          </div>
          <slot name="badge" />
        </div>
        
        <div class="flex gap-3 flex-wrap">
          <slot name="actions" />
        </div>
        
        <slot name="survey" />
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  colorScheme: {
    type: Object,
    required: false,
    default: () => ({ background: '', border: '' })
  }
})
</script>



