"use client"
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { bacOption, Student } from "@/app/lib/type";
import { useEffect, useState } from "react";

interface BacOption {
  id: string;
  name: string;
}

interface UpdateStudentProps {
  student: Student;
  onClose: () => void;
  onUpdate: (updatedStudent: Student) => void;
  onNotification: (message: string, type: 'success' | 'error') => void;
}

export default function UpdateStudent({
  student,
  onClose,
  onUpdate,
  onNotification,
}: UpdateStudentProps) {
  const [bacOptions, setBacOptions] = useState<BacOption[]>([]);
  const [form, setForm] = useState({
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    city: student.city || "",
    bacOptionId: student.bacOption?.id || "",
    status: student.status || "ACTIVE",
    nationalMark: student.nationalMark || 0,
    generalMark: student.generalMark || 0,
    mathMark: student.mathMark || 0,
    physicMark: student.physicMark || 0,
    svtMark: student.svtMark || 0,
    englishMark: student.englishMark || 0,
    philosophyMark: student.philosophyMark || 0,
    comptabilityMark: student.comptabilityMark || 0,
    economyMark: student.economyMark || 0,
    managementMark: student.managementMark || 0,
  });

  useEffect(() => {
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

    fetchBacOptions();
  }, [onNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    try {
      const res = await authFetch(`${BACKEND_URL}/user/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update student");

      const updatedStudent = await res.json();
      onNotification("Étudiant mis à jour avec succès", "success");
      onUpdate(updatedStudent);
    } catch (error) {
      console.error("Error updating student:", error);
      onNotification("Échec de la mise à jour de l'étudiant", "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("Mark") ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Modifier l'étudiant</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Option Bac
            </label>
            <select
              name="bacOptionId"
              value={form.bacOptionId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
            >
              <option value="">Sélectionner une option</option>
              {bacOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0ab99d] focus:ring-[#0ab99d]"
              required
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
