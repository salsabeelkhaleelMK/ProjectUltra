# Component Migration Plan: Custom CSS to Motork UI

## Overview

This document outlines the components that need to be migrated from custom CSS classes to Motork UI library components, following the CSS modernization completed on 2026-01-26.

## Migration Status

**Completed:**
- ✅ CSS structure modernized with Tailwind v4
- ✅ Build system updated to use `@tailwindcss/vite`
- ✅ Clean `main.css` created with essential variables only
- ✅ Old `style.css` archived as backup
- ✅ `tailwind.config.js` removed (CSS-based config in v4)
- ✅ Syntax errors fixed in Settings.vue and Request.vue
- ✅ Import errors fixed (Toast, TextInput → Input)

**Pending:**
- 🔄 Migrate components from custom classes to Motork UI primitives

---

## Custom Classes to Replace

### 1. Card Components

**Custom Classes:**
- `.card`, `.card-hover`
- `.page-card`, `.dashboard-card`

**Replace With:**
```vue
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <!-- Content -->
  </CardContent>
</Card>
```

**Import:**
```js
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
```

### 2. Button Components

**Custom Classes:**
- `.btn-primary`, `.btn-secondary`
- `.btn-outline`, `.btn-ghost`

**Replace With:**
```vue
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
```

**Import:**
```js
import { Button } from '@motork/component-library/future/primitives'
```

### 3. Input Components

**Custom Classes:**
- `.input`, `.input-with-icon`
- `textarea.input`

**Replace With:**
```vue
<Input v-model="value" placeholder="Enter text..." />
<Textarea v-model="text" placeholder="Enter description..." />
```

**Import:**
```js
import { Input, Textarea } from '@motork/component-library/future/primitives'
```

### 4. Badge Components

**Custom Classes:**
- `.badge`, `.badge-primary`, `.badge-success`, `.badge-warning`

**Replace With:**
```vue
<Badge :text="label" theme="default" />
<Badge :text="label" theme="green" />
<Badge :text="label" theme="orange" />
```

**Import:**
```js
import { Badge } from '@motork/component-library/future/primitives'
```

### 5. Typography Classes

**Custom Classes:**
- `.heading-main`, `.heading-sub`
- `.text-meta`, `.text-meta-bold`

**Replace With:**
- Use Tailwind utility classes: `text-lg font-semibold`, `text-sm font-medium`
- Use fluid typography utilities: `text-fluid-lg`, `text-fluid-sm`

---

## Components Requiring Migration

### High Priority (Core UI Components)

#### Views (5 files)
1. **src/views/Home.vue**
   - Custom cards, buttons
   - Est. effort: 2-3 hours

2. **src/views/Tasks.vue**
   - Task cards, buttons, inputs
   - Est. effort: 2-3 hours

3. **src/views/Calendar.vue**
   - Event cards, buttons
   - Est. effort: 1-2 hours

4. **src/views/Settings.vue**
   - Forms, inputs, buttons
   - Status: Partially migrated (uses Toggle, Checkbox from Motork)
   - Est. effort: 1 hour

5. **src/views/AccessDenied.vue**
   - Buttons, cards
   - Est. effort: 30 minutes

#### Shared Components (10 files)
1. **src/components/shared/Request.vue**
   - Status: Partially migrated (uses Card, CardHeader, CardContent, Badge, Button)
   - Remaining: Verify all buttons use Motork variant props
   - Est. effort: 30 minutes

2. **src/components/shared/SectionCard.vue**
   - Card component wrapper
   - Est. effort: 1 hour

3. **src/components/shared/vehicles/VehiclesCarousel.vue**
   - Cards, buttons
   - Est. effort: 1-2 hours

