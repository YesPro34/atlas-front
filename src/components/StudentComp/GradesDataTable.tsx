"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { Session } from "@/app/lib/session";
import * as XLSX from 'xlsx';
import Toast from "@/components/Toast";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  bacOption: {
    name: string;
  };
  nationalMark: number | null;
  generalMark: number | null;
  mathMark: number | null;
  physicMark: number | null;
  svtMark: number | null;
  englishMark: number | null;
  philosophyMark: number | null;
  comptabilityMark: number | null;
  economyMark: number | null;
  managementMark: number | null;
}

export default function GradesDataTable({ session, title }: { session: Session | null; title: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isGradesFormEnabled, setIsGradesFormEnabled] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchGradesFormStatus();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await authFetch(`${BACKEND_URL}/user/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      console.log("Data", data);
      console.log
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGradesFormStatus = async () => {
    try {
      const response = await authFetch(`${BACKEND_URL}/settings/grades-form-access`);
      if (!response.ok) throw new Error('Failed to fetch grades form status');
      const enabled = await response.json();
      setIsGradesFormEnabled(enabled);
    } catch (error) {
      console.error('Error fetching grades form status:', error);
    }
  };

  const toggleGradesForm = async () => {
    try {
      const response = await authFetch(`${BACKEND_URL}/settings/grades-form-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !isGradesFormEnabled }),
      });

      if (!response.ok) throw new Error('Failed to update grades form access');
      
      setIsGradesFormEnabled(!isGradesFormEnabled);
      setToast({
        message: `Formulaire de notes ${!isGradesFormEnabled ? 'activé' : 'désactivé'} avec succès`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating grades form access:', error);
      setToast({
        message: 'Erreur lors de la mise à jour de l\'accès au formulaire',
        type: 'error'
      });
    }
  };

  const exportToExcel = () => {
    const exportData = students.map(student => {
      const isEcoOrSgc = student.bacOption?.name === 'ECO' || student.bacOption?.name === 'SGC';
      
      return {
        'Nom': student.firstName,
        'Prénom': student.lastName,
        'Option Bac': student.bacOption?.name || 'Non défini',
        'Note Nationale': student.nationalMark || '',
        'Note Générale': student.generalMark || '',
        'Note Math': student.mathMark || '',
        ...(isEcoOrSgc ? {
          'Note Comptabilité': student.comptabilityMark || '',
          'Note Économie': student.economyMark || '',
          'Note Management': student.managementMark || '',
        } : {
          'Note Physique': student.physicMark || '',
          'Note SVT': student.svtMark || '',
        }),
        'Note Anglais': student.englishMark || '',
        'Note Philosophie': student.philosophyMark || '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notes");
    XLSX.writeFile(wb, "notes_etudiants.xlsx");
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.bacOption?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={toggleGradesForm}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isGradesFormEnabled 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-[#0ab99d] hover:bg-[#0aa183]'
              }`}
            >
              {isGradesFormEnabled ? 'Désactiver le formulaire' : 'Activer le formulaire'}
            </button>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Rechercher..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ab99d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-[#0ab99d] text-white rounded-md hover:bg-[#0aa183] transition-colors"
            >
              Exporter Excel
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom Complet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Option Bac
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note Nationale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note Générale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note Math
              </th>
              {paginatedStudents.some(s => s.bacOption?.name === 'ECO' || s.bacOption?.name === 'SGC') ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note Comptabilité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note Économie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note Management
                  </th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note Physique
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note SVT
                  </th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note Anglais
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note Philosophie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStudents.map((student) => {
              const isEcoOrSgc = student.bacOption?.name === 'ECO' || student.bacOption?.name === 'SGC';
              
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.bacOption?.name || 'Non défini'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.nationalMark || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.generalMark || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.mathMark || '-'}
                  </td>
                  {isEcoOrSgc ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.comptabilityMark || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.economyMark || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.managementMark || '-'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.physicMark || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.svtMark || '-'}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.englishMark || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.philosophyMark || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-700">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(startIndex + itemsPerPage, filteredStudents.length)} sur{" "}
            {filteredStudents.length} résultats
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-[#0ab99d] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 