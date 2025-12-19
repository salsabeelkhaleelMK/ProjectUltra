<template>
  <div
    v-if="lead"
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
  >
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-thumbtack text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Manage Next steps</h3>
      </div>
      <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Task pending</span>
    </div>

    <div class="p-5 space-y-6">
      <!-- Task -->
      <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Initial Contact</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              Call customer to discuss {{ lead.requestedCar.brand }} {{ lead.requestedCar.model }} interest.
            </p>
          </div>
          <div class="flex items-center gap-2 text-orange-600 bg-white border border-orange-100 px-2 py-1 rounded text-xs font-semibold shadow-sm transition-colors">
            <span v-if="!showCallPanel">To be contacted <i class="fa-regular fa-clock"></i></span>
            <span v-else>In Call <i class="fa-solid fa-phone-volume animate-pulse"></i></span>
          </div>
        </div>

        <!-- Actions Row -->
        <div class="flex gap-3 flex-wrap">
          <button 
            @click="toggleCallPanel"
            class="bg-slate-700 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
          >
            {{ lead.customer.phone }} Call <i class="fa-solid fa-phone text-xs"></i>
          </button>
          <button 
            @click="copyPhoneNumber"
            class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            Copy number <i class="fa-regular fa-copy text-xs"></i>
          </button>
        </div>

        <!-- TRANSCRIPTION PANEL -->
        <div 
          v-if="showCallPanel && !callEnded"
          class="mt-4 bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-inner relative overflow-hidden"
        >
          <div class="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-wave-square text-blue-400 text-xs"></i>
              <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Transcribing</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span class="text-xs font-mono text-red-400">REC {{ formatTimer(callTimer) }}</span>
            </div>
          </div>
          <div class="space-y-2 h-32 overflow-y-auto flex flex-col justify-end scrollbar-hide">
            <div 
              v-for="(line, idx) in transcriptionLines" 
              :key="idx"
              class="text-xs font-mono transition-all duration-500"
              :class="line.speaker === 'Sales' ? 'text-gray-400' : 'text-slate-300'"
            >
              <span class="font-bold">{{ line.speaker }}:</span> <span>{{ line.text }}</span>
            </div>
          </div>
        </div>

        <!-- SAVED CALL NOTES CONTAINER (only during call) -->
        <div v-if="showCallPanel && !callEnded && callNotes.length > 0" class="mt-3 space-y-2">
          <div 
            v-for="(note, idx) in callNotes" 
            :key="idx"
            class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm animate-fade-in"
          >
            <div class="flex items-center gap-2 mb-1">
              <div class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">MT</div>
              <span class="text-[10px] font-bold text-slate-700">You</span>
              <span class="text-[10px] text-gray-400">• Just now</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">{{ note }}</p>
          </div>
        </div>

        <!-- Quick Note Input (only during call) -->
        <div v-if="showCallPanel && !callEnded" class="mt-3 relative z-10">
          <div class="relative">
            <textarea 
              v-model="quickNoteText"
              @keyup.ctrl.enter="saveCallNote"
              placeholder="Add a quick note about this call..." 
              rows="3" 
              class="w-full bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-colors shadow-sm resize-none"
            ></textarea>
            <button 
              @click="saveCallNote"
              class="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600 p-1.5 transition-colors" 
              title="Save Note"
            >
              <i class="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Call Ended - Extract Information CTA -->
        <div 
          v-if="showCallPanel && callEnded"
          class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-slate-800 text-sm">Call Ended</h4>
              <p class="text-xs text-gray-500 mt-0.5">Extract information from the transcription</p>
            </div>
          </div>
          <button 
            @click="extractTranscriptionInfo"
            :disabled="extractingInfo"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <i v-if="extractingInfo" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-magic"></i>
            <span>{{ extractingInfo ? 'Extracting...' : 'Extract information from transcription' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Actions & Reschedule -->
    <div class="bg-gray-50 border-t border-gray-200">
      <div class="p-4 flex justify-end gap-3">
        <!-- Requalify button (shown when lead is disqualified) -->
        <button 
          v-if="lead.isDisqualified"
          @click="handleRequalify"
          class="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-green-200 transition-colors flex items-center gap-2"
        >
          Requalify <i class="fa-solid fa-rotate-left"></i>
        </button>
        
        <!-- Regular actions (shown when lead is not disqualified) -->
        <template v-else>
          <button 
            @click="showDisqualifyModal = true"
            class="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-gray-200 hover:border-red-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            Disqualify <i class="fa-solid fa-ban"></i>
          </button>

          <button 
            @click="toggleReschedule"
            class="bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            Postpone <i class="fa-regular fa-clock"></i>
          </button>
          
          <button 
            @click="toggleCreateOpportunity"
            class="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-green-200 transition-colors flex items-center gap-2"
          >
            Qualify <i class="fa-solid fa-check"></i>
          </button>
        </template>
      </div>

      <!-- Reschedule Widget -->
      <RescheduleWidget 
        :show="showRescheduleWidget"
        @close="showRescheduleWidget = false"
        @confirm="handleReschedule"
      />

      <!-- Create Opportunity Widget -->
      <div v-if="showOpportunityWidget" class="border-t border-gray-200 p-5 bg-white transition-all">
        <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Qualify</h5>
        
        <!-- Step 1: Qualification Method -->
        <div class="mb-5">
          <label class="block text-xs font-medium text-gray-500 mb-2">Next Step</label>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm">
              <input type="radio" v-model="opportunityType" value="qualify" class="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-slate-700">Qualify without appointment</span>
                <span class="text-[10px] text-gray-400">Proceed directly to opportunity stage</span>
              </div>
            </label>
            <label 
              @click.prevent="opportunityType = opportunityType === 'schedule' ? 'qualify' : 'schedule'"
              class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm"
            >
              <input type="radio" :checked="opportunityType === 'schedule'" class="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300" @click.stop>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-slate-700">Schedule Appointment</span>
                <span class="text-[10px] text-gray-400">Book a meeting or test drive</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 2: Appointment Form -->
        <ScheduleAppointmentWidget
          v-if="opportunityType === 'schedule'"
          :show="opportunityType === 'schedule'"
          @confirm="handleScheduleAppointment"
          @cancel="opportunityType = 'qualify'"
        />
        
        <button 
          v-if="opportunityType !== 'schedule'"
          @click="createOpportunity"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-md shadow-green-100 flex items-center justify-center gap-2 mt-4"
        >
          Qualify <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>

    <!-- Disqualify Modal -->
    <DisqualifyModal
      :show="showDisqualifyModal"
      @confirm="handleDisqualify"
      @cancel="showDisqualifyModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useUserStore } from '@/stores/user'
import RescheduleWidget from '@/components/shared/RescheduleWidget.vue'
import ScheduleAppointmentWidget from '@/components/shared/ScheduleAppointmentWidget.vue'
import DisqualifyModal from '@/components/shared/DisqualifyModal.vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const leadsStore = useLeadsStore()
const userStore = useUserStore()

const showRescheduleWidget = ref(false)
const showOpportunityWidget = ref(false)
const showDisqualifyModal = ref(false)
const showCallPanel = ref(false)
const callNotes = ref([])
const callTimer = ref(0)
const transcriptionLines = ref([])
const quickNoteText = ref('')
const opportunityType = ref('qualify')
const callInterval = ref(null)
const transcriptionInterval = ref(null)
const conversationIndex = ref(0)
const callEnded = ref(false)
const extractedItems = ref([])
const extractingInfo = ref(false)

const conversation = [
  { speaker: 'Sales', text: 'Good morning, am I speaking with Mr. Adams?' },
  { speaker: 'Lead', text: 'Yes, this is Josh Adams speaking.' },
  { speaker: 'Sales', text: 'Hi Josh, Michael here regarding your Audi A6 inquiry.' },
  { speaker: 'Lead', text: 'Oh, hi Michael! Yes, I was waiting for your call.' },
  { speaker: 'Sales', text: 'Great. I see you\'re interested in the Allroad. Do you have a vehicle you\'d like to trade in?' },
  { speaker: 'Lead', text: 'Yes, I actually have a BMW X3, 2018 model with about 45,000 km.', action: { type: 'tradein', data: { brand: 'BMW', model: 'X3', year: '2018', km: '45,000', auto: true } } },
  { speaker: 'Sales', text: 'Excellent, we can certainly evaluate that. And regarding payment?' },
  { speaker: 'Lead', text: 'I\'d like to put down €5,000 and finance the rest over 3 years.', action: { type: 'financing', data: { product: 'Standard Loan', provider: 'Audi Financial', total: '14,000', monthly: '420', auto: true } } },
  { speaker: 'Sales', text: 'Understood. I\'ll note that down and prepare the proposal.', action: { type: 'note', data: 'Customer requests 3-year financing with €5k deposit.' } },
  { speaker: 'Lead', text: 'Sounds amazing. Let\'s proceed with the paperwork.' }
]

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toggleCallPanel = () => {
  showCallPanel.value = !showCallPanel.value
  if (showCallPanel.value) {
    callTimer.value = 0
    conversationIndex.value = 0
    transcriptionLines.value = []
    callEnded.value = false
    extractedItems.value = []
    
    callInterval.value = setInterval(() => {
      callTimer.value++
    }, 1000)
    
    transcriptionInterval.value = setInterval(() => {
      if (conversationIndex.value < conversation.length) {
        const line = conversation[conversationIndex.value]
        transcriptionLines.value.push({ speaker: line.speaker, text: line.text })
        
        conversationIndex.value++
        if (transcriptionLines.value.length > 4) {
          transcriptionLines.value.shift()
        }
      } else {
        clearInterval(transcriptionInterval.value)
        clearInterval(callInterval.value)
        callEnded.value = true
        moveCallNotesToFeed()
      }
    }, 2500)
  } else {
    if (callInterval.value) clearInterval(callInterval.value)
    if (transcriptionInterval.value) clearInterval(transcriptionInterval.value)
    callEnded.value = false
    if (callNotes.value.length > 0) {
      moveCallNotesToFeed()
    }
  }
}

const moveCallNotesToFeed = async () => {
  for (const note of callNotes.value) {
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'added a note',
      content: note
    })
  }
  callNotes.value = []
}

