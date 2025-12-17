<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50">
    <!-- Left Sidebar - Opportunity Cards -->
    <EntityListSidebar
      title="Opportunities"
      :items="opportunitiesStore.opportunities"
      :selected-id="currentOpportunity?.id"
      selected-class="bg-white border-2 border-purple-500 shadow-md"
      unselected-class="bg-white border border-gray-200 hover:border-purple-300"
      :open-menu-id="openCardMenu"
      :getName="(opp) => opp.customer.name"
      :getInitials="(opp) => opp.customer.initials"
      :getVehicleInfo="(opp) => `${opp.vehicle.brand} ${opp.vehicle.model}`"
      :avatarClass="() => 'bg-purple-100 text-purple-600'"
      @select="selectOpportunity"
      @menu-click="toggleCardMenu"
      @menu-close="openCardMenu = null"
    >
      <template #badges="{ item: opp }">
        <span 
          class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
          :class="getStageBadgeClass(opp.stage)"
        >
          {{ opp.stage }}
        </span>
      </template>
      <template #meta="{ item: opp }">
        <span class="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          {{ opp.probability }}% prob
        </span>
      </template>
      <template #menu="{ item: opp }">
        <button 
          @click.stop="reassignOpportunity(opp.id)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-solid fa-share text-gray-400"></i> Reassign
        </button>
      </template>
      <template #footer="{ item: opp }">
        <div class="mt-2 text-xs font-semibold text-gray-900">
          €{{ formatCurrency(opp.value) }}
        </div>
      </template>
    </EntityListSidebar>
    
    <!-- Main Content - Opportunity Details -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div v-if="!currentOpportunity" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fa-solid fa-gem text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Select an opportunity to view details</p>
        </div>
      </div>
      
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 shrink-0 shadow-sm">
          <div class="px-4 md:px-8 py-4 md:py-6">
            <ContactInfo
              :initials="currentOpportunity.customer.initials"
              :name="currentOpportunity.customer.name"
              avatar-color-class="bg-purple-100 text-purple-600"
              :email="currentOpportunity.customer.email"
              :phone="currentOpportunity.customer.phone"
              :third-field-value="formatDate(currentOpportunity.expectedCloseDate)"
              email-label="Email"
              phone-label="Phone"
              third-field-label="Expected Close"
            >
              <template #tags>
                <span 
                  class="px-2 py-0.5 rounded-full border bg-purple-50 border-purple-100 text-purple-700 text-xs font-semibold"
                >
                  Opportunity
                </span>
                <span 
                  class="px-2 py-0.5 rounded-full border bg-blue-50 border-blue-100 text-blue-700 text-xs font-semibold"
                >
                  €{{ formatCurrency(currentOpportunity.value) }}
                </span>
              </template>
            </ContactInfo>
          </div>
        </header>
        
        <!-- Scrollable Content -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full scrollbar-hide">
          <!-- Tabs -->
          <Tabs 
            v-model="activeTab"
            :tabs="opportunityTabs"
            class="mb-6"
          />
          
          <!-- Stage & Owner Bar (only on overview tab) -->
          <div v-if="activeTab === 'overview'" class="mb-6">
            <div class="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Stage</span>
                <span class="text-xs font-bold text-gray-800">{{ currentOpportunity.stage }}</span>
              </div>
              <div class="w-px h-4 bg-gray-200"></div>
              <div class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Probability</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all"
                      :class="currentOpportunity.probability >= 70 ? 'bg-green-500' : currentOpportunity.probability >= 40 ? 'bg-orange-500' : 'bg-red-500'"
                      :style="{ width: currentOpportunity.probability + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs font-bold text-gray-800">{{ currentOpportunity.probability }}%</span>
                </div>
              </div>
              <div class="w-px h-4 bg-gray-200"></div>
              <div class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Owner</span>
                <span class="text-xs font-bold text-gray-800">{{ currentOpportunity.assignee }}</span>
              </div>
              <div v-if="currentOpportunity.source" class="w-px h-4 bg-gray-200"></div>
              <div v-if="currentOpportunity.source" class="flex items-center gap-2 px-3 py-1.5">
                <span class="text-[10px] text-gray-400 font-bold uppercase">Source</span>
                <span class="text-xs font-bold text-gray-800">{{ currentOpportunity.source }}</span>
              </div>
            </div>
          </div>
          
          <!-- Add New Button -->
          <AddNewButton
            :actions="availableActions"
            @action="handleAddNewAction"
          />
          
          <!-- Opportunity Management Widget -->
          <OpportunityManagementWidget
            v-if="activeTab === 'overview'"
            :opportunity="currentOpportunity"
            :scheduled-appointment="currentOpportunity?.scheduledAppointment || null"
          />
          
          <!-- Requested Car Widget -->
          <VehicleWidget
            v-if="activeTab === 'overview' && currentOpportunity && currentOpportunity.vehicle"
            :brand="currentOpportunity.vehicle.brand"
            :model="currentOpportunity.vehicle.model"
            :year="currentOpportunity.vehicle.year"
            :image="currentOpportunity.vehicle.image || ''"
            :price="currentOpportunity.vehicle.price || null"
            :request-message="currentOpportunity.vehicle.requestMessage || ''"
            :request-type="'Opportunity'"
            :source="currentOpportunity.source || ''"
            :dealership="currentOpportunity.vehicle.dealership || ''"
            :registration="currentOpportunity.vehicle.registration || ''"
            :kilometers="currentOpportunity.vehicle.kilometers !== undefined ? currentOpportunity.vehicle.kilometers : null"
            :fuel-type="currentOpportunity.vehicle.fuelType || ''"
            :gear-type="currentOpportunity.vehicle.gearType || ''"
            :vin="currentOpportunity.vehicle.vin || ''"
            :stock-days="currentOpportunity.vehicle.stockDays !== undefined ? currentOpportunity.vehicle.stockDays : null"
            :fiscal-entity="currentOpportunity.vehicle.fiscalEntity || ''"
            :source-details="currentOpportunity.vehicle.sourceDetails || ''"
          />
          
          <!-- Recommended Cars Slider (only if vehicle out of stock) -->
          <RecommendedCarsSlider
            v-if="activeTab === 'overview' && currentOpportunity?.vehicle?.stockDays === null"
            @add-to-opportunity="handleAddToOpportunity"
          />
          
          <!-- Offers Carousel (only for In Negotiation or Closed opportunities) -->
          <OffersCarousel
            v-if="activeTab === 'overview' && (currentOpportunity?.stage === 'In Negotiation' || currentOpportunity?.stage === 'Closed')"
          />
          
        </main>
      </div>
    </div>
    
    <!-- Right Sidebar - Activity Timeline -->
    <ActivitySummarySidebar
      title="Activity summary"
      :activities="opportunitiesStore.currentOpportunityActivities"
      :collapsed="false"
      :show-collapse="false"
      :show="!!currentOpportunity"
      class="hidden xl:flex"
    />
    
    <!-- Coming Soon Modal -->
    <ComingSoonModal
      :show="showComingSoonModal"
      :title="comingSoonModalTitle"
      @close="showComingSoonModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOpportunitiesStore } from '@/stores/opportunities'
