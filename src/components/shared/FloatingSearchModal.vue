<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-start justify-center pt-32"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="close"></div>
        
        <!-- Search Input Container -->
        <div class="relative w-full max-w-2xl mx-4">
          <div class="bg-white rounded-lg shadow-xl border border-black/5 overflow-hidden">
            <div class="flex items-center gap-3 px-4 py-3">
              <Search :size="20" class="text-sub shrink-0" />
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                :placeholder="$t('common.search.placeholder')"
                class="flex-1 text-lg text-heading placeholder:text-sub focus:outline-none bg-transparent"
                @keyup.enter="handleSearch"
                @keyup.esc="close"
              />
              <button
                @click="close"
                class="p-1 hover:bg-surfaceSecondary rounded-md transition-colors shrink-0"
                aria-label="Close search"
              >
                <X :size="20" class="text-sub" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'search'])

const { t } = useI18n()
const searchInput = ref(null)
const searchQuery = ref('')

watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    searchQuery.value = ''
  }
})

const close = () => {
  emit('close')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    close()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
