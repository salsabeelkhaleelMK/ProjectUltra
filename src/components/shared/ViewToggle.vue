<template>
  <!-- Pill Shape View Toggle -->
  <div class="flex items-center bg-gray-100 rounded-full p-1">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:view', option.value)"
      :class="[
        'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
        view === option.value 
          ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
          : 'text-gray-500 hover:text-gray-800'
      ]"
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

