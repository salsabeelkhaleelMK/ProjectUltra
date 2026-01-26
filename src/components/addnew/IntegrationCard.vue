<template>
  <Card class="h-full rounded-xl border-border hover:shadow-mk-dashboard-card transition-all group cursor-default">
    <div class="p-3 flex flex-col h-full">
      <!-- Top Row: Icon + Name + Actions -->
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-surfaceSecondary flex items-center justify-center border border-border shrink-0 group-hover:border-primary/30 transition-colors">
            <i :class="integration.icon" class="text-base text-primary"></i>
          </div>
          <div class="min-w-0">
            <CardTitle class="text-heading text-[11px] font-bold truncate leading-tight mb-0.5">{{ integration.name }}</CardTitle>
            <div class="flex items-center gap-1.5">
              <span 
                v-if="integration.entityType" 
                class="text-[9px] font-bold uppercase tracking-tighter text-sub bg-surfaceSecondary px-1 rounded-sm"
              >
                {{ formatEntityType(integration.entityType) }}
              </span>
              <span v-else class="text-[9px] font-bold uppercase tracking-tighter text-orange-600">
                Setup Needed
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-1.5 shrink-0">
          <button 
            @click.stop="$emit('configure', integration)"
            class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-surfaceSecondary rounded transition-all"
            title="Configure"
          >
            <i class="fa-solid fa-gear text-[10px]"></i>
          </button>
          <Switch
            :checked="integration.enabled"
            @update:checked="handleToggle"
            :disabled="!integration.entityType"
            size="small"
            class="scale-90"
          />
        </div>
      </div>

      <!-- Bottom Info Area -->
      <div class="mt-auto pt-2 border-t border-border/50">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-1.5">
            <span 
              class="w-1.5 h-1.5 rounded-full" 
              :class="integration.connected ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]' : 'bg-gray-300'"
            ></span>
            <span class="text-[9px] font-bold uppercase tracking-tight text-sub">
              {{ integration.connected ? 'Connected' : 'Offline' }}
            </span>
          </div>
          
          <span v-if="integration.lastSync" class="text-[9px] text-meta font-medium">
            {{ formatShortDate(integration.lastSync) }}
          </span>
        </div>

        <!-- Sync Summary (Only if history exists) -->
        <div 
          v-if="integration.syncHistory?.length > 0" 
          class="flex items-center justify-between bg-surfaceSecondary/40 rounded px-1.5 py-0.5"
        >
          <div class="flex items-center gap-1 text-[9px] font-bold text-sub">
            <i class="fa-solid fa-arrow-down text-[8px] opacity-50"></i>
            <span class="uppercase tracking-tighter">Latest</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-bold text-heading">{{ integration.syncHistory[0].recordsImported }} recs</span>
            <span v-if="integration.syncHistory[0].errors?.length > 0" class="text-[9px] font-bold text-red-600 flex items-center gap-0.5">
              <i class="fa-solid fa-circle-exclamation text-[8px]"></i>
              {{ integration.syncHistory[0].errors.length }}
            </span>
          </div>
        </div>
        
        <!-- Setup Required Warning -->
        <div v-else-if="hasRequiredFields" class="flex items-center gap-1 text-orange-600 text-[9px] font-bold uppercase tracking-tighter">
          <i class="fa-solid fa-circle-info text-[8px]"></i>
          <span>Missing Config</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Switch } from '@motork/component-library/future/primitives'
import { Button, Badge } from '@motork/component-library'
import { useIntegrationsStore } from '@/stores/integrations'

const props = defineProps({
  integration: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'configure'])

const integrationsStore = useIntegrationsStore()

const hasRequiredFields = computed(() => {
  const config = props.integration.config || {}
  const requiredFields = getRequiredFieldsForType(props.integration.type)
  return requiredFields.some(field => !config[field] || config[field].trim() === '')
})

const getRequiredFieldsForType = (type) => {
  const requiredFieldsMap = {
    api: ['apiKey', 'endpoint'],
    email: ['emailAddress', 'imapServer'],
    portal: ['portalUrl', 'apiKey'],
    zapier: ['webhookUrl'],
    meta: ['appId', 'appSecret'],
    woice: ['apiKey', 'endpoint'],
    webhook: ['webhookUrl']
  }
  return requiredFieldsMap[type] || []
}

const formatEntityType = (entityType) => {
  const map = {
    contacts: 'Contacts',
    leads: 'Leads',
    opportunities: 'Opportunities'
  }
  return map[entityType] || entityType
}

const formatShortDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleToggle = async (checked) => {
  if (!checked) {
    // Disable
    integrationsStore.toggleIntegration(props.integration.id)
    emit('toggle', props.integration.id)
  } else {
    // Enable - check if entity type is set
    if (!props.integration.entityType) {
      alert('Please configure entity type before enabling this integration')
      return
    }
    
    // Check if required fields are configured
    if (hasRequiredFields.value) {
      alert('Please configure all required fields before enabling this integration')
      return
    }

    try {
      await integrationsStore.testConnection(props.integration.id)
      integrationsStore.toggleIntegration(props.integration.id)
      emit('toggle', props.integration.id)
    } catch (error) {
      alert(`Failed to connect: ${error.message}`)
    }
  }
}
</script>
