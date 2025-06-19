"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filiere, School, BacOption } from "@/app/lib/type";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Toast from "@/components/Toast";

interface CreateFiliereDto {
  name: string;
  schoolId: string;
  bacOptionIds: string[];
}

interface UpdateFiliereDto {
  name: string;
  schoolId: string;
  bacOptionIds: string[];
}

export default function FilieresTable() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [bacOptions, setBacOptions] = useState<BacOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFiliere, setNewFiliere] = useState<CreateFiliereDto>({
    name: "",
    schoolId: "",
    bacOptionIds: [],
  });
  const [editingData, setEditingData] = useState<UpdateFiliereDto>({
    name: "",
    schoolId: "",
    bacOptionIds: [],
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    Promise.all([
      fetchFilieres(),
      fetchSchools(),
      fetchBacOptions(),
    ]);
  }, []);

  const fetchFilieres = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/filiere`);
      if (!res.ok) throw new Error("Failed to fetch filieres");
      const data = await res.json();
      setFilieres(data);
    } catch (error) {
      console.error("Error fetching filieres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/school`);
      if (!res.ok) throw new Error("Failed to fetch schools");
      const data = await res.json();
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchBacOptions = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/bac-option`);
      if (!res.ok) throw new Error("Failed to fetch bac options");
      const data = await res.json();
      setBacOptions(data);
    } catch (error) {
      console.error("Error fetching bac options:", error);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleAdd = async () => {
    if (!newFiliere.name.trim() || !newFiliere.schoolId) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/filiere`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFiliere),
      });

      if (!res.ok) {
        const error = await res.json();
        showToast(error.message || "Erreur lors de l'ajout de la filière", "error");
        return;
      }

      await fetchFilieres();
      showToast("Filière ajoutée avec succès", "success");
      setNewFiliere({
        name: "",
        schoolId: "",
        bacOptionIds: [],
      });
    } catch (error) {
      console.error("Error adding filiere:", error);
      showToast("Erreur lors de l'ajout de la filière", "error");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingData.name.trim() || !editingData.schoolId) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/filiere/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingData),
      });
      if (!res.ok) {
        const error = await res.json();
        showToast(error.message || "Erreur lors de la mise à jour de la filière", "error");
        return;
      }
      await fetchFilieres();
      showToast("Filière mise à jour avec succès", "success");
      setEditingId(null);
    } catch (error) {
      console.error("Error updating filiere:", error);
      showToast("Erreur lors de la mise à jour de la filière", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/filiere/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Erreur lors de la suppression de la filière", "error");
        return;
      }
      await fetchFilieres();
      showToast("Filière supprimée avec succès", "success");
    } catch (error) {
      console.error("Error deleting filiere:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFiliere({ ...newFiliere, name: e.target.value });
  };

  const handleSchoolChange = (value: string) => {
    setNewFiliere({ ...newFiliere, schoolId: value });
  };

  const handleBacOptionsChange = (value: string) => {
    const selectedIds = value.split(",").filter(Boolean);
    setNewFiliere({
      ...newFiliere,
      bacOptionIds: selectedIds,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingData({ ...editingData, name: e.target.value });
  };

  const handleEditSchoolChange = (value: string) => {
    setEditingData({ ...editingData, schoolId: value });
  };

  const handleEditBacOptionsChange = (value: string) => {
    const selectedIds = value.split(",").filter(Boolean);
    setEditingData({
      ...editingData,
      bacOptionIds: selectedIds,
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filieres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFilieres = filieres.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ab99d]"></div>
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex gap-4 mb-6">
        <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
          <Input
            placeholder="Nouvelle filière"
            value={newFiliere.name}
            onChange={handleInputChange}
          />
          <Select
            value={newFiliere.schoolId}
            onValueChange={handleSchoolChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une école" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={newFiliere.bacOptionIds.length > 0 ? "selected" : ""}
            onValueChange={() => {}}
          >
            <SelectTrigger>
              <SelectValue placeholder="Options du bac autorisées">
                {newFiliere.bacOptionIds.length > 0
                  ? `${newFiliere.bacOptionIds.length} option(s) sélectionnée(s)`
                  : "Sélectionner les options"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {bacOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2 px-2 py-1.5">
                  <input
                    type="checkbox"
                    checked={newFiliere.bacOptionIds.includes(option.id)}
                    className="h-4 w-4"
                    onChange={(e) => {
                      const updatedIds = e.target.checked
                        ? [...newFiliere.bacOptionIds, option.id]
                        : newFiliere.bacOptionIds.filter((id) => id !== option.id);
                      setNewFiliere({
                        ...newFiliere,
                        bacOptionIds: updatedIds,
                      });
                    }}
                  />
                  <span>{option.name}</span>
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Ajouter
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Éléments par page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 par page</SelectItem>
            <SelectItem value="10">10 par page</SelectItem>
            <SelectItem value="20">20 par page</SelectItem>
            <SelectItem value="50">50 par page</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages} ({filieres.length} filières au total)
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>École</TableHead>
            <TableHead>Options du Bac</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFilieres.map((filiere) => (
            <TableRow key={filiere.id}>
              <TableCell>
                {editingId === filiere.id ? (
                  <Input
                    value={editingData.name}
                    onChange={handleEditInputChange}
                  />
                ) : (
                  filiere.name
                )}
              </TableCell>
              <TableCell>
                {editingId === filiere.id ? (
                  <Select
                    value={editingData.schoolId}
                    onValueChange={handleEditSchoolChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une école" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  filiere.school?.name
                )}
              </TableCell>
              <TableCell>
                {editingId === filiere.id ? (
                  <Select
                    value={editingData.bacOptionIds.length > 0 ? "selected" : ""}
                    onValueChange={() => {}}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Options du bac autorisées">
                        {editingData.bacOptionIds.length > 0
                          ? `${editingData.bacOptionIds.length} option(s) sélectionnée(s)`
                          : "Sélectionner les options"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {bacOptions.map((option) => (
                        <div key={option.id} className="flex items-center gap-2 px-2 py-1.5">
                          <input
                            type="checkbox"
                            checked={editingData.bacOptionIds.includes(option.id)}
                            className="h-4 w-4"
                            onChange={(e) => {
                              const updatedIds = e.target.checked
                                ? [...editingData.bacOptionIds, option.id]
                                : editingData.bacOptionIds.filter((id) => id !== option.id);
                              setEditingData({
                                ...editingData,
                                bacOptionIds: updatedIds,
                              });
                            }}
                          />
                          <span>{option.name}</span>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  filiere.bacOptions
                    ?.map((option: BacOption) => option.name)
                    .join(", ")
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {editingId === filiere.id ? (
                    <>
                      <Button
                        onClick={() => handleUpdate(filiere.id)}
                        size="sm"
                        className="h-8"
                      >
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setEditingId(filiere.id);
                          setEditingData({
                            name: filiere.name,
                            schoolId: filiere.school?.id || "",
                            bacOptionIds: filiere.bacOptions?.map((opt: BacOption) => opt.id) || [],
                          });
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(filiere.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
            .map((page, index, array) => {
              if (index > 0 && array[index - 1] !== page - 1) {
                return [
                  <span key={`ellipsis-${page}`} className="px-2">...</span>,
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ];
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </Button>
        </div>
      )}
    </div>
  );
}