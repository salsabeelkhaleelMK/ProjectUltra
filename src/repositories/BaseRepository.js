/**
 * Base Repository Pattern
 * 
 * Provides abstract interface for data access operations.
 * Concrete repositories extend this class to implement entity-specific data access.
 * 
 * This abstraction allows swapping data sources (mock → REST → GraphQL) without
 * changing the service layer or components.
 */
export class BaseRepository {
  constructor(dataSource) {
    // Only set dataSource if it's provided and the property is writable
    // Subclasses may define dataSource as a getter-only property
    if (dataSource !== undefined) {
      try {
        this.dataSource = dataSource
      } catch (error) {
        // Property is read-only (getter-only), which is fine for subclasses
        // that define their own dataSource getter
      }
    }
  }

  /**
   * Find all records matching filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Array of records
   */
  async findAll(filters = {}) {
    throw new Error('findAll must be implemented by subclass')
  }

  /**
   * Find a single record by ID
   * @param {number|string} id - Record ID
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async findById(id) {
    throw new Error('findById must be implemented by subclass')
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    throw new Error('create must be implemented by subclass')
  }

  /**
   * Update an existing record
   * @param {number|string} id - Record ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated record
   */
  async update(id, updates) {
    throw new Error('update must be implemented by subclass')
  }

  /**
   * Delete a record
   * @param {number|string} id - Record ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    throw new Error('delete must be implemented by subclass')
  }
}

