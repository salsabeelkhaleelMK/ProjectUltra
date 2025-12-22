/**
 * Migrate legacy financing and purchase activities to the new purchase-method format
 */
export function migrateActivityToPurchaseMethod(activity) {
  // Skip if already migrated or not a legacy type
  if (activity.type !== 'financing' && activity.type !== 'purchase') {
    return activity
  }
  
  // Clone the activity to avoid mutation
  const migratedActivity = { ...activity }
  
  if (activity.type === 'financing') {
    // Convert financing to purchase-method with financing method
    migratedActivity.type = 'purchase-method'
    migratedActivity.action = activity.action.replace('financing proposal', 'purchase method: Financing')
    
    migratedActivity.data = {
      ...activity.data,
      method: 'financing',
      // Map old field names to new ones
      productName: activity.data.product || activity.data.productName || '',
      provider: activity.data.provider || 'Audi Financial',
      price: activity.data.total || activity.data.price || '0',
      deposit: activity.data.deposit || '0',
      monthlyPayment: activity.data.monthly || activity.data.monthlyPayment || '0',
      loanTerm: activity.data.loanTerm || 36,
      startDate: activity.data.startDate || '',
      expDate: activity.data.expDate || '',
      // Add default vehicle info if missing
      brand: activity.data.brand || '',
      model: activity.data.model || '',
      year: activity.data.year || new Date().getFullYear(),
      notes: activity.data.notes || ''
    }
    
    // Remove old field names
    delete migratedActivity.data.product
    delete migratedActivity.data.total
    delete migratedActivity.data.monthly
    
  } else if (activity.type === 'purchase') {
    // Convert purchase to purchase-method with cash method
    migratedActivity.type = 'purchase-method'
    migratedActivity.action = activity.action.replace('purchase', 'purchase method: Cash')
    
    migratedActivity.data = {
      ...activity.data,
      method: 'cash',
      // Keep existing fields
      brand: activity.data.brand || '',
      model: activity.data.model || '',
      year: activity.data.year || new Date().getFullYear(),
      price: activity.data.price || '0',
      purchaseDate: activity.data.purchaseDate || new Date().toISOString().split('T')[0],
      notes: activity.data.notes || ''
    }
  }
  
  return migratedActivity
}

/**
 * Migrate an array of activities
 */
export function migrateActivities(activities) {
  if (!Array.isArray(activities)) {
    return activities
  }
  
  return activities.map(activity => migrateActivityToPurchaseMethod(activity))
}

