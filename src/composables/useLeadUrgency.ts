import { mockActivities } from '@/api/mockData'
import { useSettingsStore } from '@/stores/settings'

export type UrgencyLevel = 'HOT' | 'WARM' | 'STANDARD' | 'COLD'

export interface UrgencyWeights {
  intent: number
  behavioral: number
  temporal: number
}

export interface UrgencyThresholds {
  hot: number
  warm: number
  standard: number
}

export interface ScoreBreakdown {
  intent: number
  behavioral: number
  temporal: number
  quality: number
  total: number
}

export interface UrgencyResult {
  score: number
  level: UrgencyLevel
  breakdown: ScoreBreakdown
}

/**
 * Calculates the urgency score for a lead based on intent, behavior, and temporal factors.
 * 
 * @param lead - The lead object containing all relevant data
 * @param customWeights - Optional custom weights for scoring dimensions (defaults to settings)
 * @param customThresholds - Optional custom thresholds for urgency levels (defaults to settings)
 * @returns Urgency score (0-100) and urgency level (HOT/WARM/STANDARD/COLD)
 */
export function calculateLeadUrgency(
  lead: any,
  customWeights?: UrgencyWeights,
  customThresholds?: UrgencyThresholds
): UrgencyResult {
  const settingsStore = useSettingsStore()
  const weights = customWeights || settingsStore.getSetting('urgencyWeights') || {
    intent: 40,
    behavioral: 35,
    temporal: 25
  }
  const thresholds = customThresholds || settingsStore.getSetting('urgencyThresholds') || {
    hot: 80,
    warm: 50,
    standard: 20
  }

  // Get lead activities
  const activities = mockActivities.filter(a => a.leadId === lead.id) || []

  // Calculate intent score (0-40 points)
  const intentScore = calculateIntentScore(lead, activities)

  // Calculate behavioral score (0-35 points)
  const behavioralScore = calculateBehavioralScore(lead, activities)

  // Calculate temporal score (0-25 points)
  const temporalScore = calculateTemporalScore(lead)

  // Calculate quality bonus/penalty
  const qualityScore = calculateQualityScore(lead)

  // Normalize weights to ensure they sum to 100
  const totalWeight = weights.intent + weights.behavioral + weights.temporal
  const normalizedWeights = {
    intent: (weights.intent / totalWeight) * 100,
    behavioral: (weights.behavioral / totalWeight) * 100,
    temporal: (weights.temporal / totalWeight) * 100
  }

  // Calculate weighted scores
  const weightedIntent = (intentScore / 40) * normalizedWeights.intent
  const weightedBehavioral = (behavioralScore / 35) * normalizedWeights.behavioral
  const weightedTemporal = (temporalScore / 25) * normalizedWeights.temporal

  // Total score (0-100) + quality adjustments
  const totalScore = Math.min(100, Math.max(0, weightedIntent + weightedBehavioral + weightedTemporal + qualityScore))

  // Determine urgency level
  let level: UrgencyLevel = 'COLD'
  if (totalScore >= thresholds.hot) {
    level = 'HOT'
  } else if (totalScore >= thresholds.warm) {
    level = 'WARM'
  } else if (totalScore >= thresholds.standard) {
    level = 'STANDARD'
  }

  return {
    score: Math.round(totalScore * 10) / 10, // Round to 1 decimal place
    level,
    breakdown: {
      intent: Math.round(intentScore * 10) / 10,
      behavioral: Math.round(behavioralScore * 10) / 10,
      temporal: Math.round(temporalScore * 10) / 10,
      quality: Math.round(qualityScore * 10) / 10,
      total: Math.round(totalScore * 10) / 10
    }
  }
}

/**
 * Calculate intent score based on explicit buying signals
 */
function calculateIntentScore(lead: any, activities: any[]): number {
  let score = 0

  // Test drive requests: +40 points (highest priority)
  if (lead.requestType === 'Test Drive' || 
      lead.scheduledAppointment?.type === 'test-drive' ||
      activities.some(a => a.type === 'test-drive' || a.type === 'appointment')) {
    score = Math.max(score, 40)
  }

  // Financing inquiries: +35 points
  if (activities.some(a => a.type === 'financing')) {
    score = Math.max(score, 35)
  }

  // Trade-in value checks: +30 points
  if (activities.some(a => a.type === 'tradein')) {
    score = Math.max(score, 30)
  }

  // Dealer location searches: +25 points
  // Check if source indicates location search or activities mention location
  if (lead.source === 'Walk-in' || 
      activities.some(a => a.content?.toLowerCase().includes('location') || 
                          a.content?.toLowerCase().includes('dealership') ||
                          a.content?.toLowerCase().includes('visit'))) {
    score = Math.max(score, 25)
  }

  // Specific vehicle configuration: +20 points
  // Check if requestedCar has detailed configuration
  if (lead.requestedCar && (
      lead.requestedCar.requestMessage ||
      activities.some(a => a.content?.toLowerCase().includes('configur') ||
                          a.type === 'attachment' && a.fileName?.toLowerCase().includes('config'))
  )) {
    score = Math.max(score, 20)
  }

  // Competitive model comparisons: +15 points
  if (activities.some(a => {
    const content = a.content?.toLowerCase() || ''
    return content.includes('compare') || 
           content.includes('versus') || 
           content.includes('vs') ||
           content.includes('alternative')
  })) {
    score = Math.max(score, 15)
  }

  return Math.min(score, 40) // Cap at 40
}

