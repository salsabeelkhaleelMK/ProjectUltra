import { mockDashboardKPIs, mockSalesPipeline, mockTeamPerformance, mockTodaysEvents, mockPageViewsByVehicle, mockPageViewsOrganicPaid, mockBDCOperatorMetrics, mockSalespersonMetrics, mockManagerFunnelMetrics } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchDashboardKPIs = async () => {
  await delay()
  return mockDashboardKPIs
}

export const fetchSalesPipeline = async () => {
  await delay()
  return mockSalesPipeline
}

export const fetchTeamPerformance = async () => {
  await delay()
  return mockTeamPerformance
}

export const fetchTodaysEvents = async () => {
  await delay()
  return mockTodaysEvents
}

export const fetchPageViewsByVehicle = async () => {
  await delay()
  return mockPageViewsByVehicle
}

export const fetchPageViewsOrganicPaid = async () => {
  await delay()
  return mockPageViewsOrganicPaid
}

export const fetchBDCOperatorMetrics = async (userId, period = 'month') => {
  await delay()
  // In a real implementation, this would filter by userId and period
  return mockBDCOperatorMetrics
}

export const fetchSalespersonMetrics = async (userId, period = 'month') => {
  await delay()
  // In a real implementation, this would filter by userId and period
  return mockSalespersonMetrics
}

export const fetchManagerFunnelMetrics = async (period = 'month') => {
  await delay()
  // In a real implementation, this would filter by period
  return mockManagerFunnelMetrics
}






