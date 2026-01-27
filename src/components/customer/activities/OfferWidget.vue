<template>
  <div class="bg-surface rounded-xl p-5 mb-6 animate-fade-in relative">
    <div v-if="!hideHeader" class="flex justify-between items-center mb-4">
      <h5 class="text-sm font-bold text-foreground">{{ item ? 'Edit Offer' : 'Create Offer' }}</h5>
      <Button variant="ghost" size="icon" @click="$emit('cancel')" class="text-muted-foreground hover:text-muted-foreground">
        <i class="fa-solid fa-xmark"></i>
      </Button>
    </div>
    
    <!-- Vehicle Selection Step (only show when creating new offer without selected vehicle) -->
    <div v-if="!selectedVehicle && !item && vehicleSelectionStep === 'select'" class="mb-6">
      <div class="bg-white border border-border rounded-lg shadow-nsc-card overflow-hidden p-6">
        <h6 class="text-sm font-semibold text-foreground mb-4">Select Vehicle</h6>
        <p class="text-xs text-muted-foreground mb-4">Choose how you want to add a vehicle to this offer:</p>
        
        <div class="space-y-3">
          <Button
            variant="outline"
            class="w-full justify-start"
            @click="showVehicleSelectionModal = true"
          >
            <i class="fa-solid fa-warehouse mr-2"></i>
            Add from Stock — Search and select an existing vehicle from inventory
          </Button>
          
          <Button
            variant="outline"
            class="w-full justify-start"
            @click="showVehicleSelectionModal = true"
          >
            <i class="fa-solid fa-cog mr-2"></i>
            Configure Vehicle — Build/customize a new vehicle
          </Button>
          
          <Button
            variant="outline"
            class="w-full justify-start"
            @click="vehicleSelectionStep = 'manual'"
          >
            <i class="fa-solid fa-pen-to-square mr-2"></i>
            Skip & Enter Manually — Create vehicle data from scratch
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Selected Vehicle Display -->
    <div v-if="selectedVehicle || (vehicleSelectionStep === 'manual' && offerData.brand)" class="mb-6 p-4 bg-muted rounded-lg border border-border">
      <p class="text-xs text-muted-foreground mb-2">Creating offer for:</p>
      <div class="flex items-center gap-3">
        <div class="w-16 h-16 bg-surfaceTertiary rounded overflow-hidden flex-shrink-0">
          <img 
            v-if="(selectedVehicle?.image || offerData.image)" 
            :src="selectedVehicle?.image || offerData.image" 
            alt="Vehicle" 
            class="w-full h-full object-cover"
          />
          <i v-else class="fa-solid fa-car text-muted-foreground w-full h-full flex items-center justify-center"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-foreground">
            {{ (selectedVehicle?.brand || offerData.brand) }} {{ (selectedVehicle?.model || offerData.model) }} ({{ (selectedVehicle?.year || offerData.year) }})
          </h4>
          <p class="text-xs text-muted-foreground">Base Price: € {{ formatCurrency(selectedVehicle?.price || offerData.price) }}</p>
        </div>
      </div>
    </div>
    
    <!-- Offer Form (show when vehicle selected or manual entry) -->
    <div v-if="selectedVehicle || vehicleSelectionStep === 'manual' || item" class="space-y-3">
      
      <!-- Personal Information Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showPersonalInfo = !showPersonalInfo"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors rounded-t-lg"
        >
          <div class="flex items-center gap-2">
            <h6 class="text-sm font-semibold text-foreground">Personal Information</h6>
            <span class="text-xs text-red-600">*Required</span>
          </div>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showPersonalInfo ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showPersonalInfo" class="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <!-- Salutation -->
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Salutation <span class="text-red-500">*</span></Label>
            <Select v-model="offerData.salutation">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select salutation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr.">Mr.</SelectItem>
                <SelectItem value="Mrs.">Mrs.</SelectItem>
                <SelectItem value="Ms.">Ms.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">First Name <span class="text-red-500">*</span></Label>
              <Input 
                v-model="offerData.firstName" 
                placeholder="Enter first name"
                :disabled="isCustomerFieldDisabled"
              />
            </div>
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Last Name <span class="text-red-500">*</span></Label>
              <Input 
                v-model="offerData.lastName" 
                placeholder="Enter last name"
                :disabled="isCustomerFieldDisabled"
              />
            </div>
          </div>
          
          <!-- Contact Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Email <span class="text-red-500">*</span></Label>
              <Input 
                type="email"
                v-model="offerData.email" 
                placeholder="email@example.com"
                :disabled="isCustomerFieldDisabled"
              />
            </div>
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Phone Number</Label>
              <Input 
                type="tel"
                v-model="offerData.phone" 
                placeholder="+1 (555) 000-0000"
                :disabled="isCustomerFieldDisabled"
              />
            </div>
          </div>
          
          <!-- Address Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">ZIP / Postal Code <span class="text-red-500">*</span></Label>
              <Input 
                v-model="offerData.zipCode" 
                placeholder="Enter ZIP code"
                :disabled="isCustomerFieldDisabled"
              />
            </div>
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">City</Label>
              <Input 
                v-model="offerData.city" 
                placeholder="Enter city"
                :disabled="isCustomerFieldDisabled"
              />
            </div>
          </div>
          
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Address / Street</Label>
            <Input 
              v-model="offerData.address" 
              placeholder="Enter street address"
              :disabled="isCustomerFieldDisabled"
            />
          </div>
        </div>
      </div>
      
      <!-- Vehicle Details Section (for manual entry) -->
      <div v-if="vehicleSelectionStep === 'manual' && !selectedVehicle" class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showVehicleDetails = !showVehicleDetails"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <h6 class="text-sm font-semibold text-foreground">Vehicle Details</h6>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showVehicleDetails ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showVehicleDetails" class="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Brand</Label>
              <Input v-model="offerData.brand" placeholder="e.g., Audi" />
            </div>
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Model</Label>
              <Input v-model="offerData.model" placeholder="e.g., e-tron GT" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Year</Label>
              <Input type="number" v-model="offerData.year" placeholder="2024" />
            </div>
            <div>
              <Label class="text-xs font-medium text-muted-foreground mb-1">Image URL</Label>
              <Input v-model="offerData.image" placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pricing & Financing Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showPricing = !showPricing"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-2">
            <h6 class="text-sm font-semibold text-foreground">Pricing & Financing</h6>
            <span class="text-xs text-red-600">*Required</span>
          </div>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showPricing ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showPricing" class="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <!-- Base Price -->
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Base Price (€) <span class="text-red-500">*</span></Label>
            <Input 
              type="number"
              v-model="offerData.price" 
              placeholder="0"
            />
          </div>
          
          <!-- Financing Type -->
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Financing Type <span class="text-red-500">*</span></Label>
            <Select v-model="offerData.financingType">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select financing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="financing">Financing</SelectItem>
                <SelectItem value="leasing">Leasing</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <!-- VAT Toggle and Details -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Checkbox 
                :checked="offerData.showVat"
                @update:checked="offerData.showVat = $event"
                id="show-vat"
              />
              <Label for="show-vat" class="text-xs font-medium text-muted-foreground cursor-pointer">Show VAT breakdown</Label>
            </div>
            
            <div v-if="offerData.showVat" class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">VAT %</Label>
                <Input 
                  type="number"
                  step="0.1"
                  v-model="offerData.vatRate" 
                  placeholder="21"
                />
              </div>
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">VAT €</Label>
                <Input 
                  type="number"
                  :value="calculatedVat" 
                  readonly
                  class="bg-surfaceTertiary"
                />
              </div>
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Subtotal €</Label>
                <Input 
                  type="number"
                  :value="subtotal" 
                  readonly
                  class="bg-surfaceTertiary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quotation Items Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showQuotationItems = !showQuotationItems"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-2">
            <h6 class="text-sm font-semibold text-foreground">Quotation Items</h6>
            <span class="text-xs text-muted-foreground">({{ offerData.quotationItems.length }} items)</span>
          </div>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showQuotationItems ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showQuotationItems" class="px-4 pb-4 space-y-3 border-t border-border pt-4">
          <div class="flex justify-end">
            <Button
              variant="outline"
              size="small"
              @click="addQuotationItem"
            >
              <i class="fa-solid fa-plus mr-1 text-xs"></i>
              Add Item
            </Button>
          </div>
          
          <!-- Additional Quotation Items -->
          <div v-for="(item, index) in offerData.quotationItems" :key="index" class="border border-border rounded-lg p-3 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="md:col-span-2">
                <Label class="text-xs font-medium text-muted-foreground mb-1">Item Name</Label>
                <Input 
                  v-model="item.name" 
                  placeholder="Item name"
                />
              </div>
              <div class="flex justify-between items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  @click="removeQuotationItem(index)"
                  class="text-red-600 hover:text-red-700 h-10 w-10"
                >
                  <i class="fa-solid fa-trash text-xs"></i>
                </Button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Price (€)</Label>
                <Input 
                  type="number"
                  v-model="item.price" 
                  placeholder="0"
                />
              </div>
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Quantity</Label>
                <Input 
                  type="number"
                  v-model="item.quantity" 
                  placeholder="1"
                  :value="item.quantity || 1"
                />
              </div>
            </div>
            <div class="flex justify-end">
              <span class="text-sm font-semibold text-foreground">Total: € {{ formatCurrency((item.price || 0) * (item.quantity || 1)) }}</span>
            </div>
          </div>
          
          <div v-if="offerData.quotationItems.length === 0" class="text-center py-6 text-muted-foreground text-xs">
            No quotation items added yet
          </div>
        </div>
      </div>
      
      <!-- Discounts Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showDiscounts = !showDiscounts"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-2">
            <h6 class="text-sm font-semibold text-foreground">Discounts</h6>
            <span class="text-xs text-muted-foreground">({{ offerData.discounts.length }} discounts)</span>
          </div>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showDiscounts ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showDiscounts" class="px-4 pb-4 space-y-3 border-t border-border pt-4">
          <div class="flex justify-end">
            <Button
              variant="outline"
              size="small"
              @click="addDiscount"
            >
              <i class="fa-solid fa-plus mr-1 text-xs"></i>
              Add Discount
            </Button>
          </div>
          
          <div v-for="(discount, index) in offerData.discounts" :key="index" class="border border-border rounded-lg p-3 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Discount Title</Label>
                <Input 
                  v-model="discount.title" 
                  placeholder="Discount title"
                />
              </div>
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Amount (€)</Label>
                <Input 
                  type="number"
                  v-model="discount.price" 
                  placeholder="0"
                />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <Label class="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  :checked="discount.vatInclusive"
                  @update:checked="discount.vatInclusive = $event"
                />
                <span class="text-xs text-muted-foreground">VAT inclusive</span>
              </Label>
              <Button
                variant="ghost"
                size="icon"
                @click="removeDiscount(index)"
                class="text-red-600 hover:text-red-700"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </Button>
            </div>
          </div>
          
          <div v-if="offerData.discounts.length === 0" class="text-center py-6 text-muted-foreground text-xs">
            No discounts added yet
          </div>
        </div>
      </div>
      
      <!-- Trade-In Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showTradeIn = !showTradeIn"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <h6 class="text-sm font-semibold text-foreground">Trade-In</h6>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showTradeIn ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showTradeIn" class="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <div class="flex items-center gap-2">
            <Checkbox 
              :checked="offerData.tradeIn.showOnPdf"
              @update:checked="offerData.tradeIn.showOnPdf = $event"
              id="show-tradein-pdf"
            />
            <Label for="show-tradein-pdf" class="text-xs font-medium text-muted-foreground cursor-pointer">Show on PDF</Label>
          </div>
          
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Trade-in Valuation (€)</Label>
            <Input 
              type="number"
              v-model="offerData.tradeIn.valuation" 
              placeholder="0"
            />
          </div>
          
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Trade-in Notes</Label>
            <Textarea 
              v-model="offerData.tradeIn.notes" 
              rows="3"
              placeholder="Add notes about the trade-in vehicle..."
            />
          </div>
        </div>
      </div>
      
      <!-- Payment Methods Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showPaymentMethods = !showPaymentMethods"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-2">
            <h6 class="text-sm font-semibold text-foreground">Payment Methods</h6>
            <span class="text-xs text-muted-foreground">({{ offerData.paymentMethods.length }} methods)</span>
          </div>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showPaymentMethods ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showPaymentMethods" class="px-4 pb-4 space-y-3 border-t border-border pt-4">
          <div class="flex justify-end">
            <Button
              variant="outline"
              size="small"
              @click="addPaymentMethod"
            >
              <i class="fa-solid fa-plus mr-1 text-xs"></i>
              Add Payment Method
            </Button>
          </div>
          
          <div v-for="(payment, index) in offerData.paymentMethods" :key="index" class="border border-border rounded-lg p-3 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Description</Label>
                <Input 
                  v-model="payment.description" 
                  placeholder="Description (max 80 chars)"
                  :maxlength="80"
                />
              </div>
              <div>
                <Label class="text-xs font-medium text-muted-foreground mb-1">Amount (€)</Label>
                <Input 
                  type="number"
                  v-model="payment.amount" 
                  placeholder="0"
                />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <Label class="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  :checked="payment.paid"
                  @update:checked="payment.paid = $event"
                />
                <span class="text-xs text-muted-foreground">PAID</span>
              </Label>
              <Button
                variant="ghost"
                size="icon"
                @click="removePaymentMethod(index)"
                class="text-red-600 hover:text-red-700"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </Button>
            </div>
          </div>
          
          <div v-if="offerData.paymentMethods.length === 0" class="text-center py-6 text-muted-foreground text-xs">
            No payment methods added yet
          </div>
          
          <div v-if="offerData.paymentMethods.length > 0" class="bg-muted rounded-lg p-4 mt-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-muted-foreground">Payment Methods Total:</span>
              <span class="text-sm font-bold text-foreground">€ {{ formatCurrency(paymentMethodsTotal) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-muted-foreground">Grand Total:</span>
              <span class="text-sm font-bold text-foreground">€ {{ formatCurrency(grandTotal) }}</span>
            </div>
            <div v-if="!paymentMethodsValid" class="text-xs text-red-600">
              ⚠️ Payment methods must equal Grand Total
            </div>
          </div>
        </div>
      </div>
      
      <!-- Terms & Conditions Section -->
      <div class="border border-border rounded-lg bg-white shadow-nsc-card">
        <button
          type="button"
          @click="showTerms = !showTerms"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-2">
            <h6 class="text-sm font-semibold text-foreground">Terms & Conditions</h6>
            <span class="text-xs text-red-600">*Required</span>
          </div>
          <i 
            :class="[
              'fa-solid transition-transform duration-200 text-muted-foreground text-xs',
              showTerms ? 'fa-chevron-up' : 'fa-chevron-down'
            ]"
          ></i>
        </button>
        
        <div v-if="showTerms" class="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <!-- Notes / Comments -->
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Notes / Comments</Label>
            <Textarea 
              v-model="offerData.notes" 
              rows="3"
              placeholder="Any special terms, conditions, or notes about this offer..."
            />
          </div>
          
          <!-- Expiration Date -->
          <div>
            <Label class="text-xs font-medium text-muted-foreground mb-1">Offer Expiration Date</Label>
            <Input 
              type="date"
              v-model="offerData.expirationDate" 
            />
          </div>
          
          <!-- Privacy & Consent -->
          <div class="space-y-3 pt-3 border-t border-border">
            <h6 class="text-xs font-semibold text-foreground">Privacy & Consent</h6>
            
            <div class="flex items-start gap-2">
              <Checkbox 
                :checked="offerData.privacyConsent"
                @update:checked="offerData.privacyConsent = $event"
                id="privacy-consent"
              />
              <Label for="privacy-consent" class="text-xs text-muted-foreground cursor-pointer">
                I agree to the privacy policy <span class="text-red-500">*</span>
              </Label>
            </div>
            
            <div class="flex items-start gap-2">
              <Checkbox 
                :checked="offerData.marketingConsent"
                @update:checked="offerData.marketingConsent = $event"
                id="marketing-consent"
              />
              <Label for="marketing-consent" class="text-xs text-muted-foreground cursor-pointer">
                I want to receive marketing communications
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div v-if="!hideActions" class="flex justify-end gap-2 mt-6 border-t border-border pt-4">
      <Button 
        label="Cancel"
        variant="outline"
        size="small"
        class="rounded-sm"
        @click="$emit('cancel')"
      />
      <Button 
        :label="item ? 'Update Offer' : 'Create Offer'"
        variant="primary"
        size="small"
        class="rounded-sm !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
        :disabled="!canSave"
        @click="handleSave"
      />
    </div>
    
    <!-- Vehicle Selection Modal -->
    <VehicleSelectionModal
      :show="showVehicleSelectionModal"
      :requested-vehicle="selectedVehicle"
      :opportunity-id="taskId"
      @close="showVehicleSelectionModal = false"
      @vehicle-selected="handleVehicleSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Button, Input, Label, Textarea, Checkbox,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue 
} from '@motork/component-library/future/primitives'
import VehicleSelectionModal from '@/components/modals/VehicleSelectionModal.vue'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  taskType: {
    type: String,
    default: 'opportunity'
  },
  taskId: {
    type: Number,
    required: true
  },
  selectedVehicle: {
    type: Object,
    default: null
  },
  customer: {
    type: Object,
    default: null
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  hideActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

// Vehicle selection step state
const vehicleSelectionStep = ref('select') // 'select', 'manual'
const showVehicleSelectionModal = ref(false)

// Collapsible section states (all collapsed by default)
const showPersonalInfo = ref(false)
const showVehicleDetails = ref(false)
const showPricing = ref(false)
const showQuotationItems = ref(false)
const showDiscounts = ref(false)
const showTradeIn = ref(false)
const showPaymentMethods = ref(false)
const showTerms = ref(false)

// Offer data
const offerData = ref({
  // Personal Information
  salutation: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zipCode: '',
  address: '',
  city: '',
  
  // Offer Details
  price: 0,
  financingType: '',
  downPayment: 0,
  monthlyPayment: 0,
  term: 36,
  interestRate: 3.5,
  notes: '',
  
  // Privacy
  privacyConsent: false,
  marketingConsent: false,
  
  // Vehicle info (from selected vehicle)
  brand: '',
  model: '',
  year: '',
  image: '',
  
  // New fields
  showVat: false,
  vatRate: 21,
  quotationItems: [],
  discounts: [],
  tradeIn: {
    showOnPdf: true,
    valuation: 0,
    notes: ''
  },
  paymentMethods: [],
  expirationDate: null
})

// Check if customer fields should be disabled (when customer data is available)
const isCustomerFieldDisabled = computed(() => {
  return !!props.customer
})

// Calculate VAT for an item
const calculateItemVat = (price) => {
  if (!offerData.value.showVat || !offerData.value.vatRate) return 0
  return (price * offerData.value.vatRate) / (100 + offerData.value.vatRate)
}

// Calculate subtotal (price without VAT)
const subtotal = computed(() => {
  let total = offerData.value.price || 0
  offerData.value.quotationItems.forEach(item => {
    total += (item.price || 0) * (item.quantity || 1)
  })
  if (offerData.value.showVat) {
    return total - calculatedVat.value
  }
  return total
})

// Calculate total VAT
const calculatedVat = computed(() => {
  if (!offerData.value.showVat || !offerData.value.vatRate) return 0
  let total = offerData.value.price || 0
  offerData.value.quotationItems.forEach(item => {
    total += (item.price || 0) * (item.quantity || 1)
  })
  return (total * offerData.value.vatRate) / (100 + offerData.value.vatRate)
})

// Calculate grand total
const grandTotal = computed(() => {
  let total = offerData.value.price || 0
  offerData.value.quotationItems.forEach(item => {
    total += (item.price || 0) * (item.quantity || 1)
  })
  offerData.value.discounts.forEach(discount => {
    total -= (discount.price || 0)
  })
  if (offerData.value.tradeIn.valuation) {
    total -= offerData.value.tradeIn.valuation
  }
  return total
})

// Calculate payment methods total
const paymentMethodsTotal = computed(() => {
  return offerData.value.paymentMethods.reduce((sum, payment) => sum + (payment.amount || 0), 0)
})

// Validate payment methods sum equals grand total
const paymentMethodsValid = computed(() => {
  if (offerData.value.paymentMethods.length === 0) return true // Optional
  return Math.abs(paymentMethodsTotal.value - grandTotal.value) < 0.01
})

// Add quotation item
const addQuotationItem = () => {
  offerData.value.quotationItems.push({
    type: 'custom',
    name: '',
    price: 0,
    quantity: 1,
    vat: 0
  })
}

// Remove quotation item
const removeQuotationItem = (index) => {
  offerData.value.quotationItems.splice(index, 1)
}

// Add discount
const addDiscount = () => {
  offerData.value.discounts.push({
    title: '',
    price: 0,
    vatInclusive: true
  })
}

// Remove discount
const removeDiscount = (index) => {
  offerData.value.discounts.splice(index, 1)
}

// Add payment method
const addPaymentMethod = () => {
  offerData.value.paymentMethods.push({
    description: '',
    amount: 0,
    paid: false
  })
}

// Remove payment method
const removePaymentMethod = (index) => {
  offerData.value.paymentMethods.splice(index, 1)
}

// Pre-populate customer data from context
const populateCustomerData = () => {
  if (props.customer) {
    // Split name if available
    const nameParts = (props.customer.name || '').split(' ')
    offerData.value.firstName = nameParts[0] || ''
    offerData.value.lastName = nameParts.slice(1).join(' ') || ''
    
    offerData.value.email = props.customer.email || ''
    offerData.value.phone = props.customer.phone || ''
    offerData.value.address = props.customer.address || ''
    offerData.value.city = props.customer.city || ''
    offerData.value.zipCode = props.customer.zipCode || props.customer.postalCode || ''
  }
}

// Initialize from selected vehicle and customer
onMounted(() => {
  // Pre-populate customer data
  populateCustomerData()
  
  // If editing existing offer, skip vehicle selection
  if (props.item) {
    vehicleSelectionStep.value = 'manual'
  }
  
  // If vehicle is already selected, skip vehicle selection
  if (props.selectedVehicle) {
    vehicleSelectionStep.value = 'manual'
  }
  
  // Pre-populate vehicle data
  if (props.selectedVehicle) {
    offerData.value.price = props.selectedVehicle.price || 0
    offerData.value.brand = props.selectedVehicle.brand || ''
    offerData.value.model = props.selectedVehicle.model || ''
    offerData.value.year = props.selectedVehicle.year || ''
    offerData.value.image = props.selectedVehicle.image || ''
  }
  
  // If editing existing offer
  if (props.item && props.item.data) {
    offerData.value = {
      ...offerData.value,
      ...props.item.data,
      price: props.item.data.price || props.item.data.total || 0,
      financingType: props.item.data.financingType || props.item.data.paymentMethod || '',
      notes: props.item.data.notes || props.item.data.description || '',
      showVat: props.item.data.showVat || false,
      vatRate: props.item.data.vatRate || 21,
      quotationItems: props.item.data.quotationItems || [],
      discounts: props.item.data.discounts || [],
      tradeIn: props.item.data.tradeIn || {
        showOnPdf: true,
        valuation: 0,
        notes: ''
      },
      paymentMethods: props.item.data.paymentMethods || [],
      expirationDate: props.item.data.expirationDate || null
    }
  }
})

// Watch for changes in selected vehicle
watch(() => props.selectedVehicle, (newVehicle) => {
  if (newVehicle && !props.item) {
    vehicleSelectionStep.value = 'manual'
    offerData.value.price = newVehicle.price || 0
    offerData.value.brand = newVehicle.brand || ''
    offerData.value.model = newVehicle.model || ''
    offerData.value.year = newVehicle.year || ''
    offerData.value.image = newVehicle.image || ''
  }
})

// Watch for changes in customer
watch(() => props.customer, () => {
  populateCustomerData()
})

// Validation
const canSave = computed(() => {
  const baseValidation = (
    offerData.value.salutation !== '' &&
    offerData.value.firstName !== '' &&
    offerData.value.lastName !== '' &&
    offerData.value.email !== '' &&
    offerData.value.zipCode !== '' &&
    offerData.value.price > 0 &&
    offerData.value.financingType !== '' &&
    offerData.value.privacyConsent === true
  )
  
  // Vehicle must be selected or manual entry completed
  const vehicleValid = props.selectedVehicle || vehicleSelectionStep.value === 'manual'
  
  // Payment methods validation (if added, must equal grand total)
  const paymentValid = paymentMethodsValid.value
  
  return baseValidation && vehicleValid && paymentValid
})

// Format currency
const formatCurrency = (value) => {
  if (!value) return '0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Handle vehicle selection from modal
const handleVehicleSelected = (selection) => {
  const vehicle = selection.vehicle
  
  // Set the vehicle data
  offerData.value.brand = vehicle.brand || ''
  offerData.value.model = vehicle.model || ''
  offerData.value.year = vehicle.year || ''
  offerData.value.price = vehicle.price || 0
  offerData.value.image = vehicle.image || ''
  
  // Update vehicle selection step to show the form
  vehicleSelectionStep.value = 'manual'
  
  // Close the modal
  showVehicleSelectionModal.value = false
}

// Save handler
const handleSave = () => {
  if (!canSave.value) return
  
  const offerPayload = {
    id: props.item?.id || Date.now(),
    type: 'offer',
    action: props.item ? 'updated an offer' : 'created an offer',
    data: {
      // Personal information
      salutation: offerData.value.salutation,
      firstName: offerData.value.firstName,
      lastName: offerData.value.lastName,
      email: offerData.value.email,
      phone: offerData.value.phone,
      zipCode: offerData.value.zipCode,
      address: offerData.value.address,
      city: offerData.value.city,
      
      // Vehicle
      brand: offerData.value.brand,
      model: offerData.value.model,
      year: offerData.value.year,
      image: offerData.value.image,
      
      // Offer details
      price: offerData.value.price,
      total: grandTotal.value,
      paymentMethod: offerData.value.financingType,
      financingType: offerData.value.financingType,
      downPayment: offerData.value.downPayment,
      monthlyPayment: offerData.value.monthlyPayment,
      term: offerData.value.term,
      interestRate: offerData.value.interestRate,
      notes: offerData.value.notes,
      description: offerData.value.notes,
      
      // Privacy
      privacyConsent: offerData.value.privacyConsent,
      marketingConsent: offerData.value.marketingConsent,
      
      // New fields
      showVat: offerData.value.showVat,
      vatRate: offerData.value.vatRate,
      vatAmount: calculatedVat.value,
      subtotal: subtotal.value,
      quotationItems: offerData.value.quotationItems,
      discounts: offerData.value.discounts,
      tradeIn: offerData.value.tradeIn,
      paymentMethods: offerData.value.paymentMethods,
      expirationDate: offerData.value.expirationDate,
      grandTotal: grandTotal.value
    },
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  }
  
  emit('save', offerPayload)
}

defineExpose({
  submit: handleSave,
  isValid: canSave,
  offerData
})
</script>
