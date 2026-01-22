<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details for the new event.</DialogDescription>
        </DialogHeader>

        <CreateEventForm
          :key="formKey"
          :customer="customer"
          :assignee="assignee"
          :disabled-fields="disabledFields"
          :initial-date="initialDate"
          :dealerships="dealerships"
          :show-actions="true"
          :reset-trigger="show"
          @create="$emit('create', $event)"
          @cancel="handleCancel"
        />
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import CreateEventForm from '@/components/shared/forms/CreateEventForm.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  initialDate: {
    type: String,
    default: ''
  },
  dealerships: {
    type: Array,
    default: () => []
  },
  customer: {
    type: Object,
    default: null
  },
  assignee: {
    type: String,
    default: null
  },
  disabledFields: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['create', 'cancel'])

const formKey = ref(0)

watch(() => props.show, (val) => {
  if (val) formKey.value += 1
})

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    handleCancel()
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>
