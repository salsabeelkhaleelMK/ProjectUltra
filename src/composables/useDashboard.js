import { ref, computed } from 'vue'
import { useActionableQuestions } from '@/composables/useActionableQuestions'
import { fetchTodayAppointments, fetchUpcomingAppointments } from '@/api/calendar'
import { fetchTasksDueToday as fetchLeadTasksDueToday, fetchTasksDueUpcoming as fetchLeadTasksDueUpcoming } from '@/api/leads'
import { fetchTasksDueToday as fetchOppTasksDueToday, fetchTasksDueUpcoming as fetchOppTasksDueUpcoming } from '@/api/opportunities'
import { useUserStore } from '@/stores/user'

export function useDashboard() {
  const userStore = useUserStore()
  const { questions, totalQuestionsCount, loading: questionsLoading, loadQuestions } = useActionableQuestions()
  
  const todayAppointments = ref([])
  const todayLeadTasks = ref([])
  const todayOppTasks = ref([])
  const upcomingAppointments = ref([])
  const loading = ref(false)

  // Computed: All today's tasks (leads + opportunities)
  const todayTasks = computed(() => {
    const leads = todayLeadTasks.value.map(lead => ({
      ...lead,
      type: 'lead',
      taskType: 'Lead',
      dueTime: lead.nextActionDue ? new Date(lead.nextActionDue).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
      dueDate: lead.nextActionDue ? new Date(lead.nextActionDue) : null
    }))
    
    const opps = todayOppTasks.value.map(opp => ({
      ...opp,
      type: 'opportunity',
      taskType: 'Opportunity',
      dueTime: opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
      dueDate: opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null
    }))
    
    return [...leads, ...opps]
  })

  // Computed: Prioritized todos combining appointments and tasks
  const prioritizedTodos = computed(() => {
    const todos = []
    
    // Add appointments (sorted by time)
    const appointments = todayAppointments.value.map(apt => ({
      ...apt,
      todoType: 'appointment',
      sortTime: new Date(apt.start).getTime(),
      time: new Date(apt.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(apt.start)
    }))
    todos.push(...appointments)
    
    // Add tasks (sorted by priority and time)
    const tasks = todayTasks.value.map(task => {
      const dueDate = task.dueDate || (task.nextActionDue ? new Date(task.nextActionDue) : null)
      const now = new Date()
      const isOverdue = dueDate && dueDate < now
      
      return {
        ...task,
        todoType: 'task',
        sortTime: dueDate ? dueDate.getTime() : 0,
        isOverdue,
        priority: task.priority === 'Hot' ? 1 : 2
      }
    })
    todos.push(...tasks)
    
    // Sort: Appointments first (by time), then overdue tasks, then tasks due today (by priority), then upcoming
    return todos.sort((a, b) => {
      // Appointments come first
      if (a.todoType === 'appointment' && b.todoType !== 'appointment') return -1
      if (a.todoType !== 'appointment' && b.todoType === 'appointment') return 1
      
      // Within appointments, sort by time
      if (a.todoType === 'appointment' && b.todoType === 'appointment') {
        return a.sortTime - b.sortTime
      }
      
      // Within tasks, overdue first
      if (a.isOverdue && !b.isOverdue) return -1
      if (!a.isOverdue && b.isOverdue) return 1
      
      // Then by priority (Hot > Normal)
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      
      // Then by time
      return a.sortTime - b.sortTime
    })
  })

  // Computed: Separate appointments and tasks for display
  const appointmentsToday = computed(() => {
    return todayAppointments.value
      .map(apt => ({
        ...apt,
        time: new Date(apt.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(apt.start)
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  })

  const tasksDueToday = computed(() => {
    return todayTasks.value
      .filter(task => {
        const dueDate = task.dueDate || (task.nextActionDue ? new Date(task.nextActionDue) : null)
        if (!dueDate) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const taskDate = new Date(dueDate)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate >= today && taskDate < tomorrow
      })
      .sort((a, b) => {
        // Overdue first
        const now = new Date()
        const aOverdue = a.dueDate < now
        const bOverdue = b.dueDate < now
        if (aOverdue && !bOverdue) return -1
        if (!aOverdue && bOverdue) return 1
        
        // Then by priority
        if (a.priority !== b.priority) {
          return (a.priority === 'Hot' ? 1 : 2) - (b.priority === 'Hot' ? 1 : 2)
        }
        
        // Then by time
        return (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
      })
  })

  // Notifications (from actionable questions)
  const notifications = computed(() => questions.value)

  async function loadDashboard() {
    loading.value = true
    try {
      // Load actionable questions
      await loadQuestions()
      
      // Load today's appointments
      todayAppointments.value = await fetchTodayAppointments()
      
      // Load today's tasks based on user role
      if (userStore.canAccessLeads()) {
        todayLeadTasks.value = await fetchLeadTasksDueToday()
      }
      if (userStore.canAccessOpportunities()) {
        todayOppTasks.value = await fetchOppTasksDueToday()
      }
      
      // Load upcoming appointments (next 24h)
      upcomingAppointments.value = await fetchUpcomingAppointments(1)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    totalNotificationsCount: totalQuestionsCount,
    appointmentsToday,
    tasksDueToday,
    prioritizedTodos,
    loading: computed(() => loading.value || questionsLoading.value),
    loadDashboard
  }
}


