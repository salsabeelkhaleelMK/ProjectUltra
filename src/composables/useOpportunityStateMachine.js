/**
 * Opportunity State Machine Configuration
 * 
 * Pure configuration defining what actions and widgets exist for each stage.
 * No business logic - just data structure.
 */

export const OPPORTUNITY_STATE_CONFIG = {
  'Qualified': {
    primaryAction: {
      key: 'schedule-appointment',
      title: 'Schedule First Appointment',
      description: 'Begin the sales process by scheduling an appointment with the customer',
      label: 'Schedule Appointment',
      icon: 'fa-solid fa-calendar-plus',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      colorScheme: { background: 'bg-blue-50/50', border: 'border-blue-100' }
    },
    secondaryActions: [
      {
        key: 'select-vehicle',
        label: 'Select Vehicle',
        icon: 'fa-solid fa-car',
        description: 'Choose a vehicle for this opportunity'
      },
      {
        key: 'schedule-appointment',
        label: 'Schedule Appointment',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'OOFB', condition: 'qualified-no-offers-7-13-days' },
      { type: 'UFB', condition: 'qualified-no-offers-14-plus-days' }
    ]
  },

  'Awaiting Appointment': {
    primaryAction: {
      key: 'view-or-schedule-appointment',
      title: (context) => context.scheduledAppointment ? 'Next Appointment' : 'Schedule Appointment',
      description: (context) => context.scheduledAppointment 
        ? `Scheduled for ${context.formatDateTime(context.scheduledAppointment.start)}`
        : 'Schedule an appointment to move forward',
      label: (context) => context.scheduledAppointment ? 'View Appointment' : 'Schedule Appointment',
      icon: 'fa-solid fa-calendar-check',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
      colorScheme: { background: 'bg-purple-50/50', border: 'border-purple-100' }
    },
    secondaryActions: [
      {
        key: 'reschedule',
        label: 'Reschedule',
        icon: 'fa-solid fa-calendar-days',
        description: 'Change appointment date/time'
      },
      {
        key: 'cancel-appointment',
        label: 'Cancel Appointment',
        icon: 'fa-solid fa-calendar-xmark'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'NS', condition: 'appointment-past-not-completed' }
    ]
  },

  'To be Called Back': {
    primaryAction: {
      key: 'call-prospect',
      title: 'Call Prospect',
      description: 'Customer requested a callback. Follow up to maintain engagement',
      label: 'Initiate Call',
      icon: 'fa-solid fa-phone',
      buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      colorScheme: { background: 'bg-indigo-50/50', border: 'border-indigo-100' }
    },
    secondaryActions: [
      {
        key: 'schedule-appointment',
        label: 'Schedule Appointment',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: []
  },

  'In Negotiation': {
    primaryAction: {
      key: 'create-offer',
      title: 'Create Offer',
      description: (context) => context.hasOffers 
        ? 'Add another offer or refine existing proposal'
        : 'Create initial offer to move forward with negotiation',
      label: (context) => context.hasOffers ? 'Add Another Offer' : 'Create Offer',
      icon: 'fa-solid fa-file-invoice-dollar',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      colorScheme: { background: 'bg-yellow-50/50', border: 'border-yellow-100' }
    },
    secondaryActions: [
      {
        key: 'schedule-appointment',
        label: 'Schedule Appointment',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'OFB', condition: 'negotiation-5-plus-days-no-contract-has-offers' },
      { type: 'NFU', condition: 'negotiation-5-plus-days-no-contract-no-future-appointment-has-offers' }
    ]
  },

  'Offer Sent': {
    primaryAction: {
      key: 'follow-up-offer',
      title: 'Follow Up on Offer',
      description: 'Offer recently sent. Follow up to gauge customer interest',
      label: 'Log Follow-up',
      icon: 'fa-solid fa-phone-volume',
      buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
      colorScheme: { background: 'bg-orange-50/50', border: 'border-orange-100' }
    },
    secondaryActions: [
      {
        key: 'add-offer',
        label: 'Add Another Offer',
        icon: 'fa-solid fa-file-invoice-dollar'
      },
      {
        key: 'schedule-appointment',
        label: 'Schedule Follow-up',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'OFB', condition: 'negotiation-5-plus-days-no-contract-has-offers' },
      { type: 'NFU', condition: 'negotiation-5-plus-days-no-contract-no-future-appointment-has-offers' }
    ]
  },

  'Awaiting Response': {
    primaryAction: {
      key: 'request-decision',
      title: 'Request Customer Decision',
      description: 'Offer has been pending. Time to request a decision from the prospect',
      label: 'Request Decision',
      icon: 'fa-solid fa-circle-question',
      buttonClass: 'bg-pink-600 hover:bg-pink-700 text-white',
      colorScheme: { background: 'bg-pink-50/50', border: 'border-pink-100' }
    },
    secondaryActions: [
      {
        key: 'add-contract',
        label: 'Add Contract',
        icon: 'fa-solid fa-file-contract',
        description: 'Customer accepted - add contract to proceed'
      },
      {
        key: 'add-offer',
        label: 'Send New Offer',
        icon: 'fa-solid fa-file-invoice-dollar'
      },
      {
        key: 'schedule-appointment',
        label: 'Schedule Meeting',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'OFB', condition: 'negotiation-5-plus-days-no-contract-has-offers' },
      { type: 'NFU', condition: 'negotiation-5-plus-days-no-contract-no-future-appointment-has-offers' }
    ]
  },

  'Contract Pending': {
    primaryAction: {
      key: 'finalize-contract',
      title: 'Finalize Contract',
      description: 'Collect e-signatures and finalize contract documentation',
      label: 'Collect Signatures',
      icon: 'fa-solid fa-file-signature',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      colorScheme: { background: 'bg-emerald-50/50', border: 'border-emerald-100' }
    },
    secondaryActions: [
      {
        key: 'close-won',
        label: 'Close as Won',
        icon: 'fa-solid fa-check-circle',
        description: 'Mark deal as won and finalize'
      },
      {
        key: 'extend-deadline',
        label: 'Extend Deadline',
        icon: 'fa-solid fa-clock'
      },
      {
        key: 'add-offer',
        label: 'Revise Offer',
        icon: 'fa-solid fa-file-invoice-dollar'
      },
      {
        key: 'schedule-appointment',
        label: 'Schedule Appointment',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: []
  },

  'Closed Won': {
    // Primary action varies based on delivery substatus
    primaryAction: (context) => {
      const substatus = context.deliverySubstatus
      
      // Delivered: Collect feedback
      if (substatus === 'Delivered') {
        return {
          key: 'collect-feedback',
          title: 'Post-Delivery Follow-up',
          description: 'Vehicle delivered. Collect customer feedback',
          label: 'Collect Feedback',
          icon: 'fa-solid fa-comment',
          buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
          colorScheme: { background: 'bg-green-50/50', border: 'border-green-100' }
        }
      }
      
      // Awaiting Delivery: Confirm delivery
      if (substatus === 'Awaiting Delivery') {
        return {
          key: 'confirm-delivery',
          title: 'Confirm Delivery Details',
          description: 'Delivery scheduled. Confirm date/time with customer',
          label: 'Confirm Delivery',
          icon: 'fa-solid fa-calendar-check',
          buttonClass: 'bg-teal-600 hover:bg-teal-700 text-white',
          colorScheme: { background: 'bg-teal-50/50', border: 'border-teal-100' }
        }
      }
      
      // No delivery scheduled yet: Schedule delivery
      return {
        key: 'schedule-delivery',
        title: 'Set Delivery Date',
        description: 'Contract signed! Schedule vehicle delivery with the customer',
        label: 'Schedule Delivery',
        icon: 'fa-solid fa-truck',
        buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
        colorScheme: { background: 'bg-green-50/50', border: 'border-green-100' }
      }
    },
    secondaryActions: [
      {
        key: 'collect-feedback',
        label: 'Collect Feedback',
        icon: 'fa-solid fa-comment',
        conditional: 'is-delivered'
      },
      {
        key: 'close-lost',
        label: 'Close as Lost',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'CFB', condition: 'contract-7-plus-days-no-delivery' },
      { type: 'DFB', condition: 'delivery-3-plus-days' }
    ]
  }
}

// Special actions for closed opportunities
export const CLOSED_OPPORTUNITY_ACTIONS = {
  reopen: {
    key: 'reopen',
    label: 'Reopen Opportunity',
    icon: 'fa-solid fa-rotate-left',
    description: 'Restart the management process'
  },
  requalify: {
    key: 'requalify',
    label: 'Requalify as Lead',
    icon: 'fa-solid fa-arrow-left',
    description: 'Convert back to a lead'
  },
  closeLost: {
    key: 'close-lost',
    label: 'Close as Lost',
    icon: 'fa-solid fa-xmark'
  }
}

