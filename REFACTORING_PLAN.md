# Refactoring Plan: Merge Leads & Opportunities into Unified Tasks View

## Overview
Merge the separate Leads and Opportunities pages into a unified "Tasks" view where:
- Tasks can be either a Lead or an Opportunity (marked with `type: 'lead' | 'opportunity'`)
- Left sidebar shows a unified list of all tasks
- Detail view conditionally renders widgets based on task type
- All existing functionality is preserved

## Current State Analysis

### Existing Structure
- **Routes**: `/leads/:id` and `/opportunities/:id` (separate)
- **Views**: `LeadDetail.vue` and `OpportunityDetail.vue` (duplicated logic)
- **Stores**: `leads.js` and `opportunities.js` (separate)
- **API**: `leads.js` and `opportunities.js` (separate)
- **Mock Data**: `mockLeads` and `mockOpportunities` (separate arrays)
- **Sidebar**: `EntityListSidebar` used separately in each view

### Shared Components (Already Reusable)
- `EntityListSidebar` - Used by both views
- `ContactInfo` - Used by both views
- `ActivitySummarySidebar` - Used by both views
- `VehicleWidget` - Used by both views
- `AddNewButton` - Used by both views
- `RescheduleWidget` - Used by both views
- `Tabs` - Used by both views

## Refactoring Strategy

### Phase 1: Data Layer Unification

#### 1.1 Update Mock Data Structure
**File**: `src/api/mockData.js`

- Add `type: 'lead'` to all items in `mockLeads`
- Add `type: 'opportunity'` to all items in `mockOpportunities`
- Create a new `mockTasks` array that combines both:
  ```javascript
  export const mockTasks = [
    ...mockLeads.map(lead => ({ ...lead, type: 'lead' })),
    ...mockOpportunities.map(opp => ({ ...opp, type: 'opportunity' }))
  ]
  ```

#### 1.2 Create Unified Tasks API
**New File**: `src/api/tasks.js`

- `fetchTasks(filters)` - Returns unified list of leads + opportunities
- `fetchTaskById(id, type)` - Fetches by ID and type
- `fetchTaskActivities(id, type)` - Fetches activities for task
- Keep existing `leads.js` and `opportunities.js` for backward compatibility during transition

#### 1.3 Create Unified Tasks Store
**New File**: `src/stores/tasks.js`

- Unified store that manages both leads and opportunities
- Methods:
  - `loadTasks(filters)` - Load all tasks
  - `loadTaskById(id, type)` - Load specific task
  - `getTasksByType(type)` - Filter by type
  - `getTasksByStatus(status)` - Filter by status/stage
  - All CRUD operations for tasks

### Phase 2: Component Unification

#### 2.1 Create Unified Task Detail View
**New File**: `src/views/TaskDetail.vue`

- Replace both `LeadDetail.vue` and `OpportunityDetail.vue`
- Structure:
  ```vue
  <template>
    <div class="h-full flex flex-col lg:flex-row">
      <!-- Left Sidebar - Unified Task List -->
      <EntityListSidebar
        :items="allTasks"
        :selected-id="currentTask?.id"
        @select="selectTask"
      />
      
      <!-- Main Content - Conditional Rendering -->
      <div class="flex-1">
        <TaskDetailContent :task="currentTask" />
      </div>
    </div>
  </template>
  ```

- Conditional rendering based on `task.type`:
  - Lead-specific widgets (call panel, transcription, etc.)
  - Opportunity-specific widgets (offers, recommended cars, etc.)
  - Shared widgets (contact info, vehicle, activity feed, etc.)

#### 2.2 Create Task Detail Content Component
**New File**: `src/components/tasks/TaskDetailContent.vue`

- Handles the main content area
- Conditionally renders widgets based on `task.type`
- Reuses all existing shared components

#### 2.3 Update EntityListSidebar for Tasks
**File**: `src/components/shared/EntityListSidebar.vue`

- Add support for task type badges
- Show different styling for leads vs opportunities
- Add type indicator (icon or badge)

### Phase 3: Routing & Navigation

#### 3.1 Update Router
**File**: `src/router/index.js`

- Add new route: `/tasks/:id` (primary route)
- Keep `/leads/:id` and `/opportunities/:id` as aliases (redirect to `/tasks/:id`)
- Update default redirect to `/tasks/1`

