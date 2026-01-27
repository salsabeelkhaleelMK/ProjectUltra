export const mockOpportunities = [
  // 1. Opportunity - Awaiting Appointment (Qualified, no scheduled appointment)
  {
    id: 100,
    customerId: 1,
    requestedCar: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024, 
      price: 45000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 5
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    negotiationSubstatus: null,
    offers: [],
    tags: ['Hot'],
    value: 45000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Salsabeel Khaleel',
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
    scheduledAppointment: null
  },

  // 2. Opportunity - Appointment Scheduled (has appointment, no shows yet)
  {
    id: 1,
    customerId: 2,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2024, 
      price: 42000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Diesel',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 8
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    negotiationSubstatus: null,
    offers: [],
    tags: [],
    value: 42000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 25)
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
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 10,
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
      type: 'Test Drive',
      assignee: 'Sarah Jenkins',
      customerId: 2,
      opportunityId: 1,
      duration: 60,
      status: 'confirmed',
      noShowCount: 0,
      lastNoShowDate: null
    }
  },

  // 3. Opportunity - 1st No Show
  {
    id: 3,
    customerId: 3,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2023, 
      price: 48000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&auto=format&fit=crop&q=60',
      dealership: 'Stuttgart',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 5000,
      status: 'Used',
      stockDays: 20
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    negotiationSubstatus: null,
    offers: [],
    tags: ['Premium'],
    value: 48000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 20)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 20,
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        date.setHours(10, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        date.setHours(11, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'Consultation',
      assignee: 'David Miller',
      customerId: 3,
      opportunityId: 3,
      duration: 60,
      status: 'confirmed',
      noShowCount: 1,
      lastNoShowDate: (() => {
        const date = new Date()
        date.setDate(date.getDate() - 5)
        return date.toISOString()
      })()
    }
  },

  // 4. Opportunity - 2nd No Show
  {
    id: 101,
    customerId: 4,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Golf', 
      year: 2024, 
      price: 28000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Manual',
      kilometers: 0,
      status: 'New',
      stockDays: 15
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    negotiationSubstatus: null,
    offers: [],
    tags: [],
    value: 28000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 15)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 24,
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        date.setHours(16, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        date.setHours(17, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'Test Drive',
      assignee: 'Sarah Jenkins',
      customerId: 4,
      opportunityId: 101,
      duration: 60,
      status: 'confirmed',
      noShowCount: 2,
      lastNoShowDate: (() => {
        const date = new Date()
        date.setDate(date.getDate() - 6)
        return date.toISOString()
      })()
    }
  },

  // 5. Opportunity - Closed Lost
  {
    id: 16,
    customerId: 5,
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Cayenne', 
      year: 2024, 
      price: 95000,
      image: 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=900&auto=format&fit=crop&q=60',
      dealership: 'Frankfurt',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 30
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Closed Lost',
    negotiationSubstatus: null,
    offers: [],
    tags: ['Premium'],
    value: 95000,
    lostReason: 'Went with competitor',
    expectedCloseDate: null,
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    closedDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })()
  },

  // 6. Opportunity - In Negotiation - Offer Sent (offer less than 3 days old)
  {
    id: 30,
    customerId: 6,
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q5', 
      year: 2024, 
      price: 55000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60',
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
    negotiationSubstatus: 'Offer Sent',
    offers: [
      {
        id: 'offer-1',
        createdAt: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        vehicleBrand: 'Audi',
        vehicleModel: 'Q5',
        vehicleYear: 2024,
        price: 55000,
        status: 'active',
        data: {
          brand: 'Audi',
          model: 'Q5',
          year: 2024,
          price: 55000,
          financingType: 'financing',
          image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60'
        }
      }
    ],
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

  // 7. Opportunity - In Negotiation - Offer Feedback (offer 3+ days old, no appointment)
  {
    id: 33,
    customerId: 7,
    requestedCar: { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2024, 
      price: 75000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Diesel',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    negotiationSubstatus: 'Offer Feedback',
    offers: [
      {
        id: 'offer-2',
        createdAt: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 4)
          return date.toISOString()
        })(),
        vehicleBrand: 'BMW',
        vehicleModel: 'X5',
        vehicleYear: 2024,
        price: 75000,
        status: 'active',
        data: {
          brand: 'BMW',
          model: 'X5',
          year: 2024,
          price: 75000,
          financingType: 'cash',
          image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60'
        }
      }
    ],
    tags: ['Premium'],
    value: 75000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 15)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 12)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },

  // 8. Opportunity - In Negotiation - Contract Pending (offer accepted, contract date set)
  {
    id: 27,
    customerId: 8,
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX3', 
      year: 2024, 
      price: 68000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 5
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    negotiationSubstatus: 'Offer Accepted',
    offers: [
      {
        id: 'offer-3',
        createdAt: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 8)
          return date.toISOString()
        })(),
        vehicleBrand: 'BMW',
        vehicleModel: 'iX3',
        vehicleYear: 2024,
        price: 68000,
        status: 'accepted',
        data: {
          brand: 'BMW',
          model: 'iX3',
          year: 2024,
          price: 68000,
          financingType: 'financing',
          image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60'
        }
      }
    ],
    tags: ['Premium', 'Electric'],
    value: 68000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 10)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },

  // 9. Opportunity - In Negotiation - Contract Pending - Awaiting Contract Feedback (contract date 7+ days ago)
  {
    id: 22,
    customerId: 9,
    requestedCar: { 
      brand: 'Porsche', 
      model: '911', 
      year: 2024, 
      price: 125000,
      image: 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=900&auto=format&fit=crop&q=60',
      dealership: 'Frankfurt',
      fuelType: 'Petrol',
      gearType: 'Manual',
      kilometers: 0,
      status: 'New',
      stockDays: 8
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    negotiationSubstatus: 'Offer Accepted',
    offers: [
      {
        id: 'offer-4',
        createdAt: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 20)
          return date.toISOString()
        })(),
        vehicleBrand: 'Porsche',
        vehicleModel: '911',
        vehicleYear: 2024,
        price: 125000,
        status: 'accepted',
        data: {
          brand: 'Porsche',
          model: '911',
          year: 2024,
          price: 125000,
          financingType: 'cash',
          image: 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=900&auto=format&fit=crop&q=60'
        }
      }
    ],
    tags: ['Premium', 'Performance'],
    value: 125000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 35)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 8)
      return date.toISOString()
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 8)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },

  // 10. Opportunity - Closed Won - Awaiting Delivery (contract signed, delivery date in future)
  {
    id: 26,
    customerId: 10,
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model Y', 
      year: 2024, 
      price: 55000,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 3
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Closed Won',
    negotiationSubstatus: null,
    offers: [],
    tags: ['Electric'],
    value: 55000,
    expectedCloseDate: null,
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 45)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    closedDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    deliveryDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 10)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },

  // 11. Opportunity - Closed Won - Delivered (contract signed, delivered, awaiting feedback)
  {
    id: 10,
    customerId: 11,
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Macan', 
      year: 2024, 
      price: 85000,
      image: 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=900&auto=format&fit=crop&q=60',
      dealership: 'Frankfurt',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 0
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Closed Won',
    negotiationSubstatus: null,
    offers: [],
    tags: ['Premium'],
    value: 85000,
    expectedCloseDate: null,
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 60)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    closedDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    deliveryDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    deliveredDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  }
]
