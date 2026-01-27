<template>
  <!-- Compact Icon-Only View Toggle -->
  <div class="flex items-center gap-1 bg-muted rounded-full p-1">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:view', option.value)"
      :class="[
        'w-8 h-8 flex items-center justify-center rounded-full transition-all',
        view === option.value 
          ? 'bg-surface text-brand-red shadow-sm' 
          : 'text-muted-foreground hover:text-foreground'
      ]"
      :title="option.label"
    >
      <i :class="option.icon" class="text-xs"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  view: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(opt => 
        opt.value && opt.icon && opt.label
      )
    }
  }
})

defineEmits(['update:view'])
</script>

