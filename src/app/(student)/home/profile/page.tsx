"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { getSession } from "@/app/lib/session";
import Toast from "@/components/Toast";

interface UserProfile {
  id: string;
  massarCode: string;
  firstName: string;
  lastName: string;
  status: string;
  bacOption: {
    name: string;
  };
  city: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const session = await getSession();
        if (!session?.user?.id) {
          setToast({
            message: "Session invalide. Veuillez vous reconnecter.",
            type: "error"
          });
          return;
        }

        const res = await authFetch(`${BACKEND_URL}/user/profile/${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setToast({
          message: "Erreur lors du chargement du profil",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading profile</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0ab99d] to-[#0a8b76] text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Mon Profil</h1>
          <p className="text-lg opacity-90">
            Gérez vos informations personnelles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Profile Content */}
            <div className="flex flex-col items-center gap-8">
              {/* Avatar Section */}
              <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-full border-4 border-[#0ab99d] shadow-lg">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="h-16 w-16 text-gray-400"
                />
              </div>

              {/* Information Section */}
              <div className="w-full space-y-6">
                <div className="space-y-4">
                  <InfoItem label="Nom Complet" value={`${profile.firstName} ${profile.lastName}`} />
                  <InfoItem label="Code Massar" value={profile.massarCode} />
                  <InfoItem label="Option Bac" value={profile.bacOption?.name || 'Non défini'} />
                  <InfoItem label="Ville" value={profile.city || 'Non définie'} />
                  <InfoItem label="Statut" value={profile.status === 'ACTIVE' ? 'Actif' : 'Inactif'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
} 