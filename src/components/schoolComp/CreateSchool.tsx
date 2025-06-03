"use client";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { BacOption, School, SchoolType } from "@/app/lib/type";
import { useEffect, useState } from "react";

interface CreateSchoolProps {
  onClose: () => void;
  onCreate: (school: School) => void;
  onNotification: (message: string, type: 'success' | 'error') => void;
}

export default function CreateSchool({ onClose, onCreate, onNotification }: CreateSchoolProps) {
  const [schoolTypes, setSchoolTypes] = useState<SchoolType[]>([]);
  const [bacOptions, setBacOptions] = useState<BacOption[]>([]);
  const [form, setForm] = useState({
    name: "",
    typeId: "",
    isOpen: false,
    bacOptionIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch school types
        const typesRes = await authFetch(`${BACKEND_URL}/school-type`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Fetch bac options
        const bacRes = await authFetch(`${BACKEND_URL}/bac-option`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!typesRes.ok || !bacRes.ok) {
          throw new Error("Failed to fetch required data");
        }

        const typesData = await typesRes.json();
        const bacData = await bacRes.json();

        setSchoolTypes(typesData);
        setBacOptions(bacData);
      } catch (error) {
        console.error("Error fetching data:", error);
        onNotification("Erreur lors du chargement des données", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${BACKEND_URL}/school`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create school");

      const newSchool = await res.json();
      onNotification("École créée avec succès", "success");
      onCreate(newSchool);
    } catch (error) {
      console.error("Error creating school:", error);
      onNotification("Échec de la création de l'école", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const { multiple, selectedOptions } = e.target as HTMLSelectElement;

    let newValue: any;

    if (name === "bacOptionIds" && multiple) {
      newValue = Array.from(selectedOptions).map(option => option.value);
    } else if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else {
      newValue = value;
    }

    setForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Ajouter une école</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type d'école</label>
            <select
              name="typeId"
              value={form.typeId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
              required
            >
              <option value="">Sélectionner un type</option>
              {schoolTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Options Bac autorisées</label>
            <select
              name="bacOptionIds"
              multiple
              value={form.bacOptionIds}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
              required
            >
              {bacOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs options
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isOpen"
              checked={form.isOpen}
              onChange={handleChange}
              className="h-4 w-4 text-[#0ab99d] focus:ring-[#0ab99d] border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              École ouverte aux candidatures
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0ab99d] text-white rounded-md hover:bg-[#0aa183]"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}