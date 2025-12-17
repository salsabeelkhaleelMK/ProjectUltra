<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50">
    <!-- Left Sidebar - Lead Cards -->
    <EntityListSidebar
      title="Open leads"
      :items="leadsStore.leads"
      :selected-id="currentLead?.id"
      selected-class="bg-white border-2 border-blue-500 shadow-md"
      unselected-class="bg-white border border-gray-200 hover:border-blue-300"
      :open-menu-id="openCardMenu"
      :getName="(lead) => lead.customer.name"
      :getInitials="(lead) => lead.customer.initials"
      :getVehicleInfo="(lead) => `${lead.requestedCar.brand} ${lead.requestedCar.model}`"
      :avatarClass="() => 'bg-orange-100 text-orange-600'"
      @select="selectLead"
      @menu-click="toggleCardMenu"
      @menu-close="openCardMenu = null"
    >
      <template #badges="{ item: lead }">
        <span class="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">{{ lead.status }}</span>
        <span 
          v-if="lead.priority === 'Hot'"
          class="bg-red-50 text-red-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-100 flex items-center gap-1"
        >
          <i class="fa-solid fa-fire text-[9px]"></i> Hot
        </span>
      </template>
      <template #meta="{ item: lead }">
        <span class="text-[10px] font-bold uppercase tracking-wide" :class="lead.priority === 'Hot' ? 'text-red-500' : 'text-gray-400'">
          Due in {{ lead.nextActionDue }}
        </span>
      </template>
      <template #menu="{ item: lead }">
        <button 
          @click.stop="reassignLead(lead.id)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-solid fa-share text-gray-400"></i> Reassign
        </button>
        <button 
          v-if="lead.priority !== 'Hot'"
          @click.stop="markAsHot(lead.id)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-solid fa-fire text-orange-500"></i> Mark as hot
        </button>
        <button 
          v-else
          @click.stop="unmarkAsHot(lead.id)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-regular fa-snowflake text-gray-400"></i> Unmark as hot
        </button>
      </template>
    </EntityListSidebar>
    
    <!-- Main Content - Lead Details -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div v-if="!currentLead" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fa-solid fa-tag text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Select a lead to view details</p>
        </div>
      </div>
      
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 shrink-0 shadow-sm">
          <div class="px-4 md:px-8 py-4 md:py-6">
            <ContactInfo
              :initials="currentLead.customer.initials"
              :name="currentLead.customer.name"
              avatar-color-class="bg-orange-100 text-orange-600"
              :email="currentLead.customer.email"
              :phone="currentLead.customer.phone"
              :third-field-value="currentLead.customer.address"
              email-label="Email"
              phone-label="Phone"
              third-field-label="Address"
            >
              <template #tags>
                <span 
                  v-for="tag in currentLead.tags" 
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
            class="mb-6"
          />
          
          <!-- Stage & Owner Bar -->
          <div class="mb-6">
            <div class="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Stage</span>
                <span class="text-xs font-bold text-gray-800">{{ currentLead.stage }}</span>
              </div>
              <div class="w-px h-4 bg-gray-200"></div>
              <div class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Owner</span>
                <span class="text-xs font-bold text-gray-800">{{ currentLead.assignee }}</span>
              </div>
              <div class="w-px h-4 bg-gray-200"></div>
              <div class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Source</span>
                <span class="text-xs font-bold text-gray-800">{{ currentLead.source }}</span>
              </div>
            </div>
          </div>
          
          <!-- Add New Button - Overview Tab -->
          <AddNewButton
            v-if="activeTab === 'overview'"
            :actions="['note', 'financing', 'tradein', 'attachment', 'email', 'whatsapp', 'sms']"
            @action="handleAddNewAction"
          />
          
          <!-- Requested Car Widget -->
          <VehicleWidget
            v-if="activeTab === 'overview' && currentLead && currentLead.requestedCar"
            :brand="currentLead.requestedCar.brand"
            :model="currentLead.requestedCar.model"
            :year="currentLead.requestedCar.year"
            :image="currentLead.requestedCar.image || ''"
            :price="currentLead.requestedCar.price || null"
            :request-message="currentLead.requestedCar.requestMessage || ''"
            :request-type="currentLead.requestType || ''"
            :source="currentLead.source || ''"
            :dealership="currentLead.requestedCar.dealership || ''"
            :registration="currentLead.requestedCar.registration || ''"
            :kilometers="currentLead.requestedCar.kilometers !== undefined ? currentLead.requestedCar.kilometers : null"
            :fuel-type="currentLead.requestedCar.fuelType || ''"
            :gear-type="currentLead.requestedCar.gearType || ''"
            :vin="currentLead.requestedCar.vin || ''"
            :stock-days="currentLead.requestedCar.stockDays !== undefined ? currentLead.requestedCar.stockDays : null"
            :fiscal-entity="currentLead.fiscalEntity || ''"
            :source-details="currentLead.sourceDetails || ''"
          />
          
          <!-- Manage Lead Widget -->
          <div 
            v-if="activeTab === 'overview' && !currentLead.isDisqualified"
            class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8"
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
                    <p class="text-xs text-gray-500 mt-0.5">Call customer to discuss {{ currentLead.requestedCar.brand }} {{ currentLead.requestedCar.model }} interest.</p>
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
                    {{ currentLead.customer.phone }} Call <i class="fa-solid fa-phone text-xs"></i>
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
                    <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm">
                      <input type="radio" v-model="opportunityType" value="schedule" class="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-700">Schedule Appointment</span>
                        <span class="text-[10px] text-gray-400">Book a meeting or test drive</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Step 2: Appointment Form -->
                <div v-if="opportunityType === 'schedule'" class="space-y-4 animate-fade-in border-t border-gray-100 pt-4 mt-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Appointment Type</label>
                    <select v-model="appointmentType" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-colors shadow-sm">
                      <option value="" disabled>Select type...</option>
                      <option>Showroom Visit</option>
                      <option>Test Drive</option>
                      <option>Video Call</option>
                      <option>Home Visit</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Assign to Salesman</label>
                    <select v-model="appointmentAssignee" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-colors shadow-sm">
                      <option>Michael Thomas (Me)</option>
                      <option>Sarah Jenkins</option>
                      <option>David Miller</option>
                      <option>Jessica Lee</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Select Date</label>
                    <input type="date" v-model="appointmentDate" @change="showTimeslots = true" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none shadow-sm transition-colors cursor-pointer">
                  </div>
                  <div v-if="showTimeslots" class="animate-fade-in">
                    <label class="block text-xs font-medium text-gray-500 mb-2">Available Slots</label>
                    <div class="grid grid-cols-4 gap-2">
                      <button 
                        v-for="slot in ['09:00', '10:30', '11:00', '14:30', '15:00', '16:30']"
                        :key="slot"
                        @click="selectedTimeSlot = slot"
                        class="py-2 border border-gray-200 rounded-lg text-xs font-medium transition-all"
                        :class="selectedTimeSlot === slot ? 'border-blue-500 bg-blue-50 text-blue-600' : 'text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'"
                      >
                        {{ slot }}
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  @click="createOpportunity"
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-md shadow-green-100 flex items-center justify-center gap-2 mt-4"
                >
                  {{ opportunityType === 'schedule' ? 'Confirm Appointment' : 'Create Opportunity' }} <i class="fa-solid" :class="opportunityType === 'schedule' ? 'fa-arrow-right' : 'fa-check'"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Closed Lead Widget -->
          <div 
            v-if="currentLead.isDisqualified"
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
                <span class="font-medium">{{ currentLead.disqualifyReason || 'Not specified' }}</span>
              </div>
            </div>
          </div>
          <!-- Dynamic Inline Content Container -->
          <div v-if="activeTab !== 'overview'" class="space-y-4 mb-6 px-1">
            <div 
              v-for="item in filteredInlineContent" 
              :key="item.id"
              class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-4 animate-fade-in mb-4 feed-item"
            >
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border"
                :class="getInlineItemIconClass(item.type)"
              >
                <i :class="getInlineItemIcon(item.type)" class="text-sm"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-slate-800">{{ currentLead.customer.initials }}</span>
                  <span class="text-[10px] text-gray-400">{{ item.action || 'added' }}</span>
                  <span class="text-[10px] text-gray-400">• {{ formatTime(item.timestamp) }}</span>
                  <span v-if="item.autoDetected" class="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded border border-blue-100">Auto-detected</span>
                </div>
                <div v-if="item.content" class="text-sm text-slate-700">{{ item.content }}</div>
                <div v-if="item.data" class="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div v-if="item.type === 'tradein'" class="flex justify-between items-start">
                    <div>
                      <h4 class="text-sm font-bold text-slate-800">{{ item.data.brand }} {{ item.data.model }}</h4>
                      <div class="text-xs text-gray-500 mt-1 flex gap-3">
                        <span><i class="fa-regular fa-calendar mr-1"></i>{{ item.data.year }}</span>
                        <span><i class="fa-solid fa-road mr-1"></i>{{ item.data.km }} km</span>
                      </div>
                    </div>
                    <span class="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">Pending Eval</span>
                  </div>
                  <div v-else-if="item.type === 'financing'" class="flex justify-between items-center mb-2">
                    <h4 class="text-sm font-bold text-slate-800">{{ item.data.product }}</h4>
                    <span class="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Inline Widgets -->
          <!-- Communication Widget -->
          <div 
            v-if="showInlineWidget === 'communication'"
            class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 animate-fade-in relative"
          >
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
            <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{{ communicationType === 'email' ? 'Send Email' : communicationType === 'whatsapp' ? 'Send WhatsApp' : communicationType === 'sms' ? 'Send SMS' : 'Send Message' }}</h5>
            
            <div class="mb-3">
              <label class="block text-xs font-medium text-slate-700 mb-1">Template</label>
              <select v-model="selectedTemplate" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer">
                <option value="">Select a template...</option>
                <option>Follow-up</option>
                <option>Meeting Confirmation</option>
                <option>Quote Proposal</option>
                <option>Unable to Reach</option>
              </select>
            </div>

            <textarea 
              v-model="communicationMessage"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none mb-3" 
              rows="4" 
              placeholder="Type your message here..."
            ></textarea>
            
            <div class="flex justify-end gap-2">
              <button @click="cancelInlineWidget" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button @click="saveCommunication" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Send</button>
            </div>
          </div>

          <!-- Note Widget -->
          <div 
            v-if="showInlineWidget === 'note'"
            class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 animate-fade-in relative"
          >
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
            <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Note</h5>
            <textarea 
              v-model="noteText"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none" 
              rows="3" 
              placeholder="Type your note here..."
            ></textarea>
            <div class="flex justify-end gap-2 mt-3">
              <button @click="cancelInlineWidget" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button @click="saveNote" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save Note</button>
            </div>
          </div>

          <!-- Attachment Widget -->
          <div 
            v-if="showInlineWidget === 'attachment'"
            class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 animate-fade-in relative"
          >
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
            <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Add Attachment</h5>
            <div 
              @click="$refs.fileInput.click()"
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer relative group"
            >
              <input 
                ref="fileInput"
                type="file" 
                @change="handleFileSelect"
                class="absolute inset-0 opacity-0 cursor-pointer"
              >
              <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-cloud-arrow-up text-blue-500 text-lg"></i>
              </div>
              <p class="text-sm text-gray-700 font-medium group-hover:text-blue-600">Click to upload or drag and drop</p>
              <p class="text-xs text-gray-400 mt-1">{{ selectedFileName || 'SVG, PNG, JPG or PDF' }}</p>
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button @click="cancelInlineWidget" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button @click="saveAttachment" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Upload</button>
            </div>
          </div>

          <!-- Trade-in Widget -->
          <div 
            v-if="showInlineWidget === 'tradein'"
            class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6 animate-fade-in relative"
          >
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-sm font-bold text-slate-800">Trade-in</h5>
              <button @click="cancelInlineWidget" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Vehicle class</label>
                <select v-model="tradeInData.class" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-700">
                  <option>Car</option>
                </select>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">* Brand</label>
                  <select v-model="tradeInData.brand" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                    <option>Aiways</option>
                    <option>Audi</option>
                    <option>BMW</option>
                    <option>Mercedes-Benz</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Model</label>
                  <input type="text" v-model="tradeInData.model" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-slate-700">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Version</label>
                  <input type="text" v-model="tradeInData.version" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Km</label>
                  <input type="number" v-model="tradeInData.km" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Plate</label>
                  <input type="text" v-model="tradeInData.plate" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Registration date</label>
                  <input type="date" v-model="tradeInData.date" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
              <button @click="cancelInlineWidget" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button @click="saveTradeIn" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
            </div>
          </div>

          <!-- Financing Widget -->
          <div 
            v-if="showInlineWidget === 'financing'"
            class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6 animate-fade-in relative"
          >
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-sm font-bold text-slate-800">Financing Proposal</h5>
              <button @click="cancelInlineWidget" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Start date</label>
                  <input type="date" v-model="financingData.startDate" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Expiration date</label>
                  <input type="date" v-model="financingData.expDate" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Financial product name</label>
                <input type="text" v-model="financingData.productName" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Deposit</label>
                  <input type="number" v-model="financingData.deposit" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Total loan amount</label>
                  <input type="number" v-model="financingData.loanAmount" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
              <button @click="cancelInlineWidget" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button @click="saveFinancing" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
            </div>
          </div>

          <!-- "Add New" Divider Button -->
          <AddNewButton
            v-if="activeTab !== 'overview'"
            :actions="['note', 'financing', 'tradein', 'attachment', 'email', 'whatsapp', 'sms']"
            @action="handleAddNewAction"
          />
        </main>
      </div>
    </div>
    
    <!-- Right Sidebar - Activity Timeline -->
    <ActivitySummarySidebar
      title="Activity summary"
      :activities="filteredActivities"
      :collapsed="rightSidebarCollapsed"
      :show="!!currentLead"
      @toggle-collapse="rightSidebarCollapsed = !rightSidebarCollapsed"
    />
  </div>
  
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import EntityListSidebar from '@/components/shared/EntityListSidebar.vue'
import ActivitySummarySidebar from '@/components/shared/ActivitySummarySidebar.vue'
import ContactInfo from '@/components/shared/ContactInfo.vue'
import Tabs from '@/components/shared/Tabs.vue'
import VehicleWidget from '@/components/shared/VehicleWidget.vue'
import AddNewButton from '@/components/shared/AddNewButton.vue'
import RescheduleWidget from '@/components/shared/RescheduleWidget.vue'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()

