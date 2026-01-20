import { ref, computed } from 'vue'

/**
 * Composable for LQWidget outcome selection logic
 * Manages outcome selection state, assignment, preferences, and related handlers
 */
export function useLQWidgetOutcomes(lead, callDataRef, extractedDataRef, contactAttemptsRef, maxContactAttemptsRef, currentUserRef) {
  const showOutcomeSelection = ref(false)
  const selectedOutcome = ref(null)
  const appointmentScheduled = ref(false)
  const scheduledAppointmentData = ref(null)
  const showNoteModal = ref(false)
  const showScheduleAppointmentModal = ref(false)

  // No Answer state
  const followupChannels = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' },
    { value: 'dont-send', label: "Don't send" }
  ]
  const followupChannel = ref('whatsapp')
  const selectedTemplate = ref('followup-1')
  const rescheduleTime = ref(null)
  const customDate = ref('')
  const customTime = ref('09:00')
  const aiSuggestionData = ref(null)

  // Not Valid state
  const disqualifyCategory = ref('Not Interested')
  const disqualifyReason = ref('')

  // Assignment state
  const assignment = ref({
    dealership: lead.value?.requestedCar?.dealership || 'Barcelona',
    team: 'Audi Sales (New)',
    assigneeId: currentUserRef?.value?.id || null
  })

  const preferences = ref({
    tradeIn: false,
    financing: false,
    contactAvailability: false
  })

  // Survey state
  const surveyCompleted = ref(false)
  const surveyResponses = ref(null)
  const showSurvey = ref(true) // Show by default when Interested selected

  const messageTemplates = computed(() => {
    const customerName = lead.value?.customer?.name?.split(' ')[0] || ''
    const carBrand = lead.value?.requestedCar?.brand || ''
    const carModel = lead.value?.requestedCar?.model || ''
    
    return {
      'followup-1': `Hi ${customerName}! I tried calling you earlier but couldn't reach you. When would be a good time to discuss the ${carBrand} ${carModel}?`,
      'followup-2': `Hello ${customerName}, this is regarding your inquiry about the ${carBrand} ${carModel}. Please let me know when you're available for a call.`,
      'custom': ''
    }
  })

  const messagePreview = computed(() => {
    if (selectedTemplate.value === 'custom') {
      return 'Type your custom message...'
    }
    return messageTemplates.value[selectedTemplate.value] || ''
  })

  const hasExistingAppointment = computed(() => {
    return !!lead.value?.scheduledAppointment
  })

  const calculateAISuggestion = () => {
    // AI logic: Suggest best time based on lead characteristics
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate suggested date and time
    let suggestedDate = new Date()
    let suggestedTime = '10:00'
    let reason = ''
    
    // If it's Friday afternoon or weekend, suggest Monday morning
    if (dayOfWeek === 5 && hour >= 15) { // Friday after 3 PM
      suggestedDate.setDate(now.getDate() + 3) // Monday
      suggestedTime = '10:00'
      reason = 'Optimal time after weekend, customer likely refreshed'
    } else if (dayOfWeek === 6 || dayOfWeek === 0) { // Weekend
      suggestedDate.setDate(now.getDate() + (dayOfWeek === 6 ? 2 : 1)) // Monday
      suggestedTime = '10:00'
      reason = 'Weekend follow-up avoided, better response rate on weekdays'
    } else if (hour >= 17) { // After 5 PM on weekday
      suggestedDate.setDate(now.getDate() + 1)
      suggestedTime = '10:00'
      reason = 'Business hours preferred, higher engagement rate'
    } else if (hour < 9) { // Before 9 AM
      suggestedDate = new Date(now)
      suggestedDate.setHours(10, 0, 0, 0)
      suggestedTime = '10:00'
      reason = 'Peak response time, customers more available mid-morning'
    } else {
      // Same day, suggest 2 hours later or next day morning
      if (hour < 14) {
        suggestedDate = new Date(now)
        const nextHour = hour + 2
        suggestedDate.setHours(nextHour, 0, 0, 0)
        suggestedTime = `${String(nextHour).padStart(2, '0')}:00`
        reason = 'Follow-up within same day increases conversion likelihood'
      } else {
        suggestedDate.setDate(now.getDate() + 1)
        suggestedDate.setHours(10, 0, 0, 0)
        suggestedTime = '10:00'
        reason = 'Next morning follow-up maintains momentum'
      }
    }
    
    // Format date
    const dateStr = suggestedDate.toISOString().split('T')[0]
    const dateTimeStr = `${dateStr}T${suggestedTime}:00`
    
    return {
      date: dateStr,
      time: suggestedTime,
      dateTime: dateTimeStr,
      reason: reason,
      formattedDate: suggestedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }

  const calculateNextCallDate = () => {
    if (rescheduleTime.value === 'tomorrow-9am') {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      return tomorrow.toISOString()
    } else if (rescheduleTime.value === 'monday') {
      // Use AI suggestion data if available
      if (aiSuggestionData.value) {
        return new Date(aiSuggestionData.value.dateTime).toISOString()
      }
      const monday = new Date()
      const daysUntilMonday = (8 - monday.getDay()) % 7 || 7
      monday.setDate(monday.getDate() + daysUntilMonday)
      monday.setHours(9, 0, 0, 0)
      return monday.toISOString()
    } else if (rescheduleTime.value === 'custom' && customDate.value && customTime.value) {
      const dateTime = new Date(`${customDate.value}T${customTime.value}:00`)
      return dateTime.toISOString()
    }
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString()
  }

  const selectOutcome = (outcome) => {
    selectedOutcome.value = outcome
    if (outcome === 'interested') {
      // Reset survey state when selecting interested outcome
      surveyCompleted.value = false
      surveyResponses.value = null
      showSurvey.value = true
      
      // Pre-populate from extracted data
      if (extractedDataRef?.value) {
        preferences.value.tradeIn = extractedDataRef.value.tradeIn || false
        preferences.value.financing = extractedDataRef.value.financing || false
      }
    }
  }

  // Watch for AI suggestion selection
  const handleAISuggestionClick = () => {
    rescheduleTime.value = 'monday'
    aiSuggestionData.value = calculateAISuggestion()
  }

  const cancelOutcome = () => {
    selectedOutcome.value = null
    showOutcomeSelection.value = false
    appointmentScheduled.value = false
    scheduledAppointmentData.value = null
  }

  const resetOutcomeState = () => {
    selectedOutcome.value = null
    showOutcomeSelection.value = false
    appointmentScheduled.value = false
    scheduledAppointmentData.value = null
    followupChannel.value = 'whatsapp'
    selectedTemplate.value = 'followup-1'
    rescheduleTime.value = null
    customDate.value = ''
    customTime.value = '09:00'
    disqualifyCategory.value = 'Not Interested'
    disqualifyReason.value = ''
    surveyCompleted.value = false
    surveyResponses.value = null
    showSurvey.value = true
    aiSuggestionData.value = null
  }

  return {
    // State
    showOutcomeSelection,
    selectedOutcome,
    appointmentScheduled,
    scheduledAppointmentData,
    showNoteModal,
    showScheduleAppointmentModal,
    followupChannels,
    followupChannel,
    selectedTemplate,
    rescheduleTime,
    customDate,
    customTime,
    disqualifyCategory,
    disqualifyReason,
    assignment,
    preferences,
    surveyCompleted,
    surveyResponses,
    showSurvey,
    aiSuggestionData,
    // Computed
    messageTemplates,
    messagePreview,
    hasExistingAppointment,
    // Methods
    selectOutcome,
    cancelOutcome,
    calculateNextCallDate,
    calculateAISuggestion,
    handleAISuggestionClick,
    resetOutcomeState
  }
}

