import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key || url === "your-supabase-url") {
        // Return a stub that rejects gracefully
        return (..._args: unknown[]) => ({
          data: null,
          error: { message: "Supabase not configured" },
          then: (resolve: (v: { data: null; error: { message: string } }) => void) =>
            resolve({ data: null, error: { message: "Supabase not configured" } }),
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "Supabase not configured" },
                }),
              order: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "Supabase not configured" },
                }),
            }),
            order: () =>
              Promise.resolve({
                data: null,
                error: { message: "Supabase not configured" },
              }),
          }),
        });
      }
      _client = createClient(url, key);
    }
    return (_client as unknown as Record<string, unknown>)[prop as string];
  },
});
