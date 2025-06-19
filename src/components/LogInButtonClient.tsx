"use client"

import type { Session } from "@/app/lib/session";

const LogInButtonClient =  ({ session }: { session: Session | null }) => {
  return (
    <div className="bg-[#097c6b] px-4 py-2 rounded-lg text-white font-bold cursor-pointer ">
          <a href={"/api/auth/logout"}>Déconnexion</a>
    </div>
  );
};

export default LogInButtonClient;