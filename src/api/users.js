import { mockUsers } from './mockData'

// Simulate API delay (acceptable for mocking - will be removed when real API is integrated)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch all users
 * @returns {Promise<Array>} Array of users
 */
export const fetchUsers = async () => {
  await delay()
  return [...mockUsers]
}

/**
 * Fetch user by ID
 * @param {number|string} id - User ID
 * @returns {Promise<Object|null>} User or null if not found
 */
export const fetchUserById = async (id) => {
  await delay()
  const user = mockUsers.find(u => u.id === parseInt(id))
  return user || null
}

/**
 * Fetch user by role
 * @param {string} role - User role (salesman, operator, manager)
 * @returns {Promise<Object|null>} User or null if not found
 */
export const fetchUserByRole = async (role) => {
  await delay()
  const user = mockUsers.find(u => u.role === role)
  return user || null
}

/**
 * Authenticate user (mock authentication)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} User or null if authentication fails
 */
export const authenticateUser = async (email, password) => {
  await delay()
  // Mock authentication - in real app, this would validate credentials
  const user = mockUsers.find(u => u.email === email)
  return user || null
}
