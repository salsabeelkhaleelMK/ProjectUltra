// Additional opportunities for showcasing carousel - Customers 1-20
// Defined before mockOpportunities to avoid initialization error
const additionalOpportunitiesForCarousel = [
  // Customer 1 (Josh Adams) - In Negotiation with offers
  {
    id: 30,
    customerId: 1,
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q5', 
      year: 2024, 
      price: 55000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milan',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 10
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 55000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 20)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 2 (Emma Watson) - Qualified
  {
    id: 31,
    customerId: 2,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Polo', 
      year: 2023, 
      price: 22000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Manual',
      kilometers: 10,
      status: 'Used',
      stockDays: 150
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 22000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 45)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 4 (Sophie Mueller) - Closed Won (Purchased)
  {
    id: 32,
    customerId: 4,
    requestedCar: { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2023, 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 10,
      status: 'Used',
      stockDays: 200
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2023, 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 10,
      status: 'Used',
      stockDays: 200
    },
    selectedVehicle: null,
    stage: 'Closed Won',
    tags: ['Premium'],
    value: 85000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString().split('T')[0]
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 60)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 11 (Laura Zimmermann) - In Negotiation
  {
    id: 33,
    customerId: 11,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Touran', 
      year: 2023, 
      price: 35000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 10,
      status: 'Used',
      stockDays: 100
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    tags: ['Urgent'],
    value: 35000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
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
    scheduledAppointment: null
  },
  // Customer 13 (Nina Keller) - Qualified
  {
    id: 34,
    customerId: 13,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A3', 
      year: 2024, 
      price: 38000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Frankfurt',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 5
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: ['VIP'],
    value: 38000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 18 (Dr. Andreas Werner) - Closed Won (Purchased)
  {
    id: 35,
    customerId: 18,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'E-Class', 
      year: 2024, 
      price: 65000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Düsseldorf',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'E-Class', 
      year: 2024, 
      price: 65000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Düsseldorf',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12
    },
    selectedVehicle: null,
    stage: 'Closed Won',
    tags: ['VIP', 'Premium'],
    value: 65000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString().split('T')[0]
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 45)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 20 (Martin Richter) - Closed Won (Purchased)
  {
    id: 36,
    customerId: 20,
    requestedCar: { 
      brand: 'Porsche', 
      model: '911 Carrera', 
      year: 2024, 
      price: 135000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 1
    },
    vehicle: { 
      brand: 'Porsche', 
      model: '911 Carrera', 
      year: 2024, 
      price: 135000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 1
    },
    selectedVehicle: null,
    stage: 'Closed Won',
    tags: ['Performance', 'Hot'],
    value: 135000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString().split('T')[0]
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    scheduledAppointment: null
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
      status: 'New',
      stockDays: 12,
      requestMessage: 'Cerco una nuova e-tron GT. Quali sono le opzioni di finanziamento?'
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
      status: 'New',
      stockDays: 12,
      requestMessage: 'Cerco una nuova e-tron GT. Quali sono le opzioni di finanziamento?'
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Interessato a Taycan. Ne avete in un colore specifico?'
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Interessato a Taycan. Ne avete in un colore specifico?'
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
      status: 'New',
      stockDays: 15,
      requestMessage: 'Cerco una iX. Quali sono i tempi di consegna?'
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
      status: 'New',
      stockDays: 15,
      requestMessage: 'Cerco una iX. Quali sono i tempi di consegna?'
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
      kilometers: 10,
      status: 'Used',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '04/2024',
      dealership: 'Milano',
      stockDays: 8,
      requestMessage: 'Interessato all\'acquisto di una Model S. Quali sono le opzioni di finanziamento disponibili e i tempi di consegna?',
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
      kilometers: 10,
      status: 'Used',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '04/2024',
      dealership: 'Milano',
      stockDays: 8,
      requestMessage: 'Interessato all\'acquisto di una Model S. Quali sono le opzioni di finanziamento disponibili e i tempi di consegna?',
      fiscalEntity: 'MotorK',
      sourceDetails: 'Website Inquiry'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 95000,
    expectedCloseDate: '2025-05-01',
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 20,
      requestMessage: 'Interessato a EQS. Serve più informazioni sulle caratteristiche.'
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
      status: 'New',
      stockDays: 20,
      requestMessage: 'Interessato a EQS. Serve più informazioni sulle caratteristiche.'
    },
    stage: 'Qualified',
    tags: [],
    value: 110000,
    expectedCloseDate: '2025-06-01',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Cerco una ID.4. Quali sono le opzioni disponibili?'
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Cerco una ID.4. Quali sono le opzioni disponibili?'
    },
    stage: 'Qualified',
    tags: [],
    value: 45000,
    expectedCloseDate: '2025-07-01',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 10,
      requestMessage: 'Interessato a BMW i4. Serve dettagli sul finanziamento.'
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
      status: 'New',
      stockDays: 10,
      requestMessage: 'Interessato a BMW i4. Serve dettagli sul finanziamento.'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 65000,
    expectedCloseDate: '2025-04-15',
    assignee: 'David Miller',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 18,
      requestMessage: 'Interessato a Q4 e-tron. Quando posso fare un test drive?'
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
      status: 'New',
      stockDays: 18,
      requestMessage: 'Interessato a Q4 e-tron. Quando posso fare un test drive?'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 55000,
    expectedCloseDate: '2025-05-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 5,
      requestMessage: 'Interessato a Macan Electric. Pronto a procedere.'
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
      status: 'New',
      stockDays: 5,
      requestMessage: 'Interessato a Macan Electric. Pronto a procedere.'
    },
    stage: 'Closed Won',
    tags: ['Premium'],
    value: 85000,
    expectedCloseDate: '2025-01-15',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: '2024-12-01T09:00:00',
    lastActivity: '2024-12-22T16:00:00',
    contractDate: '2024-12-22T16:00:00', // Contract signed date - perfect for CFB
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
      status: 'New',
      stockDays: 14,
      requestMessage: 'Interessato a EQC. Serve informazioni sull\'infrastruttura di ricarica.'
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
      status: 'New',
      stockDays: 14,
      requestMessage: 'Interessato a EQC. Serve informazioni sull\'infrastruttura di ricarica.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 75000,
    expectedCloseDate: '2025-05-10',
    assignee: 'David Miller',
    source: 'Google Ads',
    createdAt: '2024-12-05T10:00:00',
    lastActivity: '2024-12-15T11:00:00', // 10+ days in negotiation (UFB criteria)
    contractDate: null, // No contract date - perfect for UFB (In Negotiation)
    // In Negotiation for 10+ days without contract - perfect for UFB
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Interessato a A6 e-tron. Quando posso programmare un test drive?'
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Interessato a A6 e-tron. Quando posso programmare un test drive?'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 90000,
    expectedCloseDate: '2025-05-05',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Cerco BMW i5. Interessato a test drive.'
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
      status: 'New',
      stockDays: null,
      requestMessage: 'Cerco BMW i5. Interessato a test drive.'
    },
    stage: 'Closed Lost',
    tags: [],
    value: 72000,
    expectedCloseDate: null,
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 7,
      requestMessage: 'Interessato a Audi A4. Appuntamento programmato.'
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
      status: 'New',
      stockDays: 7,
      requestMessage: 'Interessato a Audi A4. Appuntamento programmato.'
    },
    stage: 'Qualified',
    tags: [],
    value: 52000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Salsabeel Khaleel',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 9,
      requestMessage: 'Interessato a C-Class. Offerta inviata di recente.'
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
      status: 'New',
      stockDays: 9,
      requestMessage: 'Interessato a C-Class. Offerta inviata di recente.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 58000,
    expectedCloseDate: '2025-04-15',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interessato a Serie 3. Offerta in attesa di revisione.'
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
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interessato a Serie 3. Offerta in attesa di revisione.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 50000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interessato a Serie 3. Offerta in attesa di revisione.'
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
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interessato a Serie 3. Offerta in attesa di revisione.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 50000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
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
      status: 'New',
      stockDays: 3,
      requestMessage: 'Interessato a 911. Contratto in sospeso.'
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
      status: 'New',
      stockDays: 3,
      requestMessage: 'Interessato a 911. Contratto in sospeso.'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 150000,
    expectedCloseDate: '2025-03-25',
    assignee: 'Salsabeel Khaleel',
    source: 'Google Ads',
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
  // Opportunity for customer 3
  {
    id: 100,
    customerId: 3,
    requestedCar: {
      brand: 'BMW',
      model: 'M4 Coupe',
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 15,
      requestMessage: 'Interessato a coupé sportive per guida nel weekend.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: ['Hot'],
    value: 85000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 6
  {
    id: 102,
    customerId: 6,
    requestedCar: {
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2024,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 8,
      requestMessage: 'Cerco berlina affidabile per spostamenti quotidiani.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 45000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 40)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 6)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 7
  {
    id: 103,
    customerId: 7,
    requestedCar: {
      brand: 'Volkswagen',
      model: 'Tiguan',
      year: 2024,
      price: 38000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 10,
      requestMessage: 'Acquirente familiare cerca SUV spazioso.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 38000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 45)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 8
  {
    id: 104,
    customerId: 8,
    requestedCar: {
      brand: 'Audi',
      model: 'A6',
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Düsseldorf',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 8,
      requestMessage: 'Dirigente cerca berlina premium per uso aziendale.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 65000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 50)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Michael Thomas',
    source: 'Walk-in',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Additional opportunities for showcasing carousel - Customers 1-20
  ...additionalOpportunitiesForCarousel
]

// Tasks are separate entities that can be associated with customers, leads, or opportunities
