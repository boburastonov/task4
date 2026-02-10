/**
 * IMPORTANT: Generate unique ID value
 * NOTE: Required by task specification
 * NOTE: Creates unique identifiers for items
 */

export function getUniqIdValue(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Alternative implementation using crypto API (more secure)
 */
export function getUniqIdValueSecure(): string {
  if (typeof window !== "undefined" && window.crypto) {
    return `${Date.now()}-${window.crypto.randomUUID()}`;
  }
  return getUniqIdValue();
}
