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
      <div>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0ab99d] to-[#0a8b76] text-white py-12 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-4">Écoles disponibles</h1>
            <p className="text-lg opacity-90">
              Découvrez les écoles qui correspondent à votre profil
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 -mt-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0ab99d] to-[#0a8b76] text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Écoles disponibles</h1>
          <p className="text-lg opacity-90">
            Découvrez les écoles qui correspondent à votre profil
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-6">
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
        
        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Aucune école disponible
                </h3>
                <p className="text-gray-600">
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
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Les écoles affichées sont basées sur votre type de Bac. Pour plus d'informations, contactez l'administration.
          </p>
        </div>
      </div>
    </div>
  );
}