# Opportunity State Machine

## Flow Diagram

```mermaid
graph TD
    Q[Qualified] --> AA[Awaiting Appointment]
    Q --> AS[Appointment Scheduled]
    Q --> TBC[To be Called Back]
    Q --> IN[In Negotiation]
    Q --> CL[Closed Lost]
    
    AA --> AS
    AA --> IN
    AA --> TBC
    AA --> CL
    
    AS --> IN
    AS --> TBC
    AS --> AA
    AS -->|NS3| CL
    
    TBC --> AA
    TBC --> AS
    TBC --> IN
    TBC --> CL
    
    IN -->|3 days since offer| OUR[Offer Under Review]
    OUR --> OA[Offer Accepted]
    OA --> CP[Contract Pending]
    IN -->|fast deal| OA
    OUR --> NF[Needs Follow-up]
    IN --> CL
    
    NF --> OA
    NF --> CP
    NF --> IN
    NF --> CL
    
    CP -->|Close as Won| CW[Closed Won]
    CP --> IN
    CP --> CL
    
    CW -->|substatus| CW1[None → Awaiting Delivery → Delivered]
    CW --> Q
    
    CL --> Q
    
    AB[Abandoned] --> Q
    AB --> CL
    
    style Q fill:#dbeafe
    style AA fill:#dbeafe
    style AS fill:#e9d5ff
    style TBC fill:#e0e7ff
    style IN fill:#fef3c7
    style NF fill:#fbcfe8
    style OUR fill:#fef3c7
    style OA fill:#d1fae5
    style CP fill:#a7f3d0
    style CW fill:#bbf7d0
    style CL fill:#fecaca
    style AB fill:#f3f4f6
```

## Stage Summary

| Stage | Color | Entry Trigger | Primary Action | Key Widget |
|-------|-------|---------------|----------------|------------|
| **Qualified** | Blue | Lead converted | Schedule Appointment | OOFB (7-13d), UFB (14+d) |
| **Awaiting Appointment** | Blue | Qualified, no appointment | Schedule Appointment | OOFB (7-13d), UFB (14+d) |
| **Appointment Scheduled** | Purple | Appointment set | View/Reschedule Apt | NS (no-show tracking) |
| **To be Called Back** | Indigo | Callback set | Call Prospect | - |
| **In Negotiation** | Yellow | First offer created | Follow Up / Create Offer | NFU (5+d in Offer Feedback only) |
| **In Negotiation - Offer Under Review** | Yellow | Offer 3+ days old | Mark as Accepted / Create Another Offer | OFB (in expanded view, 5+d) |
| **Offer Accepted** | Emerald | Offer marked as accepted | Create Contract | - |
| **Needs Follow-up** | Pink | Offer pending (3+d) | Request Decision | OFB, NFU |
| **In Negotiation - Contract Pending** | Emerald | Contract date set | Finalize Contract | CFB (7+d) |
| **Closed Won** | Green | Contract signed | Schedule Delivery* | CFB, DFB |
| **Closed Lost** | Red | Manually closed / NS3 | None | - |
| **Abandoned** | Gray | Inactive 30+ days | Reopen | ABANDONED |

\* Dynamic: Schedule Delivery → Confirm Delivery → Collect Feedback (based on substatus)

## Closed Won Substatus

```
Closed Won
    ├─ None                  → "Schedule Delivery"
    ├─ Awaiting Delivery     → "Confirm Delivery"
    └─ Delivered             → "Collect Feedback"
```

## In Negotiation Substatus Flow

The "In Negotiation" stage has three substatus values that track the offer lifecycle:

```mermaid
stateDiagram-v2
    [*] --> OfferSent: Create First Offer
    OfferSent --> OfferUnderReview: After 3 days (auto)
    OfferSent --> OfferSent: Add New Offer
    OfferUnderReview --> OfferUnderReview: Add New Offer
    OfferUnderReview --> OfferAccepted: Mark as Accepted (manual)
    OfferSent --> OfferAccepted: Create Contract (fast deal, auto)
    OfferUnderReview --> OfferAccepted: Create Contract (auto)
    OfferFeedback --> OfferUnderReview: Backward compat transition
    OfferFeedback --> OfferAccepted: Mark Offer Accepted (backward compat)
    OfferAccepted --> ContractPending: Create Contract
    ContractPending --> OfferUnderReview: Delete Contract (if auto-accepted)
```

