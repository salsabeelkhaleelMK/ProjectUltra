// Mock data for CRM application
// This layer can be easily replaced with real API calls

export const mockUsers = [
  { id: 1, name: 'Salsabeel Khaleel', initials: 'SK', role: 'manager', email: 'salsabeel.khaleel@example.com' },
  { id: 2, name: 'Sarah Jenkins', initials: 'SJ', role: 'salesman', email: 'sarah.jenkins@example.com' },
  { id: 3, name: 'David Miller', initials: 'DM', role: 'operator', email: 'david.miller@example.com' },
  { id: 4, name: 'Natalia Sung', initials: 'NS', role: 'operator', email: 'natalia.sung@example.com' }
]

// Customers are the top-level entity - independent contact data
export const mockCustomers = [
  { id: 1, name: 'Josh Adams', initials: 'JA', email: 'josh.adams@example.com', phone: '+4901564879300', address: 'Via Torino 56, 20123 Milan', company: null, source: 'Marketing', tags: ['Premium', 'Automation'], createdAt: '2025-03-21T08:17:00', lastContact: '2025-03-25T14:30:00' },
  { id: 2, name: 'Emma Watson', initials: 'EW', email: 'emma.watson@example.com', phone: '+4901234567890', address: 'Hauptstraße 12, 10115 Berlin', company: null, source: 'Marketing', tags: [], createdAt: '2025-03-20T10:15:00', lastContact: '2025-03-24T16:20:00' },
  { id: 3, name: 'Liam Johnson', initials: 'LJ', email: 'liam.johnson@example.com', phone: '+4901567891234', address: 'Unter den Linden 45, 10117 Berlin', company: null, source: 'Marketing', tags: [], createdAt: '2025-03-19T13:52:00', lastContact: '2025-03-19T13:52:00' },
  { id: 4, name: 'Sophie Mueller', initials: 'SM', email: 'sophie.mueller@example.com', phone: '+4901678912345', address: 'Maximilianstraße 10, 80539 Munich', company: null, source: 'Website', tags: ['Premium'], createdAt: '2025-03-16T10:00:00', lastContact: '2025-03-24T14:00:00' },
  { id: 5, name: 'Marco Rossi', initials: 'MR', email: 'marco.rossi@example.com', phone: '+393401234567', address: 'Via della Repubblica 25, 50123 Florence', company: null, source: 'Referral', tags: [], createdAt: '2025-03-18T09:00:00', lastContact: '2025-03-25T12:00:00' },
  { id: 6, name: 'Klaus Schmidt', initials: 'KS', email: 'klaus.schmidt@example.com', phone: '+4901789123456', address: 'Friedrichstraße 100, 10117 Berlin', company: null, source: 'Marketing', tags: [], createdAt: '2025-03-06T10:00:00', lastContact: '2025-03-23T14:00:00' },
  { id: 7, name: 'Anna Becker', initials: 'AB', email: 'anna.becker@example.com', phone: '+4901890234567', address: 'Reeperbahn 50, 20359 Hamburg', company: null, source: 'Website', tags: [], createdAt: '2025-03-13T10:00:00', lastContact: '2025-03-24T15:00:00' },
  { id: 8, name: 'Thomas Weber', initials: 'TW', email: 'thomas.weber@example.com', phone: '+4901901345678', address: 'Königsallee 60, 40212 Düsseldorf', company: null, source: 'Phone', tags: [], createdAt: '2025-03-01T10:00:00', lastContact: '2025-03-22T10:00:00' },
  { id: 9, name: 'Julia Fischer', initials: 'JF', email: 'julia.fischer@example.com', phone: '+4901912456789', address: 'Ludwigstraße 15, 70173 Stuttgart', company: null, source: 'Website', tags: [], createdAt: '2025-03-19T10:00:00', lastContact: '2025-03-25T09:00:00' },
  { id: 10, name: 'Michael Hoffmann', initials: 'MH', email: 'michael.hoffmann@example.com', phone: '+4901923567890', address: 'Marienplatz 8, 80331 Munich', company: null, source: 'Referral', tags: [], createdAt: '2025-03-14T10:00:00', lastContact: '2025-03-24T16:00:00' },
  { id: 11, name: 'Laura Zimmermann', initials: 'LZ', email: 'laura.zimmermann@example.com', phone: '+4901934678901', address: 'Kurfürstendamm 100, 10709 Berlin', company: null, source: 'Walk-in', tags: ['Urgent'], createdAt: '2025-03-09T10:00:00', lastContact: '2025-03-25T06:00:00' },
  { id: 12, name: 'Stefan Braun', initials: 'SB', email: 'stefan.braun@example.com', phone: '+4901945789012', address: 'Elbchaussee 200, 22605 Hamburg', company: null, source: 'Marketing', tags: [], createdAt: '2025-03-03T10:00:00', lastContact: '2025-03-25T00:00:00' },
  { id: 13, name: 'Nina Keller', initials: 'NK', email: 'nina.keller@example.com', phone: '+4901956890123', address: 'Bahnhofstraße 45, 60329 Frankfurt', company: null, source: 'Referral', tags: ['VIP', 'Urgent'], createdAt: '2025-03-25T06:00:00', lastContact: '2025-03-25T07:00:00' },
  { id: 14, name: 'Oliver Lang', initials: 'OL', email: 'oliver.lang@example.com', phone: '+4901967901234', address: 'Schillerstraße 30, 70173 Stuttgart', company: null, source: 'Website', tags: [], createdAt: '2025-03-25T00:00:00', lastContact: '2025-03-25T04:00:00' },
  { id: 15, name: 'Petra Schulz', initials: 'PS', email: 'petra.schulz@example.com', phone: '+4901978012345', address: 'Alexanderplatz 5, 10178 Berlin', company: null, source: 'Walk-in', tags: ['Hot'], createdAt: '2025-03-20T10:00:00', lastContact: '2025-03-22T10:00:00' },
  { id: 16, name: 'Robert Klein', initials: 'RK', email: 'robert.klein@example.com', phone: '+4901989123456', address: 'Hafenstraße 80, 20359 Hamburg', company: 'Klein GmbH', source: 'Marketing', tags: ['Corporate'], createdAt: '2025-03-19T10:00:00', lastContact: '2025-03-19T10:00:00' },
  { id: 17, name: 'Sabine Vogel', initials: 'SV', email: 'sabine.vogel@example.com', phone: '+4901990234567', address: 'Goethestraße 25, 60313 Frankfurt', company: null, source: 'Phone', tags: [], createdAt: '2025-03-24T10:00:00', lastContact: '2025-03-25T03:00:00' },
  { id: 18, name: 'Dr. Andreas Werner', initials: 'AW', email: 'andreas.werner@example.com', phone: '+4902001345678', address: 'Königsallee 25, 40212 Düsseldorf', company: 'Werner Medical GmbH', source: 'Referral', tags: ['VIP', 'Referral', 'Premium', 'High-Value'], createdAt: '2025-03-25T04:00:00', lastContact: '2025-03-25T06:00:00' },
  { id: 19, name: 'Christina Bauer', initials: 'CB', email: 'christina.bauer@example.com', phone: '+4902012456789', address: 'Leopoldstraße 50, 80802 Munich', company: 'Bauer Consulting AG', source: 'Website', tags: ['Corporate', 'Urgent'], createdAt: '2025-03-23T10:00:00', lastContact: '2025-03-25T07:00:00' },
  { id: 20, name: 'Martin Richter', initials: 'MR', email: 'martin.richter@example.com', phone: '+4902023567890', address: 'Mönckebergstraße 15, 20095 Hamburg', company: null, source: 'Walk-in', tags: ['Performance', 'Hot'], createdAt: '2025-03-21T10:00:00', lastContact: '2025-03-24T10:00:00' },
  { id: 21, name: 'Emma Wilson', initials: 'EW', email: 'emma.wilson@example.com', phone: '+4901987654321', address: 'Via Garibaldi 10, 50123 Firenze', company: null, source: 'Marketing', tags: ['Premium'], createdAt: '2025-03-24T10:00:00', lastContact: '2025-03-24T10:00:00' },
  { id: 22, name: 'Daniel Kim', initials: 'DK', email: 'daniel.kim@example.com', phone: '+4901777888999', address: 'Via Roma 15, 20121 Milano', company: null, source: 'Marketing', tags: [], createdAt: '2024-12-10T09:00:00', lastContact: '2024-12-18T10:00:00' },
  { id: 23, name: 'Robert Taylor', initials: 'RT', email: 'robert.taylor@example.com', phone: '+4901888999000', address: 'Via Garibaldi 20, 50123 Firenze', company: null, source: 'Website', tags: [], createdAt: '2024-12-05T10:00:00', lastContact: '2024-12-15T11:00:00' },
  { id: 24, name: 'Daniel Kim', initials: 'DK', email: 'daniel.kim@example.com', phone: '+4901777888999', address: 'Via Roma 15, 20121 Milano', company: null, source: 'Website', tags: [], createdAt: '2024-12-12T11:00:00', lastContact: '2024-12-18T10:00:00' },
  { id: 25, name: 'Janice Litman', initials: 'JL', email: 'janice.litman@example.com', phone: '+4901888999000', address: 'Alexanderstraße 10, 10178 Berlin', company: null, source: 'Marketing', tags: [], createdAt: '2024-12-08T10:00:00', lastContact: '2024-12-20T14:00:00' },
  { id: 26, name: 'Michael Brown', initials: 'MB', email: 'michael.brown@example.com', phone: '+4901999000111', address: 'Via Dante 5, 20121 Milano', company: null, source: 'Website', tags: [], createdAt: '2024-12-07T10:00:00', lastContact: '2024-12-20T15:00:00' },
  { id: 27, name: 'Sarah Johnson', initials: 'SJ', email: 'sarah.johnson@example.com', phone: '+4901111222333', address: 'Via Manzoni 10, 20121 Milano', company: null, source: 'Marketing', tags: [], createdAt: '2024-12-06T10:00:00', lastContact: '2024-12-20T16:00:00' },
  { id: 28, name: 'Thomas Anderson', initials: 'TA', email: 'thomas.anderson@example.com', phone: '+4901222333444', address: 'Via Verdi 8, 20121 Milano', company: null, source: 'Website', tags: [], createdAt: '2024-12-05T10:00:00', lastContact: '2024-12-20T17:00:00' },
  { id: 29, name: 'Emily Davis', initials: 'ED', email: 'emily.davis@example.com', phone: '+4901999000222', address: 'Via Dante 6, 20121 Milano', company: null, source: 'Marketing', tags: [], createdAt: '2024-12-04T10:00:00', lastContact: '2024-12-20T18:00:00' },
  // Additional customers from opportunities (reassigned IDs to avoid conflicts)
  { id: 30, name: 'Sophia Martinez', initials: 'SM', email: 'sophia.martinez@example.com', phone: '+4901555666777', address: 'Piazza Navona 8, 00186 Roma', company: null, source: 'Marketing', tags: [], createdAt: '2025-03-01T09:00:00', lastContact: '2025-03-25T11:30:00' },
  { id: 31, name: 'Alexander Chen', initials: 'AC', email: 'alexander.chen@example.com', phone: '+4901999888777', address: 'Via Montenapoleone 3, 20121 Milano', company: null, source: 'Website', tags: ['Premium'], createdAt: '2025-03-16T10:00:00', lastContact: '2025-03-16T10:00:00' },
  { id: 32, name: 'Lisa Anderson', initials: 'LA', email: 'lisa.anderson@example.com', phone: '+4901555123456', address: 'Marienplatz 5, 80331 München', company: null, source: 'Website', tags: [], createdAt: '2024-12-20T10:00:00', lastContact: '2024-12-20T10:00:00' },
  { id: 33, name: 'James White', initials: 'JW', email: 'james.white@example.com', phone: '+4901999887766', address: 'Schildergasse 18, 50667 Köln', company: null, source: 'Website', tags: ['Premium'], createdAt: '2024-12-15T11:00:00', lastContact: '2024-12-20T14:00:00' },
  { id: 34, name: 'Maria Garcia', initials: 'MG', email: 'maria.garcia@example.com', phone: '+4901444555666', address: 'Königsallee 70, 40212 Düsseldorf', company: null, source: 'Marketing', tags: [], createdAt: '2024-12-18T10:00:00', lastContact: '2024-12-25T15:00:00' },
  { id: 35, name: 'Jennifer Lee', initials: 'JL', email: 'jennifer.lee@example.com', phone: '+4901888777666', address: 'Zeil 90, 60313 Frankfurt am Main', company: null, source: 'Marketing', tags: ['Automation'], createdAt: '2024-12-10T09:00:00', lastContact: '2024-12-20T14:00:00' },
  { id: 36, name: 'Ross Geller', initials: 'RG', email: 'ross.geller@example.com', phone: '+4901222333444', address: 'Unter den Linden 77, 10117 Berlin', company: null, source: 'Website', tags: [], createdAt: '2024-12-03T10:00:00', lastContact: '2024-12-20T11:00:00' },
  { id: 37, name: 'Rachel Green', initials: 'RG', email: 'rachel.green@example.com', phone: '+4901333444555', address: 'Alexanderplatz 1, 10178 Berlin', company: null, source: 'Marketing', tags: [], createdAt: '2024-12-02T10:00:00', lastContact: '2024-12-20T12:00:00' }
]

