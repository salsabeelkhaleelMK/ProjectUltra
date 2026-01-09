<template>
  <!-- Standard Sliding Pill -->
  <div class="flex bg-gray-100 p-1 rounded-lg w-fit">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:view', option.value)"
      :class="[
        'p-1.5 rounded-md transition-all duration-200',
        view === option.value 
          ? 'bg-white shadow-sm text-gray-900' 
          : 'text-gray-400 hover:text-gray-600'
      ]"
    >
      <i :class="option.icon" class="text-base"></i>
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

