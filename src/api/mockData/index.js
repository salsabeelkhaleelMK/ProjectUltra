// Mock data index - re-exports all mock data from organized files
// This file provides a centralized export point for all mock data
// Now uses locale-aware data loader

import { getMockData } from './localeLoader.js'

// Get locale-aware mock data
const mockData = getMockData()

// Export all mock data (locale-aware)
export const { 
  mockUsers,
  mockCustomers,
  mockLeads,
  mockOpportunities,
  mockTasks,
  mockContacts,
  mockVehicles,
  mockCalendarEvents,
  mockActivities,
  calendarEventTypes,
  calendarDealerships,
  calendarTeams,
  mockDashboardKPIs,
  mockSalesPipeline,
  mockTeamPerformance,
  mockTodaysEvents,
  mockPageViewsByVehicle,
  mockPageViewsOrganicPaid,
  mockBDCOperatorMetrics,
  mockSalespersonMetrics,
  mockManagerFunnelMetrics
} = mockData


