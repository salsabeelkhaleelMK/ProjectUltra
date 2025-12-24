<!-- 173fa748-99ed-4b66-b250-6eb90ac2eb8b 8fb2a68a-dbfe-495f-9041-47daaf993773 -->
# Refactor LQWidget Layout and Flow

## Overview

Restructure the Lead Qualification Widget to improve UX flow and layout. Key changes include reorganizing the "Interested" outcome section, adding purchase method/trade-in buttons, making the note widget borderless, inlining schedule appointment, and simplifying the call flow.

## Changes

### 1. Reorganize "Interested" Outcome Layout

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- Change the grid layout from side-by-side (`grid-cols-1 md:grid-cols-2`) to a column layout
- Move "Customer Preferences" section to appear below "Assign to salesman" section
- Structure: Assignment section (full width) → Customer Preferences section (full width) → Action buttons

### 2. Add Purchase Method and Trade-in Buttons

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- Add two buttons under "Customer Preferences" section:
  - "Add purchase method" button
  - "Add trade-in" button
- Both buttons should emit events to open modals (similar to how TaskShell handles `overviewModalType`)
- The modals will be handled by the parent component (`LeadManagementWidget` or `TaskShell`)

### 3. Make Note Widget Borderless

**File:** [`src/components/tasks/widgets/NoteWidget.vue`](src/components/tasks/widgets/NoteWidget.vue)

- Add optional prop `borderless` (default: `false`)
- When `borderless` is `true`:
  - Remove border, shadow, and rounded corners from outer container
  - Remove the arrow decoration (absolute positioned triangle)
  - Keep the close button inline in the header
  - Maintain all functionality

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- Pass `borderless` prop to `NoteWidget` when used in the "Interested" section

### 4. Inline Schedule Appointment

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- When "Schedule an appointment" button is clicked, show `ScheduleAppointmentWidget` inline (not in a modal)
- Add state `showScheduleAppointment` to control visibility
- Position the widget inline within the "Interested" outcome section
- This should work for all task types (leads and opportunities)

**File:** [`src/components/tasks/widgets/ScheduleAppointmentWidget.vue`](src/components/tasks/widgets/ScheduleAppointmentWidget.vue)

- Ensure the widget can be used inline (it already supports this via `show` prop)

### 5. Simplify Call Flow

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- Remove the intermediate "Call Interface" step (`showCallInterface`)
- Move call action buttons directly to the main action card:
  - "Call" / "Call Again" button → directly starts call simulation
  - "Log Call Outcome" button → directly shows outcome selection
  - "Postpone Task" button → unchanged
- When call ends, immediately show outcome selection (remove "Continue to Outcome" button)
- Remove `proceedToOutcome` function and related UI

**Flow changes:**

- Before: Click "Initial Call" → Show call interface → Start call → End call → "Continue to Outcome" → Show outcome selection
- After: Click "Initial Call" → Start call simulation inline → End call → Show outcome selection immediately

### 6. Inline Call Simulation

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- Keep call simulation inline (already done)
- When call ends (`callEnded = true`), automatically show outcome selection (`showOutcomeSelection = true`)
- Remove the "Call Ended" section with "Continue to Outcome" button
- Remove `showCallInterface` state and related UI

## Implementation Details

### State Management

```javascript
// Remove:
const showCallInterface = ref(false)

// Keep/Add:
const showScheduleAppointment = ref(false)
const showPurchaseMethodModal = ref(false)
const showTradeInModal = ref(false)
```

### Layout Structure (Interested Outcome)

```
<div v-if="selectedOutcome === 'interested'">
  <!-- Assignment Section (full width) -->
  <div>Assign to salesman...</div>
  
  <!-- Customer Preferences Section (full width, below assignment) -->
  <div>
    <h5>Customer preferences</h5>
    <div>Checkboxes...</div>
    <div class="flex gap-2">
      <button>Add purchase method</button>
      <button>Add trade-in</button>
    </div>
  </div>
  
  <!-- Notes Section (borderless) -->
  <NoteWidget :borderless="true" />
  
  <!-- Schedule Appointment (inline, conditional) -->
  <ScheduleAppointmentWidget v-if="showScheduleAppointment" />
  
  <!-- Action Buttons -->
  <div>Cancel, Finish without appointment, Schedule an appointment</div>
</div>
```

