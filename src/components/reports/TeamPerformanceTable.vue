<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-4 md:p-5 border-b border-gray-200">
      <h2 class="heading-main">Team Performance</h2>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left label-upper whitespace-nowrap">Name</th>
            <th class="px-4 py-3 text-left label-upper whitespace-nowrap">Leads</th>
            <th class="px-4 py-3 text-left label-upper whitespace-nowrap">Qualified</th>
            <th class="px-4 py-3 text-left label-upper whitespace-nowrap">Opportunities</th>
            <th class="px-4 py-3 text-left label-upper whitespace-nowrap">In Negotiation</th>
            <th class="px-4 py-3 text-left label-upper whitespace-nowrap">Won</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="member in teamMembers"
            :key="member.name"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm font-bold text-gray-900">{{ member.name }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-700">{{ member.leads }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-700">
                {{ member.qualifiedLeads }} <span class="text-gray-500 text-xs">({{ member.qualifiedPercentage }}%)</span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-700">{{ member.opportunities }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-700">
                {{ member.inNegotiation }} <span class="text-gray-500 text-xs">({{ member.inNegotiationPercentage }}%)</span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-700">
                {{ member.won }} <span class="text-gray-500 text-xs">({{ member.wonPercentage }}%)</span>
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

