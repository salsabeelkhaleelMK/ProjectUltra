<template>
  <div class="flex flex-col min-w-64 max-w-sm w-full bg-white rounded-lg shadow-nsc-card overflow-hidden">
    <div class="p-2 border-b border-border shrink-0">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('common.assignee.searchPlaceholder')"
        class="w-full h-10 min-h-10 px-3 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/15"
      />
    </div>
    <div class="max-h-96 overflow-y-auto p-2">
      <template v-if="hasAnyResults">
        <div
          v-for="section in filteredSections"
          :key="section.key"
          class="mb-3 last:mb-0"
        >
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1 mb-1">
            {{ section.label }}
          </p>
          <button
            v-for="item in section.items"
            :key="`${item.type}-${item.id}`"
            type="button"
            @click="handleSelect(item)"
            class="w-full flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted hover:border-brand-dark/30 transition-colors text-left"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0"
              :class="item.type === 'team' ? 'bg-green-100 text-green-700' : getRoleAvatarClass(item.role)"
            >
              <i v-if="item.type === 'team'" class="fa-solid fa-users text-xs"></i>
              <span v-else>{{ item.initials || '?' }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-sm text-foreground truncate">{{ item.name }}</p>
              <p v-if="item.type === 'user'" class="text-xs text-muted-foreground truncate capitalize">
                {{ item.role }} • {{ item.email }}
              </p>
            </div>
          </button>
        </div>
      </template>
      <div v-else class="text-center py-8">
        <i class="fa-solid fa-search text-2xl text-muted-foreground mb-2"></i>
        <p class="text-sm text-muted-foreground">{{ t('common.assignee.noAssigneesFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from '@/stores/users'

const { t } = useI18n()
const emit = defineEmits(['select'])

const usersStore = useUsersStore()
const searchQuery = ref('')

const assignableUsers = computed(() => usersStore.assignableUsers || [])
const assignableTeams = computed(() => usersStore.assignableTeams || [])

const teamNamesInOrder = computed(() => {
  const fromTeams = assignableTeams.value.map((t) => t.name)
  const fromUsers = [...new Set(assignableUsers.value.map((u) => u.team).filter(Boolean))]
  const seen = new Set(fromTeams)
  fromUsers.forEach((name) => {
    if (!seen.has(name)) {
      seen.add(name)
      fromTeams.push(name)
    }
  })
  return fromTeams
})

const sectionsWithItems = computed(() => {
  const sections = []
  const teamsAsAssignees = assignableTeams.value.map((team) => ({
    ...team,
    type: 'team',
    team: team.name
  }))
  if (teamsAsAssignees.length > 0) {
    sections.push({ key: 'teams', label: 'Teams', items: teamsAsAssignees })
  }
  teamNamesInOrder.value.forEach((teamName) => {
    const users = assignableUsers.value.filter((u) => u.team === teamName)
    if (users.length > 0) {
      sections.push({
        key: `team-${teamName}`,
        label: teamName,
        items: users.map((u) => ({ ...u, type: 'user' }))
      })
    }
  })
  return sections
})

const matchesSearch = (item, query) => {
  const q = query.toLowerCase()
  const name = (item.name || '').toLowerCase()
  const email = (item.email || '').toLowerCase()
  const role = (item.role || '').toLowerCase()
  const team = (item.team || '').toLowerCase()
  return name.includes(q) || email.includes(q) || role.includes(q) || team.includes(q)
}

const filteredSections = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return sectionsWithItems.value
  return sectionsWithItems.value
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => matchesSearch(item, q))
    }))
    .filter((section) => section.items.length > 0)
})

const hasAnyResults = computed(() => filteredSections.value.some((s) => s.items.length > 0))

function getRoleAvatarClass(role) {
  const classes = {
    manager: 'bg-blue-100 text-blue-700',
    salesman: 'bg-purple-100 text-purple-700',
    operator: 'bg-orange-100 text-orange-700'
  }
  return classes[role] || 'bg-muted text-muted-foreground'
}

function handleSelect(assignee) {
  const payload = assignee.type === 'team'
    ? { ...assignee, team: assignee.name, role: undefined, email: undefined, initials: undefined }
    : assignee
  emit('select', payload)
}
</script>
