"use client"
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { BacOption, School, SchoolType } from "@/app/lib/type";
import { useEffect, useState } from "react";
import axios from "axios";

interface UpdateSchoolProps {
  school: School;
  onClose: () => void;
  onUpdate: (updatedSchool: School) => void;
  onNotification: (message: string, type: 'success' | 'error') => void;
}

export default function UpdateSchool({ school, onClose, onUpdate, onNotification }: UpdateSchoolProps) {
  const [schoolTypes, setSchoolTypes] = useState<SchoolType[]>([]);
  const [bacOptions, setBacOptions] = useState<BacOption[]>([]);
  const [form, setForm] = useState({
    name: school.name,
    typeId: (school as any).typeId || school.type?.id || '',
    isOpen: school.isOpen,
    bacOptionIds: (school as any).bacOptionsAllowed?.map((opt: any) => opt.id) || [],
    image: school.image || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    console.log("Hi");
    e.preventDefault();
    try {
      let res;
      if (imageFile) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', imageFile);
          res = await authFetch(`${BACKEND_URL}/school/upload-image/${school.id}`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error('Image upload failed');
          const data = await res.json();
          onNotification("École mise à jour avec succès", "success");
          onUpdate(data.school);
          setUploading(false);
          return;
        } catch (error) {
          onNotification('Erreur lors du téléchargement de l\'image', 'error');
          setUploading(false);
          return;
        }
      }

      // If no new image, just update other fields
      res = await authFetch(`${BACKEND_URL}/school/${school.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update school");

      const updatedSchool = await res.json();
      onNotification("École mise à jour avec succès", "success");
      onUpdate(updatedSchool);
    } catch (error) {
      console.error("Error updating school:", error);
      onNotification("Échec de la mise à jour de l'école", "error");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setForm(prev => ({ ...prev, image: '' })); // Clear image path until upload
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Modifier l'école</h2>
        
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Image de l'école</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
            />
            {(imageFile || form.image) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                alt="Aperçu de l'école"
                className="mt-2 rounded-md border h-24 object-cover"
              />
            )}
            {uploading && <p className="text-sm text-gray-500 mt-1">Téléchargement de l'image...</p>}
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
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
