"use client";

import { useState } from 'react';
import { School } from '@/app/lib/type';
import { BACKEND_URL } from '@/app/lib/constants';
import { authFetch } from '@/app/lib/authFetch';

interface ExportButtonProps {
  schools: School[];
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export default function ExportButton({ schools, onError, onSuccess }: ExportButtonProps) {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedSchool) {
      onError('Veuillez sélectionner une école');
      return;
    }

    try {
      setIsExporting(true);
      const selectedSchoolObj = schools.find(s => s.id === selectedSchool);
      console.log('Selected school:', {
        id: selectedSchool,
        schoolObject: selectedSchoolObj,
        allSchools: schools.map(s => ({ id: s.id, name: s.name }))
      });
      
      const response = await authFetch(
        `${BACKEND_URL}/export/applications/school/${selectedSchool}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export error response:', errorText);
        throw new Error('Erreur lors de l\'exportation');
      }

      // Get the blob from the response
      const blob = await response.blob();
      console.log('Received blob:', blob.size, 'bytes');
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Get school name for the file
      const school = schools.find(s => s.id === selectedSchool);
      const schoolName = school ? school.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : selectedSchool;
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `applications_${schoolName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      onSuccess('Exportation réussie');
    } catch (error) {
      console.error('Export error:', error);
      onError('Erreur lors de l\'exportation');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedSchool}
        onChange={(e) => setSelectedSchool(e.target.value)}
        className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06b89d] text-sm"
      >
        <option value="">Sélectionner une école</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleExport}
        disabled={isExporting || !selectedSchool}
        className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${
          isExporting || !selectedSchool
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#0ab99d] hover:bg-[#06b89d]'
        }`}
      >
        {isExporting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Exportation...
          </div>
        ) : (
          'Exporter'
        )}
      </button>
    </div>
  );
} 