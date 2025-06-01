"use client";

import { useEffect, useState } from 'react';
import { authFetch } from '@/app/lib/authFetch';
import { BACKEND_URL } from '@/app/lib/constants';
import Toast from '@/components/Toast';
import { getSession } from "@/app/lib/session";

interface Grades {
  nationalMark: number;
  generalMark: number;
  mathMark: number;
  physicMark: number;
  svtMark: number;
  englishMark: number;
  philosophyMark: number;
}

export default function NotesPage() {
  const [grades, setGrades] = useState<Grades>({
    nationalMark: 0,
    generalMark: 0,
    mathMark: 0,
    physicMark: 0,
    svtMark: 0,
    englishMark: 0,
    philosophyMark: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect( () => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const session = await getSession();
      if (!session?.user?.id) {
        setToast({
        message: "Session invalide. Veuillez vous reconnecter.",
        type: "error"
        });
        return;
    }

      const response = await authFetch(`${BACKEND_URL}/user/profile/${session.user.id}`);
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      console.log(data);
      setGrades({
        nationalMark: data.nationalMark ,
        generalMark: data.generalMark ,
        mathMark: data.mathMark ,
        physicMark: data.physicMark ,
        svtMark: data.svtMark ,
        englishMark: data.englishMark ,
        philosophyMark: data.philosophyMark ,
      });
    } catch (error) {
      console.error('Error fetching grades:', error);
      showToast('Erreur lors du chargement des notes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
            const session = await getSession();
    if (!session?.user?.id) {
        setToast({
        message: "Session invalide. Veuillez vous reconnecter.",
        type: "error"
        });
        return;
    }
      const response = await authFetch(`${BACKEND_URL}/user/update-grades/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grades),
      });

      if (!response.ok) throw new Error('Failed to update grades');
      
      showToast('Notes mises à jour avec succès', 'success');
    } catch (error) {
      console.error('Error updating grades:', error);
      showToast('Erreur lors de la mise à jour des notes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return;
    
    setGrades(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        
        <h1 className="text-2xl font-bold mb-6">Mes Notes du Baccalauréat</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Nationale
              </label>
              <input
                type="number"
                name="nationalMark"
                value={grades.nationalMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 15.75"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moyenne Générale
              </label>
              <input
                type="number"
                name="generalMark"
                value={grades.generalMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 16.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Mathématiques
              </label>
              <input
                type="number"
                name="mathMark"
                value={grades.mathMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 17.25"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Physique
              </label>
              <input
                type="number"
                name="physicMark"
                value={grades.physicMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 18.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note SVT
              </label>
              <input
                type="number"
                name="svtMark"
                value={grades.svtMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 16.75"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Anglais
              </label>
              <input
                type="number"
                name="englishMark"
                value={grades.englishMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 15.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Philosophie
              </label>
              <input
                type="number"
                name="philosophyMark"
                value={grades.philosophyMark}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 14.25"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#0ab99d] text-white rounded-md hover:bg-[#0aa183] disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 