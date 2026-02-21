/**
 * Client-side admin check.
 * Uses NEXT_PUBLIC_ADMIN_USER_IDS env var for UI rendering decisions.
 * Server-side authorization still happens in API routes via lib/admin.ts.
 */
export function isClientAdmin(userId: string | undefined): boolean {
  if (!userId) return false;
  const ids = process.env.NEXT_PUBLIC_ADMIN_USER_IDS;
  if (!ids) return false;
  return ids
    .split(",")
    .map((id) => id.trim())
    .includes(userId);
}
