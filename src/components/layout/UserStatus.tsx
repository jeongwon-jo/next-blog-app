"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import IconButton from "../ui/IconButton";

export default function UserStatus({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState(initialUser);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="pr-1 text-sm font-bold text-purple-700 lg:text-base">
        {user ? "JEONG1" : "Login"}
      </div>
      <IconButton
        Icon={user ? FiLogIn : FaRegUser}
        iconClassName={user ? "" : "!size-5"}
        component={Link}
        label="adminLink"
        href="/admin"
        className="text-fuchsia-400 hover:text-fuchsia-600"
      />
    </div>
  );
}
