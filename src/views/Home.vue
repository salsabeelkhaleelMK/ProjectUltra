<template>
  <div class="page-container">
    <!-- Content -->
    <div class="p-4 md:p-6 lg:p-8">
      <!-- Main Content Grid - 2/3 vs 1/3 starting from top -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        
        <!-- Left Column - Main Content (2/3 width) -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <!-- Performance Widget -->
          <PerformanceWidget />
          
          <!-- Tasks Due Today Widget -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-tasks text-gray-400 text-sm"></i>
                  <h2 class="heading-main">Tasks Due Today</h2>
                  <Badge
                    v-if="tasksDueToday.length > 0"
                    :text="String(tasksDueToday.length)"
                    size="small"
                    theme="red"
                  />
                </div>
                <Button
                  label="View all tasks →"
                  variant="ghost"
                  size="small"
                  @click="$router.push('/tasks')"
                  class="text-xs"
                />
              </div>
            </div>
            
            <div class="p-4">
              <TodaysTasks :tasks="tasksDueToday" :loading="loadingTasks" />
            </div>
          </div>
        </div>
        
        <!-- Right Column - Sidebar (1/3 width) -->
        <div class="space-y-4 md:space-y-6">
          <!-- Quick Actions Widget -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-bolt text-gray-400 text-sm"></i>
                  <h2 class="heading-main">Quick Actions</h2>
                  <Badge
                    v-if="totalNotificationsCount > 0"
                    :text="String(totalNotificationsCount)"
                    size="small"
                    theme="blue"
                  />
                </div>
                <Button
                  v-if="totalNotificationsCount > 5"
                  label="View all →"
                  variant="ghost"
                  size="small"
                  @click="$router.push('/tasks')"
                  class="text-xs"
                />
              </div>
            </div>
            
            <div class="p-4 space-y-3">
              <!-- Loading Skeleton -->
              <template v-if="loadingNotifications">
                <div v-for="n in 3" :key="`skeleton-${n}`" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div class="flex gap-2 mt-3">
                      <div class="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                      <div class="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Actual Content -->
              <template v-else>
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
              </template>
            </div>
          </div>
          
          <!-- Appointments Today Widget -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-calendar text-gray-400 text-sm"></i>
                  <h2 class="heading-main">Appointments Today</h2>
                  <Badge
                    v-if="appointmentsToday.length > 0"
                    :text="String(appointmentsToday.length)"
                    size="small"
                    theme="blue"
                  />
                </div>
                <Button
                  label="View calendar →"
                  variant="ghost"
                  size="small"
                  @click="$router.push('/calendar')"
                  class="text-xs"
                />
              </div>
            </div>
            
            <div class="p-4">
              <TodaysAppointments :appointments="appointmentsToday" :loading="loadingAppointments" />
            </div>
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
import { Button, Badge } from '@motork/component-library'
import ActionableQuestionCard from '@/components/home/ActionableQuestionCard.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import TodaysAppointments from '@/components/home/TodaysAppointments.vue'
import TodaysTasks from '@/components/home/TodaysTasks.vue'
import PerformanceWidget from '@/components/home/PerformanceWidget.vue'
import { formatDate } from '@/utils/formatters'

const router = useRouter()
const userStore = useUserStore()

const { dismissQuestion, addFollowUpQuestion } = useActionableQuestions()
const { 
  notifications, 
  totalNotificationsCount, 
  appointmentsToday, 
  tasksDueToday, 
  loadingNotifications,
  loadingAppointments,
  loadingTasks,
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
