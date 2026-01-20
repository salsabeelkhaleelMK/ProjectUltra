<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-white">
    <!-- Header -->
    <div
      class="border-b border-black/5 shrink-0"
      style="background-color: var(--base-muted, #f5f5f5)"
    >
      <div class="flex items-center justify-between px-6 pt-5 pb-4">
        <h1 class="text-fluid-xl font-medium text-greys-900">Reports</h1>
        <select class="px-3 py-1.5 rounded-2xl border border-E5E7EB bg-surface text-fluid-sm font-medium text-body hover:border-red-100 hover:bg-red-50 hover:text-brand-red transition-all cursor-pointer">
          <option>This month</option>
          <option>Last month</option>
          <option>This quarter</option>
          <option>This year</option>
        </select>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto px-6 py-6 2xl:px-48 min-h-0">
      <div class="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 max-w-[1440px] mx-auto w-full">
        <!-- Left Section: Main Dashboard -->
        <div class="flex-1 flex flex-col gap-6 min-w-0">
          <!-- Dashboard KPIs -->
          <DashboardKPIs :kpis="dashboardKPIs" :loading="loadingKPIs" />
          
          <!-- Sales Pipeline -->
          <SalesPipelineChart :pipeline="salesPipeline" :loading="loadingSalesPipeline" />
          
          <!-- Team Performance -->
          <TeamPerformanceTable :team-members="teamPerformance" :loading="loadingTeamPerformance" />
        </div>
        
        <!-- Right Sidebar -->
        <div class="w-full lg:w-80 xl:w-88 flex flex-col gap-6 shrink-0">
          <AIInsightsSidebar />
          <TodaysEventsSidebar :events="todaysEvents" :loading="loadingTodaysEvents" />
          <TasksDueSidebar :tasks="tasksDue" :loading="loadingTasksDue" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchDashboardKPIs, fetchSalesPipeline, fetchTeamPerformance, fetchTodaysEvents, fetchTasksDue } from '@/api/dashboard'
import DashboardKPIs from '@/components/reports/DashboardKPIs.vue'
import SalesPipelineChart from '@/components/reports/SalesPipelineChart.vue'
import TeamPerformanceTable from '@/components/reports/TeamPerformanceTable.vue'
import TodaysEventsSidebar from '@/components/reports/TodaysEventsSidebar.vue'
import AIInsightsSidebar from '@/components/reports/AIInsightsSidebar.vue'
import TasksDueSidebar from '@/components/reports/TasksDueSidebar.vue'

const dashboardKPIs = ref([])
const salesPipeline = ref({ stages: [], leadSources: [] })
const teamPerformance = ref([])
const todaysEvents = ref([])
const tasksDue = ref([])

const loadingKPIs = ref(true)
const loadingSalesPipeline = ref(true)
const loadingTeamPerformance = ref(true)
const loadingTodaysEvents = ref(true)
const loadingTasksDue = ref(true)

onMounted(async () => {
  // Load all data in parallel with individual loading states
  Promise.all([
    fetchDashboardKPIs().then(data => { dashboardKPIs.value = data; loadingKPIs.value = false }),
    fetchSalesPipeline().then(data => { salesPipeline.value = data; loadingSalesPipeline.value = false }),
    fetchTeamPerformance().then(data => { teamPerformance.value = data; loadingTeamPerformance.value = false }),
    fetchTodaysEvents().then(data => { todaysEvents.value = data; loadingTodaysEvents.value = false }),
    fetchTasksDue().then(data => { tasksDue.value = data; loadingTasksDue.value = false })
  ])
})
</script>
