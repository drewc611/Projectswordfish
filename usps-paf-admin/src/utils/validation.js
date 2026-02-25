// Address input sanitization and validation utilities

/**
 * Sanitize address input by removing dangerous characters and patterns.
 * Defends against XSS, HTML injection, and SQL injection attempts.
 */
export function sanitizeAddressInput(input) {
  if (typeof input !== 'string') return '';

  let sanitized = input;

  // Recursively strip HTML/XML tags to prevent nested tag bypass
  let previous;
  do {
    previous = sanitized;
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } while (sanitized !== previous);

  // Remove javascript: and data: URI schemes
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  sanitized = sanitized.replace(/data\s*:/gi, '');

  // Remove event handler patterns (onerror=, onclick=, etc.)
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Allow only address-safe characters: word chars, spaces, commas, periods,
  // hyphens, hash, apostrophe, forward slash
  sanitized = sanitized.replace(/[^\w\s,.\-#'/]/g, '');

  return sanitized.trim().slice(0, 500);
}

/**
 * Check if an input string is a plausible address format.
 * Requires minimum length, maximum length, and at least one comma separator.
 */
export function isPlausibleAddress(input) {
  if (typeof input !== 'string') return false;
  const trimmed = input.trim();
  if (trimmed.length < 5 || trimmed.length > 500) return false;
  if (!trimmed.includes(',')) return false;
  return true;
}

export const MAX_BATCH_SIZE = 100;

/**
 * Validate a CIDR notation string (e.g., "10.0.0.0/8" or "192.168.1.0/24").
 * Returns true if the CIDR is syntactically valid.
 */
export function isValidCIDR(input) {
  if (typeof input !== 'string') return false;
  const trimmed = input.trim();
  const cidrPattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  if (!cidrPattern.test(trimmed)) return false;

  const [ip, prefix] = trimmed.split('/');
  const prefixNum = parseInt(prefix, 10);
  if (prefixNum < 0 || prefixNum > 32) return false;

  const octets = ip.split('.');
  return octets.every((octet) => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * Validate a session timeout value in minutes.
 * Must be between 5 and 1440 minutes (1 day).
 */
export function isValidSessionTimeout(minutes) {
  const num = Number(minutes);
  return Number.isInteger(num) && num >= 5 && num <= 1440;
}

/**
 * Validate a URL string for API endpoint configuration.
 * Only allows http: and https: protocols.
 */
export function isValidEndpointUrl(input) {
  if (typeof input !== 'string') return false;
  const trimmed = input.trim();

  // Allow relative paths starting with /
  if (trimmed.startsWith('/')) return /^\/[\w\-./]*$/.test(trimmed);

  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Simple rate limiter for client-side API call throttling.
 * Tracks calls within a sliding time window.
 */
export function createRateLimiter(maxCalls, windowMs) {
  const calls = [];

  return {
    /**
     * Returns true if the action is allowed, false if rate-limited.
     */
    tryAcquire() {
      const now = Date.now();
      // Remove expired entries
      while (calls.length > 0 && calls[0] <= now - windowMs) {
        calls.shift();
      }
      if (calls.length >= maxCalls) return false;
      calls.push(now);
      return true;
    },

    /**
     * Returns the number of milliseconds until the next call is allowed,
     * or 0 if a call is allowed now.
     */
    getRetryAfterMs() {
      const now = Date.now();
      while (calls.length > 0 && calls[0] <= now - windowMs) {
        calls.shift();
      }
      if (calls.length < maxCalls) return 0;
      return calls[0] + windowMs - now;
    },

    /**
     * Reset the rate limiter state.
     */
    reset() {
      calls.length = 0;
    },
  };
}