const showTagMenu = ref(false)
const activeTab = ref('overview')
const handleAddNewAction = (action) => {
  if (['email', 'whatsapp', 'sms'].includes(action)) {
    openCommunicationWidget(action)
  } else {
    showInlineWidget.value = action
  }
}

const handleReschedule = (data) => {
  // Handle reschedule logic here
  showRescheduleWidget.value = false
}
const showRescheduleWidget = ref(false)
const showOpportunityWidget = ref(false)
const showDisqualifyModal = ref(false)
const showCallPanel = ref(false)
const showCarDetails = ref(false)
const inlineContent = ref([])
const callNotes = ref([])
const callTimer = ref(0)
const transcriptionLines = ref([])
const quickNoteText = ref('')
const showInlineWidget = ref(null)
const communicationType = ref('email')
const communicationMessage = ref('')
const selectedTemplate = ref('')
const noteText = ref('')
const selectedFileName = ref('')
const selectedFile = ref(null)
const tradeInData = ref({
  class: 'Car',
  brand: '',
  model: '',
  version: '',
  km: '',
  plate: '',
  date: ''
})
const financingData = ref({
  startDate: '',
  expDate: '',
  productName: '',
  deposit: '',
  loanAmount: ''
})
const opportunityType = ref('qualify')
const appointmentType = ref('')
const appointmentAssignee = ref('Michael Thomas (Me)')
const appointmentDate = ref('')
const showTimeslots = ref(false)
const selectedTimeSlot = ref('')
const disqualifyCategory = ref('not-interested')
const disqualifyReason = ref('Data cleanup')
const callInterval = ref(null)
const transcriptionInterval = ref(null)
const conversationIndex = ref(0)
const callEnded = ref(false)
const extractedItems = ref([]) // Track which items have been extracted
const extractingInfo = ref(false) // Loading state for extraction
const openCardMenu = ref(null)
const rightSidebarCollapsed = ref(false)