#### 3.2 Update Sidebar Navigation
**File**: `src/components/layout/IconSidebar.vue`

- Replace "Leads" and "Opportunities" with single "Tasks" icon
- Or keep both but make them point to the same unified view with filters

### Phase 4: Component Refactoring

#### 4.1 Make Components Type-Aware
Update components to accept `taskType` prop:
- `VehicleWidget` - Already works for both
- `AddNewButton` - Already has conditional actions
- `OpportunityManagementWidget` - Rename to `TaskManagementWidget` and make type-aware
- `RescheduleWidget` - Already shared

#### 4.2 Create Type-Specific Widget Wrappers
**New Files**:
- `src/components/tasks/LeadWidgets.vue` - Lead-specific widgets container
- `src/components/tasks/OpportunityWidgets.vue` - Opportunity-specific widgets container

### Phase 5: Cleanup & Migration

#### 5.1 Deprecate Old Views
- Mark `LeadDetail.vue` and `OpportunityDetail.vue` as deprecated
- Keep for reference during transition
- Remove after full migration

#### 5.2 Update All References
- Search and replace imports
- Update navigation links
- Update any hardcoded routes

## Implementation Order

### Step 1: Data Layer (Low Risk)
1. ✅ Add `type` field to mock data
2. ✅ Create `mockTasks` combined array
3. ✅ Create `tasks.js` API layer
4. ✅ Create `tasks.js` store

### Step 2: Create Unified View (Medium Risk)
1. ✅ Create `TaskDetail.vue` view
2. ✅ Create `TaskDetailContent.vue` component
3. ✅ Implement conditional rendering logic
4. ✅ Test with both lead and opportunity data

### Step 3: Update Routing (Low Risk)
1. ✅ Add `/tasks/:id` route
2. ✅ Add redirects from old routes
3. ✅ Update sidebar navigation

### Step 4: Component Updates (Medium Risk)
1. ✅ Update `EntityListSidebar` for task types
2. ✅ Make widgets type-aware
3. ✅ Create type-specific widget containers

### Step 5: Cleanup (Low Risk)
1. ✅ Remove old views
2. ✅ Update all references
3. ✅ Remove unused code

## Key Design Decisions

### Task Identification
- **Option A**: Use composite key `{id, type}` - More explicit, requires both
- **Option B**: Use unique IDs across all tasks - Simpler, but requires ID coordination
- **Recommendation**: Option B - Ensure unique IDs across leads and opportunities

### Type Marking
- Add `type: 'lead' | 'opportunity'` to all task objects
- Store in mock data
- Pass through API layer
- Use in components for conditional rendering

### Backward Compatibility
- Keep old routes working (redirect to new routes)
- Keep old stores/APIs during transition
- Gradual migration approach

### Widget Rendering Strategy
- **Conditional Rendering**: Use `v-if="task.type === 'lead'"` in unified view
- **Component Composition**: Create wrapper components for type-specific sections
- **Props-Based**: Pass `taskType` prop to shared components

## Testing Checklist

- [ ] All leads display correctly in unified view
- [ ] All opportunities display correctly in unified view
- [ ] Task type badges show correctly
- [ ] Lead-specific widgets only show for leads
- [ ] Opportunity-specific widgets only show for opportunities
- [ ] Shared widgets work for both types
- [ ] Navigation between tasks works
- [ ] Old routes redirect correctly
- [ ] Sidebar shows all tasks
- [ ] Filters work for both types
- [ ] Search works across both types

## Risk Mitigation

1. **Feature Branch**: Create feature branch for refactoring
2. **Incremental Migration**: Migrate one view at a time
3. **Keep Old Code**: Don't delete until fully tested
4. **Backup Routes**: Keep old routes as redirects initially
5. **Data Validation**: Ensure all tasks have type field

## Estimated Effort

- **Phase 1 (Data Layer)**: 2-3 hours
- **Phase 2 (Components)**: 4-5 hours
- **Phase 3 (Routing)**: 1 hour
- **Phase 4 (Refactoring)**: 3-4 hours
- **Phase 5 (Cleanup)**: 1-2 hours

**Total**: ~12-15 hours

## Notes

- This refactoring maintains all existing functionality
- No data loss or breaking changes for end users
- Can be done incrementally
- Old routes can remain as redirects for compatibility

