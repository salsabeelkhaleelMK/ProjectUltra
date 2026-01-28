/**
 * Mock Contract/PDF Data
 * 
 * Mock data for PDF generation, templates, and seller information.
 * This will be replaced with real API calls when backend is integrated.
 */

// Mock seller/dealership information
export const mockSellerInfo = {
  name: 'MotorK Dealership',
  address: {
    street: '123 Automotive Boulevard',
    city: 'Berlin',
    postalCode: '10115',
    country: 'Germany'
  },
  phone: '+49 30 12345678',
  email: 'info@motork.de',
  vatNumber: 'DE123456789',
  registrationNumber: 'HRB 12345 B',
  website: 'www.motork.de'
}

// Mock available PDF templates
export const mockPDFTemplates = [
  {
    id: 'contract-classic',
    name: 'Contract - Classic',
    type: 'contract',
    style: 'classic',
    description: 'Detailed contract with comprehensive information and legal sections'
  },
  {
    id: 'contract-express',
    name: 'Contract - Express',
    type: 'contract',
    style: 'express',
    description: 'Streamlined contract with essential information'
  },
  {
    id: 'offer-classic',
    name: 'Offer - Classic',
    type: 'offer',
    style: 'classic',
    description: 'Detailed offer with VAT table, trade-in section, and vehicle images'
  },
  {
    id: 'offer-express',
    name: 'Offer - Express',
    type: 'offer',
    style: 'express',
    description: 'Simplified offer with condensed layout for stock vehicles'
  }
]

// Mock PDF generation response
export function generateMockPDFBlob() {
  // Create a simple PDF-like blob for preview
  // In real implementation, this would come from AthenaPDF service
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Mock PDF Document) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000306 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
390
%%EOF`
  
  return new Blob([pdfContent], { type: 'application/pdf' })
}
