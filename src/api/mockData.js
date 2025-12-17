// Mock data for CRM application
// This layer can be easily replaced with real API calls

export const mockUsers = [
  { id: 1, name: 'Salsabeel Khaleel', initials: 'SK', role: 'salesman', email: 'salsabeel.khaleel@example.com' },
  { id: 2, name: 'Sarah Jenkins', initials: 'SJ', role: 'salesman', email: 'sarah.jenkins@example.com' },
  { id: 3, name: 'David Miller', initials: 'DM', role: 'operator', email: 'david.miller@example.com' },
  { id: 4, name: 'Natalia Sung', initials: 'NS', role: 'operator', email: 'natalia.sung@example.com' }
]

export const mockLeads = [
  {
    id: 1,
    customer: { id: 1, name: 'Josh Adams', initials: 'JA', email: 'josh.adams@example.com', phone: '+4901564879300', address: 'Via Torino 56, 20123 Milan' },
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Audi', 
      model: 'A6 Allroad', 
      year: 2023, 
      price: 19000, 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5ap8dR1YoIY8e1Yopb3EojZi1LTuCvzymmg&s',
      vin: '7015733W8749',
      kilometers: 102000,
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '03/2016',
      dealership: 'Firenze',
      stockDays: 412,
      requestMessage: 'Hello, I would like to know the details about the car: What is the suspension?'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Marketing',
    fiscalEntity: 'MotorK',
    sourceDetails: 'ADD 2024',
    assignee: 'Michael Thomas',
    assigneeInitials: 'MT',
    createdAt: '2025-03-21T08:17:00',
    lastActivity: '2025-03-25T14:30:00',
    nextActionDue: '1h 12m',
    tags: ['Premium', 'Automation'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null
  },
  {
    id: 2,
    customer: { id: 2, name: 'Emma Watson', initials: 'EW', email: 'emma.watson@example.com', phone: '+4901234567890', address: 'Hauptstraße 12, 10115 Berlin' },
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2024, 
      price: 95000, 
      image: '',
      vin: '8912345X6789',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Milano',
      stockDays: null,
      requestMessage: 'Interested in the new EQS model for a test drive.'
    },
    carStatus: 'New',
    requestType: 'Generic Sales',
    source: 'Marketing',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Emma Watson',
    assigneeInitials: 'EW',
    createdAt: '2025-03-20T10:15:00',
    lastActivity: '2025-03-24T16:20:00',
    nextActionDue: '4h 20m',
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null
  },
  {
    id: 3,
    customer: { id: 3, name: 'Liam Johnson', initials: 'LJ', email: 'liam.johnson@example.com', phone: '+4901567891234', address: 'Unter den Linden 45, 10117 Berlin' },
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2023, 
      price: 88000, 
      image: '',
      vin: '7890123Y4567',
      kilometers: 15000,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '06/2023',
      dealership: 'Roma',
      stockDays: 25,
      requestMessage: 'Looking for a pre-owned EQS in good condition.'
    },
    carStatus: 'New',
    requestType: 'Test Drive',
    source: 'Marketing',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Liam Johnson',
    assigneeInitials: 'LJ',
    createdAt: '2025-03-19T13:52:00',
    lastActivity: '2025-03-19T13:52:00',
    nextActionDue: '2 days',
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null
  }
]

