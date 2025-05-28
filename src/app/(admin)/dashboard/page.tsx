import { getSession } from "@/app/lib/session";
import Dashboard from "@/components/DashboardClient"; // note: renamed to DashboardClient
import React from "react";

export default async function DashboardPage() {
  const session = await getSession();

  return <Dashboard session={session} />;
}