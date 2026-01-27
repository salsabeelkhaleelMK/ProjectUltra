<template>
  <div>
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-4 px-1">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-user-circle text-heading"></i>
        <h2 class="text-sm font-semibold text-heading leading-5">Leads</h2>
        <Badge
          :text="String(leads.length)"
          size="small"
          theme="blue"
        />
      </div>
      <button
        @click="$emit('add-lead')"
        class="text-fluid-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        <span>Add Lead</span>
      </button>
    </div>
    
    <!-- Feed Items -->
    <div v-if="leads.length > 0" class="space-y-4 mb-6 px-1">
      <div
        v-for="lead in leads"
        :key="lead.id"
        class="bg-white border border-E5E7EB rounded-xl p-4 shadow-sm flex gap-4 animate-fade-in feed-item cursor-pointer hover:shadow-md transition-shadow"
        @click="handleLeadClick(lead)"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border bg-orange-100 text-orange-600 border-orange-200"
        >
          <i class="fa-solid fa-user-circle text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold text-heading">Lead #{{ lead.id }}</span>
            <Badge
              :text="lead.stage"
              size="small"
              :theme="getStageTheme(lead.stage)"
            />
            <div class="ml-auto relative">
              <button 
                @click.stop="handleLeadClick(lead)"
                class="text-gray-400 hover:text-body transition-colors p-1"
                title="Open in new tab"
              >
                <i class="fa-solid fa-external-link text-sm"></i>
              </button>
            </div>
          </div>
          <div class="text-sm text-body">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sub mb-2">
              <span v-if="lead.assignee" class="flex items-center gap-1">
                <i class="fa-solid fa-user text-xs"></i>
                {{ lead.assignee }}
              </span>
              <span v-if="lead.requestedCar" class="flex items-center gap-1">
                <i class="fa-solid fa-car text-xs"></i>
                {{ lead.requestedCar.brand }} {{ lead.requestedCar.model }}
              </span>
            </div>

            <!-- Nested Tasks for Lead -->
            <div v-if="getLeadTasks(lead).length > 0" class="mt-2 space-y-1.5 border-t border-gray-100 pt-2">
              <div 
                v-for="task in getLeadTasks(lead)" 
                :key="task.id"
                class="flex items-center justify-between p-2 bg-surfaceSecondary/50 border border-black/5 rounded-md"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <Badge
                    :text="task.type"
                    size="small"
                    :theme="task.type === 'LQ' ? 'blue' : 'gray'"
                  />
                  <span class="text-xs text-body font-medium truncate">{{ task.description }}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-xs text-sub opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-8 text-sub mb-6">
      <i class="fa-solid fa-inbox text-2xl mb-2 opacity-30"></i>
      <p class="text-xs">No leads associated with this customer</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Badge } from '@motork/component-library/future/primitives'

const props = defineProps({
  leads: {
    type: Array,
    default: () => []
  },
  allTasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-lead'])

const router = useRouter()

// Helper to calculate days since a date
const calculateDaysSince = (dateString) => {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Detect active tasks for a lead
const getLeadTasks = (lead) => {
  const tasks = []
  
  // 1. Add manual tasks from allTasks prop
  if (props.allTasks && props.allTasks.length > 0) {
    const manualTasks = props.allTasks.filter(t => t.leadId === lead.id)
    manualTasks.forEach(task => {
      tasks.push({
        id: task.id,
        type: task.title || 'Task',
        description: task.description || task.title
      })
    })
  }

  // 2. Add detected LQ tasks
  if (lead.stage === 'Open Lead') {
    const daysSince = calculateDaysSince(lead.createdAt)
    if (daysSince >= 0) {
      tasks.push({
        id: `lead-${lead.id}-lq`,
        type: 'LQ',
        description: 'Call to Verify Contact Details'
      })
    }
  }
  
  return tasks
}

const getStageTheme = (stage) => {
  if (stage === 'Open Lead' || stage === 'Validated' || stage === 'Contacted') return 'blue'
  return 'gray'
}

const handleLeadClick = (lead) => {
  const url = router.resolve({ path: `/tasks/${lead.id}`, query: { type: 'lead' } })
  window.open(url.href, '_blank')
}
</script>