export const mockLeads = [
  {
    id: 1,
    customerId: 1,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Audi', 
      model: 'A6 Allroad', 
      year: 2023, 
      price: 19000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
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
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // 1 day ago - fresh lead
      date.setMinutes(date.getMinutes() - 5) // Offset to differentiate
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setMinutes(date.getMinutes() - 5)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2) // 2 days in the future - not overdue
      date.setHours(14, 0, 0, 0)
      return date.toISOString()
    })(),
    tags: ['Premium', 'Automation'],
    stage: 'Open Lead', // Maps to "New"
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [] // Track call attempts: [{ timestamp, outcome, channel, notes, transcription }]
  },
  {
    id: 2,
    customerId: 2,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2024, 
      price: 95000, 
      image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
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
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: '2025-03-20T10:15:00',
    lastActivity: '2025-03-24T16:20:00',
    nextActionDue: '2025-12-19T18:50:00',
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null
  },
  {
    id: 3,
    customerId: 3,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2023, 
      price: 88000, 
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
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
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: '2025-03-19T13:52:00',
    lastActivity: '2025-03-19T13:52:00',
    nextActionDue: '2025-12-21T14:30:00',
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    contactAttempts: []
  },
  // GROUP A: Validated Stage Leads
  {
    id: 4,
    customerId: 4,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX xDrive50', 
      year: 2024, 
      price: 105000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW1234567890',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Munich',
      stockDays: 5,
      requestMessage: 'Interested in BMW iX. Ready for test drive this week.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Website',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      return date.toISOString()
    })(),
    tags: ['Premium'],
    stage: 'Validated',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: {
      id: 101,
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        date.setHours(14, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        date.setHours(15, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'test-drive',
      status: 'confirmed'
    },
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer confirmed interest, validated contact details',
        transcription: null
      }
    ]
  },
  {
    id: 5,
    customerId: 5,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q4 e-tron', 
      year: 2024, 
      price: 55000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'AUDI9876543210',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Firenze',
      stockDays: 12,
      requestMessage: 'Looking for Q4 e-tron information and pricing.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Referral',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Validated',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 2)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Validated lead, customer interested but no appointment scheduled yet',
        transcription: null
      }
    ]
  },
  // GROUP B: Disqualified States
  {
    id: 6,
    customerId: 6,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'ID.4', 
      year: 2023, 
      price: 45000, 
      image: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=900&auto=format&fit=crop&q=60',
      vin: 'VW1234567890',
      kilometers: 8000,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '05/2023',
      dealership: 'Berlin',
      stockDays: 45,
      requestMessage: 'Interested in ID.4 but need to check budget first.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Marketing',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Not Valid',
    isDisqualified: true,
    disqualifyReason: 'Data cleanup',
    disqualifyCategory: 'Not Valid',
    scheduledAppointment: null,
    contactAttempts: []
  },
  {
    id: 7,
    customerId: 7,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'GLC 300', 
      year: 2024, 
      price: 68000, 
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&auto=format&fit=crop&q=60',
      vin: 'MB9876543210',
      kilometers: 0,
      fuelType: 'Hybrid',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Hamburg',
      stockDays: 8,
      requestMessage: 'Looking for GLC but considering other brands too.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Website',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 8)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Not Interested',
    isDisqualified: true,
    disqualifyReason: 'Bought elsewhere',
    disqualifyCategory: 'Not Interested',
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer informed us they purchased from competitor',
        transcription: null
      }
    ]
  },
  {
    id: 8,
    customerId: 8,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Taycan', 
      year: 2024, 
      price: 95000, 
      image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=900&auto=format&fit=crop&q=60',
      vin: 'POR1234567890',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Munich',
      stockDays: 3,
      requestMessage: 'Interested in Taycan specifications.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Phone',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Open Lead',
    isDisqualified: true,
    disqualifyReason: 'Unreachable',
    disqualifyCategory: 'Not Valid',
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 18)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer, left voicemail',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 15)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer again',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 10)
          return date.toISOString()
        })(),
        outcome: 'left-voicemail',
        channel: 'phone',
        notes: 'Left second voicemail',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 6)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Still no response',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 3)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Final attempt - no response, marking as unreachable',
        transcription: null
      }
    ]
  },
  // GROUP C: Contact Attempts Progression
  {
    id: 9,
    customerId: 9,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Audi', 
      model: 'A4 Avant', 
      year: 2024, 
      price: 52000, 
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=900&auto=format&fit=crop&q=60',
      vin: 'AUDI4567890123',
      kilometers: 0,
      fuelType: 'Diesel',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Stuttgart',
      stockDays: 10,
      requestMessage: 'Looking for A4 Avant for family use.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Website',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 3)
          return date.toISOString()
        })(),
        outcome: 'left-voicemail',
        channel: 'phone',
        notes: 'Left voicemail with callback request',
        transcription: null
      }
    ]
  },
  {
    id: 10,
    customerId: 10,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2023, 
      price: 48000, 
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW3456789012',
      kilometers: 12000,
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '06/2023',
      dealership: 'Munich',
      stockDays: 20,
      requestMessage: 'Interested in pre-owned 3 Series.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Referral',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 8)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 6)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer on first attempt',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 4)
          return date.toISOString()
        })(),
        outcome: 'busy',
        channel: 'phone',
        notes: 'Line was busy',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Spoke briefly, customer asked to call back tomorrow',
        transcription: null
      }
    ]
  },
  {
    id: 11,
    customerId: 11,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model Y', 
      year: 2024, 
      price: 62000, 
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&auto=format&fit=crop&q=60',
      vin: 'TESLA567890123',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Berlin',
      stockDays: 2,
      requestMessage: 'Very interested in Model Y, need quick decision.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Walk-in',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 12)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 6)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 2)
      return date.toISOString()
    })(),
    tags: ['Urgent'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 11)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'First attempt - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 9)
          return date.toISOString()
        })(),
        outcome: 'left-voicemail',
        channel: 'phone',
        notes: 'Left voicemail',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Third attempt - still no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 6)
          return date.toISOString()
        })(),
        outcome: 'busy',
        channel: 'phone',
        notes: 'Fourth attempt - line busy. One more attempt before auto-disqualification',
        transcription: null
      }
    ]
  },
  {
    id: 12,
    customerId: 12,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Macan', 
      year: 2023, 
      price: 72000, 
      image: 'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=900&auto=format&fit=crop&q=60',
      vin: 'POR6789012345',
      kilometers: 8500,
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '04/2023',
      dealership: 'Hamburg',
      stockDays: 35,
      requestMessage: 'Looking at used Macan options.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Marketing',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 18)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 12)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 4)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 17)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 14)
          return date.toISOString()
        })(),
        outcome: 'left-voicemail',
        channel: 'phone',
        notes: 'Left voicemail',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 10)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer again',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Fourth attempt - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 12)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Fifth and final attempt - no answer. Ready for auto-disqualification',
        transcription: null
      }
    ]
  },
  // GROUP D: Deadline States
  {
    id: 13,
    customerId: 13,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Audi', 
      model: 'e-tron GT', 
      year: 2024, 
      price: 115000, 
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=900&auto=format&fit=crop&q=60',
      vin: 'AUDI7890123456',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Frankfurt',
      stockDays: 1,
      requestMessage: 'Urgent - need e-tron GT ASAP for business.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Referral',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 1)
      date.setMinutes(date.getMinutes() + 30)
      return date.toISOString()
    })(),
    tags: ['VIP', 'Urgent'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  {
    id: 14,
    customerId: 14,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2024, 
      price: 58000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'MB8901234567',
      kilometers: 0,
      fuelType: 'Hybrid',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Stuttgart',
      stockDays: 15,
      requestMessage: 'Interested in new C-Class hybrid.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Website',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 8)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 6)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  {
    id: 15,
    customerId: 15,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2023, 
      price: 78000, 
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW9012345678',
      kilometers: 18000,
      fuelType: 'Diesel',
      gearType: 'Automatic',
      registration: '05/2023',
      dealership: 'Berlin',
      stockDays: 30,
      requestMessage: 'Need X5 for family - urgent decision needed.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Walk-in',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    tags: ['Hot'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 4)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer very interested, promised to call back',
        transcription: null
      }
    ]
  },
  {
    id: 16,
    customerId: 16,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Passat', 
      year: 2024, 
      price: 42000, 
      image: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=900&auto=format&fit=crop&q=60',
      vin: 'VW0123456789',
      kilometers: 0,
      fuelType: 'Diesel',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Hamburg',
      stockDays: 8,
      requestMessage: 'Looking for reliable company car.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Marketing',
    fiscalEntity: 'Klein GmbH',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 10)
      return date.toISOString()
    })(),
    tags: ['Corporate'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // GROUP E: Edge Cases
  {
    id: 17,
    customerId: 17,
    status: 'Open',
    priority: 'Normal',
    requestedCar: null,
    carStatus: null,
    requestType: 'Generic Sales',
    source: 'Phone',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 5)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer called to inquire about general inventory - no specific car yet',
        transcription: null
      }
    ]
  },
  {
    id: 18,
    customerId: 18,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Porsche', 
      model: '911 Carrera', 
      year: 2024, 
      price: 135000, 
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=60',
      vin: 'POR1357924680',
      kilometers: 0,
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '03/2024',
      dealership: 'Munich',
      stockDays: 1,
      requestMessage: 'VIP customer - interested in 911 Carrera with specific options.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Referral',
    fiscalEntity: 'Werner Medical GmbH',
    sourceDetails: 'Referred by existing customer',
    assignee: 'Salsabeel Khaleel',
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: ['VIP', 'Referral', 'Premium', 'High-Value'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 2)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'VIP customer, very interested. Discussed custom options.',
        transcription: 'Customer expressed strong interest in 911 Carrera with Sport Chrono package and custom interior. Budget not an issue. Looking to purchase within 2 weeks.'
      }
    ]
  },
  {
    id: 19,
    customerId: 19,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model S', 
      year: 2024, 
      price: 98000, 
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&auto=format&fit=crop&q=60',
      vin: 'TESLA246813579',
      kilometers: 0,
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Munich',
      stockDays: 4,
      requestMessage: 'Urgent need for Model S - company car replacement.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Website',
    fiscalEntity: 'Bauer Consulting AG',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(10, 0, 0, 0)
      return date.toISOString()
    })(),
    tags: ['Corporate', 'Urgent'],
    stage: 'Validated',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: {
      id: 102,
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        date.setHours(10, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        date.setHours(11, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'test-drive',
      status: 'confirmed'
    },
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Initial contact - validated lead',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Confirmed appointment for tomorrow',
        transcription: null
      }
    ]
  },
  {
    id: 20,
    customerId: 20,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'BMW', 
      model: 'M4 Competition', 
      year: 2024, 
      price: 92000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW1357924680',
      kilometers: 0,
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Hamburg',
      stockDays: 2,
      requestMessage: 'Very interested in M4 Competition - performance enthusiast.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Walk-in',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 3)
      return date.toISOString()
    })(),
    tags: ['Performance', 'Hot'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 3)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'First contact - customer very enthusiastic',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Follow-up call - still very interested, needs to check schedule',
        transcription: null
      }
    ]
  }
]

