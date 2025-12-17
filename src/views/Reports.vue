<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-header-title">Reports & Analytics</h1>
      <p class="page-header-subtitle">View performance metrics and generate reports</p>
    </div>
    
    <!-- Content -->
    <div class="p-4 md:p-8">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card-hover p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fa-solid fa-chart-line text-blue-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Sales Report</h3>
            <p class="text-gray-600 text-sm mb-4">View sales performance and trends</p>
            <button class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
              View Report <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
          
          <div class="card-hover p-6">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fa-solid fa-funnel-dollar text-green-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Conversion Funnel</h3>
            <p class="text-gray-600 text-sm mb-4">Analyze conversion rates by stage</p>
            <button class="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
              View Report <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
          
          <div class="card-hover p-6">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fa-solid fa-users text-purple-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Team Performance</h3>
            <p class="text-gray-600 text-sm mb-4">Compare team member performance</p>
            <button class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
              View Report <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
        
        <div class="empty-state mt-8">
          <i class="fa-solid fa-chart-pie empty-state-icon"></i>
          <p class="empty-state-text">Detailed reports coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>

