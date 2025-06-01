"use client"
import { useEffect, useState } from "react";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { Application } from "@/app/lib/type";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";

interface PaginatedResponse {
  data: Application[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, pageSize]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch(
        `${BACKEND_URL}/applications/paginated?page=${currentPage}&perPage=${pageSize}`
      );
      
      if (!res.ok) throw new Error("Failed to fetch applications");
      
      const data: PaginatedResponse = await res.json();
      
      if (!data || !data.data) {
        throw new Error("Invalid response format");
      }

      setApplications(data.data);
      setTotalItems(data.meta.total);
      setCurrentPage(data.meta.currentPage);
      setTotalPages(data.meta.lastPage);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setToast({
        message: "Erreur lors du chargement de vos candidatures",
        type: "error",
      });
      setApplications([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REGISTERED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "REGISTERED":
        return "Inscrit";
      default:
        return status;
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded-md ${
            currentPage === i
              ? "bg-[#0ab99d] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ab99d]`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-4">
            Lignes par page:{" "}
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="ml-1 border-gray-300 rounded-md focus:outline-none focus:ring-[#0ab99d] focus:border-[#0ab99d]"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </span>
          <span className="text-sm text-gray-700">
            {totalItems === 0 
              ? "0 résultats" 
              : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalItems)} sur ${totalItems} résultats`
            }
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ««
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            «
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            »
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            »»
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0ab99d] to-[#0a8b76] text-white py-12 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-4">Mes Candidatures</h1>
            <p className="text-lg opacity-90">
              Suivez et gérez vos candidatures aux écoles
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 -mt-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0ab99d] to-[#0a8b76] text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Mes Candidatures</h1>
          <p className="text-lg opacity-90">
            Suivez et gérez vos candidatures aux écoles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="bg-white rounded-lg shadow-md">
          {!applications || applications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Aucune candidature
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore soumis de candidature aux écoles.
              </p>
              <button
                onClick={() => router.push('/home')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0ab99d] hover:bg-[#0aa183] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ab99d]"
              >
                Parcourir les écoles
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        École
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Choix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de candidature
                      </th> 
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application, index) => (
                      <tr
                        key={application.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 w-1/4">
                          <div className="text-sm font-medium text-gray-900">
                            {((currentPage - 1) * pageSize) + index + 1}. {application.school.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {application.choices.map((choice, index) => (
                              <div key={index} className="mb-1 flex items-center">
                                <span className="w-6 h-6 flex items-center justify-center bg-[#0ab99d] text-white rounded-full text-xs font-medium mr-2">
                                  {index + 1}
                                </span>
                                {choice.type === "CITY" 
                                  ? choice.city?.name
                                  : choice.filiere?.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.applicationDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(
                              application.status
                            )}`}
                          >
                            {getStatusText(application.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {application.status === "PENDING" && (
                            <button
                              onClick={() => router.push(`/schools/${application.school.id}/apply?applicationId=${application.id}`)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#0ab99d] hover:bg-[#0aa183] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ab99d]"
                            >
                              Modifier
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 