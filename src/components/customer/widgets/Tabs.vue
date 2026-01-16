<template>
  <div class="flex gap-0 md:gap-8 text-content font-medium text-sub py-1">
    <div 
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('update:modelValue', tab.key)"
      class="flex-1 md:flex-none pb-2 border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
      :class="modelValue === tab.key ? 'border-brand-red text-brand-darkDarker' : 'border-transparent hover:text-body hover:border-slate-200'"
    >
      <!-- Icon (always visible) -->
      <i 
        :class="[getIconClass(tab.key), 'text-base md:text-base', modelValue === tab.key ? 'text-brand-darkDarker' : 'text-sub']"
      ></i>
      
      <!-- Label (hidden on mobile, visible on desktop) -->
      <span class="hidden md:inline whitespace-nowrap" :class="modelValue === tab.key ? 'text-brand-darkDarker' : ''">{{ tab.label }}</span>
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
