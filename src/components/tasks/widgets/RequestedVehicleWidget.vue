<template>
  <div v-if="show" class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <i class="fa-solid fa-thumbtack text-gray-400 text-xs"></i>
      <h3 class="font-bold text-gray-800 text-sm">{{ label }}</h3>
    </div>
    
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
      <!-- Always visible content -->
      <div class="p-4">
        <!-- Request message at the top -->
        <div v-if="requestMessage" class="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <div class="text-xs font-medium text-gray-500 mb-1">Request message</div>
          <p class="text-sm text-slate-700 leading-snug">{{ requestMessage }}</p>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-12 bg-gray-200 rounded-md overflow-hidden shrink-0 border border-gray-100">
              <img v-if="image" :src="image" alt="Car" class="w-full h-full object-cover">
              <i v-else class="fa-solid fa-car text-3xl text-gray-400 w-full h-full flex items-center justify-center"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <div class="font-bold text-slate-800 text-sm md:text-base">{{ brand }} {{ model }} ({{ year }})</div>
              </div>
              <div class="mt-1.5">
                <div 
                  v-if="stockDays !== undefined && stockDays !== null"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[10px] font-semibold rounded-md"
                >
                  <div class="w-1 h-1 bg-green-500 rounded-full"></div> In stock ({{ stockDays }} days)
                </div>
                <div 
                  v-else
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-semibold rounded-md"
                >
                  <div class="w-1 h-1 bg-orange-500 rounded-full"></div> Out of stock
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button 
              v-if="showOpenAd && price" 
              class="hidden sm:flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors group/btn"
            >
              Open Ad <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-gray-400 group-hover/btn:text-gray-800"></i>
            </button>
            <div v-if="price" class="text-right">
              <div class="text-xs text-gray-500 font-medium mb-0.5">Price</div>
              <div class="font-bold text-slate-800">€ {{ formatCurrency(price) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Separator and toggle button -->
      <div class="border-t border-gray-200">
        <button
          @click="isExpanded = !isExpanded"
          class="w-full p-3 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <span class="font-medium">{{ isExpanded ? 'Hide' : 'View' }} Details</span>
          <i 
            class="fa-solid fa-chevron-down text-xs transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
          ></i>
        </button>
      </div>
      
      <!-- Expandable details -->
      <div v-if="isExpanded" class="border-t border-gray-100 p-6 bg-gray-50/30 text-sm animate-fade-in">
      <!-- REQUEST DETAILS -->
      <div class="mb-6">
        <h4 class="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">REQUEST DETAILS</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
          <div v-if="requestType">
            <div class="text-xs text-gray-500 mb-1">Request type</div>
            <div class="font-medium text-slate-700">{{ requestType }}</div>
          </div>
          <div v-if="source">
            <div class="text-xs text-gray-500 mb-1">Source</div>
            <div class="font-medium text-slate-700">{{ source }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">Source details</div>
            <div class="font-medium" :class="sourceDetails ? 'text-slate-700' : 'text-gray-400'">{{ sourceDetails || '--' }}</div>
          </div>
          <div v-if="dealership">
            <div class="text-xs text-gray-500 mb-1">Dealership</div>
            <div class="font-medium text-slate-700">{{ dealership }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">Channel</div>
            <div class="font-medium text-slate-700">{{ channel || 'Email' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">AdCampaign</div>
            <div class="font-medium" :class="adCampaign ? 'text-slate-700' : 'text-gray-400'">{{ adCampaign || '--' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">AdMedium</div>
            <div class="font-medium" :class="adMedium ? 'text-slate-700' : 'text-gray-400'">{{ adMedium || '--' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">AdSource</div>
            <div class="font-medium" :class="adSource ? 'text-slate-700' : 'text-gray-400'">{{ adSource || '--' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">Expected purchase date</div>
            <div class="font-medium" :class="expectedPurchaseDate ? 'text-slate-700' : 'text-gray-400'">{{ expectedPurchaseDate || '--' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">Fiscal entity</div>
            <div class="font-medium" :class="fiscalEntity ? 'text-slate-700' : 'text-gray-400'">{{ fiscalEntity || '--' }}</div>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 my-4"></div>
      
      <!-- VEHICLE DETAILS -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-xs font-bold uppercase text-gray-500 tracking-wider">VEHICLE DETAILS</h4>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
          <div v-if="registration">
            <div class="text-xs text-gray-500 mb-1">Registration</div>
            <div class="font-medium text-slate-700">{{ registration }}</div>
          </div>
          <div v-if="kilometers !== undefined && kilometers !== null">
            <div class="text-xs text-gray-500 mb-1">Kilometers</div>
            <div class="font-medium text-slate-700">{{ formatNumber(kilometers) }} Km</div>
          </div>
          <div v-if="fuelType">
            <div class="text-xs text-gray-500 mb-1">Fuel type</div>
            <div class="font-medium text-slate-700">{{ fuelType }}</div>
          </div>
          <div v-if="gearType">
            <div class="text-xs text-gray-500 mb-1">Gear type</div>
            <div class="font-medium text-slate-700">{{ gearType }}</div>
          </div>
          <div v-if="vin">
            <div class="text-xs text-gray-500 mb-1">VIN Number</div>
            <div class="font-mono text-xs bg-white border border-gray-200 px-2 py-1 rounded inline-block text-gray-600">
              {{ vin }}
            </div>
          </div>
          <div v-if="dealership">
            <div class="text-xs text-gray-500 mb-1">Dealership</div>
            <div class="font-medium text-slate-700">{{ dealership }}</div>
          </div>
        </div>
        <div v-if="showTechnicalSpecs" class="mt-6 flex justify-end">
          <button class="bg-white border border-gray-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 group">
            <i class="fa-solid fa-list-check text-gray-400 group-hover:text-blue-500"></i> View technical specs
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isExpanded = ref(false)

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: 'Requested Car'
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: [Number, String],
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: null
  },
  requestMessage: {
    type: String,
    default: ''
  },
  requestType: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  },
  dealership: {
    type: String,
    default: ''
  },
  registration: {
    type: String,
    default: ''
  },
  kilometers: {
    type: Number,
    default: null
  },
  fuelType: {
    type: String,
    default: ''
  },
  gearType: {
    type: String,
    default: ''
  },
  vin: {
    type: String,
    default: ''
  },
  stockDays: {
    type: Number,
    default: null
  },
  showOpenAd: {
    type: Boolean,
    default: true
  },
  showTechnicalSpecs: {
    type: Boolean,
    default: true
  },
  channel: {
    type: String,
    default: 'Email'
  },
  adCampaign: {
    type: String,
    default: ''
  },
  expectedPurchaseDate: {
    type: String,
    default: ''
  },
  fiscalEntity: {
    type: String,
    default: ''
  },
  sourceDetails: {
    type: String,
    default: ''
  },
  adMedium: {
    type: String,
    default: ''
  },
  adSource: {
    type: String,
    default: ''
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>

