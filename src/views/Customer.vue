<template>
  <div class="h-full overflow-hidden bg-surface">
    <CustomerProfile
      :customer-id="customerId"
      :customer-type="customerType"
      :show-close-button="false"
      :close-on-convert="false"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomerProfile from '@/components/customer/CustomerProfile.vue'

const route = useRoute()

// Get customer ID from route
const customerId = computed(() => parseInt(route.params.id))

// Determine customer type from route query (for account vs contact)
const customerType = computed(() => route.query.type === 'account' ? 'account' : 'contact')
</script>