export const mockOpportunities = [
  {
    id: 1,
    customer: { id: 4, name: 'Grace Thompson', initials: 'GT', email: 'grace.thompson@example.com', phone: '+4901987654321' },
    vehicle: { 
      brand: 'Audi', 
      model: 'e-tron GT', 
      year: 2024,
      price: 98000,
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 12,
      requestMessage: 'Looking for a new e-tron GT. What are the financing options?'
    },
    stage: 'Open',
    probability: 40,
    value: 98000,
    expectedCloseDate: '2025-04-30',
    assignee: 'Michael Thomas',
    createdAt: '2025-03-10T14:20:00',
    lastActivity: '2025-03-24T09:15:00',
    scheduledAppointment: {
      id: 10,
      title: 'Dealership Visit - Grace Thompson',
      start: '2025-12-28T11:00:00',
      end: '2025-12-28T12:00:00',
      type: 'appointment',
      customer: 'Grace Thompson',
      vehicle: 'Audi e-tron GT',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Firenze',
      team: 'Sales (New)',
      status: 'confirmed'
    }
  },
  {
    id: 2,
    customer: { id: 5, name: 'Oliver Brown', initials: 'OB', email: 'oliver.brown@example.com', phone: '+4901123456789' },
    vehicle: { 
      brand: 'Porsche', 
      model: 'Taycan', 
      year: 2024,
      price: 120000,
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Interested in a Taycan. Do you have any in a specific color?'
    },
    stage: 'Open',
    probability: 50,
    value: 120000,
    expectedCloseDate: '2025-05-15',
    assignee: 'Sarah Jenkins',
    createdAt: '2025-03-01T09:00:00',
    lastActivity: '2025-03-25T11:30:00'
  },
  {
    id: 3,
    customer: { id: 6, name: 'Sophia Martinez', initials: 'SM', email: 'sophia.martinez@example.com', phone: '+4901555666777' },
    vehicle: { 
      brand: 'BMW', 
      model: 'iX', 
      year: 2024,
      price: 105000,
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 15,
      requestMessage: 'Looking for an iX. What are the delivery times?'
    },
    stage: 'Closed',
    probability: 100,
    value: 105000,
    expectedCloseDate: '2025-03-20',
    assignee: 'David Miller',
    createdAt: '2025-02-15T10:00:00',
    lastActivity: '2025-03-20T16:45:00'
  },
  {
    id: 4,
    customer: { id: 7, name: 'Alexander Chen', initials: 'AC', email: 'alexander.chen@example.com', phone: '+4901999888777' },
    vehicle: { 
      brand: 'Tesla', 
      model: 'Model S', 
      year: 2024,
      price: 95000,
      image: 'https://example.com/tesla_model_s.jpg',
      vin: 'TSLA2024MODELS123',
      kilometers: 5000,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '04/2024',
      dealership: 'Milano',
      stockDays: 8,
      requestMessage: 'Interested in purchasing a Model S. What are the available financing options and delivery timeline?',
      fiscalEntity: 'MotorK',
      sourceDetails: 'Website Inquiry'
    },
    stage: 'In Negotiation',
    probability: 65,
    value: 95000,
    expectedCloseDate: '2025-05-01',
    assignee: 'Salsabeel Khaleel',
    source: 'Website',
    createdAt: '2025-03-15T11:00:00',
    lastActivity: '2025-03-26T14:20:00'
  }
]

export const mockContacts = [
  {
    id: 1,
    customerId: 1,
    name: 'Josh Adams',
    initials: 'JA',
    email: 'josh.adams@example.com',
    phone: '+4901564879300',
    address: 'Via Torino 56, 20123 Milan',
    company: 'Tech Solutions GmbH',
    source: 'Marketing',
    tags: ['Premium', 'Automation'],
    createdAt: '2025-03-21T08:17:00',
    lastContact: '2025-03-25T14:30:00'
  },
  {
    id: 2,
    customerId: 2,
    name: 'Emma Watson',
    initials: 'EW',
    email: 'emma.watson@example.com',
    phone: '+4901234567890',
    address: 'Hauptstraße 12, 10115 Berlin',
    company: 'Fashion International',
    source: 'Website',
    tags: [],
    createdAt: '2025-03-20T10:15:00',
    lastContact: '2025-03-24T16:20:00'
  }
]

export const mockVehicles = [
  {
    id: 1,
    brand: 'Volkswagen',
    model: 'ID.4',
    year: 2024,
    vin: '7015733W8749',
    status: 'Available',
    price: 45000,
    kilometers: 0,
    fuelType: 'Electric',
    gearType: 'Automatic',
    dealership: 'Firenze',
    stockDays: 15,
    color: 'Blue',
    requestedBy: ['Josh Adams']
  },
  {
    id: 2,
    brand: 'Mercedes-Benz',
    model: 'EQS',
    year: 2024,
    vin: '8912345X6789',
    status: 'In Stock',
    price: 95000,
    kilometers: 0,
    fuelType: 'Electric',
    gearType: 'Automatic',
    dealership: 'Berlin Mitte',
    stockDays: 42,
    color: 'Black',
    requestedBy: ['Emma Watson']
  },
  {
    id: 3,
    brand: 'Audi',
    model: 'A6 Allroad',
    year: 2023,
    vin: '7015733W8750',
    status: 'In Stock',
    price: 19000,
    kilometers: 102000,
    fuelType: 'Petrol',
    gearType: 'Manual',
    dealership: 'Firenze',
    stockDays: 412,
    color: 'Silver',
    requestedBy: []
  }
]

