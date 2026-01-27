/**
 * Unit tests for Opportunity Business Rules
 */

import { describe, it, expect } from 'vitest'
import {
  OpportunityConditions,
  getAvailableSecondaryActions,
  getActiveTaskWidget,
  getPrimaryAction,
  getTaskWidgetTitle,
  isOpportunityClosed
} from '../opportunityRules'

describe('OpportunityConditions', () => {
  describe('Appointment conditions', () => {
    it('should detect no appointment', () => {
      const context = { scheduledAppointment: null }
      expect(OpportunityConditions['no-appointment'](context)).toBe(true)
      
      const contextWithAppt = { scheduledAppointment: { id: 1 } }
      expect(OpportunityConditions['no-appointment'](contextWithAppt)).toBe(false)
    })

    it('should detect has appointment', () => {
      const context = { scheduledAppointment: { id: 1 } }
      expect(OpportunityConditions['has-appointment'](context)).toBe(true)
      
      const contextNoAppt = { scheduledAppointment: null }
      expect(OpportunityConditions['has-appointment'](contextNoAppt)).toBe(false)
    })

    it('should detect appointment past and not completed', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const context = {
        scheduledAppointment: {
          start: pastDate,
          status: 'pending'
        }
      }
      expect(OpportunityConditions['appointment-past-not-completed'](context)).toBe(true)

      // Completed appointment should return false
      const contextCompleted = {
        scheduledAppointment: {
          start: pastDate,
          status: 'completed'
        }
      }
      expect(OpportunityConditions['appointment-past-not-completed'](contextCompleted)).toBe(false)

      // Future appointment should return false
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const contextFuture = {
        scheduledAppointment: {
          start: futureDate,
          status: 'pending'
        }
      }
      expect(OpportunityConditions['appointment-past-not-completed'](contextFuture)).toBe(false)
    })

    it('should detect future appointment', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const context = {
        scheduledAppointment: {
          start: futureDate
        }
      }
      expect(OpportunityConditions['has-future-appointment'](context)).toBe(true)

      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const contextPast = {
        scheduledAppointment: {
          start: pastDate
        }
      }
      expect(OpportunityConditions['has-future-appointment'](contextPast)).toBe(false)
    })
  })

  describe('Offer conditions', () => {
    it('should detect no offers', () => {
      const context = { hasOffers: false }
      expect(OpportunityConditions['no-offers'](context)).toBe(true)
      
      const contextWithOffers = { hasOffers: true }
      expect(OpportunityConditions['no-offers'](contextWithOffers)).toBe(false)
    })

    it('should detect has offers', () => {
      const context = { hasOffers: true }
      expect(OpportunityConditions['has-offers'](context)).toBe(true)
      
      const contextNoOffers = { hasOffers: false }
      expect(OpportunityConditions['has-offers'](contextNoOffers)).toBe(false)
    })
  })

  describe('Qualified stage conditions', () => {
    it('should detect qualified 7-13 days without offers', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      const context = {
        opportunity: { createdAt: tenDaysAgo },
        hasOffers: false
      }
      expect(OpportunityConditions['qualified-no-offers-7-13-days'](context)).toBe(true)

      // Less than 7 days should return false
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      const contextRecent = {
        opportunity: { createdAt: fiveDaysAgo },
        hasOffers: false
      }
      expect(OpportunityConditions['qualified-no-offers-7-13-days'](contextRecent)).toBe(false)

      // More than 14 days should return false
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      const contextOld = {
        opportunity: { createdAt: fifteenDaysAgo },
        hasOffers: false
      }
      expect(OpportunityConditions['qualified-no-offers-7-13-days'](contextOld)).toBe(false)

      // With offers should return false
      const contextWithOffers = {
        opportunity: { createdAt: tenDaysAgo },
        hasOffers: true
      }
      expect(OpportunityConditions['qualified-no-offers-7-13-days'](contextWithOffers)).toBe(false)
    })

    it('should detect qualified 14+ days without offers', () => {
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      const context = {
        opportunity: { createdAt: fifteenDaysAgo },
        hasOffers: false
      }
      expect(OpportunityConditions['qualified-no-offers-14-plus-days'](context)).toBe(true)

      // Less than 14 days should return false
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      const contextRecent = {
        opportunity: { createdAt: tenDaysAgo },
        hasOffers: false
      }
      expect(OpportunityConditions['qualified-no-offers-14-plus-days'](contextRecent)).toBe(false)
    })
  })

  describe('Negotiation stage conditions', () => {
    it('should detect negotiation 5+ days without contract with offers', () => {
      const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      const context = {
        stage: 'Offer Sent',
        opportunity: { lastActivity: sixDaysAgo, contractDate: null },
        hasOffers: true
      }
      expect(OpportunityConditions['negotiation-5-plus-days-no-contract-has-offers'](context)).toBe(true)

      // In Negotiation without offers should return false
      const contextNoOffers = {
        stage: 'In Negotiation',
        opportunity: { lastActivity: sixDaysAgo, contractDate: null },
        hasOffers: false
      }
      expect(OpportunityConditions['negotiation-5-plus-days-no-contract-has-offers'](contextNoOffers)).toBe(false)

      // With contract should return false
      const contextWithContract = {
        stage: 'Offer Sent',
        opportunity: { lastActivity: sixDaysAgo, contractDate: '2024-01-01' },
        hasOffers: true
      }
      expect(OpportunityConditions['negotiation-5-plus-days-no-contract-has-offers'](contextWithContract)).toBe(false)
    })

    it('should detect negotiation 5+ days without contract and no future appointment', () => {
      const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      const context = {
        stage: 'Offer Sent',
        opportunity: { lastActivity: sixDaysAgo, contractDate: null },
        hasOffers: true,
        scheduledAppointment: null
      }
      expect(OpportunityConditions['negotiation-5-plus-days-no-contract-no-future-appointment-has-offers'](context)).toBe(true)

      // With future appointment should return false
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const contextWithAppt = {
        stage: 'Offer Sent',
        opportunity: { lastActivity: sixDaysAgo, contractDate: null },
        hasOffers: true,
        scheduledAppointment: { start: futureDate }
      }
      expect(OpportunityConditions['negotiation-5-plus-days-no-contract-no-future-appointment-has-offers'](contextWithAppt)).toBe(false)
    })
  })

  describe('Contract/Delivery conditions', () => {
    it('should detect contract 7+ days without delivery', () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      const context = {
        opportunity: { contractDate: eightDaysAgo },
        activities: []
      }
      expect(OpportunityConditions['contract-7-plus-days-no-delivery'](context)).toBe(true)

      // With delivery activity should return false
      const contextWithDelivery = {
        opportunity: { contractDate: eightDaysAgo },
        activities: [{ type: 'delivery' }]
      }
      expect(OpportunityConditions['contract-7-plus-days-no-delivery'](contextWithDelivery)).toBe(false)

      // Less than 7 days should return false
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      const contextRecent = {
        opportunity: { contractDate: fiveDaysAgo },
        activities: []
      }
      expect(OpportunityConditions['contract-7-plus-days-no-delivery'](contextRecent)).toBe(false)
    })

    it('should detect delivery 3+ days', () => {
      const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      const context = {
        activities: [{ type: 'delivery', timestamp: fourDaysAgo }]
      }
      expect(OpportunityConditions['delivery-3-plus-days'](context)).toBe(true)

      // Less than 3 days should return false
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      const contextRecent = {
        activities: [{ type: 'delivery', timestamp: twoDaysAgo }]
      }
      expect(OpportunityConditions['delivery-3-plus-days'](contextRecent)).toBe(false)

      // No delivery activity should return false
      const contextNoDelivery = {
        activities: []
      }
      expect(OpportunityConditions['delivery-3-plus-days'](contextNoDelivery)).toBe(false)
    })
  })

  describe('Closed state conditions', () => {
    it('should detect closed opportunity', () => {
      expect(OpportunityConditions['is-closed']({ stage: 'Closed Won' })).toBe(true)
      expect(OpportunityConditions['is-closed']({ stage: 'Closed Lost' })).toBe(true)
      expect(OpportunityConditions['is-closed']({ stage: 'Qualified' })).toBe(false)
      expect(OpportunityConditions['is-closed']({ stage: 'In Negotiation' })).toBe(false)
    })

    it('should detect delivery substatus conditions', () => {
      expect(OpportunityConditions['is-awaiting-delivery']({ deliverySubstatus: 'Awaiting Delivery' })).toBe(true)
      expect(OpportunityConditions['is-awaiting-delivery']({ deliverySubstatus: 'Delivered' })).toBe(false)
      expect(OpportunityConditions['is-awaiting-delivery']({ deliverySubstatus: null })).toBe(false)

      expect(OpportunityConditions['is-delivered']({ deliverySubstatus: 'Delivered' })).toBe(true)
      expect(OpportunityConditions['is-delivered']({ deliverySubstatus: 'Awaiting Delivery' })).toBe(false)
      expect(OpportunityConditions['is-delivered']({ deliverySubstatus: null })).toBe(false)

      expect(OpportunityConditions['has-no-delivery']({ deliverySubstatus: null })).toBe(true)
      expect(OpportunityConditions['has-no-delivery']({ deliverySubstatus: 'Awaiting Delivery' })).toBe(false)
      expect(OpportunityConditions['has-no-delivery']({ deliverySubstatus: 'Delivered' })).toBe(false)
    })

    it('should detect closed with task widget', () => {
      const context = {
        stage: 'Closed Won',
        hasActiveTaskWidget: true
      }
      expect(OpportunityConditions['is-closed-with-task-widget'](context)).toBe(true)

      const contextNoWidget = {
        stage: 'Closed Won',
        hasActiveTaskWidget: false
      }
      expect(OpportunityConditions['is-closed-with-task-widget'](contextNoWidget)).toBe(false)

      const contextNotClosed = {
        stage: 'Qualified',
        hasActiveTaskWidget: true
      }
      expect(OpportunityConditions['is-closed-with-task-widget'](contextNotClosed)).toBe(false)
    })
  })
})