const currentLead = computed(() => leadsStore.currentLead)

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
  if (activeTab.value === 'overview') return []
  return inlineContent.value.filter(item => {
    if (activeTab.value === 'communication') {
      return ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)
    }
    return item.type === activeTab.value
  })
})

const filteredActivities = computed(() => {
  const allActivities = [...leadsStore.currentLeadActivities, ...inlineContent.value]
  if (activeTab.value === 'overview') {
    return allActivities
  }
  return allActivities.filter(activity => {
    if (activeTab.value === 'communication') {
      return ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(activity.type)
    }
    return activity.type === activeTab.value
  })
})

const shouldShowDateHeader = (index, activity) => {
  if (index === 0) return true
  const prevActivity = filteredActivities.value[index - 1]
  const currentDate = new Date(activity.timestamp).toDateString()
  const prevDate = new Date(prevActivity.timestamp).toDateString()
  return currentDate !== prevDate
}

const formatActivityDate = (timestamp) => {
  const date = new Date(timestamp)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const formatActivityTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const availableTags = [
  { name: 'Sport', color: 'bg-red-400' },
  { name: 'Blacklist', color: 'bg-indigo-400' },
  { name: 'Green', color: 'bg-green-400' },
  { name: 'Premium', color: 'bg-blue-400' },
  { name: 'Rent', color: 'bg-purple-400' },
  { name: 'Automation', color: 'bg-orange-400' },
  { name: 'Complete Profile', color: 'bg-lime-400' }
]

const leadTabs = computed(() => [
  { key: 'overview', label: 'Overview', count: tabCounts.value.overview },
  { key: 'note', label: 'Notes', count: tabCounts.value.note },
  { key: 'communication', label: 'Communication', count: tabCounts.value.communication },
  { key: 'attachment', label: 'Attachments', count: tabCounts.value.attachment }
])

const tabCounts = computed(() => {
  const allItems = [...leadsStore.currentLeadActivities, ...inlineContent.value]
  return {
    overview: allItems.length,
    communication: allItems.filter(item => ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)).length,
    note: allItems.filter(item => item.type === 'note').length,
    tradein: allItems.filter(item => item.type === 'tradein').length,
    financing: allItems.filter(item => item.type === 'financing').length,
    attachment: allItems.filter(item => item.type === 'attachment').length
  }
})

