<template>
  <ModalShell
    :show="show"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="lg"
    @close="$emit('close')"
    @cancel="$emit('close')"
  >
    <UnifiedAddForm
      ref="formRef"
      :initial-contact="contact"
      :hide-contact-selection="true"
      :force-type="type"
      @submit="handleSave"
    />

    <template #actions>
      <Button
        :label="formRef?.isSubmitting ? 'Saving...' : 'Save'"
        variant="primary"
        size="small"
        class="rounded-sm"
        :disabled="formRef?.isSubmitting || !formRef?.canSubmit"
        @click="formRef?.submit"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'
import UnifiedAddForm from '@/components/addnew/UnifiedAddForm.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String, // 'lead' | 'opportunity'
    required: true
  },
  contact: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const formRef = ref(null)

const modalTitle = computed(() => {
  return props.type === 'lead' ? 'Add New Lead' : 'Add New Opportunity'
})

const modalSubtitle = computed(() => {
  return `Create a ${props.type} for ${props.contact.name}`
})

const handleSave = (data) => {
  emit('save', data)
}
</script>

