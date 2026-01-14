export const mockDashboardKPIs = [
  {
    id: 1,
    title: 'Deals closed today',
    value: 12,
    change: 20,
    changeType: 'increase',
    trend: [8, 9, 10, 11, 12, 11, 12]
  },
  {
    id: 2,
    title: 'Deals in negotiation',
    value: 320,
    change: 11,
    changeType: 'increase',
    trend: [280, 290, 300, 310, 315, 318, 320]
  },
  {
    id: 3,
    title: 'New leads today',
    value: 79,
    change: 11,
    changeType: 'decrease',
    trend: [90, 88, 85, 82, 80, 79, 79]
  },
  {
    id: 4,
    title: 'New opportunities today',
    value: 23,
    change: 17,
    changeType: 'increase',
    trend: [18, 19, 20, 21, 22, 22, 23]
  }
]

export const mockSalesPipeline = {
  stages: [
    { name: 'Lead generated', percentage: 100, count: 1000, avgTime: '12h' },
    { name: 'Validated', percentage: 87.2, count: 872, avgTime: '12h' },
    { name: 'Qualified', percentage: 63.4, count: 634, avgTime: '12h' },
    { name: 'Offer created', percentage: 17.2, count: 172, avgTime: '7d 9h' },
    { name: 'Won', percentage: 11.2, count: 112, avgTime: '12h' }
  ],
  leadSources: [
    { name: 'Coches.net', color: 'red', data: [1000, 872, 634, 172, 112] },
    { name: 'Autoscout24', color: 'orange', data: [800, 700, 500, 140, 90] },
    { name: 'OLX', color: 'blue', data: [600, 520, 380, 100, 65] },
    { name: 'Cars.com', color: 'gray', data: [400, 350, 250, 70, 45] }
  ]
}

export const mockTeamPerformance = [
  { name: 'Jose Maria Gonzalez', leads: 171, qualifiedLeads: 85, qualifiedPercentage: 49, opportunities: 42, inNegotiation: 18, inNegotiationPercentage: 43, won: 12, wonPercentage: 67 },
  { name: 'Sarah Johnson', leads: 145, qualifiedLeads: 62, qualifiedPercentage: 43, opportunities: 38, inNegotiation: 15, inNegotiationPercentage: 39, won: 9, wonPercentage: 60 },
  { name: 'Michael Chen', leads: 198, qualifiedLeads: 94, qualifiedPercentage: 47, opportunities: 51, inNegotiation: 22, inNegotiationPercentage: 43, won: 15, wonPercentage: 68 },
  { name: 'Emma Rodriguez', leads: 156, qualifiedLeads: 78, qualifiedPercentage: 50, opportunities: 45, inNegotiation: 19, inNegotiationPercentage: 42, won: 11, wonPercentage: 58 },
  { name: 'David Kim', leads: 182, qualifiedLeads: 89, qualifiedPercentage: 49, opportunities: 48, inNegotiation: 21, inNegotiationPercentage: 44, won: 14, wonPercentage: 67 },
  { name: 'Lisa Thompson', leads: 134, qualifiedLeads: 59, qualifiedPercentage: 44, opportunities: 35, inNegotiation: 14, inNegotiationPercentage: 40, won: 8, wonPercentage: 57 },
  { name: 'Carlos Martinez', leads: 167, qualifiedLeads: 82, qualifiedPercentage: 49, opportunities: 44, inNegotiation: 20, inNegotiationPercentage: 45, won: 13, wonPercentage: 65 },
  { name: 'Anna Kowalski', leads: 143, qualifiedLeads: 65, qualifiedPercentage: 45, opportunities: 37, inNegotiation: 16, inNegotiationPercentage: 43, won: 10, wonPercentage: 63 },
  { name: 'Thomas Anderson', leads: 189, qualifiedLeads: 91, qualifiedPercentage: 48, opportunities: 49, inNegotiation: 23, inNegotiationPercentage: 47, won: 16, wonPercentage: 70 },
  { name: 'Sophie Laurent', leads: 159, qualifiedLeads: 73, qualifiedPercentage: 46, opportunities: 41, inNegotiation: 17, inNegotiationPercentage: 41, won: 11, wonPercentage: 65 }
]

export const mockTodaysEvents = [
  { id: 1, time: '09:30-10:30', type: 'Dealership visit', customer: 'Jose Maria Gonzalez', location: 'Madrid Mercedes-Benz Central' },
  { id: 2, time: '11:00-12:00', type: 'Test drive', customer: 'Sarah Johnson', location: 'Barcelona Mercedes-Benz' },
  { id: 3, time: '13:15-13:45', type: 'Call', customer: 'Michael Chen', location: 'Virtual Meeting' },
  { id: 4, time: '14:30-15:30', type: 'Delivery', customer: 'Emma Rodriguez', location: 'Valencia Mercedes-Benz' },
  { id: 5, time: '15:45-16:45', type: 'Recall', customer: 'David Kim', location: 'Seville Service Center' },
  { id: 6, time: '17:00-18:00', type: 'Offsite visit', customer: 'Lisa Thompson', location: 'Customer Location - Malaga' }
]

