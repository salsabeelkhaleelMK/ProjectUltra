<template>
  <header class="relative h-16 bg-surface border-b border flex items-center justify-between px-4 md:px-8 shrink-0 gap-4 z-50">
    <!-- Hamburger Menu (Mobile Only) -->
    <button 
      @click="$emit('toggle-sidebar')"
      class="md:hidden w-11 h-11 flex items-center justify-center text-body hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
      aria-label="Open navigation menu"
      aria-expanded="false"
    >
      <i class="fa-solid fa-bars text-lg"></i>
    </button>
    
    <!-- Search Bar -->
    <div class="flex-1 min-w-0 max-w-lg">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sub text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="$t('common.search.placeholder')" 
          class="w-full bg-surfaceSecondary border border-input rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-600 focus:bg-surface transition-all placeholder:text-sub"
          @keyup.enter="handleSearch"
        >
      </div>
    </div>
    
    <!-- Right Side Actions -->
    <div class="flex items-center gap-2 md:gap-4 ml-0 md:ml-8 shrink-0">
      <!-- Language Selector -->
      <div class="relative" v-click-outside="() => (showLanguageMenu = false)">
        <button 
          @click.stop="toggleLanguageMenu"
          class="flex items-center gap-2 hover:bg-surfaceSecondary rounded-lg px-3 py-2 transition-colors"
          :title="$t('common.navigation.settings')"
        >
          <i class="fa-solid fa-globe text-lg text-body"></i>
          <span class="hidden md:inline text-sm font-medium text-body">{{ currentLanguageName }}</span>
        </button>
        
        <!-- Language Dropdown -->
        <!-- z-[100] is necessary to ensure dropdown appears above all page content -->
        <!-- Using !bg-white to force background with higher specificity -->
        <div 
          v-if="showLanguageMenu"
          class="absolute right-0 top-full mt-2 w-48 !bg-white border border rounded-xl shadow-lg overflow-hidden z-[100]"
          @click.stop
        >
          <div class="p-2">
            <button 
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="w-full text-left px-3 py-2 text-sm text-body hover:bg-red-50 hover:text-brand-red rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': currentLocale === lang.code }"
            >
              <span class="text-base">{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Action Items Icon (hidden) -->
      <router-link 
        v-if="false"
        to="/action-items"
        class="relative p-2 rounded-lg hover:bg-surfaceSecondary transition-colors"
        title="Action Items"
      >
        <i class="fa-solid fa-bell text-lg text-body"></i>
        <span 
          v-if="actionItemsCount > 0"
          class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ actionItemsCount > 9 ? '9+' : actionItemsCount }}
        </span>
      </router-link>
      
      <!-- User Menu -->
      <div class="relative" v-click-outside="() => (showUserMenu = false)">
        <button 
          class="flex items-center gap-2 hover:bg-surfaceSecondary rounded-lg px-3 py-2 transition-colors"
          @click.stop="toggleUserMenu"
        >
          <div class="text-left hidden md:block">
            <div class="text-sm font-semibold text-heading">{{ userStore.currentUser.name }}</div>
            <div class="text-xs capitalize text-sub">{{ userStore.currentUser.role }}</div>
          </div>
          <i class="fa-solid fa-chevron-down text-xs text-sub"></i>
        </button>
        
        <!-- User Dropdown -->
        <!-- z-[100] is necessary to ensure dropdown appears above all page content -->
        <!-- Using !bg-white to force background with higher specificity -->
        <div 
          v-if="showUserMenu"
          class="absolute right-0 top-full mt-2 w-56 !bg-white border border rounded-xl shadow-lg overflow-hidden z-[100]"
        >
          <div class="p-3 border-b border bg-surfaceSecondary">
            <div class="text-sm font-semibold text-heading">{{ userStore.currentUser.name }}</div>
            <div class="text-xs text-sub">{{ userStore.currentUser.email }}</div>
          </div>
          <div class="p-2">
            <button 
              @click="switchRole('manager')"
              class="w-full text-left px-3 py-2 text-sm text-body hover:bg-red-50 hover:text-brand-red rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': userStore.currentUser.role === 'manager' }"
            >
              <i class="fa-solid fa-user-shield w-4"></i> {{ $t('common.actions.switchRole') }} {{ $t('common.roles.manager') }}
            </button>
            <button 
              @click="switchRole('salesman')"
              class="w-full text-left px-3 py-2 text-sm text-body hover:bg-surfaceSecondary rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': userStore.currentUser.role === 'salesman' }"
            >
              <i class="fa-solid fa-user-tie w-4"></i> {{ $t('common.actions.switchRole') }} {{ $t('common.roles.salesman') }}
            </button>
            <button 
              @click="switchRole('operator')"
              class="w-full text-left px-3 py-2 text-sm text-body hover:bg-surfaceSecondary rounded-lg transition-colors flex items-center gap-2"
              :class="{ 'bg-red-50 text-brand-red': userStore.currentUser.role === 'operator' }"
            >
              <i class="fa-solid fa-headset w-4"></i> {{ $t('common.actions.switchRole') }} {{ $t('common.roles.operator') }}
            </button>
          </div>
          <!-- Separator -->
          <div class="h-px bg-border mx-2"></div>
          <!-- Dark Mode Toggle -->
          <div class="p-2">
            <button 
              @click="toggleDarkMode"
              class="w-full text-left px-3 py-2 text-sm text-body hover:bg-surfaceSecondary rounded-lg transition-colors flex items-center gap-2"
            >
              <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" class="w-4"></i> 
              {{ isDarkMode ? $t('common.actions.lightMode') : $t('common.actions.darkMode') }}
            </button>
          </div>
          <!-- Separator -->
          <div class="h-px bg-border mx-2"></div>
          <!-- Logout -->
          <div class="p-2">
            <button 
              @click="handleLogout"
              class="w-full text-left px-3 py-2 text-sm text-body hover:bg-surfaceSecondary rounded-lg transition-colors flex items-center gap-2"
            >
              <i class="fa-solid fa-right-from-bracket w-4"></i> {{ $t('common.actions.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { useActionableQuestions } from '@/composables/useActionableQuestions'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { locale, t } = useI18n()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { totalQuestionsCount, loadQuestions } = useActionableQuestions()
const { isDark, toggleTheme } = useTheme()

const searchQuery = ref('')
const showUserMenu = ref(false)
const showLanguageMenu = ref(false)

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
]

const currentLocale = computed(() => locale.value)
const currentLanguageName = computed(() => {
  const lang = languages.find(l => l.code === locale.value)
  return lang ? lang.name : 'English'
})

const actionItemsCount = computed(() => totalQuestionsCount.value)
const isDarkMode = computed(() => isDark())

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

const changeLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('app-locale', langCode)
  showLanguageMenu.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Global search is not implemented yet; this is a no-op hook
    // that can be connected to a backend or in-memory search later.
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const switchRole = (role) => {
  userStore.switchRole(role)
  showUserMenu.value = false
  router.push('/home')
}

const handleLogout = () => {
  showUserMenu.value = false
  // TODO: Implement logout functionality
}

const toggleDarkMode = () => {
  toggleTheme()
}

onMounted(() => {
  // Load action items count
  loadQuestions()
})
</script>

