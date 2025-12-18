<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-4 md:p-5 border-b border-gray-200">
      <h2 class="heading-main">Team Performance</h2>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 md:px-6 py-3 text-left label-upper whitespace-nowrap">Name</th>
            <th class="px-4 md:px-6 py-3 text-left label-upper whitespace-nowrap">Leads</th>
            <th class="px-4 md:px-6 py-3 text-left label-upper whitespace-nowrap">Qualified leads</th>
            <th class="px-4 md:px-6 py-3 text-left label-upper whitespace-nowrap">Opportunities</th>
            <th class="px-4 md:px-6 py-3 text-left label-upper whitespace-nowrap">In negotiation</th>
            <th class="px-4 md:px-6 py-3 text-left label-upper whitespace-nowrap">Won</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="member in teamMembers"
            :key="member.name"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 md:px-6 py-3 whitespace-nowrap">
              <div class="text-content-bold">{{ member.name }}</div>
            </td>
            <td class="px-4 md:px-6 py-3 whitespace-nowrap">
              <div class="text-content">{{ member.leads }}</div>
            </td>
            <td class="px-4 md:px-6 py-3 whitespace-nowrap">
              <div class="text-content">
                {{ member.qualifiedLeads }} <span class="text-gray-500">({{ member.qualifiedPercentage }}%)</span>
              </div>
            </td>
            <td class="px-4 md:px-6 py-3 whitespace-nowrap">
              <div class="text-content">{{ member.opportunities }}</div>
            </td>
            <td class="px-4 md:px-6 py-3 whitespace-nowrap">
              <div class="text-content">
                {{ member.inNegotiation }} <span class="text-gray-500">({{ member.inNegotiationPercentage }}%)</span>
              </div>
            </td>
            <td class="px-4 md:px-6 py-3 whitespace-nowrap">
              <div class="text-content">
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

