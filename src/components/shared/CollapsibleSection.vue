<template>
  <div class="border border-black/5 rounded-lg overflow-hidden">
    <!-- Section Header -->
    <button
      @click="$emit('toggle')"
      class="w-full flex items-center justify-between px-4 py-3 bg-surfaceSecondary/30 hover:bg-surfaceSecondary/50 transition-colors"
    >
      <h6 class="font-semibold text-heading text-sm">{{ title }}</h6>
      <i
        class="fa-solid fa-chevron-down text-xs text-sub transition-transform duration-200"
        :class="{ 'rotate-180': isExpanded }"
      ></i>
    </button>
    
    <!-- Section Content -->
    <transition name="expand">
      <div v-if="isExpanded" class="px-4 pb-4">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
