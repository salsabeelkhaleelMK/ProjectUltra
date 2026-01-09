# ProjectUltra CRM

## Project Overview

A Vue 3-based CRM application for automotive dealerships with unified task management for leads and opportunities, including vehicle tracking, offer management, appointment scheduling, and sales workflow automation.

## Tech Stack

- **Frontend**: Vue 3 (Composition API with `<script setup>`), Pinia, Vue Router, Tailwind CSS
- **Calendar**: FullCalendar Vue component
- **Deployment**: Netlify (builds from source: `npm run build`)
- **Architecture**: Component-based with centralized mock data layer, reusable widgets, composables for shared logic
- **Icons**: Font Awesome
- **Build Tool**: Vite

## Prerequisites

- **Node.js** (LTS version recommended)
- **AWS CLI** configured with access to CodeArtifact
  - Required for accessing private npm packages from MotorK's CodeArtifact repository
  - Ensure AWS credentials are configured: `aws configure`
  - The build process will automatically authenticate with CodeArtifact before installation

## Quick Start

### Starting the App
```bash
npm install  # Automatically authenticates with AWS CodeArtifact
npm run dev
# Visit: http://localhost:5173/
```

### Manual CodeArtifact Authentication
If you need to authenticate manually:
```bash
npm run auth:codeartifact
```

### Building for Production
```bash
npm run build  # Automatically authenticates before building
# Creates dist/ folder for deployment
```

### Navigation
- **Left Sidebar**: Icon-based navigation between sections
- **Tasks**: Unified view for leads and opportunities (`/tasks`)
- **Pipeline**: Kanban-style sales funnel (`/pipeline`)
- **Calendar**: FullCalendar integration (`/calendar`)
- **Reports**: Dashboard with KPIs (`/reports`)

### Testing Different Views
- **Tasks**: Click any task in the left sidebar to view details
- **Pipeline**: View sales stages and conversion metrics
- **Calendar**: Create events, drag-and-drop scheduling
- **Reports**: View team performance and analytics
Key Architecture Patterns
1. Unified Task System
Single View: TaskDetail.vue handles both leads and opportunities
Route: /tasks/:id?type=lead or /tasks/:id?type=opportunity
Composite Selection: Uses { id, type } to uniquely identify tasks across stores
Shared Shell: TaskShell.vue provides common layout (contact info, stage bar, tabs, add new button, feed)
2. Component Hierarchy
TaskDetail.vue (router entry)  └─ EntityListSidebar.vue (task list)  └─ TaskDetailContent.vue (decides which config/widgets to use)      └─ TaskShell.vue (shared layout shell)          ├─ ContactInfo.vue          ├─ StageOwnerBar.vue          ├─ LeadManagementWidget.vue OR OpportunityManagementWidget.vue          ├─ Feed widgets (VehicleWidget, OffersCarousel, etc.)          └─ Inline widgets (NoteWidget, AttachmentWidget, etc.)
3. Reusable Composables
useTaskInlineWidgets.js: Centralizes inline widget state and handlers (add/edit/delete activities, show/hide widgets, tab filtering)
useTaskTabs.js: Maps activity types to tabs (note, communication, attachment, overview)
4. Store Adapters
Both useLeadsStore and useOpportunitiesStore expose:
currentActivities (computed)
addActivity(taskId, data)
updateActivity(taskId, activityId, data)
deleteActivity(taskId, activityId)
Core Features
Leads
Management Widget: LeadManagementWidget.vue
Call simulation with live transcription
Extract info from transcription (adds notes, trade-ins, financing)
Postpone/reschedule
Create opportunity from lead
Overview Add New Actions: Trade-in, Financing, Requested Car (modals)
Tabs: Overview, Notes, Communication, Attachment
Opportunities
Management Widget: OpportunityManagementWidget.vue
Vehicle Actions (grouped):
Add requested vehicle to opportunity
Add vehicle from stock (Coming Soon modal)
Configure vehicle (Coming Soon modal)
Create offer (modal with requested/recommended cars)
Time-Based Task Widgets (conditional rendering):
OOFB (Open Opportunity Feedback): Qualified stage, 7-13 days, no offers
UFB (Unsold Feedback): Qualified stage, 14+ days, no offers
NFU (No Follow-Up): In Negotiation, X days, no contract, no future appointment
OFB (Offer Feedback): In Negotiation, X days, no contract
CFB (Contract Feedback): Contract date set, 7+ days, no delivery
DFB (Delivery Feedback): 3+ days after delivery date
Risk Warning: Shows if Qualified opportunity with appointment is taking too long
Appointment Widget: Shows confirmed/scheduled appointments with postpone toggle
Stages: Qualified → In Negotiation (on first offer) → Closed Won
Overview Pinned: Management widget, Offers carousel (if any), Requested car
Tabs: Overview, Notes, Communication, Attachment
Shared Functionality
Hot Flag: Mark/unmark tasks as hot (works for both leads and opportunities)
Requested Car: VehicleWidget.vue - shows car details, stock status, request message
Offers: OffersCarousel.vue - horizontal carousel with main offer badge
Recommended Cars: RecommendedCarsSlider.vue - shows alternatives with "Add to opportunity" CTA (creates offer)
Activities: Notes, Attachments, Communications (email/SMS/WhatsApp), Trade-ins, Financing, Appointments
Feed: All activities displayed as FeedItemCard.vue with edit/delete actions
Contact Info: ContactInfo.vue - expandable card with contact actions (call, email, WhatsApp, SMS)
Critical Business Logic
Offer Creation Triggers Stage Transition
Adding any vehicle (requested, from stock, configured, or recommended) to an opportunity automatically:
Creates an offer with that vehicle
Transitions opportunity from "Qualified" → "In Negotiation"
Activates negotiation-stage task widgets (OFB, NFU)
Appointment Confirmed = Remove Schedule CTA
If appointment status is "confirmed", hide "Schedule appointment" button
Show AppointmentWidget in the feed instead
Time-Based Task Priority
Risk Warning > UFB > OOFB > NFU > OFB > CFB > DFB
Key Components
Shared (src/components/shared/)
TaskShell.vue - Unified task layout shell
ContactInfo.vue - Expandable contact card
StageOwnerBar.vue - Stage/owner/source/probability chips
AddNewButton.vue - Context-aware dropdown (changes actions per tab/type)
ScheduleAppointmentWidget.vue - Modal for scheduling (reused across widgets)
RescheduleWidget.vue - Inline postpone form
VehicleWidget.vue - Requested car display
ComingSoonModal.vue - Placeholder modal
ActivitySummarySidebar.vue - Right sidebar with activity timeline
EntityListSidebar.vue - Left sidebar task list
Tabs.vue - Tab component with counts
Widgets (src/components/widgets/)
NoteWidget.vue, AttachmentWidget.vue, CommunicationWidget.vue
TradeInWidget.vue, FinancingWidget.vue
OfferWidget.vue - Create/edit offers (shows requested/recommended cars)
AppointmentWidget.vue - Display appointment details in feed
OffersCarousel.vue - Horizontal carousel of offers
RecommendedCarsSlider.vue - Horizontal carousel of in-stock alternatives
Opportunity Task Widgets (src/components/opportunities/)
OpportunityManagementWidget.vue - Main opportunity action hub
OOFBWidget.vue, UFBWidget.vue, NFUWidget.vue, OFBWidget.vue, CFBWidget.vue, DFBWidget.vue
Lead Management
LeadManagementWidget.vue - Call/transcription/postpone/create opportunity
Feed
FeedItemCard.vue - Unified feed card renderer (handles all activity types)
Styling Rules (Tailwind)
NO arbitrary values (w-[350px], text-[14px]) - use semantic classes only
Colors: text-primary, bg-surface, border-border (from tailwind.config.js)
Spacing: Use standard scale (p-4, gap-6, mt-8)
Mobile-first: class="flex flex-col md:flex-row"
No rounded corners on square buttons: Overview "Add New" button is blue and square; other tabs have gray rounded buttons
Data Layer (src/api/mockData.js)
All sample entities: mockLeads, mockOpportunities, mockVehicles, mockEvents
All opportunity.stage values: "Qualified", "In Negotiation", "Closed Won" (never "Open")
All contacts have address field
All opportunities have priority field (supports hot flag)
Activities array includes: notes, calls, emails, trade-ins, financing, appointments, etc.
Routing
/tasks - Main task list view
/tasks/:id?type=lead - Lead task detail
/tasks/:id?type=opportunity - Opportunity task detail
/pipeline - Kanban-style pipeline view
/calendar - FullCalendar with filters and connection modal
/reports - Reports dashboard (formerly "Dashboard")
Recent Refactors
Unified Leads & Opportunities into single Tasks view
Extracted TaskShell.vue to eliminate duplication between LeadContent.vue and OpportunityContent.vue
Created composables (useTaskInlineWidgets, useTaskTabs) for shared logic
Deleted redundant views: Leads.vue, Opportunities.vue, LeadDetail.vue, OpportunityDetail.vue, LeadContent.vue, OpportunityContent.vue, old dashboard files
Removed console.log statements and unused code across the project
Calendar refactor: Extracted CalendarConnectModal.vue
## Data Layer

