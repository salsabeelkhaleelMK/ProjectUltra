<template>
  <LeadContent v-if="task.type === 'lead'" :lead="task" />
  <OpportunityContent v-else-if="task.type === 'opportunity'" :opportunity="task" />
</template>

<script setup>
import LeadContent from './LeadContent.vue'
import OpportunityContent from './OpportunityContent.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script>

