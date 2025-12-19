<template>
  <div v-if="show" class="border-t border-gray-200 p-5 bg-white transition-all">
    <div class="grid grid-cols-3 gap-3 mb-4">
      <button 
        @click="selectQuickOption('later-today')"
        class="flex flex-col items-center justify-center p-2 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
        :class="{ 'border-blue-400 bg-blue-50': selectedOption === 'later-today' }"
      >
        <span class="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Later Today</span>
        <span class="text-[10px] text-gray-400">+2 Hours</span>
      </button>
      <button 
        @click="selectQuickOption('tomorrow')"
        class="flex flex-col items-center justify-center p-2 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
        :class="{ 'border-blue-400 bg-blue-50': selectedOption === 'tomorrow' }"
      >
        <span class="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Tomorrow</span>
        <span class="text-[10px] text-gray-400">09:00 AM</span>
      </button>
      <button 
        @click="selectQuickOption('next-week')"
        class="flex flex-col items-center justify-center p-2 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
        :class="{ 'border-blue-400 bg-blue-50': selectedOption === 'next-week' }"
      >
        <span class="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Next Week</span>
        <span class="text-[10px] text-gray-400">Mon, 9 AM</span>
      </button>
    </div>
    <div class="flex gap-3 mb-4">
      <input 
        v-model="selectedDate"
        type="date" 
        class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
      >
      <input 
        v-model="selectedTime"
        type="time" 
        class="w-1/3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
      >
    </div>
    <div class="flex gap-3">
      <button 
        @click="handleCancel"
        class="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="handleConfirm"
        class="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg text-sm transition-colors"
      >
        Confirm New Time
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const selectedOption = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')

const selectQuickOption = (option) => {
  selectedOption.value = option
  // Set date and time based on option
  const now = new Date()
  if (option === 'later-today') {
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000) // +2 hours
    selectedDate.value = later.toISOString().split('T')[0]
    selectedTime.value = later.toTimeString().slice(0, 5)
  } else if (option === 'tomorrow') {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    selectedDate.value = tomorrow.toISOString().split('T')[0]
    selectedTime.value = '09:00'
  } else if (option === 'next-week') {
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay() + 1)) // Next Monday
    selectedDate.value = nextWeek.toISOString().split('T')[0]
    selectedTime.value = '09:00'
  }
}

const handleConfirm = () => {
  emit('confirm', {
    date: selectedDate.value,
    time: selectedTime.value,
    option: selectedOption.value
  })
  emit('close')
  // Reset
  selectedOption.value = null
  selectedDate.value = ''
  selectedTime.value = ''
}

const handleCancel = () => {
  emit('close')
  // Reset
  selectedOption.value = null
  selectedDate.value = ''
  selectedTime.value = ''
}
</script>