### Substatus Definitions

| Substatus | Display | Trigger | Available Actions |
|-----------|---------|---------|-------------------|
| **Offer Sent** | In Negotiation - Offer Sent | First offer created OR showed up for appointment | Follow Up, Add Offer, Mark Accepted, Communicate |
| **Offer Under Review** | In Negotiation - Offer Under Review | 3 days after most recent offer (auto) | **Primary:** Mark as Accepted, Create Another Offer<br>**Secondary:** Close as Lost, Request Decision from Prospect, Schedule Apt |
| **Offer Feedback** | In Negotiation - Offer Feedback | 3 days after most recent offer (legacy, backward compat) | Follow Up, Add Offer, Mark Accepted, Communicate, Schedule Apt, Close Lost |
| **Offer Accepted** | Offer Accepted | Offer marked as accepted (manual or auto via contract) | **Primary:** Create Contract<br>**Secondary:** Create Another Offer, Close as Lost |
| **Contract Pending** | In Negotiation - Contract Pending | Contract date set | Collect e-signatures, finalize contract, Add offer, Extend deadline, Schedule appointment |

### Substatus Transition Rules

1. **Offer Creation**: When first offer is created → stage becomes "In Negotiation", substatus = "Offer Sent"
2. **Auto-Transition**: After 3 days with no acceptance → substatus changes to "Offer Under Review" (or "Offer Feedback" for backward compatibility)
3. **Add New Offer**: Can happen at any time, does NOT reset the 3-day timer or substatus
4. **Manual Acceptance**: User clicks "Mark as Accepted" → substatus = "Offer Accepted", captures: timestamp, user, method='manual'
5. **Auto-Acceptance**: When contract is created from "Offer Under Review" or "Offer Sent" (fast deal) → offer auto-accepted, captures: timestamp, contract ID, method='auto_via_contract'
6. **Contract Deletion**: When contract is deleted → if offer was auto-accepted, revert to "Offer Under Review"
7. **Multiple Offers**: All offers tracked in `offers` array, displayed in carousel

## No-Show (NS) Flow

```
NS1 (1st miss) → To be Called Back (2 days)
NS2 (2nd miss) → To be Called Back (2 days)  
NS3 (3rd miss) → Closed Lost (automatic)
```

## Critical Business Rules

### 1. Contract Path Enforcement
- **"Close as Won"** only available from **Contract Pending**
- Path: `Needs Follow-up → Add Contract → Contract Pending → Close as Won`

### 2. Auto-Transitions
- First offer created: `Qualified/Awaiting Appointment/Appointment Scheduled → In Negotiation (Offer Sent)`
- Appointment scheduled: `Awaiting Appointment → Appointment Scheduled`
- Offer 3 days old: `In Negotiation (Offer Sent) → In Negotiation (Offer Under Review)`
- Offer accepted (manual): `In Negotiation (Offer Under Review/Offer Sent) → Offer Accepted`
- Contract created (fast deal): `In Negotiation (Offer Sent) → Offer Accepted → Contract Pending → Closed Won`
- Contract created (normal): `Offer Accepted → In Negotiation (Contract Pending) → Closed Won`
- Contract date set: `Contract Pending → Closed Won` (auto-transition)
- Contract deleted: `Offer Accepted → In Negotiation (Offer Under Review)` (if auto-accepted)
- Third no-show: `Appointment Scheduled → Closed Lost`
- Delivery date set: Substatus `None → Awaiting Delivery`
- Delivery logged: Substatus `Awaiting Delivery → Delivered`

### 3. Stage Access Control
| Action | Available From |
|--------|---------------|
| Close as Won | Contract Pending only |
| Reopen | Closed Won, Closed Lost only |
| Select Vehicle | All active stages |
| Close as Lost | All stages except Closed Won/Lost |

### 4. Reopen Behavior
When reopening a closed opportunity:
- **If no offers exist** → Returns to `Qualified` stage
- **If offers exist** → Returns to `In Negotiation` stage with appropriate `negotiationSubstatus`:
  - If most recent offer is < 3 days old → `negotiationSubstatus = 'Offer Sent'`
  - If most recent offer is 3+ days old → `negotiationSubstatus = 'Offer Under Review'`
  - If any offer was accepted → `negotiationSubstatus = 'Offer Accepted'` (displays as standalone "Offer Accepted" status)
