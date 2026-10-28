/**
 * Centralized API configuration.
 *
 * Import `API_BASE_URL` from here everywhere instead of redefining it.
 * Priority: VITE_API_URL env var → production URL → localhost dev.
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://lanceport.onrender.com"
    : "http://localhost:5000");
