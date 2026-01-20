# Shared Communication Components

Reusable communication form components for sending emails, SMS, WhatsApp messages, and making calls.

## Components

### 1. `EmailForm.vue`
Form for composing and sending emails with template support.

**Props:**
- `initialTemplate` (String): Pre-selected template
- `initialMessage` (String): Pre-filled message content

**Events:**
- `@send`: Emitted when send button is clicked
  ```javascript
  {
    type: 'email',
    template: 'Follow-up',
    subject: 'Email subject',
    message: 'Email body'
  }
  ```
- `@cancel`: Emitted when cancel button is clicked

**Usage:**
```vue
<EmailForm
  @send="handleEmailSend"
  @cancel="handleCancel"
/>
```

---

### 2. `SMSForm.vue`
Form for composing and sending SMS messages with character limit.

**Props:**
- `initialTemplate` (String): Pre-selected template
- `initialMessage` (String): Pre-filled message content

**Events:**
- `@send`: Emitted when send button is clicked
  ```javascript
  {
    type: 'sms',
    template: 'Follow-up',
    message: 'SMS message text (max 160 chars)'
  }
  ```
- `@cancel`: Emitted when cancel button is clicked

**Usage:**
```vue
<SMSForm
  @send="handleSMSSend"
  @cancel="handleCancel"
/>
```

---

### 3. `WhatsAppForm.vue`
Form for composing and sending WhatsApp messages.

**Props:**
- `initialTemplate` (String): Pre-selected template
- `initialMessage` (String): Pre-filled message content

**Events:**
- `@send`: Emitted when send button is clicked
  ```javascript
  {
    type: 'whatsapp',
    template: 'Follow-up',
    message: 'WhatsApp message text'
  }
  ```
- `@cancel`: Emitted when cancel button is clicked

**Usage:**
```vue
<WhatsAppForm
  @send="handleWhatsAppSend"
  @cancel="handleCancel"
/>
```

---

### 4. `CallForm.vue`
Form for initiating calls with multiple calling options (Outbound, PBX, or Copy Number).

**Props:**
- `phoneNumber` (String, required): The phone number to call

**Events:**
- `@call`: Emitted when a call option is selected
  ```javascript
  {
    type: 'call',
    option: 'outbound' | 'pbx' | 'copy',
    phoneNumber: '+1234567890',
    notes: 'Call notes'
  }
  ```
- `@cancel`: Emitted when cancel button is clicked

**Usage:**
```vue
<CallForm
  phone-number="+1234567890"
  @call="handleCall"
  @cancel="handleCancel"
/>
```

---

### 5. `CommunicationSelector.vue`
Wrapper component that shows channel selection buttons and displays the appropriate form.

**Props:**
- `title` (String): Title for the selector section
- `showEmail` (Boolean): Show email option (default: true)
- `showSMS` (Boolean): Show SMS option (default: true)
- `showWhatsApp` (Boolean): Show WhatsApp option (default: true)
- `showDontSend` (Boolean): Show "Don't send" option (default: false)
- `initialTemplate` (String): Pre-selected template for all forms
- `initialMessage` (String): Pre-filled message for all forms

**Events:**
- `@send`: Emitted when any communication form sends
  ```javascript
  {
    type: 'email' | 'sms' | 'whatsapp',
    template: 'Template name',
    message: 'Message content',
    subject: 'Email subject' // Only for emails
  }
  ```
- `@dont-send`: Emitted when "Don't send" is selected
- `@cancel`: Emitted when any form is cancelled

**Usage:**
```vue
<CommunicationSelector
  title="Send follow-up message"
  :show-email="true"
  :show-sms="true"
  :show-whatsapp="true"
  :show-dont-send="true"
  @send="handleSend"
  @dont-send="handleDontSend"
  @cancel="handleCancel"
/>
```

---

## Integration Examples

### Example 1: Communication Tab (EntityDetailLayout)

```vue
<!-- Already integrated in CommunicationWidget.vue -->
<template>
  <EmailForm v-if="type === 'email'" @send="handleSend" @cancel="handleCancel" />
  <SMSForm v-else-if="type === 'sms'" @send="handleSend" @cancel="handleCancel" />
  <WhatsAppForm v-else-if="type === 'whatsapp'" @send="handleSend" @cancel="handleCancel" />
  <CallForm v-else-if="type === 'call'" :phone-number="phoneNumber" @call="handleCall" @cancel="handleCancel" />
</template>
```

### Example 2: Manage Tab (LQTask Widget)

```vue
<template>
  <!-- No Answer Follow-up -->
  <div v-if="selectedOutcome === 'no-answer'">
    <CommunicationSelector
      title="Send follow-up message"
      :show-email="true"
      :show-sms="true"
      :show-whatsapp="true"
      :show-dont-send="true"
      @send="handleFollowupSend"
      @dont-send="handleDontSend"
    />
  </div>
</template>

<script setup>
import CommunicationSelector from '@/components/shared/communication/CommunicationSelector.vue'

const handleFollowupSend = (data) => {
  console.log('Communication sent:', data)
  // Save activity, update state, etc.
}

const handleDontSend = () => {
  console.log('User chose not to send follow-up')
  // Continue without sending
}
</script>
```

### Example 3: Custom Modal Integration

```vue
<template>
  <Dialog :open="showEmailModal">
    <DialogContent>
      <EmailForm
        initial-template="Follow-up"
        @send="handleEmailSend"
        @cancel="showEmailModal = false"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogContent } from '@motork/component-library/future/primitives'
import EmailForm from '@/components/shared/communication/EmailForm.vue'

const showEmailModal = ref(false)

const handleEmailSend = async (data) => {
  await sendEmail(data)
  showEmailModal.value = false
}
</script>
```

---

## Templates

All forms support the following templates:

1. **Follow-up**: General follow-up message
2. **Meeting Confirmation**: Appointment/meeting confirmation
3. **Quote Proposal**: Sending quotes or proposals
4. **Unable to Reach**: Message when customer is unreachable

Templates automatically populate the message field when selected. Users can edit the content before sending.

---

## Styling

All components use:
- Semantic Tailwind classes from `tailwind.config.js`
- MotorK Button component for actions
- Standard input styling from `src/style.css`
- Responsive design (mobile-first)

---

## Future Enhancements

- [ ] Add more template options
- [ ] Support custom templates from backend
- [ ] Add file attachment support for emails
- [ ] Add rich text editor for emails
- [ ] Integrate with actual calling APIs (Outbound, PBX)
- [ ] Add delivery status tracking
- [ ] Support scheduled sending
