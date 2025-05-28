"use client";

import { School, ApplicationChoice } from "@/app/lib/type";
import { useState, useEffect } from "react";

interface CityRankingFormProps {
  school: School;
  maxCities: number;
  onSubmit: (choices: any[]) => Promise<void>;
  onCancel: () => void;
  initialChoices?: ApplicationChoice[];
}

export default function CityRankingForm({
  school,
  maxCities,
  onSubmit,
  onCancel,
  initialChoices,
}: CityRankingFormProps) {
  const [selectedCities, setSelectedCities] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialChoices) {
      const cities = initialChoices
        .filter(choice => choice.type === "CITY" && choice.city)
        .sort((a, b) => a.rank - b.rank)
        .map(choice => ({
          id: choice.cityId!,
          name: choice.city!.name
        }));
      setSelectedCities(cities);
    }
  }, [initialChoices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const choices = selectedCities.map((city, index) => ({
        rank: index + 1,
        cityId: city.id,
        type: "CITY"
      }));
      
      await onSubmit(choices);
    } catch (error) {
      console.error("Error submitting city choices:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitySelect = (cityId: string, cityName: string) => {
    if (selectedCities.some(city => city.id === cityId)) {
      setSelectedCities(prev => prev.filter(city => city.id !== cityId));
    } else if (selectedCities.length < maxCities) {
      setSelectedCities(prev => [...prev, { id: cityId, name: cityName }]);
    }
  };

  const moveCity = (index: number, direction: 'up' | 'down') => {
    const newCities = [...selectedCities];
    if (direction === 'up' && index > 0) {
      [newCities[index - 1], newCities[index]] = [newCities[index], newCities[index - 1]];
    } else if (direction === 'down' && index < selectedCities.length - 1) {
      [newCities[index], newCities[index + 1]] = [newCities[index + 1], newCities[index]];
    }
    setSelectedCities(newCities);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sélectionnez et classez vos villes préférées (max: {maxCities})
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {school.cities?.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleCitySelect(city.id, city.name)}
              className={`p-2 text-sm rounded-md ${
                selectedCities.some(c => c.id === city.id)
                  ? "bg-[#0ab99d] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Ordre de préférence
          </h4>
          <div className="space-y-2">
            {selectedCities.map((city, index) => (
              <div
                key={city.id}
                className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-md"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center bg-[#0ab99d] text-white rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="ml-3 text-gray-700">{city.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveCity(index, 'up')}
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
                    onClick={() => moveCity(index, 'down')}
                    disabled={index === selectedCities.length - 1}
                    className={`p-2 rounded-md ${
                      index === selectedCities.length - 1
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
          disabled={selectedCities.length === 0 || isSubmitting}
          className={`px-4 py-2 rounded-md ${
            selectedCities.length === 0 || isSubmitting
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