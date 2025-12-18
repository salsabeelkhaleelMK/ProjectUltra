import { ref, computed, watch } from 'vue'

/**
 * Centralised inline-widget state and handlers for task feeds (leads & opportunities).
 *
 * Responsibilities:
 * - Track active tab and which inline widget (note, attachment, communication, etc.) is open.
 * - Orchestrate creation/update/deletion of activities via the provided store API.
 * - Ensure overview-only actions (e.g. trade-in/financing modals) are delegated to the caller.
 *
 * @param {Object} options
 * @param {{ currentActivities: import('vue').ComputedRef<Array>, addActivity: Function, updateActivity: Function, deleteActivity: Function }} options.store
 * @param {import('vue').ComputedRef<string|number>} options.taskId  Reactive task id for store calls.
 * @param {(type: string) => string} options.getTabForItemType       Maps activity type to tab key.
 * @param {(action: string) => boolean} options.isOverviewModalAction Returns true for overview actions handled via modals.
 */
export function useTaskInlineWidgets(options) {
  const {
    store,
    taskId,
    getTabForItemType,
    isOverviewModalAction
  } = options

  const activeTab = ref('overview')
  const showInlineWidget = ref(null)
  const editingItem = ref(null)
  const communicationType = ref('email')
  const inlineContent = ref([])

  const filteredInlineContent = computed(() => {
    const baseItems = [
      ...store.currentActivities.value,
      ...inlineContent.value.filter(item => !item.activityId)
    ]
    return baseItems.filter(item => {
      const tabKey = getTabForItemType(item.type)
      if (activeTab.value === 'overview') return tabKey === 'overview'
      return tabKey === activeTab.value
    })
  })

  const handleAddNewAction = (action) => {
    editingItem.value = null

    if (activeTab.value === 'overview' && isOverviewModalAction(action)) {
      return { modalAction: action }
    }

    if (['email', 'whatsapp', 'sms'].includes(action)) {
      communicationType.value = action
      showInlineWidget.value = 'communication'
    } else {
      showInlineWidget.value = action
    }
    return null
  }

  const handleWidgetSave = async (data) => {
    if (data.isEdit) {
      const index = inlineContent.value.findIndex(i => i.id === data.id)
      if (index > -1) {
        inlineContent.value[index] = { ...inlineContent.value[index], ...data }
      }

      if (editingItem.value?.activityId) {
        await store.updateActivity(taskId.value, editingItem.value.activityId, {
          type: data.communicationType || data.type,
          user: 'You',
          action: data.action,
          content: data.content,
          fileName: data.fileName,
          data: data.data
        })
      }
    } else {
      const itemType = data.communicationType || data.type

      const activity = await store.addActivity(taskId.value, {
        type: itemType,
        user: 'You',
        action: data.action,
        content: data.content,
        fileName: data.fileName,
        data: data.data
      })

      inlineContent.value.push({
        id: activity.id,
        type: itemType === 'email' || itemType === 'whatsapp' || itemType === 'sms' ? 'communication' : itemType,
        action: data.action,
        content: data.content,
        fileName: data.fileName,
        data: data.data,
        timestamp: activity.timestamp,
        activityId: activity.id
      })
    }

    showInlineWidget.value = null
    editingItem.value = null
  }

  const handleWidgetCancel = () => {
    showInlineWidget.value = null
    editingItem.value = null
  }

  const handleEditItem = (item) => {
    editingItem.value = item
    showInlineWidget.value = item.type
  }

  const handleDeleteItem = async (item) => {
    const index = inlineContent.value.findIndex(i => i.id === item.id)
    if (index > -1) inlineContent.value.splice(index, 1)

    if (item.activityId) {
      await store.deleteActivity(taskId.value, item.activityId)
    }
  }

  watch(activeTab, () => {
    showInlineWidget.value = null
    editingItem.value = null
  })

  return {
    activeTab,
    showInlineWidget,
    editingItem,
    communicationType,
    inlineContent,
    filteredInlineContent,
    handleAddNewAction,
    handleWidgetSave,
    handleWidgetCancel,
    handleEditItem,
    handleDeleteItem
  }
}


