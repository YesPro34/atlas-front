// components/LogInButtonServer.tsx
import { getSession } from "@/app/lib/session";
import LogInButtonClient from "./LogInButtonClient";

const LogInButtonServer = async () => {
  const session = await getSession();

  return <LogInButtonClient session={session} />;
};

export default LogInButtonServer;