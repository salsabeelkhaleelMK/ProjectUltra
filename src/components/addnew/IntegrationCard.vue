<template>
  <Card class="rounded-xl border-border hover:shadow-mk-dashboard-card transition-all group overflow-hidden bg-surface">
    <div class="px-4 py-4 flex flex-col gap-4">
      <!-- Header: Platform Info + Toggle -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Platform Icon (Avatar style) -->
          <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border shrink-0 group-hover:border-primary/30 transition-colors">
            <i :class="integration.icon" class="text-base text-primary"></i>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-bold uppercase tracking-tighter text-muted-foreground block mb-0.5">Platform</span>
            <CardTitle class="text-foreground text-sm font-bold truncate leading-tight">{{ integration.name }}</CardTitle>
          </div>
        </div>
        
        <!-- Custom Toggle Switch -->
        <label class="inline-flex items-center cursor-pointer" @click.stop>
          <input 
            type="checkbox" 
            :checked="integration.enabled" 
            @change="handleToggle"
            class="sr-only peer"
          >
          <div 
            class="relative w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"
            :style="integration.enabled ? { backgroundColor: 'var(--brand-primary, #0470e9)' } : {}"
          ></div>
        </label>
      </div>

      <!-- API Key Input -->
      <div class="space-y-2">
        <Label class="block text-sm font-semibold text-foreground">API Key</Label>
        <Input
          v-model="apiKey"
          type="password"
          placeholder="Enter API Key"
          class="w-full h-10 text-sm focus-visible:ring-brand-primary"
          @blur="updateApiKey"
          @keyup.enter="updateApiKey"
        />
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Card, CardTitle, Input, Label } from '@motork/component-library/future/primitives'
import { useIntegrationsStore } from '@/stores/integrations'

const props = defineProps({
  integration: {
    type: Object,
    required: true
  }
})

const integrationsStore = useIntegrationsStore()
const apiKey = ref(props.integration.config?.apiKey || '')

// Sync local ref with prop changes
watch(() => props.integration.config?.apiKey, (newVal) => {
  apiKey.value = newVal || ''
})

const updateApiKey = () => {
  if (apiKey.value !== (props.integration.config?.apiKey || '')) {
    integrationsStore.updateConfig(props.integration.id, { apiKey: apiKey.value })
  }
}

const handleToggle = () => {
  integrationsStore.toggleIntegration(props.integration.id)
}
</script>
