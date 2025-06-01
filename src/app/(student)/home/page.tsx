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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#19154e] to-[#19154e]/90">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#18cb96] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19154e] to-[#19154e]/90">
      <div className="container mx-auto px-4 py-12">
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Écoles disponibles
          </h1>
          <p className="text-[#18cb96] text-lg max-w-2xl mx-auto">
            Découvrez les écoles qui correspondent à votre profil et postulez directement en ligne
          </p>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Aucune école disponible
                </h3>
                <p className="text-[#18cb96]">
                  Il n'y a actuellement aucune école disponible pour votre type de Bac.
                </p>
              </div>
            </div>
          ) : (
            schools.map((school) => (
              <SchoolApplicationCard
                key={school.id}
                school={school}
              />
            ))
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm">
            Les écoles affichées sont basées sur votre type de Bac. Pour plus d'informations, contactez l'administration.
          </p>
        </div>
      </div>
    </div>
  );
}