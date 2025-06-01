"use client";
import { useState, useEffect } from "react";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { Application, School } from "@/app/lib/type";
import Notification from "@/components/Notification";
import ExportButton from "./ExportButton";

export default function ApplicationsDataTable({ title }: { title: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const itemsPerPage = 3;

  useEffect(() => {
    fetchApplications();
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/school`);
      if (!res.ok) {
        throw new Error('Failed to fetch schools');
      }
      const data = await res.json();
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      showNotification("Erreur lors du chargement des écoles", "error");
    }
  };

  const fetchApplications = async () => {
    try {
      console.log("Fetching applications from:", `${BACKEND_URL}/applications`);
      const res = await authFetch(`${BACKEND_URL}/applications/all`);
      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch applications: ${res.status} ${res.statusText} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log("Applications data:", data);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      showNotification("Erreur lors du chargement des candidatures", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: "PENDING" | "REGISTERED") => {
    try {
      const res = await authFetch(`${BACKEND_URL}/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      showNotification("Statut mis à jour avec succès", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Erreur lors de la mise à jour du statut", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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

  // Filter applications based on search term
  const filteredApplications = applications.filter(
    (application) =>
      application.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-xl shadow-md">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06b89d]"
          />
          <ExportButton
            schools={schools}
            onError={(message) => showNotification(message, "error")}
            onSuccess={(message) => showNotification(message, "success")}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étudiant
              </th>
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
            {paginatedApplications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {application.user.firstName} {application.user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {application.user.bacOption?.name}
                  </div>
                </td>
                <td className="px-6 py-4  max-w-[200px]">
                  <div className="text-sm text-gray-900">{application.school.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <div className="overflow-x-auto max-w-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div className="flex gap-3 pb-2">
                        {application.choices.map((choice, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 flex flex-col items-center p-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-[120px]"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#0ab99d] text-white flex items-center justify-center text-sm font-medium mb-2">
                              {index + 1}
                            </div>
                            <div className="text-sm font-medium text-gray-800 text-center">
                              {choice.type === "CITY" ? choice.city?.name : choice.filiere?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {application.choices.length > 2 && (
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    )}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusUpdate(application.id, e.target.value as "PENDING" | "REGISTERED")}
                    className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#06b89d]"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="REGISTERED">Inscrit</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-3 py-1">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
} 