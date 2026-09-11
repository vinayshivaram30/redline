"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase/auth";

export default function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    await signOut();
    router.push("/login");
  }

  return (
    <button onClick={handleClick} className="text-sm underline">
      Log out
    </button>
  );
}
