"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4">
      <div className="text-xl">E&N Support</div>
      <div className="flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-3">
            <img src={session.user?.image ?? "/default-avatar.png"} alt="Profile" width={40} height={40} />
            <span>{session.user?.email}</span>
            <Button onClick={() => signOut()}>Sign out</Button>
          </div>
        ) : (
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        )}
      </div>
    </header>
  );
}
