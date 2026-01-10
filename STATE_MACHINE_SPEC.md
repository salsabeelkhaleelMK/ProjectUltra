# Opportunity State Machine Specification

## Overview

This document specifies the complete opportunity lifecycle state machine implemented in ProjectUltra. The system uses **9 main stages** with **substatus tracking** for delivery within the Closed Won stage.

## Architecture

### Design Pattern: Substates for Closed Won

**Closed Won** is a single stage with three possible substates:
- **None** (null): Contract signed, delivery not yet scheduled
- **Awaiting Delivery**: Delivery date set, awaiting delivery
- **Delivered**: Vehicle delivered to customer

This design provides:
- ✅ Semantic clarity: "Closed Won" always means deal is won (contract signed)
- ✅ Simple database: All stored as "Closed Won" with substatus badge
- ✅ Clear reporting: Count "Won" opportunities, filter by substatus for delivery tracking
- ✅ Simpler state machine: One success state with internal progression

## Stage Definitions

### 1. Qualified
**Entry Condition**: Lead converted to opportunity OR opportunity created  
**Display**: Blue badge

**Primary Action**: Schedule First Appointment

**Secondary Actions**:
- Select Vehicle
- Schedule Appointment (conditional: no appointment)
- Close as Lost

**Task Widgets**:
- **OOFB** (Opportunity Offer Follow-up): Auto-created after 7-13 days with no offer
- **UFB** (Urgent Follow-up): Auto-created after 14+ days with no offer

**Transitions**:
- → Awaiting Appointment (when appointment scheduled)
- → To be Called Back (when callback date set)
- → In Negotiation (when first offer created)
- → Closed Lost (manual)

---

### 2. Awaiting Appointment
**Entry Condition**: Appointment scheduled  
**Display**: Purple badge

**Primary Action**: View Appointment OR Schedule Appointment (dynamic based on appointment existence)

**Secondary Actions**:
- Reschedule (conditional: has appointment)
- Cancel Appointment (conditional: has appointment)
- Schedule Appointment (conditional: no appointment)
- Close as Lost

**Task Widgets**:
- **OOFB**: Still applies (appointment ≠ offer)
- **NS1** (No-Show First Time): If appointment missed
- **NS2** (No-Show Second Time): If appointment missed again
- **NS3** (No-Show Third Time): Auto-closes as lost

**Transitions**:
- → To be Called Back (after NS1 or NS2)
- → Closed Lost (after NS3 - automatic)
- → In Negotiation (when offer created)
- → Qualified (when appointment cancelled)

---

### 3. To be Called Back
**Entry Condition**: Callback date set (often after NS1/NS2)  
**Display**: Indigo badge

**Primary Action**: Call Prospect

**Secondary Actions**:
- Schedule Appointment (conditional: no appointment)
- Close as Lost

**Task Widgets**:
- **OOFB**: Still applies (no offer exemption)

**Transitions**:
- → Awaiting Appointment (when new appointment scheduled)
- → In Negotiation (when offer created)
- → Closed Lost (manual)

---

### 4. In Negotiation
**Entry Condition**: First offer created  
**Display**: Yellow badge

**Primary Action**: Send Offer (if no offers) OR Follow Up on Offer (if offers exist)

**Secondary Actions**:
- Add Another Offer
- Schedule Appointment (conditional: no appointment)
- Close as Lost

**Task Widgets**:
- **OFB** (Offer Follow-up): Auto-created after 5+ days in negotiation with no contract
- **NFU** (No Future Appointment): Auto-created after 5+ days IF no contract AND no future appointment

**Transitions**:
- → Offer Sent (automatic after offer created)
- → Contract Pending (when contract date set)
- → Closed Lost (manual)

**Auto-Transition**: First offer added → Qualified to In Negotiation

---

### 5. Offer Sent
**Entry Condition**: Offer created, less than 3 days ago  
**Display**: Orange badge

**Primary Action**: Follow Up on Offer

**Secondary Actions**:
- Add Another Offer
- Schedule Follow-up (conditional: no appointment)
- Close as Lost

**Task Widgets**:
- **OFB**: Inherited from In Negotiation phase
- **NFU**: Inherited from In Negotiation phase

**Transitions**:
- → Awaiting Response (automatic after 3 days)
- → In Negotiation (when new offer added)
- → Contract Pending (when contract date set)
- → Closed Lost (manual)

**Auto-Transition**: 3 days after offer sent → Offer Sent to Awaiting Response

---

### 6. Awaiting Response
**Entry Condition**: Offer pending for 3+ days  
**Display**: Pink badge

