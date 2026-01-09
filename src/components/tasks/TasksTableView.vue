<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Tasks" subtitle="Manage your leads and opportunities">
      <template #actions>
        <!-- View Toggle -->
        <ViewToggle
          :view="viewMode"
          :options="[
            { value: 'card', icon: 'fa-solid fa-list', label: 'Cards' },
            { value: 'table', icon: 'fa-solid fa-table', label: 'Table' }
          ]"
          @update:view="$emit('view-change', $event)"
        />
      </template>
    </PageHeader>
    
    <!-- Content -->
    <div class="p-4 md:p-8">
      <!-- Search Bar and Filters Row -->
      <div class="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <!-- Search Bar -->
        <div class="relative flex-1 max-w-md">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-sm"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="searchPlaceholder"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm"
          >
        </div>
        
        <!-- Filters -->
        <TaskFilters
          :type-filter="typeFilter"
          :sort-option="sortOption"
          :show-type-filter="showTypeFilter"
          @filter-change="$emit('filter-change', $event)"
          @sort-change="$emit('sort-change', $event)"
        />
      </div>
      
      <!-- Table Container -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto -mx-4 md:mx-0">
          <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <th class="px-3 md:px-6 py-3 text-left">
              <input type="checkbox" class="rounded">
            </th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Customer</th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Vehicle</th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap hidden sm:table-cell">Type</th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Stage/Status</th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap hidden lg:table-cell">Next Action</th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap hidden md:table-cell">Owner</th>
            <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap hidden xl:table-cell">Value</th>
            <th class="px-3 md:px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="task in filteredTasks"
            :key="task.compositeId"
            @click="$emit('select', task.compositeId)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50': isSelected(task) }"
          >
            <!-- Checkbox -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
              <input type="checkbox" class="rounded">
            </td>
            
            <!-- Customer -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap">
              <div class="flex items-center gap-2 md:gap-3">
                <div 
                  class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  :class="task.type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'"
                >
                  {{ task.customer.initials }}
                </div>
                <div class="min-w-0">
                  <div class="text-content-bold truncate max-w-[120px] md:max-w-none">{{ task.customer.name }}</div>
                  <div class="text-meta truncate hidden sm:block">{{ task.customer.email }}</div>
                </div>
              </div>
            </td>
            
            <!-- Vehicle -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div class="min-w-0">
                  <div class="text-content font-medium truncate max-w-[120px]">
                    {{ getVehicleInfo(task) }}
                  </div>
                  <div class="flex items-center gap-1 mt-0.5">
                    <span 
                      v-if="getVehicleType(task)"
                      class="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                      :class="getVehicleTypeBadgeClass(getVehicleType(task))"
                    >
                      {{ getVehicleType(task).label }}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            
            <!-- Type (Lead/Opportunity) -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
              <span 
                class="badge-ui font-semibold"
                :class="task.type === 'lead' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'"
              >
                {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
              </span>
            </td>
            
            <!-- Stage/Status -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap">
              <div class="flex flex-col gap-1">
                <span 
                  class="badge-ui font-semibold"
                  :class="props.getStageBadgeClass(task.type === 'lead' ? task.status : task.stage)"
                >
                  {{ task.type === 'lead' ? task.status : task.stage }}
                </span>
                <span 
                  v-if="task.type === 'lead' && task.priority === 'Hot'"
                  class="badge-ui bg-red-50 text-red-700 font-semibold flex items-center gap-1 w-fit"
                >
                  <i class="fa-solid fa-fire text-[9px]"></i> Hot
                </span>
              </div>
            </td>
            
            <!-- Next Action Due -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap hidden lg:table-cell">
              <div class="text-content">
                <div 
                  class="font-medium mb-0.5"
                  :class="getDeadlineStatus(task.nextActionDue).textClass"
                >
                  {{ formatDeadlineFull(task.nextActionDue) }}
                </div>
                <div 
                  class="text-xs flex items-center gap-1"
                  :class="getDeadlineStatus(task.nextActionDue).textClass"
                >
                  <i 
                    v-if="getDeadlineStatus(task.nextActionDue).icon"
                    :class="`fa-solid ${getDeadlineStatus(task.nextActionDue).icon} text-[10px]`"
                  ></i>
                  <span>{{ getDateDisplay(task.nextActionDue) }}</span>
                </div>
              </div>
            </td>
            
            <!-- Owner -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap hidden md:table-cell">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                  {{ getOwnerInfo(task).initials }}
                </div>
                <span class="text-content text-gray-600 truncate max-w-[80px]">{{ getOwnerInfo(task).name }}</span>
              </div>
            </td>
            
            <!-- Value (Opportunities only) -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap hidden xl:table-cell">
              <div v-if="task.type === 'opportunity'" class="text-content font-semibold text-gray-900">
                €{{ formatCurrency(task.value) }}
              </div>
              <div v-else class="text-gray-400">-</div>
            </td>
            
            <!-- Actions Menu -->
            <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
              <button 
                @click="$emit('menu-click', task.id)"
                class="text-gray-400 hover:text-gray-600"
              >
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="openMenuId === task.id"
                class="absolute right-2 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                v-click-outside="() => $emit('menu-close')"
              >
                <button 
                  @click="$emit('reassign', task)"
                  class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <i class="fa-solid fa-user-plus w-4 text-gray-400"></i>
                  Reassign
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TaskFilters from './TaskFilters.vue'
import ViewToggle from '@/components/shared/ViewToggle.vue'
import { formatCurrency, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'

const props = defineProps({
  tasks: { type: Array, required: true },
  currentTaskId: { type: String, default: null },
  typeFilter: { type: String, default: 'all' },
  sortOption: { type: String, default: 'recent-first' },
  showTypeFilter: { type: Boolean, default: true },
  showMobileClose: { type: Boolean, default: false },
  openMenuId: { type: [Number, String], default: null },
  searchPlaceholder: { type: String, default: 'Search tasks...' },
  getVehicleType: { type: Function, required: true },
  getVehicleTypeBadgeClass: { type: Function, required: true },
  getOwnerInfo: { type: Function, required: true },
  getStageBadgeClass: { type: Function, required: true },
  viewMode: {
    type: String,
    default: 'table'
  }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close', 'filter-change', 'sort-change', 'reassign', 'close', 'view-change'])

const searchQuery = ref('')

const filteredTasks = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.tasks
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.tasks.filter(task => {
    return (
      task.customer.name.toLowerCase().includes(query) ||
      task.customer.email?.toLowerCase().includes(query) ||
      getVehicleInfo(task).toLowerCase().includes(query) ||
      task.assignee?.toLowerCase().includes(query)
    )
  })
})

const isSelected = (task) => {
  return task.compositeId === props.currentTaskId
}

const getVehicleInfo = (task) => {
  if (task.type === 'lead') {
    return task.requestedCar ? `${task.requestedCar.brand} ${task.requestedCar.model}` : 'No vehicle specified'
  }
  return task.vehicle ? `${task.vehicle.brand} ${task.vehicle.model}` : 'No vehicle specified'
}

const getDateDisplay = (date) => {
  if (!date) return 'Not set'
  
  const now = new Date()
  const dueDate = new Date(date)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
  
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  
  return formatDeadlineFull(date)
}
</script>

<style scoped>
.label-upper {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(107 114 128);
}

.text-content {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-content-bold {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
}

.text-meta {
  font-size: 0.75rem;
  color: rgb(156 163 175);
}

.badge-ui {
  display: inline-block;
  font-size: 0.6875rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  white-space: nowrap;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

