"use client"
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { getSession } from "@/app/lib/session";
import { School } from "@/app/lib/type";
import { useEffect, useState } from "react";
import SchoolApplicationCard from "@/components/ApplicationComp/SchoolApplicationCard";
import Notification from "@/components/Notification";

export default function HomePage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchSchools = async () => {
    try {
      const session = await getSession();
      const bacOption = session?.user?.bacOption;
      
      if (!bacOption) {
        showNotification("Votre type de Bac n'est pas défini", "error");
        return;
      }

      const res = await authFetch(`${BACKEND_URL}/user/mySchools/${bacOption.name}`);
      if (!res.ok) throw new Error("Failed to fetch schools");
      const data = await res.json();
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      showNotification("Échec du chargement des écoles", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Écoles disponibles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <SchoolApplicationCard
            key={school.id}
            school={school}
          />
        ))}
      </div>
    </div>
  );
}