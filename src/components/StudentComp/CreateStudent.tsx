"use client";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { Role, Student } from "@/app/lib/type";
import { useEffect, useState } from "react";

interface BacOption {
  id: string;
  name: string;
}

interface BacOptionDto {
  name: string;
}

interface CreateStudentForm {
  id?: string;
  massarCode?: string;
  password: string;
  role?: Role;
  status?: "ACTIVE" | "INACTIVE";
  firstName?: string;
  lastName?: string;
  bacOptionId?: string;
  city?: string;
  nationalMark?: number;
  generalMark?: number;
  mathMark?: number;
  physicMark?: number;
  svtMark?: number;
  englishMark?: number;
  philosophyMark?: number;
  comptabilityMark?: number;
  economyMark?: number;
  managementMark?: number;
}

export default function CreateStudent({
  onClose,
  onNotification,
}: {
  onClose: () => void;
  onNotification: (message: string, type: 'success' | 'error') => void;
}) {
  const [bacOptions, setBacOptions] = useState<BacOption[]>([]);
  const [form, setForm] = useState<CreateStudentForm>({
    firstName: "",
    lastName: "",
    massarCode: "",
    bacOptionId: undefined,
    city: "",
    status: "ACTIVE",
    role: "STUDENT",
    password: "",
    nationalMark: 0,
    generalMark: 0,
    mathMark: 0,
    physicMark: 0,
    svtMark: 0,
    englishMark: 0,
    philosophyMark: 0,
    comptabilityMark: 0,
    economyMark: 0,
    managementMark: 0,
  });

  useEffect(() => {
    generatePassword();
    fetchBacOptions();
  }, []);

  const fetchBacOptions = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/bac-option`);
      if (!res.ok) throw new Error("Failed to fetch bac options");
      const data = await res.json();
      setBacOptions(data);
    } catch (error) {
      console.error("Error fetching bac options:", error);
      onNotification("Échec du chargement des options de bac", "error");
    }
  };

  // Generate random password:
  const generatePassword = () => {
    // Générer 3 lettres majuscules aléatoires
    const uppercase = Array.from({ length: 3 }, () => 
      String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    );

    // Générer 3 lettres minuscules aléatoires
    const lowercase = Array.from({ length: 3 }, () => 
      String.fromCharCode(Math.floor(Math.random() * 26) + 97)
    );

    // Générer 2 chiffres aléatoires
    const numbers = Array.from({ length: 2 }, () => 
      String.fromCharCode(Math.floor(Math.random() * 10) + 48)
    );

    // Combiner et mélanger
    const allChars = [...uppercase, ...lowercase, ...numbers];
    
    // Mélanger le tableau avec l'algorithme Fisher-Yates
    for (let i = allChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
    }
    const newPassword = allChars.join('');
    setForm(prev => ({
      ...prev,
      password: newPassword
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "bacOption") {
      const selectedOption = bacOptions.find(opt => opt.name === value);
      if (selectedOption) {
        setForm(prev => ({
          ...prev,
          bacOptionId: selectedOption.id
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
      };

      console.log(formData);

      const res = await authFetch(`${BACKEND_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur lors de la création");
      }
      onNotification("Étudiant ajouté avec succès", "success");
      onClose();
    } catch (error) {
      onNotification("Échec de l'ajout de l'étudiant", "error");
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg md:w-1/2 py-10 px-12">
        <h2 className="text-xl font-semibold mb-6">Créer un étudiant</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Code Massar</label>
            <input
              type="text"
              name="massarCode"
              value={form.massarCode || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Option de BAC</label>
            <select
              name="bacOption"
              value={bacOptions.find(opt => opt.id === form.bacOptionId)?.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            >
              <option value="">Sélectionner une option</option>
              {bacOptions.map((opt) => (
                <option key={opt.id} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Ville</label>
            <input
              type="text"
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="text"
              name="password"
              value={form.password || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#0ab99d] rounded hover:bg-[#0aa183]"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}