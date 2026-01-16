import { reactive, computed } from 'vue'

/**
 * Composable for UnifiedAddForm validation logic
 * 
 * @param {Object} params - Parameters object
 * @param {import('vue').Ref<string>} params.contactMode - Contact mode ('new' or 'existing')
 * @param {import('vue').Ref<Object|null>} params.selectedContact - Selected existing contact
 * @param {Object} params.contactFormData - Contact form data (reactive)
 * @returns {Object} Object containing validation state and functions
 */
export function useAddFormValidation({ contactMode, selectedContact, contactFormData }) {
  const errors = reactive({
    name: '',
    email: ''
  })

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Computed property to check if form can be submitted
   * @type {import('vue').ComputedRef<boolean>}
   */
  const canSubmit = computed(() => {
    if (contactMode.value === 'existing') {
      return !!selectedContact.value
    } else {
      return !!(contactFormData.name && contactFormData.email)
    }
  })

  /**
   * Validates contact form data
   * @returns {boolean} True if valid
   */
  const validateContactForm = () => {
    errors.name = ''
    errors.email = ''

    if (contactMode.value === 'new') {
      let isValid = true

      if (!contactFormData.name.trim()) {
        errors.name = 'Contact name is required'
        isValid = false
      }

      if (!contactFormData.email.trim()) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!validateEmail(contactFormData.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      return isValid
    } else {
      return !!selectedContact.value
    }
  }

  /**
   * Clears all validation errors
   */
  const clearErrors = () => {
    errors.name = ''
    errors.email = ''
  }

  return {
    errors,
    canSubmit,
    validateEmail,
    validateContactForm,
    clearErrors
  }
}