**Primary Action**: Request Customer Decision

**Secondary Actions**:
- **Add Contract** (customer accepted - proceed to contract)
- Send New Offer
- Schedule Meeting (conditional: no appointment)
- Close as Lost

**Task Widgets**:
- **OFB**: Inherited from In Negotiation phase
- **NFU**: Inherited from In Negotiation phase

**Transitions**:
- → Contract Pending (when contract date set via "Add Contract")
- → Offer Sent (when new offer added)
- → Closed Lost (manual)

**Critical**: NO direct "Close as Won" - must go through Contract Pending

---

### 7. Contract Pending
**Entry Condition**: Contract date set  
**Display**: Emerald badge

**Primary Action**: Finalize Contract (collect e-signatures)

**Secondary Actions**:
- Add Another Offer
- Extend Deadline
- **Close as Won** (ONLY available from this stage)
- Close as Lost

**Task Widgets**:
- **CFB** (Contract Follow-up): Auto-created 7+ days after contract date set with no delivery

**Transitions**:
- → Closed Won (when contract signed - manual "Close as Won" action)
- → Offer Sent (when new offer added)
- → Closed Lost (manual)

**Critical**: This is the ONLY stage where "Close as Won" is available

---

### 8. Closed Won
**Entry Condition**: Contract signed  
**Display**: Green badge + Substatus badge

**Substatus Tracking**:
- **None** (no badge): Contract signed, delivery not scheduled
- **Awaiting Delivery** (teal badge): Delivery date set
- **Delivered** (green badge): Vehicle delivered

**Primary Action** (dynamic based on substatus):
- **None**: Schedule Delivery
- **Awaiting Delivery**: Confirm Delivery Details
- **Delivered**: Collect Feedback

**Secondary Actions**:
- Collect Feedback (conditional: delivered)
- Close as Lost

**Task Widgets**:
- **CFB**: Continues if delivery date not set within 7+ days
- **DFB** (Delivery Follow-up): Auto-created when delivery date is set

**Transitions**:
- → Qualified (reopen)
- Substatus progression: None → Awaiting Delivery → Delivered (internal)

**Auto-Transitions**:
- Delivery date set → substatus becomes "Awaiting Delivery"
- Delivery activity logged → substatus becomes "Delivered"

---

### 9. Closed Lost
**Entry Condition**: Opportunity closed as lost  
**Display**: Red badge

**Primary Action**: None (archived)

**Secondary Actions**:
- Reopen Opportunity (conditional: task widget active)
- Requalify as Lead (conditional: task widget active)

**Task Widgets**: None (all closed)

**Transitions**:
- → Qualified (reopen)

**Auto-Transition**: NS3 (third no-show) → Closed Lost

---

## No-Show (NS) Flow

### NS1 (First No-Show)
- **Trigger**: Customer misses first appointment
- **Action**: NSWidget displays with "Book Another Appointment" button
- **Transition**: → To be Called Back (callback date set for 2 days)
- **noShowCount**: 1

### NS2 (Second No-Show)
- **Trigger**: Customer misses second appointment
- **Action**: NSWidget displays with stronger message
- **Transition**: → To be Called Back (callback date set for 2 days)
- **noShowCount**: 2

### NS3 (Third No-Show)
- **Trigger**: Customer misses third appointment
- **Action**: NSWidget displays "Final Warning"
- **Transition**: → Closed Lost (automatic)
- **noShowCount**: 3
- **Reason**: "Multiple no-shows (NS3)"

---

## Critical Business Rules

### 1. Contract Path Enforcement
**Rule**: Cannot "Close as Won" without going through Contract Pending

**Implementation**:
- "Close as Won" action ONLY available in Contract Pending stage
- Removed from Offer Sent and Awaiting Response stages
- Enforces proper workflow: Awaiting Response → Add Contract → Contract Pending → Close as Won

### 2. Reopen Logic
**Rule**: "Reopen" only available for truly closed opportunities

**Implementation**:
- `is-closed` condition checks: `stage === 'Closed Won' || stage === 'Closed Lost'`
- Does NOT include "Delivered" (no longer a separate stage)
- Only shows when task widget is active
- Always reopens to "Qualified" stage

### 3. Delivery Substatus Calculation
**Rule**: Substatus derived from deliveryDate and delivery activities