const addTag = async (tagName) => {
  if (!currentLead.value.tags.includes(tagName)) {
    const updatedTags = [...currentLead.value.tags, tagName]
    await leadsStore.modifyLead(currentLead.value.id, { tags: updatedTags })
  }
  showTagMenu.value = false
}

onMounted(() => {
  const leadId = route.params.id
  leadsStore.loadLeadById(leadId)
  leadsStore.loadLeads()
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    leadsStore.loadLeadById(newId)
  }
})

const selectLead = (leadId) => {
  router.push(`/leads/${leadId}`)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
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

const getActivityIcon = (type) => {
  const icons = {
    'call': 'fa-solid fa-phone-slash',
    'note': 'fa-regular fa-note-sticky',
    'lead-created': 'fa-solid fa-car'
  }
  return icons[type] || 'fa-solid fa-circle'
}

const getActivityIconClass = (type) => {
  const classes = {
    'call': 'bg-red-50 border border-red-100 text-red-500',
    'note': 'bg-orange-50 border border-orange-100 text-orange-500',
    'lead-created': 'bg-gray-100 border border-gray-200 text-gray-500',
    'communication': 'bg-gray-100 border border-gray-200 text-gray-600',
    'email': 'bg-blue-100 border border-blue-200 text-blue-600',
    'whatsapp': 'bg-green-100 border border-green-200 text-green-600',
    'sms': 'bg-gray-100 border border-gray-200 text-gray-600',
    'attachment': 'bg-blue-50 border border-blue-100 text-blue-600',
    'tradein': 'bg-green-50 border border-green-100 text-green-600',
    'financing': 'bg-purple-50 border border-purple-100 text-purple-600'
  }
  return classes[type] || 'bg-gray-100 border border-gray-200 text-gray-500'
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
        // Conversation finished - end the call
        clearInterval(transcriptionInterval.value)
        clearInterval(callInterval.value)
        callEnded.value = true
        // Move call notes to activity feed
        moveCallNotesToFeed()
      }
    }, 2500)
  } else {
    if (callInterval.value) clearInterval(callInterval.value)
    if (transcriptionInterval.value) clearInterval(transcriptionInterval.value)
    callEnded.value = false
    // Move call notes to feed when call panel is closed
    if (callNotes.value.length > 0) {
      moveCallNotesToFeed()
    }
  }
}

