<template>
  <Card v-if="accountData || loading" class="h-full">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm font-semibold leading-5">Account Details</CardTitle>
        <Button
          @click="showEditModal = true"
          variant="ghost"
          size="sm"
          class="text-xs"
        >
          Edit Account
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-muted rounded w-3/4"></div>
          <div class="h-4 bg-muted rounded w-2/3"></div>
          <div class="h-4 bg-muted rounded w-4/5"></div>
          <div class="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </template>
      
      <!-- Content -->
      <template v-else-if="accountData">
        <div class="space-y-4">
          <!-- Company Info Section -->
          <div class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company Info</h4>
            <div class="space-y-2">
              <!-- Company Name -->
              <div v-if="accountData.name || accountData.companyName" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Building2 class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Company Name</div>
                  <div class="text-sm font-medium text-foreground">{{ accountData.name || accountData.companyName }}</div>
                </div>
                <Badge v-if="accountData.type" variant="outline" class="text-xs">
                  {{ accountData.type }}
                </Badge>
              </div>
              
              <!-- Account Type -->
              <div v-if="accountData.type" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileText class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Account Type</div>
                  <div class="text-sm text-foreground">{{ accountData.type === 'Company' ? 'Company Account' : 'Private Account' }}</div>
                </div>
              </div>
              
              <!-- Account Status -->
              <div v-if="accountStatus" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <CheckCircle class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Account Status</div>
                  <Badge 
                    :variant="accountStatus === 'Active' ? 'default' : 'outline'"
                    class="text-xs"
                  >
                    {{ accountStatus }}
                  </Badge>
                </div>
              </div>
              
              <!-- Account Owner -->
              <div v-if="accountData.accountOwner || accountData.owner" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <User class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Account Owner</div>
                  <div class="text-sm text-foreground">
                    {{ getOwnerName(accountData.accountOwner || accountData.owner) }}
                  </div>
                </div>
              </div>
              
              <!-- Number of Employees (Company only) -->
              <div v-if="accountData.type === 'Company' && accountData.numberOfEmployees" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Users class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Employees</div>
                  <div class="text-sm text-foreground">{{ accountData.numberOfEmployees }}</div>
                </div>
              </div>
              
              <!-- Company Website -->
              <div v-if="companyWebsite" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Globe class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Website</div>
                  <a 
                    :href="companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-primary hover:underline truncate block"
                  >
                    {{ companyWebsite }}
                  </a>
                </div>
                <Button
                  @click="copyToClipboard(companyWebsite, 'Website')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy website"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Company Phone -->
              <div v-if="companyPhone" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Phone class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Company Phone</div>
                  <a :href="`tel:${companyPhone}`" class="text-sm text-primary hover:underline">{{ companyPhone }}</a>
                </div>
                <Button
                  @click="copyToClipboard(companyPhone, 'Phone')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy phone"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Company Email -->
              <div v-if="companyEmail" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Mail class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Company Email</div>
                  <a :href="`mailto:${companyEmail}`" class="text-sm text-primary hover:underline truncate block">{{ companyEmail }}</a>
                </div>
                <Button
                  @click="copyToClipboard(companyEmail, 'Email')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy email"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Legal/Business Section -->
          <div v-if="hasLegalInfo" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Legal/Business</h4>
            <div class="space-y-2">
              <!-- VAT Number -->
              <div v-if="accountData.vat || accountData.vatNumber" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileText class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">VAT Number</div>
                  <div class="text-sm text-foreground">{{ accountData.vat || accountData.vatNumber }}</div>
                </div>
                <Button
                  @click="copyToClipboard(accountData.vat || accountData.vatNumber, 'VAT')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy VAT"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Tax Code / Fiscal Code -->
              <div v-if="accountData.taxCode || accountData.fiscalCode" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileText class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Tax Code</div>
                  <div class="text-sm text-foreground">{{ accountData.taxCode || accountData.fiscalCode }}</div>
                </div>
                <Button
                  @click="copyToClipboard(accountData.taxCode || accountData.fiscalCode, 'Tax Code')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy Tax Code"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Fiscal Entity -->
              <div v-if="fiscalEntityName" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Building2 class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Fiscal Entity</div>
                  <div class="text-sm text-foreground">{{ fiscalEntityName }}</div>
                </div>
              </div>
              
              <!-- Payment Terms -->
              <div v-if="paymentTerms" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileText class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Payment Terms</div>
                  <div class="text-sm text-foreground">{{ paymentTerms }}</div>
                </div>
              </div>
              
              <!-- Credit Limit -->
              <div v-if="creditLimit" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <DollarSign class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Credit Limit</div>
                  <div class="text-sm text-foreground">{{ creditLimit }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Company Address Section -->
          <div v-if="hasCompanyAddress" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</h4>
            <div class="space-y-2">
              <!-- Street Address Line 1 -->
              <div v-if="companyAddressStreetLine1" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Street Address</div>
                  <div class="text-sm text-foreground">{{ companyAddressStreetLine1 }}</div>
                </div>
                <Button
                  @click="copyToClipboard(companyAddressStreetLine1, 'Address')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy address"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Street Address Line 2 -->
              <div v-if="companyAddressStreetLine2" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground opacity-0" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-foreground">{{ companyAddressStreetLine2 }}</div>
                </div>
              </div>
              
              <!-- City, Postal Code, Region, Country -->
              <div v-if="companyAddressCity || companyAddressPostalCode || companyAddressRegion || companyAddressCountry" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-muted-foreground opacity-0" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-foreground">
                    <span v-if="companyAddressCity">{{ companyAddressCity }}</span>
                    <span v-if="companyAddressCity && companyAddressPostalCode">, </span>
                    <span v-if="companyAddressPostalCode">{{ companyAddressPostalCode }}</span>
                    <span v-if="(companyAddressCity || companyAddressPostalCode) && companyAddressRegion">, </span>
                    <span v-if="companyAddressRegion">{{ companyAddressRegion }}</span>
                    <span v-if="(companyAddressCity || companyAddressPostalCode || companyAddressRegion) && companyAddressCountry">, </span>
                    <span v-if="companyAddressCountry">{{ companyAddressCountry }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Relationships Section -->
          <div v-if="hasRelationships" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Relationships</h4>
            <div class="space-y-2">
              <!-- Related Contacts -->
              <div v-if="relatedContactsCountValue !== undefined && relatedContactsCountValue !== null" class="flex items-center justify-between gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <Users class="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-muted-foreground mb-0.5">Related Contacts</div>
                    <div class="text-sm font-medium text-foreground">{{ relatedContactsCountValue }}</div>
                  </div>
                </div>
                <Button
                  @click="showViewContactsModal = true"
                  variant="ghost"
                  size="sm"
                  class="text-xs shrink-0"
                >
                  View All
                </Button>
              </div>
              
              <!-- Related Leads -->
              <div v-if="relatedLeadsCountValue !== undefined && relatedLeadsCountValue !== null" class="flex items-center justify-between gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <UserPlus class="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-muted-foreground mb-0.5">Related Leads</div>
                    <div class="text-sm font-medium text-foreground">{{ relatedLeadsCountValue }}</div>
                  </div>
                </div>
                <Button
                  @click="showViewLeadsModal = true"
                  variant="ghost"
                  size="sm"
                  class="text-xs shrink-0"
                >
                  View All
                </Button>
              </div>
              
              <!-- Related Opportunities -->
              <div v-if="relatedOpportunitiesCountValue !== undefined && relatedOpportunitiesCountValue !== null" class="flex items-center justify-between gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <Briefcase class="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-muted-foreground mb-0.5">Related Opportunities</div>
                    <div class="text-sm font-medium text-foreground">{{ relatedOpportunitiesCountValue }}</div>
                  </div>
                </div>
                <Button
                  @click="showViewOpportunitiesModal = true"
                  variant="ghost"
                  size="sm"
                  class="text-xs shrink-0"
                >
                  View All
                </Button>
              </div>
              
              <!-- Related Vehicles -->
              <div v-if="relatedVehiclesCountValue !== undefined && relatedVehiclesCountValue !== null" class="flex items-center justify-between gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <Car class="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-muted-foreground mb-0.5">Related Vehicles</div>
                    <div class="text-sm font-medium text-foreground">{{ relatedVehiclesCountValue }}</div>
                  </div>
                </div>
                <Button
                  @click="showViewVehiclesModal = true"
                  variant="ghost"
                  size="sm"
                  class="text-xs shrink-0"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>

          <!-- Account Description -->
          <div v-if="accountData.description || accountData.notes" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Additional Info</h4>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                <FileText class="w-4 h-4 text-muted-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs text-muted-foreground mb-0.5">Description</div>
                <div class="text-sm text-foreground whitespace-pre-line">{{ accountData.description || accountData.notes }}</div>
              </div>
            </div>
          </div>

          <!-- Account Tags -->
          <div v-if="accountTags && accountTags.length > 0" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tags</h4>
            <div class="flex flex-wrap gap-1.5">
              <Badge
                v-for="tag in accountTags"
                :key="tag"
                variant="outline"
                class="text-xs"
              >
                {{ tag }}
              </Badge>
            </div>
          </div>

          <!-- Metadata Section -->
          <div v-if="hasMetadata" class="space-y-2">
            <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Metadata</h4>
            <div class="space-y-2">
              <!-- Account External ID -->
              <div v-if="accountExternalId" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Hash class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">External ID</div>
                  <div class="text-sm text-foreground font-mono">{{ accountExternalId }}</div>
                </div>
                <Button
                  @click="copyToClipboard(accountExternalId, 'External ID')"
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy External ID"
                >
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
              
              <!-- Account Created Date -->
              <div v-if="accountCreatedDateValue" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Calendar class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Created Date</div>
                  <div class="text-sm text-foreground">{{ formatDate(accountCreatedDateValue) }}</div>
                </div>
              </div>
              
              <!-- Account Last Updated Date -->
              <div v-if="accountUpdatedDateValue" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Clock class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Last Updated</div>
                  <div class="text-sm text-foreground">{{ formatDate(accountUpdatedDateValue) }}</div>
                </div>
              </div>
              
              <!-- Last Activity -->
              <div v-if="lastActivityValue" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Activity class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted-foreground mb-0.5">Last Activity</div>
                  <div class="text-sm text-foreground">{{ formatDate(lastActivityValue) }}</div>
                </div>
              </div>
              
              <!-- Custom Fields -->
              <div v-if="accountCustomFields && Object.keys(accountCustomFields).length > 0" class="space-y-1">
                <div v-for="(value, key) in accountCustomFields" :key="key" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <FileText class="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-muted-foreground mb-0.5">{{ key }}</div>
                    <div class="text-sm text-foreground">{{ value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="!hasAnyData" class="text-center py-6 text-muted-foreground">
            <p class="text-xs">No account details available</p>
          </div>
        </div>
      </template>
    </CardContent>

    <!-- Modals -->
    <ComingSoonModal
      :show="showEditModal"
      title="Edit Account"
      @close="showEditModal = false"
    />
    <ComingSoonModal
      :show="showViewContactsModal"
      title="View All Contacts"
      @close="showViewContactsModal = false"
    />
    <ComingSoonModal
      :show="showViewLeadsModal"
      title="View All Leads"
      @close="showViewLeadsModal = false"
    />
    <ComingSoonModal
      :show="showViewOpportunitiesModal"
      title="View All Opportunities"
      @close="showViewOpportunitiesModal = false"
    />
    <ComingSoonModal
      :show="showViewVehiclesModal"
      title="View All Vehicles"
      @close="showViewVehiclesModal = false"
    />
  </Card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Button, Badge } from '@motork/component-library/future/primitives'
import { 
  Building2, FileText, User, Users, Copy, CheckCircle, 
  Globe, Phone, Mail, MapPin, UserPlus, Briefcase, Car,
  Hash, Calendar, Clock, Activity, DollarSign
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'

const props = defineProps({
  accountData: {
    type: Object,
    default: null
  },
  currentContactId: {
    type: [Number, String],
    default: null
  },
  // Account status and info
  accountStatus: {
    type: String,
    default: 'Active'
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  companyPhone: {
    type: String,
    default: ''
  },
  companyEmail: {
    type: String,
    default: ''
  },
  // Company address - can be object or flat fields
  companyAddress: {
    type: [String, Object],
    default: () => ''
  },
  companyStreetAddress1: {
    type: String,
    default: ''
  },
  companyStreetAddress2: {
    type: String,
    default: ''
  },
  companyCity: {
    type: String,
    default: ''
  },
  companyPostalCode: {
    type: String,
    default: ''
  },
  companyRegion: {
    type: String,
    default: ''
  },
  companyCountry: {
    type: String,
    default: ''
  },
  // Metadata - fiscalEntity can be object { id, name } or string
  fiscalEntity: {
    type: [String, Object],
    default: () => ''
  },
  accountExternalId: {
    type: String,
    default: ''
  },
  accountCustomFields: {
    type: Object,
    default: () => ({})
  },
  accountCreatedAt: {
    type: String,
    default: ''
  },
  createdDate: {
    type: String,
    default: ''
  },
  accountUpdatedAt: {
    type: String,
    default: ''
  },
  lastUpdatedDate: {
    type: String,
    default: ''
  },
  lastActivity: {
    type: String,
    default: ''
  },
  lastActivityDate: {
    type: String,
    default: ''
  },
  // Relationships - can be number or object { count, ids: [] }
  relatedContactsCount: {
    type: [Number, Object],
    default: undefined
  },
  relatedLeadsCount: {
    type: [Number, Object],
    default: undefined
  },
  relatedOpportunitiesCount: {
    type: [Number, Object],
    default: undefined
  },
  relatedVehiclesCount: {
    type: [Number, Object],
    default: undefined
  },
  // Tags
  accountTags: {
    type: Array,
    default: () => []
  },
  // Payment terms
  paymentTerms: {
    type: String,
    default: ''
  },
  creditLimit: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const toastStore = useToastStore()
const showEditModal = ref(false)
const showViewContactsModal = ref(false)
const showViewLeadsModal = ref(false)
const showViewOpportunitiesModal = ref(false)
const showViewVehiclesModal = ref(false)

// Extract fiscal entity - support both object { id, name } and string
const fiscalEntityName = computed(() => {
  if (typeof props.fiscalEntity === 'object' && props.fiscalEntity !== null) {
    return props.fiscalEntity.name || ''
  }
  return props.fiscalEntity || ''
})

// Extract company address - support both object and flat fields
const companyAddressStreetLine1 = computed(() => {
  if (typeof props.companyAddress === 'object' && props.companyAddress !== null) {
    return props.companyAddress.streetLine1 || ''
  }
  return props.companyStreetAddress1 || ''
})

const companyAddressStreetLine2 = computed(() => {
  if (typeof props.companyAddress === 'object' && props.companyAddress !== null) {
    return props.companyAddress.streetLine2 || ''
  }
  return props.companyStreetAddress2 || ''
})

const companyAddressCity = computed(() => {
  if (typeof props.companyAddress === 'object' && props.companyAddress !== null) {
    return props.companyAddress.city || ''
  }
  return props.companyCity || ''
})

const companyAddressPostalCode = computed(() => {
  if (typeof props.companyAddress === 'object' && props.companyAddress !== null) {
    return props.companyAddress.postalCode || ''
  }
  return props.companyPostalCode || ''
})

const companyAddressRegion = computed(() => {
  if (typeof props.companyAddress === 'object' && props.companyAddress !== null) {
    return props.companyAddress.region || ''
  }
  return props.companyRegion || ''
})

const companyAddressCountry = computed(() => {
  if (typeof props.companyAddress === 'object' && props.companyAddress !== null) {
    return props.companyAddress.country || ''
  }
  return props.companyCountry || ''
})

// Extract relationship counts - support both number and object { count, ids: [] }
const relatedContactsCountValue = computed(() => {
  if (typeof props.relatedContactsCount === 'object' && props.relatedContactsCount !== null) {
    return props.relatedContactsCount.count || 0
  }
  return props.relatedContactsCount ?? 0
})

const relatedLeadsCountValue = computed(() => {
  if (typeof props.relatedLeadsCount === 'object' && props.relatedLeadsCount !== null) {
    return props.relatedLeadsCount.count || 0
  }
  return props.relatedLeadsCount ?? 0
})

const relatedOpportunitiesCountValue = computed(() => {
  if (typeof props.relatedOpportunitiesCount === 'object' && props.relatedOpportunitiesCount !== null) {
    return props.relatedOpportunitiesCount.count || 0
  }
  return props.relatedOpportunitiesCount ?? 0
})

const relatedVehiclesCountValue = computed(() => {
  if (typeof props.relatedVehiclesCount === 'object' && props.relatedVehiclesCount !== null) {
    return props.relatedVehiclesCount.count || 0
  }
  return props.relatedVehiclesCount ?? 0
})

// Extract date values - support both createdAt/updatedAt and createdDate/lastUpdatedDate
const accountCreatedDateValue = computed(() => {
  return props.accountCreatedAt || props.createdDate || ''
})

const accountUpdatedDateValue = computed(() => {
  return props.accountUpdatedAt || props.lastUpdatedDate || ''
})

const lastActivityValue = computed(() => {
  return props.lastActivity || props.lastActivityDate || ''
})

const hasLegalInfo = computed(() => {
  return !!(props.accountData?.vat || props.accountData?.vatNumber || 
    props.accountData?.taxCode || props.accountData?.fiscalCode || fiscalEntityName.value)
})

const hasCompanyAddress = computed(() => {
  return !!(companyAddressStreetLine1.value || companyAddressCity.value || 
    companyAddressPostalCode.value || companyAddressRegion.value || companyAddressCountry.value)
})

const hasRelationships = computed(() => {
  return relatedContactsCountValue.value !== undefined && relatedContactsCountValue.value !== null || 
    relatedLeadsCountValue.value !== undefined && relatedLeadsCountValue.value !== null || 
    relatedOpportunitiesCountValue.value !== undefined && relatedOpportunitiesCountValue.value !== null || 
    relatedVehiclesCountValue.value !== undefined && relatedVehiclesCountValue.value !== null
})

const hasMetadata = computed(() => {
  return !!(props.accountExternalId || props.accountCreatedAt || 
    props.accountUpdatedAt || props.lastActivity ||
    (props.accountCustomFields && Object.keys(props.accountCustomFields).length > 0))
})

const hasAnyData = computed(() => {
  return !!(props.accountData?.name || props.accountData?.companyName || 
    hasLegalInfo.value || hasCompanyAddress.value || hasRelationships.value ||
    props.accountData?.description || props.accountData?.notes ||
    (props.accountTags && props.accountTags.length > 0) || hasMetadata.value)
})

const getOwnerName = (owner) => {
  if (!owner) return 'Not assigned'
  if (typeof owner === 'string') return owner
  if (owner.name) return owner.name
  if (owner.firstName && owner.lastName) return `${owner.firstName} ${owner.lastName}`
  return 'Unknown'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (e) {
    return dateString
  }
}

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    toastStore.pushToast('success', `${field} copied!`)
  } catch (err) {
    toastStore.pushToast('error', 'Failed to copy')
  }
}
</script>
