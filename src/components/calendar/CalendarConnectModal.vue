<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-lg text-gray-900">Connect Calendar</h3>
              <p class="text-xs text-gray-500 mt-1">Sync your external calendars to see all events in one place.</p>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <!-- Connecting State -->
          <div v-if="connectingTo" class="text-center py-8">
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse"
              :class="connectingTo === 'google' ? 'bg-red-100' : 'bg-blue-100'"
            >
              <i v-if="connectingTo === 'google'" class="fa-brands fa-google text-2xl text-red-500"></i>
              <i v-else class="fa-brands fa-microsoft text-2xl text-blue-500"></i>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              Connecting to {{ connectingTo === 'google' ? 'Google Calendar' : 'Microsoft Outlook' }}...
            </p>
            <p class="text-xs text-gray-400">Please complete authentication in the popup window</p>
          </div>

          <!-- Calendar Options -->
          <div v-else class="space-y-3">
            <!-- Connected Calendars -->
            <div v-if="connectedCalendars.length > 0" class="mb-4">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Connected</p>
              <div class="space-y-2">
                <div
                  v-for="cal in connectedCalendars"
                  :key="cal.id"
                  class="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center bg-white"
                    >
                      <i v-if="cal.type === 'google'" class="fa-brands fa-google text-red-500"></i>
                      <i v-else class="fa-brands fa-microsoft text-blue-500"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ cal.email }}</p>
                      <p class="text-xs text-green-600">
                        <i class="fa-solid fa-check-circle mr-1"></i>Connected
                      </p>
                    </div>
                  </div>
                  <button
                    @click="$emit('disconnect', cal.id)"
                    class="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>

            <!-- Available Connections -->
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {{ connectedCalendars.length > 0 ? 'Add another calendar' : 'Choose a calendar provider' }}
            </p>

            <!-- Google Calendar -->
            <button
              @click="$emit('connect', 'google')"
              class="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <i class="fa-brands fa-google text-xl text-red-500"></i>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-gray-900">Google Calendar</p>
                <p class="text-xs text-gray-500">Connect your Google account</p>
              </div>
              <i class="fa-solid fa-arrow-right text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"></i>
            </button>

            <!-- Microsoft Outlook -->
            <button
              @click="$emit('connect', 'microsoft')"
              class="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <i class="fa-brands fa-microsoft text-xl text-blue-500"></i>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-gray-900">Microsoft Outlook</p>
                <p class="text-xs text-gray-500">Connect your Microsoft account</p>
              </div>
              <i class="fa-solid fa-arrow-right text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"></i>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <p class="text-[10px] text-gray-400 text-center">
            <i class="fa-solid fa-lock mr-1"></i>
            Your calendar data is securely synced and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  connectedCalendars: {
    type: Array,
    required: true
  },
  connectingTo: {
    type: String,
    default: null
  }
})

defineEmits(['close', 'connect', 'disconnect'])
</script>
