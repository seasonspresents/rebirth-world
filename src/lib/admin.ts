import { createClient } from "@/lib/supabase/server";

/**
 * Get the list of admin user IDs from environment variable
 */
function getAdminUserIds(): string[] {
  const ids = process.env.ADMIN_USER_IDS;
  if (!ids) return [];
  return ids.split(",").map((id) => id.trim()).filter(Boolean);
}

/**
 * Get the current user if they are an admin.
 * Returns the user object if admin, null otherwise.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (!getAdminUserIds().includes(user.id)) return null;

  return user;
}

/**
 * Require admin access for API routes.
 * Returns { admin } on success or { error, status } on failure.
 */
export async function requireAdmin() {
  const admin = await getAdminUser();

  if (!admin) {
    return {
      admin: null,
      error: "Unauthorized",
      status: 403 as const,
    };
  }

  return { admin, error: null, status: 200 as const };
}