**Implementation**:
```javascript
function calculateDeliverySubstatus(opportunity, activities) {
  // Check if vehicle has been delivered
  if (hasDelivery(opportunity, activities)) {
    return DELIVERY_SUBSTATUS.DELIVERED
  }
  
  // Check if delivery date is scheduled
  if (opportunity.deliveryDate) {
    return DELIVERY_SUBSTATUS.AWAITING_DELIVERY
  }
  
  // No delivery tracking yet
  return DELIVERY_SUBSTATUS.NONE
}
```

### 4. Stage Transitions Validation
**Valid Transitions**:
- Qualified → Awaiting Appointment, To be Called Back, In Negotiation, Closed Lost
- Awaiting Appointment → To be Called Back, In Negotiation, Closed Lost, Qualified
- To be Called Back → Awaiting Appointment, In Negotiation, Closed Lost
- In Negotiation → Offer Sent, Contract Pending, Closed Lost
- Offer Sent → Awaiting Response, In Negotiation, Contract Pending, Closed Lost
- Awaiting Response → Contract Pending, Offer Sent, Closed Lost
- Contract Pending → Closed Won, Closed Lost
- Closed Won → Qualified (reopen)
- Closed Lost → Qualified (reopen)

---

## Implementation Files

### Core Files
- **`src/utils/stageMapper.js`**: Stage calculation, substatus logic, color mapping
- **`src/composables/useOpportunityStateMachine.js`**: State machine configuration
- **`src/utils/opportunityRules.js`**: Business rules engine
- **`src/composables/useOpportunityActions.js`**: Composable glue layer

### UI Components
- **`src/components/tasks/OpportunityManagementWidget.vue`**: Main management widget
- **`src/components/tasks/widgets/StageOwnerBar.vue`**: Stage display with substatus badge
- **`src/components/tasks/opportunities/tasks/NSWidget.vue`**: No-show handling

### API Layer
- **`src/api/opportunities.js`**: Enriches opportunities with displayStage and deliverySubstatus

---

## Database Schema

### Opportunity Fields
```javascript
{
  id: Number,
  stage: String, // API status: 'Qualified', 'In Negotiation', 'Closed Won', 'Closed Lost'
  displayStage: String, // Calculated UI stage (9 stages)
  deliverySubstatus: String | null, // 'Awaiting Delivery', 'Delivered', or null
  contractDate: String | null, // ISO date when contract signed
  deliveryDate: String | null, // ISO date when delivery scheduled
  callbackDate: String | null, // ISO date for callback
  scheduledAppointment: Object | null, // Appointment details
  // ... other fields
}
```

### Calendar Event Fields (for NS tracking)
```javascript
{
  id: Number,
  noShowCount: Number, // 0, 1, 2, 3
  status: String, // 'confirmed', 'no-show', 'cancelled', 'completed'
  // ... other fields
}
```

---

## Testing Checklist

### Phase 1: Substates
- [x] Closed Won shows correct substatus based on deliveryDate and activities
- [x] Substatus badge displays in UI
- [x] Primary action changes based on substatus
- [x] Stage color mapping excludes old Awaiting Delivery/Delivered

### Phase 2: Contract Enforcement
- [x] "Close as Won" NOT available from Offer Sent
- [x] "Close as Won" NOT available from Awaiting Response
- [x] "Close as Won" IS available from Contract Pending
- [x] State transitions validation enforces contract path

### Phase 3: NS Flow
- [x] NS1 → To be Called Back (callback set)
- [x] NS2 → To be Called Back (callback set)
- [x] NS3 → Auto-close as Lost
- [x] noShowCount tracked in calendar events

### Phase 4: Reopen Logic
- [x] Reopen only available from Closed Won and Closed Lost
- [x] Reopen NOT available from Qualified or active stages
- [x] Reopen only shows when task widget is active

---

## Migration Notes

### Backward Compatibility
- Old API statuses ('Qualified', 'In Negotiation', 'Closed Won', 'Closed Lost') still work
- Stage mapper automatically converts to display stages
- No database migration needed - automatic on read

### Breaking Changes
- None - fully backward compatible

---

## Summary

**Total Stages**: 9 (down from 11)
- Qualified
- Awaiting Appointment
- To be Called Back
- In Negotiation
- Offer Sent
- Awaiting Response
- Contract Pending
- Closed Won (with 3 substates)
- Closed Lost

**Key Improvements**:
1. Clearer semantic meaning (Closed Won = contract signed)
2. Simpler architecture (substates vs separate stages)
3. Enforced contract path (must go through Contract Pending)
4. Proper NS flow (NS1/NS2 → callback, NS3 → auto-close)
5. Correct reopen logic (only from truly closed stages)

**Database Impact**: None (automatic derivation on read)

**UI Impact**: Substatus badge added to Closed Won opportunities

