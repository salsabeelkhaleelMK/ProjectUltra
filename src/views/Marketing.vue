<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-header-title">Marketing Tools</h1>
      <p class="page-header-subtitle">Manage campaigns and marketing activities</p>
    </div>
    
    <!-- Content -->
    <div class="p-4 md:p-8">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card-hover p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fa-solid fa-envelope text-blue-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-sm text-gray-900 mb-2">Email Campaigns</h3>
            <p class="text-gray-600 text-xs mb-4">Create and manage email marketing campaigns</p>
            <button class="text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              Open <i class="fa-solid fa-arrow-right text-[8px]"></i>
            </button>
          </div>
          
          <div class="card-hover p-6">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fa-brands fa-whatsapp text-green-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-sm text-gray-900 mb-2">WhatsApp Marketing</h3>
            <p class="text-gray-600 text-xs mb-4">Send bulk WhatsApp messages to customers</p>
            <button class="text-green-600 hover:text-green-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              Open <i class="fa-solid fa-arrow-right text-[8px]"></i>
            </button>
          </div>
          
          <div class="card-hover p-6">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fa-solid fa-bullhorn text-purple-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-sm text-gray-900 mb-2">Campaigns</h3>
            <p class="text-gray-600 text-xs mb-4">Track and analyze marketing campaigns</p>
            <button class="text-purple-600 hover:text-purple-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              Open <i class="fa-solid fa-arrow-right text-[8px]"></i>
            </button>
          </div>
        </div>
        
        <div class="empty-state mt-8">
          <i class="fa-solid fa-bullhorn empty-state-icon"></i>
          <p class="empty-state-text">Marketing tools coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>

