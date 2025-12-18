/**
 * Maps a feed item / activity type to the correct Tasks tab key.
 *
 * Tabs:
 * - 'overview'      : mixed items that are not tied to a dedicated tab (e.g. trade-in, financing, appointment).
 * - 'note'          : textual notes.
 * - 'communication' : calls, emails, SMS, WhatsApp and generic communication.
 * - 'attachment'    : files and documents.
 *
 * This helper keeps tab routing logic shared between leads and opportunities.
 */
export const getTabForItemTypeDefault = (type) => {
  if (type === 'note') return 'note'
  if (['call', 'email', 'sms', 'whatsapp', 'communication'].includes(type)) return 'communication'
  if (type === 'attachment') return 'attachment'
  // Default: overview-only items (tradein, financing, appointment, etc.)
  return 'overview'
}


