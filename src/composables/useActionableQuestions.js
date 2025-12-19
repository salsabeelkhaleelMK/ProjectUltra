import { ref, computed } from 'vue'
import { fetchActionableQuestions } from '@/api/opportunities'
import { useUserStore } from '@/stores/user'
import { isDismissed } from '@/utils/dismissalStorage'

export function useActionableQuestions() {
  const userStore = useUserStore()
  const allQuestions = ref([])
  const loading = ref(false)

  const currentUser = computed(() => userStore.currentUser)
  const userRole = computed(() => userStore.currentUser?.role)

  // Filter and limit questions to top 5
  const questions = computed(() => {
    if (!currentUser.value) return []
    
    // Filter out dismissed questions
    const filtered = allQuestions.value.filter(q => 
      !isDismissed(q.id, currentUser.value.id)
    )
    
    // Return top 5
    return filtered.slice(0, 5)
  })

  const totalQuestionsCount = computed(() => {
    if (!currentUser.value) return 0
    return allQuestions.value.filter(q => 
      !isDismissed(q.id, currentUser.value.id)
    ).length
  })

  async function loadQuestions() {
    if (!currentUser.value) {
      allQuestions.value = []
      return
    }

    // Check if user has access (managers, salesmen, or operators)
    if (!userStore.isSalesman() && !userStore.isManager() && !userStore.isOperator()) {
      allQuestions.value = []
      return
    }

    loading.value = true
    try {
      const result = await fetchActionableQuestions(currentUser.value.id, userRole.value)
      allQuestions.value = result
    } catch (error) {
      console.error('Error loading actionable questions:', error)
      allQuestions.value = []
    } finally {
      loading.value = false
    }
  }

  function dismissQuestion(questionId) {
    // Remove from list immediately (dismissal is saved in component)
    allQuestions.value = allQuestions.value.filter(q => q.id !== questionId)
  }

  function addFollowUpQuestion(followUp) {
    // Insert follow-up question at the beginning
    allQuestions.value.unshift(followUp)
  }

  return {
    questions,
    totalQuestionsCount,
    loading,
    loadQuestions,
    dismissQuestion,
    addFollowUpQuestion
  }
}

