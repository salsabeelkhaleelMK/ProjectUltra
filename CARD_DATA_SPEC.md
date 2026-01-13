# Card Data Specification for Designer

This document outlines all possible data fields that can appear on cards in the ProjectUltra CRM system, organized by card type.

## Card Types

1. **Task Cards** (Leads & Opportunities) - Used in "Tasks Due Today" widget
2. **Appointment Cards** - Used in "Appointments Today" widget
3. **Customer Cards** - Used in customer lists (optional, not currently in home widgets)

---

## 1. Task Cards (Leads & Opportunities)

### Core Data Fields

#### Always Present:
- **Customer Name** (`customer.name`) - Text, semibold, primary text color
- **Task Type** (`taskType`) - Text label (e.g., "Call", "Follow-up", "Email")
- **Type Badge** (`type`) - Either "Lead" or "Opportunity"
  - Lead: Blue badge (`bg-blue-50 text-blue-700 border-blue-200`)
  - Opportunity: Purple badge (`bg-purple-50 text-purple-700 border-purple-200`)
- **Stage/Status** (`stage` or `displayStage`) - Text label (e.g., "Open Lead", "Validated", "Qualified", "In Negotiation")

#### Conditional Fields:

**Priority Badge:**
- **Hot Priority** (`priority === 'Hot'`)
  - Red badge with fire icon: `bg-red-50 text-red-700 border border-red-200`
  - Text: "🔥 HOT"
- **Normal Priority** (`priority === 'Normal'` or no priority)
  - Gray badge: `bg-gray-50 text-gray-700 border border-gray-200`
  - Text: "Normal"

**Time Badge** (`dueTime`):
- **Overdue** (past due date)
  - Red: `bg-red-100 text-red-700 border border-red-200`
  - Text: Time (e.g., "14:30")
- **Urgent** (< 2 hours until due)
  - Orange: `bg-orange-100 text-orange-700 border border-orange-200`
  - Text: Time (e.g., "15:00")
- **Normal** (2+ hours until due)
  - Blue: `bg-blue-100 text-blue-700 border border-blue-200`
  - Text: Time (e.g., "16:00")

**Overdue Badge** (`isOverdue === true`):
- Red badge: `bg-red-100 text-red-700 border border-red-200`
- Text: "OVERDUE"

**Vehicle Information** (`requestedCar` or `vehicle`):
- Format: "Brand Model" (e.g., "Audi A6 Allroad", "BMW iX xDrive50")
- Only shown if vehicle exists

**Action Button:**
- Chevron right icon (→) - Right-aligned, gray, hover: blue

---

## 2. Appointment Cards

### Core Data Fields

#### Always Present:
- **Customer Name/Title** (`customer` or `title`) - Text, semibold, primary text color
- **Appointment Type** (`type`) - Text label (e.g., "Test Drive", "Consultation", "Delivery")
- **Assignee** (`assignee` or `team`) - Text with user icon
  - Format: "👤 [Name]" or "👤 [Team] Team"
  - Falls back to "Unassigned" if no assignee

#### Conditional Fields:

**Time Badge** (`time`):
- **Past** (appointment time passed)
  - Red: `bg-red-100 text-red-700 border border-red-200`
  - Text: Time (e.g., "09:00")
- **Urgent** (< 2 hours until appointment)
  - Orange: `bg-orange-100 text-orange-700 border border-orange-200`
  - Text: Time (e.g., "14:00")
- **Normal** (2+ hours until appointment)
  - Blue: `bg-blue-100 text-blue-700 border border-blue-200`
  - Text: Time (e.g., "16:00")

**Status Badge** (`status`):
- **Confirmed** (`status === 'confirmed'`)
  - Green: `bg-green-50 text-green-700 border border-green-200`
  - Text: "confirmed"
- **Scheduled** (`status === 'scheduled'`)
  - Blue: `bg-blue-50 text-blue-700 border border-blue-200`
  - Text: "scheduled"
- **Pending** (`status === 'pending'`)
  - Yellow: `bg-yellow-50 text-yellow-700 border border-yellow-200`
  - Text: "pending"
- **Cancelled** (`status === 'cancelled'`)
  - Red: `bg-red-50 text-red-700 border border-red-200`
  - Text: "cancelled"
- **No-Show** (`status === 'no-show'`)
  - Gray: `bg-gray-50 text-gray-700 border border-gray-200`
  - Text: "no-show"

**Vehicle Information** (`vehicle`):
- Format: " - Brand Model" (e.g., " - Audi Q4 e-tron")
- Only shown if vehicle exists

**Action Button:**
- Chevron right icon (→) - Right-aligned, gray, hover: blue

---

## 3. Possible Tags

Tags can appear on customer records and may be displayed on cards:

- `'Premium'` - High-value customer
- `'Hot'` - Urgent/high-priority
- `'Urgent'` - Time-sensitive
- `'VIP'` - Very important person
- `'Referral'` - Referred by existing customer
- `'Corporate'` - Business/company customer
- `'Automation'` - Interested in automation features
- `'Performance'` - Performance-focused buyer
- `'High-Value'` - High budget range

