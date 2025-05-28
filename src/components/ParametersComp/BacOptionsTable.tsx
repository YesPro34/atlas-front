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
import { BacOption } from "@/app/lib/type";
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

export default function BacOptionsTable() {
  const [bacOptions, setBacOptions] = useState<BacOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBacOption, setNewBacOption] = useState({ name: "" });
  const [editingName, setEditingName] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchBacOptions();
  }, []);

  const fetchBacOptions = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/bac-option`);
      if (!res.ok) throw new Error("Failed to fetch bac options");
      const data = await res.json();
      setBacOptions(data);
    } catch (error) {
      console.error("Error fetching bac options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleAdd = async () => {
    if (!newBacOption.name.trim()) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/bac-option`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBacOption),
      });
      if (!res.ok) {
        showToast("Erreur lors de l'ajout de l'option du bac", "error");
        return;
      }
      showToast("Option du bac ajoutée avec succès", "success");
      await fetchBacOptions();
      setNewBacOption({ name: "" });
    } catch (error) {
      console.error("Error adding bac option:", error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/bac-option/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editingName }),
      });
      if (!res.ok) {
        showToast("Erreur lors de la mise à jour de l'option du bac", "error");
        return;
      }
      showToast("Option du bac mise à jour avec succès", "success");
      await fetchBacOptions();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating bac option:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette option ?")) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/bac-option/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Erreur lors de la suppression de l'option du bac", "error");
        return;
      }
      showToast("Option du bac supprimée avec succès", "success");
      await fetchBacOptions();
    } catch (error) {
      console.error("Error deleting bac option:", error);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(bacOptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBacOptions = bacOptions.slice(startIndex, endIndex);

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
        <Input
          placeholder="Nouvelle option du bac"
          value={newBacOption.name}
          onChange={(e) => setNewBacOption({ name: e.target.value })}
          className="max-w-xs"
        />
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
          Page {currentPage} sur {totalPages} ({bacOptions.length} options au total)
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBacOptions.map((option) => (
            <TableRow key={option.id}>
              <TableCell>
                {editingId === option.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="max-w-xs"
                  />
                ) : (
                  option.name
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {editingId === option.id ? (
                    <>
                      <Button
                        onClick={() => handleUpdate(option.id)}
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
                          setEditingId(option.id);
                          setEditingName(option.name);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(option.id)}
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