<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-user-circle text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Leads</h3>
        <span v-if="leads.length > 0" class="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
          {{ leads.length }}
        </span>
      </div>
      <button 
        @click.stop="$emit('add-lead')"
        class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
      >
        <i class="fa-solid fa-plus-circle"></i>
        Add Lead
      </button>
    </div>
    
    <div v-if="leads.length === 0" class="p-6 text-center text-gray-400">
      <i class="fa-solid fa-inbox text-2xl mb-2"></i>
      <p class="text-sm">No leads associated with this customer</p>
    </div>
    
    <div v-else class="p-4 space-y-3">
      <div
        v-for="lead in leads"
        :key="lead.id"
        class="flex flex-col p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer transition-colors"
        @click="handleLeadClick(lead)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-slate-800 text-sm">Lead #{{ lead.id }}</span>
              <span 
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="getStageBadgeClass(lead.stage)"
              >
                {{ lead.stage }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span v-if="lead.assignee">{{ lead.assignee }}</span>
              <span v-if="lead.requestedCar">{{ lead.requestedCar.brand }} {{ lead.requestedCar.model }}</span>
            </div>
          </div>
          <i class="fa-solid fa-external-link text-gray-400 text-xs ml-2"></i>
        </div>

        <!-- Nested Tasks for Lead -->
        <div v-if="getLeadTasks(lead).length > 0" class="mt-2 space-y-2 border-t border-gray-200 pt-2">
          <div 
            v-for="task in getLeadTasks(lead)" 
            :key="task.id"
            class="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-md shadow-sm"
          >
            <div class="flex items-center gap-2">
              <span 
                class="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                :class="getTaskTypeBadgeClass(task.type)"
              >
                {{ task.type }}
              </span>
              <span class="text-xs text-slate-700 font-medium">{{ task.description }}</span>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

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

const getTaskTypeBadgeClass = (type) => {
  const classes = {
    'LQ': 'bg-orange-100 text-orange-700 border border-orange-200'
  }
  return classes[type] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const getStageBadgeClass = (stage) => {
  const classes = {
    'Open Lead': 'bg-orange-100 text-orange-700 border border-orange-200',
    'Validated': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Contacted': 'bg-blue-100 text-blue-700 border border-blue-200'
  }
  return classes[stage] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const handleLeadClick = (lead) => {
  const url = router.resolve({ path: `/customer/${lead.id}`, query: { type: 'lead' } })
  window.open(url.href, '_blank')
}
</script>

