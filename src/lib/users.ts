import { currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export interface DbUser {
  id: string;
  email: string;
  clerk_id: string;
  subscription_status: "free" | "vip" | "churned";
}

const USER_COLUMNS = "id, email, clerk_id, subscription_status";

/**
 * Fetch the Supabase `users` row for the signed-in Clerk user, creating it on
 * first sight. There is no Clerk->Supabase webhook, so this lazy upsert is the
 * only thing keeping the two stores in sync — every route that gates on
 * subscription_status must resolve the user through it. It also guarantees a
 * row (keyed by email) exists before Paystack checkout, which is how the
 * payment webhook finds the buyer to grant VIP.
 *
 * Returns null only when there is no usable Clerk identity (not signed in, or
 * an account with no email address).
 */
export async function ensureUser(clerkId: string): Promise<DbUser | null> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("users")
    .select(USER_COLUMNS)
    .eq("clerk_id", clerkId)
    .single();
  if (existing) return existing as DbUser;

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;
  if (!clerkUser || clerkUser.id !== clerkId || !email) return null;

  const { data: inserted, error } = await supabase
    .from("users")
    .insert({ clerk_id: clerkId, email, subscription_status: "free" })
    .select(USER_COLUMNS)
    .single();
  if (inserted) return inserted as DbUser;

  // Unique violation: either this email already has a row under an old/deleted
  // Clerk account (re-attach it to the new clerk_id, preserving any VIP status)
  // or a concurrent request just inserted the same clerk_id (re-read wins).
  if (error?.code === "23505") {
    const { data: reattached } = await supabase
      .from("users")
      .update({ clerk_id: clerkId })
      .eq("email", email)
      .select(USER_COLUMNS)
      .single();
    if (reattached) return reattached as DbUser;

    const { data: raced } = await supabase
      .from("users")
      .select(USER_COLUMNS)
      .eq("clerk_id", clerkId)
      .single();
    if (raced) return raced as DbUser;
  }

  console.error("ensureUser: failed to sync Clerk user into Supabase", error);
  return null;
}
