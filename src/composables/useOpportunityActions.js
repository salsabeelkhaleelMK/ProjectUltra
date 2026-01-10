/**
 * Opportunity Actions Composable
 * 
 * Connects state machine configuration with business rules and component handlers.
 * This is the "glue layer" between pure logic and Vue components.
 */

import { computed, toValue } from 'vue'
import { 
  getPrimaryAction, 
  getAvailableSecondaryActions, 
  getActiveTaskWidget,
  getTaskWidgetTitle,
  isOpportunityClosed
} from '@/utils/opportunityRules'

// Import task widget components
import OOFBWidget from '@/components/opportunities/tasks/OOFBWidget.vue'
import UFBWidget from '@/components/opportunities/tasks/UFBWidget.vue'
import NFUWidget from '@/components/opportunities/tasks/NFUWidget.vue'
import OFBWidget from '@/components/opportunities/tasks/OFBWidget.vue'
import CFBWidget from '@/components/opportunities/tasks/CFBWidget.vue'
import DFBWidget from '@/components/opportunities/tasks/DFBWidget.vue'
import NSWidget from '@/components/opportunities/tasks/NSWidget.vue'

// Map widget types to components
const TASK_WIDGET_COMPONENTS = {
  'OOFB': OOFBWidget,
  'UFB': UFBWidget,
  'NFU': NFUWidget,
  'OFB': OFBWidget,
  'CFB': CFBWidget,
  'DFB': DFBWidget,
  'NS': NSWidget
}

/**
 * Main composable for opportunity actions
 * 
 * @param {Ref|Object} opportunity - The opportunity object (reactive)
 * @param {Ref|Object} scheduledAppointment - Scheduled appointment if any (reactive)
 * @param {Ref|Array} activities - Array of activities (reactive)
 * @param {Object} handlers - Map of action keys to handler functions
 * @param {Function} formatDateTime - Function to format date/time strings
 * @returns {Object} Computed properties for actions and widgets
 */
export function useOpportunityActions(opportunity, scheduledAppointment, activities, handlers, formatDateTime) {
  // Build context object for rule evaluation
  const context = computed(() => {
    const opp = toValue(opportunity)
    const appt = toValue(scheduledAppointment)
    const acts = toValue(activities)
    
    return {
      opportunity: opp,
      scheduledAppointment: appt,
      activities: acts,
      hasOffers: acts?.some(a => a.type === 'offer') || false,
      stage: opp.displayStage || opp.stage,
      deliverySubstatus: opp.deliverySubstatus || null,
      formatDateTime: formatDateTime,
      hasActiveTaskWidget: false // Will be set after activeTaskWidget is computed
    }
  })

  // Compute active task widget first (needed for context)
  const activeTaskWidget = computed(() => {
    const ctx = context.value
    const widgetType = getActiveTaskWidget(ctx.stage, ctx)
    
    if (!widgetType) return null
    
    const component = TASK_WIDGET_COMPONENTS[widgetType]
    if (!component) return null
    
    return {
      component,
      props: {
        opportunity: ctx.opportunity,
        appointment: ctx.scheduledAppointment
      }
    }
  })

  // Update context with hasActiveTaskWidget
  const contextWithWidget = computed(() => ({
    ...context.value,
    hasActiveTaskWidget: !!activeTaskWidget.value
  }))

  // Compute primary action
  const primaryAction = computed(() => {
    const ctx = contextWithWidget.value
    const actionConfig = getPrimaryAction(ctx.stage, ctx)
    
    if (!actionConfig) return null
    
    // Map handler
    const handler = handlers[actionConfig.key]
    
    return {
      ...actionConfig,
      handler: handler || (() => console.warn(`No handler for action: ${actionConfig.key}`))
    }
  })

  // Compute secondary actions
  const secondaryActions = computed(() => {
    const ctx = contextWithWidget.value
    const availableActions = getAvailableSecondaryActions(ctx.stage, ctx)
    
    return availableActions.map(action => {
      const handler = handlers[action.key]
      
      return {
        ...action,
        handler: handler || (() => console.warn(`No handler for action: ${action.key}`))
      }
    })
  })

  // Check if opportunity is closed
  const isClosed = computed(() => {
    const ctx = context.value
    return isOpportunityClosed(ctx.stage)
  })

  // Get task widget title
  const taskWidgetTitle = computed(() => {
    if (!activeTaskWidget.value) return ''
    
    const componentName = activeTaskWidget.value.component.__name || activeTaskWidget.value.component.name
    
    // Extract widget type from component name (e.g., "OOFBWidget" -> "OOFB")
    const widgetType = componentName.replace('Widget', '')
    
    return getTaskWidgetTitle(widgetType)
  })

  return {
    primaryAction,
    secondaryActions,
    activeTaskWidget,
    taskWidgetTitle,
    isClosed
  }
}