export const mockOpportunities = [
  {
    id: 1,
    customerId: 21,
    requestedCar: { 
      brand: 'Audi', 
      model: 'e-tron GT', 
      year: 2024,
      price: 98000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 12,
      requestMessage: 'Looking for a new e-tron GT. What are the financing options?'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'e-tron GT', 
      year: 2024,
      price: 98000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 12,
      requestMessage: 'Looking for a new e-tron GT. What are the financing options?'
    },
    selectedVehicle: null, // Vehicle selected for offer (can differ from requested)
    stage: 'Qualified',
    tags: ['Premium'],
    value: 98000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30) // 30 days in the future
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // 1 day ago - fresh opportunity
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 10,
      title: 'Dealership Visit - Emma Wilson',
      start: (() => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 2) // 2 days ago to trigger action item
        yesterday.setHours(11, 0, 0, 0)
        return yesterday.toISOString()
      })(),
      end: (() => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 2)
        yesterday.setHours(12, 0, 0, 0)
        return yesterday.toISOString()
      })(),
      type: 'appointment',
      customer: 'Emma Wilson',
      vehicle: 'Audi e-tron GT',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Firenze',
      team: 'Sales (New)',
      status: 'confirmed',
      noShowCount: 0
    }
  },
  // REMOVED ID 2 - Duplicate of Qualified stage (ID 1)
  {
    id: 3,
    customerId: 30,
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Taycan', 
      year: 2024,
      price: 120000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Interested in a Taycan. Do you have any in a specific color?'
    },
    vehicle: { 
      brand: 'Porsche', 
      model: 'Taycan', 
      year: 2024,
      price: 120000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Interested in a Taycan. Do you have any in a specific color?'
    },
    stage: 'Qualified',
    tags: [],
    value: 120000,
    expectedCloseDate: '2025-05-15',
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    createdAt: '2025-03-01T09:00:00',
    lastActivity: '2025-03-25T11:30:00',
    scheduledAppointment: {
      id: 20,
      title: 'Meeting - Oliver Brown',
      start: (() => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(14, 0, 0, 0)
        return threeDaysAgo.toISOString()
      })(),
      end: (() => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(15, 30, 0, 0)
        return threeDaysAgo.toISOString()
      })(),
      type: 'appointment',
      customer: 'Oliver Brown',
      vehicle: 'Porsche Taycan',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Milano',
      team: 'Sales (New)',
      status: 'no-show',
      noShowCount: 1,
      nsTaskCreatedAt: (() => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(16, 0, 0, 0)
        return threeDaysAgo.toISOString()
      })()
    }
  },
  {
    id: 2,
    customerId: 30,
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX', 
      year: 2024,
      price: 105000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 15,
      requestMessage: 'Looking for an iX. What are the delivery times?'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'iX', 
      year: 2024,
      price: 105000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 15,
      requestMessage: 'Looking for an iX. What are the delivery times?'
    },
    stage: 'Closed Won',
    tags: ['Automation'],
    value: 105000,
    expectedCloseDate: '2025-03-20',
    assignee: 'David Miller',
    createdAt: '2024-11-15T10:00:00',
    lastActivity: '2024-12-25T16:45:00', // Delivery date - matches delivery activity
    contractDate: '2024-12-20T15:00:00' // Contract signed before delivery - perfect for DFB
  },
  {
    id: 4,
    customerId: 31,
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model S', 
      year: 2024,
      price: 95000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    vehicle: { 
      brand: 'Tesla', 
      model: 'Model S', 
      year: 2024,
      price: 95000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    tags: ['Premium'],
    value: 95000,
    expectedCloseDate: '2025-05-01',
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    source: 'Website',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 9) // 9 days ago
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 9) // 9 days ago - no recent activity (triggers Stuck Opportunity)
      return date.toISOString()
    })(),
    scheduledAppointment: null // No appointment scheduled
  },
  // REMOVED ID 5 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 6 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 7 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage - actually keeping it)
  {
    id: 7,
    customerId: 32,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2024,
      price: 110000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 20,
      requestMessage: 'Interested in EQS. Need more information about features.'
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2024,
      price: 110000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 20,
      requestMessage: 'Interested in EQS. Need more information about features.'
    },
    stage: 'Qualified',
    tags: [],
    value: 110000,
    expectedCloseDate: '2025-06-01',
    assignee: 'Michael Thomas',
    source: 'Website',
    createdAt: '2024-12-20T10:00:00', // 7+ days ago (OOFB criteria)
    lastActivity: '2024-12-20T10:00:00'
    // No offers, no appointment - perfect for OOFB
  },
  // REMOVED ID 6 - Duplicate of Qualified stage (ID 1)
  {
    id: 5,
    customerId: 22,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'ID.4', 
      year: 2024,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1607853203100-69829c08b88e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dm9sa3N3YWdlbnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Looking for an ID.4. What are the available options?'
    },
    vehicle: { 
      brand: 'Volkswagen', 
      model: 'ID.4', 
      year: 2024,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1607853203100-69829c08b88e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dm9sa3N3YWdlbnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Looking for an ID.4. What are the available options?'
    },
    stage: 'Qualified',
    tags: [],
    value: 45000,
    expectedCloseDate: '2025-07-01',
    assignee: 'Sarah Jenkins',
    source: 'Marketing',
    createdAt: '2024-12-10T09:00:00', // 14+ days ago (UFB criteria)
    lastActivity: '2024-12-10T09:00:00'
    // No offers, no appointment - perfect for UFB
  },
  {
    id: 8,
    customerId: 33,
    requestedCar: { 
      brand: 'BMW', 
      model: 'i4', 
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 10,
      requestMessage: 'Interested in BMW i4. Need financing details.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'i4', 
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 10,
      requestMessage: 'Interested in BMW i4. Need financing details.'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 65000,
    expectedCloseDate: '2025-04-15',
    assignee: 'David Miller',
    source: 'Website',
    createdAt: '2024-12-15T11:00:00',
    lastActivity: '2024-12-20T14:00:00' // 5+ days in negotiation (OFB criteria)
    // Has offers (stage is In Negotiation) but no contract - perfect for OFB
  },
  {
    id: 9,
    customerId: 34,
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q4 e-tron', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 18,
      requestMessage: 'Interested in Q4 e-tron. When can I test drive?'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'Q4 e-tron', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 18,
      requestMessage: 'Interested in Q4 e-tron. When can I test drive?'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 55000,
    expectedCloseDate: '2025-05-20',
    assignee: 'Michael Thomas',
    source: 'Marketing',
    createdAt: '2024-12-18T10:00:00',
    lastActivity: '2024-12-25T15:00:00',
    contractDate: null // No contract date - perfect for NFU
    // In Negotiation, no contract date, no appointment - perfect for NFU
  },
  {
    id: 10,
    customerId: 34,
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Macan Electric', 
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 5,
      requestMessage: 'Interested in Macan Electric. Ready to proceed.'
    },
    vehicle: { 
      brand: 'Porsche', 
      model: 'Macan Electric', 
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 5,
      requestMessage: 'Interested in Macan Electric. Ready to proceed.'
    },
    stage: 'Closed Won',
    tags: ['Premium'],
    value: 85000,
    expectedCloseDate: '2025-01-15',
    assignee: 'Sarah Jenkins',
    source: 'Website',
    createdAt: '2024-12-01T09:00:00',
    lastActivity: '2024-12-22T16:00:00',
    contractDate: '2024-12-22T16:00:00' // Contract signed date - perfect for CFB
    // Closed Won (contract signed) but not delivered yet - perfect for CFB
  },
  {
    id: 24,
    customerId: 23,
    requestedCar: {
      brand: 'Mercedes-Benz', 
      model: 'EQC', 
      year: 2024,
      price: 75000,
      image: 'https://images.unsplash.com/photo-1605822102629-918beea85679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 14,
      requestMessage: 'Interested in EQC. Need information about charging infrastructure.'
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'EQC', 
      year: 2024,
      price: 75000,
      image: 'https://images.unsplash.com/photo-1605822102629-918beea85679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 14,
      requestMessage: 'Interested in EQC. Need information about charging infrastructure.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 75000,
    expectedCloseDate: '2025-05-10',
    assignee: 'David Miller',
    source: 'Website',
    createdAt: '2024-12-05T10:00:00',
    lastActivity: '2024-12-15T11:00:00', // 10+ days in negotiation (UFB criteria)
    contractDate: null // No contract date - perfect for UFB (In Negotiation)
    // In Negotiation for 10+ days without contract - perfect for UFB
  },
  {
    id: 27,
    customerId: 35,
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX3', 
      year: 2024,
      price: 68000,
      image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 22,
      requestMessage: 'Interested in iX3. What are the warranty terms?'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'iX3', 
      year: 2024,
      price: 68000,
      image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 22,
      requestMessage: 'Interested in iX3. What are the warranty terms?'
    },
    stage: 'In Negotiation',
    tags: ['Automation'],
    value: 68000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Marketing',
    createdAt: '2024-12-10T09:00:00',
    lastActivity: '2024-12-20T14:00:00',
    contractDate: '2024-12-20T14:00:00' // Has contract date - stage mapper will show "Contract Pending"
    // In Negotiation with contract date - stage mapper calculates to "Contract Pending"
  },
  // REMOVED ID 12 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage)
  // REMOVED ID 13 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 14 - Duplicate of Qualified stage (ID 1)
  // Opportunity 15 (Daniel Kim)
  {
    id: 15,
    customerId: 24,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A6 e-tron', 
      year: 2024,
      price: 90000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Interested in A6 e-tron. When can I schedule a test drive?'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'A6 e-tron', 
      year: 2024,
      price: 90000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Interested in A6 e-tron. When can I schedule a test drive?'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 90000,
    expectedCloseDate: '2025-05-05',
    assignee: 'Sarah Jenkins',
    source: 'Website',
    createdAt: '2024-12-12T11:00:00',
    lastActivity: '2024-12-18T10:00:00',
    contractDate: null, // No contract date
    scheduledAppointment: {
      id: 21,
      title: 'Test Drive - Daniel Kim',
      start: '2026-01-10T14:00:00', // Future appointment
      end: '2026-01-10T15:00:00',
      type: 'appointment',
      customer: 'Daniel Kim',
      vehicle: 'Audi A6 e-tron',
      assignee: 'Sarah Jenkins',
      assigneeId: 2,
      dealership: 'Milano',
      team: 'Sales (New)',
      status: 'confirmed'
    }
    // In Negotiation with future appointment - should NOT show NFU
  },
  // REMOVED ID 13 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 14 - Duplicate of Qualified stage (ID 1)
  {
    id: 16,
    customerId: 36,
    requestedCar: { 
      brand: 'BMW', 
      model: 'i5', 
      year: 2024,
      price: 72000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Looking for BMW i5. Interested in test drive.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'i5', 
      year: 2024,
      price: 72000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: null,
      requestMessage: 'Looking for BMW i5. Interested in test drive.'
    },
    stage: 'Closed Lost',
    tags: [],
    value: 72000,
    expectedCloseDate: null,
    assignee: 'Sarah Jenkins',
    source: 'Marketing',
    createdAt: '2025-02-10T09:00:00',
    lastActivity: '2025-03-01T15:00:00',
    contractDate: null,
    closedReason: 'Customer found better price at competitor',
    closedDate: '2025-03-01T15:00:00'
    // Closed Lost - terminal state, no widgets should appear
  },
  // ========================================
  // STATE MACHINE COVERAGE - All Stage Permutations
  // ========================================
  {
    id: 18,
    customerId: 37,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2024,
      price: 52000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 7,
      requestMessage: 'Interested in Audi A4. Scheduled appointment.'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2024,
      price: 52000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 7,
      requestMessage: 'Interested in Audi A4. Scheduled appointment.'
    },
    stage: 'Qualified',
    tags: [],
    value: 52000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Salsabeel Khaleel',
    source: 'Website',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 23,
      title: 'Appointment - Rachel Green',
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2) // Future appointment
        date.setHours(14, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        date.setHours(15, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'appointment',
      customer: 'Rachel Green',
      vehicle: 'Audi A4',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Firenze',
      team: 'Sales (New)',
      status: 'confirmed',
      noShowCount: 0
    }
    // STAGE: Awaiting Appointment (has future scheduledAppointment)
  },
  // REMOVED ID 20 - Duplicate of Offer Sent stage (keeping ID 8 for this stage)
  // REMOVED ID 21 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage)
  // REMOVED ID 22 - Duplicate of Contract Pending stage (keeping ID 11 for this stage)
  {
    id: 25,
    customerId: 28,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2024,
      price: 58000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 9,
      requestMessage: 'Interested in C-Class. Offer sent recently.'
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2024,
      price: 58000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 9,
      requestMessage: 'Interested in C-Class. Offer sent recently.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 58000,
    expectedCloseDate: '2025-04-15',
    assignee: 'Sarah Jenkins',
    source: 'Website',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // Offer sent 1 day ago (less than 3 days)
      return date.toISOString()
    })()
    // STAGE: In Negotiation (has offer activity less than 3 days old - will be calculated by stageMapper)
  },
  // REMOVED ID 21 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage)
  {
    id: 28,
    customerId: 29,
    requestedCar: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 50000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Marketing',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4) // Offer sent 4 days ago (3+ days)
      return date.toISOString()
    })()
    // STAGE: Awaiting Response (has offer activity 3+ days old - will be calculated by stageMapper)
  },
  {
    id: 22,
    customerId: 26,
    requestedCar: {
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 50000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Marketing',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4) // Offer sent 4 days ago (3+ days)
      return date.toISOString()
    })()
    // STAGE: Awaiting Response (has offer activity 3+ days old - will be calculated by stageMapper)
  },
  // REMOVED ID 22 - Duplicate of Contract Pending stage (keeping ID 11 for this stage)
  {
    id: 23,
    customerId: 27,
    requestedCar: { 
      brand: 'Porsche', 
      model: '911', 
      year: 2024,
      price: 150000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 3,
      requestMessage: 'Interested in 911. Contract pending.'
    },
    vehicle: { 
      brand: 'Porsche', 
      model: '911', 
      year: 2024,
      price: 150000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 3,
      requestMessage: 'Interested in 911. Contract pending.'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 150000,
    expectedCloseDate: '2025-03-25',
    assignee: 'Salsabeel Khaleel',
    source: 'Website',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2) // Contract date set 2 days ago
      return date.toISOString()
    })()
    // STAGE: Contract Pending (has contractDate but stage is In Negotiation - will be calculated by stageMapper)
  },
  {
    id: 26,
    customerId: 25,
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model Y', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 6,
      requestMessage: 'Interested in Model Y. Delivery scheduled.'
    },
    vehicle: { 
      brand: 'Tesla', 
      model: 'Model Y', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      stockDays: 6,
      requestMessage: 'Interested in Model Y. Delivery scheduled.'
    },
    stage: 'Closed Won',
    tags: [],
    value: 55000,
    expectedCloseDate: '2025-03-30',
    assignee: 'David Miller',
    source: 'Website',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    deliveryDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5) // Delivery scheduled for 5 days from now
      return date.toISOString()
    })()
    // STAGE: Closed Won - Awaiting Delivery (has deliveryDate but no delivery activity - substatus will be calculated)
  }
]

