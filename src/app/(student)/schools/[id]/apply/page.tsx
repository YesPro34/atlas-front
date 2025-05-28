"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { School } from "@/app/lib/type";
import { getSession } from "@/app/lib/session";
import Toast from "@/components/Toast";

interface BacOption {
  id: string;
  name: string;
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
  const [school, setSchool] = useState<School | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [rankedChoices, setRankedChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userBacOption, setUserBacOption] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchUserBacOption();
    fetchSchool();
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

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the session to get userId
      const session = await getSession();
      if (!session?.user?.id) {
        showToast("Session invalide", "error");
        return;
      }

      // Transform ranked choices into the correct DTO format
      const formattedChoices: ApplicationChoiceDto[] = rankedChoices.map((id, index) => {
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

      const res = await authFetch(`${BACKEND_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: params.id,
          userId: session.user.id,
          choices: formattedChoices
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        showToast(data.message || "Une erreur est survenue lors de la soumission de votre candidature", "error");
        return;
      }
      
      showToast("Votre candidature a été soumise avec succès! Vous allez être redirigé vers la page d'accueil.", "success");
      // Redirect to home page after successful submission
      setTimeout(() => {
        router.push("/home");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      showToast(
        "Une erreur inattendue est survenue. Veuillez réessayer plus tard.", 
        "error"
      );
    }
  };

  const handleChoiceSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedChoices([...selectedChoices, id]);
      setRankedChoices([...rankedChoices, id]);
    } else {
      setSelectedChoices(selectedChoices.filter(choiceId => choiceId !== id));
      setRankedChoices(rankedChoices.filter(choiceId => choiceId !== id));
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
    : school.type?.maxFilieres || 0;
  const allowMultipleSelection = isCityRanking ? true : school.type?.allowMultipleFilieresSelection;
  
  // Filter filières based on user's bac option
  const filteredFilieres = school.filieres?.filter(filiere => 
    filiere.bacOptionsAllowed?.some(option => option.name === userBacOption)
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

  const isValidSelection = isCityRanking 
    ? selectedChoices.length === maxChoices // Must select exactly maxChoices for cities
    : selectedChoices.length > 0 && (!maxChoices || selectedChoices.length <= maxChoices); // At least one, and respect max if set

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isCityRanking 
                ? `Sélectionnez et classez ${maxChoices} villes par ordre de préférence` 
                : "Sélectionnez et classez vos filières par ordre de préférence"}
            </h2>
            
            {!allowMultipleSelection && (
              <p className="text-gray-600 mb-4">
                Vous ne pouvez sélectionner qu'un seul choix.
              </p>
            )}
            
            {maxChoices > 0 && (
              <p className="text-gray-600 mb-4">
                {isCityRanking 
                  ? `Vous devez sélectionner exactement ${maxChoices} ${choiceType}.`
                  : `Vous pouvez sélectionner jusqu'à ${maxChoices} ${choiceType}.`}
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
                        type={allowMultipleSelection ? "checkbox" : "radio"}
                        id={choice.id}
                        name={allowMultipleSelection ? undefined : "choice"}
                        className={allowMultipleSelection ? "form-checkbox h-5 w-5 text-[#0ab99d]" : "form-radio h-5 w-5 text-[#0ab99d]"}
                        checked={selectedChoices.includes(choice.id)}
                        onChange={(e) => {
                          if (!allowMultipleSelection) {
                            setSelectedChoices([choice.id]);
                            setRankedChoices([choice.id]);
                          } else {
                            if (e.target.checked) {
                              if (isCityRanking && selectedChoices.length >= maxChoices) {
                                showToast(
                                  `Vous avez déjà sélectionné ${maxChoices} villes. Désélectionnez une ville avant d'en ajouter une nouvelle.`,
                                  "error"
                                );
                                return;
                              }
                              if (!isCityRanking && maxChoices && selectedChoices.length >= maxChoices) {
                                showToast(
                                  `Vous ne pouvez pas sélectionner plus de ${maxChoices} ${choiceType}`,
                                  "error"
                                );
                                return;
                              }
                            }
                            handleChoiceSelect(choice.id, e.target.checked);
                          }
                        }}
                      />
                      <label htmlFor={choice.id} className="ml-3 text-gray-700 flex-grow cursor-pointer">
                        {choice.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranking Panel */}
              {allowMultipleSelection && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-4 text-lg">Ordre de préférence</h3>
                  {selectedChoices.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Sélectionnez des {choiceType} pour les classer
                    </p>
                  ) : (
                    <div className="space-y-3">
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
              {isCityRanking && selectedChoices.length !== maxChoices
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