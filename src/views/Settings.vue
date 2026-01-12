<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Settings" subtitle="Configure business rules and thresholds">
    </PageHeader>
    
    <!-- Content -->
    <div class="p-4 md:p-6 lg:p-8">
      <form @submit.prevent="handleSave" class="max-w-4xl space-y-8">
        <!-- Opportunity Task Widget Thresholds -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Opportunity Task Widget Thresholds</h2>
          <p class="text-sm text-gray-600 mb-6">Configure the number of days before task widgets are triggered for opportunities.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- OOFB -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">OOFB (Overdue Offer Follow-up)</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Min Days</label>
                  <input
                    type="number"
                    v-model.number="localSettings.oofbMinDays"
                    min="1"
                    class="input w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Max Days</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">UFB (Urgent Follow-up)</label>
              <label class="block text-xs text-gray-500 mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.ufbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- OFB -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">OFB (Offer Follow-up)</label>
              <label class="block text-xs text-gray-500 mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.ofbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- NFU -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">NFU (No Future Updates)</label>
              <label class="block text-xs text-gray-500 mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.nfuDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- CFB -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">CFB (Contract Follow-up)</label>
              <label class="block text-xs text-gray-500 mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.cfbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- DFB -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">DFB (Delivery Follow-up)</label>
              <label class="block text-xs text-gray-500 mb-1">Days Threshold</label>
              <input
                type="number"
                v-model.number="localSettings.dfbDays"
                min="1"
                class="input w-full"
              />
            </div>

            <!-- Offer Sent → Awaiting Response -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Offer Sent → Awaiting Response</label>
              <label class="block text-xs text-gray-500 mb-1">Auto-transition Days</label>
              <input
                type="number"
                v-model.number="localSettings.offerSentToAwaitingResponseDays"
                min="1"
                class="input w-full"
              />
            </div>
          </div>
        </div>

        <!-- Opportunity Abandonment -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Opportunity Abandonment</h2>
          <p class="text-sm text-gray-600 mb-6">Configure when opportunities are marked as abandoned.</p>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Abandoned Threshold (Days)</label>
              <p class="text-xs text-gray-500 mb-2">Number of days with no activity before marking as abandoned</p>
              <input
                type="number"
                v-model.number="localSettings.abandonedOpportunityDays"
                min="1"
                class="input w-full max-w-xs"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Eligible Stages</label>
              <p class="text-xs text-gray-500 mb-3">Select which stages can be marked as abandoned</p>
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
                  <span class="text-sm text-gray-700">{{ stage }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Lead Management -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Lead Management</h2>
          <p class="text-sm text-gray-600 mb-6">Configure lead qualification and conversion settings.</p>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Contact Attempts</label>
              <p class="text-xs text-gray-500 mb-2">Maximum number of contact attempts before auto-disqualification</p>
              <input
                type="number"
                v-model.number="localSettings.maxContactAttempts"
                min="1"
                max="20"
                class="input w-full max-w-xs"
              />
            </div>

            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                id="excludeNotValid"
                v-model="localSettings.excludeNotValidFromConversion"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="excludeNotValid" class="text-sm font-medium text-gray-700 cursor-pointer">
                Exclude "NOT VALID" leads from conversion rate calculations
              </label>
            </div>
          </div>
        </div>

        <!-- Task Widgets -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Task Widgets</h2>
          <p class="text-sm text-gray-600 mb-6">Configure task widget behavior.</p>
          
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoCloseWidgets"
              v-model="localSettings.autoCloseWidgetsOnClose"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="autoCloseWidgets" class="text-sm font-medium text-gray-700 cursor-pointer">
              Auto-close NFU/OFB widgets when opportunity is closed (Won/Lost)
            </label>
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
import { Button } from '@motork/component-library'
import PageHeader from '@/components/layout/PageHeader.vue'

const settingsStore = useSettingsStore()

// Available stages for abandonment eligibility
const availableStages = [
  'Qualified',
  'Awaiting Appointment',
  'To be Called Back',
  'In Negotiation',
  'Offer Sent',
  'Awaiting Response'
]

// Local copy of settings for editing
const localSettings = ref({
  abandonedEligibleStages: []
})

// Load settings into local state
onMounted(() => {
  loadSettings()
})

function loadSettings() {
  localSettings.value = {
    ...settingsStore.settings,
    // Deep copy array to avoid reference issues
    abandonedEligibleStages: [...settingsStore.settings.abandonedEligibleStages]
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

