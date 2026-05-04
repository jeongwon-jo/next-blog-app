import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";

type CookieStore = {
  getAll(): { name: string; value: string }[];
};

export const createClient = (
  cookies?: CookieStore,
  legacyCookies?: Partial<{ [key: string]: string }>,
) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          if (cookies) {
            return cookies.getAll().map((cookie) => ({
              name: cookie.name,
              value: legacyCookies?.[cookie.name] ?? cookie.value,
            }));
          }
          return Object.entries(legacyCookies ?? {}).map(([name, value]) => ({
            name,
            value: value ?? "",
          }));
        },
      },
    },
  );
};
