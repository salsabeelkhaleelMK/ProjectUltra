import { mockDashboardKPIs, mockSalesPipeline, mockTeamPerformance, mockTodaysEvents, mockPageViewsByVehicle, mockPageViewsOrganicPaid } from './mockData'

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




