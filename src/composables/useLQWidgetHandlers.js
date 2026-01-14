/**
 * Composable for LQWidget handler functions
 * Coordinates between call and outcome composables
 */
export function useLQWidgetHandlers(emit, callState, outcomeState, lead, contactAttemptsRef, maxContactAttemptsRef) {
  const { callData, extractedData, isCallActive, callEnded } = callState
  const {
    showOutcomeSelection,
    selectedOutcome,
    appointmentScheduled,
    scheduledAppointmentData,
    assignment,
    preferences,
    cancelOutcome,
    calculateNextCallDate,
    showScheduleAppointmentModal
  } = outcomeState

  const logManualCall = () => {
    callData.value = {
      channel: 'external',
      notes: '',
      transcription: null
    }
    showOutcomeSelection.value = true
  }

  const handleScheduleAppointmentConfirm = async (appointmentData) => {
    // Store appointment data for qualify button
    scheduledAppointmentData.value = appointmentData
    appointmentScheduled.value = true
    showScheduleAppointmentModal.value = false
    
    // Emit event to create the appointment immediately
    emit('appointment-scheduled', appointmentData)
  }

  const handleQualify = () => {
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'interested',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    
    emit('call-attempt-logged', attempt)
    emit('validated', { scheduleFollowUp: false })
    emit('qualified', {
      assignment: assignment.value,
      preferences: preferences.value,
      scheduleAppointment: appointmentScheduled.value,
      appointmentData: scheduledAppointmentData.value
    })
    
    cancelOutcome()
  }

  const handleDisqualifyFromInterested = () => {
    // Log the attempt first
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'interested',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    emit('call-attempt-logged', attempt)
    
    // Then switch to disqualify outcome
    selectedOutcome.value = 'not-valid'
  }

  const handleNoAnswerConfirm = async () => {
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'no-answer',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    
    emit('call-attempt-logged', attempt)
    
    // Create appointment and calendar event
    const nextCallDate = calculateNextCallDate()
    const appointmentDate = nextCallDate.split('T')[0]
    const appointmentTime = new Date(nextCallDate).toTimeString().slice(0, 5)
    
    emit('postponed', {
      date: appointmentDate,
      time: appointmentTime,
      createAppointment: true
    })
    
    if (contactAttemptsRef?.value + 1 >= maxContactAttemptsRef?.value) {
      emit('disqualified', {
        category: 'Not Interested',
        reason: 'Unreachable'
      })
    }
    
    cancelOutcome()
  }

  const handleNotValidConfirm = () => {
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'not-valid',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    
    emit('call-attempt-logged', attempt)
    emit('disqualified', {
      category: outcomeState.disqualifyCategory.value,
      reason: outcomeState.disqualifyReason.value
    })
    
    cancelOutcome()
  }

  const handleNoteSave = (noteData) => {
    outcomeState.showNoteModal.value = false
    emit('note-saved', noteData)
  }

  return {
    logManualCall,
    handleScheduleAppointmentConfirm,
    handleQualify,
    handleDisqualifyFromInterested,
    handleNoAnswerConfirm,
    handleNotValidConfirm,
    handleNoteSave
  }
}