4. **src/components/shared/communication/** (4 files)
   - EmailForm.vue
   - SMSForm.vue
   - CallForm.vue
   - WhatsAppForm.vue
   - Forms, inputs, textareas, buttons
   - Est. effort: 2-3 hours each

5. **src/components/shared/forms/CreateEventForm.vue**
   - Form inputs, buttons
   - Est. effort: 1-2 hours

6. **src/components/shared/layout/EntityDetailLayout.vue**
   - Layout cards, buttons
   - Est. effort: 1 hour

7. **src/components/shared/communication/AppointmentCommunications.vue**
   - Cards, buttons
   - Est. effort: 1 hour

#### Customer Components (11 files)
1. **src/components/customer/CustomerSummaryWidget.vue**
2. **src/components/customer/CustomerLeadsWidget.vue**
3. **src/components/customer/CustomerOpportunitiesWidget.vue**
4. **src/components/customer/CustomerAppointmentsWidget.vue**
5. **src/components/customer/RecentActivitiesWidget.vue**
6. **src/components/customer/SuggestedNextAction.vue**
7. **src/components/customer/SurveyWidget.vue**
8. **src/components/customer/widgets/CustomerContactHeader.vue**
9. **src/components/customer/feed/FeedItemCard.vue**
10. **src/components/customer/activities/** (5 files)
    - TradeInWidget.vue
    - PurchaseMethodWidget.vue
    - NoteWidget.vue
    - FinancingWidget.vue
    - OfferWidget.vue

**Est. effort per component:** 1-2 hours

#### Task Components (10 files)
1. **src/components/tasks/TaskCard.vue**
2. **src/components/tasks/TasksList.vue**
3. **src/components/tasks/TasksTableView.vue**
4. **src/components/tasks/TaskDetailView.vue**
5. **src/components/tasks/TaskRequestOverviewTab.vue**
6. **src/components/tasks/VehicleRequestCard.vue**
7. **src/components/tasks/TaskAssignee.vue**
8. **src/components/tasks/CustomerRelatedTasksWidget.vue**
9. **src/components/tasks/shared/PrimaryActionWidget.vue**
10. **src/components/tasks/lead/** (2 files)
    - LeadManagementWidget.vue
    - CallInterface.vue
    - LQTask.vue
11. **src/components/tasks/opportunity/OpportunityManagementWidget.vue**

**Est. effort per component:** 1-2 hours

### Medium Priority (Modals)

#### Modal Components (13 files)
1. **src/components/modals/CallbackSchedulerModal.vue**
2. **src/components/modals/VehicleSelectionModal.vue**
3. **src/components/modals/ScheduleAppointmentModal.vue**
4. **src/components/modals/AddRequestedCarModal.vue**
5. **src/components/modals/AddVehicleModal.vue**
6. **src/components/modals/PurchaseMethodModal.vue**
7. **src/components/modals/ContractDateModal.vue**
8. **src/components/modals/CloseAsLostModal.vue**
9. **src/components/modals/AddCustomerModal.vue**
10. **src/components/modals/DeliveryModal.vue**
11. **src/components/modals/EditEventModal.vue**
12. **src/components/modals/RequestedCarModal.vue**
13. **src/components/modals/QuickViewEventModal.vue**

**Note:** These modals should use Motork Dialog primitives:
```js
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@motork/component-library/future/primitives'
```

**Est. effort per modal:** 1-2 hours

### Low Priority (Supporting Components)

#### Calendar Components (1 file)
1. **src/components/calendar/CalendarEventDetails.vue**
   - Cards, buttons
   - Est. effort: 1 hour

#### Reports Components (3 files)
1. **src/components/reports/PageViewsChart.vue**
2. **src/components/reports/PageViewsByVehicle.vue**
3. **src/components/reports/AIInsightsSidebar.vue**
   - Est. effort: 1 hour each

#### Home Components (1 file)
1. **src/components/home/PerformanceWidget.vue**
   - Est. effort: 1 hour

#### Add New Components (1 file)
1. **src/components/addnew/IntegrationCard.vue**
   - Status: Partially migrated (uses Button, Input)
   - Est. effort: 30 minutes

#### Layout Components (1 file)
1. **src/components/layout/IconSidebar.vue**
   - Est. effort: 1 hour

---

## Migration Strategy

### Phase 1: High Priority Views (Week 1)
- Migrate main views (Home, Tasks, Calendar, Settings, AccessDenied)
- Test thoroughly after each view migration
- **Total: ~10-15 hours**

### Phase 2: Shared Components (Week 2)
- Migrate shared components (Request, SectionCard, forms, communication)
- These are used across multiple views, so impact is high
- **Total: ~15-20 hours**

### Phase 3: Customer & Task Components (Week 3-4)
- Migrate customer widgets and task components
- These are feature-specific but heavily used
- **Total: ~25-35 hours**

### Phase 4: Modals (Week 5)
- Migrate all modal components to use Dialog primitives
- **Total: ~15-20 hours**

### Phase 5: Supporting Components (Week 6)
- Migrate calendar, reports, and other supporting components
- **Total: ~8-12 hours**

---

## Migration Checklist Per Component

- [ ] Identify all custom CSS classes used
- [ ] Replace card classes with `<Card>` component
- [ ] Replace button classes with `<Button variant="...">` component
- [ ] Replace input classes with `<Input>` or `<Textarea>` component
- [ ] Replace badge classes with `<Badge>` component
- [ ] Replace typography classes with Tailwind utilities
- [ ] Update imports to include Motork primitives
- [ ] Test component in isolation
- [ ] Test component in parent views
- [ ] Verify responsive behavior
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Update component documentation/comments
- [ ] Remove unused custom CSS classes

---

## Testing Requirements

After each migration:
1. **Visual Testing:** Verify UI looks correct on desktop, tablet, mobile
2. **Functional Testing:** Ensure all interactions work (clicks, form submissions, etc.)
3. **Regression Testing:** Check that related components still work
4. **Build Testing:** Run `npm run build` to ensure no errors
5. **Accessibility Testing:** Check keyboard navigation and screen reader support

---

## Estimated Total Effort

- **Phase 1 (High Priority Views):** 10-15 hours
- **Phase 2 (Shared Components):** 15-20 hours
- **Phase 3 (Customer & Task Components):** 25-35 hours
- **Phase 4 (Modals):** 15-20 hours
- **Phase 5 (Supporting Components):** 8-12 hours

**Grand Total:** ~75-105 hours (approximately 2-3 sprints)

---

## Benefits After Migration

1. **Consistency:** All components use Motork's design system
2. **Maintainability:** Easier to update styles globally via Motork library updates
3. **Bundle Size:** Smaller CSS bundle (no duplicate styles)
4. **Accessibility:** Motork components are built with accessibility in mind
5. **Developer Experience:** Cleaner code, easier to understand component structure
6. **Future-Proof:** Aligned with Motork's component library roadmap

---

## Notes

- The migration should be done incrementally, one component at a time
- After each migration, run the build and test the affected views
- Keep the `style.css.backup` file until all migrations are complete
- Document any Motork component issues or limitations discovered during migration
- Some custom styling may still be needed for unique use cases (use Tailwind utilities)

---

## References

- Motork Component Library: `@motork/component-library/future/primitives`
- Tailwind CSS v4 Documentation
- ProjectUltra Cursor Rules: `.cursor/rules/project-ultra-rules.mdc`
- Original CSS Reference: `src/style.css.backup`
