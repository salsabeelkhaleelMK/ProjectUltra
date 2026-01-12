# Opportunity State Machine

## Flow Diagram

```mermaid
graph TD
    Q[Qualified] --> AA[Awaiting Appointment]
    Q --> TBC[To be Called Back]
    Q --> IN[In Negotiation]
    Q --> CL[Closed Lost]
    
    AA --> IN
    AA --> TBC
    AA --> Q
    AA -->|NS3| CL
    
    TBC --> AA
    TBC --> IN
    TBC --> CL
    
    IN -->|3 days since offer| NF[Needs Follow-up]
    IN --> CP[Contract Pending]
    IN --> CL
    
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
    style AA fill:#e9d5ff
    style TBC fill:#e0e7ff
    style IN fill:#fef3c7
    style NF fill:#fbcfe8
    style CP fill:#d1fae5
    style CW fill:#bbf7d0
    style CL fill:#fecaca
    style AB fill:#f3f4f6
```

## Stage Summary

| Stage | Color | Entry Trigger | Primary Action | Key Widget |
|-------|-------|---------------|----------------|------------|
| **Qualified** | Blue | Lead converted | Schedule Appointment | OOFB (7-13d), UFB (14+d) |
| **Awaiting Appointment** | Purple | Appointment set | View/Schedule Apt | NS (no-show tracking) |
| **To be Called Back** | Indigo | Callback set | Call Prospect | OOFB |
| **In Negotiation** | Yellow | First offer created | Follow Up on Offer | OFB (5+d), NFU (5+d) |
| **Needs Follow-up** | Pink | Offer pending (3+d) | Request Decision | OFB, NFU |
| **Contract Pending** | Emerald | Contract date set | Finalize Contract | CFB (7+d) |
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

## In Negotiation Badges

Visual indicators for offer freshness:

- **New Offer**: Offer created <1 day ago (Orange badge)
- **Active**: Offer 1-2 days old (Yellow badge)
- **None**: 3+ days triggers auto-transition to "Needs Follow-up"

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
- First offer created: `Qualified → In Negotiation`
- Offer pending 3 days: `In Negotiation → Needs Follow-up`
- Third no-show: `Awaiting Appointment → Closed Lost`
- Delivery date set: Substatus `None → Awaiting Delivery`
- Delivery logged: Substatus `Awaiting Delivery → Delivered`

### 3. Stage Access Control
| Action | Available From |
|--------|---------------|
| Close as Won | Contract Pending only |
| Reopen | Closed Won, Closed Lost only |
| Select Vehicle | All active stages |
| Close as Lost | All stages except Closed Won/Lost |

## Task Widgets Reference

| Widget | Trigger | Purpose |
|--------|---------|---------|
| **OOFB** | Qualified 7-13 days, no offers | Opportunity Offer Follow-up |
| **UFB** | Qualified 14+ days, no offers | Urgent Follow-up |
| **NS** | Appointment past, not completed | No-Show tracking (NS1/NS2/NS3) |
| **OFB** | Negotiation 5+ days, no contract | Offer Follow-up |
| **NFU** | Negotiation 5+ days, no future apt | No Future Appointment |
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
  stage: String,              // 'Qualified', 'In Negotiation', 'Closed Won', 'Closed Lost'
  displayStage: String,       // Computed from stage + context (9 stages)
  deliverySubstatus: String,  // null | 'Awaiting Delivery' | 'Delivered'
  contractDate: String,       // ISO date
  deliveryDate: String,       // ISO date
  callbackDate: String,       // ISO date
  scheduledAppointment: Object,
  noShowCount: Number         // 0-3 (in calendar events)
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

**Total Stages**: 9 (8 main + Abandoned)  
**Substatus Tracking**: Closed Won only  
**Badge Indicators**: In Negotiation only  
**Auto-Close Trigger**: NS3 (third no-show)
