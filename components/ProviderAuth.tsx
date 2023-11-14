"use client";

import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";

export default function ProviderAuth({ provider }: { provider: Provider }) {
  const supabase = createClient();
  async function signInWithProvider() {
    supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }
  
  return <button onClick={signInWithProvider}>Sign In With {provider}</button>;
}
