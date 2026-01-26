<template>
  <Dialog :open="show" @update:open="$emit('update:show', $event)">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle class="text-heading text-fluid-sm font-bold">{{ integration.name }} Configuration</DialogTitle>
        <DialogDescription class="text-meta text-[11px] mt-0.5">
          {{ integration.description || 'Configure settings and select import type.' }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5 py-4">
        <!-- Entity Type Selection -->
        <div>
          <label class="block label-upper text-sub text-[10px] font-bold uppercase tracking-wider mb-1.5">
            Entity Type <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="type in entityTypes"
              :key="type.value"
              @click="formData.entityType = type.value"
              class="p-3 border-2 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1.5"
              :class="formData.entityType === type.value
                ? 'border-brand-red bg-red-50'
                : 'border-border hover:border-primary hover:bg-surfaceSecondary'"
            >
              <i :class="[type.icon, 'text-lg', formData.entityType === type.value ? 'text-brand-red' : 'text-gray-400']"></i>
              <p class="text-[11px] font-bold" :class="formData.entityType === type.value ? 'text-brand-red' : 'text-heading'">{{ type.label }}</p>
            </button>
          </div>
          <p v-if="errors.entityType" class="text-red-500 text-[10px] mt-1.5 font-bold">{{ errors.entityType }}</p>
        </div>

        <!-- Configuration Fields (dynamic based on integration type) -->
        <div v-if="formData.entityType" class="space-y-4 pt-4 border-t border-border">
          <div
            v-for="field in configFields"
            :key="field.key"
          >
            <label class="block label-upper text-sub text-[10px] font-bold uppercase tracking-wider mb-1.5">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>
            <Input
              v-if="field.type === 'text' || field.type === 'password'"
              :type="field.type"
              :value="formData.config[field.key] || ''"
              @update:value="formData.config[field.key] = $event"
              :placeholder="field.placeholder"
              class="text-fluid-xs py-1.5"
            />
            <Textarea
              v-else-if="field.type === 'textarea'"
              :value="formData.config[field.key] || ''"
              @update:value="formData.config[field.key] = $event"
              :placeholder="field.placeholder"
              class="text-fluid-xs min-h-[80px] py-1.5"
            />
            <select
              v-else-if="field.type === 'select'"
              :value="formData.config[field.key] || ''"
              @change="formData.config[field.key] = $event.target.value"
              class="input text-fluid-xs py-1.5"
            >
              <option value="">-- Select {{ field.label }} --</option>
              <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p v-if="errors[field.key]" class="text-red-500 text-[10px] mt-1 font-bold">{{ errors[field.key] }}</p>
          </div>
        </div>
      </div>

      <DialogFooter class="gap-2 pb-2">
        <DialogClose as-child>
          <Button variant="outline" size="small" @click="handleCancel" class="text-fluid-xs">Cancel</Button>
        </DialogClose>
        <Button size="small" @click="handleSave" :disabled="!canSave" class="text-fluid-xs px-5">
          Save Configuration
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Input,
  Textarea
} from '@motork/component-library/future/primitives'
import { Button } from '@motork/component-library'
import { useIntegrationsStore } from '@/stores/integrations'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  integration: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:show', 'saved'])

const integrationsStore = useIntegrationsStore()

const formData = ref({
  entityType: null,
  config: {}
})

const errors = ref({})

const entityTypes = [
  { value: 'contacts', label: 'Contacts', icon: 'fa-solid fa-users' },
  { value: 'leads', label: 'Leads', icon: 'fa-solid fa-user-plus' },
  { value: 'opportunities', label: 'Opportunities', icon: 'fa-solid fa-briefcase' }
]

const configFields = computed(() => {
  const fieldsMap = {
    api: [
      { key: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter API key' },
      { key: 'endpoint', label: 'API Endpoint', type: 'text', required: true, placeholder: 'https://api.example.com' },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: false, placeholder: 'Optional webhook URL' }
    ],
    email: [
      { key: 'emailAddress', label: 'Email Address', type: 'text', required: true, placeholder: 'email@example.com' },
      { key: 'imapServer', label: 'IMAP Server', type: 'text', required: true, placeholder: 'imap.example.com' },
      { key: 'imapPort', label: 'IMAP Port', type: 'text', required: false, placeholder: '993' },
      { key: 'username', label: 'Username', type: 'text', required: false, placeholder: 'Email username' },
      { key: 'password', label: 'Password', type: 'password', required: false, placeholder: 'Email password' }
    ],
    portal: [
      { key: 'portalUrl', label: 'Portal URL', type: 'text', required: true, placeholder: 'https://portal.example.com' },
      { key: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter API key' },
      { key: 'username', label: 'Username', type: 'text', required: false, placeholder: 'Portal username' }
    ],
    zapier: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true, placeholder: 'https://hooks.zapier.com/...' }
    ],
    meta: [
      { key: 'appId', label: 'App ID', type: 'text', required: true, placeholder: 'Facebook App ID' },
      { key: 'appSecret', label: 'App Secret', type: 'text', required: true, placeholder: 'Facebook App Secret' },
      { key: 'accessToken', label: 'Access Token', type: 'text', required: false, placeholder: 'Optional access token' }
    ],
    woice: [
      { key: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter API key' },
      { key: 'endpoint', label: 'Endpoint', type: 'text', required: true, placeholder: 'https://api.woice.com' }
    ],
    webhook: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true, placeholder: 'https://your-webhook-url.com' },
      { key: 'secret', label: 'Secret', type: 'text', required: false, placeholder: 'Optional webhook secret' }
    ]
  }

  return fieldsMap[props.integration.type] || []
})

const canSave = computed(() => {
  if (!formData.value.entityType) return false

  const requiredFields = configFields.value.filter(f => f.required)
  return requiredFields.every(field => {
    const value = formData.value.config[field.key]
    return value && value.trim() !== ''
  })
})

// Initialize form data when modal opens
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    formData.value = {
      entityType: props.integration.entityType || null,
      config: { ...props.integration.config || {} }
    }
    errors.value = {}
  }
})

const validate = () => {
  errors.value = {}

  if (!formData.value.entityType) {
    errors.value.entityType = 'Entity type is required'
    return false
  }

  const requiredFields = configFields.value.filter(f => f.required)
  for (const field of requiredFields) {
    const value = formData.value.config[field.key]
    if (!value || value.trim() === '') {
      errors.value[field.key] = `${field.label} is required`
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSave = () => {
  if (!validate()) return

  // Update integration
  integrationsStore.setEntityType(props.integration.id, formData.value.entityType)
  integrationsStore.updateConfig(props.integration.id, formData.value.config)

  emit('saved')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
