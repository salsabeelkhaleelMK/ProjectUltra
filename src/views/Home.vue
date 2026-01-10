<template>
  <div class="page-container">
    <!-- Content -->
    <div class="p-4 md:p-6 lg:p-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-gray-500">Loading dashboard...</div>
      </div>
      
      <!-- Dashboard Content - 3 Column Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Quick Actions Widget -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-bolt text-gray-400 text-sm"></i>
                <h2 class="font-bold text-slate-800 text-sm">Quick Actions</h2>
                <span v-if="totalNotificationsCount > 0" class="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {{ totalNotificationsCount }}
                </span>
              </div>
              <button
                v-if="totalNotificationsCount > 5"
                @click="$router.push('/tasks')"
                class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View all →
              </button>
            </div>
          </div>
          
          <div class="p-4 space-y-3">
            <div v-if="notifications.length === 0" class="text-center py-8 text-gray-500">
              <i class="fa-solid fa-check-circle text-4xl mb-2 text-gray-300"></i>
              <p class="text-sm">All caught up!</p>
              <p class="text-xs text-gray-400 mt-1">No quick actions needed</p>
            </div>
            <ActionableQuestionCard
              v-for="question in notifications.slice(0, 5)"
              :key="question.id"
              :question="question"
              @answer-yes="handleAnswerYes"
              @answer-no="handleAnswerNo"
              @reassign="handleReassign"
              @view-task="handleViewTask"
              @dismiss="handleDismiss"
            />
          </div>
        </div>
        
        <!-- Appointments Today Widget -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-calendar text-gray-400 text-sm"></i>
                <h2 class="font-bold text-slate-800 text-sm">Appointments Today</h2>
                <span v-if="appointmentsToday.length > 0" class="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {{ appointmentsToday.length }}
                </span>
              </div>
              <button
                @click="$router.push('/calendar')"
                class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View calendar →
              </button>
            </div>
          </div>
          
          <div class="p-4">
            <TodaysAppointments :appointments="appointmentsToday" />
          </div>
        </div>
        
        <!-- Tasks Due Today Widget -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-tasks text-gray-400 text-sm"></i>
                <h2 class="font-bold text-slate-800 text-sm">Tasks Due Today</h2>
                <span v-if="tasksDueToday.length > 0" class="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                  {{ tasksDueToday.length }}
                </span>
              </div>
              <button
                @click="$router.push('/tasks')"
                class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View all tasks →
              </button>
            </div>
          </div>
          
          <div class="p-4">
            <TodaysTasks :tasks="tasksDueToday" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <ReassignUserModal
      :show="showReassignModal"
      @close="showReassignModal = false"
      @confirm="handleReassignConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useActionableQuestions } from '@/composables/useActionableQuestions'
import { useDashboard } from '@/composables/useDashboard'
import { createNSTask, updateOpportunityAssignee } from '@/api/opportunities'
import { saveDismissal } from '@/utils/dismissalStorage'
import ActionableQuestionCard from '@/components/home/ActionableQuestionCard.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import TodaysAppointments from '@/components/home/TodaysAppointments.vue'
import TodaysTasks from '@/components/home/TodaysTasks.vue'
import { formatDate } from '@/utils/formatters'

const router = useRouter()
const userStore = useUserStore()

const { dismissQuestion, addFollowUpQuestion } = useActionableQuestions()
const { 
  notifications, 
  totalNotificationsCount, 
  appointmentsToday, 
  tasksDueToday, 
  loading, 
  loadDashboard 
} = useDashboard()

const showReassignModal = ref(false)
const currentQuestion = ref(null)

onMounted(async () => {
  await loadDashboard()
})

const handleAnswerYes = async (question) => {
  if (question.type === 'appointment-followup') {
    dismissQuestion(question.id)
    
    addFollowUpQuestion({
      id: `offer-followup-${question.opportunityId}`,
      type: 'offer-followup',
      priority: 5,
      question: `What was the offer given to ${question.customer.name}?`,
      customer: question.customer,
      opportunityId: question.opportunityId,
      opportunity: question.opportunity,
      createdAt: new Date().toISOString()
    })
  } else if (question.type === 'ns-followup') {
    dismissQuestion(question.id)
  } else if (question.type === 'stuck-opportunity') {
    dismissQuestion(question.id)
  } else if (question.type === 'lead-qualification-urgency') {
    dismissQuestion(question.id)
  }
}

const handleAnswerNo = async (question) => {
  if (question.type === 'appointment-followup') {
    try {
      const assigneeId = userStore.currentUser?.id
      if (assigneeId) {
        await createNSTask(question.opportunityId, assigneeId)
        dismissQuestion(question.id)
        await loadDashboard()
      }
    } catch (error) {
      console.error('Error creating NS task:', error)
    }
  } else if (question.type === 'ns-followup') {
    dismissQuestion(question.id)
  } else if (question.type === 'stuck-opportunity') {
    router.push(`/tasks/${question.opportunityId}?type=opportunity`)
  } else if (question.type === 'lead-qualification-urgency') {
    router.push(`/tasks/${question.leadId}?type=lead`)
  }
}

const handleReassign = (question) => {
  currentQuestion.value = question
  showReassignModal.value = true
}

const handleReassignConfirm = async (newAssigneeId) => {
  if (!currentQuestion.value) return
  
  try {
    const entityId = currentQuestion.value.opportunityId || currentQuestion.value.leadId
    if (currentQuestion.value.opportunityId) {
      await updateOpportunityAssignee(entityId, newAssigneeId)
    }
    
    dismissQuestion(currentQuestion.value.id)
    showReassignModal.value = false
    currentQuestion.value = null
    await loadDashboard()
  } catch (error) {
    console.error('Error reassigning:', error)
  }
}

const handleViewTask = (question) => {
  if (question.opportunityId) {
    router.push(`/tasks/${question.opportunityId}?type=opportunity`)
  } else if (question.leadId) {
    router.push(`/tasks/${question.leadId}?type=lead`)
  }
}

const handleDismiss = (question) => {
  if (userStore.currentUser) {
    saveDismissal(question.id, userStore.currentUser.id)
  }
  dismissQuestion(question.id)
}
</script>
