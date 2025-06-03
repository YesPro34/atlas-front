// components/DashboardClient.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/SideBar";
import AnalyticsCards from "@/components/AnalyticCard";
import LogInButtonClient from "@/components/LogInButtonClient"; // receives session
import { Session } from "@/app/lib/session";
import UsersDataTable from "./StudentComp/UsersDataTable";
import SchoolsDataTable from "@/components/schoolComp/SchoolsDataTable";
import ApplicationsDataTable from "@/components/ApplicationsComp/ApplicationsDataTable";
import GradesDataTable from "@/components/StudentComp/GradesDataTable";

export default function Dashboard({ session }: { session: Session | null }) {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    if (activePage === "Home") return <AnalyticsCards />;
    if (activePage === "Users") return <UsersDataTable session={session} title="Gestion des utilisateurs" />;
    if (activePage === "Schools") return <SchoolsDataTable session={session} title="Gestion des écoles" />;
    if (activePage === "Applications") return <ApplicationsDataTable title="Gestion des candidatures" />;
    if (activePage === "Grades") return <GradesDataTable session={session} title="Notes des étudiants" />;
    return null;
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Bienvenue Lahssan</h1>
          <LogInButtonClient session={session} />
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