const extractTranscriptionInfo = async () => {
  extractingInfo.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  
  for (let i = 0; i < conversation.length; i++) {
    const line = conversation[i]
    if (line.action && !extractedItems.value.includes(i)) {
      if (line.action.type === 'tradein') {
        addTradeInToTimeline(line.action.data)
      } else if (line.action.type === 'financing') {
        addFinancingToTimeline(line.action.data)
      } else if (line.action.type === 'note') {
        addNoteToTimeline(line.action.data)
      }
      extractedItems.value.push(i)
    }
  }
  
  extractingInfo.value = false
  showCallPanel.value = false
  callEnded.value = false
}

const copyPhoneNumber = () => {
  navigator.clipboard.writeText(props.lead.customer.phone)
}

const saveCallNote = () => {
  if (!quickNoteText.value.trim()) return
  callNotes.value.push(quickNoteText.value)
  quickNoteText.value = ''
}

const addNoteToTimeline = (text) => {
  leadsStore.addActivity(props.lead.id, {
    type: 'note',
    user: 'You',
    action: 'added a note',
    content: text,
    data: { autoDetected: true }
  })
}

const addTradeInToTimeline = (data) => {
  leadsStore.addActivity(props.lead.id, {
    type: 'tradein',
    user: 'You',
    action: 'added a trade-in',
    data: { ...data, autoDetected: data.auto || false }
  })
}

