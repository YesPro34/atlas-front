"use client";

import { useState } from 'react';
import { authFetch } from '@/app/lib/authFetch';
import { BACKEND_URL } from '@/app/lib/constants';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  endpoint: string;
  title: string;
}

export default function ImportModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  endpoint,
  title
}: ImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx')) {
        onError('Veuillez sélectionner un fichier Excel (.xlsx)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      onError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await authFetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'importation');
      }

      const result = await response.json();
      
      // Check if there were any errors in the import
      const hasErrors = result.summary.some((item: any) => item.status === 'Error');
      
      if (hasErrors) {
        const errorMessage = 'Certaines entrées n\'ont pas pu être importées. Vérifiez le format du fichier.';
        onError(errorMessage);
      } else {
        onSuccess('Importation réussie');
        onClose();
      }
    } catch (error) {
      console.error('Import error:', error);
      onError('Erreur lors de l\'importation');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un fichier Excel (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0ab99d] file:text-white hover:file:bg-[#0aa183]"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              disabled={isUploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0ab99d] text-white rounded-md hover:bg-[#0aa183] disabled:opacity-50"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Importation...' : 'Importer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 