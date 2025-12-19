<template>
  <div class="h-full overflow-y-auto bg-gray-50">
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-slate-800 mb-1">Action Items</h1>
        <p class="text-xs text-gray-500">
          {{ totalQuestionsCount > 0 ? `Showing ${Math.min(questions.length, 5)} of ${totalQuestionsCount} urgent items` : 'No urgent items require your attention' }}
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-gray-500">Loading questions...</div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!loading && questions.length === 0" class="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
        <i class="fa-solid fa-check-circle text-6xl text-emerald-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">All caught up!</h3>
        <p class="text-sm text-gray-600 mb-6">No urgent items require your attention right now.</p>
        <button
          @click="$router.push('/tasks')"
          class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all tasks →
        </button>
      </div>
      
      <!-- Questions List -->
      <div v-else>
        <ActionableQuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question"
          @answer-yes="handleAnswerYes"
          @answer-no="handleAnswerNo"
          @reassign="handleReassign"
          @view-task="handleViewTask"
          @dismiss="handleDismiss"
        />
        
        <!-- View All Button -->
        <div v-if="totalQuestionsCount > 5" class="text-center pt-4">
          <button
            class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all items ({{ totalQuestionsCount }}) →
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useActionableQuestions } from '@/composables/useActionableQuestions'
import { createNSTask, updateOpportunityAssignee } from '@/api/opportunities'
import { saveDismissal } from '@/utils/dismissalStorage'
import ActionableQuestionCard from '@/components/home/ActionableQuestionCard.vue'
import ReassignUserModal from '@/components/home/ReassignUserModal.vue'

const router = useRouter()
const userStore = useUserStore()

const { questions, totalQuestionsCount, loading, loadQuestions, dismissQuestion, addFollowUpQuestion } = useActionableQuestions()

const showReassignModal = ref(false)
const currentQuestion = ref(null)

onMounted(async () => {
  await loadQuestions()
})

const handleAnswerYes = async (question) => {
  if (question.type === 'appointment-followup') {
    // Dismiss and show offer follow-up question
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
    // Just dismiss
    dismissQuestion(question.id)
  } else if (question.type === 'stuck-opportunity') {
    // Yes, still interested - just dismiss (they'll follow up)
    dismissQuestion(question.id)
  } else if (question.type === 'lead-qualification-urgency') {
    // Yes, contacted them - just dismiss
    dismissQuestion(question.id)
  }
}

const handleAnswerNo = async (question) => {
  if (question.type === 'appointment-followup') {
    // Create NS task
    try {
      const assigneeId = userStore.currentUser?.id
      if (assigneeId) {
        await createNSTask(question.opportunityId, assigneeId)
        dismissQuestion(question.id)
        await loadQuestions()
      }
    } catch (error) {
      console.error('Error creating NS task:', error)
    }
  } else if (question.type === 'ns-followup') {
    // Just dismiss
    dismissQuestion(question.id)
  } else if (question.type === 'stuck-opportunity') {
    // No, not interested - take to opportunity to close it
    router.push(`/tasks/${question.opportunityId}?type=opportunity`)
  } else if (question.type === 'lead-qualification-urgency') {
    // No, haven't contacted - take to lead to handle it
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
    // TODO: Add lead reassignment when needed
    
    dismissQuestion(currentQuestion.value.id)
    showReassignModal.value = false
    currentQuestion.value = null
    await loadQuestions()
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
  // Save dismissal to localStorage
  if (userStore.currentUser) {
    saveDismissal(question.id, userStore.currentUser.id)
  }
  
  // Remove from list
  dismissQuestion(question.id)
}
</script>
