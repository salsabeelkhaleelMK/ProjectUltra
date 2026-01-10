<template>
  <ModalShell
    :show="show"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="lg"
    @close="$emit('close')"
    @cancel="$emit('close')"
  >
    <div class="p-6 overflow-y-auto max-h-[70vh]">
      <UnifiedAddForm
        ref="formRef"
        :initial-contact="contact"
        :hide-contact-selection="true"
        :force-type="type"
        @submit="handleSave"
      />
    </div>
  </ModalShell>
</template>

<script setup>
import { computed, ref } from 'vue'
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