// Calendar filter options
export const calendarEventTypes = [
  { value: 'test-drive', label: 'Test Drive', category: 'negotiation' },
  { value: 'appointment', label: 'Dealership Visit', category: 'negotiation' },
  { value: 'offsite', label: 'Offsite Visit', category: 'negotiation' },
  { value: 'workshop', label: 'Workshop', category: 'negotiation' },
  { value: 'call', label: 'Call', category: 'negotiation' },
  { value: 'delivery', label: 'Delivery', category: 'negotiation' },
  { value: 'recall', label: 'Recall', category: 'negotiation' },
  { value: 'absence', label: 'Absence', category: 'reminder' },
  { value: 'leave', label: 'Leave', category: 'reminder' },
  { value: 'marketing', label: 'Marketing Event', category: 'reminder' },
  { value: 'memo', label: 'Memo', category: 'reminder' },
  { value: 'training', label: 'Training', category: 'reminder' },
  { value: 'meeting', label: 'Meeting', category: 'negotiation' },
  { value: 'other', label: 'Other', category: 'reminder' }
]

export const calendarDealerships = [
  { id: 1, name: 'Bari' },
  { id: 2, name: 'Firenze' },
  { id: 3, name: 'Milano' },
  { id: 4, name: 'Roma' },
  { id: 5, name: 'Trento' }
]

export const calendarTeams = [
  { id: 1, name: 'BDC' },
  { id: 2, name: 'Call Center' },
  { id: 3, name: 'General' },
  { id: 4, name: 'Service' },
  { id: 5, name: 'Sales (New)' },
  { id: 6, name: 'Sales (Rent)' },
  { id: 7, name: 'Sales (Used)' }
]