const addFinancingToTimeline = (data) => {
  leadsStore.addActivity(props.lead.id, {
    type: 'financing',
    user: 'You',
    action: 'added a financing proposal',
    data: { ...data, autoDetected: data.auto || false }
  })
}

const toggleReschedule = () => {
  showRescheduleWidget.value = !showRescheduleWidget.value
  showOpportunityWidget.value = false
}

const toggleCreateOpportunity = () => {
  showOpportunityWidget.value = !showOpportunityWidget.value
  showRescheduleWidget.value = false
}

const handleReschedule = (data) => {
  showRescheduleWidget.value = false
  // Future: add reschedule activity using data
}

const handleScheduleAppointment = (appointmentData) => {
  // Future: create appointment activity for the new opportunity
  opportunityType.value = 'qualify'
  showOpportunityWidget.value = false
}

const createOpportunity = async () => {
  try {
    // Convert lead to opportunity
    const opportunityId = await leadsStore.convertLeadToOpportunity(props.lead.id)
    
    showOpportunityWidget.value = false
    
    // Check user permissions and navigate accordingly
    if (userStore.canAccessOpportunities()) {
      // Salesman or Manager - redirect to the new opportunity
      router.push({ path: `/tasks/${opportunityId}`, query: { type: 'opportunity' } })
    } else {
      // Operator - no access to opportunities, navigate to tasks list
      router.push('/tasks/1')
    }
  } catch (err) {
    console.error('Failed to convert lead to opportunity:', err)
  }
}

const handleRequalify = async () => {
  try {
    await leadsStore.requalifyLead(props.lead.id)
    // Reload lead to get updated state
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to requalify lead:', err)
  }
}

const handleDisqualify = async (data) => {
  try {
    await leadsStore.modifyLead(props.lead.id, {
      isDisqualified: true,
      disqualifyReason: data.reason,
      status: 'Disqualified'
    })
    
    // Add activity log
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'disqualified lead',
      content: `Lead disqualified - Category: ${data.category}, Reason: ${data.reason}`
    })
    
    showDisqualifyModal.value = false
    
    // Reload lead to get updated state
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to disqualify lead:', err)
  }
}
</script>


