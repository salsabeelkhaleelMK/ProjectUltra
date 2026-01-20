import { useVehiclesStore } from '@/stores/vehicles'
import * as leadsApi from '@/api/leads'
import * as opportunitiesApi from '@/api/opportunities'

/**
 * Composable for handling trade-in vehicle operations
 * Saves vehicle to vehicles store AND creates trade-in activity
 * 
 * @returns {Object} Object containing saveTradeInVehicle and updateTradeInVehicle functions
 */
export function useTradeInVehicle() {
  const vehiclesStore = useVehiclesStore()

  /**
   * Save trade-in vehicle and create activity
   * @param {String} taskType - 'lead' or 'opportunity'
   * @param {Number|String} taskId - Task ID
   * @param {Object} vehicleData - Vehicle data object
   * @param {Object} valuationData - Valuation data object (optional)
   * @returns {Promise<Object>} Object containing vehicle and activity
   */
  const saveTradeInVehicle = async (taskType, taskId, vehicleData, valuationData = {}) => {
    try {
      // Step 1: Save vehicle to vehicles store
      const vehicle = await vehiclesStore.addVehicle(vehicleData)
      
      // Step 2: Create trade-in activity
      const activityData = {
        type: 'tradein',
        action: 'added a trade-in',
        vehicleId: vehicle.id,
        data: {
          // Vehicle info
          brand: vehicleData.brand,
          model: vehicleData.model,
          version: vehicleData.version || null,
          year: vehicleData.year,
          kilometers: vehicleData.kilometers || 0,
          plates: vehicleData.plates || null,
          registration: vehicleData.registration || null,
          vin: vehicleData.vin || null,
          fuelType: vehicleData.fuelType || null,
          gearType: vehicleData.gearType || null,
          // Valuation info
          tradeInPrice: valuationData.tradeInPrice || null,
          evaluationRangeLow: valuationData.evaluationRangeLow || null,
          evaluationRangeHigh: valuationData.evaluationRangeHigh || null,
          provider: valuationData.provider || null,
          evaluationDate: valuationData.evaluationDate || null,
          priceToBuy: valuationData.priceToBuy || null,
          priceToSell: valuationData.priceToSell || null,
          priceOfVehicle: valuationData.priceOfVehicle || null,
          priceOfOptionals: valuationData.priceOfOptionals || null,
          listOfOptionals: valuationData.listOfOptionals || null
        }
      }

      let activity
      if (taskType === 'lead') {
        activity = await leadsApi.addLeadActivity(taskId, activityData)
      } else if (taskType === 'opportunity') {
        activity = await opportunitiesApi.addOpportunityActivity(taskId, activityData)
      } else {
        throw new Error(`Invalid taskType: ${taskType}`)
      }

      return {
        vehicle,
        activity
      }
    } catch (error) {
      console.error('Error saving trade-in vehicle:', error)
      throw error
    }
  }

  /**
   * Update existing trade-in vehicle and activity
   * @param {String} taskType - 'lead' or 'opportunity'
   * @param {Number|String} taskId - Task ID
   * @param {Number|String} vehicleId - Vehicle ID
   * @param {Number|String} activityId - Activity ID
   * @param {Object} vehicleData - Updated vehicle data
   * @param {Object} valuationData - Updated valuation data (optional)
   * @returns {Promise<Object>} Object containing updated vehicle and activity
   */
  const updateTradeInVehicle = async (taskType, taskId, vehicleId, activityId, vehicleData, valuationData = {}) => {
    try {
      // Step 1: Update vehicle in vehicles store
      const vehicle = await vehiclesStore.modifyVehicle(vehicleId, vehicleData)
      
      // Step 2: Update trade-in activity
      const activityData = {
        data: {
          // Vehicle info
          brand: vehicleData.brand,
          model: vehicleData.model,
          version: vehicleData.version || null,
          year: vehicleData.year,
          kilometers: vehicleData.kilometers || 0,
          plates: vehicleData.plates || null,
          registration: vehicleData.registration || null,
          vin: vehicleData.vin || null,
          fuelType: vehicleData.fuelType || null,
          gearType: vehicleData.gearType || null,
          // Valuation info
          tradeInPrice: valuationData.tradeInPrice || null,
          evaluationRangeLow: valuationData.evaluationRangeLow || null,
          evaluationRangeHigh: valuationData.evaluationRangeHigh || null,
          provider: valuationData.provider || null,
          evaluationDate: valuationData.evaluationDate || null,
          priceToBuy: valuationData.priceToBuy || null,
          priceToSell: valuationData.priceToSell || null,
          priceOfVehicle: valuationData.priceOfVehicle || null,
          priceOfOptionals: valuationData.priceOfOptionals || null,
          listOfOptionals: valuationData.listOfOptionals || null
        }
      }

      let activity
      if (taskType === 'lead') {
        activity = await leadsApi.updateLeadActivity(taskId, activityId, activityData)
      } else if (taskType === 'opportunity') {
        activity = await opportunitiesApi.updateOpportunityActivity(taskId, activityId, activityData)
      } else {
        throw new Error(`Invalid taskType: ${taskType}`)
      }

      return {
        vehicle,
        activity
      }
    } catch (error) {
      console.error('Error updating trade-in vehicle:', error)
      throw error
    }
  }

  return {
    saveTradeInVehicle,
    updateTradeInVehicle
  }
}