// Tasks are separate entities that can be associated with customers, leads, or opportunities
export const mockTasks = [
  {
    id: 1,
    title: 'Follow up on test drive request',
    description: 'Customer requested test drive for Audi A6 Allroad. Schedule appointment.',
    status: 'active',
    priority: 'high',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    customerId: 1,
    leadId: 21,
    opportunityId: null,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 2,
    title: 'Send quotation for Mercedes EQS',
    description: 'Prepare and send detailed quotation for EQS model.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      return date.toISOString()
    })(),
    customerId: 2,
    leadId: 2,
    opportunityId: null,
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5)
      return date.toISOString()
    })()
  },
  {
    id: 3,
    title: 'Review financing options',
    description: 'Customer needs financing information for Audi e-tron GT purchase.',
    status: 'active',
    priority: 'high',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return date.toISOString()
    })(),
    customerId: 21,
    leadId: null,
    opportunityId: 1,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 4,
    title: 'Schedule delivery date',
    description: 'Coordinate delivery date for Porsche Taycan purchase.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toISOString()
    })(),
    customerId: 30,
    leadId: null,
    opportunityId: 3,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })()
  },
  {
    id: 5,
    title: 'Customer contact verification',
    description: 'Verify customer contact details and preferred communication method.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 4)
      return date.toISOString()
    })(),
    customerId: 3,
    leadId: 3,
    opportunityId: null,
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 6,
    title: 'Prepare trade-in evaluation',
    description: 'Customer wants to trade in their current vehicle. Schedule evaluation.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date.toISOString()
    })(),
    customerId: 4,
    leadId: null,
    opportunityId: null,
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })()
  },
  {
    id: 7,
    title: 'Follow up on offer response',
    description: 'Customer received offer for BMW iX. Follow up on their response.',
    status: 'active',
    priority: 'high',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    customerId: 30,
    leadId: null,
    opportunityId: 2,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3)
      return date.toISOString()
    })()
  },
  {
    id: 8,
    title: 'Complete paperwork',
    description: 'Complete all necessary paperwork for Tesla Model S purchase.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 4)
      return date.toISOString()
    })(),
    customerId: 31,
    leadId: null,
    opportunityId: 4,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })()
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
    lastContact: '2025-03-25T14:30:00',
    requestedCar: null
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
    lastContact: '2025-03-24T16:20:00',
    requestedCar: null
  },
  {
    id: 999,
    customerId: 999,
    name: 'Test Contact with Car',
    initials: 'TC',
    email: 'test.contact@example.com',
    phone: '+4901234567999',
    address: 'Test Street 123, 10115 Berlin',
    company: null,
    source: 'Direct',
    tags: ['Test'],
    createdAt: '2025-01-04T10:00:00',
    lastContact: '2025-01-04T10:00:00',
    requestedCar: {
      brand: 'BMW',
      model: '3 Series',
      year: 2024,
      price: 45000,
      requestType: 'Quotation',
      requestMessage: 'Interested in this model for company fleet',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500'
    }
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
    image: 'https://images.unsplash.com/photo-1607853203100-69829c08b88e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dm9sa3N3YWdlbnxlbnwwfHwwfHx8MA%3D%3D',
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
    image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
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
    image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
    kilometers: 102000,
    fuelType: 'Petrol',
    gearType: 'Manual',
    dealership: 'Firenze',
    stockDays: 412,
    color: 'Silver',
    requestedBy: []
  },
  {
    id: 4,
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    vin: 'BMW2024X5001',
    status: 'In Stock',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
    kilometers: 0,
    fuelType: 'Petrol',
    gearType: 'Automatic',
    dealership: 'Milano',
    stockDays: 8,
    color: 'Black',
    requestedBy: []
  },
  {
    id: 5,
    brand: 'BMW',
    model: 'iX',
    year: 2024,
    vin: 'BMW2024IX001',
    status: 'In Stock',
    price: 105000,
    image: 'https://images.unsplash.com/photo-1605822102629-918beea85679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
    kilometers: 0,
    fuelType: 'Electric',
    gearType: 'Automatic',
    dealership: 'Roma',
    stockDays: 15,
    color: 'White',
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
    id: 4,
    title: 'Meeting - Oliver Brown',
    start: '2025-12-20T11:00:00',
    end: '2025-12-20T12:00:00',
    type: 'meeting',
    customer: 'Oliver Brown',
    customerId: 5,
    opportunityId: 2,
    vehicle: 'Porsche Taycan',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  },
  {
    id: 5,
    title: 'Test Drive - Emma Wilson',
    start: '2025-12-21T13:00:00',
    end: '2025-12-21T14:00:00',
    type: 'test-drive',
    customer: 'Emma Wilson',
    customerId: 21,
    opportunityId: 1,
    vehicle: 'Audi e-tron GT',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
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
    status: 'cancelled',
    noShowCount: 0
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
    status: 'no-show',
    noShowCount: 1
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
    status: 'confirmed',
    noShowCount: 0
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
    status: 'confirmed',
    noShowCount: 0
  },
  {
    id: 10,
    title: 'Dealership Visit - Emma Wilson',
    start: '2025-12-28T11:00:00',
    end: '2025-12-28T12:00:00',
    type: 'appointment',
    customer: 'Emma Wilson',
    customerId: 21,
    opportunityId: 1,
    vehicle: 'Audi e-tron GT',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
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
    status: 'confirmed',
    noShowCount: 0
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
    status: 'confirmed',
    noShowCount: 0
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
    title: 'Call - Follow-up Emma Wilson',
    start: '2026-01-08T10:00:00',
    end: '2026-01-08T10:30:00',
    type: 'call',
    customer: 'Emma Wilson',
    customerId: 21,
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
  // Opportunity 3 activities (DFB - Delivery completed, 3+ days ago)
  {
    id: 12,
    type: 'delivery',
    user: 'David Miller',
    action: 'completed delivery',
    content: 'Vehicle delivered successfully. Customer satisfied with the purchase.',
    timestamp: '2024-12-25T16:45:00', // 3+ days ago - perfect for DFB
    opportunityId: 3
  },
  {
    id: 13,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Final paperwork completed. Payment received in full.',
    timestamp: '2024-12-25T14:00:00',
    opportunityId: 3
  },
  {
    id: 24,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer very satisfied with the purchase process. Potential referral opportunity.',
    timestamp: '2024-12-24T11:00:00',
    opportunityId: 3
  },
  {
    id: 14,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Confirmed delivery date and time. Customer will pick up at dealership.',
    timestamp: '2024-12-23T10:30:00',
    opportunityId: 3
  },
  {
    id: 15,
    type: 'opportunity-won',
    user: 'David Miller',
    action: 'marked opportunity as won',
    timestamp: '2024-12-20T15:00:00', // Contract signed date
    opportunityId: 3
  },
  {
    id: 16,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from showroom visit',
    timestamp: '2024-11-15T10:00:00',
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
  },
  // Opportunity 5 activities (OOFB - Open for 7+ days without offers)
  {
    id: 26,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Initial contact made. Customer interested in EQS features.',
    timestamp: '2024-12-20T10:30:00',
    opportunityId: 5
  },
  {
    id: 27,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-20T10:00:00',
    opportunityId: 5
  },
  // Opportunity 6 activities (UFB - Open for 14+ days without offers)
  {
    id: 28,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Initial call. Customer asked about ID.4 availability.',
    timestamp: '2024-12-10T09:30:00',
    opportunityId: 6
  },
  {
    id: 29,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-10T09:00:00',
    opportunityId: 6
  },
  // Opportunity 7 activities (OFB - In Negotiation for 5+ days without contract)
  {
    id: 30,
    type: 'offer',
    user: 'David Miller',
    action: 'created an offer',
    content: 'Initial offer sent for BMW i4',
    timestamp: '2024-12-20T14:00:00',
    opportunityId: 7
  },
  {
    id: 31,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed offer details. Customer reviewing financing options.',
    timestamp: '2024-12-19T11:00:00',
    opportunityId: 7
  },
  {
    id: 32,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-15T11:00:00',
    opportunityId: 7
  },
  // Opportunity 8 activities (NFU - In Negotiation with no contract date)
  {
    id: 33,
    type: 'offer',
    user: 'Michael Thomas',
    action: 'created an offer',
    content: 'Offer sent for Audi Q4 e-tron',
    timestamp: '2024-12-25T15:00:00',
    opportunityId: 8
  },
  {
    id: 34,
    type: 'email',
    user: 'Michael Thomas',
    action: 'sent an email',
    content: 'Sent offer details and specifications.',
    timestamp: '2024-12-24T10:00:00',
    opportunityId: 8
  },
  {
    id: 35,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-18T10:00:00',
    opportunityId: 8
  },
  // Opportunity 9 activities (CFB - Contract signed but not delivered)
  {
    id: 36,
    type: 'opportunity-won',
    user: 'Sarah Jenkins',
    action: 'marked opportunity as won',
    content: 'Contract signed. Vehicle preparation in progress.',
    timestamp: '2024-12-22T16:00:00',
    opportunityId: 9
  },
  {
    id: 37,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Contract finalized. Payment received. Preparing vehicle for delivery.',
    timestamp: '2024-12-22T14:00:00',
    opportunityId: 9
  },
  {
    id: 38,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Final offer accepted for Macan Electric',
    timestamp: '2024-12-20T11:00:00',
    opportunityId: 9
  },
  {
    id: 39,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-01T09:00:00',
    opportunityId: 9
  },
  // Opportunity 16 activities (UFB - In Negotiation for 10+ days without contract)
  {
    id: 40,
    type: 'offer',
    user: 'David Miller',
    action: 'created an offer',
    content: 'Initial offer sent for Mercedes-Benz EQC',
    timestamp: '2024-12-15T11:00:00',
    opportunityId: 16
  },
  {
    id: 41,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed offer details. Customer reviewing terms.',
    timestamp: '2024-12-14T10:00:00',
    opportunityId: 16
  },
  {
    id: 42,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-05T10:00:00',
    opportunityId: 16
  },
  // Opportunity 11 activities (In Negotiation with contract date - no task widgets)
  {
    id: 43,
    type: 'opportunity-won',
    user: 'Michael Thomas',
    action: 'marked opportunity as won',
    content: 'Contract signed. Vehicle preparation in progress.',
    timestamp: '2024-12-20T14:00:00',
    opportunityId: 11
  },
  {
    id: 44,
    type: 'offer',
    user: 'Michael Thomas',
    action: 'created an offer',
    content: 'Final offer accepted for BMW iX3',
    timestamp: '2024-12-18T11:00:00',
    opportunityId: 11
  },
  {
    id: 45,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer satisfied with offer. Contract terms agreed upon.',
    timestamp: '2024-12-19T15:00:00',
    opportunityId: 11
  },
  {
    id: 46,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-10T09:00:00',
    opportunityId: 11
  },
  // Opportunity 12 activities (In Negotiation with future appointment - no NFU)
  {
    id: 47,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Initial offer sent for Audi A6 e-tron',
    timestamp: '2024-12-18T10:00:00',
    opportunityId: 12
  },
  {
    id: 48,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed offer and scheduled test drive for next month.',
    timestamp: '2024-12-17T14:00:00',
    opportunityId: 12
  },
  {
    id: 49,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer interested in test drive. Appointment scheduled.',
    timestamp: '2024-12-16T11:00:00',
    opportunityId: 12
  },
  {
    id: 50,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-12T11:00:00',
    opportunityId: 12
  },
  // Opportunity 13 activities (Open for 14+ days - stale but no task widget)
  {
    id: 51,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Initial contact made. Customer interested in ID.3 features.',
    timestamp: '2024-12-01T08:30:00',
    opportunityId: 13
  },
  {
    id: 52,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-01T08:00:00',
    opportunityId: 13
  },
  // Opportunity 18 activities (Awaiting Appointment - has future appointment)
  {
    id: 53,
    type: 'appointment',
    user: 'Salsabeel Khaleel',
    action: 'scheduled an appointment',
    content: 'Appointment scheduled for Audi A4 test drive',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    opportunityId: 18
  },
  {
    id: 54,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    opportunityId: 18
  },
  // Opportunity 20 activities (Offer Sent - offer less than 3 days old)
  {
    id: 57,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Initial offer sent for Mercedes-Benz C-Class',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // 1 day ago (less than 3 days)
      return date.toISOString()
    })(),
    opportunityId: 20
  },
  {
    id: 58,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    opportunityId: 20
  },
  // Opportunity 21 activities (Awaiting Response - offer 3+ days old)
  {
    id: 59,
    type: 'offer',
    user: 'Michael Thomas',
    action: 'created an offer',
    content: 'Initial offer sent for BMW 3 Series',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4) // 4 days ago (3+ days)
      return date.toISOString()
    })(),
    opportunityId: 21
  },
  {
    id: 60,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer reviewing offer. Waiting for response.',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    opportunityId: 21
  },
  {
    id: 61,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    opportunityId: 21
  },
  // Opportunity 22 activities (Contract Pending - has contractDate)
  {
    id: 62,
    type: 'contract',
    user: 'Salsabeel Khaleel',
    action: 'contract date set',
    content: 'Contract date set for Porsche 911',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    opportunityId: 22
  },
  {
    id: 63,
    type: 'offer',
    user: 'Salsabeel Khaleel',
    action: 'created an offer',
    content: 'Final offer accepted for Porsche 911',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    opportunityId: 22
  },
  {
    id: 64,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    opportunityId: 22
  },
  // Opportunity 23 activities (Closed Won - Awaiting Delivery - has deliveryDate but no delivery activity)
  {
    id: 65,
    type: 'opportunity-won',
    user: 'David Miller',
    action: 'marked opportunity as won',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  {
    id: 66,
    type: 'contract',
    user: 'David Miller',
    action: 'contract signed',
    content: 'Contract signed for Tesla Model Y',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  {
    id: 67,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Delivery scheduled for 5 days from now.',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  {
    id: 68,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  
  // ========== LEAD ACTIVITIES (Leads 2-22) ==========
  
  // Lead 2 (Emma Watson) - Mercedes EQS
  {
    id: 69,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call attempt',
    content: 'No answer. Will try again later.',
    timestamp: '2025-03-26T10:15:00',
    leadId: 2
  },
  {
    id: 70,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer prefers contact after 2 PM. Interested in EQS test drive.',
    timestamp: '2025-03-25T16:30:00',
    leadId: 2
  },
  {
    id: 71,
    type: 'email',
    user: 'Sarah Jenkins',
    action: 'sent an email',
    content: 'Sent detailed EQS specifications and pricing information.',
    timestamp: '2025-03-24T14:00:00',
    leadId: 2
  },
  
  // Lead 3 (Liam Johnson) - Mercedes EQS
  {
    id: 72,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Hi Liam! Our Milano dealership is at Via Roma 45. Open Mon-Sat 9-7. Let me know when you can visit!',
    timestamp: '2025-03-26T09:00:00',
    leadId: 3
  },
  {
    id: 73,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Mercedes-Benz EQS brochure and technical specifications',
    fileName: 'Mercedes_EQS_Brochure_2024.pdf',
    timestamp: '2025-03-25T11:30:00',
    leadId: 3
  },
  {
    id: 74,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer wants electric vehicle with long range. EQS perfect fit.',
    timestamp: '2025-03-24T10:00:00',
    leadId: 3
  },
  
  // Lead 4 (Sophie Mueller) - BMW X5
  {
    id: 75,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Hello Sophie! Thank you for your interest in the BMW X5. Would you like to schedule a test drive this week?',
    timestamp: '2025-03-26T15:00:00',
    leadId: 4
  },
  {
    id: 76,
    type: 'attachment',
    user: 'Natalia Sung',
    action: 'uploaded an attachment',
    content: 'BMW X5 exterior and interior photos',
    fileName: 'BMW_X5_Photos.jpg',
    timestamp: '2025-03-25T14:00:00',
    leadId: 4
  },
  {
    id: 77,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made a call',
    content: 'Spoke with customer. Very interested in X5 M Sport package. Discussed financing options.',
    timestamp: '2025-03-24T11:00:00',
    leadId: 4
  },
  
  // Lead 5 (Marco Rossi) - Volkswagen ID.4
  {
    id: 78,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent comparison between ID.4 and ID.5 models with pricing.',
    timestamp: '2025-03-26T10:00:00',
    leadId: 5
  },
  {
    id: 79,
    type: 'call',
    user: 'Salsabeel Khaleel',
    action: 'made a call',
    content: 'Discussed electric vehicle benefits and charging infrastructure in Florence area.',
    timestamp: '2025-03-25T15:30:00',
    leadId: 5
  },
  {
    id: 80,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer concerned about charging times. Explained fast charging capabilities.',
    timestamp: '2025-03-24T09:00:00',
    leadId: 5
  },
  
  // Lead 6 (Klaus Schmidt) - Porsche 911
  {
    id: 81,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Porsche 911 Carrera configuration options',
    fileName: 'Porsche_911_Configurator.pdf',
    timestamp: '2025-03-26T11:00:00',
    leadId: 6
  },
  {
    id: 82,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Hi Klaus! I have prepared a custom 911 configuration based on your preferences. Check the attachment!',
    timestamp: '2025-03-25T16:00:00',
    leadId: 6
  },
  {
    id: 83,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed 911 customization options. Customer wants Sport Chrono package.',
    timestamp: '2025-03-24T14:30:00',
    leadId: 6
  },
  
  // Lead 7 (Anna Becker) - Tesla Model 3
  {
    id: 84,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Hi Anna! Your Tesla Model 3 test drive is confirmed for Friday at 3 PM. See you then!',
    timestamp: '2025-03-26T12:00:00',
    leadId: 7
  },
  {
    id: 85,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer very enthusiastic about Tesla. Prefers Performance variant.',
    timestamp: '2025-03-25T10:00:00',
    leadId: 7
  },
  {
    id: 86,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent Tesla Model 3 Performance specs and Autopilot features overview.',
    timestamp: '2025-03-24T13:00:00',
    leadId: 7
  },
  
  // Lead 8 (Thomas Weber) - Audi e-tron GT
  {
    id: 87,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made a call',
    content: 'Detailed discussion about e-tron GT performance and luxury features.',
    timestamp: '2025-03-26T14:00:00',
    leadId: 8
  },
  {
    id: 88,
    type: 'attachment',
    user: 'Natalia Sung',
    action: 'uploaded an attachment',
    content: 'Audi e-tron GT RS comparison document',
    fileName: 'Audi_etron_GT_Comparison.pdf',
    timestamp: '2025-03-25T11:00:00',
    leadId: 8
  },
  {
    id: 89,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Thomas, I found a beautiful e-tron GT in Daytona Gray. Would you like to see it?',
    timestamp: '2025-03-24T16:00:00',
    leadId: 8
  },
  
  // Lead 9 (Julia Fischer) - Mercedes-Benz GLE
  {
    id: 74,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer needs 7-seater SUV. GLE perfect match with third row option.',
    timestamp: '2025-03-26T09:30:00',
    leadId: 9
  },
  {
    id: 75,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent GLE 7-seater configuration with family package options.',
    timestamp: '2025-03-25T14:00:00',
    leadId: 9
  },
  {
    id: 76,
    type: 'sms',
    user: 'Salsabeel Khaleel',
    action: 'sent an SMS',
    content: 'Hi Julia! The GLE 450 with 7 seats is available for viewing. When can you visit?',
    timestamp: '2025-03-24T10:30:00',
    leadId: 9
  },
  
  // Lead 10 (Michael Hoffmann) - BMW iX
  {
    id: 77,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call attempt',
    content: 'Left voicemail about BMW iX availability and test drive options.',
    timestamp: '2025-03-26T11:30:00',
    leadId: 10
  },
  {
    id: 78,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'BMW iX sustainability and technology features',
    fileName: 'BMW_iX_Technology_Guide.pdf',
    timestamp: '2025-03-25T09:00:00',
    leadId: 10
  },
  {
    id: 79,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer interested in sustainable mobility. iX perfect for eco-conscious buyers.',
    timestamp: '2025-03-24T15:00:00',
    leadId: 10
  },
  
  // Lead 11 (Laura Zimmermann) - Porsche Cayenne
  {
    id: 80,
    type: 'whatsapp',
    user: 'David Miller',
    action: 'sent a WhatsApp message',
    content: 'Laura, we have a stunning Cayenne S in white arriving next week. Interested in first look?',
    timestamp: '2025-03-26T13:00:00',
    leadId: 11
  },
  {
    id: 81,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed Cayenne variants and performance differences between S and Turbo.',
    timestamp: '2025-03-25T16:30:00',
    leadId: 11
  },
  {
    id: 82,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent Cayenne S vs Turbo comparison with pricing breakdown.',
    timestamp: '2025-03-24T12:00:00',
    leadId: 11
  },
  
  // Lead 12 (Stefan Braun) - Porsche Macan
  {
    id: 83,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Multiple contact attempts. Customer seems busy. Will try different times.',
    timestamp: '2025-03-26T10:00:00',
    leadId: 12
  },
  {
    id: 84,
    type: 'sms',
    user: 'Sarah Jenkins',
    action: 'sent an SMS',
    content: 'Hi Stefan! Still interested in the Porsche Macan? We have great financing offers this month!',
    timestamp: '2025-03-25T14:30:00',
    leadId: 12
  },
  {
    id: 85,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call attempt',
    content: 'No answer. Fifth attempt.',
    timestamp: '2025-03-24T11:00:00',
    leadId: 12
  },
  
  // Lead 13 (Nina Keller) - Audi e-tron GT (Hot/Urgent)
  {
    id: 86,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Urgent inquiry. Customer needs e-tron GT for business event next week.',
    timestamp: '2025-03-26T16:00:00',
    leadId: 13
  },
  {
    id: 87,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Nina, I can arrange immediate viewing today at 5 PM. The e-tron GT is ready!',
    timestamp: '2025-03-26T15:30:00',
    leadId: 13
  },
  {
    id: 88,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Express delivery options and expedited paperwork process',
    fileName: 'Express_Delivery_Process.pdf',
    timestamp: '2025-03-26T15:00:00',
    leadId: 13
  },
  
  // Lead 14 (Oliver Lang) - Mercedes C-Class
  {
    id: 89,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent C-Class hybrid benefits and fuel economy comparison.',
    timestamp: '2025-03-26T10:30:00',
    leadId: 14
  },
  {
    id: 90,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer interested in hybrid technology for daily commute.',
    timestamp: '2025-03-25T13:00:00',
    leadId: 14
  },
  {
    id: 91,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed hybrid system and maintenance costs. Customer satisfied with information.',
    timestamp: '2025-03-24T14:00:00',
    leadId: 14
  },
  
  // Lead 15 (Petra Schulz) - Volkswagen ID.4
  {
    id: 92,
    type: 'sms',
    user: 'Natalia Sung',
    action: 'sent an SMS',
    content: 'Petra, your ID.4 test drive is scheduled for tomorrow at 11 AM. Looking forward to seeing you!',
    timestamp: '2025-03-26T17:00:00',
    leadId: 15
  },
  {
    id: 93,
    type: 'attachment',
    user: 'Natalia Sung',
    action: 'uploaded an attachment',
    content: 'ID.4 charging network map for Berlin area',
    fileName: 'ID4_Charging_Network_Berlin.pdf',
    timestamp: '2025-03-25T10:00:00',
    leadId: 15
  },
  {
    id: 94,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Hi Petra! I found a great ID.4 in your preferred color - Moonstone Gray. Want to see photos?',
    timestamp: '2025-03-24T16:30:00',
    leadId: 15
  },
  
  // Lead 16 (Robert Klein) - BMW M4
  {
    id: 95,
    type: 'call',
    user: 'Salsabeel Khaleel',
    action: 'made a call',
    content: 'Discussed M4 Competition performance specs and track capabilities.',
    timestamp: '2025-03-26T14:30:00',
    leadId: 16
  },
  {
    id: 96,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Performance enthusiast. Interested in M4 Competition with M xDrive.',
    timestamp: '2025-03-25T11:30:00',
    leadId: 16
  },
  {
    id: 97,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent M4 Competition performance data and track mode features.',
    timestamp: '2025-03-24T09:30:00',
    leadId: 16
  },
  
  // Lead 17 (Sabine Vogel) - Audi Q5
  {
    id: 98,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Sabine, the Q5 45 TFSI you asked about is available. Can you visit this week?',
    timestamp: '2025-03-26T12:30:00',
    leadId: 17
  },
  {
    id: 99,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Audi Q5 interior photos and equipment list',
    fileName: 'Audi_Q5_Interior_Photos.jpg',
    timestamp: '2025-03-25T15:00:00',
    leadId: 17
  },
  {
    id: 100,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Spoke about Q5 comfort features and advanced driver assistance systems.',
    timestamp: '2025-03-24T13:30:00',
    leadId: 17
  },
  
  // Lead 18 (Dr. Andreas Werner) - Porsche Taycan
  {
    id: 101,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent Taycan Turbo S specifications and performance comparison with Tesla.',
    timestamp: '2025-03-26T09:00:00',
    leadId: 18
  },
  {
    id: 102,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'High-value customer. Interested in Taycan Turbo S for luxury electric performance.',
    timestamp: '2025-03-25T14:00:00',
    leadId: 18
  },
  {
    id: 103,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Porsche Taycan exclusive color options catalog',
    fileName: 'Taycan_Exclusive_Colors.pdf',
    timestamp: '2025-03-24T10:00:00',
    leadId: 18
  },
  
  // Lead 19 (Christina Bauer) - BMW X3
  {
    id: 104,
    type: 'sms',
    user: 'Natalia Sung',
    action: 'sent an SMS',
    content: 'Christina, we have a special offer on X3 xDrive30i this week. Save up to €5,000!',
    timestamp: '2025-03-26T11:00:00',
    leadId: 19
  },
  {
    id: 105,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made a call',
    content: 'Discussed X3 family features and cargo space. Customer has two children.',
    timestamp: '2025-03-25T16:00:00',
    leadId: 19
  },
  {
    id: 106,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Hi Christina! I can arrange a family test drive with car seats installed. Let me know!',
    timestamp: '2025-03-24T12:00:00',
    leadId: 19
  },
  
  // Lead 20 (Martin Richter) - BMW M4 Competition (Hot)
  {
    id: 107,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Customer very enthusiastic. Wants M4 Competition in Isle of Man Green.',
    timestamp: '2025-03-26T15:00:00',
    leadId: 20
  },
  {
    id: 108,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'M4 Competition in Isle of Man Green - exclusive photos',
    fileName: 'M4_Isle_of_Man_Green.jpg',
    timestamp: '2025-03-26T14:30:00',
    leadId: 20
  },
  {
    id: 109,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Performance enthusiast with track experience. Ready to proceed quickly.',
    timestamp: '2025-03-26T14:00:00',
    leadId: 20
  },
  
  // ========== OPPORTUNITY ACTIVITIES - MISSING TYPES ==========
  
  // Opportunity 1 activities removed - empty for demo
  
  // Opportunity 2 (Oliver Brown) - Add financing and SMS
  {
    id: 113,
    type: 'financing',
    user: 'Salsabeel Khaleel',
    action: 'submitted financing request',
    content: 'Financing approved: 60-month term at 3.5% APR',
    data: {
      term: 60,
      apr: 3.5,
      amount: 120000,
      downPayment: 30000,
      monthlyPayment: 1635,
      status: 'approved'
    },
    timestamp: '2025-03-24T14:00:00',
    opportunityId: 2
  },
  {
    id: 114,
    type: 'sms',
    user: 'Salsabeel Khaleel',
    action: 'sent an SMS',
    content: 'Oliver, your financing is approved! Ready to finalize the Taycan purchase.',
    timestamp: '2025-03-24T15:00:00',
    opportunityId: 2
  },
  {
    id: 115,
    type: 'attachment',
    user: 'Salsabeel Khaleel',
    action: 'uploaded an attachment',
    content: 'Financing approval letter and payment schedule',
    fileName: 'Financing_Approval_Oliver_Brown.pdf',
    timestamp: '2025-03-24T14:30:00',
    opportunityId: 2
  },
  
  // Opportunity 3 (Sophia Martinez) - Add WhatsApp and attachment
  {
    id: 116,
    type: 'whatsapp',
    user: 'David Miller',
    action: 'sent a WhatsApp message',
    content: 'Sophia, your BMW iX was delivered! Hope you love it. Let me know if you need anything!',
    timestamp: '2024-12-26T09:00:00',
    opportunityId: 3
  },
  {
    id: 117,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Delivery receipt and vehicle handover checklist',
    fileName: 'Delivery_Receipt_Sophia_Martinez.pdf',
    timestamp: '2024-12-25T17:00:00',
    opportunityId: 3
  },
  {
    id: 118,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Delivery confirmed for tomorrow at 4 PM. All paperwork ready!',
    timestamp: '2024-12-24T16:00:00',
    opportunityId: 3
  },
  
  // Opportunity 4 (Alexander Chen) - Add trade-in and financing
  {
    id: 119,
    type: 'tradein',
    user: 'Salsabeel Khaleel',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2019 Tesla Model S, valued at €45,000',
    data: {
      make: 'Tesla',
      model: 'Model S',
      year: 2019,
      mileage: 38000,
      condition: 'Very Good',
      value: 45000
    },
    timestamp: '2025-03-25T10:00:00',
    opportunityId: 4
  },
  {
    id: 120,
    type: 'financing',
    user: 'Salsabeel Khaleel',
    action: 'submitted financing request',
    content: 'Financing request: 48-month term at 3.9% APR',
    data: {
      term: 48,
      apr: 3.9,
      amount: 50000,
      downPayment: 45000,
      monthlyPayment: 1130,
      status: 'pending'
    },
    timestamp: '2025-03-25T11:00:00',
    opportunityId: 4
  },
  {
    id: 121,
    type: 'attachment',
    user: 'Salsabeel Khaleel',
    action: 'uploaded an attachment',
    content: 'Trade-in valuation report and inspection photos',
    fileName: 'TradeIn_Valuation_Tesla_ModelS.pdf',
    timestamp: '2025-03-25T09:30:00',
    opportunityId: 4
  },
  
  // Opportunity 5 (Emma Wilson) - Add attachment and SMS
  {
    id: 122,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'Insurance documents and registration papers',
    fileName: 'Insurance_Registration_Emma_Wilson.pdf',
    timestamp: '2025-03-24T13:00:00',
    opportunityId: 5
  },
  {
    id: 123,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Emma, reminder: Your Mercedes EQE delivery is scheduled for Friday at 10 AM!',
    timestamp: '2025-03-23T15:00:00',
    opportunityId: 5
  },
  {
    id: 124,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'All documents are ready! Looking forward to handing over your new EQE.',
    timestamp: '2025-03-22T11:00:00',
    opportunityId: 5
  },
  
  // Opportunity 6 (Robert Taylor) - Full activity history
  {
    id: 125,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed BMW X7 features and luxury options.',
    timestamp: '2025-03-26T10:00:00',
    opportunityId: 6
  },
  {
    id: 126,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer wants X7 M60i with Executive Drive Pro package.',
    timestamp: '2025-03-25T14:00:00',
    opportunityId: 6
  },
  {
    id: 127,
    type: 'email',
    user: 'Sarah Jenkins',
    action: 'sent an email',
    content: 'Sent X7 M60i configuration with all requested options.',
    timestamp: '2025-03-24T11:00:00',
    opportunityId: 6
  },
  {
    id: 128,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'BMW X7 M60i detailed specification sheet',
    fileName: 'BMW_X7_M60i_Specs.pdf',
    timestamp: '2025-03-23T15:00:00',
    opportunityId: 6
  },
  {
    id: 129,
    type: 'tradein',
    user: 'Sarah Jenkins',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2021 BMW X5, valued at €55,000',
    data: {
      make: 'BMW',
      model: 'X5',
      year: 2021,
      mileage: 28000,
      condition: 'Excellent',
      value: 55000
    },
    timestamp: '2025-03-22T10:00:00',
    opportunityId: 6
  },
  {
    id: 130,
    type: 'financing',
    user: 'Sarah Jenkins',
    action: 'submitted financing request',
    content: 'Financing approved: 36-month term at 2.9% APR',
    data: {
      term: 36,
      apr: 2.9,
      amount: 65000,
      downPayment: 55000,
      monthlyPayment: 1890,
      status: 'approved'
    },
    timestamp: '2025-03-21T14:00:00',
    opportunityId: 6
  },
  {
    id: 131,
    type: 'sms',
    user: 'Sarah Jenkins',
    action: 'sent an SMS',
    content: 'Robert, great news! Your financing is approved. Ready to order your X7!',
    timestamp: '2025-03-21T15:00:00',
    opportunityId: 6
  },
  {
    id: 132,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'I found the perfect X7 in Tanzanite Blue. Want to see photos?',
    timestamp: '2025-03-20T12:00:00',
    opportunityId: 6
  },
  
  // Opportunity 7 (Lisa Anderson) - Add missing types
  {
    id: 133,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'Audi Q8 e-tron brochure and pricing',
    fileName: 'Audi_Q8_etron_Brochure.pdf',
    timestamp: '2025-03-24T10:00:00',
    opportunityId: 7
  },
  {
    id: 134,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Lisa, your Q8 e-tron test drive is confirmed for Saturday at 11 AM!',
    timestamp: '2025-03-23T16:00:00',
    opportunityId: 7
  },
  {
    id: 135,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'The Q8 e-tron you liked is still available. Let me know if you want to proceed!',
    timestamp: '2025-03-22T14:00:00',
    opportunityId: 7
  },
  
  // Opportunity 8 (James White) - Add missing types
  {
    id: 136,
    type: 'financing',
    user: 'Michael Thomas',
    action: 'submitted financing request',
    content: 'Financing pending: 48-month term at 4.2% APR',
    data: {
      term: 48,
      apr: 4.2,
      amount: 78000,
      downPayment: 15000,
      monthlyPayment: 1445,
      status: 'pending'
    },
    timestamp: '2024-12-24T11:00:00',
    opportunityId: 8
  },
  {
    id: 137,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'Audi Q4 e-tron financing options comparison',
    fileName: 'Q4_Financing_Options.pdf',
    timestamp: '2024-12-23T15:00:00',
    opportunityId: 8
  },
  {
    id: 138,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'James, I submitted your financing application. Should hear back in 24-48 hours.',
    timestamp: '2024-12-24T12:00:00',
    opportunityId: 8
  },
  
  // Opportunity 9 (Maria Garcia) - Add missing types
  {
    id: 139,
    type: 'tradein',
    user: 'Sarah Jenkins',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2018 Porsche Cayenne, valued at €48,000',
    data: {
      make: 'Porsche',
      model: 'Cayenne',
      year: 2018,
      mileage: 52000,
      condition: 'Good',
      value: 48000
    },
    timestamp: '2024-12-21T10:00:00',
    opportunityId: 9
  },
  {
    id: 140,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Final contract and delivery schedule',
    fileName: 'Contract_Maria_Garcia.pdf',
    timestamp: '2024-12-22T15:00:00',
    opportunityId: 9
  },
  {
    id: 141,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Maria, your Macan Electric is being prepared for delivery. So exciting!',
    timestamp: '2024-12-21T14:00:00',
    opportunityId: 9
  },
  
  // Opportunity 11 (Jennifer Lee) - Add missing types
  {
    id: 142,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'BMW iX3 warranty and service package details',
    fileName: 'BMW_iX3_Warranty.pdf',
    timestamp: '2024-12-19T11:00:00',
    opportunityId: 11
  },
  {
    id: 143,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Jennifer, your iX3 contract is ready for signature. Can you come by this week?',
    timestamp: '2024-12-18T15:00:00',
    opportunityId: 11
  },
  {
    id: 144,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'Great news! We secured the iX3 in your preferred Sophisto Gray color!',
    timestamp: '2024-12-17T10:00:00',
    opportunityId: 11
  },
  
  // Opportunity 12 (Daniel Kim) - Add missing types
  {
    id: 145,
    type: 'tradein',
    user: 'Sarah Jenkins',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2020 Audi A4, valued at €28,000',
    data: {
      make: 'Audi',
      model: 'A4',
      year: 2020,
      mileage: 42000,
      condition: 'Very Good',
      value: 28000
    },
    timestamp: '2024-12-17T14:00:00',
    opportunityId: 12
  },
  {
    id: 146,
    type: 'financing',
    user: 'Sarah Jenkins',
    action: 'submitted financing request',
    content: 'Financing approved: 60-month term at 3.8% APR',
    data: {
      term: 60,
      apr: 3.8,
      amount: 62000,
      downPayment: 28000,
      monthlyPayment: 1140,
      status: 'approved'
    },
    timestamp: '2024-12-17T15:00:00',
    opportunityId: 12
  },
  {
    id: 147,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'A6 e-tron configuration and financing summary',
    fileName: 'A6_etron_Config_Daniel_Kim.pdf',
    timestamp: '2024-12-16T13:00:00',
    opportunityId: 12
  },
  
  // Opportunity 13 (Rachel Green) - Add missing types
  {
    id: 148,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'VW ID.3 charging guide and home charger installation info',
    fileName: 'ID3_Charging_Guide.pdf',
    timestamp: '2024-12-01T09:00:00',
    opportunityId: 13
  },
  {
    id: 149,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Rachel, the ID.3 is available for test drive. When would you like to visit?',
    timestamp: '2024-12-01T10:00:00',
    opportunityId: 13
  },
  
  // Opportunity 14 (Monica Geller) - Communication-focused
  {
    id: 150,
    type: 'call',
    user: 'Michael Thomas',
    action: 'made a call',
    content: 'Discussed Tesla Model 3 features and Autopilot capabilities.',
    timestamp: '2025-03-16T10:00:00',
    opportunityId: 14
  },
  {
    id: 151,
    type: 'email',
    user: 'Michael Thomas',
    action: 'sent an email',
    content: 'Sent Model 3 comparison with other electric sedans.',
    timestamp: '2025-03-15T15:00:00',
    opportunityId: 14
  },
  {
    id: 152,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'Monica, the Model 3 you test drove is still available. Ready to move forward?',
    timestamp: '2025-03-14T11:00:00',
    opportunityId: 14
  },
  {
    id: 153,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Following up on your Model 3 interest. Let me know if you have questions!',
    timestamp: '2025-03-13T14:00:00',
    opportunityId: 14
  },
  {
    id: 154,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer loved the test drive. Considering white vs blue exterior.',
    timestamp: '2025-03-12T16:00:00',
    opportunityId: 14
  },
  
  // Opportunity 15 (Ross Geller) - Document-focused
  {
    id: 155,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Mercedes-Benz GLC detailed specifications',
    fileName: 'Mercedes_GLC_Specs.pdf',
    timestamp: '2025-03-20T10:00:00',
    opportunityId: 15
  },
  {
    id: 156,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'GLC financing options and payment calculator',
    fileName: 'GLC_Financing_Calculator.pdf',
    timestamp: '2025-03-19T14:00:00',
    opportunityId: 15
  },
  {
    id: 157,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'GLC warranty and maintenance package details',
    fileName: 'GLC_Warranty_Package.pdf',
    timestamp: '2025-03-18T11:00:00',
    opportunityId: 15
  },
  {
    id: 158,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer requested all documentation before making decision.',
    timestamp: '2025-03-17T15:00:00',
    opportunityId: 15
  },
  {
    id: 159,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent comprehensive GLC information package as requested.',
    timestamp: '2025-03-17T16:00:00',
    opportunityId: 15
  },
  
  // Opportunity 16 (Thomas Anderson - formerly duplicate 10) - Add missing types
  {
    id: 160,
    type: 'financing',
    user: 'David Miller',
    action: 'submitted financing request',
    content: 'Financing pending: 48-month term at 4.5% APR',
    data: {
      term: 48,
      apr: 4.5,
      amount: 75000,
      downPayment: 0,
      monthlyPayment: 1715,
      status: 'pending'
    },
    timestamp: '2024-12-14T11:00:00',
    opportunityId: 16
  },
  {
    id: 161,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Mercedes EQC charging infrastructure guide',
    fileName: 'EQC_Charging_Guide.pdf',
    timestamp: '2024-12-13T15:00:00',
    opportunityId: 16
  },
  {
    id: 162,
    type: 'whatsapp',
    user: 'David Miller',
    action: 'sent a WhatsApp message',
    content: 'Thomas, I submitted your financing application. Fingers crossed!',
    timestamp: '2024-12-14T12:00:00',
    opportunityId: 16
  },
  
  // Purchase activities (for closed/won opportunities)
  {
    id: 163,
    type: 'purchase',
    user: 'David Miller',
    action: 'completed a purchase',
    data: {
      brand: 'Mercedes-Benz',
      model: 'GLE 450',
      year: 2024,
      price: 78500,
      purchaseDate: '2025-12-18',
      notes: 'Full payment received. Customer opted for premium package with panoramic sunroof.'
    },
    timestamp: '2025-12-18T16:30:00',
    opportunityId: 3
  },
  {
    id: 164,
    type: 'purchase',
    user: 'Sarah Jenkins',
    action: 'completed a purchase',
    data: {
      brand: 'Audi',
      model: 'e-tron GT',
      year: 2024,
      price: 125000,
      purchaseDate: '2025-12-20',
      notes: 'Customer very satisfied with final negotiations. Trade-in processed successfully.'
    },
    timestamp: '2025-12-20T14:00:00',
    opportunityId: 9
  },
  {
    id: 165,
    type: 'purchase',
    user: 'Michael Thomas',
    action: 'completed a purchase',
    data: {
      brand: 'BMW',
      model: 'iX xDrive50',
      year: 2024,
      price: 89900,
      purchaseDate: '2025-12-22',
      notes: 'Contract finalized. Customer selected midnight blue metallic paint.'
    },
    timestamp: '2025-12-22T11:15:00',
    opportunityId: 11
  },
]

// Dashboard Mock Data
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