export const mockCalendarEvents = [
  {
    id: 1,
    title: 'Test Drive - Josh Adams',
    start: '2025-12-17T10:00:00',
    end: '2025-12-17T11:00:00',
    type: 'test-drive',
    customer: 'Josh Adams',
    customerId: 1,
    vehicle: 'Audi A6 Allroad',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (Used)',
    status: 'confirmed'
  },
  {
    id: 2,
    title: 'Dealership Visit - Emma Watson',
    start: '2025-12-18T14:00:00',
    end: '2025-12-18T15:00:00',
    type: 'appointment',
    customer: 'Emma Watson',
    customerId: 2,
    vehicle: 'Mercedes-Benz EQS',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 3,
    title: 'Follow-up Call - Liam Johnson',
    start: '2025-12-19T09:00:00',
    end: '2025-12-19T09:30:00',
    type: 'call',
    customer: 'Liam Johnson',
    customerId: 3,
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Roma',
    team: 'BDC',
    status: 'confirmed'
  },
  {
    id: 4,
    title: 'Meeting - Oliver Brown',
    start: '2025-12-20T11:00:00',
    end: '2025-12-20T12:00:00',
    type: 'meeting',
    customer: 'Oliver Brown',
    customerId: 5,
    vehicle: 'Porsche Taycan',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 5,
    title: 'Test Drive - Grace Thompson',
    start: '2025-12-21T13:00:00',
    end: '2025-12-21T14:00:00',
    type: 'test-drive',
    customer: 'Grace Thompson',
    customerId: 4,
    vehicle: 'Audi e-tron GT',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 6,
    title: 'Dealership Visit - Sophia Martinez',
    start: '2025-12-22T10:00:00',
    end: '2025-12-22T11:00:00',
    type: 'appointment',
    customer: 'Sophia Martinez',
    customerId: 6,
    vehicle: 'BMW iX',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Roma',
    team: 'Sales (New)',
    status: 'cancelled'
  },
  {
    id: 7,
    title: 'Follow-up Call - Josh Adams',
    start: '2025-12-23T15:00:00',
    end: '2025-12-23T15:30:00',
    type: 'call',
    customer: 'Josh Adams',
    customerId: 1,
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'BDC',
    status: 'no-show'
  },
  {
    id: 8,
    title: 'Test Drive - Emma Watson',
    start: '2025-12-26T09:00:00',
    end: '2025-12-26T10:00:00',
    type: 'test-drive',
    customer: 'Emma Watson',
    customerId: 2,
    vehicle: 'Mercedes-Benz EQS',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 9,
    title: 'Meeting - Oliver Brown',
    start: '2025-12-27T14:00:00',
    end: '2025-12-27T15:30:00',
    type: 'meeting',
    customer: 'Oliver Brown',
    customerId: 5,
    vehicle: 'Porsche Taycan',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 10,
    title: 'Dealership Visit - Grace Thompson',
    start: '2025-12-28T11:00:00',
    end: '2025-12-28T12:00:00',
    type: 'appointment',
    customer: 'Grace Thompson',
    customerId: 4,
    vehicle: 'Audi e-tron GT',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 11,
    title: 'Workshop - Vehicle Inspection',
    start: '2025-12-29T09:00:00',
    end: '2025-12-29T12:00:00',
    type: 'workshop',
    customer: 'Josh Adams',
    customerId: 1,
    vehicle: 'Audi A6 Allroad',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Firenze',
    team: 'Service',
    status: 'confirmed'
  },
  {
    id: 12,
    title: 'Delivery - BMW iX',
    start: '2025-12-30T14:00:00',
    end: '2025-12-30T15:00:00',
    type: 'delivery',
    customer: 'Sophia Martinez',
    customerId: 6,
    vehicle: 'BMW iX',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Roma',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 13,
    title: 'Training - New CRM Features',
    start: '2026-01-02T10:00:00',
    end: '2026-01-02T12:00:00',
    type: 'training',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Milano',
    team: 'General',
    status: 'confirmed'
  },
  {
    id: 14,
    title: 'Marketing Event - New Year Sale Launch',
    start: '2026-01-03T09:00:00',
    end: '2026-01-03T18:00:00',
    type: 'marketing',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'General',
    status: 'confirmed'
  },
  {
    id: 15,
    title: 'Offsite Visit - Liam Johnson',
    start: '2026-01-06T11:00:00',
    end: '2026-01-06T12:30:00',
    type: 'offsite',
    customer: 'Liam Johnson',
    customerId: 3,
    vehicle: 'Mercedes-Benz EQS',
    assignee: 'Natalia Sung',
    assigneeId: 4,
    dealership: 'Bari',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 16,
    title: 'Leave - Winter Vacation',
    start: '2026-01-07T00:00:00',
    end: '2026-01-10T23:59:59',
    type: 'leave',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 17,
    title: 'Call - Follow-up Grace Thompson',
    start: '2026-01-08T10:00:00',
    end: '2026-01-08T10:30:00',
    type: 'call',
    customer: 'Grace Thompson',
    customerId: 4,
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'BDC',
    status: 'confirmed'
  },
  {
    id: 18,
    title: 'Test Drive - Marco Rossi',
    start: '2026-01-09T15:00:00',
    end: '2026-01-09T16:00:00',
    type: 'test-drive',
    customer: 'Marco Rossi',
    vehicle: 'Volkswagen ID.4',
    assignee: 'Natalia Sung',
    assigneeId: 4,
    dealership: 'Trento',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 19,
    title: 'Memo - Q1 Targets Review',
    start: '2026-01-13T09:00:00',
    end: '2026-01-13T09:30:00',
    type: 'memo',
    assignee: 'David Miller',
    assigneeId: 3,
    team: 'General',
    status: 'confirmed'
  },
  {
    id: 20,
    title: 'Recall - Safety Check',
    start: '2026-01-15T08:00:00',
    end: '2026-01-15T17:00:00',
    type: 'recall',
    vehicle: 'Various Models',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Roma',
    team: 'Service',
    status: 'confirmed'
  }
]

