import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { School, SchoolType } from "@/app/lib/type";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../DeleteModal";
import Notification from "../Notification";
import CreateSchool from "./CreateSchool";
import UpdateSchool from "./UpdateSchool";

// Create a minimal school type for unknown types
const unknownSchoolType: SchoolType = {
  id: 'unknown',
  name: 'Type inconnu',
  code: 'UNKNOWN',
  requiresCityRanking: false,
  allowMultipleFilieresSelection: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default function SchoolsDataTable({ title }: { title: string }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 7;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allSchools, setAllSchools] = useState<School[]>([]); // Store all schools
  const [schoolTypes, setSchoolTypes] = useState<SchoolType[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItemId, setselectedItemId] = useState<string | null>(null);
  const [selectedItemName, setselectedItemName] = useState<string>("");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
        type: typesData.find((type: SchoolType) => type.id === school.typeId) || unknownSchoolType
      }));

      setAllSchools(schoolsWithTypes);
      setSchoolTypes(typesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Erreur lors du chargement des données", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch schools only once when component mounts
  useEffect(() => {
    fetchSchools();
  }, []);

  // Filter and paginate schools based on search term
  const filteredSchools = allSchools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.type?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalFilteredItems = filteredSchools.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
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
      // Refresh all schools after deletion
      fetchSchools();
      showNotification('École supprimée avec succès', 'success');
    } catch (error) {
      console.error("Error deleting school:", error);
      showNotification("Échec de la suppression de l'école", 'error');
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
          <button
            onClick={handleCreate}
            className="bg-[#0ab99d] text-white px-4 py-2 rounded-lg hover:bg-[#0aa183] transition-colors"
          >
            Ajouter une école
          </button>
        </div>

        {/* Search */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchools.map((school) => (
                <tr key={school.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {school.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {school.type?.name || 'Type inconnu'}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold ${
                        school.isOpen
                          ? "text-green-900 bg-green-200"
                          : "text-red-900 bg-red-200"
                      } rounded-full`}
                    >
                      {school.isOpen ? "Ouvert" : "Fermé"}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(school)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          setselectedItemId(school.id);
                          setselectedItemName(school.name);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#0ab99d] text-white hover:bg-[#0aa183]"
              }`}
            >
              Précédent
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#0ab99d] text-white hover:bg-[#0aa183]"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={() => {
            setShowDeleteModal(false);
            setselectedItemId(null);
          }}
          onConfirm={handleDelete}
          studentName={selectedItemName}
        />
      )}

      {showUpdateModal && selectedSchool && (
        <UpdateSchool
          school={selectedSchool}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedSchool(null);
          }}
          onUpdate={(updatedSchool) => {
            // Refresh all schools after update
            fetchSchools();
            setShowUpdateModal(false);
            setSelectedSchool(null);
          }}
          onNotification={showNotification}
        />
      )}

      {showCreateModal && (
        <CreateSchool
          onClose={() => setShowCreateModal(false)}
          onCreate={(newSchool) => {
            // Refresh all schools after creation
            fetchSchools();
            setShowCreateModal(false);
          }}
          onNotification={showNotification}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
    </div>
  );
}