describe('getAvailableSecondaryActions', () => {
  it('should return closed actions when closed with task widget', () => {
    const context = {
      stage: 'Closed Won',
      hasActiveTaskWidget: true
    }
    const actions = getAvailableSecondaryActions('Closed Won', context)
    
    expect(actions).toHaveLength(3)
    expect(actions.map(a => a.key)).toEqual(['reopen', 'requalify', 'close-lost'])
  })

  it('should filter conditional actions', () => {
    const context = {
      scheduledAppointment: null,
      hasActiveTaskWidget: false,
      stage: 'Qualified'
    }
    const actions = getAvailableSecondaryActions('Qualified', context)
    
    // Should include schedule-appointment because no appointment exists
    expect(actions.some(a => a.key === 'schedule-appointment')).toBe(true)
  })

  it('should exclude conditional actions when condition not met', () => {
    const context = {
      scheduledAppointment: { id: 1 },
      hasActiveTaskWidget: false,
      stage: 'Qualified'
    }
    const actions = getAvailableSecondaryActions('Qualified', context)
    
    // Should NOT include schedule-appointment because appointment exists
    expect(actions.some(a => a.key === 'schedule-appointment')).toBe(false)
  })
})

describe('getActiveTaskWidget', () => {
  it('should return OOFB widget for qualified 7-13 days without offers', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    const context = {
      opportunity: { createdAt: tenDaysAgo },
      hasOffers: false,
      stage: 'Qualified'
    }
    
    const widget = getActiveTaskWidget('Qualified', context)
    expect(widget).toBe('OOFB')
  })

  it('should return UFB widget for qualified 14+ days without offers', () => {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    const context = {
      opportunity: { createdAt: fifteenDaysAgo },
      hasOffers: false,
      stage: 'Qualified'
    }
    
    const widget = getActiveTaskWidget('Qualified', context)
    expect(widget).toBe('UFB')
  })

  it('should return NS widget for past appointment not completed', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const context = {
      scheduledAppointment: {
        start: pastDate,
        status: 'pending'
      },
      stage: 'Awaiting Appointment'
    }
    
    const widget = getActiveTaskWidget('Awaiting Appointment', context)
    expect(widget).toBe('NS')
  })

  it('should return null when no widget conditions are met', () => {
    const context = {
      opportunity: { createdAt: new Date().toISOString() },
      hasOffers: false,
      stage: 'Qualified'
    }
    
    const widget = getActiveTaskWidget('Qualified', context)
    expect(widget).toBeNull()
  })
})

