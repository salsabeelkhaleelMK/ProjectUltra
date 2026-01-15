import { ref } from 'vue'
import { useVehiclesStore } from '@/stores/vehicles'

/**
 * Composable for vehicle detail modal logic
 * Handles form state, validation, and submission for adding customer vehicles
 * 
 * @returns {Object} Object containing showAddModal, newVehicle, handleCloseModal, and handleSubmit
 */
export function useVehicleDetail() {
  const vehiclesStore = useVehiclesStore()
  
  const showAddModal = ref(false)
  const newVehicle = ref({
    brand: '',
    model: '',
    year: '',
    vin: '',
    plates: '',
    fuelType: '',
    gearType: '',
    kilometers: '',
    registration: '',
    owner: '',
    ownershipType: '',
    ownedSince: '',
    warrantyInfo: '',
    stockDays: null // Customer vehicles have null stockDays
  })

  const handleCloseModal = () => {
    showAddModal.value = false
    // Reset form
    newVehicle.value = {
      brand: '',
      model: '',
      year: '',
      vin: '',
      plates: '',
      fuelType: '',
      gearType: '',
      kilometers: '',
      registration: '',
      owner: '',
      ownershipType: '',
      ownedSince: '',
      warrantyInfo: '',
      stockDays: null
    }
  }

  const handleSubmit = async () => {
    try {
      const vehicleData = {
        brand: newVehicle.value.brand,
        model: newVehicle.value.model,
        year: parseInt(newVehicle.value.year) || null,
        vin: newVehicle.value.vin || null,
        plates: newVehicle.value.plates || null,
        fuelType: newVehicle.value.fuelType || null,
        gearType: newVehicle.value.gearType || null,
        kilometers: parseInt(newVehicle.value.kilometers) || 0,
        registration: newVehicle.value.registration || null,
        owner: newVehicle.value.owner || null,
        ownershipType: newVehicle.value.ownershipType || null,
        ownedSince: newVehicle.value.ownedSince || null,
        warrantyInfo: newVehicle.value.warrantyInfo || null,
        stockDays: null, // Customer vehicles have null stockDays
        status: 'Available'
      }
      
      await vehiclesStore.addVehicle(vehicleData)
      handleCloseModal()
    } catch (error) {
      console.error('Error adding vehicle:', error)
    }
  }

  return {
    showAddModal,
    newVehicle,
    handleCloseModal,
    handleSubmit
  }
}


