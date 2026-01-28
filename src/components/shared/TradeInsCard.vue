<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-nsc-card p-4 flex flex-col w-full">
    <h3 class="text-base font-medium text-foreground leading-6 mb-4">Trade-ins</h3>
    <ul v-if="items.length" class="space-y-1.5">
      <li
        v-for="t in items"
        :key="t.id"
        class="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg border border-border bg-muted/50 text-sm"
      >
        <span class="font-medium text-foreground">{{ t.label }}</span>
        <span v-if="t.valuation != null" class="text-muted-foreground shrink-0 text-xs">€ {{ formatCurrency(t.valuation) }}</span>
      </li>
    </ul>
    <p v-else class="text-sm text-muted-foreground py-2">No trade-ins added yet</p>

    <div class="pt-3 mt-3 border-t border-border">
      <Button
        variant="outline"
        size="sm"
        class="w-full gap-2"
        @click="$emit('open-add')"
      >
        <Plus class="size-4" />
        Add trade-in
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next'
import { Button } from '@motork/component-library/future/primitives'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-add'])

function formatCurrency(val) {
  if (val == null) return '0'
  const n = typeof val === 'string' ? parseFloat(val) : val
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>
