<template>
  <div class="ai-badge">
    <svg
      class="ai-badge-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#40B3E9;stop-opacity:1" />
          <stop offset="33%" style="stop-color:#9333EA;stop-opacity:1" />
          <stop offset="66%" style="stop-color:#EC4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F97316;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path
        d="M8 2L8.5 5.5L12 6L8.5 6.5L8 10L7.5 6.5L4 6L7.5 5.5L8 2Z"
        fill="url(#sparkle-gradient)"
      />
      <circle cx="4" cy="4" r="1.5" fill="url(#sparkle-gradient)" />
      <circle cx="12" cy="12" r="1.5" fill="url(#sparkle-gradient)" />
    </svg>
    <span class="ai-badge-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'MotorK AI'
  }
})
</script>

<style scoped>
.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem; /* 6px */
  background-color: var(--figma-ai-bg, #FBF6F9);
  border-radius: 0.375rem; /* 6px */
  padding: 0.125rem 0.5rem; /* 2px vertical, 8px horizontal */
  font-family: 'Figtree', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #191A1B;
}

.ai-badge-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.ai-badge-text {
  white-space: nowrap;
}
</style>
