# LeadSpark 2 API - Integration Analysis

## 📊 Executive Summary

**Extracted from:** LeadSpark 2 API Platform (OpenAPI 3.0.0)  
**Total API Endpoints:** 664 paths  
**API Platform:** Symfony API Platform with JSON-LD/Hydra

---

## ✅ Key Endpoints Available

### 🔹 Leads (14 endpoints)
- `GET /leads` - List all leads
- `GET /leads/{id}` - Get lead by ID
- `POST /leads` - Create new lead
- `PUT /leads/{id}` - Update lead
- `DELETE /leads/{id}` - Delete lead
- `GET /leads/{id}/activities` - Get lead activities
- `GET /leads/{id}/opportunities` - Get related opportunities
- `GET /leads/{id}/timeline` - Get lead timeline
- `GET /leads/{id}/tasks` - Get lead tasks
- `GET /leads/{id}/tags` - Get lead tags
- `POST /leads/{id}/reopen` - Reopen lead
- `POST /leads/save-and-qualify` - Save and qualify lead
- `GET /leads/{id}/salesrep-suggestions` - Get sales rep suggestions
- `GET /leads/{id}/financing-data` - Get financing data

### 🔹 Opportunities (20 endpoints)
- `GET /opportunities` - List all opportunities
- `GET /opportunities/{id}` - Get opportunity by ID
- `POST /opportunities` - Create new opportunity
- `PUT /opportunities/{id}` - Update opportunity
- `DELETE /opportunities/{id}` - Delete opportunity
- `GET /opportunities/{id}/activities` - Get opportunity activities
- `POST /opportunities/bulk-assign-owner` - Bulk assign owner
- `POST /opportunities/merge` - Merge opportunities
- `GET /opportunities/similarity` - Find similar opportunities
- `GET /opportunities/user-alias/{userAliasName}` - Get by user alias

