// Address input sanitization and validation utilities

export function sanitizeAddressInput(input) {
  return input
    .replace(/<[^>]*>/g, '')        // Strip HTML tags
    .replace(/[^\w\s,.\-#'/]/g, '') // Allow only address-safe characters
    .trim()
    .slice(0, 500);                  // Limit length
}

export function isPlausibleAddress(input) {
  const trimmed = input.trim();
  if (trimmed.length < 5 || trimmed.length > 500) return false;
  if (!trimmed.includes(',')) return false;
  return true;
}

export const MAX_BATCH_SIZE = 100;
