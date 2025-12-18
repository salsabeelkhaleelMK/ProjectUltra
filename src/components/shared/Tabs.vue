<template>
  <div class="flex gap-8 text-base font-medium text-slate-500 py-1 overflow-x-auto scrollbar-hide">
    <div 
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('update:modelValue', tab.key)"
      class="pb-2 border-b-2 cursor-pointer whitespace-nowrap transition-colors"
      :class="modelValue === tab.key ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-700 hover:border-slate-200'"
    >
      {{ tab.label }} 
      <span 
        v-if="tab.count !== undefined"
        class="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold"
        :class="modelValue === tab.key ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'"
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

