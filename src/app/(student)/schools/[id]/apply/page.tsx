"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { getSession } from "@/app/lib/session";
import Toast from "@/components/Toast";
import type { School as ImportedSchool } from "@/app/lib/type";

interface BacOption {
  id: string;
  name: string;
}

interface Filiere {
  id: string;
  name: string;
  bacOptionsAllowed: BacOption[];
}

interface ExtendedSchool extends ImportedSchool {
  filieres?: Filiere[];
  cities?: { id: string; name: string; }[];
}

interface UserSession {
  user?: {
    bacOption?: BacOption;
  };
}

// Add these types to match backend DTO
type ChoiceType = 'CITY' | 'FILIERE';

interface ApplicationChoiceDto {
  rank: number;
  cityId?: string;
  filiereId?: string;
  type: ChoiceType;
}

export default function SchoolApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<ExtendedSchool | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [rankedChoices, setRankedChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userBacOption, setUserBacOption] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserBacOption();
    fetchSchool();
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    fetchUser();

    // Check if we're updating an existing application
    const searchParams = new URLSearchParams(window.location.search);
    const applicationId = searchParams.get('applicationId');
    if (applicationId) {
      fetchExistingApplication(applicationId);
    }
  }, []);

  const fetchUserBacOption = async () => {
    try {
      const session = await getSession();
      const bacOption = session?.user?.bacOption;
      
      if (!bacOption) {
        showToast("Votre type de Bac n'est pas défini", "error");
        return;
      }

      // Handle both string and object bacOption formats
      if (typeof bacOption === 'object' && 'name' in bacOption) {
        setUserBacOption((bacOption as BacOption).name);
      } else {
        setUserBacOption(bacOption as string);
      }
    } catch (error) {
      console.error("Error fetching user bac option:", error);
      showToast("Erreur lors de la récupération de votre type de Bac", "error");
    }
  };

  const fetchSchool = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/school/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch school");
      const data = await res.json();
      setSchool(data);
    } catch (error) {
      console.error("Error fetching school:", error);
      showToast("Échec du chargement de l'école", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExistingApplication = async (applicationId: string) => {
    try {
      const res = await authFetch(`${BACKEND_URL}/applications/${applicationId}`);
      if (!res.ok) throw new Error("Failed to fetch application");
      const data = await res.json();
      
      // Set the selected choices based on existing application
      const choices = data.choices
        .sort((a: any, b: any) => a.rank - b.rank)
        .map((choice: any) => choice.type === 'CITY' ? choice.cityId : choice.filiereId);
      
      setSelectedChoices(choices);
      setRankedChoices(choices);
    } catch (error) {
      console.error("Error fetching application:", error);
      showToast("Erreur lors du chargement de la candidature", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleChoiceSelect = (id: string, checked: boolean) => {
    if (checked) {
      const schoolCode = school?.type?.code;
      
      // Handle IFMIAC and IFMBTP schools
      if (schoolCode === 'IFMIAC' || schoolCode === 'IFMBTP') {
        if (selectedChoices.length >= 3) {
          showToast(
            `Pour ${schoolCode}, vous ne pouvez pas sélectionner plus de 3 filières`,
            "error"
          );
          return;
        }
      }
      // Handle IFMSAS schools
      else if (schoolCode?.includes('IFMSAS')) {
        if (selectedChoices.length >= 3) {
          showToast(
            "Pour les écoles IFMSAS, vous devez sélectionner exactement 3 filières différentes",
            "error"
          );
          return;
        }
        if (selectedChoices.includes(id)) {
          showToast(
            "Pour les écoles IFMSAS, vous ne pouvez pas sélectionner la même filière plusieurs fois",
            "error"
          );
          return;
        }
      }
      // Handle FMDP school
      else if (schoolCode === 'FMDP') {
        if (selectedChoices.length >= 3) {
          showToast(
            "Pour FMDP, vous devez sélectionner exactement 3 filières différentes",
            "error"
          );
          return;
        }
        if (selectedChoices.includes(id)) {
          showToast(
            "Pour FMDP, vous ne pouvez pas sélectionner la même filière plusieurs fois",
            "error"
          );
          return;
        }
      }
      // Handle other schools with maxChoices
      else if (!isCityRanking && maxChoices && selectedChoices.length >= maxChoices && !schoolCode?.includes('IFMSAS')) {
        showToast(
          `Vous ne pouvez pas sélectionner plus de ${maxChoices} filière${maxChoices > 1 ? 's' : ''}`,
          "error"
        );
        return;
      }
      
      setSelectedChoices([...selectedChoices, id]);
      setRankedChoices([...rankedChoices, id]);
    } else {
      setSelectedChoices(prev => prev.filter(choiceId => choiceId !== id));
      setRankedChoices(prev => prev.filter(choiceId => choiceId !== id));
    }
  };

  const moveChoice = (id: string, direction: 'up' | 'down') => {
    const currentIndex = rankedChoices.indexOf(id);
    if (currentIndex === -1) return;

    const newRankedChoices = [...rankedChoices];
    if (direction === 'up' && currentIndex > 0) {
      [newRankedChoices[currentIndex - 1], newRankedChoices[currentIndex]] = 
      [newRankedChoices[currentIndex], newRankedChoices[currentIndex - 1]];
    } else if (direction === 'down' && currentIndex < rankedChoices.length - 1) {
      [newRankedChoices[currentIndex], newRankedChoices[currentIndex + 1]] = 
      [newRankedChoices[currentIndex + 1], newRankedChoices[currentIndex]];
    }
    setRankedChoices(newRankedChoices);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">École non trouvée</div>
      </div>
    );
  }

  if (!userBacOption) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Impossible de déterminer votre type de Bac. Veuillez contacter l'administration.
        </div>
      </div>
    );
  }

  const isCityRanking = school.type?.requiresCityRanking;
  const maxChoices = isCityRanking 
    ? school.type?.maxCities || 0 
    : school?.type?.code?.includes('IFMSAS')
      ? 3  // Force maxChoices to 3 for all IFMSAS schools
      : school.type?.maxFilieres || 0;
  
  // Filter filières based on user's bac option
  const filteredFilieres = school.filieres?.filter(filiere => 
    filiere.bacOptionsAllowed?.some((option: BacOption) => option.name === userBacOption)
  );
  
  const choicesList = isCityRanking ? school.cities : filteredFilieres;
  const choiceType = isCityRanking ? "villes" : "filières";

  // If no filières are available for the user's bac option
  if (!isCityRanking && (!filteredFilieres || filteredFilieres.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Postuler à {school.name}
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800">
              <strong>Désolé :</strong> Aucune filière n'est disponible pour votre type de Bac ({userBacOption}).
              Les filières de cette école ne sont pas compatibles avec votre profil.
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getSchoolInstructions = () => {
    if (isCityRanking) {
      return `Pour cette école, vous devez sélectionner exactement ${maxChoices} villes et les classer par ordre de préférence.`;
    }

    const schoolCode = school?.type?.code;
    
    if (schoolCode?.includes('IFMSAS')) {
      return "Pour cette école, vous devez sélectionner exactement 3 filières différentes et les classer par ordre de préférence.";
    } else if (schoolCode === 'ISMALA') {
      const userBacOption = user?.bacOption?.name;
      const isManagementBac = ['ECO', 'SGC'].includes(userBacOption || '');
      
      if (isManagementBac) {
        return "Pour les bacheliers ECO et SGC, vous devez sélectionner la filière Logistique Aéroportuaire qui sera répétée 3 fois dans votre candidature.";
      } else {
        return "Pour cette école, vous devez sélectionner jusqu'à 3 filières différentes et les classer par ordre de préférence.";
      }
    } else if (schoolCode === 'FMDP') {
      return "Pour cette école, vous devez sélectionner exactement 3 filières différentes et les classer par ordre de préférence.";
    } else if (schoolCode === 'IMS') {
      return "Pour cette école, vous devez sélectionner jusqu'à 2 filières différentes et les classer par ordre de préférence.";
    } else if (schoolCode === 'IFMBTP') {
      return "Pour cette école, vous devez sélectionner jusqu'à 3 filières (possibilité de répéter la même filière) et les classer par ordre de préférence.";
    } else if (schoolCode === 'CPGE') {
      const userBacOption = user?.bacOption?.name;
      const isManagementBac = ['ECO', 'SGC'].includes(userBacOption || '');
      
      if (isManagementBac) {
        return "Pour les bacheliers ECO et SGC, vous devez sélectionner uniquement la filière ECT.";
      } else {
        return "Pour les bacheliers scientifiques, vous devez sélectionner et classer toutes les filières disponibles par ordre de préférence (sauf ECT).";
      }
    } else if (schoolCode?.includes('IFMIA')) {
      return "Pour cette école, vous avez deux options :\n" +
             "1. Sélectionner une seule filière - elle sera automatiquement répétée 3 fois dans votre candidature.\n" +
             "2. Sélectionner jusqu'à 3 filières et les classer par ordre de préférence.";
    } else {
      return "Pour cette école, vous ne pouvez choisir qu'une seule filière.";
    }
  };

  const validateChoices = () => {
    if (isCityRanking) {
      if (selectedChoices.length !== maxChoices) {
        showToast(
          `Vous devez sélectionner exactement ${maxChoices} villes`,
          "error"
        );
        return false;
      }
    } else {
      const schoolCode = school?.type?.code;
      const userBacOption = user?.bacOption?.name;
      
      // Validate IFMSAS schools
      if (schoolCode?.includes('IFMSAS')) {
        if (selectedChoices.length !== 3) {
          showToast(
            "Pour les écoles IFMSAS, vous devez sélectionner exactement 3 filières différentes",
            "error"
          );
          return false;
        }
        const uniqueChoices = new Set(selectedChoices);
        if (uniqueChoices.size !== 3) {
          showToast(
            "Pour les écoles IFMSAS, vous devez sélectionner 3 filières différentes",
            "error"
          );
          return false;
        }
        return true;
      }

      // Validate FMPD school
      if (schoolCode === 'FMPD') {
        if (selectedChoices.length !== 3) {
          showToast(
            "Pour FMPD, vous devez sélectionner exactement 3 filières différentes",
            "error"
          );
          return false;
        }
        const uniqueChoices = new Set(selectedChoices);
        if (uniqueChoices.size !== 3) {
          showToast(
            "Pour FMPD, vous devez sélectionner 3 filières différentes",
            "error"
          );
          return false;
        }
        return true;
      }
      
      // Validate IFMIAC and IFMBTP schools
      if (schoolCode === 'IFMIAC' || schoolCode === 'IFMBTP') {
        if (selectedChoices.length === 0 || selectedChoices.length > 3) {
          showToast(
            `Pour ${schoolCode}, vous devez sélectionner entre 1 et 3 filières`,
            "error"
          );
          return false;
        }
      }
      // Validate ISMALA school
      else if (schoolCode === 'ISMALA') {
        const isManagementBac = ['ECO', 'SGC'].includes(userBacOption || '');
        
        if (isManagementBac) {
          // Management bac students must select Logistique Aéroportuaire
          if (selectedChoices.length !== 3) {
            showToast(
              "Pour les bacheliers ECO et SGC d'ISMALA, vous devez sélectionner la filière Logistique Aéroportuaire exactement 3 fois",
              "error"
            );
            return false;
          }
        } else {
          // Other students can select 1 to 3 different filières
          if (selectedChoices.length === 0 || selectedChoices.length > 3) {
            showToast(
              "Pour ISMALA, vous devez sélectionner entre 1 et 3 filières différentes",
              "error"
            );
            return false;
          }
          const uniqueChoices = new Set(selectedChoices);
          if (uniqueChoices.size !== selectedChoices.length) {
            showToast(
              "Pour ISMALA, vous devez sélectionner des filières différentes",
              "error"
            );
            return false;
          }
        }
      }
      // Validate FMDP school
      else if (schoolCode === 'FMDP') {
        if (selectedChoices.length !== 3) {
          showToast(
            "Pour FMDP, vous devez sélectionner exactement 3 filières différentes",
            "error"
          );
          return false;
        }
        const uniqueChoices = new Set(selectedChoices);
        if (uniqueChoices.size !== 3) {
          showToast(
            "Pour FMDP, vous devez sélectionner 3 filières différentes",
            "error"
          );
          return false;
        }
      }
      // Validate IMS school
      else if (schoolCode === 'IMS') {
        if (selectedChoices.length === 0 || selectedChoices.length > 2) {
          showToast(
            "Pour IMS, vous devez sélectionner 1 ou 2 filières différentes",
            "error"
          );
          return false;
        }
        const uniqueChoices = new Set(selectedChoices);
        if (uniqueChoices.size !== selectedChoices.length) {
          showToast(
            "Pour IMS, vous devez sélectionner des filières différentes",
            "error"
          );
          return false;
        }
      }
      // Validate IFMBTP school
      else if (schoolCode === 'IFMBTP') {
        if (selectedChoices.length === 0 || selectedChoices.length > 3) {
          showToast(
            "Pour IFMBTP, vous devez sélectionner entre 1 et 3 filières",
            "error"
          );
          return false;
        }
      }
      // Validate CPGE school
      else if (schoolCode === 'CPGE') {
        const isManagementBac = ['ECO', 'SGC'].includes(userBacOption || '');
        
        if (isManagementBac) {
          if (selectedChoices.length !== 1) {
            showToast(
              "Pour les bacheliers ECO et SGC de CPGE, vous devez sélectionner uniquement la filière ECT",
              "error"
            );
            return false;
          }
          const selectedFiliere = school?.filieres?.find(f => f.id === selectedChoices[0]);
          if (!selectedFiliere?.name.toLowerCase().includes('ect')) {
            showToast(
              "Pour les bacheliers ECO et SGC de CPGE, vous devez sélectionner uniquement la filière ECT",
              "error"
            );
            return false;
          }
        } else {
          // For scientific bac students (PC, SVT, SMA, SMB)
          const availableFilieres = school?.filieres?.filter(f => 
            !f.name.toLowerCase().includes('ect')
          ) || [];
          
          if (selectedChoices.length !== availableFilieres.length) {
            showToast(
              `Pour les bacheliers scientifiques de CPGE, vous devez sélectionner et classer les ${availableFilieres.length} filières disponibles (sauf ECT)`,
              "error"
            );
            return false;
          }

          // Check if any selected filière is ECT
          const hasEctFiliere = selectedChoices.some(id => 
            school?.filieres?.find(f => f.id === id)?.name.toLowerCase().includes('ect')
          );

          if (hasEctFiliere) {
            showToast(
              "Les bacheliers scientifiques ne peuvent pas sélectionner la filière ECT",
              "error"
            );
            return false;
          }

          const uniqueChoices = new Set(selectedChoices);
          if (uniqueChoices.size !== selectedChoices.length) {
            showToast(
              "Pour CPGE, vous devez sélectionner des filières différentes",
              "error"
            );
            return false;
          }
        }
      }
      // Validate IFMIA schools
      else if (schoolCode?.includes('IFMIA')) {
        if (selectedChoices.length !== 1 && selectedChoices.length !== 3) {
          showToast(
            "Pour les écoles IFMIA, vous devez soit sélectionner une seule filière (qui sera répétée 3 fois), soit exactement 3 filières",
            "error"
          );
          return false;
        }
      }
      // Validate other schools
      else if (selectedChoices.length !== 1) {
        showToast(
          "Vous devez sélectionner exactement une filière",
          "error"
        );
        return false;
      }
    }
    return true;
  };

  const isValidSelection = isCityRanking 
    ? selectedChoices.length === maxChoices
    : school?.type?.code?.includes('IFMSAS')
      ? selectedChoices.length === 3 && new Set(selectedChoices).size === 3 // Exactly 3 different filières for IFMSAS
      : school?.type?.code === 'IFMIAC' || school?.type?.code === 'IFMBTP'
        ? selectedChoices.length >= 1 && selectedChoices.length <= 3 // 1 to 3 filières for IFMIAC and IFMBTP, allowing duplicates
      : school?.type?.code?.includes('IFMIA')
        ? selectedChoices.length === 1 || selectedChoices.length === 3 // Either 1 or exactly 3 filières for IFMIA
        : school?.type?.code === 'CPGE'
          ? ['ECO', 'SGC'].includes(user?.bacOption?.name || '')
            ? selectedChoices.length === 1 && school.filieres?.find(f => selectedChoices[0] === f.id)?.name.toLowerCase().includes('ect')
            : selectedChoices.length === (school.filieres || []).filter(f => !f.name.toLowerCase().includes('ect')).length
        : school?.type?.code === 'IMS'
          ? (selectedChoices.length === 1 || selectedChoices.length === 2) && new Set(selectedChoices).size === selectedChoices.length // 1 or 2 different filières for IMS
        : school?.type?.code === 'ISMALA'
          ? (selectedChoices.length >= 1 && selectedChoices.length <= 3) && new Set(selectedChoices).size === selectedChoices.length // 1 to 3 different filières for ISMALA
        : school?.type?.code === 'FMPD'
          ? selectedChoices.length === 3 && new Set(selectedChoices).size === 3 // Exactly 3 different filières for FMPD
        : selectedChoices.length === 1; // Default case: exactly 1 filière

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateChoices()) {
      return;
    }

    try {
      const session = await getSession();
      if (!session?.user?.id) {
        showToast("Session invalide", "error");
        return;
      }

      // Initialize formattedChoices with empty array
      let formattedChoices: ApplicationChoiceDto[] = [];

      // Format choices based on school type
      if (school?.type?.code === 'IFMIAK') {
        if (selectedChoices.length === 1) {
          // For IFMIAK with single choice, repeat it 3 times
          const singleChoice = selectedChoices[0];
          formattedChoices = [1, 2, 3].map(rank => ({
            rank,
            filiereId: singleChoice,
            type: 'FILIERE' as ChoiceType
          }));
        } else if (selectedChoices.length === 2) {
          // For IFMIAK with two choices, repeat the first choice twice
          formattedChoices = [
            { rank: 1, filiereId: selectedChoices[0], type: 'FILIERE' as ChoiceType },
            { rank: 2, filiereId: selectedChoices[0], type: 'FILIERE' as ChoiceType },
            { rank: 3, filiereId: selectedChoices[1], type: 'FILIERE' as ChoiceType }
          ];
        }
      } else if (school?.type?.code?.includes('IFMIA') && selectedChoices.length === 1) {
        // For other IFMIA schools with single choice, repeat it 3 times
        const singleChoice = selectedChoices[0];
        formattedChoices = [1, 2, 3].map(rank => ({
          rank,
          filiereId: singleChoice,
          type: 'FILIERE' as ChoiceType
        }));
      } else {
        formattedChoices = rankedChoices.map((id, index) => {
          const rank = index + 1;
          if (isCityRanking) {
            return {
              rank,
              cityId: id,
              type: 'CITY' as ChoiceType
            };
          } else {
            return {
              rank,
              filiereId: id,
              type: 'FILIERE' as ChoiceType
            };
          }
        });
      }

      // Check if we're updating an existing application
      const searchParams = new URLSearchParams(window.location.search);
      const applicationId = searchParams.get('applicationId');

      const endpoint = applicationId 
        ? `${BACKEND_URL}/applications/${applicationId}/update`
        : `${BACKEND_URL}/applications`;

      const method = applicationId ? "PATCH" : "POST";
      const body = applicationId 
        ? { choices: formattedChoices }
        : {
            schoolId: params.id,
            userId: session.user.id,
            choices: formattedChoices
          };

      const res = await authFetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        showToast(data.message || "Une erreur est survenue lors de la soumission de votre candidature", "error");
        return;
      }
      
      const successMessage = applicationId
        ? "Votre candidature a été mise à jour avec succès! Vous allez être redirigé vers la page des candidatures."
        : "Votre candidature a été soumise avec succès! Vous allez être redirigé vers la page d'accueil.";

      showToast(successMessage, "success");
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push(applicationId ? "/applications" : "/home");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      showToast(
        "Une erreur inattendue est survenue. Veuillez réessayer plus tard.", 
        "error"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Postuler à {school?.name}
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-800">
            <strong>Instructions : </strong>
            {getSchoolInstructions()}
          </p>
          <p className="text-blue-800 mt-2">
            Sélections actuelles : {selectedChoices.length}/
            {school?.type?.code === 'CPGE' 
              ? ['ECO', 'SGC'].includes(user?.bacOption?.name || '')
                ? 1  // For ECO/SGC students, only ECT
                : (school.filieres || []).filter(f => !f.name.toLowerCase().includes('ect')).length  // For scientific students, all except ECT
              : school?.type?.code?.startsWith('IFMSAS') 
                ? 3 
                : maxChoices}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isCityRanking 
                ? `Sélectionnez et classez ${maxChoices} villes par ordre de préférence` 
                : school?.type?.code?.includes('IFMSAS')
                  ? "Sélectionnez et classez exactement 3 filières différentes par ordre de préférence"
                  : school?.type?.code === 'ISMALA' && ['ECO', 'SGC'].includes(user?.bacOption?.name || '')
                    ? "Sélectionnez la filière Logistique Aéroportuaire"
                    : school?.type?.code === 'ISMALA'
                      ? "Sélectionnez et classez jusqu'à 3 filières différentes par ordre de préférence"
                      : school?.type?.code === 'FMPD'
                        ? "Sélectionnez et classez exactement 3 filières différentes par ordre de préférence"
                        : school?.type?.code === 'IMS'
                          ? "Sélectionnez et classez jusqu'à 2 filières différentes par ordre de préférence"
                          : school?.type?.code === 'IFMBTP'
                            ? "Sélectionnez et classez jusqu'à 3 filières par ordre de préférence"
                            : school?.type?.code === 'CPGE' && ['ECO', 'SGC'].includes(user?.bacOption?.name || '')
                              ? "Sélectionnez la filière ECT"
                              : school?.type?.code === 'CPGE'
                                ? "Sélectionnez et classez toutes les filières disponibles par ordre de préférence"
                                : school?.type?.code?.includes('IFMIA')
                                  ? "Sélectionnez une filière ou jusqu'à 3 filières à classer par ordre de préférence"
                                  : "Sélectionnez une filière"}
            </h2>

            {maxChoices > 0 && !school?.type?.code?.startsWith('IFMSAS') && (
              <p className="text-gray-600 mb-4">
                {isCityRanking 
                  ? `Vous devez sélectionner exactement ${maxChoices} ${choiceType}.`
                  : `Vous pouvez sélectionner jusqu'à ${maxChoices} ${choiceType}${['ISMALA', 'FMPD', 'IMS', 'IFMBTP', 'CPGE'].includes(school?.type?.code || '') || school?.type?.code?.includes('IFMIA') ? ' et les classer par ordre de préférence' : ''}.`}
              </p>
            )}

            {isCityRanking && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <p className="text-blue-800">
                  <strong>Important :</strong> Pour cette école, vous devez sélectionner exactement {maxChoices} villes 
                  et les classer par ordre de préférence. Votre candidature ne pourra pas être soumise tant que vous 
                  n'aurez pas sélectionné et classé {maxChoices} villes.
                </p>
                <p className="text-blue-800 mt-2">
                  Sélections actuelles : {selectedChoices.length}/{maxChoices}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Selection Panel */}
              <div className="space-y-3 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4 text-lg">Sélection des {choiceType}</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {choicesList?.map((choice) => (
                    <div key={choice.id} 
                      className="flex items-center bg-white border border-gray-200 p-4 rounded-md hover:border-[#0ab99d] transition-colors">
                      <input
                        type="checkbox"
                        id={choice.id}
                        className="form-checkbox h-5 w-5 text-[#0ab99d]"
                        checked={selectedChoices.includes(choice.id)}
                        onChange={(e) => handleChoiceSelect(choice.id, e.target.checked)}
                      />
                      <label htmlFor={choice.id} className="ml-3 text-gray-700 flex-grow cursor-pointer">
                        {choice.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranking Panel */}
              {(isCityRanking || 
                school?.type?.code === 'FMPD' ||  // Changed from FMDP to FMPD
                ['ISMALA', 'IMS', 'IFMBTP', 'CPGE'].includes(school?.type?.code || '') || 
                (school?.type?.code || '').includes('IFMIA') || 
                (school?.type?.code || '').includes('IFMSAS')) && (
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                  <h3 className="font-medium text-gray-700 mb-4 text-lg">
                    {isCityRanking ? "Ordre de préférence des villes" : "Ordre de préférence des filières"}
                  </h3>
                  {selectedChoices.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Sélectionnez des {choiceType} pour les classer
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {rankedChoices.map((id, index) => {
                        const choice = choicesList?.find(c => c.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-md">
                            <div className="flex items-center">
                              <span className="w-8 h-8 flex items-center justify-center bg-[#0ab99d] text-white rounded-full text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="ml-3 text-gray-700">{choice?.name}</span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => moveChoice(id, 'up')}
                                disabled={index === 0}
                                className="p-2 text-black hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-100"
                                title="Monter"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveChoice(id, 'down')}
                                disabled={index === rankedChoices.length - 1}
                                className="p-2 text-black hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-100"
                                title="Descendre"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isValidSelection}
              className="px-6 py-2 bg-[#0ab99d] text-white rounded-md hover:bg-[#099881] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {school?.type?.code?.startsWith('IFMSAS') && selectedChoices.length !== 3
                ? `Sélectionnez ${3 - selectedChoices.length} filière${3 - selectedChoices.length > 1 ? 's' : ''} de plus`
                : isCityRanking && selectedChoices.length !== maxChoices
                  ? `Sélectionnez ${maxChoices - selectedChoices.length} ville${maxChoices - selectedChoices.length > 1 ? 's' : ''} de plus`
                  : 'Soumettre la candidature'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 