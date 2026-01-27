<template>
  <div class="w-full">
    <!-- Integration Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <IntegrationCard
        v-for="integration in integrations"
        :key="integration.id"
        :integration="integration"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import IntegrationCard from '@/components/addnew/IntegrationCard.vue'
import { useIntegrationsStore } from '@/stores/integrations'

const integrationsStore = useIntegrationsStore()

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
</script>
