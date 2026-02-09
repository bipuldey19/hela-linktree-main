// Re-export from auth so existing getSession imports keep working.
export { auth as getSession } from "./auth";
export { requireAuth } from "./auth";
