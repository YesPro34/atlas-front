"use client";

import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { useEffect, useState } from "react";
import UpdateStudent from "./UpdateStudent";
import Notification from "../Notification";
import { Student } from "@/app/lib/type";
import DeleteConfirmationModal from "../DeleteModal";
import CreateStudent from "./CreateStudent";


export default function UsersDataTable({ title }: { title: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const itemsPerPage = 10;
  // Delete modal sate
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // select item to delete state
  const [selectedItemId, setselectedItemId] = useState<string | null>(null);
  // select item name to delete state
  const [selectedItemName, setselectedItemName] = useState<string>("");
  // Notofication state
   const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // Add fetchStudents function
  const fetchStudents = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/user/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      showNotification("Échec du chargement des étudiants", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Notifications
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Modify handleDelete to:
  const handleDelete = async () => {
    if (!selectedItemId) return;
    
    try {
      const res = await authFetch(`${BACKEND_URL}/user/${selectedItemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to delete");
      setShowDeleteModal(false);
      setStudents(prev => prev.filter(student => student.id !== selectedItemId));
      setNotification({ message: 'Étudiant supprimé avec succès', type: 'success' });
    } catch (error) {
      console.error("Error deleting student:", error);
      setNotification({ message: "Échec de la suppression de l'étudiant", type: 'error' });
    } finally {
      setselectedItemId(null);
    }
  };
    // Edit student
    const handleEdit = (student: Student) => {
      setSelectedStudent(student);
      setShowUpdateModal(true);
    };
    // Create Student
    const handleCreate = () => {
      setShowCreateModal(true);
    };
  // Filter students by search term
  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.massarCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-3  rounded-xl shadow-md">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {/* Search bar */}
          <div className="flex items-center justify-center gap-4 w-full max-w-xs">
            <button
                onClick={handleCreate}
                className="p-2 bg-[#06b89d] text-white rounded-lg font-bold"
              >Ajoute
            </button>
            <input
            type="text"
            placeholder="Nom ou Code Massar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 when searching
            }}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3">Code Massar</th>
              <th className="px-6 py-3">Nom Complet</th>
              <th className="px-6 py-3">Option Bac</th>
              <th className="px-6 py-3">Ville</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{student.massarCode}</td>
                <td className="px-6 py-4">{student.firstName} {student.lastName}</td>
                <td className="px-6 py-4">{student.bacOption.name}</td>
                <td className="px-6 py-4">{student.city}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    student.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                  onClick={() => handleEdit(student)}
                  className="text-gray-400 hover:text-gray-800 mx-2">
                    <i className="fas fa-pen"></i>
                  </button>
                    <button 
                    onClick={() => {
                      setselectedItemId(student.id)
                      setShowDeleteModal(true)
                      setselectedItemName(`${student.firstName} ${student.lastName}`)
                    }}
                    className="text-gray-400 hover:text-gray-800 mx-2">
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
      {/* Create Modal */}
        {showCreateModal && (
        <CreateStudent
          onClose={() => setShowCreateModal(false)}
          onNotification={showNotification}
        />
      )}
      {/* Update Modal */}
        {showUpdateModal && selectedStudent && (
        <UpdateStudent
          student={selectedStudent}
          onNotification={showNotification}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={(updated) => {
            fetchStudents(); // Refresh the entire list after update
            setShowUpdateModal(false);
          }}
        />
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          studentName={selectedItemName}
        />
      )}
    </div>
  );
}
