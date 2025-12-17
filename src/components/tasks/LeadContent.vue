<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shrink-0 shadow-sm">
      <div class="px-4 md:px-8 py-4 md:py-6">
        <ContactInfo
          :initials="lead.customer.initials"
          :name="lead.customer.name"
          avatar-color-class="bg-orange-100 text-orange-600"
          :email="lead.customer.email"
          :phone="lead.customer.phone"
          :third-field-value="lead.customer.address"
          email-label="Email"
          phone-label="Phone"
          third-field-label="Address"
        >
          <template #tags>
            <span 
              v-for="tag in lead.tags" 
              :key="tag"
              class="px-2 py-0.5 rounded-full border bg-blue-50 border-blue-100 text-blue-700 text-xs font-semibold"
            >
              {{ tag }}
            </span>
            <div class="relative ml-1">
              <button 
                @click.stop="showTagMenu = !showTagMenu"
                class="text-[10px] md:text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors outline-none"
              >
                + Add tag
              </button>
              <div 
                v-if="showTagMenu"
                class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1 overflow-hidden"
                v-click-outside="() => showTagMenu = false"
              >
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Select Tag</div>
                <button 
                  v-for="availableTag in availableTags" 
                  :key="availableTag.name"
                  @click="addTag(availableTag.name)"
                  class="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-gray-50 rounded flex items-center gap-2 transition-colors"
                >
                  <span class="w-2 h-2 rounded-full" :class="availableTag.color"></span> {{ availableTag.name }}
                </button>
              </div>
            </div>
          </template>
        </ContactInfo>
      </div>
    </header>
    
    <!-- Scrollable Content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full scrollbar-hide">
      <!-- Tabs -->
      <Tabs 
        v-model="activeTab"
        :tabs="leadTabs"
        class="mb-4"
      />
      
      <!-- Add New Button (only on overview tab) -->
      <AddNewButton
        v-if="activeTab === 'overview'"
        :actions="['note', 'tradein', 'financing', 'attachment', 'email', 'whatsapp', 'sms']"
        :active-tab="activeTab"
        @action="handleAddNewAction"
      />
      
      <!-- Stage & Owner Bar - Under Add New button -->
      <div v-if="activeTab === 'overview'" class="mb-6">
        <div class="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full">
          <div class="flex items-center gap-2 px-3 py-1.5">
            <span class="text-[10px] text-gray-400 font-bold uppercase">Stage</span>
            <span class="text-xs font-bold text-gray-800">{{ lead.stage }}</span>
          </div>
          <div class="w-px h-4 bg-gray-200"></div>
          <div class="flex items-center gap-2 px-3 py-1.5">
            <span class="text-[10px] text-gray-400 font-bold uppercase">Owner</span>
            <span class="text-xs font-bold text-gray-800">{{ lead.assignee }}</span>
          </div>
          <div class="w-px h-4 bg-gray-200"></div>
          <div class="flex items-center gap-2 px-3 py-1.5">
            <span class="text-[10px] text-gray-400 font-bold uppercase">Source</span>
            <span class="text-xs font-bold text-gray-800">{{ lead.source }}</span>
          </div>
        </div>
      </div>
      
      <!-- Pinned Widgets Section (only on overview tab) -->
      <div v-if="activeTab === 'overview'" class="space-y-6 mb-6">
        <!-- Manage Lead Widget (Pinned) -->
        <div 
          v-if="!lead.isDisqualified"
          class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
          <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-thumbtack text-gray-400 text-xs"></i>
              <h3 class="font-bold text-slate-800 text-sm">Manage this lead</h3>
            </div>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Task pending</span>
          </div>
          
          <div class="p-5 space-y-6">
            <!-- Task -->
            <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm">Next Step: Initial Contact</h4>
                  <p class="text-xs text-gray-500 mt-0.5">Call customer to discuss {{ lead.requestedCar.brand }} {{ lead.requestedCar.model }} interest.</p>
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
              <button 
                @click="showDisqualifyModal = true"
                class="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-gray-200 hover:border-red-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
              >
                Disqualify <i class="fa-solid fa-ban"></i>
              </button>

              <button 
                @click="showRescheduleWidget = !showRescheduleWidget; showOpportunityWidget = false"
                class="bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
              >
                Postpone <i class="fa-regular fa-clock"></i>
              </button>
              
              <button 
                @click="showOpportunityWidget = !showOpportunityWidget; showRescheduleWidget = false"
                class="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-green-200 transition-colors flex items-center gap-2"
              >
                Create Opportunity <i class="fa-solid fa-check"></i>
              </button>
            </div>

            <!-- Reschedule Widget -->
            <RescheduleWidget 
              :show="showRescheduleWidget"
              @close="showRescheduleWidget = false"
              @confirm="handleReschedule"
            />

            <!-- Create Opportunity Widget -->
            <div v-if="showOpportunityWidget" class="border-t border-gray-200 p-5 bg-white transition-all">
              <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Create Opportunity</h5>
              
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
                Create Opportunity <i class="fa-solid fa-check"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Requested Car Widget (Pinned) -->
        <VehicleWidget
          v-if="lead && lead.requestedCar"
          :brand="lead.requestedCar.brand"
          :model="lead.requestedCar.model"
          :year="lead.requestedCar.year"
          :image="lead.requestedCar.image || ''"
          :price="lead.requestedCar.price || null"
          :request-message="lead.requestedCar.requestMessage || ''"
          :request-type="'Lead'"
          :source="lead.source || ''"
          :dealership="lead.requestedCar.dealership || ''"
          :registration="lead.requestedCar.registration || ''"
          :kilometers="lead.requestedCar.kilometers !== undefined ? lead.requestedCar.kilometers : null"
          :fuel-type="lead.requestedCar.fuelType || ''"
          :gear-type="lead.requestedCar.gearType || ''"
          :vin="lead.requestedCar.vin || ''"
          :stock-days="lead.requestedCar.stockDays !== undefined ? lead.requestedCar.stockDays : null"
          :fiscal-entity="lead.fiscalEntity || ''"
          :source-details="lead.sourceDetails || ''"
        />
      </div>
      
      <!-- Add New Button (for non-overview tabs) -->
      <AddNewButton
        v-if="activeTab !== 'overview'"
        :actions="['note', 'tradein', 'financing', 'attachment', 'email', 'whatsapp', 'sms']"
        :active-tab="activeTab"
        @action="handleAddNewAction"
      />
      
      <!-- Inline Widgets - Right after Add New Button -->
      <CommunicationWidget
        v-if="showInlineWidget === 'communication'"
        :type="communicationType"
        :task-type="'lead'"
        :task-id="lead.id"
        @save="handleWidgetSave"
        @cancel="handleWidgetCancel"
      />
      
      <NoteWidget
        v-if="showInlineWidget === 'note'"
        :item="editingItem"
        :task-type="'lead'"
        :task-id="lead.id"
        @save="handleWidgetSave"
        @cancel="handleWidgetCancel"
      />
      
      <AttachmentWidget
        v-if="showInlineWidget === 'attachment'"
        :item="editingItem"
        :task-type="'lead'"
        :task-id="lead.id"
        @save="handleWidgetSave"
        @cancel="handleWidgetCancel"
      />
      
      <TradeInWidget
        v-if="showInlineWidget === 'tradein'"
        :item="editingItem"
        :task-type="'lead'"
        :task-id="lead.id"
        @save="handleWidgetSave"
        @cancel="handleWidgetCancel"
      />
      
      <FinancingWidget
        v-if="showInlineWidget === 'financing'"
        :item="editingItem"
        :task-type="'lead'"
        :task-id="lead.id"
        @save="handleWidgetSave"
        @cancel="handleWidgetCancel"
      />
      
      <!-- Closed Lead Widget -->
      <div 
        v-if="activeTab === 'overview' && lead.isDisqualified"
        class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8"
      >
        <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 class="font-bold text-slate-800 text-sm">Manage this lead</h3>
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Task pending</span>
        </div>
        
        <div class="p-5 space-y-6">
          <!-- Task -->
          <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-slate-800 text-sm">Next Step: Initial Contact</h4>
                <p class="text-xs text-gray-500 mt-0.5">Call customer to discuss {{ lead.requestedCar.brand }} {{ lead.requestedCar.model }} interest.</p>
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
            <button 
              @click="showDisqualifyModal = true"
              class="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-gray-200 hover:border-red-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              Disqualify <i class="fa-solid fa-ban"></i>
            </button>

            <button 
              @click="showRescheduleWidget = !showRescheduleWidget; showOpportunityWidget = false"
              class="bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              Postpone <i class="fa-regular fa-clock"></i>
            </button>
            
            <button 
              @click="showOpportunityWidget = !showOpportunityWidget; showRescheduleWidget = false"
              class="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-green-200 transition-colors flex items-center gap-2"
            >
              Create Opportunity <i class="fa-solid fa-check"></i>
            </button>
          </div>

          <!-- Reschedule Widget -->
          <RescheduleWidget 
            :show="showRescheduleWidget"
            @close="showRescheduleWidget = false"
            @confirm="handleReschedule"
          />

          <!-- Create Opportunity Widget -->
          <div v-if="showOpportunityWidget" class="border-t border-gray-200 p-5 bg-white transition-all">
            <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Create Opportunity</h5>
            
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
                Create Opportunity <i class="fa-solid fa-check"></i>
              </button>
          </div>
        </div>
      </div>
      
      <!-- Closed Lead Widget -->
      <div 
        v-if="lead.isDisqualified"
        class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8"
      >
        <div class="p-6 flex flex-col items-center justify-center text-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <i class="fa-solid fa-ban text-red-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-slate-800 text-lg">Lead Disqualified</h3>
          <p class="text-sm text-gray-500 mt-1 mb-4">This lead has been marked as lost.</p>
          <div class="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-slate-700 shadow-sm">
            <span class="text-gray-400 text-xs uppercase font-bold tracking-wider">Reason:</span>
            <span class="font-medium">{{ lead.disqualifyReason || 'Not specified' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Feed Items Container -->
      <div v-if="filteredInlineContent.length > 0" class="space-y-4 mb-6 px-1">
        <FeedItemCard
          v-for="item in filteredInlineContent" 
          :key="item.id"
          :item="item"
          :task-type="'lead'"
          :customer-initials="lead.customer.initials"
          @edit="handleEditItem"
          @delete="handleDeleteItem"
        />
      </div>

    </main>
    
    <!-- Disqualify Modal -->
    <teleport to="body">
      <div 
        v-if="showDisqualifyModal"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
        @click.self="showDisqualifyModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transform transition-all scale-100">
          <div class="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="font-bold text-slate-800 text-lg">Disqualify Lead</h3>
            <p class="text-xs text-gray-500 mt-1">Please select a reason for disqualification.</p>
          </div>
          <div class="p-5">
            <div class="mb-4">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" v-model="disqualifyCategory" value="not-valid" class="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300">
                  Not Valid
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" v-model="disqualifyCategory" value="not-interested" class="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300">
                  Not Interested
                </label>
              </div>
            </div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Failure Reason</label>
            <select 
              v-model="disqualifyReason"
              class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-sm"
            >
              <option value="Data cleanup">Data cleanup</option>
              <option value="Unreachable">Unreachable</option>
              <option value="Purchase postponed">Purchase postponed</option>
              <option value="Vehicle sold">Vehicle sold</option>
              <option value="Out of budget">Out of budget</option>
              <option value="Financing rejected">Financing rejected</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Bought elsewhere">Bought elsewhere</option>
            </select>
          </div>
          <div class="p-4 bg-gray-50 flex justify-end gap-3">
            <button 
              @click="showDisqualifyModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-800 border border-transparent hover:border-gray-200 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              @click="confirmDisqualification"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-200 transition-all"
            >
              Confirm Disqualification
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import ContactInfo from '@/components/shared/ContactInfo.vue'
import Tabs from '@/components/shared/Tabs.vue'
import VehicleWidget from '@/components/shared/VehicleWidget.vue'
import AddNewButton from '@/components/shared/AddNewButton.vue'
import RescheduleWidget from '@/components/shared/RescheduleWidget.vue'
import ScheduleAppointmentWidget from '@/components/shared/ScheduleAppointmentWidget.vue'
import FeedItemCard from '@/components/feed/FeedItemCard.vue'
import NoteWidget from '@/components/widgets/NoteWidget.vue'
import AttachmentWidget from '@/components/widgets/AttachmentWidget.vue'
import TradeInWidget from '@/components/widgets/TradeInWidget.vue'
import FinancingWidget from '@/components/widgets/FinancingWidget.vue'
import CommunicationWidget from '@/components/widgets/CommunicationWidget.vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const leadsStore = useLeadsStore()

const showTagMenu = ref(false)
const activeTab = ref('overview')
const showRescheduleWidget = ref(false)
const showOpportunityWidget = ref(false)
const showDisqualifyModal = ref(false)
const showCallPanel = ref(false)
const inlineContent = ref([])
const callNotes = ref([])
const callTimer = ref(0)
const transcriptionLines = ref([])
const quickNoteText = ref('')
const showInlineWidget = ref(null)
const editingItem = ref(null)
const communicationType = ref('email')
const selectedTemplate = ref('')
const opportunityType = ref('qualify')
const disqualifyCategory = ref('not-interested')
const disqualifyReason = ref('Data cleanup')
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

const filteredInlineContent = computed(() => {
  const allItems = [...leadsStore.currentLeadActivities, ...inlineContent.value]
  
  if (activeTab.value === 'overview') {
    return allItems // Show all in overview
  }
  
  // Filter by tab type
  return allItems.filter(item => {
    if (activeTab.value === 'communication') {
      return ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)
    }
    return item.type === activeTab.value
  })
})

const leadTabs = computed(() => {
  const allItems = [...leadsStore.currentLeadActivities, ...inlineContent.value]
  const overviewCount = allItems.length
  const communicationCount = allItems.filter(item => ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)).length
  const noteCount = allItems.filter(item => item.type === 'note').length
  const attachmentCount = allItems.filter(item => item.type === 'attachment').length

  return [
    { key: 'overview', label: 'Overview', count: overviewCount },
    { key: 'note', label: 'Notes', count: noteCount },
    { key: 'communication', label: 'Communication', count: communicationCount },
    { key: 'attachment', label: 'Attachments', count: attachmentCount }
  ]
})

