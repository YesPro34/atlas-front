"use client";

import { School, ApplicationChoice } from "@/app/lib/type";
import { useState, useEffect } from "react";

interface FiliereRankingFormProps {
  school: School;
  maxFilieres: number;
  onSubmit: (choices: any[]) => Promise<void>;
  onCancel: () => void;
  initialChoices?: ApplicationChoice[];
}

export default function FiliereRankingForm({
  school,
  maxFilieres,
  onSubmit,
  onCancel,
  initialChoices,
}: FiliereRankingFormProps) {
  const [selectedFilieres, setSelectedFilieres] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialChoices) {
      const filieres = initialChoices
        .filter(choice => choice.type === "FILIERE" && choice.filiere)
        .sort((a, b) => a.rank - b.rank)
        .map(choice => ({
          id: choice.filiereId!,
          name: choice.filiere!.name
        }));
      setSelectedFilieres(filieres);
    }
  }, [initialChoices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const choices = selectedFilieres.map((filiere, index) => ({
        rank: index + 1,
        filiereId: filiere.id,
        type: "FILIERE"
      }));
      
      await onSubmit(choices);
    } catch (error) {
      console.error("Error submitting filiere choices:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFiliereSelect = (filiereId: string, filiereName: string) => {
    if (selectedFilieres.some(filiere => filiere.id === filiereId)) {
      setSelectedFilieres(prev => prev.filter(filiere => filiere.id !== filiereId));
    } else if (selectedFilieres.length < maxFilieres) {
      setSelectedFilieres(prev => [...prev, { id: filiereId, name: filiereName }]);
    }
  };

  const moveFiliere = (index: number, direction: 'up' | 'down') => {
    const newFilieres = [...selectedFilieres];
    if (direction === 'up' && index > 0) {
      [newFilieres[index - 1], newFilieres[index]] = [newFilieres[index], newFilieres[index - 1]];
    } else if (direction === 'down' && index < selectedFilieres.length - 1) {
      [newFilieres[index], newFilieres[index + 1]] = [newFilieres[index + 1], newFilieres[index]];
    }
    setSelectedFilieres(newFilieres);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sélectionnez et classez vos filières préférées (max: {maxFilieres})
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {school.filieres?.map((filiere) => (
            <button
              key={filiere.id}
              type="button"
              onClick={() => handleFiliereSelect(filiere.id, filiere.name)}
              className={`p-2 text-sm rounded-md ${
                selectedFilieres.some(f => f.id === filiere.id)
                  ? "bg-[#0ab99d] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filiere.name}
            </button>
          ))}
        </div>
      </div>

      {selectedFilieres.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Ordre de préférence
          </h4>
          <div className="space-y-2">
            {selectedFilieres.map((filiere, index) => (
              <div
                key={filiere.id}
                className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-md"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center bg-[#0ab99d] text-white rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="ml-3 text-gray-700">{filiere.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveFiliere(index, 'up')}
                    disabled={index === 0}
                    className={`p-2 rounded-md ${
                      index === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFiliere(index, 'down')}
                    disabled={index === selectedFilieres.length - 1}
                    className={`p-2 rounded-md ${
                      index === selectedFilieres.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={selectedFilieres.length === 0 || isSubmitting}
          className={`px-4 py-2 rounded-md ${
            selectedFilieres.length === 0 || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#0ab99d] text-white hover:bg-[#0aa183]"
          }`}
        >
          {isSubmitting ? "Envoi en cours..." : "Soumettre"}
        </button>
      </div>
    </form>
  );
} 