const moveCallNotesToFeed = async () => {
  // Move all call notes to activity feed
  for (const note of callNotes.value) {
    const newItem = {
      id: Date.now() + Math.random(),
      type: 'note',
      action: 'added a note',
      content: note,
      timestamp: new Date().toISOString()
    }
    inlineContent.value.push(newItem)
    await leadsStore.addActivity(currentLead.value.id, {
      type: 'note',
      user: 'You',
      action: 'added a note',
      content: note
    })
  }
  // Clear call notes from transcription area
  callNotes.value = []
}

const extractTranscriptionInfo = async () => {
  extractingInfo.value = true
  
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Extract items from conversation that have action property and haven't been extracted yet
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
  // Hide the CTA after extraction
  showCallPanel.value = false
  callEnded.value = false
}

const copyPhoneNumber = () => {
  navigator.clipboard.writeText(currentLead.value.customer.phone)
  // Could show a toast notification here
}

const saveCallNote = () => {
  if (!quickNoteText.value.trim()) return
  callNotes.value.push(quickNoteText.value)
  quickNoteText.value = ''
}

const openCommunicationWidget = (type) => {
  communicationType.value = type
  showInlineWidget.value = 'communication'
  communicationMessage.value = ''
  selectedTemplate.value = ''
}

const cancelInlineWidget = () => {
  showInlineWidget.value = null
  communicationMessage.value = ''
  selectedTemplate.value = ''
  noteText.value = ''
  selectedFileName.value = ''
  selectedFile.value = null
  tradeInData.value = { class: 'Car', brand: '', model: '', version: '', km: '', plate: '', date: '' }
  financingData.value = { startDate: '', expDate: '', productName: '', deposit: '', loanAmount: '' }
}