**Note:** Tags are currently not displayed on task/appointment cards but may be added in the future.

---

## Sample Card Designs

### Sample 1: Lead Task Card - Hot Priority, Urgent Time, Overdue

```
┌─────────────────────────────────────────────────┐
│ [🔥 HOT] [14:30] [OVERDUE]                      │
│                                                  │
│ Josh Adams                                       │
│ Call - Audi A6 Allroad                           │
│                                                  │
│ [Lead] Open Lead                          [→]    │
└─────────────────────────────────────────────────┘
```

**Data:**
- Priority: Hot
- Due Time: 14:30 (overdue - red badge)
- Overdue: true
- Customer: Josh Adams
- Task Type: Call
- Vehicle: Audi A6 Allroad
- Type: Lead
- Stage: Open Lead

---

### Sample 2: Opportunity Task Card - Normal Priority, Urgent Time

```
┌─────────────────────────────────────────────────┐
│ [Normal] [15:00]                                 │
│                                                  │
│ Emma Wilson                                      │
│ Follow-up - BMW iX xDrive50                      │
│                                                  │
│ [Opportunity] In Negotiation              [→]   │
└─────────────────────────────────────────────────┘
```

**Data:**
- Priority: Normal
- Due Time: 15:00 (urgent - orange badge, < 2 hours)
- Overdue: false
- Customer: Emma Wilson
- Task Type: Follow-up
- Vehicle: BMW iX xDrive50
- Type: Opportunity
- Stage: In Negotiation

---

### Sample 3: Appointment Card - Confirmed, Normal Time

```
┌─────────────────────────────────────────────────┐
│ [16:00] [confirmed]                              │
│                                                  │
│ Marco Rossi                                      │
│ Test Drive - Audi Q4 e-tron                     │
│                                                  │
│ 👤 Salsabeel Khaleel                      [→]   │
└─────────────────────────────────────────────────┘
```

**Data:**
- Time: 16:00 (normal - blue badge, 2+ hours away)
- Status: confirmed (green badge)
- Customer: Marco Rossi
- Type: Test Drive
- Vehicle: Audi Q4 e-tron
- Assignee: Salsabeel Khaleel

---

## Visual Specifications

### Badge Styling
- **Size**: `text-xs font-bold` or `text-xs font-medium`
- **Padding**: `px-2 py-0.5`
- **Border Radius**: `rounded`
- **Border**: `border` (1px)
- **Icon Size**: `text-[9px]` or `text-[10px]` for small icons

### Typography
- **Customer Name**: `text-sm font-semibold text-slate-800` (or `text-gray-900`)
- **Task/Appointment Type**: `text-xs text-gray-600`
- **Stage/Status Text**: `text-xs text-gray-500`

### Spacing
- **Card Padding**: `p-4`
- **Gap between elements**: `gap-2` or `gap-4`
- **Border**: `border border-gray-200`
- **Border Radius**: `rounded-lg`
- **Hover**: `hover:border-blue-300 hover:shadow-sm`

### Colors Reference

**Priority Badges:**
- Hot: `bg-red-50 text-red-700 border-red-200`
- Normal: `bg-gray-50 text-gray-700 border-gray-200`

**Time Badges:**
- Overdue/Past: `bg-red-100 text-red-700 border-red-200`
- Urgent (< 2h): `bg-orange-100 text-orange-700 border-orange-200`
- Normal (2+ h): `bg-blue-100 text-blue-700 border-blue-200`

**Type Badges:**
- Lead: `bg-blue-50 text-blue-700 border-blue-200`
- Opportunity: `bg-purple-50 text-purple-700 border-purple-200`

**Status Badges (Appointments):**
- Confirmed: `bg-green-50 text-green-700 border-green-200`
- Scheduled: `bg-blue-50 text-blue-700 border-blue-200`
- Pending: `bg-yellow-50 text-yellow-700 border-yellow-200`
- Cancelled: `bg-red-50 text-red-700 border-red-200`
- No-Show: `bg-gray-50 text-gray-700 border-gray-200`

---

## Card Layout Structure

### Task Card Layout:
```
[Priority Badge] [Time Badge] [Overdue Badge?]
[Customer Name]
[Task Type] - [Vehicle?]
[Type Badge] [Stage Text]                    [→]
```

### Appointment Card Layout:
```
[Time Badge] [Status Badge]
[Customer Name/Title]
[Appointment Type] - [Vehicle?]
👤 [Assignee/Team]                          [→]
```

---

## Edge Cases to Consider

1. **No Vehicle**: Omit vehicle information entirely
2. **No Due Time**: Don't show time badge
3. **No Assignee**: Show "Unassigned" text
4. **Long Customer Names**: Truncate with ellipsis (`truncate`)
5. **Multiple Badges**: Badges wrap to next line on mobile
6. **Empty State**: Show empty state message if no cards

---

## Implementation Notes

- Cards are clickable (entire card has `cursor-pointer`)
- Hover effect: border color changes to blue, slight shadow
- Right-aligned chevron button for navigation
- Mobile-responsive: badges may wrap, text truncates
- All badges use semantic color classes (no arbitrary values)

