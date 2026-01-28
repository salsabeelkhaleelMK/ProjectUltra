<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-nsc-card p-4 flex flex-col w-full">
    <h3 class="text-base font-medium text-foreground leading-6 mb-4">Financing options</h3>
    <ul v-if="items.length" class="space-y-1.5">
      <li
        v-for="f in items"
        :key="f.id"
        class="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg border border-border bg-muted/50 text-sm"
      >
        <span class="font-medium text-foreground">{{ f.label }}</span>
        <span v-if="f.termMonths" class="text-muted-foreground shrink-0 text-xs">{{ f.termMonths }} months</span>
      </li>
    </ul>
    <p v-else class="text-sm text-muted-foreground py-2">No financing options added yet</p>

    <div class="pt-3 mt-3 border-t border-border">
      <Button
        variant="outline"
        size="sm"
        class="w-full gap-2"
        @click="$emit('open-add')"
      >
        <Plus class="size-4" />
        Add financing option
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
</script>
