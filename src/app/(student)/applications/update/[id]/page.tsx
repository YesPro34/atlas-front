"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Application } from "@/app/lib/type";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import CityRankingForm from "@/components/ApplicationComp/CityRankingForm";
import FiliereRankingForm from "@/components/ApplicationComp/FiliereRankingForm";
import Toast from "@/components/Toast";
import { use } from "react";

export default function UpdateApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/applications/${resolvedParams.id}`);
      if (!res.ok) throw new Error("Failed to fetch application");
      const data = await res.json();
      setApplication(data);
    } catch (error) {
      console.error("Error fetching application:", error);
      setToast({
        message: "Erreur lors du chargement de la candidature",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (choices: any[]) => {
    try {
      const res = await authFetch(`${BACKEND_URL}/applications/${resolvedParams.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choices }),
      });

      if (!res.ok) throw new Error("Failed to update application");

      setToast({
        message: "Candidature mise à jour avec succès",
        type: "success",
      });

      // Redirect back to applications list after a short delay
      setTimeout(() => {
        router.push("/applications");
      }, 1500);
    } catch (error) {
      console.error("Error updating application:", error);
      setToast({
        message: "Erreur lors de la mise à jour de la candidature",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    router.push("/applications");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-500">
            Candidature non trouvée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier la candidature - {application.school.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Modifiez vos choix pour cette école
          </p>
        </div>

        <div className="p-6">
          {application.school.type.requiresCityRanking ? (
            <CityRankingForm
              school={application.school}
              maxCities={application.school.type.maxCities || 0}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialChoices={application.choices}
            />
          ) : (
            <FiliereRankingForm
              school={application.school}
              maxFilieres={application.school.type.maxFilieres || 0}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialChoices={application.choices}
            />
          )}
        </div>
      </div>
    </div>
  );
} 