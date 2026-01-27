<template>
  <div 
    class="bg-surface border border-border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    :class="dismissing ? 'opacity-50' : ''"
  >
    <div class="flex items-center gap-2 mb-2">
      <!-- Priority Badge -->
      <span
        class="text-xs font-bold px-2 py-0.5 rounded border whitespace-nowrap"
        :class="getPriorityBadgeClass(question.priority)"
      >
        {{ getPriorityLabel(question.priority) }}
      </span>
      
      <!-- Time -->
      <span class="text-xs">{{ getTimeAgo() }}</span>
      
      <!-- Owner -->
      <span class="text-xs">• Owner: {{ getOwnerDisplay() }}</span>
      
      <!-- Dismiss Button -->
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="!showDismissConfirm"
          @click="showDismissConfirm = true"
          class="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
          title="Dismiss"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
        
        <!-- Dismiss Confirmation -->
        <div
          v-else
          class="bg-surface border border-border rounded-lg shadow-lg p-1.5 flex items-center gap-1.5 z-10"
        >
          <span class="text-xs whitespace-nowrap">Dismiss?</span>
          <button
            @click="handleDismiss"
            class="px-2 py-0.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
          >
            Yes
          </button>
          <button
            @click="showDismissConfirm = false"
            class="px-2 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
    
    <!-- Question Text with highlighted customer name -->
    <div class="mb-2" @click="handleQuestionClick">
      <p class="text-foreground text-sm mb-1" v-html="getHighlightedQuestion()"></p>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-2 flex-wrap justify-end mt-3">
      <template v-if="question.type === 'appointment-followup'">
        <button
          @click="handleYes"
          class="px-3 py-1.5 text-xs font-medium !bg-brand-dark !text-white border border-brand-dark rounded-xl hover:!bg-brand-darkDarker hover:border-brand-darkDarker transition-colors"
        >
          Yes
        </button>
        <button
          @click="handleNo"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          No
        </button>
      </template>
      
      <template v-else-if="question.type === 'ns-followup'">
        <button
          @click="handleYes"
          class="px-3 py-1.5 text-xs font-medium !bg-brand-dark !text-white border border-brand-dark rounded-xl hover:!bg-brand-darkDarker hover:border-brand-darkDarker transition-colors"
        >
          Yes
        </button>
        <button
          @click="handleNo"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          No
        </button>
        <button
          @click="handleReassign"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          Reassign
        </button>
      </template>
      
      <template v-else-if="question.type === 'offer-followup'">
        <button
          @click="handleViewTask"
          class="px-3 py-1.5 text-xs font-medium !bg-brand-dark !text-white border border-brand-dark rounded-xl hover:!bg-brand-darkDarker hover:border-brand-darkDarker transition-colors"
        >
          View Opportunity
        </button>
      </template>
      
      <template v-else-if="question.type === 'stuck-opportunity'">
        <button
          @click="handleYes"
          class="px-3 py-1.5 text-xs font-medium !bg-brand-dark !text-white border border-brand-dark rounded-xl hover:!bg-brand-darkDarker hover:border-brand-darkDarker transition-colors"
        >
          Yes
        </button>
        <button
          @click="handleNo"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          No
        </button>
        <button
          @click="handleReassign"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          Reassign
        </button>
      </template>
      
      <template v-else-if="question.type === 'lead-qualification-urgency'">
        <button
          @click="handleYes"
          class="px-3 py-1.5 text-xs font-medium !bg-brand-dark !text-white border border-brand-dark rounded-xl hover:!bg-brand-darkDarker hover:border-brand-darkDarker transition-colors"
        >
          Yes
        </button>
        <button
          @click="handleNo"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          No
        </button>
        <button
          @click="handleReassign"
          class="px-3 py-1.5 text-xs font-medium bg-surface text-brand-dark border border-D1D5DB rounded-xl hover:brightness-95 transition-colors"
        >
          Reassign
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'answer-yes', 
  'answer-no', 
  'reassign', 
  'view-task',
  'dismiss'
])

const showDismissConfirm = ref(false)
const dismissing = ref(false)

// Import stores
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'

const userStore = useUserStore()
const usersStore = useUsersStore()

const getOwnerDisplay = () => {
  // Get the assignee name from the opportunity or lead
  const assigneeName = props.question.opportunity?.assignee || props.question.lead?.assignee
  
  if (!assigneeName) return 'Unknown'
  
  // Check if it's the current user
  if (assigneeName === userStore.currentUser?.name) {
    return 'me'
  }
  
  return assigneeName
}

const getHighlightedQuestion = () => {
  const customerName = props.question.customer.name
  const questionText = props.question.question
  
  // Make the question clickable to view the task
  const highlightedName = `<a href="#" class="font-bold text-brand-red hover:text-brand-red-dark hover:underline" onclick="event.preventDefault()">${customerName}</a>`
  
  // Replace all instances of customer name with highlighted version
  return questionText.replace(new RegExp(customerName, 'g'), highlightedName)
}

const getPriorityBadgeClass = (priority) => {
  if (priority === 1) return 'bg-red-50 text-red-600 border-red-100'
  if (priority <= 3) return 'bg-amber-50 text-amber-600 border-amber-100'
  return 'bg-emerald-50 text-emerald-600 border-emerald-100'
}

const getPriorityLabel = (priority) => {
  if (priority === 1) return 'CRITICAL'
  if (priority <= 3) return 'HIGH'
  return 'MEDIUM'
}

const getTimeAgo = () => {
  if (!props.question.createdAt && !props.question.appointmentDate) return 'Just now'
  
  const date = new Date(props.question.createdAt || props.question.appointmentDate)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  return `${Math.floor(diffDays / 7)} weeks ago`
}

const handleYes = () => emit('answer-yes', props.question)
const handleNo = () => emit('answer-no', props.question)
const handleReassign = () => emit('reassign', props.question)
const handleViewTask = () => emit('view-task', props.question)

const handleQuestionClick = (event) => {
  // Check if clicked on the highlighted customer name link
  if (event.target.tagName === 'A') {
    event.preventDefault()
    handleViewTask()
  }
}

const handleDismiss = () => {
  dismissing.value = true
  setTimeout(() => {
    emit('dismiss', props.question)
  }, 200)
}
</script>
