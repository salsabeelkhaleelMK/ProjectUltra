import { ref, computed, watch } from 'vue'

/**
 * Composable for managing inline widget state and actions in task views
 * Handles adding, editing, deleting, and canceling inline widgets (notes, communications, etc.)
 */
export function useTaskInlineWidgets({ store, taskId, getTabForItemType, isOverviewModalAction }) {
  const showInlineWidget = ref(null)
  const editingItem = ref(null)
  const activeTab = ref('overview') // Default to overview tab
  const communicationType = ref('email')
  const inlineContent = ref([])

  // Clear inline widget when switching tabs
  watch(activeTab, () => {
    showInlineWidget.value = null
    editingItem.value = null
  })

  const filteredInlineContent = computed(() => {
    const baseItems = [
      ...store.currentActivities.value,
      ...inlineContent.value.filter(item => !item.activityId)
    ]
    return baseItems
      .filter(item => {
        const tabKey = getTabForItemType(item.type)
        if (activeTab.value === 'overview') return tabKey === 'overview'
        return tabKey === activeTab.value
      })
      .sort((a, b) => {
        // Sort by timestamp descending (most recent first)
        const dateA = new Date(a.timestamp || 0)
        const dateB = new Date(b.timestamp || 0)
        return dateB - dateA
      })
  })

  /**
   * Handle "Add New" action - either show inline widget or emit for overview modal
   */
  const handleAddNewAction = (action) => {
    editingItem.value = null

    if (activeTab.value === 'overview' && isOverviewModalAction && isOverviewModalAction(action)) {
      // This is an overview action (financing, tradein, purchase) - handled by parent
      return { type: 'overview-modal', action }
    }

    // Map communication actions to 'communication' widget type
    const communicationActions = ['email', 'sms', 'whatsapp', 'call']
    if (communicationActions.includes(action)) {
      communicationType.value = action
      showInlineWidget.value = 'communication'
    } else {
      showInlineWidget.value = action
    }
    return null
  }

  /**
   * Save widget data (create or update)
   */
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

  /**
   * Cancel widget (close without saving)
   */
  const handleWidgetCancel = () => {
    showInlineWidget.value = null
    editingItem.value = null
  }

  /**
   * Edit an existing item
   */
  const handleEditItem = (item) => {
    const tab = getTabForItemType(item.type)
    if (tab) {
      showInlineWidget.value = item.type === 'email' || item.type === 'whatsapp' || item.type === 'sms' || item.type === 'communication' ? 'communication' : item.type
      editingItem.value = item
    }
  }

  /**
   * Delete an item
   */
  const handleDeleteItem = async (itemId) => {
    try {
      await store.deleteActivity(taskId.value, itemId)
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }

  return {
    activeTab,
    showInlineWidget,
    inlineWidgetType: computed(() => showInlineWidget.value),
    editingItem,
    isEditing: computed(() => editingItem.value !== null),
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