describe('getPrimaryAction', () => {
  it('should return action configuration for stage', () => {
    const context = {
      stage: 'Qualified',
      scheduledAppointment: null
    }
    
    const action = getPrimaryAction('Qualified', context)
    
    expect(action).toBeDefined()
    expect(action.key).toBe('schedule-appointment')
    expect(action.title).toBe('Schedule First Appointment')
  })

  it('should evaluate dynamic properties', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const context = {
      stage: 'Awaiting Appointment',
      scheduledAppointment: { start: futureDate },
      formatDateTime: (date) => 'formatted date'
    }
    
    const action = getPrimaryAction('Awaiting Appointment', context)
    
    expect(action.title).toBe('Next Appointment')
    expect(action.description).toContain('formatted date')
  })

  it('should return null for invalid stage', () => {
    const context = { stage: 'Invalid Stage' }
    const action = getPrimaryAction('Invalid Stage', context)
    
    expect(action).toBeNull()
  })
})

describe('getTaskWidgetTitle', () => {
  it('should return correct title for widget type', () => {
    expect(getTaskWidgetTitle('OOFB')).toBe('Overdue Offer Follow-up Task')
    expect(getTaskWidgetTitle('UFB')).toBe('Urgent Follow-up Task')
    expect(getTaskWidgetTitle('NS')).toBe('NS')
    expect(getTaskWidgetTitle('OFB')).toBe('Offer Follow-up Task')
    expect(getTaskWidgetTitle('CFB')).toBe('Contract Follow-up Task')
    expect(getTaskWidgetTitle('DFB')).toBe('Delivery Follow-up Task')
    expect(getTaskWidgetTitle('NFU')).toBe('No Future Updates Task')
  })

  it('should return default title for unknown widget type', () => {
    expect(getTaskWidgetTitle('UNKNOWN')).toBe('Task')
  })
})

describe('isOpportunityClosed', () => {
  it('should return true for closed stages', () => {
    expect(isOpportunityClosed('Closed Won')).toBe(true)
    expect(isOpportunityClosed('Closed Lost')).toBe(true)
  })

  it('should return false for open stages', () => {
    expect(isOpportunityClosed('Qualified')).toBe(false)
    expect(isOpportunityClosed('In Negotiation')).toBe(false)
    expect(isOpportunityClosed('Awaiting Appointment')).toBe(false)
  })
})

