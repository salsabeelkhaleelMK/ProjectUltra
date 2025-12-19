<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Reports" subtitle="Performance tracking and insights">
      <template #actions>
        <select class="input text-sm w-auto">
          <option>This month</option>
          <option>Last month</option>
          <option>This quarter</option>
          <option>This year</option>
        </select>
      </template>
    </PageHeader>
    
    <!-- Content -->
    <div class="p-4 md:p-6 lg:p-8">
      <!-- Main Content Grid - 2/3 vs 1/3 starting from top -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        
        <!-- Left Column - Main Content (2/3 width) -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <!-- Dashboard KPIs -->
          <DashboardKPIs :kpis="dashboardKPIs" />
          
          <!-- Sales Pipeline -->
          <SalesPipelineChart :pipeline="salesPipeline" />
          
          <!-- Team Performance -->
          <TeamPerformanceTable :team-members="teamPerformance" />
          
          <!-- Page Views Section -->
          <div class="space-y-4 md:space-y-6">
            <PageViewsByVehicle :vehicles="pageViewsByVehicle" />
            <PageViewsChart :data="pageViewsOrganicPaid" />
          </div>
        </div>
        
        <!-- Right Column - Sidebar (1/3 width) -->
        <div class="space-y-4 md:space-y-6">
          <AIInsightsSidebar />
          <TodaysEventsSidebar :events="todaysEvents" />
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
import PageHeader from '@/components/layout/PageHeader.vue'

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