- Task rules are re-triggered based on the stage returned to

## Task Widgets Reference

| Widget | Trigger | Purpose |
|--------|---------|---------|
| **OOFB** | Qualified 7-13 days, no offers | Opportunity Offer Follow-up |
| **UFB** | Qualified 14+ days, no offers | Urgent Follow-up |
| **NS** | Appointment past, not completed | No-Show tracking (NS1/NS2/NS3) |
| **OFB** | Negotiation (Offer Under Review only) 5+ days, no contract | Offer Follow-up (shown in expanded view, not as primary status) |
| **NFU** | Negotiation (Offer Feedback only) 5+ days, no future apt | No Future Appointment (Schedule or Close) |
| **CFB** | Contract 7+ days, no delivery | Contract Follow-up |
| **DFB** | Delivery date set | Delivery Follow-up |
| **ABANDONED** | Opportunity inactive 30+ days | Abandonment warning |

## Implementation Files

```
Core Logic:
  ├─ src/composables/useOpportunityStateMachine.js (config)
  ├─ src/utils/stageMapper.js (stage calculation)
  └─ src/utils/opportunityRules.js (business rules)

UI:
  ├─ src/components/opportunities/OpportunityManagementWidget.vue
  ├─ src/components/shared/StageOwnerBar.vue (stage badges)
  └─ src/components/opportunities/tasks/*.vue (task widgets)
```

## Database Schema

```javascript
{
  stage: String,                    // 'Qualified', 'In Negotiation', 'Closed Won', 'Closed Lost'
  displayStage: String,             // Computed from stage + context (9 stages)
  negotiationSubstatus: String,     // null | 'Offer Sent' | 'Offer Under Review' | 'Awaiting Response' (legacy) | 'Offer Feedback' (legacy) | 'Offer Accepted' | 'Contract Pending' (displayed as "In Negotiation - Contract Pending")
  deliverySubstatus: String,        // null | 'Awaiting Delivery' | 'Delivered'
  contractDate: String,             // ISO date
  deliveryDate: String,             // ISO date
  callbackDate: String,             // ISO date
  offerAcceptanceDate: String,      // ISO date (when any offer was accepted)
  offerAcceptanceMethod: String,    // 'manual' | 'auto_via_contract' | null
  acceptedByUserId: Number,         // User ID who accepted the offer
  scheduledAppointment: Object,
  noShowCount: Number,              // 0-3 (in calendar events)
  offers: Array[{                   // Array of offer objects
    id: String,
    createdAt: String,              // ISO date
    vehicleBrand: String,
    vehicleModel: String,
    vehicleYear: Number,
    price: Number,
    status: String,                 // 'active' | 'accepted' | 'archived'
    acceptance_status: String,      // 'pending' | 'accepted' | 'rejected'
    acceptance_date: String,        // ISO date (when this offer was accepted)
    acceptance_method: String,      // 'manual' | 'auto_via_contract' | null
    accepted_by_user_id: Number,    // User ID who accepted this offer
    data: Object                    // Full offer details from OfferWidget
  }]
}
```

## Actionable Questions (Home Dashboard)

Generated for high-priority follow-ups:

- **appointment-followup**: Did appointment happen? (Yes/No)
- **ns-followup**: Reschedule after no-show? (Yes/No/Reassign)
- **offer-followup**: Follow up on pending offer (View)
- **stuck-opportunity**: Opportunity stuck in stage? (Yes/No/Reassign)
- **lead-qualification-urgency**: Qualify urgent lead? (Yes/No/Reassign)

Priority levels: CRITICAL (1), HIGH (2-3), MEDIUM (4+)

---

**Total Stages**: 10 (9 main + Abandoned)  
**Substatus Tracking**: Closed Won only  
**Badge Indicators**: In Negotiation only  
**Auto-Close Trigger**: NS3 (third no-show)

## Stage Distinctions

### Awaiting Appointment vs Appointment Scheduled

- **Awaiting Appointment**: Qualified opportunity with NO appointment scheduled. Primary action is to schedule an appointment. Shows OOFB/UFB widgets if no offers after 7+ days.

- **Appointment Scheduled**: Qualified opportunity WITH an appointment scheduled. Primary action is to view/reschedule the appointment. Shows NS (No-Show) widget if appointment is missed.