const availableTags = [
  { name: 'Sport', color: 'bg-red-400' },
  { name: 'Blacklist', color: 'bg-indigo-400' },
  { name: 'Green', color: 'bg-green-400' },
  { name: 'Premium', color: 'bg-blue-400' },
  { name: 'Rent', color: 'bg-purple-400' },
  { name: 'Automation', color: 'bg-orange-400' },
  { name: 'Complete Profile', color: 'bg-lime-400' }
]

const handleAddNewAction = (action) => {
  editingItem.value = null
  if (['email', 'whatsapp', 'sms'].includes(action)) {
    communicationType.value = action
    showInlineWidget.value = 'communication'
  } else {
    showInlineWidget.value = action
  }
}

const handleEditItem = (item) => {
  editingItem.value = item
  showInlineWidget.value = item.type
}

const handleDeleteItem = async (item) => {
  // Remove from inlineContent
  const index = inlineContent.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    inlineContent.value.splice(index, 1)
  }
  
  // Remove from store if it has an activity ID
  if (item.activityId) {
    await leadsStore.deleteActivity(props.lead.id, item.activityId)
  }
}

const handleWidgetSave = async (data) => {
  if (data.isEdit) {
    // Update existing item
    const index = inlineContent.value.findIndex(i => i.id === data.id)
    if (index > -1) {
      inlineContent.value[index] = { ...inlineContent.value[index], ...data }
    }
    
    // Update in store if it has an activity ID
    if (editingItem.value?.activityId) {
      await leadsStore.updateActivity(props.lead.id, editingItem.value.activityId, {
        type: data.communicationType || data.type,
        user: 'You',
        action: data.action,
        content: data.content,
        fileName: data.fileName,
        data: data.data
      })
    }
  } else {
    // Add new item
    const itemType = data.communicationType || data.type
    const newItem = {
      id: data.id,
      type: itemType === 'email' || itemType === 'whatsapp' || itemType === 'sms' ? 'communication' : itemType,
      action: data.action,
      content: data.content,
      fileName: data.fileName,
      data: data.data,
      timestamp: data.timestamp,
      autoDetected: data.autoDetected || false,
      communicationType: data.communicationType
    }
    
    inlineContent.value.push(newItem)
    
    // Also add to store
    const activity = await leadsStore.addActivity(props.lead.id, {
      type: itemType === 'email' || itemType === 'whatsapp' || itemType === 'sms' ? itemType : itemType,
      user: 'You',
      action: data.action,
      content: data.content,
      fileName: data.fileName,
      data: data.data
    })
    
    // Link the activity ID
    newItem.activityId = activity.id
  }
  
  showInlineWidget.value = null
  editingItem.value = null
}

