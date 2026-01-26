import { ref, computed } from 'vue'

/**
 * Field definitions for each entity type
 */
const ENTITY_FIELDS = {
  contacts: {
    required: ['name', 'email'],
    optional: ['phone', 'company', 'address']
  },
  leads: {
    required: ['name', 'email'],
    optional: [
      'phone', 
      'company', 
      'address',
      'source',
      'brand',
      'model',
      'year',
      'price',
      'requestMessage',
      'requestType',
      'dealership',
      'channel',
      'fuelType',
      'gearType',
      'kilometers',
      'stockDays'
    ]
  },
  opportunities: {
    required: ['name', 'email'],
    optional: [
      'phone',
      'company',
      'address',
      'source',
      'brand',
      'model',
      'year',
      'price',
      'requestMessage',
      'requestType',
      'dealership',
      'channel',
      'fuelType',
      'gearType',
      'kilometers',
      'stockDays',
      'stage',
      'priority'
    ]
  }
}

/**
 * Get field definitions for an entity type
 */
export function getEntityFields(entityType) {
  return ENTITY_FIELDS[entityType] || { required: [], optional: [] }
}

/**
 * Composable for managing column mapping
 * 
 * @param {import('vue').Ref<string>} entityType - Entity type ('contacts' | 'leads' | 'opportunities')
 * @param {Array<string>} fileColumns - Columns detected from uploaded file
 * @returns {Object} Object containing mapping state and methods
 */
export function useColumnMapping(entityType, fileColumns = []) {
  const mapping = ref({})
  const errors = ref({})

  // Get available fields for current entity type
  const availableFields = computed(() => {
    const fields = getEntityFields(entityType.value)
    return {
      required: fields.required || [],
      optional: fields.optional || []
    }
  })

  /**
   * Initialize mapping with empty values
   */
  const initializeMapping = () => {
    const fields = availableFields.value
    const allFields = [...fields.required, ...fields.optional]
    
    mapping.value = {}
    allFields.forEach(field => {
      mapping.value[field] = ''
    })
  }

  /**
   * Set mapping for a field
   */
  const setMapping = (field, fileColumn) => {
    mapping.value[field] = fileColumn || ''
    validateMapping()
  }

  /**
   * Validate mapping
   */
  const validateMapping = () => {
    errors.value = {}
    const requiredFields = availableFields.value.required

    requiredFields.forEach(field => {
      if (!mapping.value[field] || mapping.value[field].trim() === '') {
        errors.value[field] = 'This field is required'
      }
    })
  }

  /**
   * Check if mapping is valid
   */
  const isValid = computed(() => {
    validateMapping()
    return Object.keys(errors.value).length === 0
  })

  /**
   * Transform mapped data to entity structure
   */
  const transformRow = (row) => {
    const transformed = {}
    const fields = availableFields.value
    const allFields = [...fields.required, ...fields.optional]

    allFields.forEach(field => {
      const fileColumn = mapping.value[field]
      if (fileColumn && row[fileColumn] !== undefined) {
        const value = row[fileColumn]
        
        // Type conversions based on field type
        if (field === 'year' || field === 'price' || field === 'kilometers' || field === 'stockDays') {
          transformed[field] = value ? Number(value) : null
        } else {
          transformed[field] = value ? String(value).trim() : ''
        }
      }
    })

    return transformed
  }

  /**
   * Transform all rows
   */
  const transformData = (data) => {
    return data.map((row, index) => {
      try {
        return transformRow(row)
      } catch (error) {
        console.error(`Error transforming row ${index + 1}:`, error)
        return null
      }
    }).filter(row => row !== null)
  }

  /**
   * Get mapping summary
   */
  const getMappingSummary = () => {
    const mappedFields = Object.entries(mapping.value)
      .filter(([_, fileColumn]) => fileColumn && fileColumn.trim() !== '')
      .map(([field, fileColumn]) => ({ field, fileColumn }))

    return {
      totalFields: availableFields.value.required.length + availableFields.value.optional.length,
      mappedFields: mappedFields.length,
      requiredMapped: availableFields.value.required.filter(f => mapping.value[f]).length,
      requiredTotal: availableFields.value.required.length
    }
  }

  // Initialize when entity type or file columns change
  if (fileColumns.length > 0) {
    initializeMapping()
  }

  return {
    mapping,
    errors,
    availableFields,
    isValid,
    setMapping,
    validateMapping,
    transformRow,
    transformData,
    getMappingSummary,
    initializeMapping
  }
}