All sample entities are in `src/api/mockData.js`:
- `mockLeads` - Lead data with customer info and requested vehicles
- `mockOpportunities` - Opportunity data with stages and vehicles
- `mockVehicles` - Vehicle inventory
- `mockContacts` - Contact database
- `mockCalendarEvents` - Calendar appointments and events

### Replacing Mock Data with Real API

The API layer is ready for backend integration. Simply replace functions in `src/api/*.js` files:

```javascript
// Example: src/api/leads.js
export const fetchLeads = async (filters) => {
  // Replace mock data with real API call
  return axios.get('/api/leads', { params: filters })
}
```

No changes needed in components or stores - they already use the API layer.

## Build & Deploy

- **Local**: `npm run build` (creates `dist/`)
- **Netlify**: Configured in `netlify.toml` with AWS CLI installation and CodeArtifact authentication
  - Required environment variables in Netlify:
    - `AWS_ACCESS_KEY_ID_MK` - Your AWS access key
    - `AWS_SECRET_ACCESS_KEY_MK` - Your AWS secret key
  - The build automatically installs AWS CLI and authenticates with CodeArtifact before building
- **.gitignore**: Excludes `node_modules`, `dist/`, log files

## Troubleshooting

### If server isn't running:
```bash
npm run dev
```

### If you see errors:
```bash
npm install
npm run dev
```

### To rebuild from scratch:
```bash
rm -rf node_modules
npm install
npm run dev
```

## Project Status

- ✅ Unified task system (leads + opportunities)
- ✅ Time-based task widgets (OOFB, UFB, NFU, OFB, CFB, DFB, NS)
- ✅ Survey/feedback system
- ✅ Close as Lost functionality
- ✅ Requalify/Reopen CTAs
- ✅ Registration stage workflow
- ✅ Hot flag functionality for leads and opportunities
- ✅ Mock data layer ready for API replacement

## Notes

- All cursor project rules are documented in `.cursor/rules/project-ultra-rules.mdc`
- Opportunity lifecycle workflow is fully implemented with time-based task triggers
- Component architecture follows Vue 3 Composition API best practices