### 🔹 Contacts (13 endpoints)
- `GET /contacts` - List all contacts
- `GET /contacts/{id}` - Get contact by ID
- `POST /contacts` - Create new contact
- `PUT /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact
- `GET /contacts/{id}/activities` - Get contact activities
- `GET /contacts/{id}/tasks` - Get contact tasks
- `GET /contacts/{id}/tags` - Get contact tags
- `GET /contacts/{id}/similar` - Find similar contacts
- `POST /contacts/merge` - Merge contacts
- `POST /contacts/mass-forget-similarity` - Mass forget similarity

### 🔹 Calendar Events (Multiple endpoints)
- `GET /calendar_events` - List calendar events
- `GET /calendar_events/{id}` - Get calendar event by ID
- `POST /calendar_events` - Create calendar event
- `PUT /calendar_events/{id}` - Update calendar event
- `DELETE /calendar_events/{id}` - Delete calendar event
- `GET /calendar_events/{id}/timeline` - Get event timeline
- `GET /calendar-events/users-visibility` - Get users visibility

### 🔹 Activities
- `GET /activities` - List activities
- `GET /activities/{id}` - Get activity by ID
- Related to leads, opportunities, contacts via `/leads/{id}/activities`

### 🔹 Users (18 endpoints)
- `GET /users` - List users
- `GET /users/{id}` - Get user by ID
- User management and permissions

### 🔹 Vehicles (4 endpoints)
- `GET /vehicles` - List vehicles
- `GET /vehicles/{id}` - Get vehicle by ID
- Vehicle registry and inventory

### 🔹 Additional Important Endpoints
- `GET /offers` - List offers
- `GET /tasks` - List tasks
- `GET /appointment-follow-up` - Appointment follow-up
- `GET /lead-qualification` - Lead qualification
- `GET /conversations` - Conversations
- `GET /notes` - Notes

---

## ⚠️ Key Differences: API Platform vs Your Current Structure

### 1. **Response Format: JSON-LD/Hydra vs Plain JSON**

**API Platform (LeadSpark 2):**
```json
{
  "@context": "/contexts/Lead",
  "@id": "/leads",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@id": "/leads/1",
      "@type": "Lead",
      "id": 1,
      "customer": "/accounts/21",  // IRI reference
      "requestedVehicle": "/vehicles/5"
    }
  ],
  "hydra:totalItems": 20,
  "hydra:view": {
    "@id": "/leads?page=1",
    "hydra:first": "/leads?page=1",
    "hydra:last": "/leads?page=5"
  }
}
```

**Your Current Structure:**
```json
{
  "data": [
    {
      "id": 1,
      "customer": {
        "id": 21,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "requestedCar": {
        "brand": "Audi",
        "model": "A6"
      }
    }
  ],
  "total": 20
}
```

### 2. **IRI References vs Embedded Objects**

**API Platform:**
- Uses IRI (Internationalized Resource Identifier) references
- Example: `"customer": "/accounts/21"` instead of embedded object
- Requires separate requests or `?embedded[]=customer` query param

**Your Current:**
- Embedded objects (customer data included directly)
- No separate requests needed

### 3. **Accounts vs Contacts**

**API Platform:**
- Has `/accounts` (Companies/Organizations)
- Has `/contacts` (Individual people)
- Leads/Opportunities reference accounts

**Your Current:**
- Uses `contacts` for both individuals and companies
- No separate accounts entity

### 4. **Pagination: Hydra vs Simple**

**API Platform:**
- Uses Hydra pagination with `hydra:view`, `hydra:first`, `hydra:last`
- Query params: `?page=1&itemsPerPage=30`

**Your Current:**
- Simple array response
- No pagination in mock data

### 5. **Filtering & Search**

**API Platform:**
- Filtering: `?order[createdAt]=desc`
- Search: `?name=John`
- Groups: `?exists[requestedVehicle]=true`

**Your Current:**
- Simple filter objects passed to functions

---

## ✅ What You Can Use

### Fully Compatible:

1. **Lead Management** ✅
   - Create, read, update, delete leads
   - Get lead activities, timeline, tasks
   - Lead qualification endpoints

2. **Opportunity Management** ✅
   - CRUD operations
   - Activities, timeline
   - Bulk operations

3. **Contact Management** ✅
   - CRUD operations
   - Similarity detection
   - Merge operations

4. **Calendar Events** ✅
   - Event management
   - Timeline integration

5. **Activities** ✅
   - Activity tracking
   - Linked to leads/opportunities/contacts

---

## ⚠️ Missing/Challenging Areas

### 1. **Account Entity**
- **Issue:** API has `/accounts` (companies), you only have contacts
- **Solution:** Map accounts to contacts, or add accounts entity

### 2. **IRI Resolution**
- **Issue:** API returns IRIs (`"/accounts/21"`), not objects
- **Solution:** Need to:
  - Make additional requests for referenced entities, OR
  - Use `?embedded[]=customer&embedded[]=requestedVehicle` query params

### 3. **Response Transformation**
- **Issue:** API Platform JSON-LD format differs from your structure
- **Solution:** Create adapter layer to transform responses

### 4. **Authentication**
- **Not visible in spec** - Need to identify:
  - API tokens?
  - OAuth?
  - Session-based?
  - Bearer tokens?

### 5. **File Uploads**
- **Not clearly visible** - Check for:
  - Attachment endpoints
  - Media upload endpoints
  - Document management

### 6. **Real-time/WebSockets**
- **Not in REST spec** - May need separate WebSocket connections for:
  - Real-time updates
  - Notifications
  - Live activity feeds

---

## 🔧 Integration Strategy

### Phase 1: API Adapter Layer (Recommended)

Create an adapter layer to transform API Platform responses to your current structure:

```javascript
// src/api/adapters/leadsparkAdapter.js

/**
 * Transform Hydra collection to your format
 */
export const transformCollection = (hydraResponse) => {
  return {
    data: hydraResponse['hydra:member'].map(transformItem),
    total: hydraResponse['hydra:totalItems'],
    pagination: hydraResponse['hydra:view']
  }
}

/**
 * Transform single item (with IRI resolution)
 */
export const transformLead = async (leadItem, apiClient) => {
  const lead = {
    id: leadItem.id,
    customer: await resolveIRI(leadItem.customer, apiClient),
    requestedCar: await resolveIRI(leadItem.requestedVehicle, apiClient),
    // ... map other fields
  }
  return lead
}

/**
 * Resolve IRI reference to actual object
 */
const resolveIRI = async (iri, apiClient) => {
  if (typeof iri === 'object') return iri // Already embedded
  if (!iri) return null
  return await apiClient.get(iri) // Fetch the referenced resource
}
```

### Phase 2: API Client Wrapper

```javascript
// src/api/leadsparkClient.js

class LeadSparkClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json', // or 'application/ld+json'
      'Content-Type': 'application/json'
    }
  }

  async getLeads(filters = {}) {
    const params = new URLSearchParams()
    
    // Convert filters to API Platform format
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('name', filters.search)
    
    // Request embedded resources
    params.append('embedded[]', 'customer')
    params.append('embedded[]', 'requestedVehicle')
    
    const response = await fetch(`${this.baseURL}/leads?${params}`, {
      headers: this.headers
    })
    
    const data = await response.json()
    return transformCollection(data) // Transform to your format
  }
}
```

### Phase 3: Gradual Migration

1. **Start with Read Operations**
   - Replace mock data fetches with API calls
   - Keep transformation layer

2. **Add Write Operations**
   - Implement create/update/delete
   - Handle IRI references

3. **Optimize**
   - Use embedded[] params to reduce requests
   - Add caching layer
   - Implement pagination

---

## 📋 Field Mapping Checklist

To be completed with full schema analysis:

### Lead Fields:
- [ ] Map `customer` (IRI) → `customer` (object)
- [ ] Map `requestedVehicle` (IRI) → `requestedCar` (object)
- [ ] Map `status` → `status`
- [ ] Map `priority` → `priority`
- [ ] Map `assignee` (IRI) → `assignee` (object)
- [ ] Check for missing fields (tags, activities, etc.)

### Opportunity Fields:
- [ ] Map `customer` → `customer`
- [ ] Map `vehicle` → `vehicle`
- [ ] Map `stage` → `stage`
- [ ] Map `selectedVehicle` (if exists)
- [ ] Map offers relationship

### Contact Fields:
- [ ] Map contact structure
- [ ] Map account relationship
- [ ] Map tags, activities

---

## 🎯 Next Steps

1. ✅ **Extract full schema definitions** to see exact field names and types
2. ✅ **Identify authentication method** (check API docs or test endpoints)
3. ✅ **Test API endpoints** with real requests to see actual response format
4. ✅ **Create adapter functions** for response transformation
5. ✅ **Implement API client** wrapper
6. ✅ **Gradual migration** from mock data to real API

---

## 📝 Notes

- API uses **API Platform** (Symfony-based)
- Supports both `application/json` and `application/ld+json` formats
- JSON-LD format is more verbose but includes metadata
- Consider using `application/json` format if available (simpler)
- Check API documentation for `embedded[]` parameter usage
- May need to handle CORS if API is on different domain