export const mockActivities = [
  {
    id: 1,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made an unsuccessful call attempt',
    timestamp: '2025-03-25T08:47:00',
    leadId: 1
  },
  {
    id: 2,
    type: 'note',
    user: 'Natalia Sung',
    action: 'added a note',
    content: 'Customer prefers phone contact in the afternoon.',
    timestamp: '2025-03-24T08:43:00',
    leadId: 1
  },
  {
    id: 3,
    type: 'lead-created',
    user: 'System',
    action: 'Lead was created coming from Summer Sale Campaign',
    timestamp: '2025-03-21T07:22:00',
    leadId: 1
  },
  // Opportunity 1 activities
  {
    id: 4,
    type: 'call',
    user: 'Michael Thomas',
    action: 'made a call',
    content: 'Discussed financing options and delivery timeline. Customer is interested in 48-month financing plan.',
    timestamp: '2025-03-24T09:15:00',
    opportunityId: 1
  },
  {
    id: 5,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer requested detailed information about warranty and service packages.',
    timestamp: '2025-03-22T14:30:00',
    opportunityId: 1
  },
  {
    id: 22,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Follow-up scheduled for next week to discuss final pricing and delivery options.',
    timestamp: '2025-03-23T10:00:00',
    opportunityId: 1
  },
  {
    id: 6,
    type: 'email',
    user: 'Michael Thomas',
    action: 'sent an email',
    content: 'Sent financing options and vehicle specifications.',
    timestamp: '2025-03-20T11:00:00',
    opportunityId: 1
  },
  {
    id: 7,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from lead conversion',
    timestamp: '2025-03-10T14:20:00',
    opportunityId: 1
  },
  // Opportunity 2 activities
  {
    id: 8,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed color preferences. Customer is interested in black or white Taycan.',
    timestamp: '2025-03-25T11:30:00',
    opportunityId: 2
  },
  {
    id: 9,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer is waiting for specific color availability. Follow up in 2 weeks.',
    timestamp: '2025-03-23T16:20:00',
    opportunityId: 2
  },
  {
    id: 23,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer prefers black exterior with beige interior. Checking availability.',
    timestamp: '2025-03-24T09:00:00',
    opportunityId: 2
  },
  {
    id: 10,
    type: 'email',
    user: 'Sarah Jenkins',
    action: 'sent an email',
    content: 'Sent available color options and pricing information.',
    timestamp: '2025-03-15T10:00:00',
    opportunityId: 2
  },
  {
    id: 11,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2025-03-01T09:00:00',
    opportunityId: 2
  },
  // Opportunity 3 activities
  {
    id: 12,
    type: 'delivery',
    user: 'David Miller',
    action: 'completed delivery',
    content: 'Vehicle delivered successfully. Customer satisfied with the purchase.',
    timestamp: '2025-03-20T16:45:00',
    opportunityId: 3
  },
  {
    id: 13,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Final paperwork completed. Payment received in full.',
    timestamp: '2025-03-20T14:00:00',
    opportunityId: 3
  },
  {
    id: 24,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer very satisfied with the purchase process. Potential referral opportunity.',
    timestamp: '2025-03-19T11:00:00',
    opportunityId: 3
  },
  {
    id: 14,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Confirmed delivery date and time. Customer will pick up at dealership.',
    timestamp: '2025-03-18T10:30:00',
    opportunityId: 3
  },
  {
    id: 15,
    type: 'opportunity-won',
    user: 'David Miller',
    action: 'marked opportunity as won',
    timestamp: '2025-03-15T15:00:00',
    opportunityId: 3
  },
  {
    id: 16,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from showroom visit',
    timestamp: '2025-02-15T10:00:00',
    opportunityId: 3
  },
  // Opportunity 4 activities
  {
    id: 17,
    type: 'call',
    user: 'Salsabeel Khaleel',
    action: 'made a call',
    content: 'Discussed financing options and trade-in value. Customer is negotiating final price.',
    timestamp: '2025-03-26T14:20:00',
    opportunityId: 4
  },
  {
    id: 18,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer requested additional discount. Preparing counter-offer.',
    timestamp: '2025-03-25T11:00:00',
    opportunityId: 4
  },
  {
    id: 25,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer interested in extended warranty and maintenance package. Discussing options.',
    timestamp: '2025-03-24T15:30:00',
    opportunityId: 4
  },
  {
    id: 19,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent detailed financing options and vehicle specifications.',
    timestamp: '2025-03-22T09:30:00',
    opportunityId: 4
  },
  {
    id: 20,
    type: 'meeting',
    user: 'Salsabeel Khaleel',
    action: 'scheduled a meeting',
    content: 'Test drive scheduled for next week. Customer will visit dealership.',
    timestamp: '2025-03-20T15:00:00',
    opportunityId: 4
  },
  {
    id: 21,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2025-03-15T11:00:00',
    opportunityId: 4
  }
]

export const pipelineStats = {
  openLeads: 473,
  openOpportunities: 321,
  inNegotiation: 211,
  won: 127,
  lost: 3
}
