<template>
  <div class="flex gap-8 text-sm font-medium text-gray-500 py-1 overflow-x-auto scrollbar-hide">
    <div 
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('update:modelValue', tab.key)"
      class="pb-2 border-b-2 cursor-pointer whitespace-nowrap transition-all"
      :class="modelValue === tab.key ? 'border-slate-700 text-slate-800' : 'border-transparent hover:text-gray-700 hover:border-gray-300'"
    >
      {{ tab.label }} 
      <span 
        v-if="tab.count !== undefined"
        class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full"
        :class="modelValue === tab.key ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'"
      >
        {{ tab.count }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

