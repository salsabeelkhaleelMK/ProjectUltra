<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div class="p-4 md:p-5 border-b border-gray-200 bg-gray-50/50">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-chart-line text-gray-400 text-sm"></i>
          <h2 class="heading-sub">Performance</h2>
        </div>
        <select
          v-model="selectedPeriod"
          @change="loadMetrics"
          class="input text-xs w-full sm:w-auto"
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>
    </div>

    <div class="p-4 md:p-5">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 4" :key="`skeleton-${n}`" class="h-16 bg-gray-100 rounded animate-pulse"></div>
      </div>

      <!-- BDC Operator View -->
      <div v-else-if="userRole === 'operator'" class="space-y-4">
        <!-- SLA Compliance -->
        <div class="bg-white rounded-lg p-3 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-gray-700">SLA Compliance</span>
            <span class="text-xs font-bold" :class="slaCompliancePercentage >= 90 ? 'text-green-600' : 'text-yellow-600'">
              {{ slaCompliancePercentage }}%
            </span>
          </div>
          <div class="text-xs sm:text-sm text-gray-600">
            {{ bdcMetrics?.slaCompliance?.withinSLA || 0 }} / {{ bdcMetrics?.slaCompliance?.total || 0 }} tasks completed within SLA
          </div>
        </div>

        <!-- Tasks Per Day -->
        <div class="bg-white rounded-lg p-3 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-gray-700">Tasks Per Day</span>
            <span class="text-xs font-bold" :class="getTasksPerDayStatusClass()">
              {{ bdcMetrics?.tasksPerDay?.current || 0 }} / {{ bdcMetrics?.tasksPerDay?.target || 0 }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              class="h-2 rounded-full transition-all"
              :class="getTasksPerDayStatusClass(true)"
              :style="{ width: `${Math.min((bdcMetrics?.tasksPerDay?.current || 0) / 50 * 100, 100)}%` }"
            ></div>
          </div>
          <div class="text-xs text-gray-500 mt-1">Target: 20-50 tasks/day</div>
        </div>

        <!-- Appointments Reserved -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Appointments Reserved</div>
                <div class="text-base font-bold text-gray-900 mb-1">{{ bdcMetrics?.appointmentsReserved || 0 }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="bdcMetrics?.appointmentsReservedTrend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-appointments" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#0056B3;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#0056B3;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(bdcMetrics.appointmentsReservedTrend)"
                    fill="url(#gradient-appointments)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(bdcMetrics.appointmentsReservedTrend)"
                    stroke="#0056B3"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Lead-to-Opportunity Rate</div>
                <div class="text-base font-bold text-gray-900 mb-1">{{ bdcMetrics?.leadToOpportunityConversion || 0 }}%</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="bdcMetrics?.leadToOpportunityConversionTrend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-lead-opp" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(bdcMetrics.leadToOpportunityConversionTrend)"
                    fill="url(#gradient-lead-opp)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(bdcMetrics.leadToOpportunityConversionTrend)"
                    stroke="#10b981"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Salesperson View -->
      <div v-else-if="userRole === 'salesman'" class="space-y-4">
        <!-- Contracts & Revenue -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Contracts Closed</div>
                <div class="text-base font-bold text-gray-900 mb-1">{{ salespersonMetrics?.contractsClosed?.[selectedPeriod] || 0 }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="getTrendData('contractsClosed')">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-contracts" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(getTrendData('contractsClosed'))"
                    fill="url(#gradient-contracts)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(getTrendData('contractsClosed'))"
                    stroke="#10b981"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Revenue</div>
                <div class="text-base font-bold text-gray-900 mb-1">€{{ formatCurrency(salespersonMetrics?.revenue?.[selectedPeriod] || 0) }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="getTrendData('revenue')">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-revenue" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#0056B3;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#0056B3;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(getTrendData('revenue'))"
                    fill="url(#gradient-revenue)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(getTrendData('revenue'))"
                    stroke="#0056B3"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Targets -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-700">Monthly Target</span>
            <span class="font-bold">{{ getRevenueProgress('month') }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full bg-brand-blue transition-all"
              :style="{ width: `${Math.min(getRevenueProgress('month'), 100)}%` }"
            ></div>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-700">Quarterly Target</span>
            <span class="font-bold">{{ getRevenueProgress('quarter') }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full bg-brand-blue transition-all"
              :style="{ width: `${Math.min(getRevenueProgress('quarter'), 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Pipeline & Win Rate -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Pipeline Value</div>
                <div class="text-base font-bold text-gray-900 mb-1">€{{ formatCurrency(salespersonMetrics?.pipelineValue || 0) }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="salespersonMetrics?.pipelineValueTrend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-pipeline" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#0056B3;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#0056B3;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(salespersonMetrics.pipelineValueTrend)"
                    fill="url(#gradient-pipeline)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(salespersonMetrics.pipelineValueTrend)"
                    stroke="#0056B3"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Win Rate</div>
                <div class="text-base font-bold text-gray-900 mb-1">{{ salespersonMetrics?.winRate || 0 }}%</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="salespersonMetrics?.winRateTrend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-winrate" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(salespersonMetrics.winRateTrend)"
                    fill="url(#gradient-winrate)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(salespersonMetrics.winRateTrend)"
                    stroke="#10b981"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- New & Dormant Opportunities -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">New Opportunities</div>
                <div class="text-base font-bold text-gray-900 mb-1">{{ salespersonMetrics?.newOpportunities?.[selectedPeriod] || 0 }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="getTrendData('newOpportunities')">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-new-opp" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(getTrendData('newOpportunities'))"
                    fill="url(#gradient-new-opp)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(getTrendData('newOpportunities'))"
                    stroke="#10b981"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Dormant Opportunities</div>
                <div class="text-base font-bold text-red-600 mb-1">{{ salespersonMetrics?.dormantOpportunities || 0 }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="salespersonMetrics?.dormantOpportunitiesTrend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-dormant" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#F80032;stop-opacity:0.2" />
                      <stop offset="100%" style="stop-color:#F80032;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(salespersonMetrics.dormantOpportunitiesTrend)"
                    fill="url(#gradient-dormant)"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(salespersonMetrics.dormantOpportunitiesTrend)"
                    stroke="#F80032"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manager View -->
      <div v-else-if="userRole === 'manager'" class="space-y-4">
        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="(stage, index) in (managerMetrics?.stages || []).slice(0, 4)"
            :key="stage.name"
            class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="getStageColorClass(stage.color)"
              ></div>
              <span class="text-xs text-gray-500">{{ stage.percentage }}%</span>
            </div>
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-base font-bold text-gray-900 mb-1">
                  {{ formatNumber(stage.count) }}
                </div>
                <div class="text-xs text-gray-600 leading-tight">{{ stage.name }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="stage.trend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient :id="`gradient-stage-${index}`" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" :style="`stop-color:${getStageChartColor(stage.color)};stop-opacity:0.2`" />
                      <stop offset="100%" :style="`stop-color:${getStageChartColor(stage.color)};stop-opacity:0`" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(stage.trend)"
                    :fill="`url(#gradient-stage-${index})`"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(stage.trend)"
                    :stroke="getStageChartColor(stage.color)"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Funnel Visualization & Conversion Rate -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Bar Chart -->
          <div class="lg:col-span-2 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Sales Funnel</h3>
            <div class="space-y-3">
              <div
                v-for="(stage, index) in managerMetrics?.stages || []"
                :key="stage.name"
                class="relative"
              >
                <div class="flex items-center gap-3 mb-1">
                  <span class="text-xs font-medium text-gray-700 w-32 sm:w-40 flex-shrink-0">{{ stage.name }}</span>
                  <div class="flex-1 relative">
                    <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                        :class="getStageColorClass(stage.color)"
                        :style="{ width: `${stage.percentage}%`, minWidth: '2px' }"
                      >
                        <span class="text-xs font-bold text-gray-900">{{ formatNumber(stage.count) }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-gray-900 w-12 text-right flex-shrink-0">{{ stage.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversion Rate Card -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 flex flex-col items-center justify-center">
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#d1fae5"
                  stroke-width="8"
                />
                <!-- Progress circle -->
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="8"
                  :stroke-dasharray="`${(managerMetrics?.conversionRate || 0) * 2.64} 265`"
                  stroke-linecap="round"
                  class="transition-all duration-700"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-base font-bold text-green-700">
                    {{ managerMetrics?.conversionRate || 0 }}%
                  </div>
                </div>
              </div>
            </div>
            <div class="text-sm font-bold text-green-800 mb-1">Conversion Rate</div>
            <div class="text-xs text-green-600 text-center">
              {{ getConversionDescription(managerMetrics?.conversionRate || 0) }}
            </div>
          </div>
        </div>

        <!-- Additional Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="(stage, idx) in (managerMetrics?.stages || []).slice(4)"
            :key="stage.name"
            class="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="getStageColorClass(stage.color)"
              ></div>
              <span class="text-xs text-gray-500">{{ stage.percentage }}%</span>
            </div>
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="text-base font-bold text-gray-900 mb-1">
                  {{ formatNumber(stage.count) }}
                </div>
                <div class="text-xs text-gray-600 leading-tight">{{ stage.name }}</div>
              </div>
              <div class="h-12 w-16 flex-shrink-0" v-if="stage.trend">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient :id="`gradient-stage-${idx + 4}`" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" :style="`stop-color:${getStageChartColor(stage.color)};stop-opacity:0.2`" />
                      <stop offset="100%" :style="`stop-color:${getStageChartColor(stage.color)};stop-opacity:0`" />
                    </linearGradient>
                  </defs>
                  <path
                    :d="generateAreaPath(stage.trend)"
                    :fill="`url(#gradient-stage-${idx + 4})`"
                    class="transition-all duration-700"
                  />
                  <path
                    :d="generateSmoothPath(stage.trend)"
                    :stroke="getStageChartColor(stage.color)"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback for other roles -->
      <div v-else class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-chart-line text-4xl mb-2 text-gray-300"></i>
        <p class="text-sm">Performance metrics not available</p>
        <p class="text-xs text-gray-400 mt-1">Contact your administrator</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { fetchBDCOperatorMetrics, fetchSalespersonMetrics, fetchManagerFunnelMetrics } from '@/api/dashboard'

const userStore = useUserStore()
const userRole = computed(() => userStore.userRole())
const userId = computed(() => userStore.currentUser?.id)

const selectedPeriod = ref('month')
const loading = ref(true)

const bdcMetrics = ref(null)
const salespersonMetrics = ref(null)
const managerMetrics = ref(null)

const slaCompliancePercentage = computed(() => {
  if (!bdcMetrics.value?.slaCompliance) return 0
  const { completed, total } = bdcMetrics.value.slaCompliance
  return total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 0
})

const getTasksPerDayStatusClass = (isBg = false) => {
  const current = bdcMetrics.value?.tasksPerDay?.current || 0
  if (current >= 40) return isBg ? 'bg-green-600' : 'text-green-600'
  if (current >= 20) return isBg ? 'bg-yellow-600' : 'text-yellow-600'
  return isBg ? 'bg-red-600' : 'text-red-600'
}

const getRevenueProgress = (period) => {
  if (!salespersonMetrics.value) return 0
  const revenue = salespersonMetrics.value.revenue?.[period] || 0
  const target = salespersonMetrics.value.revenueTargets?.[period] || 1
  return Math.round((revenue / target) * 100)
}

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'k'
  }
  return amount.toString()
}

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getStageColorClass = (color) => {
  const colorMap = {
    'red': 'bg-red-300',
    'orange': 'bg-orange-300',
    'blue': 'bg-blue-300',
    'gray': 'bg-gray-300'
  }
  return colorMap[color] || 'bg-gray-300'
}

const getStageChartColor = (color) => {
  const colorMap = {
    'red': '#F80032', // brand-red
    'orange': '#f97316',
    'blue': '#0056B3', // brand-blue
    'gray': '#6B7280' // brand-slate
  }
  return colorMap[color] || '#6B7280'
}

const getTrendData = (metric) => {
  if (!salespersonMetrics.value) return null
  if (metric === 'contractsClosed') {
    return salespersonMetrics.value.contractsClosed?.[`${selectedPeriod.value}Trend`] || null
  }
  if (metric === 'revenue') {
    return salespersonMetrics.value.revenue?.[`${selectedPeriod.value}Trend`] || null
  }
  if (metric === 'newOpportunities') {
    return salespersonMetrics.value.newOpportunities?.[`${selectedPeriod.value}Trend`] || null
  }
  return null
}

const generateSmoothPath = (data) => {
  if (!data || data.length === 0) return ''
  
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  const width = 100
  const height = 40
  const padding = 4
  
  const points = data.map((value, index) => {
    return {
      x: (index / (data.length - 1)) * (width - padding * 2) + padding,
      y: height - padding - ((value - minValue) / range) * (height - padding * 2)
    }
  })
  
  if (points.length < 2) return ''
  
  let path = `M ${points[0].x},${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const cp1x = curr.x + (next.x - curr.x) / 2
    const cp2x = curr.x + (next.x - curr.x) / 2
    path += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`
  }
  
  return path
}

const generateAreaPath = (data) => {
  const smoothLine = generateSmoothPath(data)
  if (!smoothLine) return ''
  
  const width = 100
  const height = 40
  const padding = 4
  
  const firstPointX = padding
  const lastPointX = width - padding
  
  return `${smoothLine} L ${lastPointX},${height} L ${firstPointX},${height} Z`
}

const getEndPoint = (data) => {
  if (!data || data.length === 0) return { x: 0, y: 0 }
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  const padding = 4
  return {
    x: 100 - padding,
    y: 40 - padding - ((data[data.length - 1] - minValue) / range) * (40 - padding * 2)
  }
}

const getConversionDescription = (rate) => {
  if (rate >= 20) return 'Excellent performance'
  if (rate >= 15) return 'Good performance'
  if (rate >= 10) return 'Average performance'
  return 'Needs improvement'
}

const loadMetrics = async () => {
  loading.value = true
  try {
    if (userRole.value === 'operator') {
      bdcMetrics.value = await fetchBDCOperatorMetrics(userId.value, selectedPeriod.value)
    } else if (userRole.value === 'salesman') {
      salespersonMetrics.value = await fetchSalespersonMetrics(userId.value, selectedPeriod.value)
    } else if (userRole.value === 'manager') {
      managerMetrics.value = await fetchManagerFunnelMetrics(selectedPeriod.value)
    }
  } catch (error) {
    console.error('Error loading performance metrics:', error)
  } finally {
    loading.value = false
  }
}

// Watch for user/role changes and reload metrics
watch([userId, userRole], () => {
  loadMetrics()
}, { immediate: false })

onMounted(() => {
  loadMetrics()
})
</script>