export const mockPageViewsByVehicle = [
  { id: 1, brand: 'BMW', model: 'X5', views: 102, change: 15.3, changeType: 'increase', avgPerDay: 3.4, trend: [85, 88, 92, 95, 98, 100, 102] },
  { id: 2, brand: 'Mercedes-Benz', model: 'GLE', views: 81, change: 12.0, changeType: 'increase', avgPerDay: 2.7, trend: [70, 72, 75, 77, 79, 80, 81] },
  { id: 3, brand: 'Audi', model: 'Q7', views: 72, change: 2.7, changeType: 'decrease', avgPerDay: 2.4, trend: [74, 73, 73, 72, 72, 72, 72] },
  { id: 4, brand: 'Porsche', model: 'Cayenne', views: 68, change: 8.0, changeType: 'increase', avgPerDay: 2.3, trend: [60, 62, 64, 65, 66, 67, 68] },
  { id: 5, brand: 'Tesla', model: 'Model Y', views: 60, change: 8.0, changeType: 'decrease', avgPerDay: 2.0, trend: [65, 64, 63, 62, 61, 60, 60] }
]

export const mockPageViewsOrganicPaid = [
  { day: '1', organic: 120, paid: 45 },
  { day: '2', organic: 135, paid: 52 },
  { day: '3', organic: 98, paid: 38 },
  { day: '4', organic: 145, paid: 60 },
  { day: '5', organic: 160, paid: 68 },
  { day: '6', organic: 185, paid: 75 },
  { day: '7', organic: 155, paid: 62 },
  { day: '8', organic: 125, paid: 48 },
  { day: '9', organic: 142, paid: 55 },
  { day: '10', organic: 110, paid: 42 },
  { day: '11', organic: 138, paid: 58 },
  { day: '12', organic: 168, paid: 72 },
  { day: '13', organic: 195, paid: 82 },
  { day: '14', organic: 165, paid: 70 },
  { day: '15', organic: 132, paid: 50 },
  { day: '16', organic: 148, paid: 60 },
  { day: '17', organic: 115, paid: 45 },
  { day: '18', organic: 152, paid: 65 },
  { day: '19', organic: 175, paid: 78 },
  { day: '20', organic: 205, paid: 88 },
  { day: '21', organic: 172, paid: 75 },
  { day: '22', organic: 140, paid: 55 },
  { day: '23', organic: 155, paid: 65 },
  { day: '24', organic: 122, paid: 48 },
  { day: '25', organic: 158, paid: 68 },
  { day: '26', organic: 182, paid: 82 },
  { day: '27', organic: 215, paid: 92 },
  { day: '28', organic: 180, paid: 80 },
  { day: '29', organic: 145, paid: 58 },
  { day: '30', organic: 162, paid: 70 }
]

// Performance Metrics Mock Data
export const mockBDCOperatorMetrics = {
  slaCompliance: {
    completed: 142,
    total: 158,
    percentage: 89.9,
    withinSLA: 142,
    trend: [85.2, 86.5, 87.1, 88.3, 88.9, 89.5, 89.9]
  },
  tasksPerDay: {
    current: 35,
    target: 40,
    average: 33.5,
    trend: [28, 30, 32, 33, 34, 34.5, 35]
  },
  appointmentsReserved: 28,
  appointmentsReservedTrend: [22, 24, 26, 25, 27, 28],
  leadToOpportunityConversion: 24.5,
  leadToOpportunityConversionTrend: [20, 21, 23, 24, 24.2, 24.5]
}

export const mockSalespersonMetrics = {
  contractsClosed: {
    month: 12,
    quarter: 34,
    year: 128
  },
  revenue: {
    month: 1250000,
    quarter: 3450000,
    year: 12800000
  },
  revenueTargets: {
    month: 1500000,
    quarter: 4000000,
    year: 15000000
  },
  pipelineValue: 3200000,
  winRate: 68.5,
  newOpportunities: {
    month: 23,
    quarter: 67,
    year: 245
  },
  dormantOpportunities: 8
}

export const mockManagerFunnelMetrics = {
  stages: [
    {
      name: 'Total leads',
      count: 1332,
      percentage: 100,
      color: 'gray',
      trend: [1200, 1250, 1280, 1300, 1315, 1325, 1332]
    },
    {
      name: 'Assigned leads',
      count: 1037,
      percentage: 78,
      color: 'gray',
      trend: [950, 980, 1000, 1015, 1025, 1030, 1037]
    },
    {
      name: 'Managed leads',
      count: 982,
      percentage: 74,
      color: 'gray',
      trend: [920, 940, 960, 970, 975, 980, 982]
    },
    {
      name: 'Qualified leads',
      count: 372,
      percentage: 28,
      color: 'orange',
      trend: [340, 350, 360, 365, 368, 370, 372]
    },
    {
      name: 'Managed opportunities',
      count: 316,
      percentage: 24,
      color: 'blue',
      trend: [290, 300, 308, 312, 314, 315, 316]
    },
    {
      name: 'Won opportunities',
      count: 211,
      percentage: 16,
      color: 'red',
      trend: [195, 200, 205, 208, 210, 210, 211]
    }
  ],
  conversionRate: 16,
  conversionRateTrend: [14.2, 14.8, 15.2, 15.5, 15.7, 15.9, 16]
}