/**
 * Calculate behavioral score based on engagement patterns
 */
function calculateBehavioralScore(lead: any, activities: any[]): number {
  let score = 0

  // Return visit frequency: +10 points per unique activity date (max 35)
  const uniqueDates = new Set(
    activities.map(a => {
      if (!a.timestamp) return null
      const date = new Date(a.timestamp)
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }).filter(Boolean)
  )
  const visitScore = Math.min(uniqueDates.size * 10, 35)
  score += visitScore

  // Multiple contact attempts: +20 points if > 1
  if (lead.contactAttempts && lead.contactAttempts.length > 1) {
    score += 20
  }

  // Features explored (depth): 0-25 points based on activity content length and detail
  const totalContentLength = activities.reduce((sum, a) => {
    return sum + (a.content?.length || 0)
  }, 0)
  // Score based on content depth (more detailed interactions = higher score)
  const depthScore = Math.min(Math.floor(totalContentLength / 50), 25)
  score += depthScore

  // Brochure/documentation downloads: +15 points
  if (activities.some(a => a.type === 'attachment' && (
    a.fileName?.toLowerCase().includes('brochure') ||
    a.fileName?.toLowerCase().includes('spec') ||
    a.fileName?.toLowerCase().includes('pdf')
  ))) {
    score += 15
  }

  return Math.min(score, 35) // Cap at 35
}

/**
 * Calculate temporal score based on time-sensitive factors
 */
function calculateTemporalScore(lead: any): number {
  let score = 0

  if (!lead.createdAt) return 0

  const now = new Date()
  const createdAt = new Date(lead.createdAt)
  const leadAgeHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  // Lead age scoring
  if (leadAgeHours < 2) {
    score += 25 // < 2 hours: highest priority
  } else if (leadAgeHours < 24) {
    score += 15 // 2-24 hours: high priority
  } else if (leadAgeHours < 48) {
    score += 5 // 24-48 hours: moderate priority
  } else {
    score -= 10 // > 48 hours: penalty
  }

  // Weekend/evening submissions: +10 bonus
  const dayOfWeek = createdAt.getDay()
  const hour = createdAt.getHours()
  if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 9 || hour > 17) {
    score += 10
  }

  // Approaching 4th contact attempt: +50 points (critical to prevent auto-disqualification)
  if (lead.contactAttempts && lead.contactAttempts.length === 3) {
    score += 50
  }

  // Days since last contact: +20 if > 3 days (needs follow-up)
  if (lead.lastActivity) {
    const lastActivityDate = new Date(lead.lastActivity)
    const daysSinceLastContact = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceLastContact > 3) {
      score += 20
    }
  }

  return Math.min(Math.max(score, 0), 25) // Cap at 25, but allow negative for old leads
}

/**
 * Calculate quality bonus/penalty based on lead data quality
 */
function calculateQualityScore(lead: any): number {
  let score = 0

  // Email verified: +10 points (check if email exists and is valid format)
  if (lead.customer?.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(lead.customer.email)) {
      score += 10
    }
  }

  // Phone validated: +10 points (check if phone exists and has valid format)
  if (lead.customer?.phone) {
    // Basic phone validation (contains digits and + or country code)
    const phoneRegex = /^\+?[\d\s\-()]+$/
    if (phoneRegex.test(lead.customer.phone) && lead.customer.phone.length >= 10) {
      score += 10
    }
  }

  // Complete contact information: +5 points
  if (lead.customer?.name && lead.customer?.email && lead.customer?.phone && lead.customer?.address) {
    score += 5
  }

  // Duplicate/incomplete data: -20 points
  // Check for duplicate flags or incomplete data indicators
  if (lead.isDuplicate || lead.isDisqualified || !lead.customer?.name) {
    score -= 20
  }

  return score
}

/**
 * Get urgency level emoji/icon
 */
export function getUrgencyIcon(level: UrgencyLevel): string {
  switch (level) {
    case 'HOT':
      return '🔥'
    case 'WARM':
      return '🟡'
    case 'STANDARD':
      return '🟢'
    case 'COLD':
      return '⚪'
    default:
      return '⚪'
  }
}

/**
 * Get urgency level color class
 */
export function getUrgencyColorClass(level: UrgencyLevel): string {
  switch (level) {
    case 'HOT':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'WARM':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'STANDARD':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'COLD':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

