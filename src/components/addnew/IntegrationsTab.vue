<template>
  <div class="w-full">
    <!-- Integration Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <IntegrationCard
        v-for="integration in integrations"
        :key="integration.id"
        :integration="integration"
        @toggle="handleToggle"
        @configure="handleConfigure"
      />
    </div>

    <!-- Configuration Modal -->
    <IntegrationConfigModal
      v-model:show="showConfigModal"
      :integration="selectedIntegration"
      @saved="handleConfigSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Card } from '@motork/component-library/future/primitives'
import IntegrationCard from '@/components/addnew/IntegrationCard.vue'
import IntegrationConfigModal from '@/components/addnew/IntegrationConfigModal.vue'
import { useIntegrationsStore } from '@/stores/integrations'

const integrationsStore = useIntegrationsStore()

const showConfigModal = ref(false)
const selectedIntegration = ref(null)

const integrations = computed(() => {
  // Add icons to integrations
  return integrationsStore.integrations.map(int => ({
    ...int,
    icon: getIntegrationIcon(int.type)
  }))
})

const getIntegrationIcon = (type) => {
  const iconMap = {
    api: 'fa-solid fa-code',
    email: 'fa-solid fa-envelope',
    portal: 'fa-solid fa-globe',
    zapier: 'fa-brands fa-zapier',
    meta: 'fa-brands fa-meta',
    woice: 'fa-solid fa-microphone',
    webhook: 'fa-solid fa-link'
  }
  return iconMap[type] || 'fa-solid fa-plug'
}

const handleToggle = (integrationId) => {
  // Toggle is handled in IntegrationCard component
  // This is just for any additional logic if needed
}

const handleConfigure = (integration) => {
  selectedIntegration.value = integration
  showConfigModal.value = true
}

const handleConfigSaved = () => {
  // Configuration saved, modal will close automatically
  // Refresh integrations if needed
}
</script>
