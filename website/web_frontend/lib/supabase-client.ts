'use client';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function insertDemoRequest(payload: Record<string, unknown>): Promise<{ error: string | null }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: 'Supabase is not configured.' };
  }
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/demo_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `Request failed (${res.status}): ${text}` };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' };
  }
}
