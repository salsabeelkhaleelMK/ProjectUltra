<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Settings">
      <template #actions>
      </template>
    </PageHeader>
    
    <!-- Content -->
    <div class="p-4 md:p-6 lg:p-8">
      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex gap-4">
          <button
            type="button"
            @click="activeTab = 'general'"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'general' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            General
          </button>
          <button
            type="button"
            @click="activeTab = 'urgency'"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'urgency' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Urgency Settings
          </button>
        </nav>
      </div>

      <form @submit.prevent="handleSave" class="space-y-8">
        <!-- General Tab Content -->
        <div v-if="activeTab === 'general'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Opportunity Task Widget Thresholds -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 class="heading-sub mb-4">Opportunity Task Widget Thresholds</h2>
          <p class="text-meta mb-6">Configure the number of days before task widgets are triggered for opportunities.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- OOFB -->
            <div>
              <label class="block text-meta-bold mb-2">OOFB (Overdue Offer Follow-up)</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-meta mb-1">Min Days</label>
                  <input
                    type="number"
                    v-model.number="localSettings.oofbMinDays"
                    min="1"
                    class="input w-full"
                  />
                </div>
                <div>
                  <label class="block text-meta mb-1">Max Days</label>
                  <input
                    type="number"
                    v-model.number="localSettings.oofbMaxDays"
                    min="1"
                    class="input w-full"
                  />
                </div>
              </div>
            </div>

            <!-- UFB -->
            <div>
              <label class="block text-meta-bold mb-2">UFB (Urgent Follow-up)</label>
              <label class="block text-meta mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.ufbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- OFB -->
            <div>
              <label class="block text-meta-bold mb-2">OFB (Offer Follow-up)</label>
              <label class="block text-meta mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.ofbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- NFU -->
            <div>
              <label class="block text-meta-bold mb-2">NFU (No Future Updates)</label>
              <label class="block text-meta mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.nfuDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- CFB -->
            <div>
              <label class="block text-meta-bold mb-2">CFB (Contract Follow-up)</label>
              <label class="block text-meta mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.cfbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- DFB -->
            <div>
              <label class="block text-meta-bold mb-2">DFB (Delivery Follow-up)</label>
              <label class="block text-meta mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.dfbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- In Negotiation → Needs Follow-up -->
            <div>
              <label class="block text-meta-bold mb-2">In Negotiation → Needs Follow-up</label>
              <label class="block text-meta mb-1">Auto-transition Days (Fixed: 3 days)</label>
              <input
                type="number"
                v-model.number="localSettings.offerSentToAwaitingResponseDays"
                min="1"
                class="input w-full"
                disabled
                value="3"
              />
            </div>
          </div>
        </div>

        <!-- Opportunity Abandonment -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="heading-sub mb-4">Opportunity Abandonment</h2>
          <p class="text-meta mb-6">Configure when opportunities are marked as abandoned.</p>
          
          <div class="space-y-6">
            <div>
              <label class="block text-meta-bold mb-2">Abandoned Threshold (Days)</label>
              <p class="text-meta mb-2">Number of days with no activity before marking as abandoned</p>
              <input
                type="number"
                v-model.number="localSettings.abandonedOpportunityDays"
                min="1"
                class="input w-full max-w-xs"
              />
            </div>

            <div>
              <label class="block text-meta-bold mb-3">Eligible Stages</label>
              <p class="text-meta mb-3">Select which stages can be marked as abandoned</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="stage in availableStages"
                  :key="stage"
                  class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': localSettings.abandonedEligibleStages?.includes(stage) }"
                >
                  <input
                    type="checkbox"
                    :value="stage"
                    v-model="localSettings.abandonedEligibleStages"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-content">{{ stage }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Lead Management -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="heading-sub mb-4">Lead Management</h2>
          <p class="text-meta mb-6">Configure lead qualification and conversion settings.</p>
          
          <div class="space-y-6">
            <div>
              <label class="block text-meta-bold mb-2">Max Contact Attempts</label>
              <p class="text-meta mb-2">Maximum number of contact attempts before auto-disqualification</p>
              <input
                type="number"
                v-model.number="localSettings.maxContactAttempts"
                min="1"
                max="20"
                class="input w-full max-w-xs"
              />
            </div>

            <Checkbox
              v-model="localSettings.excludeNotValidFromConversion"
              label='Exclude "NOT VALID" leads from conversion rate calculations'
            />
          </div>
        </div>

        <!-- Dormant Opportunities -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 class="heading-sub mb-4">Dormant Opportunities</h2>
          <p class="text-meta mb-6">Configure when opportunities are marked as dormant.</p>
          
          <div class="space-y-6">
            <!-- Toggle -->
            <div class="flex items-center gap-3">
              <Toggle v-model="localSettings.dormantOpportunityEnabled" name="dormantOpportunityEnabled" />
              <span class="text-meta-bold">
                Enable Dormant Opportunity Detection
              </span>
            </div>

            <div v-if="localSettings.dormantOpportunityEnabled" class="space-y-6 border-t border-gray-200 pt-6">
              <!-- Conditions Description -->
              <div>
                <h3 class="text-meta-bold mb-2">Conditions</h3>
                <p class="text-meta mb-3">
                  An opportunity is considered dormant when there are no new future appointments scheduled or no new offers created/imported. It is automatically cleared when any of the following conditions are met:
                </p>
                <ul class="text-meta list-disc list-inside space-y-1 ml-2">
                  <li>scheduling a future appointment,</li>
                  <li>creating/importing a new offer,</li>
                  <li>closing the opportunity as Won or Lost.</li>
                </ul>
              </div>

              <!-- Settings -->
              <div>
                <h3 class="text-meta-bold mb-4">Settings</h3>
                
                <!-- Time after last past appointment -->
                <div class="mb-6">
                  <label class="block text-meta-bold mb-2">Time after the last past appointment</label>
                  <p class="text-meta mb-3">The system will start counting from the opportunity creation date for all those ones without appointments planned yet.</p>
                  <div class="flex items-center gap-3">
                    <div>
                      <label class="block text-meta mb-1">Days</label>
                      <input
                        type="number"
                        v-model.number="localSettings.dormantOpportunityAfterAppointmentDays"
                        min="0"
                        class="input w-20"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Hours</label>
                      <input
                        type="number"
                        v-model.number="localSettings.dormantOpportunityAfterAppointmentHours"
                        min="0"
                        max="23"
                        class="input w-20"
                      />
                    </div>
                  </div>
                </div>

                <!-- Time after last offer -->
                <div>
                  <label class="block text-meta-bold mb-2">Time after the last offer has been created/imported</label>
                  <div class="flex items-center gap-3">
                    <div>
                      <label class="block text-meta mb-1">Days</label>
                      <input
                        type="number"
                        v-model.number="localSettings.dormantOpportunityAfterOfferDays"
                        min="0"
                        class="input w-20"
                      />
                    </div>
                    <div>
                      <label class="block text-meta mb-1">Hours</label>
                      <input
                        type="number"
                        v-model.number="localSettings.dormantOpportunityAfterOfferHours"
                        min="0"
                        max="23"
                        class="input w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Widgets -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="heading-sub mb-4">Task Widgets</h2>
          <p class="text-meta mb-6">Configure task widget behavior.</p>
          
          <Checkbox
            v-model="localSettings.autoCloseWidgetsOnClose"
            label="Auto-close NFU/OFB widgets when opportunity is closed (Won/Lost)"
          />
        </div>
        </div>

        <!-- Urgency Settings Tab Content -->
        <div v-if="activeTab === 'urgency'">
        <!-- Lead Urgency Auto-Sorter -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="heading-sub mb-4">Lead Urgency Auto-Sorter</h2>
          
          <!-- Explanation Section -->
          <div class="mb-6">
            <p class="text-meta mb-4">
              Prioritizes leads based on intent signals, behavioral engagement, and temporal urgency. Leads are scored and categorized into urgency levels.
            </p>
            <table class="w-full text-meta border border-gray-200 rounded-lg">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold">Level</th>
                  <th class="px-3 py-2 text-left font-semibold">Score</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-3 py-2 font-medium"><strong>HOT</strong></td>
                  <td class="px-3 py-2">{{ localSettings.urgencyThresholds?.hot || 80 }}-100</td>
                </tr>
                <tr>
                  <td class="px-3 py-2 font-medium"><strong>WARM</strong></td>
                  <td class="px-3 py-2">{{ localSettings.urgencyThresholds?.warm || 50 }}-{{ (localSettings.urgencyThresholds?.hot || 80) - 1 }}</td>
                </tr>
                <tr>
                  <td class="px-3 py-2 font-medium"><strong>STANDARD</strong></td>
                  <td class="px-3 py-2">{{ localSettings.urgencyThresholds?.standard || 20 }}-{{ (localSettings.urgencyThresholds?.warm || 50) - 1 }}</td>
                </tr>
                <tr>
                  <td class="px-3 py-2 font-medium"><strong>COLD</strong></td>
                  <td class="px-3 py-2">0-{{ (localSettings.urgencyThresholds?.standard || 20) - 1 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Configuration Controls -->
          <div class="space-y-6 border-t border-gray-200 pt-6">
            <!-- Enable/Disable Toggle -->
            <div class="flex items-center gap-3">
              <Toggle v-model="localSettings.urgencyEnabled" name="urgencyEnabled" />
              <span class="text-meta-bold">
                Enable Urgency Auto-Sorter
              </span>
            </div>
            
            <div v-if="localSettings.urgencyEnabled" class="space-y-6">
              <!-- Weight Sliders -->
              <div>
                <h3 class="text-meta-bold mb-2">Scoring Weights</h3>
                <p class="text-meta mb-4">
                  Adjust the relative importance of each factor. Weights are automatically normalized to 100%, so the system uses the ratio between values rather than absolute percentages.
                </p>
                <div class="space-y-4">
                  <div>
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <label class="text-meta-bold">Intent Signals</label>
                          <span class="text-meta">{{ localSettings.urgencyWeights?.intent || 40 }}%</span>
                        </div>
                        <p class="text-meta">Measured by explicit actions: test drive requests, financing inquiries, trade-in value checks, dealer location searches, vehicle configuration activity</p>
                      </div>
                    </div>
                    <input
                      type="range"
                      v-model.number="localSettings.urgencyWeights.intent"
                      min="0"
                      max="100"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <label class="text-meta-bold">Behavioral Engagement</label>
                          <span class="text-meta">{{ localSettings.urgencyWeights?.behavioral || 35 }}%</span>
                        </div>
                        <p class="text-meta">Measured by digital interaction depth: time spent using configurator, number of return visits, downloaded brochures or financing materials, depth of features explored</p>
                      </div>
                    </div>
                    <input
                      type="range"
                      v-model.number="localSettings.urgencyWeights.behavioral"
                      min="0"
                      max="100"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <label class="text-meta-bold">Temporal Urgency</label>
                          <span class="text-meta">{{ localSettings.urgencyWeights?.temporal || 25 }}%</span>
                        </div>
                        <p class="text-meta">Measured by time-sensitive factors: lead freshness, weekend/evening submissions, approaching the 4th contact attempt, days since last contact</p>
                      </div>
                    </div>
                    <input
                      type="range"
                      v-model.number="localSettings.urgencyWeights.temporal"
                      min="0"
                      max="100"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <p class="text-meta mt-2">
                    Total: {{ (localSettings.urgencyWeights?.intent || 0) + (localSettings.urgencyWeights?.behavioral || 0) + (localSettings.urgencyWeights?.temporal || 0) }}% 
                    (weights will be normalized automatically)
                  </p>
                </div>
              </div>
              
              <!-- Threshold Inputs -->
              <div>
                <h3 class="text-meta-bold mb-4">Urgency Level Thresholds</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-meta-bold mb-2">HOT (minimum score)</label>
                    <input
                      type="number"
                      v-model.number="localSettings.urgencyThresholds.hot"
                      min="0"
                      max="100"
                      class="input w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-meta-bold mb-2">WARM (minimum score)</label>
                    <input
                      type="number"
                      v-model.number="localSettings.urgencyThresholds.warm"
                      min="0"
                      max="100"
                      class="input w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-meta-bold mb-2">STANDARD (minimum score)</label>
                    <input
                      type="number"
                      v-model.number="localSettings.urgencyThresholds.standard"
                      min="0"
                      max="100"
                      class="input w-full"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Preview Section -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">Preview</h3>
                <p class="text-xs text-gray-600 mb-2">
                  Example scores based on current settings:
                </p>
                <div class="text-xs space-y-1">
                  <div class="flex items-center gap-2">
                    <span>HOT:</span>
                    <span class="font-medium">{{ localSettings.urgencyThresholds?.hot || 80 }}-100</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>WARM:</span>
                    <span class="font-medium">{{ localSettings.urgencyThresholds?.warm || 50 }}-{{ (localSettings.urgencyThresholds?.hot || 80) - 1 }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>STANDARD:</span>
                    <span class="font-medium">{{ localSettings.urgencyThresholds?.standard || 20 }}-{{ (localSettings.urgencyThresholds?.warm || 50) - 1 }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>COLD:</span>
                    <span class="font-medium">0-{{ (localSettings.urgencyThresholds?.standard || 20) - 1 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            label="Reset to Defaults"
            variant="outline"
            size="medium"
            @click="handleReset"
          />
          <div class="flex gap-3">
            <Button
              label="Cancel"
              variant="outline"
              size="medium"
              @click="handleCancel"
            />
            <Button
              label="Save Settings"
              variant="primary"
              size="medium"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { Button, Checkbox, Toggle } from '@motork/component-library'
import PageHeader from '@/components/layout/PageHeader.vue'

const settingsStore = useSettingsStore()

// Tab state
const activeTab = ref('general')

// Available stages for abandonment eligibility
const availableStages = [
  'Qualified',
  'Awaiting Appointment',
  'To be Called Back',
  'In Negotiation',
  'Needs Follow-up'
]

// Local copy of settings for editing
const localSettings = ref({
  abandonedEligibleStages: [],
  urgencyEnabled: true,
  urgencyWeights: {
    intent: 40,
    behavioral: 35,
    temporal: 25
  },
  urgencyThresholds: {
    hot: 80,
    warm: 50,
    standard: 20
  },
  dormantOpportunityEnabled: true,
  dormantOpportunityAfterAppointmentDays: 7,
  dormantOpportunityAfterAppointmentHours: 0,
  dormantOpportunityAfterOfferDays: 7,
  dormantOpportunityAfterOfferHours: 0
})

// Load settings into local state
onMounted(() => {
  loadSettings()
})

function loadSettings() {
  localSettings.value = {
    ...settingsStore.settings,
    // Deep copy array to avoid reference issues
    abandonedEligibleStages: [...(settingsStore.settings.abandonedEligibleStages || [])],
    // Ensure urgency settings exist with defaults
    urgencyEnabled: settingsStore.settings.urgencyEnabled !== undefined ? settingsStore.settings.urgencyEnabled : true,
    urgencyWeights: {
      intent: settingsStore.settings.urgencyWeights?.intent || 40,
      behavioral: settingsStore.settings.urgencyWeights?.behavioral || 35,
      temporal: settingsStore.settings.urgencyWeights?.temporal || 25
    },
    urgencyThresholds: {
      hot: settingsStore.settings.urgencyThresholds?.hot || 80,
      warm: settingsStore.settings.urgencyThresholds?.warm || 50,
      standard: settingsStore.settings.urgencyThresholds?.standard || 20
    },
    // Ensure dormant opportunity settings exist with defaults
    dormantOpportunityEnabled: settingsStore.settings.dormantOpportunityEnabled !== undefined ? settingsStore.settings.dormantOpportunityEnabled : true,
    dormantOpportunityAfterAppointmentDays: settingsStore.settings.dormantOpportunityAfterAppointmentDays ?? 7,
    dormantOpportunityAfterAppointmentHours: settingsStore.settings.dormantOpportunityAfterAppointmentHours ?? 0,
    dormantOpportunityAfterOfferDays: settingsStore.settings.dormantOpportunityAfterOfferDays ?? 7,
    dormantOpportunityAfterOfferHours: settingsStore.settings.dormantOpportunityAfterOfferHours ?? 0
  }
}

function handleSave() {
  settingsStore.updateSettings(localSettings.value)
  alert('Settings saved successfully!')
}

function handleReset() {
  if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
    settingsStore.resetToDefaults()
    loadSettings()
    alert('Settings reset to defaults.')
  }
}

function handleCancel() {
  loadSettings()
}
</script>

