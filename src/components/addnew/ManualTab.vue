<template>
  <div>
    <UnifiedAddForm ref="formRef" @submit="$emit('submit', $event)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UnifiedAddForm from '@/components/addnew/UnifiedAddForm.vue'

defineEmits(['submit'])

const formRef = ref(null)

defineExpose({
  resetSubmitting: () => formRef.value?.resetSubmitting(),
  submit: () => formRef.value?.submit(),
  clear: () => formRef.value?.clear(),
  canSubmit: () => formRef.value?.canSubmit,
  isSubmitting: () => formRef.value?.isSubmitting
})
</script>