const saveNote = async () => {
  if (!noteText.value.trim()) return
  
  const newItem = {
    id: Date.now(),
    type: 'note',
    action: 'added a note',
    content: noteText.value,
    timestamp: new Date().toISOString()
  }
  
  inlineContent.value.push(newItem)
  await leadsStore.addActivity(currentLead.value.id, {
    type: 'note',
    user: 'You',
    action: 'added a note',
    content: noteText.value
  })
  
  cancelInlineWidget()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    selectedFileName.value = file.name
  }
}

const saveAttachment = async () => {
  if (!selectedFile.value) return
  
  const newItem = {
    id: Date.now(),
    type: 'attachment',
    action: 'added an attachment',
    fileName: selectedFileName.value,
    timestamp: new Date().toISOString()
  }
  
  inlineContent.value.push(newItem)
  await leadsStore.addActivity(currentLead.value.id, {
    type: 'attachment',
    user: 'You',
    action: 'added an attachment',
    fileName: selectedFileName.value
  })
  
  cancelInlineWidget()
}

const saveTradeIn = async () => {
  if (!tradeInData.value.brand) return
  
  const newItem = {
    id: Date.now(),
    type: 'tradein',
    action: 'added a trade-in',
    data: {
      brand: tradeInData.value.brand,
      model: tradeInData.value.model || 'Unknown Model',
      year: tradeInData.value.date ? new Date(tradeInData.value.date).getFullYear() : 'Unknown Year',
      km: tradeInData.value.km || '0'
    },
    timestamp: new Date().toISOString()
  }
  
  inlineContent.value.push(newItem)
  await leadsStore.addActivity(currentLead.value.id, {
    type: 'tradein',
    user: 'You',
    action: 'added a trade-in',
    data: newItem.data
  })
  
  cancelInlineWidget()
}

