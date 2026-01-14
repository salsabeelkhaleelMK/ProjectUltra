import { ref, computed } from 'vue'

/**
 * Composable for UnifiedAddForm submission logic
 * 
 * @param {Object} params - Parameters object
 * @param {import('vue').Ref<string>} params.contactMode - Contact mode ('new' or 'existing')
 * @param {import('vue').Ref<Object|null>} params.selectedContact - Selected existing contact
 * @param {Object} params.contactFormData - Contact form data (reactive)
 * @param {Object} params.vehicleFormData - Vehicle form data (reactive)
 * @param {import('vue').Ref<boolean>} params.markAsLead - Mark as lead flag
 * @param {import('vue').Ref<boolean>} params.markAsOpportunity - Mark as opportunity flag
 * @param {Function} params.validateContactForm - Validation function
 * @param {Function} params.onSubmit - Submit callback function
 * @returns {Object} Object containing submission state and handlers
 */
export function useAddFormSubmission({
  contactMode,
  selectedContact,
  contactFormData,
  vehicleFormData,
  markAsLead,
  markAsOpportunity,
  validateContactForm,
  onSubmit
}) {
  const isSubmitting = ref(false)

  /**
   * Cleans vehicle data by removing empty values
   * @param {Object} vehicleData - Vehicle form data
   * @returns {Object} Cleaned vehicle data
   */
  const cleanVehicleData = (vehicleData) => {
    return Object.entries(vehicleData).reduce((acc, [key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        // Don't include default year if not modified
        if (key === 'year' && value === new Date().getFullYear()) {
          return acc
        }
        acc[key] = value
      }
      return acc
    }, {})
  }

  /**
   * Prepares contact data for submission
   * @returns {Object|null} Contact data or null if using existing contact
   */
  const prepareContactData = () => {
    if (contactMode.value === 'new') {
      return {
        name: contactFormData.name.trim(),
        email: contactFormData.email.trim(),
        phone: contactFormData.phone.trim(),
        company: contactFormData.company.trim()
      }
    }
    return null
  }

  /**
   * Handles form submission
   */
  const handleSubmit = () => {
    // Validate
    if (!validateContactForm()) {
      return
    }

    isSubmitting.value = true

    // Clean vehicle data (remove empty values)
    const cleanedVehicleData = cleanVehicleData(vehicleFormData)

    // Prepare contact data
    const contactData = prepareContactData()

    // Prepare submission data
    const submissionData = {
      contactMode: contactMode.value,
      selectedContact: selectedContact.value,
      contactData,
      vehicleData: Object.keys(cleanedVehicleData).length > 0 ? cleanedVehicleData : null,
      markAsLead: markAsLead.value,
      markAsOpportunity: markAsOpportunity.value
    }

    // Call onSubmit callback (emit function)
    if (onSubmit) {
      onSubmit(submissionData)
    }
  }

  /**
   * Resets submitting state
   */
  const resetSubmitting = () => {
    isSubmitting.value = false
  }

  return {
    isSubmitting: computed(() => isSubmitting.value),
    handleSubmit,
    resetSubmitting
  }
}