import EntityListSidebar from '@/components/shared/EntityListSidebar.vue'
import ActivitySummarySidebar from '@/components/shared/ActivitySummarySidebar.vue'
import ContactInfo from '@/components/shared/ContactInfo.vue'
import Tabs from '@/components/shared/Tabs.vue'
import AddNewButton from '@/components/shared/AddNewButton.vue'
import VehicleWidget from '@/components/shared/VehicleWidget.vue'
import OpportunityManagementWidget from '@/components/opportunities/OpportunityManagementWidget.vue'
import RecommendedCarsSlider from '@/components/opportunities/RecommendedCarsSlider.vue'
import OffersCarousel from '@/components/opportunities/OffersCarousel.vue'
import ComingSoonModal from '@/components/shared/ComingSoonModal.vue'

const route = useRoute()
const router = useRouter()
const opportunitiesStore = useOpportunitiesStore()

const currentOpportunity = computed(() => opportunitiesStore.currentOpportunity)
const openCardMenu = ref(null)
const showComingSoonModal = ref(false)
const comingSoonModalTitle = ref('')

const activeTab = ref('overview')

const opportunityTabs = computed(() => {
  const allActivities = opportunitiesStore.currentOpportunityActivities
  const overviewCount = allActivities.length
  const communicationCount = allActivities.filter(item => ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)).length
  const noteCount = allActivities.filter(item => item.type === 'note').length
  const attachmentCount = allActivities.filter(item => item.type === 'attachment').length

  return [
    { key: 'overview', label: 'Overview', count: overviewCount },
    { key: 'note', label: 'Notes', count: noteCount },
    { key: 'communication', label: 'Communication', count: communicationCount },
    { key: 'attachment', label: 'Attachments', count: attachmentCount }
  ]
})

const availableActions = computed(() => {
  switch (activeTab.value) {
    case 'overview':
      return ['offer', 'purchase', 'note', 'financing', 'tradein', 'attachment', 'email', 'whatsapp', 'sms']
    case 'communication':
      return ['email', 'whatsapp', 'sms']
    case 'note':
      return ['note']
    case 'attachment':
      return ['attachment']
    default:
      return []
  }
})

onMounted(() => {
  const oppId = route.params.id
  opportunitiesStore.loadOpportunityById(oppId)
  opportunitiesStore.loadOpportunities()
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    opportunitiesStore.loadOpportunityById(newId)
  }
})

const selectOpportunity = (oppId) => {
  router.push(`/opportunities/${oppId}`)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const toggleCardMenu = (oppId) => {
  openCardMenu.value = openCardMenu.value === oppId ? null : oppId
}

const reassignOpportunity = async (oppId) => {
  openCardMenu.value = null
  console.log('Reassign opportunity', oppId)
}

const handleAddNewAction = (action) => {
  if (['addVehicle', 'configureVehicle', 'offer', 'purchase', 'scheduleAppointment'].includes(action)) {
    comingSoonModalTitle.value = action.replace(/([A-Z])/g, ' $1').trim()
    showComingSoonModal.value = true
  } else {
    console.log('Add new action:', action)
    // Handle other actions like note, financing, tradein, attachment, email, whatsapp, sms
  }
}

const handleAddToOpportunity = (car) => {
  comingSoonModalTitle.value = `Add ${car.brand} ${car.model} to Opportunity`
  showComingSoonModal.value = true
}

const getStageBadgeClass = (stage) => {
  const classes = {
    'Open': 'bg-blue-100 text-blue-700 border-blue-200',
    'Open Opportunities': 'bg-blue-100 text-blue-700 border-blue-200',
    'Open opportunity': 'bg-blue-100 text-blue-700 border-blue-200',
    'In Negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Opportunity in negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
    'Closed opportunity': 'bg-gray-100 text-gray-700 border-gray-200',
    'Won': 'bg-green-100 text-green-700 border-green-200',
    'Lost': 'bg-red-100 text-red-700 border-red-200'
  }
  return classes[stage] || 'bg-gray-100 text-gray-700 border-gray-200'
}
</script>

