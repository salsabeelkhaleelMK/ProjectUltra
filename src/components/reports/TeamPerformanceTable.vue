<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-4 md:p-6 border-b border-gray-200">
      <h2 class="text-lg md:text-xl font-bold text-gray-900">Team Performance</h2>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
            <th class="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leads</th>
            <th class="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qualified leads</th>
            <th class="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Opportunities</th>
            <th class="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">In negotiation</th>
            <th class="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Won</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="member in teamMembers"
            :key="member.name"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 md:px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-gray-900">{{ member.name }}</div>
            </td>
            <td class="px-4 md:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ member.leads }}</div>
            </td>
            <td class="px-4 md:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ member.qualifiedLeads }} <span class="text-gray-500">({{ member.qualifiedPercentage }}%)</span>
              </div>
            </td>
            <td class="px-4 md:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ member.opportunities }}</div>
            </td>
            <td class="px-4 md:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ member.inNegotiation }} <span class="text-gray-500">({{ member.inNegotiationPercentage }}%)</span>
              </div>
            </td>
            <td class="px-4 md:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ member.won }} <span class="text-gray-500">({{ member.wonPercentage }}%)</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  teamMembers: {
    type: Array,
    required: true
  }
})
</script>

