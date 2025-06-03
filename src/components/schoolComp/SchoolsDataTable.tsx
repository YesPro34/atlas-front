"use client";

import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { School, SchoolType } from "@/app/lib/type";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../DeleteModal";
import Toast from "../Toast";
import CreateSchool from "./CreateSchool";
import UpdateSchool from "./UpdateSchool";
import ImportModal from "../ImportModal";

// Create a minimal school type for unknown types
const unknownSchoolType: Partial<SchoolType> = {
  id: 'unknown',
  name: 'Type inconnu',
  code: 'UNKNOWN',
  requiresCityRanking: false,
  allowMultipleFilieresSelection: false
};

export default function SchoolsDataTable({ title }: { title: string }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<SchoolType[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItemId, setselectedItemId] = useState<string | null>(null);
  const [selectedItemName, setselectedItemName] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      // Fetch all schools
      const schoolsRes = await authFetch(
        `${BACKEND_URL}/school`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      // Fetch school types
      const typesRes = await authFetch(`${BACKEND_URL}/school-type`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!schoolsRes.ok || !typesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const schoolsData = await schoolsRes.json();
      const typesData = await typesRes.json();

      // Map school types to schools
      const schoolsWithTypes = (Array.isArray(schoolsData) ? schoolsData : []).map((school: School) => ({
        ...school,
        type: typesData.find((type: SchoolType) => type.id === school.type?.id) || unknownSchoolType
      }));

      setAllSchools(schoolsWithTypes);
      setSchoolTypes(typesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const filteredSchools = allSchools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.type?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchools = filteredSchools.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async () => {
    if (!selectedItemId) return;
    
    try {
      const res = await authFetch(`${BACKEND_URL}/school/${selectedItemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to delete");
      setShowDeleteModal(false);
      fetchSchools();
      showToast('École supprimée avec succès', 'success');
    } catch (error) {
      console.error("Error deleting school:", error);
      showToast("Échec de la suppression de l'école", 'error');
    } finally {
      setselectedItemId(null);
    }
  };

  const handleEdit = (school: School) => {
    setSelectedSchool(school);
    setShowUpdateModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-md">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-xl shadow-md">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCreate}
            className="p-2 bg-[#06b89d] text-white rounded-lg font-bold"
          >
            Ajouter
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="p-2 bg-[#06b89d] text-white rounded-lg font-bold"
          >
            Importer
          </button>
          <input
            type="text"
            placeholder="Rechercher une école..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSchools.map((school) => (
              <tr key={school.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{school.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {school.type?.code || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    school.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {school.isOpen ? 'OUVERT' : 'FERMÉ'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleEdit(school)}
                    className="text-gray-400 hover:text-gray-800 mx-2"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button 
                    onClick={() => {
                      setselectedItemId(school.id);
                      setShowDeleteModal(true);
                      setselectedItemName(school.name);
                    }}
                    className="text-gray-400 hover:text-gray-800 mx-2"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </p>
          <div>
            <button
              className="px-3 py-1 mx-1 bg-gray-100 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <button
              className="px-3 py-1 mx-1 bg-gray-100 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSchool
          onClose={() => setShowCreateModal(false)}
          onCreate={(school) => {
            setShowCreateModal(false);
            fetchSchools();
            showToast('École créée avec succès', 'success');
          }}
          onNotification={showToast}
        />
      )}

      {showUpdateModal && selectedSchool && (
        <UpdateSchool
          onClose={() => setShowUpdateModal(false)}
          onUpdate={(school) => {
            setShowUpdateModal(false);
            fetchSchools();
            showToast('École mise à jour avec succès', 'success');
          }}
          onNotification={showToast}
          school={selectedSchool}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          studentName={selectedItemName}
        />
      )}

      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={(message) => {
            showToast(message, 'success');
            fetchSchools();
          }}
          onError={(message) => showToast(message, 'error')}
          endpoint="/school/import"
          title="Importer des écoles"
        />
      )}
    </div>
  );
}
