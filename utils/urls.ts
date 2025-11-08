/**
 * Utility functions for building URLs consistently across the application.
 * Supports both server-side and client-side usage.
 */

/**
 * Get the base URL of the application.
 * - On Vercel: Uses VERCEL_URL with https:// protocol
 * - On localhost: Uses http://localhost:3000
 * - Custom URL: Set NEXT_PUBLIC_APP_URL env variable for other deployments
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use the current domain
    return window.location.origin;
  }

  // Server-side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  return "http://localhost:3000";
}

/**
 * Build a full URL path
 * @param path - The path to append (e.g., "/protected", "/api/callback")
 * @returns Full URL (e.g., "https://example.com/protected")
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