const saveFinancing = async () => {
  if (!financingData.value.productName) return
  
  const newItem = {
    id: Date.now(),
    type: 'financing',
    action: 'added a financing proposal',
    data: {
      product: financingData.value.productName,
      provider: 'Audi Financial',
      total: financingData.value.loanAmount || '0',
      monthly: Math.round((parseFloat(financingData.value.loanAmount || 0) / 36)).toString()
    },
    timestamp: new Date().toISOString()
  }
  
  inlineContent.value.push(newItem)
  await leadsStore.addActivity(currentLead.value.id, {
    type: 'financing',
    user: 'You',
    action: 'added a financing proposal',
    data: newItem.data
  })
  
  cancelInlineWidget()
}

const saveCommunication = async () => {
  if (!communicationMessage.value.trim() && !selectedTemplate.value) return
  
  const newItem = {
    id: Date.now(),
    type: 'communication',
    action: `sent via ${communicationType.value}`,
    content: communicationMessage.value || `Sent template: ${selectedTemplate.value}`,
    timestamp: new Date().toISOString()
  }
  
  inlineContent.value.push(newItem)
  await leadsStore.addActivity(currentLead.value.id, {
    type: communicationType.value,
    user: 'You',
    action: `sent via ${communicationType.value}`,
    content: newItem.content
  })
  
  cancelInlineWidget()
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
  // Navigate to create opportunity or show success message
  showOpportunityWidget.value = false
  // In a real app, you'd create the opportunity here
  router.push('/opportunities')
}

const confirmDisqualification = async () => {
  await leadsStore.modifyLead(currentLead.value.id, {
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

const toggleCardMenu = (leadId) => {
  openCardMenu.value = openCardMenu.value === leadId ? null : leadId
}

const reassignLead = async (leadId) => {
  // In a real app, you'd show a reassign modal
  openCardMenu.value = null
  console.log('Reassign lead', leadId)
}

const markAsHot = async (leadId) => {
  await leadsStore.modifyLead(leadId, { priority: 'Hot' })
  openCardMenu.value = null
}

const unmarkAsHot = async (leadId) => {
  await leadsStore.modifyLead(leadId, { priority: 'Normal' })
  openCardMenu.value = null
}

onUnmounted(() => {
  if (callInterval.value) clearInterval(callInterval.value)
  if (transcriptionInterval.value) clearInterval(transcriptionInterval.value)
})
</script>

