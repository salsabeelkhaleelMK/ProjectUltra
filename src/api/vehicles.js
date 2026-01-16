import { mockVehicles } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchVehicles = async (filters = {}) => {
  await delay()
  
  let results = [...mockVehicles]
  
  if (filters.status) {
    results = results.filter(vehicle => vehicle.status === filters.status)
  }
  if (filters.brand) {
    results = results.filter(vehicle => vehicle.brand === filters.brand)
  }
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(vehicle => 
      vehicle.brand.toLowerCase().includes(search) ||
      vehicle.model.toLowerCase().includes(search) ||
      vehicle.vin.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchVehicleById = async (id) => {
  await delay()
  const vehicle = mockVehicles.find(v => v.id === parseInt(id))
  if (!vehicle) throw new Error('Vehicle not found')
  return vehicle
}

export const createVehicle = async (vehicleData) => {
  await delay()
  const newVehicle = {
    id: mockVehicles.length + 1,
    ...vehicleData,
    stockDays: 0
  }
  mockVehicles.push(newVehicle)
  return newVehicle
}

export const updateVehicle = async (id, updates) => {
  await delay()
  const index = mockVehicles.findIndex(v => v.id === parseInt(id))
  if (index === -1) throw new Error('Vehicle not found')
  
  mockVehicles[index] = { ...mockVehicles[index], ...updates }
  return mockVehicles[index]
}

export const deleteVehicle = async (id) => {
  await delay()
  const index = mockVehicles.findIndex(v => v.id === parseInt(id))
  if (index === -1) throw new Error('Vehicle not found')
  
  mockVehicles.splice(index, 1)
  return { success: true }
}