const handleWidgetCancel = () => {
  showInlineWidget.value = null
  editingItem.value = null
}

const handleReschedule = (data) => {
  showRescheduleWidget.value = false
}

const addTag = async (tagName) => {
  if (!props.lead.tags.includes(tagName)) {
    const updatedTags = [...props.lead.tags, tagName]
    await leadsStore.modifyLead(props.lead.id, { tags: updatedTags })
  }
  showTagMenu.value = false
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getInlineItemIcon = (type) => {
  const icons = {
    'note': 'fa-regular fa-note-sticky',
    'communication': 'fa-solid fa-comment-dots',
    'email': 'fa-regular fa-envelope',
    'whatsapp': 'fa-brands fa-whatsapp',
    'sms': 'fa-solid fa-comment-dots',
    'attachment': 'fa-solid fa-paperclip',
    'tradein': 'fa-solid fa-car-side',
    'financing': 'fa-solid fa-file-invoice-dollar'
  }
  return icons[type] || 'fa-solid fa-circle'
}

const getInlineItemIconClass = (type) => {
  const classes = {
    'note': 'bg-orange-100 text-orange-600 border-orange-200',
    'communication': 'bg-gray-100 text-gray-600 border-gray-200',
    'email': 'bg-blue-100 text-blue-600 border-blue-200',
    'whatsapp': 'bg-green-100 text-green-600 border-green-200',
    'sms': 'bg-gray-100 text-gray-600 border-gray-200',
    'attachment': 'bg-blue-50 text-blue-600 border-blue-100',
    'tradein': 'bg-green-50 text-green-600 border-green-100',
    'financing': 'bg-purple-50 text-purple-600 border-purple-100'
  }
  return classes[type] || 'bg-gray-100 text-gray-600 border-gray-200'
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
    const newItem = {
      id: Date.now() + Math.random(),
      type: 'note',
      action: 'added a note',
      content: note,
      timestamp: new Date().toISOString()
    }
    inlineContent.value.push(newItem)
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
  const newItem = {
    id: Date.now(),
    type: 'note',
    action: 'added a note',
    content: text,
    timestamp: new Date().toISOString(),
    autoDetected: true
  }
  inlineContent.value.push(newItem)
}

const addTradeInToTimeline = (data) => {
  const newItem = {
    id: Date.now(),
    type: 'tradein',
    action: 'added a trade-in',
    data: data,
    timestamp: new Date().toISOString(),
    autoDetected: data.auto || false
  }
  inlineContent.value.push(newItem)
}

const addFinancingToTimeline = (data) => {
  const newItem = {
    id: Date.now(),
    type: 'financing',
    action: 'added a financing proposal',
    data: data,
    timestamp: new Date().toISOString(),
    autoDetected: data.auto || false
  }
  inlineContent.value.push(newItem)
}

const createOpportunity = async () => {
  showOpportunityWidget.value = false
  router.push('/tasks')
}

const handleScheduleAppointment = (appointmentData) => {
  // Handle schedule appointment confirmation
  showOpportunityWidget.value = false
  opportunityType.value = 'qualify'
  // TODO: Create appointment in calendar/backend
  router.push('/tasks')
}

const confirmDisqualification = async () => {
  await leadsStore.modifyLead(props.lead.id, {
    isDisqualified: true,
    disqualifyReason: disqualifyReason.value,
    stage: 'Disqualified'
  })
  showDisqualifyModal.value = false
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onUnmounted(() => {
  if (callInterval.value) clearInterval(callInterval.value)
  if (transcriptionInterval.value) clearInterval(transcriptionInterval.value)
})
</script>

