<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="page-header-title">Reports</h1>
        </div>
        <div class="flex items-center gap-3">
          <select class="input text-sm w-auto">
            <option>This month</option>
            <option>Last month</option>
            <option>This quarter</option>
            <option>This year</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-4 md:p-8">
      <div>
        <!-- Dashboard KPIs -->
        <DashboardKPIs :kpis="dashboardKPIs" />
        
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Left Column - Sales Pipeline -->
          <div class="lg:col-span-2">
            <SalesPipelineChart :pipeline="salesPipeline" />
          </div>
          
          <!-- Right Column - Sidebar -->
          <div class="space-y-6">
            <TodaysEventsSidebar :events="todaysEvents" />
            <AIInsightsSidebar />
          </div>
        </div>
        
        <!-- Team Performance -->
        <div class="mb-6">
          <TeamPerformanceTable :team-members="teamPerformance" />
        </div>
        
        <!-- Page Views Section -->
        <div class="space-y-6">
          <PageViewsByVehicle :vehicles="pageViewsByVehicle" />
          <PageViewsChart :data="pageViewsOrganicPaid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchDashboardKPIs, fetchSalesPipeline, fetchTeamPerformance, fetchTodaysEvents, fetchPageViewsByVehicle, fetchPageViewsOrganicPaid } from '@/api/dashboard'
import DashboardKPIs from '@/components/reports/DashboardKPIs.vue'
import SalesPipelineChart from '@/components/reports/SalesPipelineChart.vue'
import TeamPerformanceTable from '@/components/reports/TeamPerformanceTable.vue'
import TodaysEventsSidebar from '@/components/reports/TodaysEventsSidebar.vue'
import AIInsightsSidebar from '@/components/reports/AIInsightsSidebar.vue'
import PageViewsByVehicle from '@/components/reports/PageViewsByVehicle.vue'
import PageViewsChart from '@/components/reports/PageViewsChart.vue'

const dashboardKPIs = ref([])
const salesPipeline = ref({ stages: [], leadSources: [] })
const teamPerformance = ref([])
const todaysEvents = ref([])
const pageViewsByVehicle = ref([])
const pageViewsOrganicPaid = ref([])

onMounted(async () => {
  dashboardKPIs.value = await fetchDashboardKPIs()
  salesPipeline.value = await fetchSalesPipeline()
  teamPerformance.value = await fetchTeamPerformance()
  todaysEvents.value = await fetchTodaysEvents()
  pageViewsByVehicle.value = await fetchPageViewsByVehicle()
  pageViewsOrganicPaid.value = await fetchPageViewsOrganicPaid()
})
</script>
