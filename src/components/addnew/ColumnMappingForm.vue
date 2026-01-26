<template>
  <div class="space-y-4">
    <div class="bg-surface border border-border rounded-xl p-4">
      <h3 class="font-bold text-heading text-fluid-sm mb-1.5">Map Columns</h3>
      <p class="text-meta text-[11px] mb-4">
        Map file columns to {{ entityType }} fields. <span class="text-red-500">*</span> Required.
      </p>

      <!-- Required Fields -->
      <div v-if="availableFields.required.length > 0" class="mb-4">
        <h4 class="text-[10px] font-bold uppercase text-sub tracking-wider mb-2.5">Required Fields</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="field in availableFields.required"
            :key="field"
          >
            <label class="block label-upper text-sub text-[10px] font-bold uppercase tracking-wider mb-1">
              {{ formatFieldName(field) }} <span class="text-red-500">*</span>
            </label>
            <select
              :value="mapping[field] || ''"
              @change="setMapping(field, $event.target.value)"
              class="input text-fluid-xs py-1.5"
              :class="{ 'border-red-500': errors[field] }"
            >
              <option value="">-- Select column --</option>
              <option
                v-for="column in fileColumns"
                :key="column"
                :value="column"
              >
                {{ column }}
              </option>
            </select>
            <p v-if="errors[field]" class="text-red-500 text-[10px] mt-1">{{ errors[field] }}</p>
          </div>
        </div>
      </div>

      <!-- Optional Fields -->
      <div v-if="availableFields.optional.length > 0">
        <h4 class="text-[10px] font-bold uppercase text-sub tracking-wider mb-2.5">Optional Fields</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="field in availableFields.optional"
            :key="field"
          >
            <label class="block label-upper text-sub text-[10px] font-bold uppercase tracking-wider mb-1">
              {{ formatFieldName(field) }}
            </label>
            <select
              :value="mapping[field] || ''"
              @change="setMapping(field, $event.target.value)"
              class="input text-fluid-xs py-1.5"
            >
              <option value="">-- Select column --</option>
              <option
                v-for="column in fileColumns"
                :key="column"
                :value="column"
              >
                {{ column }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Mapping Summary -->
      <div v-if="summary" class="mt-4 pt-4 border-t border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-meta text-[10px] font-bold uppercase tracking-wider mb-0.5">Mapping Progress</p>
            <p class="text-heading font-bold text-fluid-xs">
              {{ summary.mappedFields }} / {{ summary.totalFields }} fields
            </p>
          </div>
          <Badge
            :text="`${summary.requiredMapped}/${summary.requiredTotal} required`"
            :theme="summary.requiredMapped === summary.requiredTotal ? 'green' : 'red'"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { Badge } from '@motork/component-library'
import { useColumnMapping } from '@/composables/useColumnMapping'

const props = defineProps({
  entityType: {
    type: String,
    required: true,
    validator: (value) => ['contacts', 'leads', 'opportunities'].includes(value)
  },
  fileColumns: {
    type: Array,
    default: () => []
  },
  mapping: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:mapping'])

const {
  availableFields,
  errors,
  isValid,
  setMapping: setMappingInternal,
  validateMapping,
  getMappingSummary,
  initializeMapping
} = useColumnMapping(computed(() => props.entityType), props.fileColumns)

// Initialize mapping when file columns are available and mapping is empty
watch([() => props.fileColumns, () => props.entityType], ([columns, entityType]) => {
  if (columns && columns.length > 0 && entityType && Object.keys(props.mapping).length === 0) {
    initializeMapping()
    const fields = availableFields.value
    const allFields = [...fields.required, ...fields.optional]
    const initialMapping = {}
    allFields.forEach(field => {
      initialMapping[field] = ''
    })
    emit('update:mapping', initialMapping)
  }
}, { immediate: true })

const summary = computed(() => {
  return getMappingSummary()
})

const setMapping = (field, fileColumn) => {
  setMappingInternal(field, fileColumn)
  emit('update:mapping', { ...props.mapping, [field]: fileColumn })
}

const formatFieldName = (field) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

defineExpose({
  isValid,
  validateMapping
})
</script>
