<template>
  <div class="flex gap-0 md:gap-8 text-base font-medium text-slate-500 py-1">
    <div 
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('update:modelValue', tab.key)"
      class="flex-1 md:flex-none pb-2 border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
      :class="modelValue === tab.key ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-700 hover:border-slate-200'"
    >
      <!-- Icon (always visible) -->
      <i :class="getIconClass(tab.key)" class="text-base md:text-base"></i>
      
      <!-- Label (hidden on mobile, visible on desktop) -->
      <span class="hidden md:inline whitespace-nowrap">{{ tab.label }}</span>
      
      <!-- Count badge -->
      <span 
        v-if="tab.count !== undefined"
        class="inline-flex items-center justify-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold"
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

// Icon mapping for each tab type
const iconMap = {
  overview: 'fa-solid fa-house',
  note: 'fa-solid fa-note-sticky',
  communication: 'fa-solid fa-comments',
  attachment: 'fa-solid fa-paperclip'
}

const getIconClass = (tabKey) => {
  return iconMap[tabKey] || 'fa-solid fa-circle'
}
</script>

