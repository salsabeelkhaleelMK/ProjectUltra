/**
 * Utility functions for parsing CSV and Excel files
 */

/**
 * Parse CSV file content
 * @param {string} csvText - CSV file content as text
 * @param {string} delimiter - Column delimiter (default: ',')
 * @returns {Array<Object>} Array of objects with column names as keys
 */
export function parseCSV(csvText, delimiter = ',') {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) {
    throw new Error('CSV file is empty')
  }

  // Parse header row
  const headers = lines[0]
    .split(delimiter)
    .map(h => h.trim().replace(/^"|"$/g, '')) // Remove quotes if present

  // Parse data rows
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))
    
    if (values.length !== headers.length) {
      // Try to handle quoted values with commas
      const row = lines[i]
      const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*)"|([^${delimiter}]*))`, 'g')
      const matches = []
      let match
      while ((match = regex.exec(row)) !== null) {
        matches.push(match[1] || match[2] || '')
      }
      
      if (matches.length === headers.length) {
        const rowData = {}
        headers.forEach((header, index) => {
          rowData[header] = matches[index] || ''
        })
        data.push(rowData)
      } else {
        console.warn(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Skipping.`)
      }
    } else {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = values[index] || ''
      })
      data.push(rowData)
    }
  }

  return {
    headers,
    data
  }
}

/**
 * Parse Excel file (XLS/XLSX)
 * @param {File} file - Excel file
 * @returns {Promise<Object>} Object with headers and data arrays
 */
export async function parseExcel(file) {
  // Dynamic import of xlsx library
  const XLSX = await import('xlsx')

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const arrayBuffer = new Uint8Array(e.target.result)
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'))
          return
        }

        // First row is headers
        const headers = jsonData[0].map(h => String(h || '').trim())

        // Remaining rows are data
        const data = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          const rowData = {}
          headers.forEach((header, index) => {
            rowData[header] = row[index] !== undefined ? String(row[index]) : ''
          })
          data.push(rowData)
        }

        resolve({
          headers,
          data
        })
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Detect columns from parsed data
 * @param {Array<Object>} data - Parsed data array
 * @returns {Array<string>} Array of column names
 */
export function detectColumns(data) {
  if (!data || data.length === 0) {
    return []
  }

  // Get all unique keys from first row
  return Object.keys(data[0] || {})
}

/**
 * Parse file based on extension
 * @param {File} file - File to parse
 * @returns {Promise<Object>} Object with headers and data arrays
 */
export async function parseFile(file) {
  const fileName = file.name.toLowerCase()
  
  if (fileName.endsWith('.csv')) {
    const text = await file.text()
    return parseCSV(text)
  } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
    return await parseExcel(file)
  } else {
    throw new Error('Unsupported file format. Please upload a CSV or Excel file (.csv, .xls, .xlsx)')
  }
}
