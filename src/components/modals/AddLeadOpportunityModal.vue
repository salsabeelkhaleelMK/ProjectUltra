<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
          <DialogDescription>{{ modalSubtitle }}</DialogDescription>
        </DialogHeader>

        <UnifiedAddForm
          ref="formRef"
          :initial-contact="contact"
          :hide-contact-selection="true"
          :force-type="type"
          @submit="handleSave"
        />

        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            :label="formRef?.isSubmitting ? 'Saving...' : 'Save'"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="formRef?.isSubmitting || !formRef?.canSubmit"
            @click="formRef?.submit"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
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

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleSave = (data) => {
  emit('save', data)
}
</script>