### Call Flow Logic

```javascript
const startCall = () => {
  // Start call simulation directly (no intermediate step)
  isCallActive.value = true
  callDuration.value = 0
  // ... start interval
}

const endCall = () => {
  isCallActive.value = false
  callEnded.value = true
  callData.value = { ... }
  
  // Immediately show outcome selection
  showOutcomeSelection.value = true
}
```

## Additional Requirements

### 7. Add Quick Action Button to ContactInfo Card

**File:** [`src/components/tasks/widgets/ContactInfo.vue`](src/components/tasks/widgets/ContactInfo.vue)

- Add a blue button with a plus icon before and next to the expander arrow
- Button should match the style of AddNewButton (blue background, white plus icon)
- Position: In the same flex container as the expander arrow, before it
- On click, show a dropdown menu (similar to AddNewButton) with all possible actions:
  - Note
  - Purchase Method
  - Trade-in
  - Attachment
  - WhatsApp msg
  - Email
  - SMS
  - Appointment
- Reuse the dropdown styling and click-outside logic from AddNewButton
- Emit an event when an action is selected (parent component will handle the action)

**File:** [`src/components/tasks/TaskShell.vue`](src/components/tasks/TaskShell.vue)

- Listen for action events from ContactInfo component
- Handle each action type (open corresponding widget/modal)

### 8. Move Postpone Task to Separate Step Entry

**File:** [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

- Remove "Postpone Task" button from the main action buttons row
- Create a new separate widget/card that looks like a step entry (similar to other task widgets)
- Style it to match the appearance of other step widgets (e.g., NSWidget, UFBWidget)
- Position it in the "Manage Next Steps" section (parent component will handle placement)
- The widget should:
  - Have the same card styling as other step widgets (bg-white border border-gray-200 rounded-lg p-4)
  - Show "Postpone Task" as the title/action
  - Include a description/context
  - Have a button to trigger the postpone action (opens RescheduleWidget)

**File:** [`src/components/tasks/leads/LeadManagementWidget.vue`](src/components/tasks/leads/LeadManagementWidget.vue)

- Add the new PostponeTaskWidget as a separate entry in the space-y-6 container
- Position it appropriately in the sequence of widgets

## Files to Modify

1. [`src/components/tasks/leads/tasks/LQWidget.vue`](src/components/tasks/leads/tasks/LQWidget.vue)

   - Reorganize "Interested" outcome layout
   - Add purchase method/trade-in buttons
   - Simplify call flow
   - Add inline schedule appointment
   - Use borderless NoteWidget
   - Remove "Postpone Task" button from action row
   - Create PostponeTaskWidget component (or extract to separate file)

2. [`src/components/tasks/widgets/NoteWidget.vue`](src/components/tasks/widgets/NoteWidget.vue)

   - Add `borderless` prop
   - Conditionally apply border/shadow/arrow styles

3. [`src/components/tasks/widgets/ContactInfo.vue`](src/components/tasks/widgets/ContactInfo.vue)

   - Add blue plus button before expander arrow
   - Add dropdown menu with all action options
   - Emit action events

4. [`src/components/tasks/TaskShell.vue`](src/components/tasks/TaskShell.vue)

   - Handle action events from ContactInfo
   - Route actions to appropriate widgets/modals

5. [`src/components/tasks/leads/LeadManagementWidget.vue`](src/components/tasks/leads/LeadManagementWidget.vue)

   - Add PostponeTaskWidget as separate entry
   - Handle postpone events

## Files to Review (No Changes Expected)

- [`src/components/tasks/widgets/ScheduleAppointmentWidget.vue`](src/components/tasks/widgets/ScheduleAppointmentWidget.vue) - Already supports inline usage
- [`src/components/tasks/widgets/PurchaseMethodWidget.vue`](src/components/tasks/widgets/PurchaseMethodWidget.vue) - Will be opened via modal (handled by parent)
- [`src/components/tasks/widgets/TradeInWidget.vue`](src/components/tasks/widgets/TradeInWidget.vue) - Will be opened via modal (handled by parent)